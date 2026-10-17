/**
 * Utilitário de cálculo e formatação de Tempo Estimado de Leitura e Obras Completas
 * Baseado na velocidade média canônica de leitura (200-230 palavras/minuto ou ~1.5 min por página impressa)
 */

export interface ReadingTimeCalculable {
  pagesCount?: number;
  chapters?: Array<{ content?: string[] }>;
}

/**
 * Calcula o tempo estimado de leitura (em minutos) para uma obra completa
 */
export function calculateBookReadingTimeMinutes(book: ReadingTimeCalculable): number {
  const totalWords = (book.chapters || []).reduce((acc, chap) => {
    const text = (chap.content || []).join(' ');
    const count = text.split(/\s+/).filter(Boolean).length;
    return acc + count;
  }, 0);

  // Estimativa baseada no número real de páginas canônicas da obra impressa
  const minutesFromPages = book.pagesCount ? Math.round(book.pagesCount * 1.45) : 0;
  // Estimativa baseada no total de palavras carregadas
  const minutesFromWords = Math.round(totalWords / 200);

  // Considera o maior valor para refletir fielmente a extensão da obra completa
  const estimated = Math.max(minutesFromPages, minutesFromWords, 15);
  return estimated;
}

/**
 * Formata o tempo de leitura em horas e minutos humanizados (ex: "5h 25min", "45 min", "14h")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Calcula o tempo estimado de leitura de um capítulo isolado
 */
export function calculateChapterReadingTimeMinutes(paragraphs: string[]): number {
  const text = (paragraphs || []).join(' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Formata o tempo estimado do capítulo atual (ex: "~6 min de leitura")
 */
export function formatChapterReadingTime(minutes: number): string {
  return `~${minutes} min de leitura`;
}
