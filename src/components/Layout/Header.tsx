import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export type ActiveNavTab = 'inicio' | 'autores' | 'catalogo' | 'estante' | 'caderno';

interface HeaderProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenQuickRead?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenQuickRead,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[rgba(15,23,42,0.08)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Lado Esquerdo: Logotipo Oficial com Ícone de Lombada */}
        <button
          onClick={() => onSelectTab('inicio')}
          className="flex items-center gap-3 text-left group focus-visible:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-sm bg-[#0F172A] text-[#FDFBF7] flex items-center justify-center shadow-sm border border-[#1E293B] relative overflow-hidden group-hover:bg-[#1E293B] transition-colors shrink-0">
            {/* Acento amarelo na lombada */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B8860B]" />
            <BookOpen className="w-5 h-5 text-[#FAF8F5] ml-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#0F172A] uppercase whitespace-nowrap leading-tight">
              Eterno Retorno
            </span>
            <span className="font-sans text-[10px] font-bold tracking-[0.22em] text-[#9A5B32] uppercase whitespace-nowrap">
              BIBLIOTECA CLÁSSICA &amp; ARQUIVO VIVO
            </span>
          </div>
        </button>

        {/* Centro: Links com sublinhado animado no hover */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { id: 'inicio', label: 'Início' },
            { id: 'autores', label: 'Autores do Séc. XIX' },
            { id: 'catalogo', label: 'Catálogo Canônico' },
            { id: 'estante', label: 'Estante Clássica' },
            { id: 'caderno', label: 'Caderno de Notas' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as ActiveNavTab)}
                className={`relative py-2 text-xs font-semibold uppercase tracking-wider font-sans transition-colors cursor-pointer whitespace-nowrap group ${
                  isActive ? 'text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <span>{item.label}</span>
                {/* Sublinhado animado no hover / ativo */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#C28251] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Lado Direito: Badge de Perfil com foto de Machado de Assis & Leitor Canônico */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 pl-3 py-1 pr-1.5 rounded-full bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] shadow-xs">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-[#0F172A] font-sans leading-tight">
                Ailton Pereira
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A5B32] font-sans">
                Leitor Canônico
              </span>
            </div>

            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#B8860B]/60 shadow-xs shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Machado_de_Assis_real.jpg/240px-Machado_de_Assis_real.jpg"
                alt="Foto de perfil com retrato de Machado de Assis"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-menu Mobile */}
      <div className="lg:hidden flex items-center justify-around border-t border-[rgba(15,23,42,0.08)] px-2 py-2 bg-[#FAF8F5] overflow-x-auto">
        {[
          { id: 'inicio', label: 'Início' },
          { id: 'autores', label: 'Autores' },
          { id: 'catalogo', label: 'Catálogo' },
          { id: 'estante', label: 'Estante' },
          { id: 'caderno', label: 'Caderno' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id as ActiveNavTab)}
            className={`px-3 py-1 text-[11px] font-sans font-semibold uppercase tracking-wider rounded whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-[#0F172A] text-[#FAF8F5]'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
