import React from 'react';
import { BookItem } from '../../data/booksData';
import { BookCard } from './BookCard';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

interface BookGridProps {
  books: BookItem[];
  readingProgress: Record<string, { progressPercent: number }>;
  onOpenBook: (book: BookItem) => void;
  title?: string;
  subtitle?: string;
}

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  readingProgress,
  onOpenBook,
  title = 'Obras Canônicas Selecionadas',
  subtitle = 'Volumes integrais em edições digitais cuidadas e fiéis aos originais de época.',
}) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[rgba(15,23,42,0.08)]">
        <div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A5B32] block mb-1">
            ACERVO EDITORIAL &amp; CANÔNICO
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            {title}
          </h2>
          <p className="font-cormorant italic text-sm sm:text-base text-[#64748B] mt-1">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-[#0F172A] bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] px-3 py-1 rounded-full shadow-xs">
            {books.length} {books.length === 1 ? 'Volume' : 'Volumes'} Disponíveis
          </span>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="p-16 text-center bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] rounded-2xl">
          <p className="font-cormorant italic text-lg text-[#64748B]">
            Nenhuma obra encontrada para esta pesquisa no momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => {
            const prog = readingProgress[book.id]?.progressPercent || 0;
            return (
              <BookCard
                key={book.id}
                book={book}
                progressPercent={prog}
                onOpenBook={onOpenBook}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};
