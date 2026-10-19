import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookMarked,
  X,
  Play,
  CheckCircle2,
  Trash2,
  Clock,
  BookOpen,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { BookItem } from '../../data/booksData';

export interface ReadingProgressRecord {
  progressPercent: number;
  chapterIndex?: number;
  lastLocation?: string;
  lastReadTimestamp?: number;
  isCompleted?: boolean;
}

interface ReadingHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  books: BookItem[];
  readingProgress: Record<string, ReadingProgressRecord>;
  themeMode: 'light' | 'dark' | 'amber';
  onResumeBook: (book: BookItem, chapterIndex?: number) => void;
  onInspectBook: (book: BookItem) => void;
  onToggleMarkAsRead: (bookId: string) => void;
  onRemoveFromHistory: (bookId: string) => void;
  onClearAllHistory?: () => void;
}

export const ReadingHistoryDrawer: React.FC<ReadingHistoryDrawerProps> = ({
  isOpen,
  onClose,
  books,
  readingProgress,
  themeMode,
  onResumeBook,
  onInspectBook,
  onToggleMarkAsRead,
  onRemoveFromHistory,
  onClearAllHistory,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Escuta tecla ESC para fechar gaveta
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Transforma o dicionário de progresso em uma lista ordenada por data recente
  const historyEntries = useMemo(() => {
    const entries = Object.entries(readingProgress)
      .map(([bookId, prog]) => {
        const book = books.find((b) => b.id === bookId);
        if (!book) return null;
        const progressPercent = prog.progressPercent || 0;
        const isCompleted = prog.isCompleted || progressPercent >= 100;
        const chapterIndex = prog.chapterIndex || 0;
        const currentChapter = book.chapters[chapterIndex] || book.chapters[0];
        const lastLocation =
          prog.lastLocation ||
          (currentChapter ? currentChapter.title || currentChapter.number || `Capítulo ${chapterIndex + 1}` : `Capítulo ${chapterIndex + 1}`);

        // Cálculo dinâmico de minutos restantes baseado na quantidade de páginas da obra
        const totalPages = book.pagesCount || 240;
        const pagesRead = Math.round((progressPercent / 100) * totalPages);
        const pagesLeft = Math.max(0, totalPages - pagesRead);
        // Média de 1.4 min por página de literatura clássica
        const estimatedMinutesLeft = Math.max(1, Math.round(pagesLeft * 1.4));

        return {
          book,
          progress: prog,
          progressPercent,
          isCompleted,
          chapterIndex,
          lastLocation,
          totalPages,
          pagesRead,
          estimatedMinutesLeft,
          lastReadTimestamp: prog.lastReadTimestamp || Date.now(),
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    // Ordena do mais recentemente lido para o mais antigo
    return entries.sort((a, b) => b.lastReadTimestamp - a.lastReadTimestamp);
  }, [books, readingProgress]);

  // Contadores analíticos
  const inProgressList = useMemo(() => historyEntries.filter((e) => !e.isCompleted && e.progressPercent > 0), [historyEntries]);
  const completedList = useMemo(() => historyEntries.filter((e) => e.isCompleted), [historyEntries]);

  const totalPagesRead = useMemo(() => {
    return historyEntries.reduce((acc, curr) => acc + curr.pagesRead, 0);
  }, [historyEntries]);

  const totalEstimatedMinutesLeft = useMemo(() => {
    return inProgressList.reduce((acc, curr) => acc + curr.estimatedMinutesLeft, 0);
  }, [inProgressList]);

  // Lista filtrada segundo a aba ativa
  const displayedEntries = useMemo(() => {
    if (filterTab === 'in_progress') return inProgressList;
    if (filterTab === 'completed') return completedList;
    return historyEntries;
  }, [filterTab, historyEntries, inProgressList, completedList]);

  // Formatação amigável de tempo relativo
  const formatTimeAgo = (timestamp: number) => {
    const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSeconds < 60) return 'Agora mesmo';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `Há ${diffMinutes} min`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Há ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  // Cores adaptativas por tema
  const themeStyles = {
    light: {
      drawerBg: 'bg-[#FCFBF8] text-[#1C1917] border-slate-200/90',
      headerBorder: 'border-stone-200',
      statCardBg: 'bg-white/80 border-stone-200 shadow-xs',
      statLabel: 'text-stone-500',
      statValue: 'text-stone-900',
      bookCardBg: 'bg-white border-stone-200/90 hover:border-stone-300 shadow-xs',
      bookCardCompletedBg: 'bg-stone-50/70 border-stone-200',
      bookTitle: 'text-stone-900',
      bookAuthor: 'text-stone-600',
      locationBadge: 'bg-stone-100 text-stone-700 border-stone-200',
      resumeBtn: 'bg-stone-900 text-white hover:bg-stone-800 shadow-md',
      secondaryBtn: 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200',
      progressBarBg: 'bg-stone-100',
      activeTab: 'bg-stone-900 text-white shadow-xs',
      inactiveTab: 'text-stone-600 hover:text-stone-900 hover:bg-stone-100',
      footerBg: 'bg-stone-50/90 border-stone-200 text-stone-500',
    },
    dark: {
      drawerBg: 'bg-[#0D111D] text-[#F8FAFC] border-slate-800',
      headerBorder: 'border-slate-800/80',
      statCardBg: 'bg-[#131926] border-slate-800/80 shadow-md',
      statLabel: 'text-slate-400',
      statValue: 'text-white',
      bookCardBg: 'bg-[#131926] border-slate-800/90 hover:border-slate-700 shadow-md',
      bookCardCompletedBg: 'bg-[#0F1420]/70 border-slate-800/60',
      bookTitle: 'text-white',
      bookAuthor: 'text-slate-400',
      locationBadge: 'bg-slate-800/80 text-amber-300 border-slate-700/60',
      resumeBtn: 'bg-amber-500 text-black hover:bg-amber-400 font-bold shadow-md shadow-amber-500/10',
      secondaryBtn: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700',
      progressBarBg: 'bg-slate-800',
      activeTab: 'bg-amber-500 text-black font-bold shadow-xs',
      inactiveTab: 'text-slate-400 hover:text-white hover:bg-slate-800/60',
      footerBg: 'bg-[#0A0E18] border-slate-800/80 text-slate-400',
    },
    amber: {
      drawerBg: 'bg-[#FAF3E0] text-[#3E2B18] border-[#DFCDB0]',
      headerBorder: 'border-[#DFCDB0]',
      statCardBg: 'bg-[#F4ECD8] border-[#DFCDB0] shadow-xs',
      statLabel: 'text-[#8C4A19]',
      statValue: 'text-[#3E2B18]',
      bookCardBg: 'bg-[#F5EED9] border-[#DFCDB0] hover:border-[#C2A980] shadow-xs',
      bookCardCompletedBg: 'bg-[#EFE5CD]/70 border-[#DFCDB0]',
      bookTitle: 'text-[#3E2B18]',
      bookAuthor: 'text-[#7A5430]',
      locationBadge: 'bg-[#EADEBA] text-[#5C3210] border-[#DFCDB0]',
      resumeBtn: 'bg-[#5C3210] text-[#FAF3E0] hover:bg-[#43230A] shadow-md',
      secondaryBtn: 'bg-[#EADEBA] text-[#5C3210] hover:bg-[#DFD0AB] border-[#DFCDB0]',
      progressBarBg: 'bg-[#E8DAC0]',
      activeTab: 'bg-[#5C3210] text-[#FAF3E0] font-bold shadow-xs',
      inactiveTab: 'text-[#7A5430] hover:text-[#3E2B18] hover:bg-[#EADEBA]/60',
      footerBg: 'bg-[#F2E8D0] border-[#DFCDB0] text-[#7A5430]',
    },
  }[themeMode];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Fundo Escuro com Efeito de Vidro Fosco (Backdrop Blur) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Gaveta Lateral Retrátil (Slide-Over Drawer com Spring Physics) */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className={`relative w-full max-w-[460px] h-full shadow-2xl flex flex-col z-10 border-l ${themeStyles.drawerBg}`}
            role="dialog"
            aria-modal="true"
            aria-label="Painel de Histórico e Retomada de Leitura"
          >
            {/* 1. CABEÇALHO DA GAVETA */}
            <div className={`p-5 sm:p-6 border-b flex-shrink-0 ${themeStyles.headerBorder}`}>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <BookMarked className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                      Histórico & Retomada
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border opacity-60">
                    ESC
                  </span>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="Fechar gaveta (Esc)"
                  >
                    <X className="w-5 h-5 opacity-70" />
                  </button>
                </div>
              </div>
              <p className="text-xs opacity-75 font-serif leading-relaxed">
                Retome suas leituras instantaneamente no capítulo exato onde parou.
              </p>

              {/* 2. CARDS RESUMO DE MÉTRICAS */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className={`p-2.5 rounded-xl border text-center ${themeStyles.statCardBg}`}>
                  <span className={`block text-[10px] font-mono uppercase tracking-wider ${themeStyles.statLabel}`}>
                    Em Leitura
                  </span>
                  <span className={`text-base sm:text-lg font-bold font-mono ${themeStyles.statValue}`}>
                    {inProgressList.length}
                  </span>
                </div>

                <div className={`p-2.5 rounded-xl border text-center ${themeStyles.statCardBg}`}>
                  <span className={`block text-[10px] font-mono uppercase tracking-wider ${themeStyles.statLabel}`}>
                    Concluídos
                  </span>
                  <span className={`text-base sm:text-lg font-bold font-mono ${themeStyles.statValue}`}>
                    {completedList.length}
                  </span>
                </div>

                <div className={`p-2.5 rounded-xl border text-center ${themeStyles.statCardBg}`}>
                  <span className={`block text-[10px] font-mono uppercase tracking-wider ${themeStyles.statLabel}`}>
                    Págs. Lidas
                  </span>
                  <span className={`text-base sm:text-lg font-bold font-mono ${themeStyles.statValue}`}>
                    ~{totalPagesRead}
                  </span>
                </div>
              </div>

              {/* 3. ABAS DE FILTRAGEM */}
              <div className="flex items-center gap-1 mt-4 p-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`flex-1 py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${
                    filterTab === 'all' ? themeStyles.activeTab : themeStyles.inactiveTab
                  }`}
                >
                  Todas ({historyEntries.length})
                </button>
                <button
                  onClick={() => setFilterTab('in_progress')}
                  className={`flex-1 py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${
                    filterTab === 'in_progress' ? themeStyles.activeTab : themeStyles.inactiveTab
                  }`}
                >
                  Lendo ({inProgressList.length})
                </button>
                <button
                  onClick={() => setFilterTab('completed')}
                  className={`flex-1 py-1 px-2 rounded-md font-medium transition-all cursor-pointer ${
                    filterTab === 'completed' ? themeStyles.activeTab : themeStyles.inactiveTab
                  }`}
                >
                  Lidos ({completedList.length})
                </button>
              </div>
            </div>

            {/* 4. CORPO DA GAVETA: LISTA DE OBRAS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 scrollbar-thin">
              {displayedEntries.length === 0 ? (
                /* ESTADO VAZIO CONVIDATIVO */
                <div className="py-12 px-4 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-base font-bold">
                      {filterTab === 'completed'
                        ? 'Nenhuma obra concluída ainda'
                        : filterTab === 'in_progress'
                        ? 'Nenhuma leitura em andamento'
                        : 'Seu histórico está livre'}
                    </h3>
                    <p className="text-xs opacity-70 font-serif max-w-xs mx-auto leading-relaxed">
                      Conforme você lê os clássicos na estante, cada virada de capítulo e rolagem fica salva automaticamente aqui.
                    </p>
                  </div>

                  {/* Sugestões Curatoriais de Leitura Rápida */}
                  <div className="pt-4 border-t border-black/10 dark:border-white/10 text-left">
                    <span className="block text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-2.5">
                      Sugestões para Iniciar Hoje:
                    </span>
                    <div className="space-y-2">
                      {books.slice(0, 3).map((suggBook) => (
                        <div
                          key={suggBook.id}
                          onClick={() => {
                            onResumeBook(suggBook, 0);
                            onClose();
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] ${themeStyles.bookCardBg}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-11 rounded shrink-0 border flex flex-col justify-between p-1 text-[6px] font-bold"
                              style={{
                                backgroundColor: suggBook.coverBg || '#FAF6ED',
                                borderColor: suggBook.coverBorder || '#D8CEB7',
                                color: suggBook.coverAccent || '#8C2D19',
                              }}
                            >
                              <span>{suggBook.year}</span>
                              <span className="line-clamp-1">{suggBook.title}</span>
                            </div>
                            <div>
                              <h4 className="font-serif text-xs font-bold line-clamp-1">{suggBook.title}</h4>
                              <p className="text-[11px] opacity-70 font-serif">{suggBook.author}</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0 flex items-center gap-1">
                            Iniciar <Play className="w-3 h-3 fill-current" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* LISTAGEM DE CARDS DE OBRAS EM LEITURA */
                displayedEntries.map((entry) => {
                  const { book, progressPercent, isCompleted, chapterIndex, lastLocation, estimatedMinutesLeft, lastReadTimestamp } = entry;
                  const coverBg = book.coverBg || '#FAF6ED';
                  const coverBorder = book.coverBorder || '#D8CEB7';
                  const coverAccent = book.coverAccent || '#8C2D19';
                  const isLightCover =
                    coverBg === '#FAF6ED' ||
                    coverBg === '#EFE7D8' ||
                    coverBg === '#ECE3D0' ||
                    coverBg.toLowerCase().startsWith('#f') ||
                    coverBg.toLowerCase().startsWith('#e');

                  return (
                    <div
                      key={book.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 relative group ${
                        isCompleted ? themeStyles.bookCardCompletedBg : themeStyles.bookCardBg
                      }`}
                    >
                      {/* TOPO DO CARD: Capa + Título + Status */}
                      <div className="flex items-start gap-3.5">
                        {/* Miniatura da Capa com Acabamento Físico e Lombada */}
                        <div
                          onClick={() => onInspectBook(book)}
                          className="w-14 aspect-[1/1.4] rounded-md shrink-0 border shadow-xs overflow-hidden flex flex-col justify-between p-1.5 cursor-pointer relative group-hover:shadow-md transition-shadow"
                          style={{
                            backgroundColor: coverBg,
                            borderColor: coverBorder,
                            color: isLightCover ? '#1A1412' : coverAccent,
                          }}
                          title="Clique para ver ficha editorial completa"
                        >
                          {/* Lombada sutil */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/20 pointer-events-none" />
                          <span className="text-[6px] font-mono font-bold">{book.year}</span>
                          <span className="font-serif text-[7px] font-bold text-center leading-tight line-clamp-3">
                            {book.title}
                          </span>
                          <span className="text-[5px] font-mono uppercase opacity-75">Obra Integral</span>
                        </div>

                        {/* Dados da Obra e Ponto de Parada */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider opacity-65 block">
                                {book.author}
                              </span>
                              <h3
                                onClick={() => onInspectBook(book)}
                                className={`font-serif text-sm sm:text-base font-bold leading-snug truncate cursor-pointer hover:underline ${themeStyles.bookTitle}`}
                              >
                                {book.title}
                              </h3>
                            </div>

                            {/* Badge de Porcentagem / Status */}
                            <span
                              className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                                isCompleted
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                                  : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25'
                              }`}
                            >
                              {isCompleted ? '100% Lido' : `${progressPercent}%`}
                            </span>
                          </div>

                          {/* Ponto Exato Onde Parou */}
                          <div className="mt-2 flex items-center gap-1.5">
                            <span className="text-[11px] font-mono opacity-60">📍 Parou em:</span>
                            <span
                              className={`text-xs font-serif font-semibold px-2 py-0.5 rounded-md truncate max-w-[210px] border ${themeStyles.locationBadge}`}
                              title={lastLocation}
                            >
                              {lastLocation}
                            </span>
                          </div>

                          {/* Metadados: Tempo restante & Última Leitura */}
                          <div className="mt-2 flex items-center gap-3 text-[11px] font-mono opacity-65">
                            {!isCompleted && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-500" />
                                ~{estimatedMinutesLeft} min restantes
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 opacity-60" />
                              {formatTimeAgo(lastReadTimestamp)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* BARRA DE PROGRESSO */}
                      <div className="mt-3">
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${themeStyles.progressBarBg}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-600 to-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(2, progressPercent))}%` }}
                          />
                        </div>
                      </div>

                      {/* BOTÕES DE AÇÃO: RETOMAR EM 1 CLIQUE + OPÇÕES */}
                      <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
                        {/* Botão Primário: Retomar Leitura */}
                        <button
                          onClick={() => {
                            onResumeBook(book, chapterIndex);
                            onClose();
                          }}
                          className={`flex-1 py-2 px-3.5 rounded-xl text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer ${themeStyles.resumeBtn}`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isCompleted ? 'Reler Obra' : 'Continuar Leitura'}</span>
                        </button>

                        {/* Botão Secundário: Marcar como Lido / Resetar */}
                        <button
                          onClick={() => onToggleMarkAsRead(book.id)}
                          className={`p-2 rounded-xl transition-all cursor-pointer border ${themeStyles.secondaryBtn}`}
                          title={isCompleted ? 'Reiniciar progresso para 0%' : 'Marcar obra como 100% concluída'}
                        >
                          {isCompleted ? (
                            <RotateCcw className="w-4 h-4 opacity-75" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </button>

                        {/* Botão Secundário: Remover do Histórico */}
                        <button
                          onClick={() => onRemoveFromHistory(book.id)}
                          className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Remover esta obra do histórico de leitura"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 5. RODAPÉ DA GAVETA */}
            <div className={`p-4 border-t flex-shrink-0 flex items-center justify-between gap-3 text-xs ${themeStyles.footerBg}`}>
              <div className="flex items-center gap-1.5 opacity-75">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="font-serif text-[11px]">Salvo localmente no dispositivo (offline)</span>
              </div>

              {historyEntries.length > 0 && onClearAllHistory && (
                <div>
                  {confirmClearAll ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onClearAllHistory();
                          setConfirmClearAll(false);
                        }}
                        className="px-2 py-1 rounded bg-red-600 text-white font-mono text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmClearAll(false)}
                        className="px-2 py-1 rounded bg-stone-200 dark:bg-slate-700 text-[10px] cursor-pointer"
                      >
                        Não
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmClearAll(true)}
                      className="text-[11px] font-mono opacity-60 hover:opacity-100 hover:text-red-500 transition-opacity cursor-pointer"
                      title="Apagar todo o histórico de leitura"
                    >
                      Limpar tudo
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

{/* BOTÃO FLUTUANTE ELEGANTE DE ACESSO AO HISTÓRICO (Floating Action Button) */}
interface ReadingHistoryFloatingButtonProps {
  onClick: () => void;
  activeCount: number;
  themeMode: 'light' | 'dark' | 'amber';
}

export const ReadingHistoryFloatingButton: React.FC<ReadingHistoryFloatingButtonProps> = ({
  onClick,
  activeCount,
  themeMode,
}) => {
  const btnStyles = {
    light:
      'bg-white/95 text-stone-900 border-stone-300/90 shadow-[0_12px_28px_rgba(0,0,0,0.12)] hover:bg-stone-50 hover:border-stone-400',
    dark:
      'bg-[#0F172A]/95 text-white border-slate-700/80 shadow-[0_12px_28px_rgba(0,0,0,0.50)] hover:bg-[#1E293B] hover:border-slate-600',
    amber:
      'bg-[#FAF3E0]/95 text-[#3E2B18] border-[#DFCDB0] shadow-[0_12px_28px_rgba(92,50,16,0.18)] hover:bg-[#F2E5C9] hover:border-[#C2A980]',
  }[themeMode];

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full border backdrop-blur-md flex items-center gap-2.5 transition-all cursor-pointer group ${btnStyles}`}
      title="Abrir Histórico de Leitura & Retomada (Atalho: H)"
      aria-label="Abrir Histórico de Leitura e Retomada"
    >
      <div className="relative">
        <BookMarked className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
        {activeCount > 0 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        )}
      </div>

      <span className="font-serif text-xs font-bold tracking-tight">Histórico</span>

      {activeCount > 0 ? (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
          {activeCount} {activeCount === 1 ? 'lendo' : 'lendo'}
        </span>
      ) : (
        <span className="text-[10px] font-mono opacity-50 px-1 py-0.5 rounded border border-current/20 hidden sm:inline">
          H
        </span>
      )}
    </motion.button>
  );
};
