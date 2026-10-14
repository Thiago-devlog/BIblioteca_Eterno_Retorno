import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCentury: string;
  onCenturyChange: (century: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCentury,
  onCenturyChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`bg-[#FAF8F5] border rounded-2xl p-3 sm:p-4 shadow-sm transition-all duration-300 ${
        isFocused
          ? 'border-[#B8860B] ring-2 ring-[#B8860B]/20 shadow-md'
          : 'border-[rgba(15,23,42,0.08)]'
      }`}
    >
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Campo de Busca com Lupa */}
        <div className="relative flex-1 w-full">
          <Search
            className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              isFocused ? 'text-[#B8860B]' : 'text-[#64748B]'
            }`}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Buscar por título, autor, citação ou palavra-chave..."
            className="w-full pl-10 pr-9 py-2 bg-transparent text-sm text-[#0F172A] placeholder-[#94A3B8] font-sans focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Linha Divisória sutil */}
        <div className="hidden md:block h-6 w-px bg-[rgba(15,23,42,0.08)]" />

        {/* Dropdowns Rápidos */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Filtro por Categoria */}
          <div className="flex items-center gap-1.5 bg-[#FDFBF7] border border-[rgba(15,23,42,0.08)] rounded-xl px-2.5 py-1.5 text-xs text-[#0F172A]">
            <Filter className="w-3.5 h-3.5 text-[#9A5B32]" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-transparent text-xs font-sans text-[#0F172A] focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos os Gêneros</option>
              <option value="Romance">Romances</option>
              <option value="Poesia">Poesia</option>
              <option value="Psicológico">Psicológico</option>
              <option value="Naturalista">Naturalista</option>
              <option value="Indianista">Indianista</option>
            </select>
          </div>

          {/* Filtro por Século */}
          <div className="flex items-center gap-1.5 bg-[#FDFBF7] border border-[rgba(15,23,42,0.08)] rounded-xl px-2.5 py-1.5 text-xs text-[#0F172A]">
            <span className="text-[10px] font-mono font-bold text-[#B8860B]">SÉC:</span>
            <select
              value={selectedCentury}
              onChange={(e) => onCenturyChange(e.target.value)}
              className="bg-transparent text-xs font-sans text-[#0F172A] focus:outline-none cursor-pointer"
            >
              <option value="todos">Todos os Séculos</option>
              <option value="XIX">Séc. XIX</option>
              <option value="XX">Séc. XX</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
