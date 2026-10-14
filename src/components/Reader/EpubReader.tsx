import React, { useState, useEffect, useRef } from 'react';
import { BookItem, ChapterData } from '../../data/booksData';
import {
  ArrowLeft,
  List,
  Type,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Check,
  Sun,
  Moon,
  Coffee,
  X,
  FileCheck2,
  Download,
  ExternalLink,
} from 'lucide-react';
import { loadEpubChapters } from '../../utils/epubLoader';

interface EpubReaderProps {
  book: BookItem;
  initialChapterIndex?: number;
  initialProgressPercent?: number;
  onClose: () => void;
  onUpdateProgress: (bookId: string, chapterIndex: number, progressPercent: number, locationText: string) => void;
}

export const EpubReader: React.FC<EpubReaderProps> = ({
  book,
  initialChapterIndex = 0,
  initialProgressPercent = 0,
  onClose,
  onUpdateProgress,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterIndex);
  const [showTocDrawer, setShowTocDrawer] = useState(false);
  const [showTypeSettings, setShowTypeSettings] = useState(false);
  const [fontSize, setFontSize] = useState(18); // 15 to 24
  const [fontChoice, setFontChoice] = useState<'merriweather' | 'sans' | 'cormorant'>('merriweather');
  const [themeMode, setThemeMode] = useState<'polen' | 'cream' | 'night'>('polen');
  const [scrollPercent, setScrollPercent] = useState(initialProgressPercent);

  const [loadedChapters, setLoadedChapters] = useState<ChapterData[]>(book.chapters);
  const [isLoadingEpub, setIsLoadingEpub] = useState<boolean>(false);
  const [isEpubLoaded, setIsEpubLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isSubscribed = true;
    if (book.epubUrl) {
      setIsLoadingEpub(true);
      loadEpubChapters(book.epubUrl)
        .then((chapters) => {
          if (isSubscribed && chapters && chapters.length > 0) {
            setLoadedChapters(chapters);
            setIsEpubLoaded(true);
            const savedChapterStr = localStorage.getItem(`eterno_epub_chap_${book.id}`);
            if (savedChapterStr !== null) {
              const savedIdx = parseInt(savedChapterStr, 10);
              if (!isNaN(savedIdx) && savedIdx >= 0 && savedIdx < chapters.length) {
                setCurrentChapterIndex(savedIdx);
              }
            }
          }
        })
        .catch((err) => {
          console.warn('[EpubReader] Usando capítulos do catálogo:', err);
        })
        .finally(() => {
          if (isSubscribed) setIsLoadingEpub(false);
        });
    } else {
      setLoadedChapters(book.chapters);
      setIsEpubLoaded(false);
    }
    return () => {
      isSubscribed = false;
    };
  }, [book.id, book.epubUrl]);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentChapter: ChapterData =
    loadedChapters[currentChapterIndex] || loadedChapters[0] || book.chapters[0];

  // Scroll depth tracking & silent persistence
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight <= clientHeight) {
      setScrollPercent(100);
      return;
    }
    const percent = Math.min(
      100,
      Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
    );
    setScrollPercent(percent);

    localStorage.setItem(`eterno_epub_scroll_${book.id}`, String(percent));
    localStorage.setItem(`eterno_epub_chap_${book.id}`, String(currentChapterIndex));

    // Silent persistence
    const location = `${currentChapter.number} (${currentChapter.title})`;
    onUpdateProgress(book.id, currentChapterIndex, percent, location);
  };

  const handleNext = () => {
    if (currentChapterIndex < loadedChapters.length - 1) {
      const nextIdx = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIdx);
      if (containerRef.current) containerRef.current.scrollTop = 0;
      localStorage.setItem(`eterno_epub_chap_${book.id}`, String(nextIdx));
      onUpdateProgress(book.id, nextIdx, 10, `${loadedChapters[nextIdx].number}`);
    }
  };

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      const prevIdx = currentChapterIndex - 1;
      setCurrentChapterIndex(prevIdx);
      if (containerRef.current) containerRef.current.scrollTop = 0;
      localStorage.setItem(`eterno_epub_chap_${book.id}`, String(prevIdx));
      onUpdateProgress(book.id, prevIdx, 90, `${loadedChapters[prevIdx].number}`);
    }
  };

  const themeStyles = {
    polen: {
      bg: 'bg-[#FDFBF7]',
      text: 'text-[#0F172A]',
      headerBg: 'bg-[#FAF8F5]/95 border-[rgba(15,23,42,0.08)]',
      cardBg: 'bg-[#FAF8F5]',
      accent: 'text-[#9A5B32]',
    },
    cream: {
      bg: 'bg-[#FAF4EB]',
      text: 'text-[#1E1712]',
      headerBg: 'bg-[#F1E8DA]/95 border-[#E2D5C0]',
      cardBg: 'bg-[#F4ECE0]',
      accent: 'text-[#8C2D19]',
    },
    night: {
      bg: 'bg-[#0F172A]',
      text: 'text-[#F1F5F9]',
      headerBg: 'bg-[#020617]/95 border-[#1E293B]',
      cardBg: 'bg-[#1E293B]',
      accent: 'text-[#B8860B]',
    },
  }[themeMode];

  const fontClass = {
    merriweather: 'font-reading',
    sans: 'font-sans',
    cormorant: 'font-cormorant text-lg',
  }[fontChoice];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeStyles.bg} ${themeStyles.text} transition-colors duration-200`}>
      {/* Barra Superior do Leitor */}
      <header
        className={`sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between border-b backdrop-blur-md ${themeStyles.headerBg}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-sans cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#9A5B32]" />
            <span className="hidden sm:inline">Voltar ao Acervo</span>
          </button>

          <div className="h-4 w-px bg-current opacity-20 hidden sm:block" />

          <div className="flex flex-col">
            <h1 className="font-display text-sm sm:text-base font-bold truncate max-w-[180px] sm:max-w-md">
              {book.title}
            </h1>
            <span className="text-[11px] font-sans text-[#64748B]">
              {book.author} · {currentChapter.number}
            </span>
          </div>
        </div>

        {/* Ferramentas do Leitor */}
        <div className="flex items-center gap-2">
          {/* Sumário deslizante */}
          <button
            onClick={() => setShowTocDrawer(true)}
            className="px-3 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold uppercase tracking-wider font-sans flex items-center gap-1.5 cursor-pointer border border-[rgba(15,23,42,0.08)]"
          >
            <List className="w-3.5 h-3.5 text-[#B8860B]" />
            <span className="hidden md:inline">Sumário</span>
          </button>

          {/* Controle de Tipografia */}
          <button
            onClick={() => setShowTypeSettings(!showTypeSettings)}
            className={`px-3 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold uppercase tracking-wider font-sans flex items-center gap-1.5 cursor-pointer border border-[rgba(15,23,42,0.08)] ${
              showTypeSettings ? 'bg-black/10 dark:bg-white/10' : ''
            }`}
          >
            <Type className="w-3.5 h-3.5 text-[#C28251]" />
            <span className="hidden md:inline">Tipografia</span>
          </button>

          {/* Link para o Project Gutenberg */}
          {book.gutenbergUrl && (
            <a
              href={book.gutenbergUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold uppercase tracking-wider font-sans flex items-center gap-1.5 cursor-pointer border border-[rgba(15,23,42,0.08)] text-blue-700 dark:text-blue-400"
              title={`Ver página oficial do livro no Project Gutenberg (#${book.gutenbergId})`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Gutenberg #{book.gutenbergId}</span>
            </a>
          )}

          {/* Baixar ePub (Ação Complementar de Exportação) */}
          {book.epubUrl && (
            <a
              href={book.epubUrl}
              download={`${book.id}.epub`}
              className="px-3 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold uppercase tracking-wider font-sans flex items-center gap-1.5 cursor-pointer border border-[rgba(15,23,42,0.08)] text-emerald-700 dark:text-emerald-400"
              title="Baixar arquivo ePub da obra completa"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Baixar ePub</span>
            </a>
          )}
        </div>
      </header>

      {/* Barra fina de progresso de leitura no topo */}
      <div className="w-full h-1 bg-black/5 dark:bg-white/10">
        <div
          className="h-full bg-[#C28251] transition-all duration-150"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* ÁREA DE LEITURA (COLUNA RIGOROSAMENTE ENTRE 640px E 720px) */}
      <div className="relative flex-1 flex overflow-hidden">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 sm:px-12 py-12 md:py-16"
        >
          {/* Container delimitado para proporção ideal de 65 a 75 caracteres por linha */}
          <div className="w-full max-w-[680px] mx-auto">
            {/* Cabeçalho do Capítulo */}
            <div className="text-center mb-12 pb-8 border-b border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)]">
              {book.gutenbergUrl ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-blue-50/80 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Obra Integral Extraída de Project Gutenberg #{book.gutenbergId}
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Edição Integral Canônica · Domínio Público
                </div>
              )}
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#9A5B32] block mb-2">
                {book.title} · {book.year}
              </span>
              <span className="font-cormorant italic text-lg opacity-80 block mb-1">
                {currentChapter.number}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                {currentChapter.title}
              </h2>
            </div>

            {/* Texto Corrido com Capitular Clássica */}
            <article
              className={`${fontClass} leading-relaxed text-justify space-y-6 selection:bg-amber-200 selection:text-slate-900`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {currentChapter.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-6xl first-letter:font-display first-letter:font-bold first-letter:float-left first-letter:mr-3.5 first-letter:mt-1 first-letter:leading-none first-letter:text-[#9A5B32]'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Paginação inferior */}
            <div className="mt-16 pt-8 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={currentChapterIndex === 0}
                className={`px-4 py-2 rounded-md border text-xs font-bold uppercase tracking-wider font-sans flex items-center gap-2 cursor-pointer ${
                  currentChapterIndex === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Capítulo Anterior</span>
              </button>

              <span className="font-mono text-xs opacity-70">
                {currentChapterIndex + 1} de {loadedChapters.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentChapterIndex >= loadedChapters.length - 1}
                className={`px-4 py-2 rounded-md border text-xs font-bold uppercase tracking-wider font-sans flex items-center gap-2 cursor-pointer ${
                  currentChapterIndex >= loadedChapters.length - 1
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <span>Próximo Capítulo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* DRAWER DO SUMÁRIO (TOC DRAWER) DESLIZANDO DA ESQUERDA */}
        {showTocDrawer && (
          <aside className={`fixed inset-y-0 left-0 w-80 sm:w-96 ${themeStyles.cardBg} border-r border-[rgba(15,23,42,0.08)] shadow-2xl z-50 p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200`}>
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[rgba(15,23,42,0.08)]">
                <div>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#9A5B32] block">
                    Sumário da Obra
                  </span>
                  <h3 className="font-display text-base font-bold truncate max-w-[200px]">
                    {book.title}
                  </h3>
                </div>
                <button
                  onClick={() => setShowTocDrawer(false)}
                  className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
                {loadedChapters.map((chap, idx) => (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setShowTocDrawer(false);
                      if (containerRef.current) containerRef.current.scrollTop = 0;
                    }}
                    className={`w-full text-left p-3 rounded-md text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      idx === currentChapterIndex
                        ? 'bg-black/10 dark:bg-white/10 font-bold'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[10px] uppercase text-[#9A5B32] block">
                        {chap.number}
                      </span>
                      <span className="font-display text-sm">{chap.title}</span>
                    </div>
                    {idx === currentChapterIndex && (
                      <Check className="w-4 h-4 text-[#C28251]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(15,23,42,0.08)] text-center">
              <span className="font-mono text-xs text-[#64748B]">
                Progresso: {scrollPercent}% concluído
              </span>
            </div>
          </aside>
        )}

        {/* MENU FLUTUANTE DE TIPOGRAFIA (FONT CONTROLS) */}
        {showTypeSettings && (
          <div className={`absolute top-4 right-4 w-72 rounded-2xl shadow-2xl border border-[rgba(15,23,42,0.12)] ${themeStyles.cardBg} p-5 z-40 space-y-5 animate-in fade-in zoom-in-95 duration-150`}>
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(15,23,42,0.08)]">
              <span className="font-display text-sm font-bold flex items-center gap-1.5">
                <Type className="w-4 h-4 text-[#9A5B32]" />
                Controles de Leitura
              </span>
              <button
                onClick={() => setShowTypeSettings(false)}
                className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tons de Fundo (Pólen, Creme, Noite) */}
            <div>
              <label className="font-sans text-[10px] font-bold uppercase tracking-wider block mb-2 text-[#64748B]">
                Fundo do Papel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setThemeMode('polen')}
                  className={`p-2 rounded-lg border text-xs font-sans font-bold flex items-center justify-center gap-1 bg-[#FDFBF7] text-[#0F172A] cursor-pointer ${
                    themeMode === 'polen' ? 'ring-2 ring-[#C28251]' : ''
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5 text-[#9A5B32]" />
                  Pólen
                </button>
                <button
                  onClick={() => setThemeMode('cream')}
                  className={`p-2 rounded-lg border text-xs font-sans font-bold flex items-center justify-center gap-1 bg-[#FAF4EB] text-[#1E1712] cursor-pointer ${
                    themeMode === 'cream' ? 'ring-2 ring-[#8C2D19]' : ''
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-[#B8860B]" />
                  Creme
                </button>
                <button
                  onClick={() => setThemeMode('night')}
                  className={`p-2 rounded-lg border text-xs font-sans font-bold flex items-center justify-center gap-1 bg-[#0F172A] text-[#FAF8F5] cursor-pointer ${
                    themeMode === 'night' ? 'ring-2 ring-[#B8860B]' : ''
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  Noite
                </button>
              </div>
            </div>

            {/* Alternador de Fonte (Merriweather vs Sans vs Cormorant) */}
            <div>
              <label className="font-sans text-[10px] font-bold uppercase tracking-wider block mb-2 text-[#64748B]">
                Tipografia do Texto
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setFontChoice('merriweather')}
                  className={`py-1.5 text-xs font-reading rounded-lg border cursor-pointer ${
                    fontChoice === 'merriweather' ? 'bg-black/10 dark:bg-white/10 font-bold border-[#C28251]' : ''
                  }`}
                >
                  Merriweather
                </button>
                <button
                  onClick={() => setFontChoice('sans')}
                  className={`py-1.5 text-xs font-sans rounded-lg border cursor-pointer ${
                    fontChoice === 'sans' ? 'bg-black/10 dark:bg-white/10 font-bold border-[#C28251]' : ''
                  }`}
                >
                  Sans
                </button>
                <button
                  onClick={() => setFontChoice('cormorant')}
                  className={`py-1.5 text-xs font-cormorant rounded-lg border cursor-pointer ${
                    fontChoice === 'cormorant' ? 'bg-black/10 dark:bg-white/10 font-bold border-[#C28251]' : ''
                  }`}
                >
                  Cormorant
                </button>
              </div>
            </div>

            {/* Tamanho da Fonte (A- / A+) */}
            <div>
              <div className="flex justify-between font-sans text-[10px] font-bold uppercase tracking-wider mb-2 text-[#64748B]">
                <span>Tamanho da Fonte</span>
                <span>{fontSize}px</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="14"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="flex-1 accent-[#C28251]"
                />
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
