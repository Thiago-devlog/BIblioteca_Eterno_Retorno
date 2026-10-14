import React from 'react';
import { AuthorProfile, BookItem } from '../../data/booksData';
import { Library, Sparkles } from 'lucide-react';

interface BookshelfViewProps {
  authors: AuthorProfile[];
  books: BookItem[];
  onOpenBook: (book: BookItem) => void;
  readingProgress: Record<string, { progressPercent: number }>;
}

export const BookshelfView: React.FC<BookshelfViewProps> = ({
  authors,
  books,
  onOpenBook,
  readingProgress,
}) => {
  return (
    <section className="space-y-8">
      {/* Cabeçalho da Estante */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[rgba(15,23,42,0.08)]">
        <div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A5B32] block mb-1">
            ESTANTE REALISTA EM MADEIRA MACIÇA
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            A Estante dos Clássicos &amp; Miniaturas
          </h2>
          <p className="font-cormorant italic text-sm sm:text-base text-[#64748B] mt-1">
            Inspirada na visualização aconchegante de estantes físicas com miniaturas de época, bustos históricos e lamparinas.
          </p>
        </div>

        <span className="font-mono text-xs font-bold text-[#0F172A] bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] px-3 py-1 rounded-full shadow-xs">
          {books.length} Volumes na Estante
        </span>
      </div>

      {/* Estrutura da Estante de Madeira */}
      <div className="bg-[#1C1613] rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-[#302621]">
        {authors.map((author, shelfIndex) => {
          const authorBooks = books.filter((b) => b.authorId === author.id);
          if (authorBooks.length === 0) return null;

          return (
            <div key={author.id} className="mb-14 last:mb-2">
              {/* Plaqueta de latão da prateleira */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#3D322B]">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold bg-[#A87B32] text-[#1E1712] rounded-sm shadow-xs">
                    PRATELEIRA {shelfIndex + 1}
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#EAE2D3] tracking-wide">
                    {author.name}
                  </h3>
                </div>
                <span className="font-cormorant italic text-xs text-[#A69986] hidden sm:inline">
                  {author.movement} · {author.lifespan}
                </span>
              </div>

              {/* Livros alinhados sobre a prateleira com física de sombra */}
              <div className="relative pt-6 pb-2 px-4 flex flex-wrap items-end gap-6 sm:gap-8 justify-start">
                {authorBooks.map((book) => {
                  const prog = readingProgress[book.id]?.progressPercent || 0;
                  return (
                    <button
                      key={book.id}
                      onClick={() => onOpenBook(book)}
                      className="group relative flex flex-col items-center focus-visible:outline-none text-left cursor-pointer transition-transform duration-300 hover:-translate-y-3"
                      title={`${book.title} (${book.year}) - Clique para ler`}
                    >
                      <div
                        className="book-spine-shadow book-cover-sheen relative w-24 h-36 rounded-xs shadow-md overflow-hidden flex flex-col justify-between p-2.5 border"
                        style={{
                          backgroundColor: book.coverBg,
                          borderColor: book.coverBorder,
                          color: book.coverAccent,
                        }}
                      >
                        {/* Lombada física */}
                        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/35 via-white/10 to-transparent pointer-events-none" />

                        <div className="flex justify-between items-start text-[8px] font-mono opacity-80 pl-1">
                          <span className="truncate max-w-[48px] uppercase">{book.category}</span>
                          <span className="font-bold">{book.year}</span>
                        </div>

                        <div className="text-center my-auto px-1">
                          <h4 className="font-display text-[9px] leading-tight font-bold line-clamp-3 uppercase">
                            {book.title}
                          </h4>
                        </div>

                        <div className="text-[7px] text-center opacity-70 tracking-tighter truncate uppercase font-sans">
                          {author.shortName}
                        </div>

                        {prog > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                            <div
                              className="h-full bg-[#C28251]"
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <span className="mt-2 text-xs font-display text-[#EAE2D3] font-medium text-center line-clamp-1 max-w-[100px] group-hover:text-[#B8860B]">
                        {book.title}
                      </span>
                    </button>
                  );
                })}

                {/* Miniaturas Literárias de Decoração */}
                {shelfIndex === 0 && (
                  <div className="ml-auto hidden md:flex flex-col items-center opacity-85 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-16 rounded-t-full bg-gradient-to-b from-[#A89882] to-[#695E51] border border-[#8C7E6C] shadow-md flex items-center justify-center text-[9px] font-mono text-[#1E1712] text-center p-1 font-bold">
                      Busto Machado
                    </div>
                    <div className="w-14 h-3 bg-[#42372E] border-t border-[#6E5D4E] rounded-xs" />
                    <span className="text-[8px] font-mono text-[#8C7F6D] mt-1 uppercase tracking-tighter">
                      Acervo ABL
                    </span>
                  </div>
                )}

                {shelfIndex === 1 && (
                  <div className="ml-auto hidden md:flex flex-col items-center opacity-80">
                    <div className="w-10 h-14 bg-gradient-to-b from-[#D49842] to-[#915B1E] rounded-sm shadow-md flex items-center justify-center text-xs text-[#FFF3DE]">
                      🕯️
                    </div>
                    <div className="w-12 h-2.5 bg-[#42372E] rounded-xs" />
                    <span className="text-[8px] font-mono text-[#8C7F6D] mt-1 uppercase tracking-tighter">
                      Lamparina
                    </span>
                  </div>
                )}
              </div>

              {/* Tábua de Madeira da Prateleira com Relevo */}
              <div className="relative h-6 bg-gradient-to-r from-[#593E2B] via-[#755239] to-[#593E2B] rounded-xs shadow-xl border-t border-[#8A6347] flex flex-col justify-between mt-1">
                <div className="h-1 bg-white/10" />
                <div className="h-2 bg-black/40" />
              </div>
              <div className="h-4 bg-gradient-to-b from-black/60 to-transparent" />
            </div>
          );
        })}
      </div>
    </section>
  );
};
