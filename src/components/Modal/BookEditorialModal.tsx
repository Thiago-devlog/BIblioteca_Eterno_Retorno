import React, { useState } from 'react';
import { BookItem } from '../../data/booksData';
import {
  X,
  BookOpen,
  CheckCircle2,
  Heart,
  Clock,
  BookMarked,
  Layers,
  Sparkles,
  Download,
  FileText,
  Loader2,
  Globe,
  ExternalLink,
  Languages,
} from 'lucide-react';
import { generateAndDownloadBookPdf } from '../../utils/editorialPdfGenerator';
import { motion } from 'motion/react';
import { calculateBookReadingTimeMinutes, formatReadingTime } from '../../utils/readingTime';

interface BookEditorialModalProps {
  book: BookItem | null;
  isOpen: boolean;
  progressPercent: number;
  isFavorite: boolean;
  onClose: () => void;
  onStartReading: (book: BookItem) => void;
  onToggleMarkAsRead: (bookId: string) => void;
  onToggleFavorite: (bookId: string) => void;
}

export const BookEditorialModal: React.FC<BookEditorialModalProps> = ({
  book,
  isOpen,
  progressPercent,
  isFavorite,
  onClose,
  onStartReading,
  onToggleMarkAsRead,
  onToggleFavorite,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatusMessage, setPdfStatusMessage] = useState<string | null>(null);

  if (!isOpen || !book) return null;

  const handleDownloadPdf = async () => {
    if (!book || isGeneratingPdf) return;
    try {
      setIsGeneratingPdf(true);
      setPdfStatusMessage('Diagramando obra em PDF...');
      await generateAndDownloadBookPdf(book, book.chapters, (prog) => {
        setPdfStatusMessage(prog.message);
      });
      setTimeout(() => {
        setIsGeneratingPdf(false);
        setPdfStatusMessage(null);
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsGeneratingPdf(false);
      setPdfStatusMessage('Erro ao gerar PDF');
      setTimeout(() => setPdfStatusMessage(null), 3000);
    }
  };

  // Cálculo refinado do tempo de leitura da obra completa
  const readingTimeMin = calculateBookReadingTimeMinutes(book);
  const readingTimeFormatted = formatReadingTime(readingTimeMin);

  const isCompleted = progressPercent >= 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop suave */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Janela Modal com Transição de Mola (Spring Physics) idêntica à referência do vídeo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.8 }}
        className="relative w-full max-w-xl bg-white rounded-[28px] sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-left max-h-[92vh] overflow-y-auto z-10"
      >
        {/* Botão Fechar com micro-interação tátil */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </motion.button>

        {/* Cabeçalho da Obra: Capa com Levitação Suave Flutuante + Dados Principais */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
          {/* Capa com Efeito de Levitação e Sombra Dinâmica idêntica à referência do vídeo */}
          <div className="flex flex-col items-center shrink-0">
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="book-spine-shadow w-28 h-40 sm:w-32 sm:h-46 rounded-lg p-3 flex flex-col justify-between border text-center shadow-xl relative z-10"
              style={{
                backgroundColor: book.coverBg || '#FAF6ED',
                borderColor: book.coverBorder || '#D8CEB7',
                color:
                  book.coverBg === '#FAF6ED' || book.coverBg === '#EFE7D8' || book.coverBg === '#ECE3D0'
                    ? '#1A1412'
                    : book.coverAccent || '#F3D27E',
                backgroundImage:
                  book.coverBg === '#FAF6ED' || book.coverBg === '#EFE7D8' || book.coverBg === '#ECE3D0'
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(230,220,200,0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.22) 100%)',
              }}
            >
              <span className="text-[9px] font-mono font-bold tracking-wider opacity-85">
                {book.year}
              </span>
              <h4 className="font-display text-[10px] sm:text-[11px] font-black uppercase leading-tight my-auto">
                {book.title}
              </h4>
              <span className="text-[8px] uppercase tracking-tighter opacity-80 font-sans">
                {book.editionLabel}
              </span>
            </motion.div>
            {/* Sombra de apoio que respira suavemente acompanhando a levitação */}
            <motion.div
              animate={{ scale: [1, 0.85, 1], opacity: [0.3, 0.15, 0.3] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="w-20 h-2 bg-black/40 blur-xs rounded-full mt-2"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 text-center sm:text-left space-y-2"
          >
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {book.category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                {book.year} ({book.century === 'XIX' ? 'Séc. XIX' : 'Séc. XX'})
              </span>
              {book.isCompleteEdition && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Obra Completa
                </span>
              )}
              {book.gutenbergUrl && (
                <a
                  href={book.gutenbergUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1"
                  title="Obra extraída de Project Gutenberg (gutenberg.org)"
                >
                  <Globe className="w-2.5 h-2.5 text-blue-600" />
                  Gutenberg #{book.gutenbergId}
                  <ExternalLink className="w-2 h-2 text-blue-500" />
                </a>
              )}
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black text-black leading-tight">
              {book.title}
            </h2>

            <p className="font-sans text-sm font-semibold text-slate-600">
              {book.author}
            </p>
          </motion.div>
        </div>

        {/* Citação / Tagline da Obra */}
        <div className="bg-slate-50 border-l-3 border-amber-600 p-3.5 rounded-r-xl mb-6">
          <p className="font-cormorant italic text-sm sm:text-base text-slate-800">
            {book.tagline}
          </p>
        </div>

        {/* Sinopse e Contexto Histórico */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-400">
            Sinopse &amp; Contexto Histórico
          </h3>
          <p className="font-reading text-xs sm:text-sm text-slate-700 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Ficha Técnica */}
        <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 text-center">
          <div>
            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Capítulos
            </span>
            <span className="font-sans font-bold text-sm text-slate-900">
              {book.chapters.length} estruturados
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Tempo Estimado
            </span>
            <span className="font-sans font-bold text-sm text-slate-900 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {readingTimeFormatted}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">
              Progresso
            </span>
            <span className="font-sans font-bold text-sm text-amber-700">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Barra de Progresso se houver */}
        {progressPercent > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs font-sans text-slate-500 mb-1.5 font-medium">
              <span>Andamento de Leitura</span>
              <span className="font-mono font-bold text-slate-900">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Recurso Google Tradutor da Obra */}
        <div className="flex items-center justify-between p-2.5 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 mb-5 text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-amber-700" />
            <span className="font-sans font-semibold">
              Google Tradutor Integrado
            </span>
          </div>
          <span className="text-[11px] font-mono text-amber-800 font-medium hidden sm:inline">
            Modo Bilíngue & Tradução Instantânea no Leitor
          </span>
        </div>

        {/* Botões de Ação Principais com Feedback Tátil */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          {/* 1. Iniciar ou Continuar Leitura */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onStartReading(book)}
            className="w-full sm:flex-1 py-3 px-5 rounded-full bg-black hover:bg-slate-900 text-white font-sans font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>
              {progressPercent > 0
                ? `Continuar de onde parou (${progressPercent}%)`
                : 'Iniciar Leitura Completa'}
            </span>
          </motion.button>

          {/* 2. Marcar como Lido */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onToggleMarkAsRead(book.id)}
            className={`w-full sm:w-auto py-3 px-4 rounded-full border text-xs font-sans font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              isCompleted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Marcar ou desmarcar como concluído"
          >
            <CheckCircle2
              className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}
            />
            <span className="whitespace-nowrap">
              {isCompleted ? 'Lido' : 'Marcar como Lido'}
            </span>
          </motion.button>

          {/* 3. Favoritar Obra */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onToggleFavorite(book.id)}
            className={`w-full sm:w-auto py-3 px-4 rounded-full border text-xs font-sans font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
              isFavorite
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title="Favoritar obra"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`}
            />
            <span className="whitespace-nowrap">
              {isFavorite ? 'Favorito' : 'Favoritar'}
            </span>
          </motion.button>
        </motion.div>

        {/* Barra de Exportações Digitais (PDF Editorial Clássico & ePub) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.3 }}
          className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2 text-slate-500 font-sans">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium">
              {pdfStatusMessage ||
                (book.gutenbergUrl
                  ? `Texto integral extraído de gutenberg.org (#${book.gutenbergId})`
                  : 'Edição integral diagramada para leitura offline')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Botão de PDF Editorial Diagramado */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-sans font-bold text-[11px] transition-colors cursor-pointer disabled:opacity-50"
              title="Baixar livro integral diagramado em PDF com folha de rosto e sumário"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-amber-700" />
              )}
              <span>{isGeneratingPdf ? 'Diagramando...' : 'Baixar PDF Editorial'}</span>
            </motion.button>

            {/* Link direto para a página no Project Gutenberg */}
            {book.gutenbergUrl && (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                href={book.gutenbergUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-sans font-semibold text-[11px] transition-colors cursor-pointer"
                title={`Abrir página oficial do livro #${book.gutenbergId} no site gutenberg.org`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Gutenberg.org</span>
                <ExternalLink className="w-3 h-3 text-blue-500" />
              </motion.a>
            )}

            {/* Botão de ePub Digital */}
            {book.epubUrl && (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                href={book.epubUrl}
                download={`${book.id}.epub`}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-sans font-semibold text-[11px] transition-colors cursor-pointer"
                title="Baixar arquivo ePub da obra completa"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>ePub Integral</span>
              </motion.a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
