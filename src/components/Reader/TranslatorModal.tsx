import React, { useState, useEffect } from 'react';
import {
  X,
  Languages,
  Check,
  Copy,
  MessageSquare,
  Sparkles,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  translateText,
  TranslationResult,
} from '../../services/translatorService';

export interface QuickTranslateModalProps {
  isOpen: boolean;
  textToTranslate: string;
  defaultTargetLang?: string;
  themeMode?: 'light' | 'dark' | 'amber';
  onClose: () => void;
  onSaveAsNote?: (original: string, translation: string) => void;
}

export const QuickTranslateModal: React.FC<QuickTranslateModalProps> = ({
  isOpen,
  textToTranslate,
  defaultTargetLang = 'pt',
  themeMode = 'light',
  onClose,
  onSaveAsNote,
}) => {
  const [targetLang, setTargetLang] = useState<string>(defaultTargetLang);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !textToTranslate) return;

    let isCancelled = false;
    setIsLoading(true);

    translateText(textToTranslate, targetLang)
      .then((res) => {
        if (!isCancelled) {
          setResult(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error(err);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen, textToTranslate, targetLang]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!result?.translatedText) return;
    navigator.clipboard.writeText(result.translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    if (!result?.translatedText) return;
    onSaveAsNote?.(result.originalText, result.translatedText);
    onClose();
  };

  const themeStyles = {
    light: {
      card: 'bg-white border-slate-200 text-slate-900 shadow-2xl',
      header: 'bg-slate-50 border-b border-slate-200',
      box: 'bg-slate-50 border-slate-200 text-slate-800',
      pill: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      pillActive: 'bg-amber-600 text-white',
    },
    dark: {
      card: 'bg-[#141824] border-slate-800 text-slate-100 shadow-2xl',
      header: 'bg-[#1A2030] border-b border-slate-800',
      box: 'bg-[#0E121C] border-slate-800 text-slate-200',
      pill: 'bg-slate-800 text-slate-300 hover:bg-slate-700',
      pillActive: 'bg-amber-500 text-stone-950 font-bold',
    },
    amber: {
      card: 'bg-[#FAF3E0] border-[#DFCDB0] text-[#3B2B1B] shadow-2xl',
      header: 'bg-[#F2E5C8] border-b border-[#DFCDB0]',
      box: 'bg-[#F7EED8] border-[#DFCDB0] text-[#3E2B18]',
      pill: 'bg-[#EBDDC0] text-[#5C3210] hover:bg-[#E2D2B0]',
      pillActive: 'bg-[#8C4A19] text-[#FAF3E0] font-bold',
    },
  }[themeMode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className={`relative z-10 w-full max-w-lg rounded-3xl border overflow-hidden text-left ${themeStyles.card}`}
      >
        {/* Cabeçalho */}
        <div className={`p-4 sm:p-5 flex items-center justify-between ${themeStyles.header}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-sans font-bold text-sm tracking-tight">
                  Google Tradutor
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold">
                  API Ativa
                </span>
              </div>
              <p className="text-[11px] opacity-70">
                Tradução instantânea do trecho selecionado
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 opacity-70" />
          </button>
        </div>

        {/* Corpo com Idiomas e Conteúdo */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Seletor de Idioma de Destino */}
          <div>
            <span className="block text-[11px] font-mono uppercase tracking-wider opacity-60 mb-2">
              Traduzir para:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isActive = lang.code === targetLang;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setTargetLang(lang.code)}
                    className={`px-2.5 py-1 rounded-full text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive ? themeStyles.pillActive : themeStyles.pill
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Texto Original */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] opacity-60 font-mono">
              <span>Texto Original:</span>
              {result?.sourceLang && (
                <span>Idioma detectado: {result.sourceLang.toUpperCase()}</span>
              )}
            </div>
            <div className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-reading leading-relaxed italic ${themeStyles.box}`}>
              “{textToTranslate}”
            </div>
          </div>

          {/* Seta Indicativa */}
          <div className="flex justify-center -my-1 text-amber-600 dark:text-amber-400">
            <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
          </div>

          {/* Texto Traduzido */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] opacity-60 font-mono">
              <span className="text-amber-700 dark:text-amber-400 font-bold">
                Tradução (Google Tradutor):
              </span>
              {result?.engine && (
                <span className="text-[10px]">
                  {result.engine === 'cache' ? '⚡ Cache instantâneo' : '🌐 Conexão Google'}
                </span>
              )}
            </div>

            <div className={`p-4 rounded-2xl border text-sm sm:text-base font-reading leading-relaxed relative ${themeStyles.box}`}>
              {isLoading ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-amber-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-sans opacity-70">
                    Traduzindo com Google Tradutor...
                  </span>
                </div>
              ) : (
                <p className="font-semibold text-[#1F1710] dark:text-amber-100">
                  {result?.translatedText}
                </p>
              )}
            </div>
          </div>

          {/* Ações Inferiores */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={handleCopy}
              disabled={isLoading || !result?.translatedText}
              className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs font-sans font-semibold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Tradução</span>
                </>
              )}
            </button>

            {onSaveAsNote && (
              <button
                onClick={handleSaveNote}
                disabled={isLoading || !result?.translatedText}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-sans font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Salvar como Nota</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
