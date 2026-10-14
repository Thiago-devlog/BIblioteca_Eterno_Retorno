/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AUTHORS_DATABASE, BOOKS_DATABASE, BookItem } from './data/booksData';
import { AcrylicLibraryView } from './components/Showcase/AcrylicLibraryView';
import { MinimalistReader } from './components/Reader/MinimalistReader';
import { AuthorDossierModal } from './components/Showcase/AuthorDossierModal';
import { BookEditorialModal } from './components/Modal/BookEditorialModal';
import { AnimatePresence } from 'motion/react';

export default function App() {
  // Modo de Tema Visual: 'light' (Claro) | 'dark' (Escuro) | 'amber' (Amarelado sem Luz Azul)
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'amber'>(() => {
    const saved = localStorage.getItem('eterno_theme_mode');
    if (saved === 'light' || saved === 'dark' || saved === 'amber') return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('eterno_theme_mode', themeMode);
  }, [themeMode]);

  // Modal Editorial de Apresentação da Obra (Requisito 2)
  const [selectedBookForModal, setSelectedBookForModal] = useState<BookItem | null>(null);

  // Livro ativo no Leitor Minimalista (Requisito 3, 4, 5)
  const [activeReaderBook, setActiveReaderBook] = useState<BookItem | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // Modal de Dossiês dos Autores
  const [isDossiersOpen, setIsDossiersOpen] = useState<boolean>(false);

  // Sistema de Favoritos Persistente
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('eterno_favorites_acrylic');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return ['quincas-borba', 'dom-casmurro'];
  });

  useEffect(() => {
    localStorage.setItem('eterno_favorites_acrylic', JSON.stringify(favorites));
  }, [favorites]);

  // Progresso de Leitura Persistente
  const [readingProgress, setReadingProgress] = useState<
    Record<string, { progressPercent: number; chapterIndex?: number; lastLocation?: string }>
  >(() => {
    const saved = localStorage.getItem('eterno_reading_progress_acrylic');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Corrige marcações legadas que gravavam a rolagem da página isolada como se fosse do livro todo
        if (parsed['quincas-borba'] && parsed['quincas-borba'].chapterIndex === 0 && parsed['quincas-borba'].progressPercent > 20) {
          parsed['quincas-borba'].progressPercent = 1;
        }
        if (parsed['memorias-postumas'] && parsed['memorias-postumas'].chapterIndex <= 1 && parsed['memorias-postumas'].progressPercent > 20) {
          parsed['memorias-postumas'].progressPercent = 2;
        }
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return {
      'quincas-borba': {
        progressPercent: 1,
        chapterIndex: 0,
        lastLocation: 'Capítulo I',
      },
      'memorias-postumas': {
        progressPercent: 2,
        chapterIndex: 1,
        lastLocation: 'Capítulo II',
      },
    };
  });

  useEffect(() => {
    localStorage.setItem('eterno_reading_progress_acrylic', JSON.stringify(readingProgress));
  }, [readingProgress]);

  // Ao clicar em um livro na estante: exibe o Modal Editorial da Obra
  const handleInspectBook = (book: BookItem) => {
    setSelectedBookForModal(book);
  };

  // Abertura direta do Leitor Imersivo em tela dedicada para leitura integral completa
  const handleOpenReaderDirectly = (book: BookItem) => {
    setSelectedBookForModal(null);
    setActiveReaderBook(book);
    const savedChapter = readingProgress[book.id]?.chapterIndex || 0;
    setActiveChapterIndex(savedChapter);
  };

  // Do Modal Editorial: Iniciar / Continuar Leitura
  const handleStartReadingFromModal = (book: BookItem) => {
    handleOpenReaderDirectly(book);
  };

  // Do Modal Editorial: Alternar status "Marcar como Lido" (100% ou reset)
  const handleToggleMarkAsRead = (bookId: string) => {
    setReadingProgress((prev) => {
      const currentProg = prev[bookId]?.progressPercent || 0;
      const isAlreadyCompleted = currentProg >= 100;
      return {
        ...prev,
        [bookId]: {
          chapterIndex: 0,
          progressPercent: isAlreadyCompleted ? 0 : 100,
          lastLocation: isAlreadyCompleted ? 'Não iniciado' : 'Obra Concluída',
        },
      };
    });
  };

  // Do Modal Editorial: Alternar Favorito
  const handleToggleFavorite = (bookId: string) => {
    setFavorites((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  const handleCloseReader = () => {
    setActiveReaderBook(null);
  };

  const handleUpdateProgress = (
    bookId: string,
    chapterIndex: number,
    progressPercent: number,
    locationText: string
  ) => {
    setReadingProgress((prev) => ({
      ...prev,
      [bookId]: {
        chapterIndex,
        progressPercent,
        lastLocation: locationText,
      },
    }));
  };

  // Cores do contêiner raiz de acordo com o tema selecionado
  const rootThemeStyles = {
    light: 'bg-[#F1F3F5] text-[#0F172A]',
    dark: 'bg-[#090D16] text-[#F1F5F9]',
    amber: 'bg-[#F4ECD8] text-[#3B2B1B]',
  }[themeMode];

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-amber-200 selection:text-slate-900 transition-colors duration-300 ${rootThemeStyles}`}>
      {/* 1. VISUALIZAÇÃO PRINCIPAL: Estante de Acrílico Translúcido e Madeira Nobre com Banner de Autores */}
      <AcrylicLibraryView
        books={BOOKS_DATABASE}
        authors={AUTHORS_DATABASE}
        readingProgress={readingProgress}
        favorites={favorites}
        themeMode={themeMode}
        onToggleTheme={setThemeMode}
        onOpenBook={handleInspectBook}
        onOpenReaderDirectly={handleOpenReaderDirectly}
        onOpenDossiers={() => setIsDossiersOpen(true)}
      />

      {/* 2. MODAL EDITORIAL DA OBRA COM TRANSIÇÃO EM MOLA (Apresentação antes do leitor) */}
      <AnimatePresence>
        {selectedBookForModal && (
          <BookEditorialModal
            book={selectedBookForModal}
            isOpen={true}
            progressPercent={readingProgress[selectedBookForModal.id]?.progressPercent || 0}
            isFavorite={favorites.includes(selectedBookForModal.id)}
            onClose={() => setSelectedBookForModal(null)}
            onStartReading={handleStartReadingFromModal}
            onToggleMarkAsRead={handleToggleMarkAsRead}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </AnimatePresence>

      {/* 3. LEITOR EDITORIAL MINIMALISTA (Grifos inline, notas, modo amarelado/escuro, dicionário) */}
      <AnimatePresence>
        {activeReaderBook && (
          <MinimalistReader
            book={activeReaderBook}
            initialChapterIndex={activeChapterIndex}
            initialProgressPercent={readingProgress[activeReaderBook.id]?.progressPercent || 0}
            themeMode={themeMode}
            onToggleTheme={setThemeMode}
            onClose={handleCloseReader}
            onUpdateProgress={handleUpdateProgress}
          />
        )}
      </AnimatePresence>

      {/* 4. MODAL DE DOSSIÊS DE ESCRITORES (Acervo canônico) */}
      <AnimatePresence>
        {isDossiersOpen && (
          <AuthorDossierModal
            authors={AUTHORS_DATABASE}
            books={BOOKS_DATABASE}
            isOpen={true}
            onClose={() => setIsDossiersOpen(false)}
            onOpenBook={handleOpenReaderDirectly}
            themeMode={themeMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
