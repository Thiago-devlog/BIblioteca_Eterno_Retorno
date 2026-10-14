import React, { useState } from 'react';
import { AuthorProfile, BookItem } from '../data/catalog';
import {
  BookOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthorEditorialModal } from './Modal/AuthorEditorialModal';

export interface FolderDrawerProps {
  authors: AuthorProfile[];
  books: BookItem[];
  selectedAuthorId?: string;
  onSelectAuthor?: (authorId: string) => void;
  onOpenBook: (book: BookItem) => void;
  readingProgress?: Record<string, { progressPercent: number }>;
  themeMode?: 'light' | 'dark' | 'amber';
}

export const FolderDrawer: React.FC<FolderDrawerProps> = ({
  authors,
  books,
  selectedAuthorId: controlledAuthorId,
  onSelectAuthor,
  onOpenBook,
  readingProgress = {},
  themeMode = 'light',
}) => {
  // Estado para controlar o autor exibido no Pop-up Modal Editorial (estilo clique no livro)
  const [modalAuthor, setModalAuthor] = useState<AuthorProfile | null>(() => {
    if (controlledAuthorId) {
      return authors.find((a) => a.id === controlledAuthorId) || null;
    }
    return null;
  });

  const handleCardClick = (author: AuthorProfile) => {
    setModalAuthor(author);
    onSelectAuthor?.(author.id);
  };

  const handleCloseModal = () => {
    setModalAuthor(null);
  };

  // Estilos adaptados ao tema para a galeria
  const galleryThemeStyles = {
    light: {
      cardBg: 'bg-[#FDFBF7] hover:bg-white',
      cardBorder: 'border-[#E6DEC8]',
      cardShadow: 'shadow-[0_4px_16px_rgba(50,30,10,0.05)] hover:shadow-[0_12px_28px_rgba(50,30,10,0.12)]',
      mattingBg: 'bg-[#F9F6EE]',
      mattingBorder: 'border-[#E2D8C0]',
      quoteColor: 'text-[#5C4836]',
      authorTitle: 'text-[#1F1710]',
      subColor: 'text-[#7A6450]',
      headerEyebrow: 'bg-[#F3ECE0] text-[#7A5B36] border-[#DFD3BE]',
      btnSecondary: 'bg-[#F3ECE0] hover:bg-[#EAE0CD] text-[#3D2C1C]',
    },
    dark: {
      cardBg: 'bg-[#131722]/90 hover:bg-[#181D2B]',
      cardBorder: 'border-slate-800/90',
      cardShadow: 'shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)]',
      mattingBg: 'bg-[#1C202E]',
      mattingBorder: 'border-slate-700/60',
      quoteColor: 'text-slate-300',
      authorTitle: 'text-white',
      subColor: 'text-slate-400',
      headerEyebrow: 'bg-slate-800/80 text-amber-300 border-slate-700/80',
      btnSecondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200',
    },
    amber: {
      cardBg: 'bg-[#F6EEDC] hover:bg-[#FAF3E4]',
      cardBorder: 'border-[#DFCDB0]',
      cardShadow: 'shadow-[0_4px_16px_rgba(70,40,15,0.06)] hover:shadow-[0_12px_28px_rgba(70,40,15,0.14)]',
      mattingBg: 'bg-[#EDE2CA]',
      mattingBorder: 'border-[#D5C29F]',
      quoteColor: 'text-[#4A321B]',
      authorTitle: 'text-[#2D1B0A]',
      subColor: 'text-[#7A542D]',
      headerEyebrow: 'bg-[#EDE2CA] text-[#6E4218] border-[#DFCBB0]',
      btnSecondary: 'bg-[#EDE2CA] hover:bg-[#E3D4B6] text-[#4A2B0E]',
    },
  }[themeMode];

  return (
    <section className="w-full text-left space-y-6" id="galeria-autores">
      {/* 1. CABEÇALHO CLEAN DA GALERIA DE RETRATOS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3.5 border-b border-black/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border ${galleryThemeStyles.headerEyebrow}`}
            >
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Galeria Clássica · Molduras em Miniatura
            </span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1711] dark:text-white">
            Galeria dos Mestres da Literatura
          </h2>

          <p className="font-cormorant italic text-sm text-[#6E5D4F] dark:text-stone-300 mt-0.5 max-w-2xl">
            Retratos canônicos em molduras refinadas de museu. Clique em qualquer autor para abrir seu dossiê editorial e explorar suas obras originais.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:self-end">
          <span className="font-mono text-xs font-semibold text-[#5A4532] dark:text-stone-300 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 rounded-full">
            {authors.length} Mestres Canônicos
          </span>
        </div>
      </div>

      {/* 2. GRADE DE QUADROS MAIS COMPACTOS & ELEGANTES (7 COLUNAS NO DESKTOP) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5 lg:gap-4">
        {authors.map((author) => {
          const authorBookList = books.filter((b) => b.authorId === author.id);
          const count = authorBookList.length;

          // Leitura em andamento do autor
          const readingBook = authorBookList.find(
            (b) => (readingProgress[b.id]?.progressPercent || 0) > 0
          );
          const activePercent = readingBook
            ? readingProgress[readingBook.id]?.progressPercent || 0
            : 0;

          return (
            <motion.div
              key={author.id}
              whileHover={{ y: -5, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', damping: 22, stiffness: 350 }}
              onClick={() => handleCardClick(author)}
              className={`group relative rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between text-left cursor-pointer select-none border transition-all duration-300 ${galleryThemeStyles.cardBg} ${galleryThemeStyles.cardBorder} ${galleryThemeStyles.cardShadow}`}
            >
              {/* 2.1. MOLDURA DE GALERIA COMPACTA E SOFISTICADA */}
              <div className="relative w-full mb-2.5">
                {/* Camada 1: Moldura de Madeira Nobre Chanfrada */}
                <div className="relative p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-[#2D1F16] via-[#1B120B] to-[#0F0A06] border-2 border-[#543D2A] shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_1.5px_3px_rgba(255,255,255,0.18),inset_0_-2px_4px_rgba(0,0,0,0.65)] transition-transform duration-500 group-hover:shadow-[0_12px_26px_rgba(0,0,0,0.38)]">
                  {/* Camada 2: Filete Dourado Chanfrado Interno */}
                  <div className="p-0.5 rounded-lg bg-gradient-to-br from-[#D4AF37]/50 via-[#8C6D37]/35 to-[#59421A]/60 border border-[#D4AF37]/50 shadow-inner">
                    {/* Camada 3: Paspatur de Algodão Nobre */}
                    <div
                      className={`p-1.5 sm:p-2 rounded-md ${galleryThemeStyles.mattingBg} border ${galleryThemeStyles.mattingBorder} shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] flex flex-col items-center`}
                    >
                      {/* Camada 4: Retrato Histórico com Recesso */}
                      <div className="relative aspect-[4/5] w-full rounded-xs overflow-hidden shadow-[inset_0_2px_6px_rgba(0,0,0,0.4),0_1.5px_4px_rgba(0,0,0,0.12)] border border-stone-400/40 dark:border-stone-700 bg-stone-900">
                        <img
                          src={author.avatarUrl}
                          alt={`Retrato histórico de ${author.name}`}
                          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          style={{ filter: 'sepia(0.18) contrast(1.08)' }}
                          onError={(e) => {
                            if (e.currentTarget.src !== author.portraitUrl) {
                              e.currentTarget.src = author.portraitUrl;
                            }
                          }}
                        />

                        {/* Reflexo de Vidro de Museu no Hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </div>

                      {/* Camada 5: Plaqueta de Museu em Latão Escovado com Parafusos */}
                      <div className="mt-1.5 w-full py-0.5 px-1 rounded-xs bg-gradient-to-r from-[#C9A85B] via-[#E6D090] to-[#C9A85B] border border-[#7A5B20] shadow-[0_1.5px_3px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.6)] flex items-center justify-between text-center select-none">
                        <div className="w-0.5 h-0.5 rounded-full bg-[#593E13] shadow-inner shrink-0" />
                        <div className="px-0.5 truncate w-full text-center">
                          <p className="font-cinzel text-[8px] sm:text-[8.5px] font-bold text-[#342006] tracking-[0.1em] uppercase truncate leading-tight">
                            {author.name}
                          </p>
                        </div>
                        <div className="w-0.5 h-0.5 rounded-full bg-[#593E13] shadow-inner shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2.2. DADOS DO AUTOR: ULTRA CLEAN & COMPACTO */}
              <div className="space-y-1 mt-0.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] font-mono font-bold tracking-wider text-amber-700 dark:text-amber-400 uppercase truncate">
                      {author.movement}
                    </span>
                    <span className="text-[8.5px] font-mono text-[#8C7662] dark:text-stone-400 shrink-0">
                      {count} {count === 1 ? 'obra' : 'obras'}
                    </span>
                  </div>

                  <h3
                    className={`font-display text-xs sm:text-sm font-bold tracking-tight leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors truncate mt-0.5 ${galleryThemeStyles.authorTitle}`}
                  >
                    {author.name}
                  </h3>
                </div>

                {/* Citação em 1 linha sutil */}
                <p
                  className={`font-cormorant italic text-[11px] leading-snug line-clamp-1 ${galleryThemeStyles.quoteColor}`}
                >
                  “{author.quote}”
                </p>

                {/* 2.3. BOTÃO DE AÇÃO MINIMALISTA */}
                <div className="pt-2 mt-1 border-t border-black/5 dark:border-white/10">
                  {activePercent > 0 && readingBook ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBook(readingBook);
                      }}
                      className="w-full py-1.5 px-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-sans font-bold text-[10px] shadow-xs transition-all cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">Lendo: {readingBook.title}</span>
                      <span className="font-mono text-[9px] bg-white/20 px-1 rounded-full shrink-0">
                        {activePercent}%
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(author);
                      }}
                      className={`w-full py-1 px-2 rounded-full ${galleryThemeStyles.btnSecondary} font-sans font-bold text-[10px] transition-all hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-between border border-black/5 dark:border-white/10`}
                    >
                      <span className="truncate">Abrir Dossiê</span>
                      <ChevronRight className="w-3 h-3 shrink-0 transition-transform group-hover:translate-x-0.5 text-amber-700 dark:text-amber-400" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. POP-UP EDITORIAL DO AUTOR (ESTILO DO MODAL DE LIVRO COM FÍSICA DE MOLA) */}
      <AnimatePresence>
        {modalAuthor && (
          <AuthorEditorialModal
            author={modalAuthor}
            authors={authors}
            books={books}
            isOpen={true}
            onClose={handleCloseModal}
            onOpenBook={onOpenBook}
            onSelectAuthor={setModalAuthor}
            readingProgress={readingProgress}
            themeMode={themeMode}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
