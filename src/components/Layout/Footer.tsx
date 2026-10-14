import React from 'react';
import { ArrowUp, BookOpen, Feather } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-[rgba(15,23,42,0.08)] bg-[#FAF8F5] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Colofão Editorial */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-10 h-10 rounded-sm bg-[#0F172A] text-[#FDFBF7] flex items-center justify-center shadow-sm shrink-0">
            <Feather className="w-5 h-5 text-[#B8860B]" />
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="font-display font-bold text-base text-[#0F172A] uppercase tracking-wider">
                Eterno Retorno
              </span>
              <span className="text-[rgba(15,23,42,0.2)]">·</span>
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A5B32]">
                COLOFÃO EDITORIAL
              </span>
            </div>
            <p className="font-cormorant italic text-sm text-[#64748B] mt-1 max-w-md">
              Edições com texto integral baseadas nas publicações de Garnier, Typographia Nacional e periódicos do Século XIX e início do Século XX.
            </p>
          </div>
        </div>

        {/* Botão Voltar ao Topo */}
        <button
          onClick={scrollToTop}
          className="px-4 py-2.5 rounded-full border border-[rgba(15,23,42,0.12)] text-xs font-sans font-bold uppercase tracking-widest text-[#0F172A] hover:bg-[#0F172A] hover:text-[#FAF8F5] flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <span>Voltar ao Topo</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#B8860B]" />
        </button>
      </div>
    </footer>
  );
};
