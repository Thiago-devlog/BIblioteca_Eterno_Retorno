import React from 'react';
import { Author, Book } from '../types/library';
import { BookCard } from './BookCard';
import { Library, Sparkles } from 'lucide-react';

interface BookshelfViewProps {
  authors: Author[];
  onOpenBook: (book: Book) => void;
  readingProgress: Record<string, { progressPercent: number }>;
}

export const BookshelfView: React.FC<BookshelfViewProps> = ({
  authors,
  onOpenBook,
  readingProgress,
}) => {
  return (
    <div className="space-y-8">
      {/* Bookshelf Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E0D7C2]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8C2D19] mb-2">
            <Library className="w-4 h-4" />
            <span>Estante Canônica em Madeira Maciça</span>
          </div>
          <h2 className="font-display-title text-3xl sm:text-4xl font-bold text-[#1F1C18] tracking-tight">
            A Estante Literária do Séc. XIX
          </h2>
          <p className="font-serif text-[#605748] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Uma visão aconchegante inspirada em bibliotecas clássicas de colecionador. As lombadas e volumes descansam em prateleiras talhadas, prontos para a leitura imediata.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono uppercase tracking-wider text-[#7A6F5C]">
            Total de Volumes Expostos
          </span>
          <p className="font-display-title text-2xl font-bold text-[#1F1C18]">
            {authors.reduce((acc, a) => acc + a.books.length, 0)} Obras
          </p>
        </div>
      </div>

      {/* Real Wood-Themed Bookshelf Container */}
      <div className="bg-[#1C1613] rounded-md p-6 sm:p-10 shadow-2xl border-4 border-[#302621]">
        {authors.map((author, shelfIndex) => (
          <div key={author.id} className="mb-14 last:mb-2">
            {/* Shelf brass nameplate */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#3D322B]">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold bg-[#A87B32] text-[#1E1712] rounded-xs shadow-xs">
                  PRATELEIRA {shelfIndex + 1}
                </span>
                <h3 className="font-display-title text-base sm:text-lg font-bold text-[#EAE2D3] tracking-wide">
                  {author.name}
                </h3>
              </div>
              <span className="text-xs font-serif italic text-[#A69986] hidden sm:inline">
                {author.movement} · {author.lifespan}
              </span>
            </div>

            {/* Books aligned on the shelf */}
            <div className="relative pt-6 pb-2 px-4 flex flex-wrap items-end gap-6 sm:gap-8 justify-start">
              {author.books.map((book) => {
                const prog = readingProgress[book.id]?.progressPercent || 0;
                return (
                  <div key={book.id} className="transition-transform duration-300 hover:scale-105">
                    <BookCard
                      book={book}
                      authorName={author.shortName}
                      progressPercent={prog}
                      onOpenBook={onOpenBook}
                      variant="miniature"
                    />
                  </div>
                );
              })}

              {/* Decorative miniature literary curiosities on the shelf */}
              {shelfIndex === 0 && (
                <div className="ml-auto hidden md:flex flex-col items-center opacity-85 hover:opacity-100 transition-opacity">
                  <div className="w-12 h-16 rounded-t-full bg-gradient-to-b from-[#A89882] to-[#695E51] border border-[#8C7E6C] shadow-md flex items-center justify-center text-[10px] font-mono text-[#2B241C] text-center p-1">
                    Busto Machado
                  </div>
                  <div className="w-14 h-3 bg-[#42372E] border-t border-[#6E5D4E] rounded-xs"></div>
                  <span className="text-[8px] font-mono text-[#8C7F6D] mt-1 uppercase tracking-tighter">
                    Memória ABL
                  </span>
                </div>
              )}

              {shelfIndex === 1 && (
                <div className="ml-auto hidden md:flex flex-col items-center opacity-80">
                  <div className="w-10 h-14 bg-gradient-to-b from-[#D49842] to-[#915B1E] rounded-sm shadow-md flex items-center justify-center text-xs text-[#FFF3DE]">
                    🕯️
                  </div>
                  <div className="w-12 h-2.5 bg-[#42372E] rounded-xs"></div>
                  <span className="text-[8px] font-mono text-[#8C7F6D] mt-1 uppercase tracking-tighter">
                    Lamparina
                  </span>
                </div>
              )}
            </div>

            {/* The Physical Wooden Shelf Plank with 3D Depth */}
            <div className="relative h-6 sm:h-7 bg-gradient-to-r from-[#593E2B] via-[#755239] to-[#593E2B] rounded-xs shadow-xl border-t border-[#8A6347] flex flex-col justify-between">
              <div className="h-1 bg-white/10"></div>
              <div className="h-2 bg-black/40"></div>
            </div>
            {/* Shelf Under-Shadow */}
            <div className="h-4 bg-gradient-to-b from-black/60 to-transparent"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
