import React, { useState } from 'react';
import {
  X,
  Languages,
  Check,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  RotateCcw,
  Loader2,
  Globe,
  Columns,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  translateChapterParagraphs,
} from '../../services/translatorService';

export type TranslationReadingMode = 'original' | 'translated' | 'bilingual';

export interface ChapterTranslatorDrawerProps {
  isOpen: boolean;
  chapterTitle: string;
  chapterNumber: string;
  paragraphs: string[];
  readingMode: TranslationReadingMode;
  targetLanguage: string;
  isTranslating: boolean;
  translationProgress: { completed: number; total: number };
  themeMode?: 'light' | 'dark' | 'amber';
  onClose: () => void;
  onChangeReadingMode: (mode: TranslationReadingMode) => void;
  onChangeTargetLanguage: (lang: string) => void;
  onStartChapterTranslation: () => void;
}

export const ChapterTranslatorDrawer: React.FC<ChapterTranslatorDrawerProps> = ({
  isOpen,
  chapterTitle,
  chapterNumber,
  paragraphs,
  readingMode,
  targetLanguage,
  isTranslating,
  translationProgress,
  themeMode = 'light',
  onClose,
  onChangeReadingMode,
  onChangeTargetLanguage,
  onStartChapterTranslation,
}) => {
  if (!isOpen) return null;

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage) || SUPPORTED_LANGUAGES[0];

  const themeStyles = {
    light: {
      drawer: 'bg-white text-slate-900 border-l border-slate-200',
      header: 'bg-slate-50 border-b border-slate-200',
      box: 'bg-slate-50 border-slate-200',
      activeCard: 'bg-amber-50 border-amber-300 text-amber-950 ring-1 ring-amber-400',
      inactiveCard: 'bg-white border-slate-200 hover:border-slate-300 text-slate-800',
      btnPrimary: 'bg-black text-white hover:bg-slate-800',
      progressBg: 'bg-slate-200',
      progressBar: 'bg-amber-600',
    },
    dark: {
      drawer: 'bg-[#111520] text-slate-100 border-l border-slate-800',
      header: 'bg-[#161B29] border-b border-slate-800',
      box: 'bg-[#161B29] border-slate-800',
      activeCard: 'bg-amber-950/40 border-amber-600 text-amber-200 ring-1 ring-amber-500',
      inactiveCard: 'bg-[#191F30] border-slate-800 hover:border-slate-700 text-slate-200',
      btnPrimary: 'bg-amber-500 text-black hover:bg-amber-400 font-bold',
      progressBg: 'bg-slate-800',
      progressBar: 'bg-amber-400',
    },
    amber: {
      drawer: 'bg-[#F9F2DE] text-[#3B2B1B] border-l border-[#DECAB0]',
      header: 'bg-[#EFE2C2] border-b border-[#DECAB0]',
      box: 'bg-[#F4E9CD] border-[#DECAB0]',
      activeCard: 'bg-[#ECD9B3] border-[#8C4A19] text-[#4A260C] ring-1 ring-[#8C4A19]',
      inactiveCard: 'bg-[#FAF5E6] border-[#DECAB0] hover:border-[#D0B898] text-[#3B2B1B]',
      btnPrimary: 'bg-[#5C3210] text-[#FAF3E0] hover:bg-[#43230A]',
      progressBg: 'bg-[#E5D4B0]',
      progressBar: 'bg-[#8C4A19]',
    },
  }[themeMode];

  const percent =
    translationProgress.total > 0
      ? Math.round((translationProgress.completed / translationProgress.total) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
      />

      {/* Gaveta Lateral à Direita */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className={`fixed inset-y-0 right-0 w-full max-w-md shadow-2xl flex flex-col z-10 ${themeStyles.drawer}`}
      >
        {/* Topo da Gaveta */}
        <div className={`p-4 sm:p-5 flex items-center justify-between ${themeStyles.header}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base tracking-tight">
                  Google Tradutor da Obra
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold">
                  API Oficial
                </span>
              </div>
              <p className="text-[11px] opacity-70">
                {chapterNumber} · {paragraphs.length} parágrafos
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

        {/* Conteúdo da Gaveta */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left">
          {/* 1. SELEÇÃO DE IDIOMA DE DESTINO */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider font-bold opacity-75">
                1. Idioma da Tradução:
              </span>
              <span className="text-xs font-mono opacity-60">
                {currentLangObj.flag} {currentLangObj.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === targetLanguage;
                return (
                  <button
                    key={lang.code}
                    onClick={() => onChangeTargetLanguage(lang.code)}
                    disabled={isTranslating}
                    className={`p-2.5 rounded-xl border text-xs font-sans text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? themeStyles.activeCard
                        : `${themeStyles.inactiveCard} opacity-80 hover:opacity-100`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      <span className="font-semibold">{lang.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. MODO DE VISUALIZAÇÃO NO LEITOR */}
          <div>
            <span className="block text-xs font-mono uppercase tracking-wider font-bold opacity-75 mb-2.5">
              2. Modo de Exibição no Leitor:
            </span>

            <div className="space-y-2.5">
              {/* Opção A: Apenas Original */}
              <div
                onClick={() => onChangeReadingMode('original')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  readingMode === 'original' ? themeStyles.activeCard : themeStyles.inactiveCard
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Texto Original Canônico</span>
                  </div>
                  {readingMode === 'original' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-[11px] opacity-70 pl-6">
                  Leitura na língua original da edição catalogada (preserva a grafia e estilo da época).
                </p>
              </div>

              {/* Opção B: Texto Traduzido */}
              <div
                onClick={() => onChangeReadingMode('translated')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  readingMode === 'translated' ? themeStyles.activeCard : themeStyles.inactiveCard
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Texto Integral Traduzido</span>
                  </div>
                  {readingMode === 'translated' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-[11px] opacity-70 pl-6">
                  Substitui os parágrafos pela tradução direta do Google Tradutor em {currentLangObj.name}.
                </p>
              </div>

              {/* Opção C: Bilíngue Lado a Lado (Interlinear) */}
              <div
                onClick={() => onChangeReadingMode('bilingual')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  readingMode === 'bilingual' ? themeStyles.activeCard : themeStyles.inactiveCard
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Columns className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Modo Bilíngue (Estudo Comparado)</span>
                  </div>
                  {readingMode === 'bilingual' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-[11px] opacity-70 pl-6">
                  Apresenta o parágrafo original seguido imediatamente pela sua versão traduzida. Ideal para acadêmicos e poliglotas!
                </p>
              </div>
            </div>
          </div>

          {/* 3. AÇÃO DE TRADUÇÃO / PROGRESSO */}
          <div className={`p-4 rounded-2xl border space-y-3 ${themeStyles.box}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-sans">
                Status da Tradução:
              </span>
              <span className="text-[11px] font-mono opacity-70">
                {translationProgress.completed}/{translationProgress.total} parágrafos
              </span>
            </div>

            {/* Barra de Progresso */}
            <div className={`w-full h-2 rounded-full overflow-hidden ${themeStyles.progressBg}`}>
              <div
                className={`h-full transition-all duration-300 ${themeStyles.progressBar}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            {isTranslating ? (
              <div className="flex items-center justify-center gap-2 text-xs font-sans text-amber-600 dark:text-amber-400 py-1 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Traduzindo com Google Tradutor... ({percent}%)</span>
              </div>
            ) : percent >= 100 ? (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Capítulo pronto em {currentLangObj.name}
                </span>
                <button
                  onClick={onStartChapterTranslation}
                  className="text-[11px] font-sans text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Recarregar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onStartChapterTranslation}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-sans font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${themeStyles.btnPrimary}`}
              >
                <Languages className="w-4 h-4" />
                <span>Traduzir Capítulo Completo para {currentLangObj.name}</span>
              </button>
            )}
          </div>
        </div>

        {/* Rodapé com Fechar */}
        <div className={`p-4 border-t flex justify-end ${themeStyles.header}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-sans font-semibold cursor-pointer"
          >
            Concluir
          </button>
        </div>
      </motion.div>
    </div>
  );
};
