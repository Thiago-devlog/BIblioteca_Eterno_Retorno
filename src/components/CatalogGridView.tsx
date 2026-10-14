import React, { useState } from 'react';
import { Author, Book } from '../types/library';
import { BookCard } from './BookCard';
import { SlidersHorizontal, Search } from 'lucide-react';

interface CatalogGridViewProps {
  authors: Author[];
  onOpenBook: (book: Book) => void;
  readingProgress: Record<string, { progressPercent: number }>;
}

export const CatalogGridView: React.FC<CatalogGridViewProps> = ({
  authors,
  onOpenBook,
  readingProgress,
}) => {
  const [selectedMovement, setSelectedMovement] = useState<string>('todos');
  const [sortOrder, setSortOrder] = useState<'year-asc' | 'year-desc' | 'title'>('year-asc');
  const [filterSearch, setFilterSearch] = useState('');

  const allBooksWithAuthor = authors.flatMap((author) =>
    author.books.map((book) => ({ book, author }))
  );

  const movements = [
    { id: 'todos', label: 'Todas as Obras' },
    { id: 'Realismo', label: 'Realismo' },
    { id: 'Naturalismo', label: 'Naturalismo' },
    { id: 'Romantismo', label: 'Romantismo' },
    { id: 'Impressionismo', label: 'Impressionismo' },
    { id: 'Pré-Modernismo', label: 'Pré-Modernismo' },
  ];

  const filtered = allBooksWithAuthor
    .filter(({ book, author }) => {
      const matchesMovement =
        selectedMovement === 'todos' ||
        book.movement.toLowerCase().includes(selectedMovement.toLowerCase());
      const matchesSearch =
        book.title.toLowerCase().includes(filterSearch.toLowerCase()) ||
        author.name.toLowerCase().includes(filterSearch.toLowerCase()) ||
        book.synopsis.toLowerCase().includes(filterSearch.toLowerCase());
      return matchesMovement && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'year-asc') return a.book.originalYear - b.book.originalYear;
      if (sortOrder === 'year-desc') return b.book.originalYear - a.book.originalYear;
      return a.book.title.localeCompare(b.book.title);
    });

  return (
    <div className="space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E0D7C2]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#8C2D19] block mb-2">
            Acervo Canônico Completo
          </span>
          <h2 className="font-display-title text-3xl sm:text-4xl font-bold text-[#1F1C18] tracking-tight">
            Catálogo Geral do Século XIX
          </h2>
          <p className="font-serif text-[#605748] text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
            Navegue por todas as obras com edições fac-símiles restauradas e capas históricas de época.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8A7F6C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            placeholder="Filtrar por título ou palavra-chave..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] border border-[#D5C9B0] rounded-sm text-xs sm:text-sm text-[#1F1C18] placeholder-[#9C907E] focus:outline-none focus:border-[#8C2D19] transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs Bar (Segmented Controls) & Sorter */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-[#EFE9DC] border border-[#DFD5C2] rounded-sm">
        <div className="flex flex-wrap items-center gap-1">
          {movements.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMovement(m.id)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors whitespace-nowrap ${
                selectedMovement === m.id
                  ? 'bg-[#1F1C18] text-[#FAF5EB] shadow-xs'
                  : 'text-[#615747] hover:bg-[#E3D9C3] hover:text-[#1F1C18]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 text-xs text-[#6B6151] ml-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#8C2D19]" />
          <span className="font-medium hidden sm:inline">Ordem:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-[#FAF6EE] border border-[#D5C9B0] rounded-xs px-2.5 py-1 text-xs text-[#1F1C18] focus:outline-none focus:border-[#8C2D19]"
          >
            <option value="year-asc">Ano (Cronológico)</option>
            <option value="year-desc">Ano (Mais recente primeiro)</option>
            <option value="title">Título (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Books Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#FAF7F0] border border-[#DDD3BF] rounded-sm">
          <p className="font-serif text-[#6F6452] text-lg">
            Nenhuma obra encontrada para os critérios selecionados.
          </p>
          <button
            onClick={() => {
              setSelectedMovement('todos');
              setFilterSearch('');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#221F1B] text-[#FAF5EB] rounded-xs hover:bg-[#38332C]"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(({ book, author }) => {
            const prog = readingProgress[book.id]?.progressPercent || 0;
            return (
              <BookCard
                key={book.id}
                book={book}
                authorName={author.shortName}
                progressPercent={prog}
                onOpenBook={onOpenBook}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
