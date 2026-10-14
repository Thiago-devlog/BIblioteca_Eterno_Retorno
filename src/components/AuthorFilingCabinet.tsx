import React, { useState } from 'react';
import { Author, Book } from '../types/library';
import { BookCard } from './BookCard';
import { Search, FolderOpen, Quote, Sparkles, BookMarked, History } from 'lucide-react';

interface AuthorFilingCabinetProps {
  authors: Author[];
  selectedAuthorId: string;
  onSelectAuthor: (authorId: string) => void;
  onOpenBook: (book: Book) => void;
  readingProgress: Record<string, { progressPercent: number }>;
}

export const AuthorFilingCabinet: React.FC<AuthorFilingCabinetProps> = ({
  authors,
  selectedAuthorId,
  onSelectAuthor,
  onOpenBook,
  readingProgress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAuthors = authors.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.movement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.books.some((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedAuthor =
    authors.find((a) => a.id === selectedAuthorId) || authors[0];

  return (
    <div className="space-y-10">
      {/* Intro Header & Curatorial Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E0D7C2]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8C2D19] mb-2">
            <FolderOpen className="w-4 h-4" />
            <span>Fichário Físico do Acervo · Séc. XIX</span>
          </div>
          <h2 className="font-display-title text-3xl sm:text-4xl font-bold text-[#1F1C18] tracking-tight">
            Gaveta de Autores &amp; Dossiês
          </h2>
          <p className="font-serif text-[#605748] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Selecione uma pasta com aba escalonada para abrir o dossiê individual do escritor, explorar sua biografia e acessar suas edições canônicas.
          </p>
        </div>

        {/* Search Input for Quick Drawer Access */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#8A7F6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por autor, obra ou movimento..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] border border-[#D5C9B0] rounded-sm text-xs sm:text-sm text-[#1F1C18] placeholder-[#9C907E] focus:outline-none focus:border-[#8C2D19] focus:ring-1 focus:ring-[#8C2D19] transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7F6C] hover:text-[#1F1C18]"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* THE PHYSICAL DRAWER & STAGGERED FOLDER TABS SYSTEM (Inspired by user's reference) */}
      <div className="relative bg-[#2C2722] rounded-md p-4 sm:p-6 shadow-2xl border-4 border-[#3D3730] overflow-hidden">
        {/* Archival Drawer Front Metal Label & Handle */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#4A423A]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#E5AA42] shadow-xs"></div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#D8CFBF]">
              GAVETA I · AUTORES DO BRASIL IMPERIAL E REPÚBLICA
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#A89C89]">
            {filteredAuthors.length} Pastas Arquivadas
          </span>
        </div>

        {/* Tabbed Folders Stack Container (Simulating tiered physical tabs) */}
        <div className="relative pt-2 pb-6">
          <div className="flex flex-wrap items-end gap-1.5 sm:gap-2">
            {filteredAuthors.map((author, index) => {
              const isSelected = author.id === selectedAuthor.id;
              // Staggered tab offsets to mimic authentic filing tabs
              const tabPositions = ['left', 'center-left', 'center', 'center-right', 'right'];
              const currentPosition = tabPositions[index % tabPositions.length];

              return (
                <button
                  key={author.id}
                  onClick={() => onSelectAuthor(author.id)}
                  className={`group relative transition-all duration-300 text-left focus-visible:outline-none cursor-pointer ${
                    isSelected
                      ? 'z-30 translate-y-0 scale-100'
                      : 'z-10 translate-y-1 hover:translate-y-0 opacity-80 hover:opacity-100'
                  }`}
                  style={{ minWidth: '150px', flex: '1 1 180px' }}
                >
                  {/* The Physical Tab Folder Head */}
                  <div
                    className={`relative px-4 py-3 rounded-t-lg border-t-2 border-x-2 transition-all shadow-md ${
                      isSelected
                        ? 'bg-[#F7F3EA] border-[#D4C8AE] text-[#1F1C18] shadow-lg ring-1 ring-black/5'
                        : 'bg-[#E3D9C3] hover:bg-[#ECE4D1] border-[#C8BDA4] text-[#4A4235]'
                    }`}
                  >
                    {/* Tab Top Grip Line / Notch */}
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#827561] truncate">
                        {author.archiveCode.split('·')[0].trim()}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isSelected
                            ? 'bg-[#8C2D19] text-[#FAF5EB]'
                            : 'bg-[#D2C5A9] text-[#554A3B]'
                        }`}
                      >
                        {author.books.length} {author.books.length === 1 ? 'obra' : 'obras'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-display-title text-sm font-bold tracking-tight truncate ${
                          isSelected ? 'text-[#8C2D19]' : 'text-[#2C2722]'
                        }`}
                      >
                        {author.shortName}
                      </h4>
                    </div>

                    <span className="block text-[10px] text-[#786D5A] font-serif italic truncate mt-0.5">
                      {author.movement}
                    </span>

                    {/* Active tab bottom indicator arrow */}
                    {isSelected && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F7F3EA] rotate-45 border-r border-b border-[#D4C8AE] z-20"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED AUTHOR'S OPEN DOSSIER (Content Inside the Active Folder) */}
        <div className="relative z-20 bg-[#F7F3EA] text-[#1F1C18] rounded-sm p-6 sm:p-10 shadow-2xl border-2 border-[#D9CDB2] transition-all">
          {/* Manila Paper Folder Crease & Texture Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-[#CFC2A4]/60 to-transparent pointer-events-none" />

          {/* Dossier Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b-2 border-[#E3DAC4]">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest font-bold bg-[#E8DEC7] text-[#695D4A] rounded-xs border border-[#D5C8AB]">
                {selectedAuthor.archiveCode}
              </span>
              <span className="text-xs font-serif italic text-[#7C6F5A]">
                {selectedAuthor.city} · {selectedAuthor.lifespan}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-sans text-[#7C6F5A]">
              <History className="w-3.5 h-3.5 text-[#8C2D19]" />
              <span>Status: Acervo Integral Verificado</span>
            </div>
          </div>

          {/* Main Author Presentation (Portrait + Biography + Famous Quote) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
            {/* Historical Portrait Frame */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="relative p-2.5 bg-[#FAF6EE] border-2 border-[#D2C5A9] rounded-xs shadow-md max-w-[240px] w-full">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#DDD3BE] border border-[#BAAB8E]">
                  <img
                    src={selectedAuthor.portraitUrl}
                    alt={`Retrato histórico de ${selectedAuthor.name}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-110 hover:contrast-125 transition-all"
                  />
                  {/* Vignette effect */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/20 pointer-events-none" />
                </div>
                <div className="mt-2.5 text-center">
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#7C6E59]">
                    Retrato Arquivístico
                  </span>
                  <span className="block text-[10px] text-[#9A8D78] font-serif italic">
                    Acervo Iconográfico Nacional
                  </span>
                </div>
              </div>
            </div>

            {/* Author Biography & Curatorial Commentary */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#8C2D19]">
                  {selectedAuthor.movement}
                </span>
                <h3 className="font-display-title text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1C18] tracking-tight mt-1 mb-4">
                  {selectedAuthor.name}
                </h3>

                <p className="font-serif text-[#4A4235] text-sm sm:text-base leading-relaxed mb-6">
                  {selectedAuthor.bio}
                </p>

                {/* Iconic Author Quote Box */}
                <div className="relative bg-[#EFE8D6] border-l-4 border-[#8C2D19] p-4 sm:p-5 rounded-r-sm mb-6">
                  <Quote className="w-6 h-6 text-[#8C2D19]/30 absolute top-3 right-3" />
                  <p className="font-serif italic text-[#312B23] text-sm sm:text-base leading-relaxed">
                    “{selectedAuthor.quote}”
                  </p>
                  <span className="block text-[11px] font-mono uppercase tracking-wider text-[#7A6E5A] mt-2">
                    — Sentença Canônica de {selectedAuthor.shortName}
                  </span>
                </div>
              </div>

              {/* Author Metrics / Fast Facts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E3DAC4]">
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-[#7C6F5C]">
                    Período em Atividade
                  </span>
                  <span className="font-serif font-bold text-sm text-[#1F1C18]">
                    {selectedAuthor.lifespan}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-[#7C6F5C]">
                    Obras no Acervo
                  </span>
                  <span className="font-serif font-bold text-sm text-[#8C2D19]">
                    {selectedAuthor.books.length} Romances Integrais
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-[#7C6F5C]">
                    Local de Criação
                  </span>
                  <span className="font-serif font-bold text-sm text-[#1F1C18]">
                    {selectedAuthor.city}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Canonical Books in this Folder */}
          <div className="pt-8 border-t-2 border-[#E3DAC4]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-[#8C2D19]" />
                <h4 className="font-display-title text-xl sm:text-2xl font-bold text-[#1F1C18]">
                  Obras Registradas neste Dossiê ({selectedAuthor.books.length})
                </h4>
              </div>
              <span className="text-xs text-[#7A6F5C] font-serif italic hidden sm:inline">
                Edições com texto integral disponível para leitura
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {selectedAuthor.books.map((book) => {
                const prog = readingProgress[book.id]?.progressPercent || 0;
                return (
                  <BookCard
                    key={book.id}
                    book={book}
                    authorName={selectedAuthor.shortName}
                    progressPercent={prog}
                    onOpenBook={onOpenBook}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Drawer Handle Mockup (Tactile filing cabinet detail) */}
        <div className="mt-6 flex justify-center">
          <div className="w-48 h-6 rounded-full bg-[#1A1715] border-2 border-[#544B41] shadow-inner flex items-center justify-center">
            <div className="w-24 h-1.5 rounded-full bg-[#2E2822]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
