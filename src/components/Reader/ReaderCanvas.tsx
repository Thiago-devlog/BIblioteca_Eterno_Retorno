import React from 'react';
import { BookItem } from '../../data/catalog';
import { MinimalistReader } from './MinimalistReader';

export interface ReaderCanvasProps {
  book: BookItem;
  initialChapterIndex?: number;
  initialProgressPercent?: number;
  themeMode?: 'light' | 'dark' | 'amber';
  onToggleTheme?: (mode: 'light' | 'dark' | 'amber') => void;
  onClose: () => void;
  onUpdateProgress: (
    bookId: string,
    chapterIndex: number,
    progressPercent: number,
    locationText: string
  ) => void;
}

/**
 * ReaderCanvas — Leitor Imersivo de Tela Dedicada
 * Permite leitura integral completa dos volumes clássicos e ePubs reais,
 * com persistência de progresso no localStorage, navegação de capítulos e exportação ePub.
 */
export const ReaderCanvas: React.FC<ReaderCanvasProps> = (props) => {
  return <MinimalistReader {...props} />;
};

export default ReaderCanvas;
