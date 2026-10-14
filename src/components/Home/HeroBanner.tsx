import React from 'react';
import { AuthorProfile } from '../../data/booksData';
import { FolderArchive, BookOpen, Quote, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  authors: AuthorProfile[];
  currentAuthor: AuthorProfile;
  authorBooksCount: number;
  onSelectAuthor: (authorId: string) => void;
  onOpenFolderDrawer: () => void;
  onExploreCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  authors,
  currentAuthor,
  authorBooksCount,
  onSelectAuthor,
  onOpenFolderDrawer,
  onExploreCatalog,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#020617] text-[#FAF8F5] shadow-2xl border border-[rgba(255,255,255,0.08)]">
      {/* Brilho radial dourado no canto superior direito e textura suave */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#B8860B]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-[#9A5B32]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid do Conteúdo do Banner */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Lado Esquerdo: Textos do Autor Dinâmico */}
        <div className="lg:col-span-7 space-y-6">
          {/* Carimbo de Arquivo Oficial */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B8860B] animate-pulse"></span>
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#C28251]">
              AUTOR EM FOCO · {currentAuthor.archiveCode}
            </span>
          </div>

          <div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF8F5] leading-[1.12]">
              {currentAuthor.name}
            </h1>
            <p className="font-cormorant italic text-lg sm:text-xl text-[#CBD5E1] mt-2">
              {currentAuthor.movement} · {currentAuthor.lifespan} ({currentAuthor.role})
            </p>
          </div>

          <p className="font-reading text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl">
            {currentAuthor.bio}
          </p>

          {/* Citação Canônica */}
          <div className="relative bg-[#0F172A]/80 border-l-2 border-[#B8860B] py-3.5 px-4 rounded-r-sm max-w-xl">
            <Quote className="w-5 h-5 text-[#B8860B]/40 absolute top-2 right-2" />
            <p className="font-cormorant italic text-base sm:text-lg text-[#F1F5F9] leading-snug">
              “{currentAuthor.quote}”
            </p>
          </div>

          {/* Botões de Ação do Banner */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenFolderDrawer}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider font-sans bg-[#C28251] hover:bg-[#A96E40] text-[#020617] rounded-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <FolderArchive className="w-4 h-4" />
              <span>Abrir Pasta de Arquivo ({authorBooksCount} Obras)</span>
            </button>

            <button
              onClick={onExploreCatalog}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider font-sans bg-[#1E293B] hover:bg-[#334155] text-[#FAF8F5] rounded-sm border border-[rgba(255,255,255,0.12)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#B8860B]" />
              <span>Ver no Catálogo</span>
            </button>
          </div>
        </div>

        {/* Lado Direito: Retrato com mesclagem e acabamento nobre */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
          <div className="relative w-full max-w-[280px] sm:max-w-[310px] bg-[#0F172A] p-3 rounded-2xl border border-[rgba(255,255,255,0.12)] shadow-2xl">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#020617] border border-[rgba(255,255,255,0.06)]">
              <img
                src={currentAuthor.portraitUrl}
                alt={`Retrato oficial de ${currentAuthor.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-125 brightness-95 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8860B] block">
                  Edição Canônica
                </span>
                <span className="font-display text-sm font-bold text-white block">
                  {currentAuthor.shortName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Avatares Horizontal (Clicar muda o autor do banner instantaneamente) */}
      <div className="relative z-10 border-t border-[rgba(255,255,255,0.08)] bg-[#0A0F1D]/80 px-6 sm:px-10 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8]">
            Selecione o Autor para o Foco Literário
          </span>
          <span className="text-xs text-[#CBD5E1] font-cormorant italic hidden sm:inline">
            Clique no avatar para alternar o dossiê em tempo real
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-1 pt-1">
          {authors.map((author) => {
            const isSelected = author.id === currentAuthor.id;
            return (
              <button
                key={author.id}
                onClick={() => onSelectAuthor(author.id)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#B8860B]/20 border-[#B8860B] text-[#FAF8F5] ring-1 ring-[#B8860B]'
                    : 'bg-[#0F172A]/60 border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-[#FAF8F5] hover:bg-[#1E293B]'
                }`}
                title={`Alternar para ${author.name}`}
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[rgba(255,255,255,0.2)] shrink-0">
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <span className="text-xs font-sans font-semibold whitespace-nowrap">
                  {author.shortName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
