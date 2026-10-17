import React from 'react';
import { AuthorProfile, BookItem } from '../../data/catalog';
import {
  X,
  BookOpen,
  Quote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Award,
  History,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { calculateBookReadingTimeMinutes, formatReadingTime } from '../../utils/readingTime';

export interface AuthorEditorialModalProps {
  author: AuthorProfile | null;
  authors?: AuthorProfile[];
  books: BookItem[];
  isOpen: boolean;
  onClose: () => void;
  onOpenBook: (book: BookItem) => void;
  onSelectAuthor?: (author: AuthorProfile) => void;
  readingProgress?: Record<string, { progressPercent: number }>;
  themeMode?: 'light' | 'dark' | 'amber';
}

export const AuthorEditorialModal: React.FC<AuthorEditorialModalProps> = ({
  author,
  authors = [],
  books,
  isOpen,
  onClose,
  onOpenBook,
  onSelectAuthor,
  readingProgress = {},
  themeMode = 'light',
}) => {
  if (!isOpen || !author) return null;

  const authorBooks = books.filter((b) => b.authorId === author.id);

  // Navegação entre autores dentro do próprio modal
  const currentIndex = authors.findIndex((a) => a.id === author.id);
  const hasPrev = authors.length > 1 && currentIndex > 0;
  const hasNext = authors.length > 1 && currentIndex < authors.length - 1;

  const handlePrev = () => {
    if (hasPrev && onSelectAuthor) {
      onSelectAuthor(authors[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onSelectAuthor) {
      onSelectAuthor(authors[currentIndex + 1]);
    }
  };

  // Primeira obra para leitura rápida
  const primaryBook = authorBooks[0] || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop com desfoque de museu idêntico ao modal de livros */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Janela Modal com Transição de Mola (Spring Physics) idêntica à do livro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.8 }}
        className="relative w-full max-w-2xl lg:max-w-3xl bg-white dark:bg-[#141824] rounded-[28px] sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-left max-h-[92vh] overflow-y-auto z-10"
      >
        {/* Controles de Topo: Navegação rápida e Botão Fechar */}
        <div className="flex items-center justify-between mb-4">
          {authors.length > 1 ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                disabled={!hasPrev}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  hasPrev
                    ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    : 'opacity-30 cursor-not-allowed border-transparent text-slate-400'
                }`}
                title="Autor anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1">
                {currentIndex + 1} de {authors.length}
              </span>

              <button
                onClick={handleNext}
                disabled={!hasNext}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  hasNext
                    ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                    : 'opacity-30 cursor-not-allowed border-transparent text-slate-400'
                }`}
                title="Próximo autor"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div />
          )}

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Fechar Dossiê"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Cabeçalho do Autor: Moldura de Galeria com Levitação Suave + Metadados */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          {/* Moldura com Foto Cobrindo Todo o Canto e Levitação Suave */}
          <div className="flex flex-col items-center shrink-0">
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="relative w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.42)] border-2 border-[#543D2A] z-10 bg-stone-950"
            >
              {/* Foto histórica cobrindo todo o canto perfeitamente em WebP com Lazy Loading */}
              <img
                src={author.avatarUrl}
                alt={`Retrato de ${author.name}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
                style={{ filter: 'sepia(0.14) contrast(1.08)' }}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.endsWith('.webp')) {
                    target.src = target.src.replace('.webp', '.jpg');
                  } else if (target.src !== author.portraitUrl) {
                    target.src = author.portraitUrl;
                  }
                }}
              />

              {/* Filete dourado chanfrado interno contornando toda a moldura até os cantos */}
              <div className="absolute inset-0 rounded-[14px] ring-1 ring-inset ring-[#D4AF37]/60 pointer-events-none" />

              {/* Vinheta suave e reflexo de vidro de museu */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />

              {/* Plaqueta de Museu em Latão Escovado no rodapé */}
              <div className="absolute bottom-2 left-2 right-2 py-1 px-2 rounded-xs bg-gradient-to-r from-[#A8873E]/95 via-[#E6D090]/95 to-[#A8873E]/95 backdrop-blur-xs border border-[#7A5B20] shadow-[0_2px_4px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] flex items-center justify-between text-center select-none">
                <div className="w-1 h-1 rounded-full bg-[#593E13] shadow-inner shrink-0" />
                <div className="px-1 truncate w-full text-center">
                  <p className="font-cinzel text-[9.5px] font-bold text-[#342006] tracking-[0.1em] uppercase truncate leading-tight">
                    {author.name}
                  </p>
                  <p className="text-[8px] font-mono font-semibold text-[#5B3E13] tracking-widest uppercase">
                    {author.lifespan}
                  </p>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#593E13] shadow-inner shrink-0" />
              </div>
            </motion.div>

            {/* Sombra de apoio que respira suavemente acompanhando a levitação */}
            <motion.div
              animate={{ scale: [1, 0.85, 1], opacity: [0.3, 0.15, 0.3] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="w-24 h-2 bg-black/40 blur-xs rounded-full mt-2"
            />
          </div>

          {/* Dados do Autor: Tipografia Editorial */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 text-center sm:text-left space-y-2"
          >
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {author.movement}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                {author.lifespan}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-black/5 dark:bg-white/5">
                {author.archiveCode}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black text-black dark:text-white leading-tight">
              {author.name}
            </h2>

            <p className="font-sans text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
              {author.role}
            </p>

            <p className="text-xs font-serif text-amber-700 dark:text-amber-400 italic">
              {author.tagline}
            </p>
          </motion.div>
        </div>

        {/* Citação Célebre do Autor */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border-l-3 border-amber-600 p-3.5 rounded-r-xl mb-6">
          <div className="flex items-start gap-2">
            <Quote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-cormorant italic text-sm sm:text-base text-slate-800 dark:text-slate-200">
              “{author.quote}”
            </p>
          </div>
        </div>

        {/* Biografia & Trajetória Canônica */}
        <div className="space-y-2 mb-6">
          <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Biografia &amp; Trajetória Canônica
          </h3>
          <p className="font-reading text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {author.bio}
          </p>
        </div>

        {/* Ficha Técnica em 3 Colunas (idêntica ao modal do livro) */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 mb-6 text-center">
          <div>
            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Obras no Acervo
            </span>
            <span className="font-sans font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              {authorBooks.length} {authorBooks.length === 1 ? 'Obra Completa' : 'Obras Completas'}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Tempo Total
            </span>
            <span className="font-sans font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              ~{formatReadingTime(authorBooks.reduce((acc, b) => acc + calculateBookReadingTimeMinutes(b), 0))}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Escola Literária
            </span>
            <span className="font-sans font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-400 truncate block">
              {author.movement}
            </span>
          </div>
        </div>

        {/* Obras Canônicas do Autor no Acervo com Leitura Direta */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Obras Disponíveis para Leitura Imediata
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Todas em Edição Completa
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {authorBooks.map((book) => {
              const bookProgress = readingProgress[book.id]?.progressPercent || 0;
              const estTime = formatReadingTime(calculateBookReadingTimeMinutes(book));
              return (
                <div
                  key={book.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-amber-500/50 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Capa Miniatura com Cor Original */}
                    <div
                      className="w-10 h-14 rounded-sm p-1 flex flex-col justify-between text-center shrink-0 shadow-sm border"
                      style={{
                        backgroundColor: book.coverBg,
                        borderColor: book.coverBorder,
                        color: book.coverAccent,
                      }}
                    >
                      <span className="text-[7px] font-mono font-bold leading-none">
                        {book.year}
                      </span>
                      <span className="text-[8px] font-display font-black uppercase leading-tight line-clamp-2">
                        {book.title}
                      </span>
                      <span className="text-[6px] uppercase tracking-tighter opacity-80 leading-none">
                        {book.century}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-display text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-[11px] font-cormorant italic text-slate-600 dark:text-slate-400 truncate">
                        {book.tagline}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[8px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/60 px-1.5 py-0.2 rounded">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                          Obra Completa
                        </span>
                        <span className="inline-flex items-center gap-1 text-[8.5px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.2 rounded">
                          <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                          ~{estTime}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                          {book.chapters.length} caps
                        </span>
                        {bookProgress > 0 && (
                          <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1 rounded-sm">
                            {bookProgress}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botão de Ler */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBook(book);
                    }}
                    className="shrink-0 p-2 sm:px-3 sm:py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-sans font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                    title={`Ler ${book.title}`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ler</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botões de Ação Principais no Rodapé */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 pt-2"
        >
          {primaryBook && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onClose();
                onOpenBook(primaryBook);
              }}
              className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-sans font-bold text-sm shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ler Obra Principal ({primaryBook.title})</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-sans font-bold text-xs transition-colors cursor-pointer"
          >
            Fechar Dossiê
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
