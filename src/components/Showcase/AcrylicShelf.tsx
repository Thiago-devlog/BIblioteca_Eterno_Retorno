import React, { useRef } from 'react';
import { BookItem } from '../../data/booksData';
import { AcrylicBookCard } from './AcrylicBookCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AcrylicShelfProps {
  categoryTitle: string;
  books: BookItem[];
  shelfColor: 'amber' | 'blue' | 'emerald' | 'frosted' | 'ruby';
  readingProgress: Record<string, { progressPercent: number }>;
  favorites?: string[];
  themeMode?: 'light' | 'dark' | 'amber';
  onSelectBookToInspect: (book: BookItem) => void;
}

export const AcrylicShelf: React.FC<AcrylicShelfProps> = ({
  categoryTitle,
  books,
  shelfColor,
  readingProgress,
  favorites = [],
  themeMode = 'light',
  onSelectBookToInspect,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 140;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Cores táteis, vibrantes e translúcidas de acrílico com inline styles garantidos contra purge do Tailwind/Vercel
  const shelfThemeConfig = {
    amber: {
      dot: '#D97706',
      floorBg:
        themeMode === 'dark'
          ? 'linear-gradient(180deg, rgba(245, 158, 11, 0.18) 0%, rgba(30, 41, 59, 0.88) 45%, rgba(15, 23, 42, 0.96) 100%)'
          : themeMode === 'amber'
          ? 'linear-gradient(180deg, rgba(251, 191, 36, 0.38) 0%, rgba(250, 241, 220, 0.95) 45%, rgba(234, 216, 181, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(254, 243, 199, 0.85) 0%, rgba(253, 230, 138, 0.40) 45%, rgba(248, 250, 252, 0.96) 100%)',
      floorBorder:
        themeMode === 'dark'
          ? 'rgba(245, 158, 11, 0.38)'
          : themeMode === 'amber'
          ? 'rgba(217, 119, 6, 0.45)'
          : 'rgba(245, 158, 11, 0.45)',
      lipBg: 'linear-gradient(180deg, rgba(245, 158, 11, 0.65) 0%, rgba(234, 88, 12, 0.72) 48%, rgba(217, 119, 6, 0.82) 100%)',
      lipBorder: 'rgba(251, 191, 36, 0.75)',
      lipShadow: '0 14px 30px -4px rgba(234, 88, 12, 0.50), inset 0 1px 2px rgba(255, 255, 255, 0.70)',
      woodTone: 'linear-gradient(90deg, #451A03 0%, #78350F 50%, #451A03 100%)',
    },
    ruby: {
      dot: '#E11D48',
      floorBg:
        themeMode === 'dark'
          ? 'linear-gradient(180deg, rgba(225, 29, 72, 0.18) 0%, rgba(30, 41, 59, 0.88) 45%, rgba(15, 23, 42, 0.96) 100%)'
          : themeMode === 'amber'
          ? 'linear-gradient(180deg, rgba(251, 113, 133, 0.32) 0%, rgba(250, 241, 220, 0.95) 45%, rgba(234, 216, 181, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(255, 228, 230, 0.85) 0%, rgba(254, 205, 211, 0.40) 45%, rgba(248, 250, 252, 0.96) 100%)',
      floorBorder:
        themeMode === 'dark'
          ? 'rgba(225, 29, 72, 0.38)'
          : themeMode === 'amber'
          ? 'rgba(225, 29, 72, 0.45)'
          : 'rgba(244, 63, 94, 0.45)',
      lipBg: 'linear-gradient(180deg, rgba(244, 63, 94, 0.65) 0%, rgba(225, 29, 72, 0.72) 48%, rgba(190, 18, 60, 0.82) 100%)',
      lipBorder: 'rgba(251, 113, 133, 0.75)',
      lipShadow: '0 14px 30px -4px rgba(225, 29, 72, 0.50), inset 0 1px 2px rgba(255, 255, 255, 0.70)',
      woodTone: 'linear-gradient(90deg, #4C0519 0%, #881337 50%, #4C0519 100%)',
    },
    blue: {
      dot: '#0284C7',
      floorBg:
        themeMode === 'dark'
          ? 'linear-gradient(180deg, rgba(2, 132, 199, 0.18) 0%, rgba(30, 41, 59, 0.88) 45%, rgba(15, 23, 42, 0.96) 100%)'
          : themeMode === 'amber'
          ? 'linear-gradient(180deg, rgba(125, 211, 252, 0.32) 0%, rgba(250, 241, 220, 0.95) 45%, rgba(234, 216, 181, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(224, 242, 254, 0.85) 0%, rgba(186, 230, 253, 0.40) 45%, rgba(248, 250, 252, 0.96) 100%)',
      floorBorder:
        themeMode === 'dark'
          ? 'rgba(2, 132, 199, 0.38)'
          : themeMode === 'amber'
          ? 'rgba(2, 132, 199, 0.45)'
          : 'rgba(56, 189, 248, 0.45)',
      lipBg: 'linear-gradient(180deg, rgba(56, 189, 248, 0.65) 0%, rgba(2, 132, 199, 0.72) 48%, rgba(3, 105, 161, 0.82) 100%)',
      lipBorder: 'rgba(125, 211, 252, 0.75)',
      lipShadow: '0 14px 30px -4px rgba(2, 132, 199, 0.50), inset 0 1px 2px rgba(255, 255, 255, 0.70)',
      woodTone: 'linear-gradient(90deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
    },
    emerald: {
      dot: '#059669',
      floorBg:
        themeMode === 'dark'
          ? 'linear-gradient(180deg, rgba(5, 150, 105, 0.18) 0%, rgba(30, 41, 59, 0.88) 45%, rgba(15, 23, 42, 0.96) 100%)'
          : themeMode === 'amber'
          ? 'linear-gradient(180deg, rgba(110, 231, 183, 0.32) 0%, rgba(250, 241, 220, 0.95) 45%, rgba(234, 216, 181, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(209, 250, 229, 0.85) 0%, rgba(167, 243, 208, 0.40) 45%, rgba(248, 250, 252, 0.96) 100%)',
      floorBorder:
        themeMode === 'dark'
          ? 'rgba(5, 150, 105, 0.38)'
          : themeMode === 'amber'
          ? 'rgba(5, 150, 105, 0.45)'
          : 'rgba(52, 211, 153, 0.45)',
      lipBg: 'linear-gradient(180deg, rgba(52, 211, 153, 0.65) 0%, rgba(5, 150, 105, 0.72) 48%, rgba(4, 120, 87, 0.82) 100%)',
      lipBorder: 'rgba(110, 231, 183, 0.75)',
      lipShadow: '0 14px 30px -4px rgba(5, 150, 105, 0.50), inset 0 1px 2px rgba(255, 255, 255, 0.70)',
      woodTone: 'linear-gradient(90deg, #14532D 0%, #166534 50%, #14532D 100%)',
    },
    frosted: {
      dot: '#475569',
      floorBg:
        themeMode === 'dark'
          ? 'linear-gradient(180deg, rgba(148, 163, 184, 0.18) 0%, rgba(30, 41, 59, 0.88) 45%, rgba(15, 23, 42, 0.96) 100%)'
          : themeMode === 'amber'
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(250, 241, 220, 0.95) 45%, rgba(234, 216, 181, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.75) 45%, rgba(226, 232, 240, 0.98) 100%)',
      floorBorder:
        themeMode === 'dark'
          ? 'rgba(148, 163, 184, 0.38)'
          : themeMode === 'amber'
          ? 'rgba(216, 194, 157, 0.9)'
          : 'rgba(203, 213, 225, 0.9)',
      lipBg: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(241, 245, 249, 0.75) 48%, rgba(203, 213, 225, 0.85) 100%)',
      lipBorder: 'rgba(255, 255, 255, 0.92)',
      lipShadow: '0 14px 30px -4px rgba(0, 0, 0, 0.20), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
      woodTone: 'linear-gradient(90deg, #334155 0%, #475569 50%, #334155 100%)',
    },
  }[shelfColor];

  // Estilos adaptados ao tema ativo para textos e elementos estruturais
  const themeContainerStyles = {
    light: {
      titleColor: 'text-[#0F172A]',
      countColor: 'text-[#64748B]',
    },
    dark: {
      titleColor: 'text-white',
      countColor: 'text-slate-400',
    },
    amber: {
      titleColor: 'text-[#3E2B18]',
      countColor: 'text-[#8C4A19]',
    },
  }[themeMode];

  return (
    <div className="space-y-2 pt-2">
      {/* 1. CABEÇALHO DA CATEGORIA */}
      <div className="flex items-center justify-between px-1.5 pb-1">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-3.5 rounded-full shadow-xs"
            style={{ backgroundColor: shelfThemeConfig.dot }}
          />
          <h3 className={`font-sans text-sm sm:text-base font-bold tracking-tight ${themeContainerStyles.titleColor}`}>
            {categoryTitle}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono font-medium ${themeContainerStyles.countColor}`}>
            {books.length} {books.length === 1 ? 'obra' : 'obras'}
          </span>

          <div className="flex items-center gap-0.5 text-slate-500">
            <button
              onClick={() => scroll('left')}
              className="p-1 rounded-md hover:bg-black/10 active:scale-95 transition-all cursor-pointer"
              title="Rolar para a esquerda"
              aria-label="Rolar para a esquerda"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-1 rounded-md hover:bg-black/10 active:scale-95 transition-all cursor-pointer"
              title="Rolar para a direita"
              aria-label="Rolar para a direita"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. ESTRUTURA TÁTIL DA ESTANTE COM COR TRANSLÚCIDA GARANTIDA */}
      <div
        className="relative pt-3 pb-2 overflow-hidden rounded-2xl border transition-all duration-300"
        style={{
          background: shelfThemeConfig.floorBg,
          borderColor: shelfThemeConfig.floorBorder,
          boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.04)',
        }}
      >
        {/* Carrossel de Livros */}
        <div
          ref={scrollContainerRef}
          className="flex items-end gap-3.5 overflow-x-auto pb-8 pt-2 px-3.5 scrollbar-none relative z-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book) => {
            const prog = readingProgress[book.id]?.progressPercent || 0;
            const isFav = favorites.includes(book.id);
            return (
              <AcrylicBookCard
                key={book.id}
                book={book}
                onOpenBook={onSelectBookToInspect}
                progressPercent={prog}
                isFavorite={isFav}
              />
            );
          })}
        </div>

        {/* SOMBRA INTERNA PROJETADA NA PARTE INFERIOR DOS LIVROS */}
        <div className="absolute bottom-3 left-0 right-0 h-14 bg-gradient-to-t from-black/25 via-black/10 to-transparent pointer-events-none z-15" />

        {/* BORDA DE VIDRO / ACRÍLICO TRANSLÚCIDO COLORIDO ELEGANTE */}
        <div
          className="absolute bottom-0 left-0 right-0 h-13 sm:h-14 rounded-2xl backdrop-blur-md pointer-events-none z-20 flex items-center justify-between px-3.5 transition-all duration-300"
          style={{
            background: shelfThemeConfig.lipBg,
            borderColor: shelfThemeConfig.lipBorder,
            boxShadow: shelfThemeConfig.lipShadow,
            borderTop: '1px solid rgba(255, 255, 255, 0.45)',
            borderLeft: `1px solid ${shelfThemeConfig.lipBorder}`,
            borderRight: `1px solid ${shelfThemeConfig.lipBorder}`,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          {/* Parafuso Metálico Esquerdo */}
          <div className="acrylic-screw" title="Fixador Metálico de Acrílico" />

          {/* Borda superior de 1px com brilho de reflexo em gradiente */}
          <div
            className="absolute top-0 left-4 right-4 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.75) 50%, transparent 100%)',
            }}
          />

          {/* Parafuso Metálico Direito */}
          <div className="acrylic-screw" title="Fixador Metálico de Acrílico" />
        </div>

        {/* Base / Friso de Madeira Nobre sob o vidro para ancoragem física */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5 opacity-80 pointer-events-none z-25 rounded-b-2xl"
          style={{ background: shelfThemeConfig.woodTone }}
        />
      </div>
    </div>
  );
};
