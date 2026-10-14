import React from 'react';
import { Home, Library, FolderArchive, BarChart3, BookOpen } from 'lucide-react';

export type NavScreen = 'estante' | 'home' | 'pastas' | 'stats' | 'leitor';

interface BottomNavProps {
  currentScreen: NavScreen;
  onSelectScreen: (screen: NavScreen) => void;
  activeReadingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onSelectScreen,
  activeReadingCount = 2,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 pointer-events-none flex justify-center">
      <div className="pointer-events-auto max-w-md w-full bg-[#20152F]/92 backdrop-blur-xl border border-[rgba(255,255,255,0.12)] rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.65)] px-4 py-2 flex items-center justify-between">
        {/* 1. Home / Início */}
        <button
          onClick={() => onSelectScreen('home')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            currentScreen === 'home'
              ? 'text-[#F3E8FF] scale-105'
              : 'text-[#9D8EA8] hover:text-[#E9D5FF]'
          }`}
        >
          <Home className={`w-5 h-5 ${currentScreen === 'home' ? 'text-[#C084FC]' : ''}`} />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Início</span>
        </button>

        {/* 2. Library / Estante de Madeira (A Tela Principal) */}
        <button
          onClick={() => onSelectScreen('estante')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
            currentScreen === 'estante'
              ? 'text-[#F3E8FF] scale-105'
              : 'text-[#9D8EA8] hover:text-[#E9D5FF]'
          }`}
        >
          <Library className={`w-5 h-5 ${currentScreen === 'estante' ? 'text-[#C084FC]' : ''}`} />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Estante</span>
          {activeReadingCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#C084FC] animate-pulse" />
          )}
        </button>

        {/* 3. Botão Central de Pastas / Dossiês */}
        <button
          onClick={() => onSelectScreen('pastas')}
          className="relative -top-3 p-3.5 rounded-full bg-gradient-to-tr from-[#7E22CE] to-[#A855F7] text-white shadow-[0_8px_20px_rgba(168,85,247,0.5)] hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-[#3B1D5A]"
          title="Abrir Sistema de Pastas dos Autores"
        >
          <FolderArchive className="w-5 h-5" />
        </button>

        {/* 4. Stats / Caderno */}
        <button
          onClick={() => onSelectScreen('stats')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            currentScreen === 'stats'
              ? 'text-[#F3E8FF] scale-105'
              : 'text-[#9D8EA8] hover:text-[#E9D5FF]'
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${currentScreen === 'stats' ? 'text-[#C084FC]' : ''}`} />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Estatísticas</span>
        </button>

        {/* 5. Leitor */}
        <button
          onClick={() => onSelectScreen('leitor')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            currentScreen === 'leitor'
              ? 'text-[#F3E8FF] scale-105'
              : 'text-[#9D8EA8] hover:text-[#E9D5FF]'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${currentScreen === 'leitor' ? 'text-[#C084FC]' : ''}`} />
          <span className="text-[10px] font-sans font-semibold tracking-tight">Leitor</span>
        </button>
      </div>
    </nav>
  );
};
