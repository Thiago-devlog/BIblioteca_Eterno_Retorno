export interface Chapter {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  content: string[];
}

export interface Book {
  id: string;
  authorId: string;
  title: string;
  originalYear: number;
  movement: string;
  subgenre: string;
  quote?: string;
  synopsis: string;
  coverBg: string;
  coverBorderColor: string;
  coverAccent: string;
  coverStyle: 'facsimile-cream' | 'garnier-navy' | 'leather-brown' | 'monochrome' | 'classic-olive';
  editionLabel?: string;
  chapters: Chapter[];
  pagesCount: number;
}

export interface Author {
  id: string;
  name: string;
  shortName: string;
  lifespan: string;
  movement: string;
  city: string;
  archiveCode: string;
  bio: string;
  quote: string;
  portraitUrl: string;
  folderColor: string;
  tabLabel: string;
  books: Book[];
}

export interface ReadingProgressRecord {
  bookId: string;
  chapterIndex: number;
  progressPercent: number;
  lastReadDate: string;
}

export type ViewMode = 'folders' | 'bookshelf' | 'catalog' | 'progress';

export interface ReaderSettings {
  fontSize: number; // 15 to 24 px
  fontFamily: 'serif' | 'sans' | 'mono';
  theme: 'sepia' | 'cream' | 'dark';
  lineHeight: 'tight' | 'normal' | 'relaxed';
}
