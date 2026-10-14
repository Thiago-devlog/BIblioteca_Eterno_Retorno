import React, { useState, useEffect } from 'react';
import { AuthorProfile } from '../../data/booksData';
import { ChevronLeft, ChevronRight, BookOpen, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthorSpotlightBannerProps {
  authors: AuthorProfile[];
  themeMode: 'light' | 'dark' | 'amber';
  onSelectAuthorDossier: (author: AuthorProfile) => void;
}

export const AuthorSpotlightBanner: React.FC<AuthorSpotlightBannerProps> = ({
  authors,
  themeMode,
  onSelectAuthorDossier,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Troca automática a cada 6 segundos (pausa quando o usuário passar o mouse por cima)
  useEffect(() => {
    if (isPaused || authors.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % authors.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [authors.length, isPaused]);

  const author = authors[currentIndex] || authors[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + authors.length) % authors.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % authors.length);
  };

  if (!author) return null;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative px-1 sm:px-2 mb-6 select-none"
    >
      {/* RETÂNGULO PRINCIPAL DO BANNER COM A FOTO OCUPANDO TODO O ESPAÇO */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-900/30 dark:border-white/15 min-h-[260px] sm:min-h-[290px] md:min-h-[310px] flex flex-col justify-between p-5 sm:p-7 md:p-8 shadow-2xl transition-all duration-500 bg-[#140D0A]">
        {/* 1. FOTO REAL DO AUTOR EM TODO O RETÂNGULO (FULL-BLEED BACKGROUND COM CROSSFADE) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={author.id}
              src={author.portraitUrl || author.avatarUrl}
              alt={`Retrato de ${author.name}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.85, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: 'sepia(0.35) contrast(1.15) brightness(0.65)' }}
              className="w-full h-full object-cover object-top sm:object-[center_20%]"
              onError={(e) => {
                if (e.currentTarget.src !== author.avatarUrl) {
                  e.currentTarget.src = author.avatarUrl;
                }
              }}
            />
          </AnimatePresence>

          {/* 2. DEGRADÊ ESCURO AMADEIRADO EM TODO O RETÂNGULO PARA CONTRASTE E LEGIBILIDADE PERFEITA */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0906]/95 via-[#140d09]/75 to-[#140d09]/45 sm:bg-gradient-to-r sm:from-[#0e0906]/95 sm:via-[#140d09]/80 sm:to-[#140d09]/40" />

          {/* 3. VINHETA SUTIL DE PROFUNDIDADE */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.7)]" />
        </div>

        {/* CONTEÚDO EDITORIAL EM DESTAQUE SOBRE A FOTO */}
        <AnimatePresence mode="wait">
          <motion.div
            key={author.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 space-y-3.5 max-w-2xl text-left"
          >
            {/* Nome do Autor em Tipografia Nobre */}
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {author.name}
            </h2>

            {/* Citação Canônica Célebre */}
            <div className="relative pl-3 border-l-2 border-amber-500/60 py-0.5">
              <p className="font-cormorant italic text-sm sm:text-base md:text-lg text-amber-100/95 leading-relaxed drop-shadow line-clamp-2 sm:line-clamp-3">
                “{author.quote}”
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Rodapé do Banner: Botão de Ação & Frase-guia */}
        <div className="relative z-10 pt-3 flex flex-wrap items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectAuthorDossier(author)}
              className="px-4 py-2 rounded-full text-xs font-sans font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg bg-amber-500 hover:bg-amber-400 text-stone-950 hover:shadow-amber-500/25"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Dossiê & Obras</span>
            </button>

            <span className="text-xs font-cormorant italic text-stone-300 drop-shadow hidden sm:inline">
              {author.tagline}
            </span>
          </div>

          {/* INDICADORES EM PONTOS (DOTS) */}
          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            {authors.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 bg-amber-400 shadow-xs'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                title={`Ir para ${authors[idx]?.name || `autor ${idx + 1}`}`}
                aria-label={`Ir para autor ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* SETAS DE NAVEGAÇÃO LATERAL (ANTERIOR / PRÓXIMO) */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/65 text-white/90 hover:text-white backdrop-blur-md cursor-pointer transition-all z-20 border border-white/10 hover:scale-110 shadow-lg"
          title="Autor anterior"
          aria-label="Autor anterior"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/65 text-white/90 hover:text-white backdrop-blur-md cursor-pointer transition-all z-20 border border-white/10 hover:scale-110 shadow-lg"
          title="Próximo autor"
          aria-label="Próximo autor"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
