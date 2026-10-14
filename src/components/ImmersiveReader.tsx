import React, { useState, useEffect, useRef } from 'react';
import { Book, Chapter, ReaderSettings } from '../types/library';
import {
  ArrowLeft,
  Settings2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  List,
  Check,
  Type,
  Sun,
  Moon,
  Coffee,
} from 'lucide-react';

interface ImmersiveReaderProps {
  book: Book;
  authorName: string;
  initialChapterIndex?: number;
  initialProgressPercent?: number;
  onClose: () => void;
  onUpdateProgress: (bookId: string, chapterIndex: number, progressPercent: number) => void;
}

export const ImmersiveReader: React.FC<ImmersiveReaderProps> = ({
  book,
  authorName,
  initialChapterIndex = 0,
  initialProgressPercent = 0,
  onClose,
  onUpdateProgress,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterIndex);
  const [showSettings, setShowSettings] = useState(false);
  const [showChaptersDrawer, setShowChaptersDrawer] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(initialProgressPercent);

  const [settings, setSettings] = useState<ReaderSettings>(() => {
    const saved = localStorage.getItem('eterno_reader_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      fontSize: 18,
      fontFamily: 'serif',
      theme: 'sepia',
      lineHeight: 'relaxed',
    };
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const currentChapter: Chapter =
    book.chapters[currentChapterIndex] || book.chapters[0];

  // Save settings
  useEffect(() => {
    localStorage.setItem('eterno_reader_settings', JSON.stringify(settings));
  }, [settings]);

  // Track scroll depth
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight <= clientHeight) {
      setScrollProgress(100);
      return;
    }
    const currentPercent = Math.min(
      100,
      Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)
    );
    setScrollProgress(currentPercent);
    onUpdateProgress(book.id, currentChapterIndex, currentPercent);
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      const nextIdx = currentChapterIndex + 1;
      setCurrentChapterIndex(nextIdx);
      onUpdateProgress(book.id, nextIdx, 10);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevIdx = currentChapterIndex - 1;
      setCurrentChapterIndex(prevIdx);
      onUpdateProgress(book.id, prevIdx, 90);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  };

  // Theme styling definitions
  const themeClasses = {
    sepia: {
      bg: 'bg-[#F5EFE3]',
      text: 'text-[#2D2820]',
      headerBg: 'bg-[#ECE5D6]/95 border-[#DBD0BD]',
      cardBg: 'bg-[#EDE5D5]',
      accent: 'text-[#8C2D19]',
      border: 'border-[#DBD0BD]',
    },
    cream: {
      bg: 'bg-[#FAF8F5]',
      text: 'text-[#1F1C18]',
      headerBg: 'bg-[#F2EFEA]/95 border-[#E2DDD3]',
      cardBg: 'bg-[#F4F1EB]',
      accent: 'text-[#7A2816]',
      border: 'border-[#E2DDD3]',
    },
    dark: {
      bg: 'bg-[#181614]',
      text: 'text-[#DCD5C9]',
      headerBg: 'bg-[#211E1B]/95 border-[#34302B]',
      cardBg: 'bg-[#24211D]',
      accent: 'text-[#D49842]',
      border: 'border-[#34302B]',
    },
  }[settings.theme];

  const fontClass = {
    serif: 'font-serif-body',
    sans: 'font-sans',
    mono: 'font-mono',
  }[settings.fontFamily];

  const lineHeightClass = {
    tight: 'leading-normal',
    normal: 'leading-relaxed',
    relaxed: 'leading-loose',
  }[settings.lineHeight];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeClasses.bg} transition-colors duration-200`}>
      {/* Top Reading Navigation Bar */}
      <header
        className={`sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between border-b backdrop-blur-md ${themeClasses.headerBg}`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#736857]"
            title="Voltar ao acervo"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar ao Acervo</span>
          </button>

          <div className="h-4 w-px bg-current opacity-20 hidden sm:block"></div>

          <div className="flex flex-col">
            <h1 className="font-display-title text-sm sm:text-base font-bold truncate max-w-[180px] sm:max-w-md">
              {book.title}
            </h1>
            <span className="text-[11px] opacity-75 font-serif italic">
              {authorName} · {currentChapter.number}: {currentChapter.title}
            </span>
          </div>
        </div>

        {/* Reader Tools & Actions */}
        <div className="flex items-center gap-2">
          {/* Chapter drawer trigger */}
          <button
            onClick={() => setShowChaptersDrawer(!showChaptersDrawer)}
            className="p-2 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            title="Índice de Capítulos"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Capítulos</span>
          </button>

          {/* Settings trigger */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-1.5 text-xs ${
              showSettings ? 'bg-black/10 dark:bg-white/10' : ''
            }`}
            title="Preferências de Leitura"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden md:inline">Tipografia</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="p-2 rounded-sm hover:bg-black/5 dark:hover:bg-white/5"
            title={bookmarked ? 'Marcador salvo' : 'Marcar página'}
          >
            <Bookmark
              className={`w-4 h-4 ${
                bookmarked ? 'fill-[#8C2D19] text-[#8C2D19]' : 'opacity-70'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Thin Horizontal Scroll Depth Bar */}
      <div className="w-full h-1 bg-black/10 dark:bg-white/10">
        <div
          className="h-full bg-[#8C2D19] dark:bg-[#D49842] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reader Layout Canvas */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Main Text Content Area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 sm:px-12 py-12 md:py-16"
        >
          <div className="max-w-2xl mx-auto">
            {/* Chapter Header */}
            <div className="text-center mb-12 pb-8 border-b border-black/10 dark:border-white/10">
              <span className="text-xs font-mono uppercase tracking-[0.25em] opacity-65 block mb-2">
                {book.title} · {book.originalYear}
              </span>
              <span className="font-serif italic text-base sm:text-lg opacity-85 block mb-1">
                {currentChapter.number}
              </span>
              <h2 className="font-display-title text-3xl sm:text-4xl font-bold tracking-tight">
                {currentChapter.title}
              </h2>
              {currentChapter.subtitle && (
                <p className="font-serif italic text-sm opacity-75 mt-2">
                  {currentChapter.subtitle}
                </p>
              )}
            </div>

            {/* Chapter Body Prose */}
            <article
              className={`${fontClass} ${lineHeightClass} text-justify space-y-6`}
              style={{ fontSize: `${settings.fontSize}px` }}
            >
              {currentChapter.content.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'
                      : ''
                  }
                >
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Bottom Chapter Pagination Controls */}
            <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-4">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
                className={`px-4 py-2.5 rounded-sm border text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
                  currentChapterIndex === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Capítulo Anterior</span>
              </button>

              <span className="text-xs font-mono opacity-70">
                {currentChapterIndex + 1} de {book.chapters.length}
              </span>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIndex >= book.chapters.length - 1}
                className={`px-4 py-2.5 rounded-sm border text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
                  currentChapterIndex >= book.chapters.length - 1
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

        {/* Chapters Drawer Overlay */}
        {showChaptersDrawer && (
          <aside className={`w-80 border-l ${themeClasses.border} ${themeClasses.cardBg} p-6 overflow-y-auto flex flex-col justify-between shadow-2xl z-40`}>
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/10 dark:border-white/10">
                <h3 className="font-display-title text-base font-bold">Índice do Livro</h3>
                <button
                  onClick={() => setShowChaptersDrawer(false)}
                  className="text-xs uppercase font-semibold opacity-60 hover:opacity-100"
                >
                  Fechar
                </button>
              </div>

              <div className="space-y-1">
                {book.chapters.map((chap, idx) => (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setShowChaptersDrawer(false);
                      if (scrollRef.current) scrollRef.current.scrollTop = 0;
                    }}
                    className={`w-full text-left p-3 rounded-sm text-xs font-serif transition-colors flex items-center justify-between ${
                      idx === currentChapterIndex
                        ? 'bg-black/10 dark:bg-white/10 font-bold'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <span className="block font-mono text-[10px] uppercase opacity-70">
                        {chap.number}
                      </span>
                      <span className="text-sm">{chap.title}</span>
                    </div>
                    {idx === currentChapterIndex && (
                      <Check className="w-4 h-4 text-[#8C2D19] dark:text-[#D49842]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 text-center">
              <span className="text-[11px] font-mono opacity-60">
                Progresso Atual: {scrollProgress}%
              </span>
            </div>
          </aside>
        )}

        {/* Floating Typography Settings Panel */}
        {showSettings && (
          <div className={`absolute top-4 right-4 w-72 rounded-sm shadow-2xl border ${themeClasses.border} ${themeClasses.cardBg} p-5 z-40 space-y-5 animate-in fade-in zoom-in-95 duration-150`}>
            <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
              <span className="font-display-title text-sm font-bold flex items-center gap-1.5">
                <Type className="w-4 h-4" />
                Preferências de Texto
              </span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs uppercase font-semibold opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>

            {/* Background Theme */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider block mb-2 opacity-75">
                Tom de Papel / Fundo
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSettings({ ...settings, theme: 'sepia' })}
                  className={`p-2 rounded-xs border text-xs font-serif flex items-center justify-center gap-1 bg-[#F5EFE3] text-[#2D2820] ${
                    settings.theme === 'sepia' ? 'ring-2 ring-[#8C2D19] font-bold' : ''
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  Sépia
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: 'cream' })}
                  className={`p-2 rounded-xs border text-xs font-serif flex items-center justify-center gap-1 bg-[#FAF8F5] text-[#1F1C18] ${
                    settings.theme === 'cream' ? 'ring-2 ring-[#8C2D19] font-bold' : ''
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  Alvo
                </button>
                <button
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={`p-2 rounded-xs border text-xs font-serif flex items-center justify-center gap-1 bg-[#181614] text-[#DCD5C9] ${
                    settings.theme === 'dark' ? 'ring-2 ring-[#D49842] font-bold' : ''
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  Noite
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider block mb-2 opacity-75">
                Tipografia
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSettings({ ...settings, fontFamily: 'serif' })}
                  className={`py-1.5 px-2 text-xs font-serif rounded-xs border ${
                    settings.fontFamily === 'serif' ? 'bg-black/15 dark:bg-white/15 font-bold' : ''
                  }`}
                >
                  Serif
                </button>
                <button
                  onClick={() => setSettings({ ...settings, fontFamily: 'sans' })}
                  className={`py-1.5 px-2 text-xs font-sans rounded-xs border ${
                    settings.fontFamily === 'sans' ? 'bg-black/15 dark:bg-white/15 font-bold' : ''
                  }`}
                >
                  Sans
                </button>
                <button
                  onClick={() => setSettings({ ...settings, fontFamily: 'mono' })}
                  className={`py-1.5 px-2 text-xs font-mono rounded-xs border ${
                    settings.fontFamily === 'mono' ? 'bg-black/15 dark:bg-white/15 font-bold' : ''
                  }`}
                >
                  Mono
                </button>
              </div>
            </div>

            {/* Font Size Adjuster */}
            <div>
              <div className="flex justify-between text-[11px] font-mono uppercase tracking-wider mb-2 opacity-75">
                <span>Tamanho da Fonte</span>
                <span>{settings.fontSize}px</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      fontSize: Math.max(14, settings.fontSize - 1),
                    })
                  }
                  className="w-8 h-8 rounded-xs border flex items-center justify-center text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="14"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      fontSize: parseInt(e.target.value),
                    })
                  }
                  className="flex-1 accent-[#8C2D19] dark:accent-[#D49842]"
                />
                <button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      fontSize: Math.min(24, settings.fontSize + 1),
                    })
                  }
                  className="w-8 h-8 rounded-xs border flex items-center justify-center text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider block mb-2 opacity-75">
                Espaçamento de Linhas
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSettings({ ...settings, lineHeight: 'tight' })}
                  className={`py-1 text-xs rounded-xs border ${
                    settings.lineHeight === 'tight' ? 'bg-black/15 dark:bg-white/15 font-bold' : ''
                  }`}
                >
                  Justo
                </button>
                <button
                  onClick={() => setSettings({ ...settings, lineHeight: 'normal' })}
                  className={`py-1 text-xs rounded-xs border ${
                    settings.lineHeight === 'normal' ? 'bg-black/15 dark:bg-white/15 font-bold' : ''
                  }`}
                >
                  Padrão
                </button>
                <button
                  onClick={() => setSettings({ ...settings, lineHeight: 'relaxed' })}
                  className={`py-1 text-xs rounded-xs border ${
                    settings.lineHeight === 'relaxed' ? 'bg-black/15 dark:bg-white/15 font-bold' : ''
                  }`}
                >
                  Amplo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
