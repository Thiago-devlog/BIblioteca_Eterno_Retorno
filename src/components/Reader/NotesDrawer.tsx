import React, { useState } from 'react';
import { TextHighlight } from '../../types/annotations';
import { X, Sparkles, Trash2, Copy, Check, Share2, BookMarked, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotesDrawerProps {
  isOpen: boolean;
  bookTitle: string;
  highlights: TextHighlight[];
  onClose: () => void;
  onDeleteHighlight: (id: string) => void;
  onCreateQuoteCard: (quoteText: string) => void;
}

export const NotesDrawer: React.FC<NotesDrawerProps> = ({
  isOpen,
  bookTitle,
  highlights,
  onClose,
  onDeleteHighlight,
  onCreateQuoteCard,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string>('todos');

  const chapters = Array.from(new Set(highlights.map((h) => h.chapterTitle)));

  const filteredHighlights = highlights.filter((h) => {
    if (selectedChapter === 'todos') return true;
    return h.chapterTitle === selectedChapter;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const colorBadges = {
    terracotta: 'bg-[#C28251]/20 text-[#9A5B32] border-[#C28251]/40',
    gold: 'bg-[#F59E0B]/20 text-[#B45309] border-[#F59E0B]/40',
    charcoal: 'bg-[#475569]/20 text-[#334155] border-[#475569]/40',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop suave com blur e fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Gaveta lateral com física de mola idêntica à referência */}
          <motion.aside
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320, mass: 0.8 }}
            className="relative w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-2xl z-10 p-6 flex flex-col justify-between h-full"
          >
            <div>
              {/* Cabeçalho */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-700 block">
                    Caderno de Estudos
                  </span>
                  <h3 className="font-display text-lg font-bold text-black">
                    Grifos &amp; Anotações ({highlights.length})
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

        {/* Filtro por Capítulo */}
        {chapters.length > 1 && (
          <div className="mb-4">
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full text-xs font-sans p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="todos">Todos os Capítulos</option>
              {chapters.map((chap) => (
                <option key={chap} value={chap}>
                  {chap}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lista de Grifos */}
        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-190px)] pr-1">
          {filteredHighlights.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <BookMarked className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-sans">
                Nenhum grifo salvo ainda. Selecione um trecho de texto no livro para destacar ou anotar.
              </p>
            </div>
          ) : (
            filteredHighlights.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-slate-300 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      colorBadges[item.color]
                    }`}
                  >
                    {item.chapterTitle}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.createdAt}</span>
                </div>

                <p className="font-reading text-xs text-slate-800 leading-relaxed italic border-l-2 border-slate-300 pl-2.5">
                  “{item.text}”
                </p>

                {item.note && (
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-sans text-slate-700">
                    <span className="font-bold text-[10px] uppercase text-amber-700 block mb-0.5">
                      Nota Pessoal:
                    </span>
                    {item.note}
                  </div>
                )}

                {/* Ações da Nota */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200/60">
                  <button
                    onClick={() => onCreateQuoteCard(item.text)}
                    className="text-[11px] font-sans font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Card de Citação</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item.id, item.text)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
                      title="Copiar citação"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteHighlight(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Excluir grifo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.aside>
  </div>
)}
    </AnimatePresence>
  );
};
