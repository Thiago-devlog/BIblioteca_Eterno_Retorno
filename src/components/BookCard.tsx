import React from 'react';
import { Book } from '../types/library';
import { BookOpen, Sparkles } from 'lucide-react';

interface BookCardProps {
  book: Book;
  authorName?: string;
  progressPercent?: number;
  onOpenBook: (book: Book) => void;
  variant?: 'portrait' | 'compact' | 'miniature';
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  authorName,
  progressPercent,
  onOpenBook,
  variant = 'portrait',
}) => {
  if (variant === 'miniature') {
    return (
      <button
        onClick={() => onOpenBook(book)}
        className="group relative flex flex-col items-center focus-visible:outline-none text-left"
        title={`${book.title} (${book.originalYear}) - Clique para ler`}
      >
        <div
          className="relative w-24 h-36 rounded-xs transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl shadow-md overflow-hidden flex flex-col justify-between p-2.5 border"
          style={{
            backgroundColor: book.coverBg,
            borderColor: book.coverBorderColor,
            color: book.coverAccent,
          }}
        >
          {/* Spine 3D illusion */}
          <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/25 via-white/10 to-transparent pointer-events-none" />

          <div className="flex justify-between items-start text-[9px] font-mono opacity-80 pl-1">
            <span className="truncate max-w-[48px] uppercase">{book.movement}</span>
            <span className="font-bold">{book.originalYear}</span>
          </div>

          <div className="text-center my-auto px-1">
            <h4 className="font-cinzel text-[10px] leading-tight font-bold line-clamp-3">
              {book.title}
            </h4>
          </div>

          <div className="text-[8px] text-center opacity-70 tracking-tighter truncate uppercase font-sans">
            {authorName || book.subgenre}
          </div>

          {typeof progressPercent === 'number' && progressPercent > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div
                className="h-full bg-[#E5AA42]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
        <span className="mt-2 text-xs font-serif text-[#3E3830] font-medium text-center line-clamp-1 max-w-[100px] group-hover:text-[#1F1C18]">
          {book.title}
        </span>
      </button>
    );
  }

  return (
    <div className="group flex flex-col h-full bg-[#FAF7F0] border border-[#DDD3BF] rounded-sm p-4 transition-all duration-300 hover:shadow-lg hover:border-[#BFAF95]">
      {/* Visual Book Cover Container */}
      <button
        onClick={() => onOpenBook(book)}
        className="relative w-full aspect-[3/4.2] rounded-xs overflow-hidden mb-4 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-2xl shadow-md border text-left cursor-pointer flex flex-col justify-between p-5"
        style={{
          backgroundColor: book.coverBg,
          borderColor: book.coverBorderColor,
        }}
      >
        {/* Book spine lighting overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/35 via-white/15 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-black/15 to-transparent pointer-events-none" />

        {/* Top header on book cover */}
        <div className="flex items-center justify-between z-10">
          <span
            className="text-[10px] uppercase tracking-[0.2em] font-sans font-semibold opacity-85"
            style={{ color: book.coverAccent }}
          >
            {book.editionLabel || `Edição ${book.originalYear}`}
          </span>
          <span
            className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-xs"
            style={{
              backgroundColor: `${book.coverAccent}22`,
              color: book.coverAccent,
              border: `1px solid ${book.coverAccent}44`,
            }}
          >
            {book.originalYear}
          </span>
        </div>

        {/* Center Title and Quote */}
        <div className="my-auto text-center px-2 z-10">
          {book.coverStyle === 'facsimile-cream' && (
            <div className="w-16 h-16 mx-auto mb-3 rounded-full border border-dashed border-[#B3A48C] flex items-center justify-center opacity-65">
              <span className="text-[9px] font-serif uppercase tracking-widest text-[#7C6B50]">
                {book.originalYear}
              </span>
            </div>
          )}

          <h3
            className="font-cinzel text-lg sm:text-xl font-bold tracking-wide leading-tight mb-2 uppercase"
            style={{ color: book.coverAccent }}
          >
            {book.title}
          </h3>

          {book.quote && (
            <p
              className="font-serif italic text-xs leading-relaxed opacity-90 line-clamp-2 max-w-[200px] mx-auto"
              style={{ color: book.coverAccent }}
            >
              “{book.quote}”
            </p>
          )}
        </div>

        {/* Bottom imprint on book cover */}
        <div className="text-center z-10 border-t pt-2" style={{ borderColor: `${book.coverAccent}30` }}>
          <span
            className="text-[9px] uppercase tracking-[0.22em] font-sans block opacity-80"
            style={{ color: book.coverAccent }}
          >
            {book.subgenre}
          </span>
        </div>

        {/* Reading progress overlay ribbon */}
        {typeof progressPercent === 'number' && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/25">
            <div
              className="h-full bg-[#E5AA42]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </button>

      {/* Book Metadata Below Cover */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#7A7163] uppercase tracking-wider mb-1">
            <span>{authorName || book.movement}</span>
            <span>{book.pagesCount} páginas</span>
          </div>

          <h4 className="font-display-title text-base font-bold text-[#1F1C18] group-hover:text-[#8C2D19] transition-colors leading-snug mb-1">
            {book.title}
          </h4>

          <p className="text-xs text-[#5C5446] line-clamp-2 font-serif leading-relaxed mb-3">
            {book.synopsis}
          </p>
        </div>

        <div className="pt-3 border-t border-[#E8DEC9] flex items-center justify-between gap-2 mt-auto">
          {typeof progressPercent === 'number' && progressPercent > 0 ? (
            <span className="text-xs font-semibold text-[#8C2D19] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8C2D19]"></span>
              {progressPercent}% lido
            </span>
          ) : (
            <span className="text-xs text-[#8A8172] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#A89C86]" />
              Edição Integral
            </span>
          )}

          <button
            onClick={() => onOpenBook(book)}
            className="px-3 py-1.5 text-xs font-semibold text-[#1F1C18] bg-[#EFE9DC] hover:bg-[#221F1B] hover:text-[#FAF5EB] transition-colors rounded-sm flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{progressPercent ? 'Continuar' : 'Ler Livro'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
