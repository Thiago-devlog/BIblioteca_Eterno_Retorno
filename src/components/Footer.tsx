import React from 'react';
import { ArrowUp, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-24 border-t border-[#DFD5C2] bg-[#EFE9DC]/80 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B604F]">
          <span className="font-cinzel font-bold text-sm tracking-wider text-[#1F1C18] flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#8C2D19]" />
            ETERNO RETORNO
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="font-serif">
            Acervo Histórico e Biblioteca Aberta do Século XIX
          </span>
        </div>

        <button
          onClick={scrollToTop}
          className="text-xs uppercase tracking-widest font-mono font-semibold text-[#665B4A] hover:text-[#1F1C18] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Voltar ao Topo</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
