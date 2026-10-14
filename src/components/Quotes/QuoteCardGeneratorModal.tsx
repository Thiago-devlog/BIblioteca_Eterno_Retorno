import React, { useState, useRef } from 'react';
import { QuoteCardOptions } from '../../types/annotations';
import { X, Download, Copy, Check, Sparkles, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuoteCardGeneratorModalProps {
  isOpen: boolean;
  options: QuoteCardOptions;
  onClose: () => void;
}

export const QuoteCardGeneratorModal: React.FC<QuoteCardGeneratorModalProps> = ({
  isOpen,
  options,
  onClose,
}) => {
  const [theme, setTheme] = useState<'parchment' | 'imperial' | 'terracotta' | 'velvet'>(
    options.theme || 'parchment'
  );
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const themeConfig = {
    parchment: {
      label: 'Pergaminho',
      bgClass: 'bg-[#FDFBF7]',
      textClass: 'text-[#0F172A]',
      accentClass: 'text-[#9A5B32]',
      borderClass: 'border-[#E2DDD3]',
      canvasBg: '#FDFBF7',
      canvasText: '#0F172A',
      canvasAccent: '#9A5B32',
      canvasBorder: '#E2DDD3',
    },
    imperial: {
      label: 'Carvão Imperial',
      bgClass: 'bg-[#0F172A]',
      textClass: 'text-[#F8FAFC]',
      accentClass: 'text-[#F59E0B]',
      borderClass: 'border-[#334155]',
      canvasBg: '#0F172A',
      canvasText: '#F8FAFC',
      canvasAccent: '#F59E0B',
      canvasBorder: '#334155',
    },
    terracotta: {
      label: 'Terracota Nobre',
      bgClass: 'bg-[#351810]',
      textClass: 'text-[#FAF5EE]',
      accentClass: 'text-[#FDBA74]',
      borderClass: 'border-[#5B2E22]',
      canvasBg: '#351810',
      canvasText: '#FAF5EE',
      canvasAccent: '#FDBA74',
      canvasBorder: '#5B2E22',
    },
    velvet: {
      label: 'Veludo Noturno',
      bgClass: 'bg-[#1D102C]',
      textClass: 'text-[#F5EEFD]',
      accentClass: 'text-[#D8B4FE]',
      borderClass: 'border-[#432363]',
      canvasBg: '#1D102C',
      canvasText: '#F5EEFD',
      canvasAccent: '#D8B4FE',
      canvasBorder: '#432363',
    },
  }[theme];

  // Exportar imagem em alta resolução 1080x1920 (Stories 9:16) via HTML5 Canvas
  const handleDownloadImage = () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const conf = themeConfig;

      // Fundo
      ctx.fillStyle = conf.canvasBg;
      ctx.fillRect(0, 0, 1080, 1920);

      // Moldura elegante
      ctx.strokeStyle = conf.canvasAccent;
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, 960, 1800);
      ctx.strokeRect(74, 74, 932, 1772);

      // Topo: Marca Eterno Retorno
      ctx.fillStyle = conf.canvasAccent;
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ETERNO RETORNO · BIBLIOTECA CLÁSSICA', 540, 160);

      // Aspas de abertura
      ctx.font = 'italic 160px "Playfair Display", Georgia, serif';
      ctx.fillText('“', 540, 380);

      // Quebra de linhas do texto da citação
      ctx.fillStyle = conf.canvasText;
      ctx.font = 'italic 52px "Playfair Display", Georgia, serif';

      const words = options.quote.split(' ');
      let line = '';
      const lines: string[] = [];
      const maxWidth = 800;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line.trim());
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());

      // Posição vertical centralizada do texto
      const startY = 620 - (lines.length * 35);
      lines.forEach((l, index) => {
        ctx.fillText(l, 540, startY + index * 75);
      });

      // Linha decorativa
      ctx.strokeStyle = conf.canvasAccent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(340, 1420);
      ctx.lineTo(740, 1420);
      ctx.stroke();

      // Livro e Autor no rodapé
      ctx.fillStyle = conf.canvasText;
      ctx.font = 'bold 42px "Playfair Display", Georgia, serif';
      ctx.fillText(options.bookTitle, 540, 1500);

      ctx.fillStyle = conf.canvasAccent;
      ctx.font = '32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${options.author} (${options.year})`, 540, 1560);

      ctx.fillStyle = conf.canvasText;
      ctx.font = 'italic 26px "Playfair Display", Georgia, serif';
      ctx.fillText('Edição Integral Canônica do Século XIX', 540, 1620);

      // Gerar Download
      const link = document.createElement('a');
      link.download = `citacao-${options.bookTitle.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Erro ao gerar card de citação:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    const text = `“${options.quote}”\n— ${options.bookTitle}, ${options.author} (${options.year})\n(via Eterno Retorno — Biblioteca Clássica)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop suave */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Modal com física de mola idêntica à referência */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.8 }}
            className="relative w-full max-w-xl bg-white rounded-[28px] sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 text-left max-h-[92vh] overflow-y-auto z-10"
          >
            {/* Fechar com micro-interação */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </motion.button>

        <div className="mb-4">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-700 block mb-0.5">
            Card para Redes Sociais · Stories 9:16
          </span>
          <h2 className="font-display text-xl font-bold text-black">
            Gerador de Card de Citação
          </h2>
        </div>

        {/* Seleção de Temas */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {(['parchment', 'imperial', 'terracotta', 'velvet'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-sans font-bold capitalize transition-all cursor-pointer whitespace-nowrap border ${
                theme === t
                  ? 'bg-black text-white border-black'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t === 'parchment' && '📜 Pergaminho'}
              {t === 'imperial' && '🖤 Carvão'}
              {t === 'terracotta' && '🏺 Terracota'}
              {t === 'velvet' && '💜 Veludo'}
            </button>
          ))}
        </div>

        {/* PRÉ-VISUALIZAÇÃO DO CARD NO FORMATO STORIES 9:16 */}
        <div className="flex justify-center mb-5">
          <div
            ref={previewRef}
            className={`w-[260px] aspect-[9/16] rounded-2xl p-5 flex flex-col justify-between shadow-xl border ${themeConfig.bgClass} ${themeConfig.textClass} ${themeConfig.borderClass} text-center select-none transition-all duration-300 relative overflow-hidden`}
          >
            {/* Linha da moldura interna */}
            <div
              className={`absolute inset-2.5 border rounded-xl pointer-events-none opacity-40 ${themeConfig.borderClass}`}
            />

            {/* Cabeçalho */}
            <div className="z-10 pt-1">
              <span
                className={`text-[8px] font-sans font-bold uppercase tracking-[0.2em] block ${themeConfig.accentClass}`}
              >
                ETERNO RETORNO
              </span>
              <span className="text-[7px] font-mono opacity-70 uppercase tracking-widest">
                ACERVO DO SÉCULO XIX
              </span>
            </div>

            {/* Citação Central */}
            <div className="my-auto px-1 z-10 space-y-2">
              <span
                className={`font-display text-3xl font-black leading-none block ${themeConfig.accentClass}`}
              >
                “
              </span>
              <p className="font-display italic text-xs leading-relaxed line-clamp-6">
                {options.quote}
              </p>
            </div>

            {/* Rodapé com Obra e Autor */}
            <div className="z-10 pb-1 border-t pt-2 border-current/15">
              <h4 className="font-display font-bold text-xs uppercase leading-tight line-clamp-1">
                {options.bookTitle}
              </h4>
              <p
                className={`text-[9px] font-sans font-semibold mt-0.5 ${themeConfig.accentClass}`}
              >
                {options.author} · {options.year}
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="w-full sm:flex-1 py-3 px-5 rounded-full bg-black hover:bg-slate-900 text-white font-sans font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isExporting ? 'Renderizando...' : 'Baixar Imagem Stories (9:16)'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="w-full sm:w-auto py-3 px-4 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-800 font-sans font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            title="Copiar texto formatado com citação e autor"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={() => {
              const text = encodeURIComponent(
                `“${options.quote}”\n— ${options.bookTitle}, ${options.author} (${options.year})\n(Eterno Retorno — Biblioteca Clássica)`
              );
              window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
            }}
            className="w-full sm:w-auto py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            title="Compartilhar citação no WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>
      </motion.div>
    </div>
  )}
</AnimatePresence>
  );
};
