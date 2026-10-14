import React from 'react';
import { BookItem } from '../../data/booksData';
import { BookOpen, Clock } from 'lucide-react';

interface BookCardProps {
  book: BookItem;
  progressPercent?: number;
  onOpenBook: (book: BookItem) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  progressPercent,
  onOpenBook,
}) => {
  return (
    <div className="canonical-book-card group flex flex-col h-full bg-[#FAF8F5] border border-[rgba(15,23,42,0.08)] rounded-2xl p-4 cursor-pointer text-left">
      {/* CAPA COM ASPECT RATIO DE LIVRO (aspect-[3/4.4]) + EFEITO DE LOMBADA 3D + SHEEN */}
      <div
        onClick={() => onOpenBook(book)}
        className="book-spine-shadow book-cover-sheen relative w-full aspect-[3/4.4] rounded-lg overflow-hidden mb-4 flex flex-col justify-between p-5 border text-left"
        style={{
          backgroundColor: book.coverBg,
          borderColor: book.coverBorder,
        }}
      >
        {/* Lombada física interna - Gradiente à esquerda */}
        <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/35 via-white/10 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />

        {/* Topo da Capa: Selo do Ano de Publicação no canto superior direito */}
        <div className="flex items-center justify-between z-10">
          <span
            className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold opacity-85"
            style={{ color: book.coverAccent }}
          >
            {book.century === 'XIX' ? 'SÉC. XIX' : 'SÉC. XX'}
          </span>

          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm shadow-xs"
            style={{
              backgroundColor: '#B8860B',
              color: '#020617',
            }}
          >
            {book.year}
          </span>
        </div>

        {/* Centro da Capa: Título e Tagline */}
        <div className="my-auto text-center px-1 z-10">
          <h3
            className="font-display text-lg sm:text-xl font-bold tracking-tight leading-snug mb-2 uppercase"
            style={{ color: book.coverAccent }}
          >
            {book.title}
          </h3>

          <p
            className="font-cormorant italic text-xs leading-relaxed opacity-90 line-clamp-2 max-w-[210px] mx-auto"
            style={{ color: book.coverAccent }}
          >
            {book.tagline}
          </p>
        </div>

        {/* Rodapé da Capa: Edição */}
        <div className="text-center z-10 border-t pt-2" style={{ borderColor: `${book.coverAccent}30` }}>
          <span
            className="text-[8px] uppercase tracking-[0.22em] font-sans font-semibold block opacity-80 truncate"
            style={{ color: book.coverAccent }}
          >
            {book.editionLabel}
          </span>
        </div>

        {/* Indicador de Progresso na Capa */}
        {typeof progressPercent === 'number' && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
            <div
              className="h-full bg-[#C28251]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* METADADOS DO RODAPÉ (Conforme item 5.D do Guia Mestre) */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Nome do Autor em Caixa Alta e fonte sans-serif */}
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#64748B] block mb-1">
            {book.author}
          </span>

          {/* Título da Obra em Playfair Display */}
          <h4
            onClick={() => onOpenBook(book)}
            className="font-display text-base font-bold text-[#0F172A] group-hover:text-[#9A5B32] transition-colors leading-snug line-clamp-1 mb-1.5"
          >
            {book.title}
          </h4>


        </div>

        {/* Indicador Visual de Progresso & Ação de Leitura */}
        <div className="pt-3 border-t border-[rgba(15,23,42,0.08)] flex items-center justify-between gap-2 mt-auto">
          {typeof progressPercent === 'number' && progressPercent > 0 ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A5B32] font-sans">
                Em Leitura
              </span>
              <span className="text-xs font-mono font-bold text-[#0F172A]">
                {progressPercent}% percorrido
              </span>
            </div>
          ) : (
            <span className="text-xs font-cormorant italic text-[#64748B]">
              Edição integral disponível
            </span>
          )}

          <button
            onClick={() => onOpenBook(book)}
            className="px-3 py-1.5 text-xs font-bold font-sans uppercase tracking-wider text-[#0F172A] bg-[#FAF8F5] group-hover:bg-[#0F172A] group-hover:text-[#FDFBF7] border border-[rgba(15,23,42,0.12)] rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>{progressPercent ? 'Continuar' : 'Ler'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
