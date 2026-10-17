/**
 * TRANSLATOR SERVICE — Integração com Google Tradutor API
 * Suporte a tradução instantânea de trechos, parágrafos, capítulos inteiros e modo bilíngue.
 */

export interface SupportedLanguage {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷', nativeName: 'Português' },
  { code: 'en', name: 'Inglês', flag: '🇬🇧', nativeName: 'English' },
  { code: 'es', name: 'Espanhol', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', name: 'Francês', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'Alemão', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'ru', name: 'Russo', flag: '🇷🇺', nativeName: 'Русский' },
];

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  engine: 'google-translate' | 'cache' | 'offline';
}

// Chave para cache local de traduções
const CACHE_PREFIX = 'eterno_trans_cache_';

const getCacheKey = (text: string, targetLang: string, sourceLang: string): string => {
  // Hash simples de 32 bits para a chave de cache
  let hash = 0;
  const str = `${sourceLang}_${targetLang}_${text}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `${CACHE_PREFIX}${hash}`;
};

/**
 * Traduz um bloco individual de texto usando a API do Google Tradutor
 */
export async function translateText(
  text: string,
  targetLang: string = 'pt',
  sourceLang: string = 'auto'
): Promise<TranslationResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      originalText: text,
      translatedText: text,
      sourceLang,
      targetLang,
      engine: 'cache',
    };
  }

  // 1. Consulta o cache local para velocidade instantânea
  const cacheKey = getCacheKey(trimmed, targetLang, sourceLang);
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      return {
        ...parsed,
        engine: 'cache',
      };
    } catch {
      // continua para a rede
    }
  }

  // 2. Se o texto for longo (> 1500 chars), divide em sentenças para evitar limites de URL
  if (trimmed.length > 1500) {
    return translateLongText(trimmed, targetLang, sourceLang);
  }

  // 3. Tenta primeiramente a rota proxy segura do servidor (/api/translate)
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, targetLang, sourceLang }),
    });

    if (res.ok) {
      const data = await res.json();
      const result: TranslationResult = {
        originalText: trimmed,
        translatedText: data.translatedText || trimmed,
        sourceLang: data.detectedLang || sourceLang,
        targetLang,
        engine: 'google-translate',
      };
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch {
        // quota excedida, ignora
      }
      return result;
    }
  } catch {
    // Falha silenciosa do proxy, fallback para chamada direta do cliente
  }

  // 4. Fallback direto para o endpoint do Google Tradutor
  try {
    const encoded = encodeURIComponent(trimmed);
    let translatedText = '';
    let detectedLang = sourceLang;

    // Tentativa 1: clients5.google.com
    try {
      const c5Url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${sourceLang}&tl=${targetLang}&q=${encoded}`;
      const c5Res = await fetch(c5Url);
      if (c5Res.ok) {
        const c5Data = await c5Res.json();
        if (Array.isArray(c5Data) && c5Data[0]) {
          translatedText = c5Data[0][0] || '';
          detectedLang = c5Data[0][1] || sourceLang;
        }
      }
    } catch {}

    // Tentativa 2: translate.googleapis.com
    if (!translatedText) {
      const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encoded}`;
      const res = await fetch(googleUrl);
      if (res.ok) {
        const data = await res.json();
        translatedText = (data[0] || [])
          .map((item: any) => item[0])
          .filter(Boolean)
          .join('');
        detectedLang = data[2] || sourceLang;
      }
    }

    if (!translatedText) throw new Error('Tradução vazia');

    const result: TranslationResult = {
      originalText: trimmed,
      translatedText,
      sourceLang: detectedLang,
      targetLang,
      engine: 'google-translate',
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(result));
    } catch {
      // quota excedida
    }

    return result;
  } catch (err) {
    console.warn('Falha na tradução via Google Tradutor:', err);
    return {
      originalText: trimmed,
      translatedText: trimmed,
      sourceLang,
      targetLang,
      engine: 'offline',
    };
  }
}

/**
 * Traduz textos mais longos subdividindo por sentenças e preservando quebras de linha
 */
async function translateLongText(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<TranslationResult> {
  // Divide em blocos menores de aprox. 1000 caracteres respeitando parágrafos e pontuação
  const sentences = text.match(/[^.!?]+[.!?]+|\s*$/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const s of sentences) {
    if ((currentChunk + s).length > 1200 && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = s;
    } else {
      currentChunk += s;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk);
  }

  const translatedChunks: string[] = [];
  let detected = sourceLang;

  for (const chunk of chunks) {
    const res = await translateText(chunk, targetLang, sourceLang);
    translatedChunks.push(res.translatedText);
    if (res.sourceLang && res.sourceLang !== 'auto') {
      detected = res.sourceLang;
    }
  }

  const result: TranslationResult = {
    originalText: text,
    translatedText: translatedChunks.join(' '),
    sourceLang: detected,
    targetLang,
    engine: 'google-translate',
  };

  try {
    const cacheKey = getCacheKey(text, targetLang, sourceLang);
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {
    // quota
  }

  return result;
}

/**
 * Detecta automaticamente o idioma local do aparelho/navegador do leitor
 */
export function getUserDeviceLanguage(): string {
  if (typeof navigator === 'undefined') return 'pt';
  const raw = (navigator.language || (navigator as any).userLanguage || 'pt').toLowerCase();
  const code = raw.split('-')[0];
  const found = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  return found ? found.code : 'pt';
}

/**
 * Traduz um array de parágrafos de um capítulo com suporte a lotes (batch) ultrarrápidos e cache
 */
export async function translateChapterParagraphs(
  paragraphs: string[],
  targetLang: string = 'pt',
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> {
  const total = paragraphs.length;
  const results: string[] = new Array(total);
  const uncachedIndices: number[] = [];
  const uncachedTexts: string[] = [];

  // 1. Coleta de cache imediata
  for (let i = 0; i < total; i++) {
    const p = paragraphs[i];
    const trimmed = (p || '').trim();
    if (!trimmed) {
      results[i] = p || '';
      continue;
    }

    const cacheKey = getCacheKey(trimmed, targetLang, 'auto');
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.translatedText) {
          results[i] = parsed.translatedText;
          continue;
        }
      } catch {}
    }

    uncachedIndices.push(i);
    uncachedTexts.push(trimmed);
  }

  let completedCount = total - uncachedIndices.length;
  onProgress?.(completedCount, total);

  if (uncachedIndices.length === 0) {
    return results;
  }

  // 2. Tradução em lotes de 15 parágrafos
  const BATCH_SIZE = 15;
  for (let b = 0; b < uncachedIndices.length; b += BATCH_SIZE) {
    const chunkIndices = uncachedIndices.slice(b, b + BATCH_SIZE);
    const chunkTexts = uncachedTexts.slice(b, b + BATCH_SIZE);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: chunkTexts, targetLang, sourceLang: 'auto' }),
      });

      if (res.ok) {
        const data = await res.json();
        const translations: string[] = data.translations || [];

        for (let j = 0; j < chunkIndices.length; j++) {
          const originalIdx = chunkIndices[j];
          const trans = translations[j] || chunkTexts[j];
          results[originalIdx] = trans;

          // Salva no cache individual
          try {
            const cacheKey = getCacheKey(chunkTexts[j], targetLang, 'auto');
            localStorage.setItem(
              cacheKey,
              JSON.stringify({
                originalText: chunkTexts[j],
                translatedText: trans,
                sourceLang: 'auto',
                targetLang,
                engine: 'google-translate',
              })
            );
          } catch {}
        }
      } else {
        // Fallback unitário se falhar o lote
        for (let j = 0; j < chunkIndices.length; j++) {
          const originalIdx = chunkIndices[j];
          const singleRes = await translateText(chunkTexts[j], targetLang, 'auto');
          results[originalIdx] = singleRes.translatedText;
        }
      }
    } catch {
      // Fallback offline
      for (let j = 0; j < chunkIndices.length; j++) {
        const originalIdx = chunkIndices[j];
        results[originalIdx] = chunkTexts[j];
      }
    }

    completedCount += chunkIndices.length;
    onProgress?.(completedCount, total);
  }

  return results;
}
