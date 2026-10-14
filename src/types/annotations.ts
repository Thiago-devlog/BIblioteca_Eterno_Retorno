export type HighlightColor = 'terracotta' | 'gold' | 'charcoal';

export interface TextHighlight {
  id: string;
  bookId: string;
  chapterIndex: number;
  chapterTitle: string;
  text: string;
  color: HighlightColor;
  note?: string;
  createdAt: string;
}

export interface QuoteCardOptions {
  quote: string;
  bookTitle: string;
  author: string;
  year: number;
  theme: 'parchment' | 'imperial' | 'terracotta' | 'velvet';
}
