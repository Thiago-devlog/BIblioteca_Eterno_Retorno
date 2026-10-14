import React from 'react';
import { Author, Book } from '../types/library';
import { BookmarkCheck, BookOpen, Clock, RotateCcw } from 'lucide-react';

interface ReadingProgressSectionProps {
  authors: Author[];
  readingProgress: Record<string, { bookId: string; chapterIndex: number; progressPercent: number; lastReadDate: string }>;
  onOpenBook: (book: Book, chapterIndex?: number) => void;
  onResetProgress: (bookId: string) => void;
}

export const ReadingProgressSection: React.FC<ReadingProgressSectionProps> = ({
  authors,
  readingProgress,
  onOpenBook,
  onResetProgress,
}) => {
  const allBooks = authors.flatMap((a) =>
    a.books.map((b) => ({ book: b, author: a }))
  );

  const booksWithProgress = allBooks.filter(
    ({ book }) => readingProgress[book.id] && readingProgress[book.id].progressPercent > 0
  );

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="pb-6 border-b border-[#E0D7C2]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8C2D19] mb-2">
          <BookmarkCheck className="w-4 h-4" />
          <span>Registro Pessoal do Leitor</span>
        </div>
        <h2 className="font-display-title text-3xl sm:text-4xl font-bold text-[#1F1C18] tracking-tight">
          Seu Progresso de Leitura
        </h2>
        <p className="font-serif text-[#605748] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
          Suas posições de leitura, capítulos e porcentagens são salvos automaticamente conforme você avança nos textos integrais.
        </p>
      </div>

      {booksWithProgress.length === 0 ? (
        <div className="p-12 text-center bg-[#FAF7F0] border border-[#DDD3BF] rounded-sm">
          <BookOpen className="w-8 h-8 text-[#9E907B] mx-auto mb-3" />
          <h3 className="font-display-title text-lg font-bold text-[#1F1C18]">
            Nenhuma leitura em andamento
          </h3>
          <p className="font-serif text-sm text-[#726755] mt-1 max-w-md mx-auto">
            Abra qualquer pasta de autor ou livro no catálogo para iniciar a leitura e acompanhar seu avanço por aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {booksWithProgress.map(({ book, author }) => {
            const data = readingProgress[book.id];
            const currentChapter = book.chapters[data.chapterIndex] || book.chapters[0];

            return (
              <div
                key={book.id}
                className="bg-[#FAF7F0] border border-[#DCD1BA] rounded-sm p-6 shadow-xs flex flex-col justify-between hover:border-[#BFAF95] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-14 rounded-xs shrink-0 flex flex-col justify-between p-1 border shadow-xs"
                        style={{
                          backgroundColor: book.coverBg,
                          borderColor: book.coverBorderColor,
                          color: book.coverAccent,
                        }}
                      >
                        <span className="text-[6px] font-mono font-bold">
                          {book.originalYear}
                        </span>
                        <span className="font-cinzel text-[7px] leading-tight font-bold text-center line-clamp-2">
                          {book.title}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#7C6E59] block">
                          {author.shortName} · {book.originalYear}
                        </span>
                        <h4 className="font-display-title text-base sm:text-lg font-bold text-[#1F1C18]">
                          {book.title}
                        </h4>
                      </div>
                    </div>

                    <span className="text-sm font-mono font-bold text-[#8C2D19] bg-[#EDE4CF] px-2.5 py-1 rounded-xs">
                      {data.progressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-[#E9DEC6] rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-[#8C2D19] rounded-full transition-all duration-300"
                      style={{ width: `${data.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#706450] font-serif italic mb-6">
                    <span>
                      Último ponto: {currentChapter.number} ({currentChapter.title})
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] not-italic text-[#8C7E69]">
                      <Clock className="w-3 h-3" />
                      {data.lastReadDate}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8DEC9] flex items-center justify-between gap-3">
                  <button
                    onClick={() => onResetProgress(book.id)}
                    className="text-xs text-[#827663] hover:text-[#8C2D19] flex items-center gap-1 transition-colors"
                    title="Reiniciar progresso deste livro"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reiniciar</span>
                  </button>

                  <button
                    onClick={() => onOpenBook(book, data.chapterIndex)}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#221F1B] hover:bg-[#3B342C] text-[#FAF5EB] rounded-xs flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#E5AA42]" />
                    <span>Continuar Lendo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
