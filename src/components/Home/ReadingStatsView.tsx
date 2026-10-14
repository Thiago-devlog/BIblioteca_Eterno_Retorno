import React from 'react';
import { BookItem, DEFAULT_USER_LOG } from '../../data/booksData';
import { Flame, Clock, FileText, CheckCircle2, Trophy, BookOpen, RotateCcw } from 'lucide-react';

interface ReadingStatsViewProps {
  books: BookItem[];
  readingProgress: Record<string, { progressPercent: number }>;
  onOpenBook: (book: BookItem) => void;
  onResetProgress: (bookId: string) => void;
}

export const ReadingStatsView: React.FC<ReadingStatsViewProps> = ({
  books,
  readingProgress,
  onOpenBook,
  onResetProgress,
}) => {
  const logData = DEFAULT_USER_LOG;

  const activeBooks = books.filter(
    (b) => (readingProgress[b.id]?.progressPercent || 0) > 0
  );

  return (
    <div className="relative min-h-screen bg-[#160E22] text-[#F8F5FF] pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-[#C084FC] block">
          ESTATÍSTICAS &amp; VIGÍLIA
        </span>
        <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
          Registro de Leitura
        </h1>
        <p className="text-xs text-[#9D8EA8] mt-0.5">
          Acompanhamento do ritmo diário e progresso nas obras clássicas
        </p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Dias em Sequência */}
        <div className="p-4 rounded-2xl bg-[#241638] border border-[rgba(255,255,255,0.08)] shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#9D8EA8]">
              Vigília Contínua
            </span>
            <div className="w-7 h-7 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-[#F59E0B]" />
            </div>
          </div>
          <div>
            <span className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
              {logData.stats.consecutiveDays}
            </span>
            <span className="text-xs text-[#C4B5FD] font-semibold ml-1.5">dias seguidos</span>
          </div>
        </div>

        {/* Horas Totais */}
        <div className="p-4 rounded-2xl bg-[#241638] border border-[rgba(255,255,255,0.08)] shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#9D8EA8]">
              Mergulho
            </span>
            <div className="w-7 h-7 rounded-full bg-[#A855F7]/20 text-[#C084FC] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
              {logData.stats.deepHours}
            </span>
            <span className="text-xs text-[#C4B5FD] font-semibold ml-1.5">horas</span>
          </div>
        </div>

        {/* Páginas */}
        <div className="p-4 rounded-2xl bg-[#241638] border border-[rgba(255,255,255,0.08)] shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#9D8EA8]">
              Páginas
            </span>
            <div className="w-7 h-7 rounded-full bg-[#3B82F6]/20 text-[#60A5FA] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
              {logData.stats.pagesRead}
            </span>
            <span className="text-xs text-[#C4B5FD] font-semibold ml-1.5">páginas</span>
          </div>
        </div>

        {/* Capítulos */}
        <div className="p-4 rounded-2xl bg-[#241638] border border-[rgba(255,255,255,0.08)] shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#9D8EA8]">
              Capítulos
            </span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
              {logData.stats.chaptersCompleted}
            </span>
            <span className="text-xs text-[#C4B5FD] font-semibold ml-1.5">vencidos</span>
          </div>
        </div>
      </div>

      {/* Maratona Ativa */}
      <div className="p-5 rounded-2xl bg-[#241638] border border-[rgba(255,255,255,0.08)] shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#FDE047]" />
            <h3 className="font-sans text-sm font-bold text-white">
              {logData.activeMarathon.title}
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-[#FDE047]">
            {logData.activeMarathon.progress}%
          </span>
        </div>

        <div className="w-full h-2.5 bg-[#170E22] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#F59E0B] rounded-full"
            style={{ width: `${logData.activeMarathon.progress}%` }}
          />
        </div>
        <p className="text-[11px] text-[#9D8EA8]">
          {logData.activeMarathon.completedBooks} de {logData.activeMarathon.totalBooks} volumes concluídos
        </p>
      </div>

      {/* Fichas de Obras em Andamento */}
      <div className="space-y-3">
        <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#D8B4FE]">
          Livros em Progresso
        </h3>

        {activeBooks.map((book) => {
          const prog = readingProgress[book.id]?.progressPercent || 0;
          return (
            <div
              key={book.id}
              className="p-4 rounded-2xl bg-[#241638] border border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="book-spine-shadow w-10 h-14 rounded-xs p-1 flex flex-col justify-between border shrink-0 text-center"
                  style={{
                    backgroundColor: book.coverBg,
                    borderColor: book.coverBorder,
                    color: book.coverAccent,
                  }}
                >
                  <span className="text-[6px] font-mono font-bold">{book.year}</span>
                  <span className="font-display text-[6px] font-bold uppercase line-clamp-1">
                    {book.title}
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-white leading-tight">
                    {book.title}
                  </h4>
                  <span className="text-[11px] text-[#C4B5FD] font-sans">
                    {book.author} · {prog}% lido
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onResetProgress(book.id)}
                  className="p-2 rounded-lg text-[#9D8EA8] hover:text-[#EF4444] transition-colors cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onOpenBook(book)}
                  className="px-3 py-1.5 rounded-xl bg-[#7E22CE] hover:bg-[#9333EA] text-white text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Ler</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
