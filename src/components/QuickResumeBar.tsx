import React from 'react';
import { Book } from '../types/library';
import { BookOpen, ArrowRight } from 'lucide-react';

interface QuickResumeBarProps {
  book: Book;
  authorName: string;
  progressPercent: number;
  onResume: (book: Book) => void;
}

export const QuickResumeBar: React.FC<QuickResumeBarProps> = ({
  book,
  authorName,
  progressPercent,
  onResume,
}) => {
  return (
    <div className="bg-[#FAF7F0] border border-[#DDD3BF] rounded-sm p-4 sm:p-5 shadow-xs transition-all hover:border-[#BFAF95]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Book Thumbnail & Title */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-16 rounded-xs shrink-0 flex flex-col justify-between p-1.5 border shadow-sm"
            style={{
              backgroundColor: book.coverBg,
              borderColor: book.coverBorderColor,
              color: book.coverAccent,
            }}
          >
            <span className="text-[7px] font-mono font-bold">{book.originalYear}</span>
            <span className="font-cinzel text-[8px] leading-tight font-bold text-center line-clamp-2">
              {book.title}
            </span>
            <span className="text-[6px] tracking-tighter uppercase opacity-75">Séc. XIX</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C2D19] block font-semibold">
              Continuar Lendo
            </span>
            <h3 className="font-display-title text-base sm:text-lg font-bold text-[#1F1C18]">
              {book.title}
            </h3>
            <p className="text-xs text-[#706450] font-serif italic">
              {authorName} · Edição Integral do Acervo
            </p>
          </div>
        </div>

        {/* Right Progress & Action Button */}
        <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
          <div className="w-36 sm:w-48 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-[#7A6E59]">
              <span>Progresso</span>
              <span className="font-bold text-[#1F1C18]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E8DEC9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8C2D19] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => onResume(book)}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#221F1B] hover:bg-[#39342D] text-[#FAF5EB] rounded-sm flex items-center gap-2 transition-all shadow-xs shrink-0"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#E5AA42]" />
            <span>Retomar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
