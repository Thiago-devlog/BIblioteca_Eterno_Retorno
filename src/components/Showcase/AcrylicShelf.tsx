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

  // Cores de vidro/acrílico fosco elegante com backdrop-blur-md, borda superior de 1px e sombra projetada
  const shelfStyles = {
    amber: {
      lipBg: 'bg-gradient-to-b from-[#F59E0B]/30 via-[#EA580C]/35 to-[#D97706]/45',
      lipBorder: 'border-[#F59E0B]/30',
      lipShadow: 'shadow-[0_12px_28px_-5px_rgba(234,88,12,0.28)]',
      highlight: 'bg-gradient-to-r from-transparent via-white/50 to-transparent',
      woodTone: 'from-[#451A03] via-[#78350F] to-[#451A03]',
    },
    blue: {
      lipBg: 'bg-gradient-to-b from-[#38BDF8]/30 via-[#0284C7]/35 to-[#0369A1]/45',
      lipBorder: 'border-[#38BDF8]/30',
      lipShadow: 'shadow-[0_12px_28px_-5px_rgba(2,132,199,0.28)]',
      highlight: 'bg-gradient-to-r from-transparent via-white/50 to-transparent',
      woodTone: 'from-[#0F172A] via-[#1E293B] to-[#0F172A]',
    },
    emerald: {
      lipBg: 'bg-gradient-to-b from-[#34D399]/30 via-[#059669]/35 to-[#047857]/45',
      lipBorder: 'border-[#34D399]/30',
      lipShadow: 'shadow-[0_12px_28px_-5px_rgba(5,150,105,0.28)]',
      highlight: 'bg-gradient-to-r from-transparent via-white/50 to-transparent',
      woodTone: 'from-[#14532D] via-[#166534] to-[#14532D]',
    },
    frosted: {
      lipBg: 'bg-gradient-to-b from-white/60 via-white/50 to-slate-200/60',
      lipBorder: 'border-slate-300/40',
      lipShadow: 'shadow-[0_12px_28px_-5px_rgba(0,0,0,0.14)]',
      highlight: 'bg-gradient-to-r from-transparent via-white/70 to-transparent',
      woodTone: 'from-[#334155] via-[#475569] to-[#334155]',
    },
    ruby: {
      lipBg: 'bg-gradient-to-b from-[#F43F5E]/30 via-[#E11D48]/35 to-[#BE123C]/45',
      lipBorder: 'border-[#F43F5E]/30',
      lipShadow: 'shadow-[0_12px_28px_-5px_rgba(225,29,72,0.28)]',
      highlight: 'bg-gradient-to-r from-transparent via-white/50 to-transparent',
      woodTone: 'from-[#4C0519] via-[#881337] to-[#4C0519]',
    },
  }[shelfColor];

  // Estilos adaptados ao tema ativo
  const themeContainerStyles = {
    light: {
      shelfFloor: 'bg-gradient-to-b from-[#F8FAFC]/90 to-[#EDF2F7]/95 border-slate-200/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]',
      titleColor: 'text-[#0F172A]',
      countColor: 'text-[#64748B]',
      dotColor: 'bg-slate-900',
    },
    dark: {
      shelfFloor: 'bg-gradient-to-b from-[#1E293B]/80 to-[#0F172A]/90 border-slate-700/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]',
      titleColor: 'text-white',
      countColor: 'text-slate-400',
      dotColor: 'bg-amber-400',
    },
    amber: {
      shelfFloor: 'bg-gradient-to-b from-[#FAF1DC]/90 to-[#EAD8B5]/90 border-[#D8C29D] shadow-[inset_0_2px_4px_rgba(154,91,50,0.04)]',
      titleColor: 'text-[#3E2B18]',
      countColor: 'text-[#8C4A19]',
      dotColor: 'bg-[#8C4A19]',
    },
  }[themeMode];

  return (
    <div className="space-y-2 pt-2">
      {/* 1. CABEÇALHO DA CATEGORIA */}
      <div className="flex items-center justify-between px-1.5 pb-1">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-3.5 rounded-full ${themeContainerStyles.dotColor}`} />
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

      {/* 2. ESTRUTURA TÁTIL DA ESTANTE */}
      <div className={`relative pt-3 pb-2 overflow-hidden rounded-2xl border ${themeContainerStyles.shelfFloor}`}>
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

        {/* BORDA DE VIDRO / ACRÍLICO FOSCO ELEGANTE */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-13 sm:h-14 rounded-2xl backdrop-blur-md ${shelfStyles.lipBg} ${shelfStyles.lipShadow} pointer-events-none z-20 flex items-center justify-between px-3.5`}
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
            borderRight: '1px solid rgba(255, 255, 255, 0.15)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Parafuso Metálico Esquerdo */}
          <div className="acrylic-screw" title="Fixador Metálico de Acrílico" />

          {/* Borda superior de 1px com brilho de reflexo em gradiente */}
          <div className={`absolute top-0 left-4 right-4 h-[1px] ${shelfStyles.highlight}`} />

          {/* Parafuso Metálico Direito */}
          <div className="acrylic-screw" title="Fixador Metálico de Acrílico" />
        </div>

        {/* Base / Friso de Madeira Nobre sob o vidro para ancoragem física */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${shelfStyles.woodTone} opacity-70 pointer-events-none z-25 rounded-b-2xl`} />
      </div>
    </div>
  );
};
