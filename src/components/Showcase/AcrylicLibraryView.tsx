import React from 'react';
import { BookItem, AuthorProfile } from '../../data/booksData';
import { AcrylicShelf } from './AcrylicShelf';
import { RenaissanceParallaxHero } from './RenaissanceParallaxHero';
import { FolderDrawer } from '../FolderDrawer';
import { OfflineIndicator } from '../PWA/OfflineIndicator';
import { BookOpen } from 'lucide-react';

interface AcrylicLibraryViewProps {
  books: BookItem[];
  authors: AuthorProfile[];
  readingProgress: Record<string, { progressPercent: number }>;
  favorites: string[];
  themeMode: 'light' | 'dark' | 'amber';
  onToggleTheme: (mode: 'light' | 'dark' | 'amber') => void;
  onOpenBook: (book: BookItem) => void;
  onOpenReaderDirectly?: (book: BookItem) => void;
  onOpenDossiers: () => void;
}

export const AcrylicLibraryView: React.FC<AcrylicLibraryViewProps> = ({
  books,
  authors,
  readingProgress,
  favorites,
  themeMode,
  onToggleTheme,
  onOpenBook,
  onOpenReaderDirectly,
  onOpenDossiers,
}) => {
  // Divisão em Categorias com Prateleiras de Acrílico Colorido
  const dostoievskiBooks = books.filter((b) => b.authorId === 'dostoievski');
  const machadoBooks = books.filter((b) => b.authorId === 'machado-de-assis');
  const romanticismBooks = books.filter(
    (b) => b.authorId === 'jose-de-alencar' || b.authorId === 'castro-alves'
  );
  const naturalismBooks = books.filter(
    (b) => b.authorId === 'aluisio-azevedo' || b.authorId === 'raul-pompeia'
  );
  const modernismBooks = books.filter((b) => b.authorId === 'lima-barreto');

  // Livro em leitura ativa para o botão inferior
  const activeReadingBook = books.find((b) => b.id === 'quincas-borba') || books[0];
  const activePercent = readingProgress[activeReadingBook.id]?.progressPercent || 97;

  // Estilos da casca principal adaptados ao tema ativo
  const themePageStyles = {
    light: {
      canvasBg: 'bg-[#F1F3F5] text-[#0F172A]',
      container: 'bg-white border-slate-200/90 shadow-xl',
      headerTitle: 'text-[#0F172A]',
      headerSub: 'text-slate-500',
      bottomBtn: 'bg-black text-white hover:bg-slate-900 shadow-[0_12px_28px_rgba(0,0,0,0.35)]',
      dossierBtn: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200',
      themeSwitchBg: 'bg-slate-100/90 border-slate-200/80',
    },
    dark: {
      canvasBg: 'bg-[#090D16] text-[#F1F5F9]',
      container: 'bg-[#0F172A] border-slate-800 shadow-2xl',
      headerTitle: 'text-white',
      headerSub: 'text-slate-400',
      bottomBtn: 'bg-amber-500 text-black hover:bg-amber-400 font-black shadow-[0_12px_28px_rgba(245,158,11,0.35)]',
      dossierBtn: 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700',
      themeSwitchBg: 'bg-slate-800/90 border-slate-700/80',
    },
    amber: {
      canvasBg: 'bg-[#F4ECD8] text-[#3B2B1B]',
      container: 'bg-[#FAF3E0] border-[#DFCDB0] shadow-xl',
      headerTitle: 'text-[#3E2B18]',
      headerSub: 'text-[#8C4A19]',
      bottomBtn: 'bg-[#5C3210] text-[#FAF3E0] hover:bg-[#43230A] shadow-[0_12px_28px_rgba(92,50,16,0.35)]',
      dossierBtn: 'bg-[#EFE2C2] hover:bg-[#E5D4B0] text-[#5C3210] border border-[#DFCDB0]',
      themeSwitchBg: 'bg-[#EFE2C2]/90 border-[#DFCDB0]',
    },
  }[themeMode];

  return (
    <div className={`min-h-screen py-6 px-3 sm:px-6 md:px-8 flex flex-col items-center justify-start transition-colors duration-300 ${themePageStyles.canvasBg}`}>
      {/* Indicador de Status Offline do PWA */}
      <OfflineIndicator />

      {/* CONTAINER PRINCIPAL: EXCLUSIVAMENTE NO MODO ESTENDIDO */}
      <div
        className={`w-full max-w-6xl rounded-3xl border overflow-hidden min-h-[850px] pb-28 px-3.5 sm:px-6 md:px-8 relative transition-all duration-300 ${themePageStyles.container}`}
      >
        {/* 1. HERÓI TRIDIMENSIONAL COM PARALLAX RENASCENTISTA (Estilo Shopify Editions Renaissance) */}
        <RenaissanceParallaxHero
          themeMode={themeMode}
          onToggleTheme={onToggleTheme}
          onOpenDossiers={onOpenDossiers}
          onScrollToShelves={() => {
            document.getElementById('prateleiras')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. PRATELEIRAS VERTICAIS COM BOLSO DE ACRÍLICO COLORIDO */}
        <div className="space-y-7 px-1 sm:px-2 mt-2" id="prateleiras">
          {/* Prateleira 1: Fiódor Dostoiévski (Acrílico Carmesim Imperial) */}
          <AcrylicShelf
            categoryTitle="Fiódor Dostoiévski · Filosofia & Realismo Psicológico"
            books={dostoievskiBooks}
            shelfColor="ruby"
            readingProgress={readingProgress}
            favorites={favorites}
            themeMode={themeMode}
            onSelectBookToInspect={onOpenBook}
          />

          {/* Prateleira 2: Machado de Assis (Acrílico Âmbar Clássico) */}
          <AcrylicShelf
            categoryTitle="Machado de Assis · O Bruxo do Cosme Velho"
            books={machadoBooks}
            shelfColor="amber"
            readingProgress={readingProgress}
            favorites={favorites}
            themeMode={themeMode}
            onSelectBookToInspect={onOpenBook}
          />

          {/* Prateleira 3: Romantismo & Poesia Cívica (Acrílico Translúcido) */}
          <AcrylicShelf
            categoryTitle="Romantismo Indianista & Poesia da Liberdade"
            books={romanticismBooks}
            shelfColor="frosted"
            readingProgress={readingProgress}
            favorites={favorites}
            themeMode={themeMode}
            onSelectBookToInspect={onOpenBook}
          />

          {/* Prateleira 4: Naturalismo & Impressionismo (Acrílico Azul Cobalto) */}
          <AcrylicShelf
            categoryTitle="Naturalismo & Impressionismo"
            books={naturalismBooks}
            shelfColor="blue"
            readingProgress={readingProgress}
            favorites={favorites}
            themeMode={themeMode}
            onSelectBookToInspect={onOpenBook}
          />

          {/* Prateleira 5: Pré-Modernismo & Crônica Social (Acrílico Esmeralda) */}
          <AcrylicShelf
            categoryTitle="Pré-Modernismo & Crônica Suburbana"
            books={modernismBooks}
            shelfColor="emerald"
            readingProgress={readingProgress}
            favorites={favorites}
            themeMode={themeMode}
            onSelectBookToInspect={onOpenBook}
          />

          {/* Galeria de Retratos Emoldurados dos Autores com Design Ultra Clean */}
          <div className="pt-6 border-t border-black/10 dark:border-white/10" id="fichario">
            <FolderDrawer
              authors={authors}
              books={books}
              readingProgress={readingProgress}
              themeMode={themeMode}
              onOpenBook={onOpenReaderDirectly || onOpenBook}
            />
          </div>
        </div>

        {/* 4. BOTÃO FLUTUANTE INFERIOR: Abertura Editorial da Obra em Leitura */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-30 px-4">
          <button
            onClick={() => (onOpenReaderDirectly ? onOpenReaderDirectly(activeReadingBook) : onOpenBook(activeReadingBook))}
            className={`pointer-events-auto active:scale-98 transition-all px-7 py-3.5 rounded-full flex items-center gap-2.5 text-xs font-sans font-bold cursor-pointer ${themePageStyles.bottomBtn}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Continuar: {activeReadingBook.title} ({activePercent}%)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
