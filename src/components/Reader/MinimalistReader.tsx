import React, { useState, useEffect, useRef } from 'react';
import { BookItem, ChapterData } from '../../data/booksData';
import { TextHighlight, HighlightColor, QuoteCardOptions } from '../../types/annotations';
import { ambientAudio, AmbientSoundType } from '../../services/ambientAudioService';
import { NotesDrawer } from './NotesDrawer';
import { GlossaryPopover } from './GlossaryPopover';
import { QuoteCardGeneratorModal } from '../Quotes/QuoteCardGeneratorModal';
import {
  ArrowLeft,
  X,
  Clock,
  Type,
  List,
  Check,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Volume2,
  VolumeX,
  BookA,
  Share2,
  Highlighter,
  MessageSquare,
  Sparkles,
  Sun,
  Moon,
  Flame,
  FileCheck2,
  Download,
  FileText,
  Loader2,
} from 'lucide-react';
import { loadEpubChapters } from '../../utils/epubLoader';
import { generateAndDownloadBookPdf } from '../../utils/editorialPdfGenerator';
import { motion, AnimatePresence } from 'motion/react';

interface MinimalistReaderProps {
  book: BookItem;
  initialChapterIndex?: number;
  initialProgressPercent?: number;
  themeMode?: 'light' | 'dark' | 'amber';
  onToggleTheme?: (mode: 'light' | 'dark' | 'amber') => void;
  onClose: () => void;
  onUpdateProgress: (bookId: string, chapterIndex: number, progressPercent: number, locationText: string) => void;
}

