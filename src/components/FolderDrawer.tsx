import React, { useState } from 'react';
import { AuthorProfile, BookItem } from '../data/catalog';
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
      {/* 1. CABEÇALHO MINIMALISTA DA GALERIA DE RETRATOS */}
      <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#1E1711] dark:text-white">
            Autores
          </h2>
          <p className="font-cormorant italic text-xs sm:text-sm text-[#6E5D4F] dark:text-stone-300 mt-0.5">
            Retratos canônicos em molduras de museu. Clique para abrir o dossiê da obra.
          </p>
        </div>

        <span className="font-mono text-[11px] font-semibold text-[#5A4532] dark:text-stone-300 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 rounded-full">
          {authors.length} Autores
        </span>
      </div>

      {/* 2. GRADE DE QUADROS MINIMALISTAS & ELEGANTES (COBRINDO TODO O CANTO) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-3 sm:gap-3.5">
        {authors.map((author) => {
          return (
            <motion.div
              key={author.id}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', damping: 22, stiffness: 350 }}
              onClick={() => handleCardClick(author)}
              className={`group relative rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between text-left cursor-pointer select-none border transition-all duration-300 ${galleryThemeStyles.cardBg} ${galleryThemeStyles.cardBorder} ${galleryThemeStyles.cardShadow}`}
            >
              {/* 2.1. MOLDURA DE GALERIA: A FOTO COBRE TODO O CANTO (FULL BLEED COM LAZY LOADING) */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-1.5 shadow-[0_6px_18px_rgba(0,0,0,0.25)] border-2 border-[#4A3525] group-hover:border-[#C9A85B] transition-all duration-300 bg-stone-900">
                {/* A imagem do autor cobre todo o canto perfeitamente no formato WebP otimizado com Lazy Loading */}
                <img
                  src={author.avatarUrl}
                  alt={`Retrato histórico de ${author.name}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
                  style={{ filter: 'sepia(0.12) contrast(1.06)' }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.endsWith('.webp')) {
                      target.src = target.src.replace('.webp', '.jpg');
                    } else if (target.src !== author.portraitUrl) {
                      target.src = author.portraitUrl;
                    }
                  }}
                />

                {/* Filete dourado chanfrado interno contornando toda a moldura até os cantos */}
                <div className="absolute inset-0 rounded-[10px] ring-1 ring-inset ring-[#D4AF37]/50 pointer-events-none" />

                {/* Vinheta suave e reflexo de vidro de museu no hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/15 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Plaqueta de Museu em Latão Escovado no rodapé */}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 py-0.5 px-1.5 rounded-xs bg-gradient-to-r from-[#A8873E]/95 via-[#E6D090]/95 to-[#A8873E]/95 backdrop-blur-xs border border-[#7A5B20] shadow-[0_2px_4px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-between text-center select-none">
                  <div className="w-0.5 h-0.5 rounded-full bg-[#593E13] shadow-inner shrink-0" />
                  <p className="font-cinzel text-[8px] sm:text-[8.5px] font-bold text-[#342006] tracking-[0.08em] uppercase truncate leading-tight w-full text-center">
                    {author.shortName || author.name}
                  </p>
                  <div className="w-0.5 h-0.5 rounded-full bg-[#593E13] shadow-inner shrink-0" />
                </div>
              </div>

              {/* 2.2. DADOS DO AUTOR: ULTRA MINIMALISTA — APENAS O TÍTULO */}
              <div className="pt-1 pb-0.5 text-center">
                <h3
                  className={`font-display text-xs sm:text-[13px] font-bold tracking-tight leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors truncate ${galleryThemeStyles.authorTitle}`}
                >
                  {author.name}
                </h3>
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
