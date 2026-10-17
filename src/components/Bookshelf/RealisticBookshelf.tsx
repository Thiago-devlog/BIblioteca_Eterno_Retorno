import React, { useState } from 'react';
import { BookItem } from '../../data/booksData';
import {
  Layers,
  BookOpen,
  Sparkles,
  CheckCircle2,
  X,
  Bookmark,
  ChevronRight,
} from 'lucide-react';

interface RealisticBookshelfProps {
  books: BookItem[];
  readingProgress: Record<string, { progressPercent: number }>;
  onOpenBook: (book: BookItem) => void;
  onOpenFolders: () => void;
}

type FilterState = 'all' | 'reading' | 'unread';

export const RealisticBookshelf: React.FC<RealisticBookshelfProps> = ({
  books,
  readingProgress,
  onOpenBook,
  onOpenFolders,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterState>('all');
  const [selectedTag, setSelectedTag] = useState<string>('todos');
  const [inspectingBook, setInspectingBook] = useState<BookItem | null>(null);

  // Contadores
  const readingBooksCount = books.filter(
    (b) => (readingProgress[b.id]?.progressPercent || 0) > 0
  ).length;
  const unreadBooksCount = books.length - readingBooksCount;

  // Filtragem
  const filteredBooks = books.filter((b) => {
    const prog = readingProgress[b.id]?.progressPercent || 0;
    if (activeFilter === 'reading' && prog === 0) return false;
    if (activeFilter === 'unread' && prog > 0) return false;

    if (selectedTag === 'trilogia') {
      return (
        b.id === 'memorias-postumas' ||
        b.id === 'quincas-borba' ||
        b.id === 'dom-casmurro'
      );
    }
    if (selectedTag === 'sec-xix') {
      return b.century === 'XIX';
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-[#160E22] text-[#F8F5FF] pb-28 pt-4 px-4 sm:px-6 max-w-2xl mx-auto">
      {/* 1. TOPO DA BIBLIOTECA (Estilo idêntico à imagem de referência) */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FFFFFF]">
            Minha Biblioteca
          </h1>
          <p className="text-sm font-sans font-medium text-[#9D8EA8] mt-0.5">
            {books.length} obras canônicas registradas
          </p>
        </div>

        {/* Mascote Coruja Literária com Óculos e Livro (Como na referência) */}
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-b from-[#7E22CE] to-[#4C1D95] p-1.5 shadow-[0_4px_16px_rgba(126,34,206,0.5)] border border-[#A855F7]/30 flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-full bg-[#3B1768] flex items-center justify-center relative overflow-hidden">
            {/* Rosto da coruja */}
            <div className="text-2xl select-none" title="Mascote Guardião do Cânone">
              🦉
            </div>
            {/* Livro mini */}
            <div className="absolute bottom-0 w-8 h-2 bg-[#F3E8FF] rounded-t-xs shadow-xs" />
          </div>
        </div>
      </div>

      {/* 2. BARRA DE FILTROS SEGMENTADOS (All / Reading / Up Next) */}
      <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-5 py-2 rounded-2xl text-sm font-sans font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-[#8B5CF6] text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]'
              : 'bg-[#291B3A] text-[#B8A7C6] hover:text-white'
          }`}
        >
          Todas ({books.length})
        </button>

        <button
          onClick={() => setActiveFilter('reading')}
          className={`px-5 py-2 rounded-2xl text-sm font-sans font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'reading'
              ? 'bg-[#8B5CF6] text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]'
              : 'bg-[#291B3A] text-[#B8A7C6] hover:text-white'
          }`}
        >
          Lendo ({readingBooksCount})
        </button>

        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-5 py-2 rounded-2xl text-sm font-sans font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'unread'
              ? 'bg-[#8B5CF6] text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)]'
              : 'bg-[#291B3A] text-[#B8A7C6] hover:text-white'
          }`}
        >
          Próximas ({unreadBooksCount})
        </button>
      </div>

      {/* 3. SUB-TAGS PÍLULAS COM EMOJIS (Beach reads / Arc na referência) */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedTag(selectedTag === 'trilogia' ? 'todos' : 'trilogia')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap border ${
            selectedTag === 'trilogia'
              ? 'bg-[#5B21B6] border-[#A855F7] text-white'
              : 'bg-[#2D1B44] border-[rgba(255,255,255,0.08)] text-[#D8B4FE] hover:bg-[#382255]'
          }`}
        >
          <span>🏛️</span>
          <span>Trilogia Realista</span>
        </button>

        <button
          onClick={() => setSelectedTag(selectedTag === 'sec-xix' ? 'todos' : 'sec-xix')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap border ${
            selectedTag === 'sec-xix'
              ? 'bg-[#5B21B6] border-[#A855F7] text-white'
              : 'bg-[#241638] border-[rgba(255,255,255,0.08)] text-[#C4B5FD] hover:bg-[#2F1D49]'
          }`}
        >
          <span>📜</span>
          <span>Obras do Séc. XIX</span>
        </button>

        <button
          onClick={onOpenFolders}
          className="px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold bg-[#241638] border border-[rgba(255,255,255,0.08)] text-[#FDE047] hover:bg-[#2F1D49] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ml-auto"
        >
          <span>✍️</span>
          <span>Pastas de Autores</span>
        </button>
      </div>

      {/* 4. A ESTANTE DE MADEIRA REALISTA COM 4 PRATELEIRAS & MINIATURAS */}
      <div className="space-y-10 sm:space-y-12">
        {/* ===================== PRATELEIRA 1 ===================== */}
        <div className="relative">
          <div className="flex items-end justify-between px-2 pb-1 gap-2 sm:gap-3">
            {/* Quadro em moldura dourada pendurado na parede (Como o cachorrinho na moldura da foto de referência!) */}
            <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-md bg-[#2D1A10] p-1.5 border-4 border-[#C28251] shadow-2xl shrink-0 flex flex-col justify-between -mb-2 z-10 transition-transform hover:scale-105 cursor-pointer">
              {/* Gancho dourado superior */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-[#D4AF37] rotate-45" />
              <div className="relative w-full h-full rounded-xs overflow-hidden bg-[#0F172A] border border-[#8C5E35]">
                <img
                  src="/assets/authors/machado-de-assis.webp"
                  alt="Retrato histórico clássico de Machado de Assis"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover grayscale contrast-125"
                  onError={(e) => {
                    const t = e.currentTarget;
                    if (t.src.endsWith('.webp')) t.src = '/assets/authors/machado-de-assis.jpg';
                  }}
                />
              </div>
              <span className="block text-[7px] font-mono uppercase tracking-widest text-center text-[#E5C198] font-bold mt-0.5">
                Machado · 1897
              </span>
            </div>

            {/* Livros da Prateleira 1 */}
            {books.slice(0, 3).map((book) => {
              const prog = readingProgress[book.id]?.progressPercent || 0;
              return (
                <div
                  key={book.id}
                  onClick={() => setInspectingBook(book)}
                  className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-3 z-10"
                >
                  <div
                    className="book-spine-shadow book-cover-sheen w-18 h-28 sm:w-22 sm:h-34 rounded-xs shadow-xl p-2 flex flex-col justify-between text-left border"
                    style={{
                      backgroundColor: book.coverBg,
                      borderColor: book.coverBorder,
                      color: book.coverAccent,
                    }}
                  >
                    <div className="flex justify-between text-[7px] font-mono font-bold">
                      <span className="truncate max-w-[40px] uppercase opacity-75">{book.category}</span>
                      <span>{book.year}</span>
                    </div>

                    <h4 className="font-display text-[8px] sm:text-[9px] font-bold leading-tight uppercase line-clamp-3 text-center my-auto">
                      {book.title}
                    </h4>

                    <span className="text-[6px] uppercase tracking-tighter truncate opacity-70 font-sans text-center">
                      {book.author}
                    </span>

                    {prog > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
                        <div className="h-full bg-[#C28251]" style={{ width: `${prog}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tábua de Madeira 3D da Prateleira 1 */}
          <div className="wooden-shelf-plank" />
        </div>

        {/* ===================== PRATELEIRA 2 ===================== */}
        <div className="relative">
          <div className="flex items-end justify-between px-2 pb-1 gap-2 sm:gap-3">
            {/* Livro 4: O Cortiço */}
            {books[3] && (
              <div
                onClick={() => setInspectingBook(books[3])}
                className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-3 z-10"
              >
                <div
                  className="book-spine-shadow book-cover-sheen w-18 h-28 sm:w-22 sm:h-34 rounded-xs shadow-xl p-2 flex flex-col justify-between text-left border"
                  style={{
                    backgroundColor: books[3].coverBg,
                    borderColor: books[3].coverBorder,
                    color: books[3].coverAccent,
                  }}
                >
                  <div className="flex justify-between text-[7px] font-mono font-bold">
                    <span>1890</span>
                  </div>
                  <h4 className="font-display text-[8px] sm:text-[9px] font-bold leading-tight uppercase line-clamp-3 text-center my-auto">
                    {books[3].title}
                  </h4>
                  <span className="text-[6px] uppercase truncate opacity-70 font-sans text-center">
                    {books[3].author}
                  </span>
                </div>
              </div>
            )}

            {/* Livro 5: O Ateneu */}
            {books[5] && (
              <div
                onClick={() => setInspectingBook(books[5])}
                className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-3 z-10"
              >
                <div
                  className="book-spine-shadow book-cover-sheen w-18 h-28 sm:w-22 sm:h-34 rounded-xs shadow-xl p-2 flex flex-col justify-between text-left border"
                  style={{
                    backgroundColor: books[5].coverBg,
                    borderColor: books[5].coverBorder,
                    color: books[5].coverAccent,
                  }}
                >
                  <div className="flex justify-between text-[7px] font-mono font-bold">
                    <span>1888</span>
                  </div>
                  <h4 className="font-display text-[8px] sm:text-[9px] font-bold leading-tight uppercase line-clamp-3 text-center my-auto">
                    {books[5].title}
                  </h4>
                  <span className="text-[6px] uppercase truncate opacity-70 font-sans text-center">
                    {books[5].author}
                  </span>
                </div>
              </div>
            )}

            {/* Livro Inclinado: Iracema (Como Tolstoy na referência) */}
            {books[4] && (
              <div
                onClick={() => setInspectingBook(books[4])}
                className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-3 z-10 rotate-3 origin-bottom-left"
              >
                <div
                  className="book-spine-shadow book-cover-sheen w-18 h-29 sm:w-22 sm:h-35 rounded-xs shadow-xl p-2 flex flex-col justify-between text-left border"
                  style={{
                    backgroundColor: books[4].coverBg,
                    borderColor: books[4].coverBorder,
                    color: books[4].coverAccent,
                  }}
                >
                  <div className="flex justify-between text-[7px] font-mono font-bold">
                    <span>1865</span>
                  </div>
                  <h4 className="font-display text-[8px] sm:text-[9px] font-bold leading-tight uppercase line-clamp-3 text-center my-auto">
                    {books[4].title}
                  </h4>
                  <span className="text-[6px] uppercase truncate opacity-70 font-sans text-center">
                    {books[4].author}
                  </span>
                </div>
              </div>
            )}

            {/* MINIATURA: Luminária de Sal Rosa do Himalaia (Exatamente como na foto de referência!) */}
            <div
              className="salt-lamp-glow relative w-16 h-24 sm:w-20 sm:h-28 shrink-0 flex flex-col items-center justify-end z-10 select-none cursor-pointer"
              title="Luminária de Sal Rosa do Himalaia acesa"
            >
              {/* Cristal de sal com gradiente e textura natural */}
              <div className="relative w-14 h-20 sm:w-16 sm:h-22 bg-gradient-to-t from-[#EA580C] via-[#FB923C] to-[#FED7AA] rounded-t-full shadow-[0_0_25px_rgba(251,146,60,0.8)] border border-[#FDBA74]/50 flex items-center justify-center">
                <div className="w-8 h-12 bg-white/30 rounded-full blur-xs" />
                <span className="absolute bottom-1 text-[8px] font-mono text-[#7C2D12] opacity-80 font-bold">
                  AMBER
                </span>
              </div>
              {/* Base de madeira escura torneada */}
              <div className="w-16 sm:w-18 h-3.5 bg-[#2B1810] border-t border-[#8B5A2B] rounded-xs shadow-md -mt-1" />
            </div>
          </div>

          {/* Tábua de Madeira 3D da Prateleira 2 */}
          <div className="wooden-shelf-plank" />
        </div>

        {/* ===================== PRATELEIRA 3 ===================== */}
        <div className="relative">
          <div className="flex items-end justify-between px-2 pb-1 gap-2 sm:gap-3">
            {/* MINIATURA: Busto Clássico de Bronze/Mármore (Exatamente como na imagem de referência!) */}
            <div
              className="relative w-16 h-28 sm:w-20 sm:h-32 shrink-0 flex flex-col items-center justify-end z-10 select-none cursor-pointer transition-transform hover:scale-105"
              title="Busto Clássico em Bronze de Filósofo"
            >
              {/* Escultura do busto */}
              <div className="relative w-12 h-18 sm:w-14 sm:h-20 bg-gradient-to-b from-[#A3927C] via-[#6B5C49] to-[#3E3427] rounded-t-2xl shadow-xl border border-[#BDB09E]/40 flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl">🗿</span>
                <span className="text-[6px] font-mono uppercase tracking-widest text-[#E8DCCF] font-bold">
                  CÂNONE
                </span>
              </div>
              {/* Pedestal de mármore */}
              <div className="w-14 sm:w-16 h-4 bg-[#231E18] border-t border-[#8C7A65] rounded-xs shadow-md" />
            </div>

            {/* Livro 6: O Navio Negreiro */}
            {books[6] && (
              <div
                onClick={() => setInspectingBook(books[6])}
                className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-3 z-10"
              >
                <div
                  className="book-spine-shadow book-cover-sheen w-18 h-28 sm:w-22 sm:h-34 rounded-xs shadow-xl p-2 flex flex-col justify-between text-left border"
                  style={{
                    backgroundColor: books[6].coverBg,
                    borderColor: books[6].coverBorder,
                    color: books[6].coverAccent,
                  }}
                >
                  <div className="flex justify-between text-[7px] font-mono font-bold">
                    <span>1870</span>
                  </div>
                  <h4 className="font-display text-[8px] sm:text-[9px] font-bold leading-tight uppercase line-clamp-3 text-center my-auto">
                    {books[6].title}
                  </h4>
                  <span className="text-[6px] uppercase truncate opacity-70 font-sans text-center">
                    {books[6].author}
                  </span>
                </div>
              </div>
            )}

            {/* Livro 7: Triste Fim de Policarpo Quaresma */}
            {books[7] && (
              <div
                onClick={() => setInspectingBook(books[7])}
                className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-3 z-10"
              >
                <div
                  className="book-spine-shadow book-cover-sheen w-18 h-28 sm:w-22 sm:h-34 rounded-xs shadow-xl p-2 flex flex-col justify-between text-left border"
                  style={{
                    backgroundColor: books[7].coverBg,
                    borderColor: books[7].coverBorder,
                    color: books[7].coverAccent,
                  }}
                >
                  <div className="flex justify-between text-[7px] font-mono font-bold">
                    <span>1911</span>
                  </div>
                  <h4 className="font-display text-[8px] sm:text-[9px] font-bold leading-tight uppercase line-clamp-3 text-center my-auto">
                    {books[7].title}
                  </h4>
                  <span className="text-[6px] uppercase truncate opacity-70 font-sans text-center">
                    {books[7].author}
                  </span>
                </div>
              </div>
            )}

            {/* Livro 1 repetido para completar a prateleira */}
            {books[0] && (
              <div
                onClick={() => setInspectingBook(books[0])}
                className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-3 z-10"
              >
                <div
                  className="book-spine-shadow book-cover-sheen w-18 h-28 sm:w-22 sm:h-34 rounded-xs shadow-xl p-2 flex flex-col justify-between text-left border"
                  style={{
                    backgroundColor: books[0].coverBg,
                    borderColor: books[0].coverBorder,
                    color: books[0].coverAccent,
                  }}
                >
                  <div className="flex justify-between text-[7px] font-mono font-bold">
                    <span>1881</span>
                  </div>
                  <h4 className="font-display text-[8px] sm:text-[9px] font-bold leading-tight uppercase line-clamp-3 text-center my-auto">
                    {books[0].title}
                  </h4>
                  <span className="text-[6px] uppercase truncate opacity-70 font-sans text-center">
                    {books[0].author}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tábua de Madeira 3D da Prateleira 3 */}
          <div className="wooden-shelf-plank" />
        </div>

        {/* ===================== PRATELEIRA 4 ===================== */}
        <div className="relative">
          <div className="flex items-end justify-between px-2 pb-1 gap-2 sm:gap-3">
            {books.slice(1, 4).map((book) => (
              <div
                key={book.id + '-shelf4'}
                onClick={() => setInspectingBook(book)}
                className="group relative flex flex-col items-center cursor-pointer transition-transform duration-300 hover:-translate-y-3 z-10"
              >
                <div
                  className="book-spine-shadow book-cover-sheen w-18 h-28 sm:w-22 sm:h-34 rounded-xs shadow-xl p-2 flex flex-col justify-between text-left border"
                  style={{
                    backgroundColor: book.coverBg,
                    borderColor: book.coverBorder,
                    color: book.coverAccent,
                  }}
                >
                  <div className="flex justify-between text-[7px] font-mono font-bold">
                    <span>{book.year}</span>
                  </div>
                  <h4 className="font-display text-[8px] sm:text-[9px] font-bold leading-tight uppercase line-clamp-3 text-center my-auto">
                    {book.title}
                  </h4>
                  <span className="text-[6px] uppercase truncate opacity-70 font-sans text-center">
                    {book.author}
                  </span>
                </div>
              </div>
            ))}

            {/* MINIATURA: Escritor Clássico com Cachimbo & Chapéu (Como na referência!) */}
            <div
              className="relative w-16 h-26 sm:w-20 sm:h-30 shrink-0 flex flex-col items-center justify-end z-10 select-none cursor-pointer transition-transform hover:scale-105"
              title="Miniatura de Época: Escritor com Cachimbo"
            >
              <div className="relative w-12 h-18 sm:w-14 sm:h-20 bg-gradient-to-b from-[#81654E] via-[#523F2F] to-[#241A13] rounded-t-xl shadow-xl border border-[#A48265]/40 flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl">🕵️</span>
                <span className="text-[6px] font-mono uppercase tracking-widest text-[#E8DCCF] font-bold">
                  BRUXO
                </span>
              </div>
              <div className="w-14 sm:w-16 h-3 bg-[#1D150F] border-t border-[#6E553F] rounded-xs shadow-md" />
            </div>
          </div>

          {/* Tábua de Madeira 3D da Prateleira 4 */}
          <div className="wooden-shelf-plank" />
        </div>
      </div>

      {/* 5. FLOATING ACTION BUTTON (FAB com pilha de livros - exatamente como na referência!) */}
      <div className="fixed bottom-24 right-6 sm:right-8 z-30">
        <button
          onClick={onOpenFolders}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#7E22CE] to-[#A855F7] text-white shadow-[0_8px_24px_rgba(168,85,247,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-[#E9D5FF]/30"
          title="Abrir Arquivo & Fichário de Pastas de Autores"
        >
          <Layers className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* 6. MODAL DE INSPEÇÃO RÁPIDA DE LIVRO AO CLICAR NA PRATELEIRA */}
      {inspectingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#221634] border border-[#A855F7]/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-left">
            <button
              onClick={() => setInspectingBook(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#311F49] text-[#CBD5E1] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-5 mb-5">
              {/* Capa ampliada */}
              <div
                className="book-spine-shadow w-24 h-36 rounded-sm shadow-xl p-2.5 flex flex-col justify-between shrink-0 border"
                style={{
                  backgroundColor: inspectingBook.coverBg,
                  borderColor: inspectingBook.coverBorder,
                  color: inspectingBook.coverAccent,
                }}
              >
                <span className="text-[8px] font-mono font-bold">{inspectingBook.year}</span>
                <h4 className="font-display text-[10px] font-bold uppercase leading-tight text-center my-auto">
                  {inspectingBook.title}
                </h4>
                <span className="text-[7px] uppercase tracking-tighter opacity-80 text-center">
                  {inspectingBook.century}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C084FC] font-bold block mb-1">
                  {inspectingBook.category} · {inspectingBook.year}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                  {inspectingBook.title}
                </h3>
                <p className="text-xs text-[#D8B4FE] font-sans font-medium mt-1">
                  {inspectingBook.author}
                </p>


              </div>
            </div>

            <p className="font-cormorant italic text-sm text-[#F1E8FF] leading-relaxed mb-4">
              “{inspectingBook.tagline}”
            </p>

            <p className="text-xs text-[#C4B5FD] font-sans leading-relaxed line-clamp-3 mb-6">
              {inspectingBook.description}
            </p>

            {/* Ações */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const b = inspectingBook;
                  setInspectingBook(null);
                  onOpenBook(b);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#7E22CE] to-[#9333EA] hover:from-[#6B21A8] hover:to-[#7E22CE] text-white font-sans font-bold text-sm shadow-[0_4px_16px_rgba(147,51,234,0.5)] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Abrir no Leitor Imersivo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