export const MinimalistReader: React.FC<MinimalistReaderProps> = ({
  book,
  initialChapterIndex = 0,
  initialProgressPercent = 0,
  themeMode = 'light',
  onToggleTheme,
  onClose,
  onUpdateProgress,
}) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'amber'>(themeMode);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterIndex);

  useEffect(() => {
    setCurrentTheme(themeMode);
  }, [themeMode]);

  const handleSelectTheme = (mode: 'light' | 'dark' | 'amber') => {
    setCurrentTheme(mode);
    onToggleTheme?.(mode);
  };
  const [fontSize, setFontSize] = useState(18);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [glossaryInitialTerm, setGlossaryInitialTerm] = useState('');
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | 'none'>('none');
  // Progresso Geral da Obra (Livro Inteiro)
  const [bookProgressPercent, setBookProgressPercent] = useState<number>(initialProgressPercent || 0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    try {
      setIsGeneratingPdf(true);
      await generateAndDownloadBookPdf(book, loadedChapters);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Relógio dinâmico do leitor
  const [currentTime, setCurrentTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setCurrentTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('rain');
  const [audioVolume, setAudioVolume] = useState(0.35);
  const [showAudioMenu, setShowAudioMenu] = useState(false);

  // Destaques e Anotações
  const [highlights, setHighlights] = useState<TextHighlight[]>(() => {
    const saved = localStorage.getItem(`eterno_highlights_${book.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(`eterno_highlights_${book.id}`, JSON.stringify(highlights));
  }, [highlights, book.id]);

  // Barra Flutuante de Seleção de Texto
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [addingNoteForText, setAddingNoteForText] = useState<string | null>(null);
  const [noteInputValue, setNoteInputValue] = useState('');

  // Gerador de Card de Citação
  const [quoteCardModalOpen, setQuoteCardModalOpen] = useState(false);
  const [quoteCardOptions, setQuoteCardOptions] = useState<QuoteCardOptions>({
    quote: '',
    bookTitle: book.title,
    author: book.author,
    year: book.year,
    theme: 'parchment',
  });

  const [loadedChapters, setLoadedChapters] = useState<ChapterData[]>(book.chapters);
  const [isLoadingEpub, setIsLoadingEpub] = useState<boolean>(false);
  const [isEpubLoaded, setIsEpubLoaded] = useState<boolean>(false);

  // Cálculo da porcentagem de leitura do LIVRO INTEIRO
  // (considerando todos os capítulos concluídos + fração percorrida do capítulo atual)
  const calculateTotalBookProgress = (
    chapIdx: number,
    chapScrollRatio: number,
    totalChaptersCount: number
  ): number => {
    if (!totalChaptersCount || totalChaptersCount <= 0) return 0;
    if (chapIdx >= totalChaptersCount - 1 && chapScrollRatio >= 0.98) {
      return 100;
    }
    const ratio = Math.min(1, Math.max(0, chapScrollRatio));
    const totalProg = ((chapIdx + ratio) / totalChaptersCount) * 100;
    return Math.min(100, Math.max(0, Math.round(totalProg)));
  };

  const updateOverallBookProgress = (
    chapIdx: number,
    chapScrollRatio: number,
    chaptersList: ChapterData[] = loadedChapters
  ) => {
    const totalChapters = chaptersList.length || 1;
    const overallProgress = calculateTotalBookProgress(chapIdx, chapScrollRatio, totalChapters);
    setBookProgressPercent(overallProgress);
    const targetChapter = chaptersList[chapIdx] || chaptersList[0] || book.chapters[0];
    onUpdateProgress(book.id, chapIdx, overallProgress, targetChapter?.number || `Capítulo ${chapIdx + 1}`);
    return overallProgress;
  };

  // Carregamento dinâmico do arquivo ePub original via JSZip
  useEffect(() => {
    let isSubscribed = true;
    if (book.epubUrl) {
      setIsLoadingEpub(true);
      loadEpubChapters(book.epubUrl)
        .then((chapters) => {
          if (isSubscribed && chapters && chapters.length > 0) {
            setLoadedChapters(chapters);
            setIsEpubLoaded(true);

            // Recupera posição salva de leitura no localStorage
            const savedChapterStr = localStorage.getItem(`eterno_last_chapter_${book.id}`);
            const savedScrollStr = localStorage.getItem(`eterno_last_scroll_${book.id}`);
            let savedIdx = 0;
            if (savedChapterStr !== null) {
              const parsed = parseInt(savedChapterStr, 10);
              if (!isNaN(parsed) && parsed >= 0 && parsed < chapters.length) {
                savedIdx = parsed;
                setCurrentChapterIndex(savedIdx);
              }
            }
            const savedScrollRatio = savedScrollStr ? parseInt(savedScrollStr, 10) / 100 : 0;
            updateOverallBookProgress(savedIdx, savedScrollRatio, chapters);
          }
        })
        .catch((err) => {
          console.warn('[MinimalistReader] Utilizando capítulos pré-carregados:', err);
        })
        .finally(() => {
          if (isSubscribed) setIsLoadingEpub(false);
        });
    } else {
      setLoadedChapters(book.chapters);
      setIsEpubLoaded(false);
      const savedChapterStr = localStorage.getItem(`eterno_last_chapter_${book.id}`);
      const savedScrollStr = localStorage.getItem(`eterno_last_scroll_${book.id}`);
      let savedIdx = currentChapterIndex;
      if (savedChapterStr !== null) {
        const parsed = parseInt(savedChapterStr, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < book.chapters.length) {
          savedIdx = parsed;
          setCurrentChapterIndex(savedIdx);
        }
      }
      const savedScrollRatio = savedScrollStr ? parseInt(savedScrollStr, 10) / 100 : 0;
      updateOverallBookProgress(savedIdx, savedScrollRatio, book.chapters);
    }
    return () => {
      isSubscribed = false;
    };
  }, [book.id, book.epubUrl]);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentChapter: ChapterData =
    loadedChapters[currentChapterIndex] || loadedChapters[0] || book.chapters[0];

  // Desativar áudio ao sair do leitor
  useEffect(() => {
    return () => {
      ambientAudio.stop();
    };
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const chapScrollRatio =
      scrollHeight <= clientHeight
        ? 1
        : Math.min(1, Math.max(0, scrollTop / (scrollHeight - clientHeight)));

    localStorage.setItem(`eterno_last_scroll_${book.id}`, String(Math.round(chapScrollRatio * 100)));
    localStorage.setItem(`eterno_last_chapter_${book.id}`, String(currentChapterIndex));
    updateOverallBookProgress(currentChapterIndex, chapScrollRatio);
  };

  const handleNext = () => {
    if (currentChapterIndex < loadedChapters.length - 1) {
      const nextIdx = currentChapterIndex + 1;
      setSlideDirection('next');
      setCurrentChapterIndex(nextIdx);
      if (containerRef.current) containerRef.current.scrollTop = 0;
      localStorage.setItem(`eterno_last_chapter_${book.id}`, String(nextIdx));
      localStorage.setItem(`eterno_last_scroll_${book.id}`, '0');
      updateOverallBookProgress(nextIdx, 0);
    }
  };

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      const prevIdx = currentChapterIndex - 1;
      setSlideDirection('prev');
      setCurrentChapterIndex(prevIdx);
      if (containerRef.current) containerRef.current.scrollTop = 0;
      localStorage.setItem(`eterno_last_chapter_${book.id}`, String(prevIdx));
      localStorage.setItem(`eterno_last_scroll_${book.id}`, '0');
      updateOverallBookProgress(prevIdx, 0);
    }
  };

  const handleSelectChapter = (idx: number) => {
    setSlideDirection('none');
    setCurrentChapterIndex(idx);
    setShowDrawer(false);
    if (containerRef.current) containerRef.current.scrollTop = 0;
    localStorage.setItem(`eterno_last_chapter_${book.id}`, String(idx));
    localStorage.setItem(`eterno_last_scroll_${book.id}`, '0');
    updateOverallBookProgress(idx, 0);
  };

  // Áudio Toggle
  const toggleAudio = () => {
    if (isAudioPlaying) {
      ambientAudio.stop();
      setIsAudioPlaying(false);
    } else {
      ambientAudio.setVolume(audioVolume);
      ambientAudio.play(ambientSound);
      setIsAudioPlaying(true);
    }
  };

  const changeAmbientSound = (sound: AmbientSoundType) => {
    setAmbientSound(sound);
    if (isAudioPlaying) {
      ambientAudio.play(sound);
    }
  };

  // Captura de Seleção de Texto
  const handleMouseUp = () => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (text && text.length > 2) {
      const range = sel?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setSelectedText(text);
        setSelectionPosition({
          x: Math.max(16, Math.min(window.innerWidth - 300, rect.left + rect.width / 2 - 140)),
          y: Math.max(10, rect.top - 60),
        });
      }
    } else {
      if (!addingNoteForText) {
        setSelectedText('');
        setSelectionPosition(null);
      }
    }
  };

  // Criar Grifo
  const handleCreateHighlight = (color: HighlightColor, note?: string) => {
    if (!selectedText) return;
    const newHighlight: TextHighlight = {
      id: Date.now().toString(),
      bookId: book.id,
      chapterIndex: currentChapterIndex,
      chapterTitle: currentChapter.title,
      text: selectedText,
      color,
      note,
      createdAt: 'Agora mesmo',
    };

    setHighlights((prev) => [newHighlight, ...prev]);
    setSelectedText('');
    setSelectionPosition(null);
    setAddingNoteForText(null);
    setNoteInputValue('');
    window.getSelection()?.removeAllRanges();
  };

  const handleDeleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const handleOpenQuoteCard = (text: string) => {
    setQuoteCardOptions({
      quote: text,
      bookTitle: book.title,
      author: book.author,
      year: book.year,
      theme: 'parchment',
    });
    setQuoteCardModalOpen(true);
    setSelectedText('');
    setSelectionPosition(null);
  };

  const handleOpenGlossaryForWord = (word: string) => {
    setGlossaryInitialTerm(word.replace(/[^a-zA-ZÀ-ÿ\s]/g, ''));
    setShowGlossary(true);
    setSelectedText('');
    setSelectionPosition(null);
  };

  // Formatação de parágrafo com destaque inline de grifos e capitular
  const renderParagraphWithHighlights = (paragraph: string, pIdx: number) => {
    const chapterHighlights = highlights.filter(
      (h) => h.chapterIndex === currentChapterIndex && h.text && paragraph.includes(h.text)
    );

    const isFirst = pIdx === 0;

    // Se não há grifos neste parágrafo
    if (chapterHighlights.length === 0) {
      if (isFirst) {
        const firstLetter = paragraph.charAt(0);
        const rest = paragraph.slice(1);
        return (
          <p
            key={pIdx}
            onDoubleClick={() => {
              const sel = window.getSelection()?.toString().trim();
              if (sel) handleOpenGlossaryForWord(sel);
            }}
            className="relative leading-[1.85]"
          >
            <span className="float-left text-6xl sm:text-7xl font-display font-bold leading-none mr-3.5 mt-1 text-black select-none">
              {firstLetter}
            </span>
            {rest}
          </p>
        );
      }
      return (
        <p
          key={pIdx}
          onDoubleClick={() => {
            const sel = window.getSelection()?.toString().trim();
            if (sel) handleOpenGlossaryForWord(sel);
          }}
          className="relative leading-[1.85]"
        >
          {paragraph}
        </p>
      );
    }

    // Algoritmo de fatiamento para grifos
    interface Interval {
      start: number;
      end: number;
      highlight: TextHighlight;
    }

    const intervals: Interval[] = [];
    chapterHighlights.forEach((hl) => {
      let startIndex = 0;
      while ((startIndex = paragraph.indexOf(hl.text, startIndex)) !== -1) {
        const endIndex = startIndex + hl.text.length;
        const overlaps = intervals.some(
          (iv) => Math.max(startIndex, iv.start) < Math.min(endIndex, iv.end)
        );
        if (!overlaps) {
          intervals.push({ start: startIndex, end: endIndex, highlight: hl });
        }
        startIndex = endIndex;
      }
    });

    intervals.sort((a, b) => a.start - b.start);

    const nodes: React.ReactNode[] = [];
    let cur = 0;

    intervals.forEach((iv, idx) => {
      if (iv.start > cur) {
        nodes.push(paragraph.slice(cur, iv.start));
      }

      const hl = iv.highlight;
      const highlightStyles = {
        terracotta: 'bg-[#C28251]/30 border-b-2 border-[#C28251] text-[#85451E]',
        gold: 'bg-[#F59E0B]/30 border-b-2 border-[#F59E0B] text-[#92400E]',
        charcoal: 'bg-[#475569]/30 border-b-2 border-[#475569] text-[#0F172A]',
      }[hl.color];

      nodes.push(
        <mark
          key={`hl-${hl.id}-${idx}`}
          onClick={(e) => {
            e.stopPropagation();
            if (hl.note) {
              setAddingNoteForText(hl.text);
              setNoteInputValue(hl.note);
            } else {
              setShowNotesDrawer(true);
            }
          }}
          className={`cursor-pointer rounded-xs px-1 py-0.5 transition-all hover:opacity-85 select-text ${highlightStyles}`}
          title={hl.note ? `Nota: "${hl.note}"` : 'Trecho grifado · Clique para gerenciar'}
        >
          {paragraph.slice(iv.start, iv.end)}
          {hl.note && (
            <span
              className="inline-block ml-1 text-[11px] align-super text-amber-800"
              title={hl.note}
            >
              💬
            </span>
          )}
        </mark>
      );
      cur = iv.end;
    });

    if (cur < paragraph.length) {
      nodes.push(paragraph.slice(cur));
    }

    if (isFirst) {
      if (typeof nodes[0] === 'string' && nodes[0].length > 0) {
        const firstLetter = nodes[0].charAt(0);
        nodes[0] = nodes[0].slice(1);
        return (
          <p
            key={pIdx}
            onDoubleClick={() => {
              const sel = window.getSelection()?.toString().trim();
              if (sel) handleOpenGlossaryForWord(sel);
            }}
            className="relative leading-[1.85]"
          >
            <span className="float-left text-6xl sm:text-7xl font-display font-bold leading-none mr-3.5 mt-1 text-black select-none">
              {firstLetter}
            </span>
            {nodes}
          </p>
        );
      }
    }

    return (
      <p
        key={pIdx}
        onDoubleClick={() => {
          const sel = window.getSelection()?.toString().trim();
          if (sel) handleOpenGlossaryForWord(sel);
        }}
        className="relative leading-[1.85]"
      >
        {nodes}
      </p>
    );
  };

  const readerThemeStyles = {
    light: {
      wrapper: 'bg-[#FFFFFF] text-[#0F172A]',
      header: 'bg-white/95 border-slate-100 text-[#0F172A]',
      headerBtn: 'hover:bg-slate-100 text-slate-700',
      title: 'text-black',
      subtitle: 'text-slate-400',
      chapterTitle: 'text-black',
      articleText: 'text-slate-900 selection:bg-amber-200 selection:text-slate-900',
      border: 'border-slate-100',
      floatingPill: 'bg-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)]',
      timeText: 'text-white/80',
      percentText: 'text-slate-300',
      modalBg: 'bg-white border-slate-200 text-slate-900',
      dropCap: 'text-black',
    },
    dark: {
      wrapper: 'bg-[#0B0F19] text-[#E2E8F0]',
      header: 'bg-[#0B0F19]/95 border-slate-800 text-[#E2E8F0]',
      headerBtn: 'hover:bg-slate-800 text-slate-300',
      title: 'text-white',
      subtitle: 'text-slate-500',
      chapterTitle: 'text-white',
      articleText: 'text-slate-200 selection:bg-amber-900 selection:text-amber-100',
      border: 'border-slate-800',
      floatingPill: 'bg-amber-500 text-black font-bold shadow-[0_8px_20px_rgba(245,158,11,0.25)]',
      timeText: 'text-black/80',
      percentText: 'text-black/70',
      modalBg: 'bg-[#0F172A] border-slate-700 text-white',
      dropCap: 'text-amber-400',
    },
    amber: {
      wrapper: 'bg-[#F4ECD8] text-[#3D2C1D]',
      header: 'bg-[#F4ECD8]/95 border-[#E2D5BA] text-[#3D2C1D]',
      headerBtn: 'hover:bg-[#EBDABA] text-[#6E360F]',
      title: 'text-[#352313]',
      subtitle: 'text-[#8C4A19]',
      chapterTitle: 'text-[#352313]',
      articleText: 'text-[#382617] selection:bg-[#DEC294] selection:text-[#352313]',
      border: 'border-[#E2D5BA]',
      floatingPill: 'bg-[#5C3210] text-[#FAF3E0] shadow-[0_8px_20px_rgba(92,50,16,0.3)]',
      timeText: 'text-[#FAF3E0]/80',
      percentText: 'text-[#FAF3E0]/70',
      modalBg: 'bg-[#FAF3E0] border-[#DFCDB0] text-[#3D2C1D]',
      dropCap: 'text-[#352313]',
    },
  }[currentTheme];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 22 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 16 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }}
      onMouseUp={handleMouseUp}
      className={`fixed inset-0 z-50 flex flex-col select-text transition-colors ${readerThemeStyles.wrapper}`}
    >
      {/* Top Header Minimalista */}
      <header className={`relative sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between border-b backdrop-blur-md transition-colors ${readerThemeStyles.header}`}>
        <button
          onClick={onClose}
          className={`p-2 -ml-2 rounded-full transition-colors flex items-center gap-2 text-xs font-sans font-bold cursor-pointer ${readerThemeStyles.headerBtn}`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar à Estante</span>
        </button>

        <div className="flex flex-col items-center text-center">
          <span className={`font-display text-sm font-bold truncate max-w-[180px] sm:max-w-xs ${readerThemeStyles.title}`}>
            {book.title}
          </span>
          <div className="flex items-center gap-1.5 justify-center flex-wrap">
            <span className={`text-[10px] font-sans font-medium ${readerThemeStyles.subtitle}`}>
              {book.author} · {currentChapter.number}
            </span>
            {isEpubLoaded && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                <FileCheck2 className="w-2.5 h-2.5" />
                ePub Real ({loadedChapters.length} caps)
              </span>
            )}
            {isLoadingEpub && (
              <span className="text-[9px] font-mono text-amber-600 dark:text-amber-400 animate-pulse">
                Carregando ePub...
              </span>
            )}
          </div>
        </div>

        {/* Ferramentas do Leitor */}
        <div className="flex items-center gap-1">
          {/* Alternância Rápida de Tema Visual (Claro / Escuro / Amarelado sem Luz Azul) */}
          <button
            onClick={() => {
              const next = currentTheme === 'light' ? 'dark' : currentTheme === 'dark' ? 'amber' : 'light';
              handleSelectTheme(next);
            }}
            className={`p-2 rounded-full transition-colors cursor-pointer ${readerThemeStyles.headerBtn}`}
            title={`Tema: ${currentTheme === 'light' ? 'Claro' : currentTheme === 'dark' ? 'Escuro' : 'Sem Luz Azul'}. Clique para alternar.`}
          >
            {currentTheme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
            {currentTheme === 'dark' && <Moon className="w-4 h-4 text-amber-300" />}
            {currentTheme === 'amber' && <Flame className="w-4 h-4 text-[#A45A2A]" />}
          </button>
          {/* Ambiência Sonora */}
          <div className="relative">
            <button
              onClick={() => setShowAudioMenu(!showAudioMenu)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isAudioPlaying
                  ? 'bg-amber-100 text-amber-800'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Ambiência Sonora para Leitura"
            >
              {isAudioPlaying ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Menu Dropdown de Áudio */}
            {showAudioMenu && (
              <div className="absolute top-11 right-0 w-64 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl z-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-sans font-bold text-slate-800 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    Ambiência Sonora
                  </span>
                  <button
                    onClick={toggleAudio}
                    className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                      isAudioPlaying
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isAudioPlaying ? 'Tocando' : 'Mudo'}
                  </button>
                </div>

                {/* Opções de Som */}
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'rain', label: '🌧️ Chuva' },
                    { id: 'fireplace', label: '🔥 Lareira' },
                    { id: 'library', label: '🏛️ Biblioteca' },
                    { id: 'pages', label: '📜 Páginas' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => changeAmbientSound(s.id as AmbientSoundType)}
                      className={`p-2 rounded-xl text-xs font-sans text-left transition-colors cursor-pointer border ${
                        ambientSound === s.id
                          ? 'bg-amber-50 border-amber-300 font-bold text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Volume Slider */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                    <span>Volume</span>
                    <span>{Math.round(audioVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioVolume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setAudioVolume(v);
                      ambientAudio.setVolume(v);
                    }}
                    className="w-full accent-black"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dicionário Século XIX */}
          <button
            onClick={() => {
              setGlossaryInitialTerm('');
              setShowGlossary(true);
            }}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
            title="Glossário do Século XIX"
          >
            <BookA className="w-4 h-4" />
          </button>

          {/* Caderno de Notas */}
          <button
            onClick={() => setShowNotesDrawer(true)}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
            title="Caderno de Notas e Grifos"
          >
            <BookMarked className="w-4 h-4" />
            {highlights.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-600" />
            )}
          </button>

          {/* Sumário */}
          <button
            onClick={() => setShowDrawer(true)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
            title="Sumário de Capítulos"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Tipografia */}
          <button
            onClick={() => setShowFontMenu(!showFontMenu)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
            title="Tamanho da Fonte"
          >
            <Type className="w-4 h-4" />
          </button>

          {/* Baixar PDF Editorial Clássico */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer disabled:opacity-50"
            title={isGeneratingPdf ? 'Diagramando PDF...' : 'Baixar edição diagramada em PDF (com folha de rosto, sumário e miolo clássico)'}
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
            ) : (
              <FileText className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            )}
          </button>

          {/* Baixar ePub (Ação Complementar de Exportação) */}
          {book.epubUrl && (
            <a
              href={book.epubUrl}
              download={`${book.id}.epub`}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
              title="Baixar arquivo ePub da obra completa"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </a>
          )}
        </div>

        {/* Barra contínua de progresso do LIVRO INTEIRO */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black/5 dark:bg-white/10 overflow-hidden pointer-events-none">
          <div
            className="h-full bg-amber-600 dark:bg-amber-400 transition-all duration-300"
            style={{ width: `${bookProgressPercent}%` }}
          />
        </div>
      </header>

      {/* ÁREA DE LEITURA (COLUNA EDITORIAL ENTRE 620px E 680px) */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 sm:px-12 py-10 pb-36"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapterIndex}
            initial={{
              opacity: 0,
              x: slideDirection === 'next' ? 24 : slideDirection === 'prev' ? -24 : 0,
              y: slideDirection === 'none' ? 14 : 0,
            }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{
              opacity: 0,
              x: slideDirection === 'next' ? -20 : slideDirection === 'prev' ? 20 : 0,
            }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[640px] mx-auto space-y-6"
          >
            {/* Título do Capítulo */}
            <div className={`mb-8 pb-4 border-b ${readerThemeStyles.border}`}>
              <span className={`text-xs font-mono font-bold uppercase tracking-widest block mb-1 opacity-60`}>
                {currentChapter.number}
              </span>
              <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${readerThemeStyles.chapterTitle}`}>
                {currentChapter.title}
              </h2>
            </div>

            {/* Artigo com parágrafos */}
            <article
              className={`font-reading leading-[1.85] space-y-6 ${readerThemeStyles.articleText}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {currentChapter.content.map((paragraph, idx) =>
                renderParagraphWithHighlights(paragraph, idx)
              )}
            </article>

            {/* Paginação Inferior */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={currentChapterIndex === 0}
                className={`px-4 py-2 rounded-full border border-slate-200 text-xs font-bold font-sans flex items-center gap-2 cursor-pointer ${
                  currentChapterIndex === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <span className="font-mono text-xs text-slate-400">
                {currentChapterIndex + 1} de {loadedChapters.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentChapterIndex >= loadedChapters.length - 1}
                className={`px-4 py-2 rounded-full border border-slate-200 text-xs font-bold font-sans flex items-center gap-2 cursor-pointer ${
                  currentChapterIndex >= loadedChapters.length - 1
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* TOOLBAR FLUTUANTE DE SELEÇÃO DE TEXTO */}
      <AnimatePresence>
        {selectedText && selectionPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 8 }}
            transition={{ type: 'spring', damping: 24, stiffness: 380 }}
            className="fixed z-50 bg-black text-white rounded-2xl p-2 shadow-2xl flex items-center gap-2 text-xs font-sans select-none"
            style={{ top: `${selectionPosition.y}px`, left: `${selectionPosition.x}px` }}
          >
            {/* Cores de Grifo */}
            <button
              onClick={() => handleCreateHighlight('terracotta')}
              className="w-6 h-6 rounded-full bg-[#C28251] border-2 border-white/40 hover:scale-110 transition-transform cursor-pointer"
              title="Grifar em Terracota"
            />
            <button
              onClick={() => handleCreateHighlight('gold')}
              className="w-6 h-6 rounded-full bg-[#F59E0B] border-2 border-white/40 hover:scale-110 transition-transform cursor-pointer"
              title="Grifar em Ouro Velho"
            />
            <button
              onClick={() => handleCreateHighlight('charcoal')}
              className="w-6 h-6 rounded-full bg-[#475569] border-2 border-white/40 hover:scale-110 transition-transform cursor-pointer"
              title="Grifar em Carvão"
            />

            <div className="w-px h-4 bg-white/20" />

            {/* Anotação */}
            <button
              onClick={() => setAddingNoteForText(selectedText)}
              className="px-2.5 py-1 rounded-lg hover:bg-white/10 flex items-center gap-1 font-semibold cursor-pointer"
              title="Adicionar Anotação de Margem"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Nota</span>
            </button>

            {/* Card de Citação */}
            <button
              onClick={() => handleOpenQuoteCard(selectedText)}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 flex items-center gap-1 font-semibold cursor-pointer text-amber-300"
              title="Gerar Card para Instagram Stories"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Card</span>
            </button>

            {/* Dicionário Século XIX */}
            <button
              onClick={() => handleOpenGlossaryForWord(selectedText)}
              className="px-2.5 py-1 rounded-lg hover:bg-white/10 flex items-center gap-1 font-semibold cursor-pointer text-slate-200"
              title="Consultar no Glossário do Século XIX"
            >
              <BookA className="w-3.5 h-3.5" />
              <span>Dicionário</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para digitar a nota de margem */}
      <AnimatePresence>
        {addingNoteForText && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setAddingNoteForText(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.8 }}
              className="relative z-10 bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 max-w-sm w-full space-y-3"
            >
              <h4 className="font-display text-base font-bold text-black">Anotação de Margem</h4>
              <p className="text-xs text-slate-500 italic line-clamp-2">
                “{addingNoteForText}”
              </p>
              <textarea
                value={noteInputValue}
                onChange={(e) => setNoteInputValue(e.target.value)}
                placeholder="Escreva sua reflexão ou nota pessoal sobre este trecho..."
                className="w-full h-24 p-3 text-xs font-sans rounded-xl border border-slate-200 focus:outline-none focus:border-black"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAddingNoteForText(null)}
                  className="px-3 py-1.5 rounded-full text-xs font-sans text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleCreateHighlight('gold', noteInputValue)}
                  className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-sans font-bold shadow-xs cursor-pointer"
                >
                  Salvar Nota
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING PILL INFERIOR COM HORÁRIO E PROGRESSO DO LIVRO INTEIRO */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNotesDrawer(true)}
          className={`pointer-events-auto px-5 py-2.5 rounded-full flex items-center gap-2.5 text-xs font-sans cursor-pointer transition-colors shadow-lg ${readerThemeStyles.floatingPill}`}
          title="Ver caderno de notas · Progresso do livro inteiro"
        >
          <Clock className="w-3.5 h-3.5 opacity-80" />
          <span className={readerThemeStyles.timeText}>{currentTime}</span>
          <span className="opacity-40">·</span>
          <span className="opacity-80 font-mono text-[11px]">
            Cap. {currentChapterIndex + 1}/{loadedChapters.length}
          </span>
          <span className="opacity-40">·</span>
          <span className={`font-mono font-bold ${readerThemeStyles.percentText}`}>
            {bookProgressPercent}% do livro
          </span>
        </motion.button>
      </div>

      {/* Painel de Tipografia e Ajustes de Tema */}
      <AnimatePresence>
        {showFontMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -10 }}
            transition={{ type: 'spring', damping: 24, stiffness: 350 }}
            className={`fixed top-16 right-6 w-64 rounded-2xl p-4 shadow-2xl z-50 space-y-3.5 border ${readerThemeStyles.modalBg}`}
          >
            <div className="flex justify-between items-center text-xs font-bold">
              <span>Tamanho da Fonte</span>
              <span className="font-mono">{fontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                A-
              </button>
              <input
                type="range"
                min="14"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="flex-1 accent-black"
              />
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                A+
              </button>
            </div>

            {/* Seletor de Tema Visual no Painel */}
            <div className="pt-2 border-t border-current/10">
              <span className="block text-[10px] font-sans font-bold uppercase tracking-wider opacity-60 mb-2">
                Tema de Leitura & Descanso Visual
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleSelectTheme('light')}
                  className={`p-2 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 cursor-pointer border transition-all ${
                    currentTheme === 'light'
                      ? 'bg-white text-black border-black shadow-xs font-black'
                      : 'bg-black/5 border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Claro</span>
                </button>

                <button
                  onClick={() => handleSelectTheme('dark')}
                  className={`p-2 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 cursor-pointer border transition-all ${
                    currentTheme === 'dark'
                      ? 'bg-slate-900 text-amber-300 border-amber-400 shadow-xs font-black'
                      : 'bg-black/5 border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-slate-300" />
                  <span>Escuro</span>
                </button>

                <button
                  onClick={() => handleSelectTheme('amber')}
                  className={`p-2 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 cursor-pointer border transition-all ${
                    currentTheme === 'amber'
                      ? 'bg-[#EBDABA] text-[#43230A] border-[#8C4A19] shadow-xs font-black'
                      : 'bg-black/5 border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-[#A45A2A]" />
                  <span>Sem Azul</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sumário */}
      <AnimatePresence>
        {showDrawer && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop suave */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.aside
              initial={{ x: '-100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }}
              className="relative w-80 max-w-[85vw] bg-white border-r border-slate-200 shadow-2xl z-10 p-6 flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <h3 className="font-display text-base font-bold text-black">Capítulos</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDrawer(false)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
                    title="Fechar sumário"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
                  {loadedChapters.map((chap, idx) => (
                    <button
                      key={chap.id}
                      onClick={() => handleSelectChapter(idx)}
                      className={`w-full text-left p-3 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        idx === currentChapterIndex
                          ? 'bg-black text-white font-bold'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div>
                        <span className="block font-mono text-[9px] uppercase opacity-70">
                          {chap.number}
                        </span>
                        <span className="text-sm font-sans">{chap.title}</span>
                      </div>
                      {idx === currentChapterIndex && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Caderno de Notas */}
      <NotesDrawer
        isOpen={showNotesDrawer}
        bookTitle={book.title}
        highlights={highlights}
        onClose={() => setShowNotesDrawer(false)}
        onDeleteHighlight={handleDeleteHighlight}
        onCreateQuoteCard={handleOpenQuoteCard}
      />

      {/* Glossário Popover */}
      <GlossaryPopover
        initialTerm={glossaryInitialTerm}
        isOpen={showGlossary}
        onClose={() => setShowGlossary(false)}
      />

      {/* Gerador de Card de Citação */}
      <QuoteCardGeneratorModal
        isOpen={quoteCardModalOpen}
        options={quoteCardOptions}
        onClose={() => setQuoteCardModalOpen(false)}
      />
    </motion.div>
  );
};
