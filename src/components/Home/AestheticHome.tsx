import React from 'react';
import { BookItem, AuthorProfile } from '../../data/booksData';
import { BookOpen, Library, FolderArchive, ArrowRight, Flame, Clock } from 'lucide-react';

interface AestheticHomeProps {
  books: BookItem[];
  authors: AuthorProfile[];
  readingProgress: Record<string, { progressPercent: number }>;
  onOpenBook: (book: BookItem) => void;
  onGoToBookshelf: () => void;
  onGoToFolders: () => void;
  onSelectAuthor: (authorId: string) => void;
}

export const AestheticHome: React.FC<AestheticHomeProps> = ({
  books,
  authors,
  readingProgress,
  onOpenBook,
  onGoToBookshelf,
  onGoToFolders,
  onSelectAuthor,
}) => {
  const currentReadingBook = books.find((b) => b.id === 'quincas-borba') || books[0];
  const currentProg = readingProgress[currentReadingBook.id]?.progressPercent || 97;

  return (
    <div className="relative min-h-screen bg-[#160E22] text-[#F8F5FF] pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#C084FC] block">
            ETERNO RETORNO
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
            Boas-vindas, Leitor
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#291B3A] border border-[#A855F7]/30 flex items-center justify-center text-xl select-none">
            🦉
          </div>
        </div>
      </div>

      {/* Card Destaque: Continuar Lendo (Estilo Aesthetic Nook) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1B44] via-[#221535] to-[#170E22] border border-[#A855F7]/30 p-5 sm:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#A855F7]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FDE047] font-bold flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-[#FDE047]" />
            EM LEITURA ATIVA
          </span>
          <span className="font-mono text-xs font-bold text-[#C084FC]">
            {currentProg}% concluído
          </span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div
            className="book-spine-shadow w-16 h-24 sm:w-20 sm:h-28 rounded-xs shadow-lg p-2 flex flex-col justify-between shrink-0 border"
            style={{
              backgroundColor: currentReadingBook.coverBg,
              borderColor: currentReadingBook.coverBorder,
              color: currentReadingBook.coverAccent,
            }}
          >
            <span className="text-[7px] font-mono font-bold">{currentReadingBook.year}</span>
            <h4 className="font-display text-[8px] font-bold uppercase line-clamp-3 text-center my-auto">
              {currentReadingBook.title}
            </h4>
            <span className="text-[6px] uppercase tracking-tighter opacity-80 text-center">
              SÉC. XIX
            </span>
          </div>

          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight">
              {currentReadingBook.title}
            </h3>
            <p className="text-xs text-[#C4B5FD] font-sans mt-0.5">
              {currentReadingBook.author} · {currentReadingBook.category}
            </p>
            <p className="font-cormorant italic text-xs text-[#E9D5FF] mt-1.5 line-clamp-2">
              “{currentReadingBook.tagline}”
            </p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full h-2 bg-[#170E22] rounded-full overflow-hidden mb-4 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#A855F7] to-[#F59E0B] rounded-full transition-all duration-300"
            style={{ width: `${currentProg}%` }}
          />
        </div>

        <button
          onClick={() => onOpenBook(currentReadingBook)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7E22CE] to-[#9333EA] hover:from-[#6B21A8] hover:to-[#7E22CE] text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <BookOpen className="w-4 h-4 text-[#FDE047]" />
          <span>Retomar Leitura Imediata</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Banner de Acesso Rápido à Estante de Madeira */}
      <div
        onClick={onGoToBookshelf}
        className="rounded-2xl bg-[#241638] border border-[rgba(255,255,255,0.08)] p-4 flex items-center justify-between cursor-pointer hover:border-[#A855F7]/40 transition-all shadow-md group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7E22CE]/20 text-[#C084FC] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans text-sm font-bold text-white">
              Abrir Estante em Madeira Realista
            </h4>
            <p className="text-xs text-[#9D8EA8]">
              Veja seus livros empilhados com luminária de sal e miniaturas
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[#C084FC] group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Destaque de Autores do Século XIX */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#D8B4FE]">
            Dossiês de Escritores
          </h3>
          <button
            onClick={onGoToFolders}
            className="text-xs font-sans font-semibold text-[#FDE047] hover:underline cursor-pointer"
          >
            Ver Fichário de Pastas →
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {authors.map((author) => (
            <button
              key={author.id}
              onClick={() => {
                onSelectAuthor(author.id);
                onGoToFolders();
              }}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-[#241638] border border-[rgba(255,255,255,0.08)] hover:border-[#A855F7]/50 transition-all shrink-0 w-28 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#A855F7]/40 shadow-sm">
                <img
                  src={author.avatarUrl}
                  alt={author.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <span className="text-xs font-sans font-bold text-white truncate max-w-[90px]">
                {author.shortName}
              </span>
              <span className="text-[10px] text-[#A855F7] font-mono">
                {books.filter((b) => b.authorId === author.id).length} obras
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
