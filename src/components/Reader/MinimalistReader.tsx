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
  Languages,
  Globe,
  Columns,
  MoreHorizontal,
} from 'lucide-react';
import { loadEpubChapters } from '../../utils/epubLoader';
import { generateAndDownloadBookPdf } from '../../utils/editorialPdfGenerator';
import { motion, AnimatePresence } from 'motion/react';
import { QuickTranslateModal } from './TranslatorModal';
import { ChapterTranslatorDrawer, TranslationReadingMode } from './ChapterTranslatorDrawer';
import { translateChapterParagraphs, SUPPORTED_LANGUAGES } from '../../services/translatorService';
import {
  calculateBookReadingTimeMinutes,
  calculateChapterReadingTimeMinutes,
  formatReadingTime,
  formatChapterReadingTime,
} from '../../utils/readingTime';

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
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [glossaryInitialTerm, setGlossaryInitialTerm] = useState('');
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | 'none'>('none');
  // Barra inferior oculta por padrão ou com auto-hide para leitura minimalista limpa
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(false);
  const lastScrollY = useRef(0);
  const bottomBarTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Revela a barra inferior temporariamente por 4 segundos
  const revealBottomBarTemporarily = () => {
    setIsBottomBarVisible(true);
    if (bottomBarTimer.current) clearTimeout(bottomBarTimer.current);
    bottomBarTimer.current = setTimeout(() => {
      setIsBottomBarVisible(false);
    }, 4000);
  };
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

  // Google Tradutor da Obra
  const [readingMode, setReadingMode] = useState<TranslationReadingMode>('original');
  const [targetLanguage, setTargetLanguage] = useState<string>('pt');
  const [showChapterTranslator, setShowChapterTranslator] = useState<boolean>(false);
  const [showQuickTranslate, setShowQuickTranslate] = useState<boolean>(false);
  const [quickTranslateText, setQuickTranslateText] = useState<string>('');
  const [chapterTranslations, setChapterTranslations] = useState<Record<string, string[]>>({});
  const [isTranslatingChapter, setIsTranslatingChapter] = useState<boolean>(false);
  const [translationProgress, setTranslationProgress] = useState<{ completed: number; total: number }>({
    completed: 0,
    total: 0,
  });

  // Chave atual para o capítulo e idioma selecionados
  const currentChapterKey = `${book.id}_ch${currentChapterIndex}_${targetLanguage}`;
  const currentChapterTranslation = chapterTranslations[currentChapterKey] || null;

  // Carrega tradução do cache local se disponível
  useEffect(() => {
    const cached = localStorage.getItem(`eterno_ch_trans_${currentChapterKey}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChapterTranslations((prev) => ({
            ...prev,
            [currentChapterKey]: parsed,
          }));
        }
      } catch {}
    }
  }, [currentChapterKey]);

  // Função para traduzir o capítulo ativo usando Google Tradutor
  const handleTranslateCurrentChapter = async () => {
    if (isTranslatingChapter) return;
    const currentChap = loadedChapters[currentChapterIndex] || loadedChapters[0] || book.chapters[0];
    const paras = currentChap?.content || [];
    if (!paras || paras.length === 0) return;

    setIsTranslatingChapter(true);
    setTranslationProgress({ completed: 0, total: paras.length });

    try {
      const translated = await translateChapterParagraphs(
        paras,
        targetLanguage,
        (completed, total) => {
          setTranslationProgress({ completed, total });
        }
      );

      setChapterTranslations((prev) => ({
        ...prev,
        [currentChapterKey]: translated,
      }));

      try {
        localStorage.setItem(`eterno_ch_trans_${currentChapterKey}`, JSON.stringify(translated));
      } catch {}

      if (readingMode === 'original') {
        setReadingMode('translated');
      }
    } catch (err) {
      console.error('Erro na tradução do capítulo:', err);
    } finally {
      setIsTranslatingChapter(false);
    }
  };

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

  // Cálculos do tempo de leitura da obra completa e do capítulo ativo
  const totalBookMinutes = calculateBookReadingTimeMinutes({
    pagesCount: book.pagesCount,
    chapters: loadedChapters,
  });
  const totalBookTimeFormatted = formatReadingTime(totalBookMinutes);
  const chapterReadingMinutes = calculateChapterReadingTimeMinutes(currentChapter?.content || []);
  const chapterTimeFormatted = formatChapterReadingTime(chapterReadingMinutes);
  const remainingMinutes = Math.max(
    1,
    Math.round(totalBookMinutes * (1 - Math.min(1, (bookProgressPercent || 0) / 100)))
  );
  const remainingBookTimeFormatted = formatReadingTime(remainingMinutes);

  // Desativar áudio ao sair do leitor
  useEffect(() => {
    return () => {
      ambientAudio.stop();
    };
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // Auto-hide da barra inferior ao rolar para baixo; revela brevemente ao rolar para cima
    const currentScroll = scrollTop;
    if (currentScroll > lastScrollY.current + 18 && currentScroll > 60) {
      setIsBottomBarVisible(false);
      if (bottomBarTimer.current) clearTimeout(bottomBarTimer.current);
    } else if (currentScroll < lastScrollY.current - 18) {
      revealBottomBarTemporarily();
    }
    lastScrollY.current = currentScroll;

    const chapScrollRatio =
      scrollHeight <= clientHeight
        ? 1
        : Math.min(1, Math.max(0, scrollTop / (scrollHeight - clientHeight)));

    localStorage.setItem(`eterno_last_scroll_${book.id}`, String(Math.round(chapScrollRatio * 100)));
    localStorage.setItem(`eterno_last_chapter_${book.id}`, String(currentChapterIndex));
    updateOverallBookProgress(currentChapterIndex, chapScrollRatio);
  };

  // Gestos de toque na tela: toque rápido alterna barra; swipe lateral muda de capítulo
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Se for toque suave estático, alterna a exibição dos controles/barra
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || !sel.toString().trim()) {
          setIsBottomBarVisible((prev) => !prev);
        }
      }, 50);
    } else if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) {
      // Gesto de Swipe lateral para navegação instantânea de capítulo!
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
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
      floatingPill: 'bg-white/95 text-slate-800 border border-slate-200/90 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md',
      timeText: 'text-slate-500',
      percentText: 'text-slate-900',
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
      floatingPill: 'bg-[#141B2D]/95 text-slate-200 border border-slate-700/80 shadow-[0_8px_28px_rgba(0,0,0,0.6)] backdrop-blur-md',
      timeText: 'text-slate-400',
      percentText: 'text-amber-400',
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
      floatingPill: 'bg-[#FAF3E0]/95 text-[#3D2C1D] border border-[#DFCDB0] shadow-[0_8px_24px_rgba(60,35,15,0.15)] backdrop-blur-md',
      timeText: 'text-[#8C4A19]',
      percentText: 'text-[#3D2C1D]',
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
          className={`p-1.5 sm:p-2 -ml-1 rounded-full transition-colors flex items-center gap-1.5 text-xs font-sans font-bold cursor-pointer ${readerThemeStyles.headerBtn}`}
          title="Voltar à Estante"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Estante</span>
        </button>

        {/* Centro: Título da Obra e Capítulo Limpos (Sem badges desnecessárias) */}
        <div className="flex flex-col items-center text-center max-w-[42vw] sm:max-w-xs px-1">
          <span className={`font-display text-xs sm:text-sm font-bold truncate max-w-full ${readerThemeStyles.title}`}>
            {book.title}
          </span>
          <span className={`text-[10px] sm:text-[11px] font-sans truncate max-w-full opacity-70 ${readerThemeStyles.subtitle}`}>
            {book.author} · {currentChapter.number}
          </span>
        </div>

        {/* Controles de Navegação e Menu à Direita */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Navegador Direto de Capítulos no Cabeçalho (Navegação imediata sem travar) */}
          <div className="flex items-center rounded-full bg-black/5 dark:bg-white/10 p-0.5 border border-black/5 dark:border-white/10">
            <button
              onClick={handlePrev}
              disabled={currentChapterIndex === 0}
              className={`p-1 rounded-full transition-all cursor-pointer ${
                currentChapterIndex === 0
                  ? 'opacity-25 cursor-not-allowed'
                  : 'hover:bg-black/10 dark:hover:bg-white/20 active:scale-90 text-slate-800 dark:text-slate-100'
              }`}
              title="Capítulo Anterior"
              aria-label="Capítulo Anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowDrawer(true)}
              className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-bold hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-all cursor-pointer"
              title="Abrir Sumário de Capítulos"
            >
              <List className="w-3 h-3 opacity-70" />
              <span>{currentChapterIndex + 1}/{loadedChapters.length}</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentChapterIndex >= loadedChapters.length - 1}
              className={`p-1 rounded-full transition-all cursor-pointer ${
                currentChapterIndex >= loadedChapters.length - 1
                  ? 'opacity-25 cursor-not-allowed'
                  : 'hover:bg-black/10 dark:hover:bg-white/20 active:scale-90 text-slate-800 dark:text-slate-100'
              }`}
              title="Próximo Capítulo"
              aria-label="Próximo Capítulo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Alternância Rápida de Tema Visual (Claro / Escuro / Amarelado) */}
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

          {/* Botão de Ferramentas Agrupadas (Evita quebrar no celular) */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                showMoreMenu ? 'bg-black/10 dark:bg-white/20' : readerThemeStyles.headerBtn
              }`}
              title="Ajustes e Ferramentas de Leitura"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Menu Popover Suspenso de Ferramentas */}
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -6 }}
                  className={`absolute right-0 top-11 w-64 rounded-2xl p-3 shadow-2xl z-50 border space-y-1.5 ${readerThemeStyles.modalBg}`}
                >
                  <div className="flex items-center justify-between pb-2 mb-1 border-b border-black/10 dark:border-white/10 text-xs font-bold px-1">
                    <span>Ajustes de Leitura</span>
                    <button
                      onClick={() => setShowMoreMenu(false)}
                      className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 1. Ajuste de Tamanho de Fonte */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5">
                    <span className="text-xs font-sans flex items-center gap-2">
                      <Type className="w-3.5 h-3.5 opacity-70" />
                      Fonte: {fontSize}px
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setFontSize((f) => Math.max(14, f - 2))}
                        className="w-7 h-7 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 flex items-center justify-center font-bold text-xs cursor-pointer"
                        title="Diminuir fonte"
                      >
                        A-
                      </button>
                      <button
                        onClick={() => setFontSize((f) => Math.min(26, f + 2))}
                        className="w-7 h-7 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 flex items-center justify-center font-bold text-xs cursor-pointer"
                        title="Aumentar fonte"
                      >
                        A+
                      </button>
                    </div>
                  </div>

                  {/* 2. Google Tradutor */}
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowChapterTranslator(true);
                    }}
                    className="w-full p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between text-xs cursor-pointer text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Languages className="w-3.5 h-3.5 text-amber-600" />
                      Google Tradutor
                    </span>
                    <span className="text-[10px] font-mono opacity-60 uppercase">{targetLanguage}</span>
                  </button>

                  {/* 3. Ambiência Sonora */}
                  <button
                    onClick={() => {
                      toggleAudio();
                    }}
                    className="w-full p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between text-xs cursor-pointer text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {isAudioPlaying ? (
                        <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <VolumeX className="w-3.5 h-3.5 opacity-60" />
                      )}
                      Ambiência Sonora
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isAudioPlaying ? 'bg-amber-600 text-white' : 'bg-black/5 dark:bg-white/10'
                    }`}>
                      {isAudioPlaying ? 'Ativo' : 'Mudo'}
                    </span>
                  </button>

                  {/* 4. Glossário do Século XIX */}
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setGlossaryInitialTerm('');
                      setShowGlossary(true);
                    }}
                    className="w-full p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 text-xs cursor-pointer text-left transition-colors"
                  >
                    <BookA className="w-3.5 h-3.5 opacity-70" />
                    <span>Dicionário Século XIX</span>
                  </button>

                  {/* 5. Caderno de Notas */}
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowNotesDrawer(true);
                    }}
                    className="w-full p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between text-xs cursor-pointer text-left transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <BookMarked className="w-3.5 h-3.5 opacity-70" />
                      Caderno de Notas
                    </span>
                    {highlights.length > 0 && (
                      <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded-full">
                        {highlights.length}
                      </span>
                    )}
                  </button>

                  {/* 6. Baixar PDF Editorial */}
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      handleDownloadPdf();
                    }}
                    disabled={isGeneratingPdf}
                    className="w-full p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between text-xs cursor-pointer text-left transition-colors disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2">
                      {isGeneratingPdf ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      )}
                      Baixar PDF Editorial
                    </span>
                  </button>

                  {/* 7. Baixar ePub */}
                  {book.epubUrl && (
                    <a
                      href={book.epubUrl}
                      download={`${book.id}.epub`}
                      className="w-full p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between text-xs cursor-pointer text-left transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        Baixar Arquivo ePub
                      </span>
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Barra contínua de progresso do LIVRO INTEIRO */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black/5 dark:bg-white/10 overflow-hidden pointer-events-none">
          <div
            className="h-full bg-amber-600 dark:bg-amber-400 transition-all duration-300"
            style={{ width: `${bookProgressPercent}%` }}
          />
        </div>
      </header>

      {/* ÁREA DE LEITURA (COLUNA EDITORIAL ENTRE 620px E 680px) COM SUPORTE A SWIPE LATERAL */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          // Toque suave na tela revela a barra inferior com auto-hide
          revealBottomBarTemporarily();
        }}
        className="flex-1 overflow-y-auto px-5 sm:px-12 py-8 pb-32 cursor-pointer select-text"
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
            {/* Título do Capítulo Puro & Minimalista */}
            <div className={`mb-8 pb-4 border-b ${readerThemeStyles.border}`}>
              <span className={`text-xs font-mono font-bold uppercase tracking-widest block mb-1 opacity-60`}>
                {currentChapter.number}
              </span>
              <h2 className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${readerThemeStyles.chapterTitle}`}>
                {currentChapter.title}
              </h2>
            </div>

            {/* Banner de Tradução Ativa (Google Tradutor) */}
            {readingMode !== 'original' && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs mb-6 select-none">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                  <Languages className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Exibindo em{' '}
                    <strong>
                      {readingMode === 'bilingual' ? 'Modo Bilíngue Interlinear' : 'Texto Integral Traduzido'}
                    </strong>{' '}
                    ({SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage)?.name || 'Português'}) via Google Tradutor
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!currentChapterTranslation && !isTranslatingChapter && (
                    <button
                      onClick={handleTranslateCurrentChapter}
                      className="px-3 py-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] cursor-pointer shadow-xs"
                    >
                      Traduzir Capítulo Agora
                    </button>
                  )}
                  <button
                    onClick={() => setReadingMode('original')}
                    className="text-[11px] font-sans text-amber-700 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Voltar ao Original
                  </button>
                </div>
              </div>
            )}

            {/* Artigo com parágrafos (Suporte a Original, Traduzido e Bilíngue) */}
            <article
              className={`font-reading leading-[1.85] space-y-6 ${readerThemeStyles.articleText}`}
              style={{ fontSize: `${fontSize}px` }}
            >
              {isTranslatingChapter && !currentChapterTranslation ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-600" />
                  <p className="text-base font-display font-bold">
                    Traduzindo capítulo com Google Tradutor...
                  </p>
                  <p className="text-xs font-mono opacity-70">
                    Processando parágrafo {translationProgress.completed} de {translationProgress.total} (
                    {Math.round((translationProgress.completed / (translationProgress.total || 1)) * 100)}%)
                  </p>
                </div>
              ) : readingMode === 'translated' && currentChapterTranslation ? (
                currentChapterTranslation.map((paragraph, idx) => (
                  <p key={`trans-${idx}`} className="relative leading-[1.85]">
                    {paragraph}
                  </p>
                ))
              ) : readingMode === 'bilingual' && currentChapterTranslation ? (
                currentChapter.content.map((paragraph, idx) => (
                  <div key={`bilingual-${idx}`} className="space-y-2 mb-6">
                    <div className="relative">
                      {renderParagraphWithHighlights(paragraph, idx)}
                    </div>
                    {currentChapterTranslation[idx] && (
                      <div className="pl-4 py-2 pr-3 my-2 border-l-2 border-amber-600/50 bg-amber-500/8 dark:bg-amber-400/8 rounded-r-xl text-[0.93em] font-serif italic text-amber-950/85 dark:text-amber-100/90 leading-relaxed">
                        <div className="flex items-center gap-1.5 text-[9.5px] font-mono not-italic uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1 font-bold select-none">
                          <Languages className="w-3 h-3" />
                          <span>Tradução ({targetLanguage.toUpperCase()}):</span>
                        </div>
                        {currentChapterTranslation[idx]}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                currentChapter.content.map((paragraph, idx) =>
                  renderParagraphWithHighlights(paragraph, idx)
                )
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

            {/* Traduzir com Google Tradutor */}
            <button
              onClick={() => {
                setQuickTranslateText(selectedText);
                setShowQuickTranslate(true);
                setSelectedText('');
                setSelectionPosition(null);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/25 hover:bg-amber-500/35 flex items-center gap-1 font-semibold cursor-pointer text-amber-300"
              title="Traduzir trecho com Google Tradutor"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Traduzir</span>
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

      {/* FLOATING PILL INFERIOR COM AUTO-HIDE AO ROLAR OU APÓS LEITURA */}
      <AnimatePresence>
        {isBottomBarVisible && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-5 left-0 right-0 flex items-center justify-center pointer-events-none z-40 px-3"
          >
            <div
              className={`pointer-events-auto px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 sm:gap-3 text-xs font-sans transition-all shadow-xl border ${readerThemeStyles.floatingPill}`}
            >
              {/* Botão Capítulo Anterior */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                disabled={currentChapterIndex === 0}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Capítulo Anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotesDrawer(true);
                }}
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:opacity-90 transition-opacity select-none"
                title="Ver caderno de notas · Progresso da leitura"
              >
                <Clock className="w-3 h-3 opacity-60 shrink-0" />
                <span className={readerThemeStyles.timeText}>{currentTime}</span>
                <span className="opacity-40">·</span>
                <span className="opacity-75 font-mono text-[11px]">
                  Cap. {currentChapterIndex + 1}/{loadedChapters.length}
                </span>
                <span className="opacity-40">·</span>
                <span className={`font-mono font-bold ${readerThemeStyles.percentText}`}>
                  {bookProgressPercent}%
                </span>
              </div>

              {/* Botão Próximo Capítulo */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                disabled={currentChapterIndex >= loadedChapters.length - 1}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Próximo Capítulo"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* Botão Ocultar Barra Manualmente */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBottomBarVisible(false);
                }}
                className="p-1 -mr-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100 transition-all cursor-pointer text-[10px]"
                title="Esconder barra de leitura"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className={`relative w-80 max-w-[85vw] border-r shadow-2xl z-10 p-5 sm:p-6 flex flex-col justify-between h-full ${readerThemeStyles.modalBg}`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/10 dark:border-white/10 shrink-0">
                  <div>
                    <h3 className="font-display text-base font-bold">Sumário de Capítulos</h3>
                    <span className="text-[11px] font-mono opacity-60">
                      {loadedChapters.length} capítulos disponíveis
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDrawer(false)}
                    className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100 cursor-pointer transition-colors"
                    title="Fechar sumário"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="space-y-1 overflow-y-auto flex-1 pr-1">
                  {loadedChapters.map((chap, idx) => (
                    <button
                      key={chap.id}
                      onClick={() => handleSelectChapter(idx)}
                      className={`w-full text-left p-3 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        idx === currentChapterIndex
                          ? 'bg-amber-600 text-white font-bold shadow-xs'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="block font-mono text-[9.5px] uppercase opacity-75">
                          {chap.number}
                        </span>
                        <span className="text-xs sm:text-sm font-sans truncate block">{chap.title}</span>
                      </div>
                      {idx === currentChapterIndex && <Check className="w-4 h-4 shrink-0" />}
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

      {/* Gaveta do Google Tradutor da Obra */}
      <ChapterTranslatorDrawer
        isOpen={showChapterTranslator}
        chapterTitle={currentChapter.title}
        chapterNumber={currentChapter.number}
        paragraphs={currentChapter.content}
        readingMode={readingMode}
        targetLanguage={targetLanguage}
        isTranslating={isTranslatingChapter}
        translationProgress={translationProgress}
        themeMode={currentTheme}
        onClose={() => setShowChapterTranslator(false)}
        onChangeReadingMode={(mode) => {
          setReadingMode(mode);
          if (mode !== 'original' && !currentChapterTranslation && !isTranslatingChapter) {
            handleTranslateCurrentChapter();
          }
        }}
        onChangeTargetLanguage={(lang) => {
          setTargetLanguage(lang);
          const newKey = `${book.id}_ch${currentChapterIndex}_${lang}`;
          if (!chapterTranslations[newKey]) {
            setTimeout(() => {
              handleTranslateCurrentChapter();
            }, 100);
          }
        }}
        onStartChapterTranslation={handleTranslateCurrentChapter}
      />

      {/* Modal de Tradução Rápida do Trecho Selecionado */}
      <QuickTranslateModal
        isOpen={showQuickTranslate}
        textToTranslate={quickTranslateText}
        defaultTargetLang={targetLanguage}
        themeMode={currentTheme}
        onClose={() => setShowQuickTranslate(false)}
        onSaveAsNote={(orig, trans) => {
          handleCreateHighlight('gold');
          setAddingNoteForText(orig);
          setNoteInputValue(`[Tradução Google]: ${trans}`);
        }}
      />
    </motion.div>
  );
};
