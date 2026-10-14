import React, { useState, useEffect } from 'react';
import { GlossaryTerm, lookupTerm, GLOSSARY_19TH_CENTURY } from '../../data/glossary19thCentury';
import { X, BookA, Search, BookOpen, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GlossaryPopoverProps {
  initialTerm?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryPopover: React.FC<GlossaryPopoverProps> = ({
  initialTerm = '',
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialTerm);

  useEffect(() => {
    if (initialTerm) {
      setSearchTerm(initialTerm);
    }
  }, [initialTerm]);

  const termData: GlossaryTerm | null = searchTerm ? lookupTerm(searchTerm) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal com física de mola idêntica à referência */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.8 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-left z-10"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </motion.button>

        <div className="flex items-center gap-2 mb-3">
          <BookA className="w-5 h-5 text-amber-700" />
          <h3 className="font-display text-lg font-bold text-black">
            Glossário do Século XIX
          </h3>
        </div>

        {/* Input de Busca */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar termo arcaico (ex: conchego, emplasto, casmurro)..."
            className="w-full pl-9 pr-3 py-2 text-xs font-sans rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-black"
            autoFocus
          />
        </div>

        {/* Termo Encontrado */}
        {termData ? (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-xl font-black text-amber-950">
                {termData.word}
              </h4>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
                {termData.category}
              </span>
            </div>

            <p className="font-reading text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
              {termData.meaning}
            </p>

            <div className="pt-2 border-t border-amber-200/60">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-900 block mb-0.5">
                Contexto Literário no Século XIX:
              </span>
              <p className="font-cormorant italic text-xs text-slate-700 leading-snug">
                {termData.context}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-sans">
              Termos frequentes no acervo para consulta rápida:
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
              {Object.keys(GLOSSARY_19TH_CENTURY).map((word) => (
                <button
                  key={word}
                  onClick={() => setSearchTerm(word)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-sans text-slate-700 cursor-pointer capitalize transition-colors"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-sans">
          <span>Dica: Dê duplo clique em qualquer palavra no leitor</span>
          <button
            onClick={onClose}
            className="text-black font-bold hover:underline cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
  );
};
