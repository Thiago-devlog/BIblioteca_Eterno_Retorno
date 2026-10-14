import React from 'react';
import { ViewMode } from '../types/library';
import { BookOpen, FolderArchive, Library, BookmarkCheck } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenQuickResume: () => void;
  activeBookTitle?: string;
  activeBookProgress?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  onOpenQuickResume,
  activeBookTitle = 'Quincas Borba',
  activeBookProgress = 97,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F6F2E9]/95 backdrop-blur-md border-b border-[#E3DAC8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectView('folders')}
          className="flex items-center gap-3 text-left group focus-visible:outline-none"
        >
          <div className="w-10 h-10 rounded-sm bg-[#221F1B] text-[#EFE8DA] flex items-center justify-center shadow-sm border border-[#3E3832] group-hover:bg-[#342F29] transition-colors shrink-0">
            <BookOpen className="w-5 h-5 text-[#E3DAC8]" />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#1F1C18] whitespace-nowrap">
              ETERNO RETORNO
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#7A7164] font-medium whitespace-nowrap">
              Biblioteca Clássica &amp; Arquivo do Séc. XIX
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean Single-Line Controls) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectView('folders')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              currentView === 'folders'
                ? 'bg-[#E7DFC9] text-[#1F1C18] border border-[#CFC5AC] shadow-xs'
                : 'text-[#6C6355] hover:text-[#1F1C18] hover:bg-[#EFE9DC]'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Fichário de Pastas</span>
          </button>

          <button
            onClick={() => onSelectView('bookshelf')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              currentView === 'bookshelf'
                ? 'bg-[#E7DFC9] text-[#1F1C18] border border-[#CFC5AC] shadow-xs'
                : 'text-[#6C6355] hover:text-[#1F1C18] hover:bg-[#EFE9DC]'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>Estante Clássica</span>
          </button>

          <button
            onClick={() => onSelectView('catalog')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              currentView === 'catalog'
                ? 'bg-[#E7DFC9] text-[#1F1C18] border border-[#CFC5AC] shadow-xs'
                : 'text-[#6C6355] hover:text-[#1F1C18] hover:bg-[#EFE9DC]'
            }`}
          >
            <span>Catálogo Geral</span>
          </button>

          <button
            onClick={() => onSelectView('progress')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              currentView === 'progress'
                ? 'bg-[#E7DFC9] text-[#1F1C18] border border-[#CFC5AC] shadow-xs'
                : 'text-[#6C6355] hover:text-[#1F1C18] hover:bg-[#EFE9DC]'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Seu Progresso</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action (Resume Reading or Open Archive) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenQuickResume}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF5EB] bg-[#221F1B] hover:bg-[#38332C] active:scale-[0.98] rounded-sm transition-all flex items-center gap-2.5 shadow-sm border border-[#3D372F] whitespace-nowrap shrink-0"
            title={`Continuar lendo ${activeBookTitle}`}
          >
            <span className="w-2 h-2 rounded-full bg-[#E5AA42]"></span>
            <span className="hidden sm:inline">Continuar:</span>
            <span className="font-serif italic capitalize max-w-[110px] sm:max-w-[140px] truncate text-[#E9DFCE]">
              {activeBookTitle}
            </span>
            <span className="text-[10px] text-[#CBBFA8] bg-[#3B352D] px-1.5 py-0.5 rounded">
              {activeBookProgress}%
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E5DCB] px-2 py-2 bg-[#F2ECE0] overflow-x-auto">
        <button
          onClick={() => onSelectView('folders')}
          className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap rounded ${
            currentView === 'folders' ? 'bg-[#E3D9C1] text-[#1F1C18]' : 'text-[#665E50]'
          }`}
        >
          Pastas
        </button>
        <button
          onClick={() => onSelectView('bookshelf')}
          className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap rounded ${
            currentView === 'bookshelf' ? 'bg-[#E3D9C1] text-[#1F1C18]' : 'text-[#665E50]'
          }`}
        >
          Estante
        </button>
        <button
          onClick={() => onSelectView('catalog')}
          className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap rounded ${
            currentView === 'catalog' ? 'bg-[#E3D9C1] text-[#1F1C18]' : 'text-[#665E50]'
          }`}
        >
          Catálogo
        </button>
        <button
          onClick={() => onSelectView('progress')}
          className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap rounded ${
            currentView === 'progress' ? 'bg-[#E3D9C1] text-[#1F1C18]' : 'text-[#665E50]'
          }`}
        >
          Progresso
        </button>
      </div>
    </header>
  );
};
