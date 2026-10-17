/**
 * Utilitário Robusto de Leitura e Parsing de Arquivos EPUB Reais (src/utils/epubLoader.ts)
 * 
 * Permite descompactar e carregar livros digitais completos diretamente da pasta
 * /assets/epubs/ no navegador utilizando JSZip, extraindo a estrutura do OPF,
 * sumário (TOC) e todos os capítulos em texto e parágrafos autênticos.
 * Suporta quebra inteligente de capítulos tanto para ePubs multi-documento
 * quanto para ePubs de documento único com divisores canônicos.
 */

import JSZip from 'jszip';
import { ChapterData } from '../data/catalog';

// Cache em memória dos livros ePub processados para carregamento instantâneo
const epubCache = new Map<string, ChapterData[]>();

/**
 * Remove tags indesejadas e limpa o texto preservando parágrafos legíveis
 */
function cleanHtmlToParagraphs(htmlString: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Remove scripts, estilos e metadados
  const unwanted = doc.querySelectorAll('script, style, meta, link, head');
  unwanted.forEach((el) => el.remove());

  const paragraphs: string[] = [];

  // Busca parágrafos, estrofes poéticas e citações
  const blocks = doc.querySelectorAll('p, blockquote, div.stanza, div.verse, pre');
  blocks.forEach((b) => {
    // Ignora avisos legais do Project Gutenberg em rodapés se não forem parte do texto literário
    const raw = b.textContent?.trim() || '';
    if (
      raw.length > 0 &&
      !raw.includes('End of the Project Gutenberg') &&
      !raw.includes('*** END OF THE PROJECT GUTENBERG') &&
      !raw.includes('*** START OF THE PROJECT GUTENBERG') &&
      !raw.includes('Project Gutenberg License') &&
      !raw.includes('Project Gutenberg eBook') &&
      !raw.startsWith('Title: ') &&
      !raw.startsWith('Author: ') &&
      !raw.startsWith('Release date: ')
    ) {
      paragraphs.push(raw);
    }
  });

  // Se não encontrou blocos <p>, tenta recuperar linhas do body
  if (paragraphs.length === 0) {
    const bodyText = doc.body.textContent || '';
    const lines = bodyText
      .split(/\n{2,}/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    return lines;
  }

  return paragraphs;
}

/**
 * Extrai seções ou capítulos de um documento XHTML grande que contém divisores de capítulo
 */
function splitHtmlIntoSections(htmlString: string): { title: string; paragraphs: string[] }[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Remove lixo
  doc.querySelectorAll('script, style, meta, link, head').forEach((el) => el.remove());

  // Busca todos os elementos de divisão (h1, h2, h3, hr.chap, div.chapter, a[id])
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, hr.chap'));
  
  if (headings.length <= 1) {
    // Documento simples sem múltiplos subtítulos: retorna inteiro
    const paras = cleanHtmlToParagraphs(htmlString);
    if (paras.length === 0) return [];
    const firstH = doc.querySelector('h1, h2, h3, h4')?.textContent?.trim() || 'Capítulo';
    return [{ title: firstH, paragraphs: paras }];
  }

  const sections: { title: string; paragraphs: string[] }[] = [];
  
  headings.forEach((heading, idx) => {
    const titleText = heading.textContent?.replace(/\s+/g, ' ').trim() || `Seção ${idx + 1}`;
    
    // Coleta todos os irmãos subsequentes até o próximo heading
    const paragraphs: string[] = [];
    let nextNode = heading.nextElementSibling;
    
    while (nextNode && !['H1', 'H2', 'H3', 'H4', 'H5'].includes(nextNode.tagName) && !nextNode.classList.contains('chap')) {
      if (['P', 'BLOCKQUOTE', 'PRE'].includes(nextNode.tagName) || nextNode.classList.contains('stanza')) {
        const text = nextNode.textContent?.trim();
        if (text && text.length > 0 && !text.includes('End of the Project Gutenberg')) {
          paragraphs.push(text);
        }
      } else {
        // Verifica se há parágrafos dentro de divs ou seções filhas
        const subParas = nextNode.querySelectorAll('p, blockquote, div.stanza');
        subParas.forEach((sp) => {
          const st = sp.textContent?.trim();
          if (st && st.length > 0 && !st.includes('End of the Project Gutenberg')) {
            paragraphs.push(st);
          }
        });
      }
      nextNode = nextNode.nextElementSibling;
    }

    if (paragraphs.length > 0) {
      sections.push({
        title: titleText,
        paragraphs,
      });
    }
  });

  return sections;
}

/**
 * Carrega e processa um arquivo .epub a partir da URL (ex: /assets/epubs/dom-casmurro.epub)
 */
export async function loadEpubChapters(epubUrl: string): Promise<ChapterData[]> {
  if (epubCache.has(epubUrl)) {
    return epubCache.get(epubUrl)!;
  }

  try {
    const response = await fetch(epubUrl);
    if (!response.ok) {
      throw new Error(`Falha ao obter arquivo EPUB: status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 1. Localiza o arquivo container.xml
    const containerFile = zip.file('META-INF/container.xml');
    if (!containerFile) {
      throw new Error('Arquivo container.xml não encontrado no pacote EPUB.');
    }
    const containerXml = await containerFile.async('text');

    // Extrai o caminho do arquivo OPF
    const opfMatch = containerXml.match(/full-path=["']([^"']+)["']/i);
    const opfPath = opfMatch ? opfMatch[1] : 'OEBPS/content.opf';
    const opfDir = opfPath.includes('/') ? opfPath.substring(0, opfPath.lastIndexOf('/') + 1) : '';

    const opfFile = zip.file(opfPath);
    if (!opfFile) {
      throw new Error(`Arquivo OPF não encontrado em: ${opfPath}`);
    }
    const opfText = await opfFile.async('text');

    // 2. Mapeia manifest do OPF (id -> href) usando regex confiável e flexível
    const manifest = new Map<string, string>();
    const itemMatches = opfText.matchAll(/<item[^>]+>/g);
    for (const m of itemMatches) {
      const tag = m[0];
      const id = tag.match(/id=["']([^"']+)["']/i)?.[1];
      const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
      if (id && href) {
        manifest.set(id, href);
      }
    }

    // 3. Lê o spine para obter a ordem canônica de leitura
    const spineHrefs: string[] = [];
    const spineMatches = opfText.matchAll(/<itemref[^>]+idref=["']([^"']+)["']/g);
    for (const sm of spineMatches) {
      const idref = sm[1];
      if (manifest.has(idref)) {
        spineHrefs.push(manifest.get(idref)!);
      }
    }

    // Se o spine não retornou links, adiciona todos os arquivos html/xhtml do manifest
    if (spineHrefs.length === 0) {
      manifest.forEach((href) => {
        if (/\.(xhtml|html|htm)$/i.test(href) && !href.toLowerCase().includes('toc')) {
          spineHrefs.push(href);
        }
      });
    }

    // 4. Lê o sumário TOC (toc.xhtml ou toc.ncx) para mapear títulos elegantes
    const tocMap = new Map<string, string>();
    let tocFileItem = manifest.get('toc') || manifest.get('ncx');
    if (!tocFileItem) {
      for (const [id, href] of manifest.entries()) {
        if (id.toLowerCase().includes('toc') || href.toLowerCase().includes('toc')) {
          tocFileItem = href;
          break;
        }
      }
    }

    if (tocFileItem) {
      const tocFullPath = opfDir ? `${opfDir}${tocFileItem}` : tocFileItem;
      const tocFile = zip.file(tocFullPath) || zip.file(tocFileItem);
      if (tocFile) {
        const tocXml = await tocFile.async('text');
        // Extrai links <a href="...">Título</a>
        const linkMatches = tocXml.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gs);
        for (const lm of linkMatches) {
          const rawHref = lm[1];
          const rawTitle = lm[2].replace(/<[^>]+>/g, '').trim();
          const cleanHref = rawHref.split('#')[0];
          if (cleanHref && rawTitle && !tocMap.has(cleanHref)) {
            tocMap.set(cleanHref, rawTitle);
          }
        }
        // Extrai pontos navPoint do NCX com regex segura
        const ncxMatches = tocXml.matchAll(/<navLabel>\s*<text>([\s\S]*?)<\/text>\s*<\/navLabel>\s*<content\s+src=["']([^"']+)["']/g);
        for (const nm of ncxMatches) {
          const rawTitle = nm[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          const rawHref = nm[2].split('#')[0];
          if (rawHref && rawTitle && !tocMap.has(rawHref)) {
            tocMap.set(rawHref, rawTitle);
          }
        }
      }
    }

    // 5. Itera pelos capítulos do spine e extrai o conteúdo integral
    const chapters: ChapterData[] = [];
    let chapterCounter = 1;

    for (const href of spineHrefs) {
      const lowerHref = href.toLowerCase();
      // Ignora páginas puramente de capa, sumário ou avisos de licença externa
      if (
        (lowerHref.includes('cover') && !lowerHref.includes('chapter')) ||
        lowerHref.includes('wrap0000') ||
        lowerHref.includes('pg-header') ||
        lowerHref.includes('titlepage') ||
        lowerHref.includes('toc') ||
        lowerHref.endsWith('.ncx')
      ) {
        continue;
      }

      const filePath = opfDir ? `${opfDir}${href}` : href;
      const file = zip.file(filePath) || zip.file(href);
      if (!file) continue;

      const htmlContent = await file.async('text');

      // Descarta páginas com cabeçalho ou boilerplate Gutenberg
      if (
        htmlContent.includes('pg-boilerplate') ||
        htmlContent.includes('id="pg-header"') ||
        htmlContent.includes('The Project Gutenberg eBook') ||
        htmlContent.includes('class="pgheader"') ||
        htmlContent.includes('Project Gutenberg License')
      ) {
        continue;
      }

      const baseHref = href.split('#')[0];
      const mainTitle = tocMap.get(baseHref) || '';

      // Tenta dividir seções internas se o documento contiver múltiplos títulos
      const internalSections = splitHtmlIntoSections(htmlContent);

      if (internalSections.length > 1) {
        // Múltiplos capítulos contidos dentro do mesmo documento
        for (const sec of internalSections) {
          if (sec.paragraphs.length === 0) continue;
          
          let title = sec.title;
          const upperTitle = title.toUpperCase();
          if (upperTitle.includes('GUTENBERG') || upperTitle.includes('LICENSE') || upperTitle === 'FIM') {
            continue;
          }
          if (['POR', 'MACHADO DE ASSIS', 'FIÓDOR DOSTOIÉVSKI', 'JOSE DE ALENCAR', 'CASTRO ALVES', 'ALUÍSIO AZEVEDO', 'RAUL POMPÉIA', 'LIMA BARRETO'].includes(upperTitle) && sec.paragraphs.length < 3) {
            continue;
          }

          if (!title || title.length < 2 || title.startsWith('Seção')) {
            title = `Capítulo ${chapterCounter}`;
          }

          chapters.push({
            id: `epub-chap-${chapterCounter}`,
            number: `Capítulo ${chapterCounter}`,
            title: title.replace(/\s+/g, ' ').trim(),
            content: sec.paragraphs,
          });
          chapterCounter++;
        }
      } else {
        // Documento único por capítulo
        const paragraphs = cleanHtmlToParagraphs(htmlContent);
        if (paragraphs.length === 0) continue;
        if (paragraphs.length <= 2 && paragraphs.some((p) => p.includes('Gutenberg') || p.includes('eBook') || p.includes('Transcribed from') || p.includes('License'))) {
          continue;
        }
        // Descarta folhas de divisão ou títulos de partes com menos de 160 caracteres
        const totalChars = paragraphs.reduce((sum, p) => sum + p.length, 0);
        if (paragraphs.length <= 2 && totalChars < 160) {
          continue;
        }

        let chapterTitle = mainTitle;
        if (!chapterTitle) {
          const titleMatch = htmlContent.match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/i);
          if (titleMatch) {
            chapterTitle = titleMatch[1].replace(/<[^>]+>/g, '').trim();
          }
        }

        const upperTitle = (chapterTitle || '').toUpperCase();
        if (upperTitle.includes('GUTENBERG') || upperTitle.includes('LICENSE') || upperTitle === 'FIM') {
          continue;
        }

        if (!chapterTitle) {
          chapterTitle = `Capítulo ${chapterCounter}`;
        }

        chapters.push({
          id: `epub-chap-${chapterCounter}`,
          number: `Capítulo ${chapterCounter}`,
          title: chapterTitle.replace(/\s+/g, ' ').trim(),
          content: paragraphs,
        });

        chapterCounter++;
      }
    }

    if (chapters.length > 0) {
      epubCache.set(epubUrl, chapters);
      return chapters;
    }

    throw new Error('Nenhum capítulo legível pôde ser extraído do arquivo EPUB.');
  } catch (error) {
    console.warn(`[EpubLoader] Não foi possível processar ${epubUrl}:`, error);
    throw error;
  }
}
