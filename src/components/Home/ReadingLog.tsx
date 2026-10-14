import React from 'react';
import { BookItem, DEFAULT_USER_LOG } from '../../data/booksData';
import {
  BookmarkCheck,
  Flame,
  Clock,
  BookOpen,
  CheckCircle2,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ReadingLogProps {
  books: BookItem[];
  readingProgress: Record<string, { progressPercent: number; lastLocation?: string }>;
  onOpenBook: (book: BookItem) => void;
  onResetProgress: (bookId: string) => void;
}

export const ReadingLog: React.FC<ReadingLogProps> = ({
  books,
  readingProgress,
  onOpenBook,
  onResetProgress,
}) => {
  const logData = DEFAULT_USER_LOG;

  // Obter as leituras em andamento a partir de readingProgress ou do padrão
  const activeBookItems = books.filter(
    (b) => readingProgress[b.id] && readingProgress[b.id].progressPercent > 0
  );

  return (
    <section className="space-y-8">
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[rgba(15,23,42,0.08)]">
        <div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A5B32] block mb-1">
            REGISTRO DO LEITOR &amp; MARATONA
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Caderno de Notas &amp; Vigília Literária
          </h2>
          <p className="font-cormorant italic text-sm sm:text-base text-[#64748B] mt-1">
            Simulação de mesa de estudos com fichas de leitura, dias em sequência e acompanhamento da maratona clássica.
          </p>
        </div>

        <span className="font-mono text-xs font-bold text-[#0F172A] bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] px-3 py-1 rounded-full shadow-xs">
          Meta Ativa: {logData.activeMarathon.title}
        </span>
      </div>

      {/* Cartões de Métricas de Estudo (Vigília Contínua, Tempo de Mergulho, Páginas, Capítulos) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Vigília Contínua */}
        <div className="bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B]">
              Vigília Contínua
            </span>
            <div className="w-8 h-8 rounded-full bg-[#B8860B]/15 text-[#B8860B] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-[#B8860B]" />
            </div>
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-[#0F172A]">
              {logData.stats.consecutiveDays}
            </span>
            <span className="font-sans text-xs text-[#64748B] ml-1.5 font-semibold">
              Dias seguidos
            </span>
          </div>
          <span className="font-cormorant italic text-xs text-[#9A5B32] mt-2 block">
            Ritmo constante de leitura
          </span>
        </div>

        {/* Tempo de Mergulho */}
        <div className="bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B]">
              Tempo de Mergulho
            </span>
            <div className="w-8 h-8 rounded-full bg-[#C28251]/15 text-[#C28251] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-[#0F172A]">
              {logData.stats.deepHours}
            </span>
            <span className="font-sans text-xs text-[#64748B] ml-1.5 font-semibold">
              Horas dedicadas
            </span>
          </div>
          <span className="font-cormorant italic text-xs text-[#9A5B32] mt-2 block">
            Sem interrupções
          </span>
        </div>

        {/* Páginas Percorridas */}
        <div className="bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B]">
              Páginas Percorridas
            </span>
            <div className="w-8 h-8 rounded-full bg-[#0F172A]/10 text-[#0F172A] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-[#0F172A]">
              {logData.stats.pagesRead}
            </span>
            <span className="font-sans text-xs text-[#64748B] ml-1.5 font-semibold">
              Páginas
            </span>
          </div>
          <span className="font-cormorant italic text-xs text-[#9A5B32] mt-2 block">
            Em edições fac-símiles
          </span>
        </div>

        {/* Capítulos Vencidos */}
        <div className="bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B]">
              Capítulos Vencidos
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-600/15 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-display text-3xl font-bold text-[#0F172A]">
              {logData.stats.chaptersCompleted}
            </span>
            <span className="font-sans text-xs text-[#64748B] ml-1.5 font-semibold">
              Capítulos
            </span>
          </div>
          <span className="font-cormorant italic text-xs text-[#9A5B32] mt-2 block">
            Com anotações salvas
          </span>
        </div>
      </div>

      {/* Barra Geral de Progresso da Maratona */}
      <div className="bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#C28251] block mb-1">
              MARATONA EM ANDAMENTO
            </span>
            <h3 className="font-display text-xl font-bold text-[#0F172A]">
              {logData.activeMarathon.title}
            </h3>
            <p className="font-cormorant italic text-sm text-[#64748B] mt-0.5">
              Volume atual: <span className="font-bold text-[#0F172A]">{logData.activeMarathon.currentBook}</span> · {logData.activeMarathon.completedBooks} de {logData.activeMarathon.totalBooks} obras concluídas
            </p>
          </div>

          <div className="text-right">
            <span className="font-mono text-2xl font-bold text-[#9A5B32]">
              {logData.activeMarathon.progress}%
            </span>
            <span className="block text-[11px] font-sans font-semibold text-[#64748B]">
              Progresso Geral
            </span>
          </div>
        </div>

        {/* Barra de Gradiente Terracota / Ouro */}
        <div className="w-full h-3 bg-[#F1ECE1] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#C28251] via-[#B8860B] to-[#C28251] rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${logData.activeMarathon.progress}%` }}
          />
        </div>
      </div>

      {/* Fichas Históricas das Obras em Andamento */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-[#0F172A]">
          Fichas das Obras em Andamento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeBookItems.length === 0 ? (
            <div className="col-span-2 p-10 text-center bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] rounded-2xl">
              <p className="font-cormorant italic text-[#64748B]">
                Inicie a leitura de qualquer livro do acervo para gerar sua ficha de estudos.
              </p>
            </div>
          ) : (
            activeBookItems.map((book) => {
              const currentProg = readingProgress[book.id]?.progressPercent || 0;
              const location =
                readingProgress[book.id]?.lastLocation ||
                (book.id === 'quincas-borba'
                  ? 'Cap. LXIV - pág. 142'
                  : 'Cap. II: O Emplasto - pág. 44');

              return (
                <div
                  key={book.id}
                  className="bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-[#B8860B]/40 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className="book-spine-shadow w-11 h-15 rounded-md shrink-0 flex flex-col justify-between p-1.5 border shadow-sm text-center"
                          style={{
                            backgroundColor: book.coverBg,
                            borderColor: book.coverBorder,
                            color: book.coverAccent,
                          }}
                        >
                          <span className="text-[7px] font-mono font-bold">
                            {book.year}
                          </span>
                          <span className="font-display text-[7px] font-bold line-clamp-2 uppercase">
                            {book.title}
                          </span>
                        </div>

                        <div>
                          <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
                            {book.author} · {book.year}
                          </span>
                          <h4 className="font-display text-base sm:text-lg font-bold text-[#0F172A] leading-tight">
                            {book.title}
                          </h4>
                          <span className="font-cormorant italic text-xs text-[#9A5B32]">
                            Última Parada: {location}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-sm font-bold text-[#9A5B32] bg-[#FAF4EB] border border-[#E9DEC6] px-2.5 py-1 rounded-md">
                        {currentProg}%
                      </span>
                    </div>

                    {/* Barra de Progresso Fina */}
                    <div className="w-full h-1.5 bg-[#F1ECE1] rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-[#C28251] rounded-full transition-all duration-300"
                        style={{ width: `${currentProg}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[rgba(15,23,42,0.08)] flex items-center justify-between gap-3">
                    <button
                      onClick={() => onResetProgress(book.id)}
                      className="text-xs font-sans text-[#64748B] hover:text-[#9A5B32] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reiniciar Ficha</span>
                    </button>

                    <button
                      onClick={() => onOpenBook(book)}
                      className="px-4 py-2 text-xs font-bold font-sans uppercase tracking-wider bg-[#0F172A] hover:bg-[#1E293B] text-[#FAF8F5] rounded-md flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>Continuar Leitura</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
