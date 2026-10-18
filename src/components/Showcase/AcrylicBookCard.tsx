import React, { useState } from 'react';
import { BookItem } from '../../data/booksData';
import { Heart, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { calculateBookReadingTimeMinutes, formatReadingTime } from '../../utils/readingTime';

interface AcrylicBookCardProps {
  book: BookItem;
  onOpenBook: (book: BookItem) => void;
  progressPercent?: number;
  isFavorite?: boolean;
}

export const AcrylicBookCard: React.FC<AcrylicBookCardProps> = ({
  book,
  onOpenBook,
  progressPercent = 0,
  isFavorite = false,
}) => {
  const isCompleted = progressPercent >= 100;
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const estimatedMinutes = calculateBookReadingTimeMinutes(book);
  const readingTimeFormatted = formatReadingTime(estimatedMinutes);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setMousePos({ x, y });
  };

  const coverBg = book.coverBg || '#FAF6ED';
  const coverBorder = book.coverBorder || '#D8CEB7';
  const coverAccent = book.coverAccent || '#8C2D19';
  const isLightCover =
    coverBg === '#FAF6ED' ||
    coverBg === '#EFE7D8' ||
    coverBg === '#ECE3D0' ||
    coverBg.toLowerCase().startsWith('#f') ||
    coverBg.toLowerCase().startsWith('#e');

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', damping: 20, stiffness: 350 }}
      onClick={() => onOpenBook(book)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos(null);
      }}
      onMouseMove={handleMouseMove}
      className="shelf-book-item group relative flex-shrink-0 cursor-pointer select-none text-left"
      style={{ width: '112px' }}
      title={`${book.title} (${book.year}) — Obra Completa · Tempo estimado: ${readingTimeFormatted}`}
    >
      {/* Visual Book Cover — com acabamento físico editorial de capa e lombada 3D */}
      <div
        className="relative w-full aspect-[1/1.42] rounded-md overflow-hidden shadow-[0_6px_14px_rgba(0,0,0,0.18)] flex flex-col justify-between p-2.5 transition-shadow duration-300 group-hover:shadow-[0_10px_22px_rgba(0,0,0,0.28)] border"
        style={{
          backgroundColor: coverBg,
          borderColor: coverBorder,
          color: isLightCover ? '#1A1412' : coverAccent,
          backgroundImage: isLightCover
            ? 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(230,220,200,0.15) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.22) 100%)',
        }}
      >
        {/* Lombada 3D sutil à esquerda */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/25 via-white/10 to-transparent pointer-events-none z-10" />

        {/* REFLEXO DE LUZ NO LIVRO AO PASSAR O PONTEIRO (Tactile Light Glare & Sheen Sweep) */}
        <div className="book-glare-container pointer-events-none">
          {/* 1. Faixa diagonal de reflexo que atravessa a capa */}
          <div className="book-glare-sheen" />

          {/* 2. Reflexo especular que acompanha a posição exata do ponteiro do mouse */}
          {isHovered && mousePos && (
            <div
              className="absolute inset-0 transition-opacity duration-150"
              style={{
                background: `radial-gradient(circle 75px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.12) 40%, transparent 80%)`,
                mixBlendMode: 'overlay',
              }}
            />
          )}

          {/* 3. Brilho sutil de verniz nas bordas */}
          <div className="absolute inset-0 border border-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Topo da Capa: Categoria, Ano e Badges de Favorito / Concluído */}
        <div className="flex items-center justify-between text-[7px] font-mono font-bold tracking-wider opacity-85 pl-1 z-10">
          <span className="truncate max-w-[46px] uppercase">{book.category}</span>
          <div className="flex items-center gap-1">
            {isFavorite && (
              <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
            )}
            {isCompleted && (
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 fill-emerald-100" />
            )}
            <span>{book.year}</span>
          </div>
        </div>

        {/* Centro Superior da Capa: Título de Alto Impacto posicionado para não ser cortado pela estante */}
        <div className="pt-1.5 pb-2 text-center px-0.5 z-10">
          <h4 className="font-display text-[9.5px] sm:text-[10px] font-black uppercase leading-[1.18] line-clamp-3">
            {book.title}
          </h4>
          <p className="font-cormorant italic text-[7.5px] line-clamp-1 opacity-90 mt-0.5">
            {book.author}
          </p>
        </div>

        {/* Rodapé da Capa: Obra Completa & Tempo Estimado de Leitura */}
        <div className="text-center z-10 border-t pt-1 space-y-0.5" style={{ borderColor: `${coverAccent}33` }}>
          <div className="flex items-center justify-center gap-1 text-[6.5px] font-mono font-bold uppercase tracking-wider opacity-90 truncate">
            <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
            <span>{isCompleted ? 'CONCLUÍDO' : 'OBRA COMPLETA'}</span>
          </div>
          <div className="flex items-center justify-center gap-0.5 text-[6.5px] font-mono opacity-80">
            <Clock className="w-2 h-2 shrink-0" />
            <span>~{readingTimeFormatted}</span>
          </div>
        </div>

        {/* Indicador de Leitura */}
        {progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-10">
            <div
              className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-[#E11D48]'}`}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        )}
      </div>

      {/* Sombra de apoio projetada na base */}
      <div className="w-4/5 h-2 mx-auto bg-black/20 blur-xs rounded-full -mt-1" />
    </motion.div>
  );
};
