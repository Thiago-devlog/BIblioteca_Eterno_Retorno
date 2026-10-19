import { BookItem, ChapterData } from '../data/catalog';
import { loadEpubChapters } from './epubLoader';

export interface PdfGenerationProgress {
  status: 'loading' | 'formatting' | 'done' | 'error';
  message: string;
}

/**
 * Utilitário de Diagramação Editorial e Geração de PDF Clássico
 */
export async function generateAndDownloadBookPdf(
  book: BookItem,
  preloadedChapters?: ChapterData[],
  onProgress?: (progress: PdfGenerationProgress) => void
): Promise<void> {
  try {
    onProgress?.({ status: 'loading', message: 'Preparando capítulos completos...' });

    let chapters: ChapterData[] = preloadedChapters || [];

    // Se não tiver capítulos pré-carregados suficientes e houver epubUrl, busca do epub
    if ((!chapters || chapters.length <= 1) && book.epubUrl) {
      try {
        const loaded = await loadEpubChapters(book.epubUrl);
        if (loaded && loaded.length > 0) {
          chapters = loaded;
        }
      } catch (e) {
        console.warn('[PDF] Falha ao ler epub, usando capítulos locais do catálogo:', e);
      }
    }

    if (!chapters || chapters.length === 0) {
      chapters = book.chapters;
    }

    onProgress?.({ status: 'formatting', message: 'Diagramando páginas e folha de rosto...' });

    // Carregamento dinâmico do jsPDF sob demanda para não pesar o bundle inicial
    const { jsPDF } = await import('jspdf');

    // Configuração da página A4 em milímetros
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const marginX = 22;
    const contentWidth = pageWidth - marginX * 2; // 166mm
    const marginTop = 26;
    const marginBottom = 24;

    // --- 1. FOLHA DE ROSTO (CAPA EDITORIAL CLÁSSICA) ---
    // Moldura dupla ornamental
    doc.setDrawColor(50, 40, 30);
    doc.setLineWidth(0.8);
    doc.rect(14, 14, pageWidth - 28, pageHeight - 28);
    doc.setLineWidth(0.3);
    doc.rect(17, 17, pageWidth - 34, pageHeight - 34);

    // Selo superior
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 90, 80);
    doc.text('BIBLIOTECA CLÁSSICA BRASILEIRA · ETERNO RETORNO', pageWidth / 2, 32, { align: 'center' });

    // Título da Obra em Tipografia Nobre
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(20, 15, 10);
    const titleLines = doc.splitTextToSize(book.title.toUpperCase(), contentWidth - 20);
    doc.text(titleLines, pageWidth / 2, 58, { align: 'center' });

    // Filete divisório clássico
    doc.setLineWidth(0.4);
    doc.line(pageWidth / 2 - 25, 76, pageWidth / 2 + 25, 76);

    // Autor
    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(60, 45, 30);
    doc.text(book.author.toUpperCase(), pageWidth / 2, 88, { align: 'center' });

    // Categoria e Época
    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(110, 100, 90);
    doc.text(`${book.category} · Século ${book.century}`, pageWidth / 2, 96, { align: 'center' });

    // Tagline / Citação de Abertura
    if (book.tagline) {
      doc.setFont('times', 'italic');
      doc.setFontSize(11);
      doc.setTextColor(70, 60, 50);
      const taglineLines = doc.splitTextToSize(`“${book.tagline}”`, contentWidth - 30);
      doc.text(taglineLines, pageWidth / 2, 130, { align: 'center' });
    }

    // Sinopse Curta de Fundo
    if (book.description) {
      doc.setFont('times', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(80, 75, 70);
      const descLines = doc.splitTextToSize(book.description, contentWidth - 24);
      doc.text(descLines.slice(0, 10), pageWidth / 2, 160, { align: 'center' });
    }

    // Rodapé da Folha de Rosto
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 80, 70);
    doc.text(`Edição Integral Canônica · Publicação Original: ${book.year}`, pageWidth / 2, pageHeight - 30, {
      align: 'center',
    });
    doc.text('Domínio Público · Restaurado para Preservação Cultural', pageWidth / 2, pageHeight - 24, {
      align: 'center',
    });

    // --- 2. SUMÁRIO DA OBRA (TOC) ---
    doc.addPage();
    let currentY = marginTop;

    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(20, 15, 10);
    doc.text('SUMÁRIO', pageWidth / 2, currentY, { align: 'center' });
    currentY += 4;
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 15, currentY, pageWidth / 2 + 15, currentY);
    currentY += 12;

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 45, 40);

    const maxTocItems = Math.min(chapters.length, 36);
    for (let i = 0; i < maxTocItems; i++) {
      const chap = chapters[i];
      const chapLabel = `${chap.number ? chap.number + ' — ' : ''}${chap.title || `Capítulo ${i + 1}`}`;
      const truncated = chapLabel.length > 55 ? chapLabel.substring(0, 52) + '...' : chapLabel;

      doc.text(truncated, marginX, currentY);
      doc.text(`pág. ${i + 3}`, pageWidth - marginX, currentY, { align: 'right' });
      currentY += 6;

      if (currentY > pageHeight - marginBottom) {
        break;
      }
    }

    if (chapters.length > 36) {
      doc.setFont('times', 'italic');
      doc.text(`(... e mais ${chapters.length - 36} capítulos na íntegra adiante)`, marginX, currentY + 4);
    }

    // --- 3. MIOLO DO LIVRO (CAPÍTULOS E PARÁGRAFOS) ---
    let pageNumber = 3;

    for (let cIdx = 0; cIdx < chapters.length; cIdx++) {
      const chapter = chapters[cIdx];
      doc.addPage();
      currentY = marginTop;

      // Cabeçalho Corrente Superior (Running Header)
      doc.setFont('times', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(140, 130, 120);
      doc.text(book.author.toUpperCase(), marginX, 15);
      doc.text(book.title.toUpperCase(), pageWidth - marginX, 15, { align: 'right' });
      doc.setLineWidth(0.2);
      doc.line(marginX, 18, pageWidth - marginX, 18);

      // Título do Capítulo
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(90, 60, 30);
      doc.text(chapter.number ? chapter.number.toUpperCase() : `CAPÍTULO ${cIdx + 1}`, pageWidth / 2, currentY, {
        align: 'center',
      });
      currentY += 6;

      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(20, 15, 10);
      const chapTitleLines = doc.splitTextToSize(chapter.title || `Capítulo ${cIdx + 1}`, contentWidth - 20);
      doc.text(chapTitleLines, pageWidth / 2, currentY, { align: 'center' });
      currentY += chapTitleLines.length * 6 + 4;

      // Vinheta de capítulo
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(130, 110, 90);
      doc.text('— · —', pageWidth / 2, currentY, { align: 'center' });
      currentY += 8;

      // Parágrafos do capítulo
      const paragraphs = Array.isArray(chapter.content)
        ? chapter.content
        : [String(chapter.content || '')];

      doc.setFont('times', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(25, 20, 15);
      const lineHeight = 5.2;

      for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
        const text = paragraphs[pIdx]?.trim();
        if (!text) continue;

        const lines = doc.splitTextToSize(text, contentWidth);

        // Se o parágrafo não couber na página atual, adiciona nova página
        if (currentY + lines.length * lineHeight > pageHeight - marginBottom) {
          // Rodapé com número da página
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(120, 110, 100);
          doc.text(`— ${pageNumber} —`, pageWidth / 2, pageHeight - 12, { align: 'center' });
          pageNumber++;

          doc.addPage();
          currentY = marginTop;

          // Running header na nova página
          doc.setFont('times', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(140, 130, 120);
          doc.text(book.author.toUpperCase(), marginX, 15);
          doc.text(book.title.toUpperCase(), pageWidth - marginX, 15, { align: 'right' });
          doc.setLineWidth(0.2);
          doc.line(marginX, 18, pageWidth - marginX, 18);

          doc.setFont('times', 'normal');
          doc.setFontSize(10.5);
          doc.setTextColor(25, 20, 15);
        }

        // Indentação clássica no primeiro parágrafo ou linha
        doc.text(lines, marginX, currentY);
        currentY += lines.length * lineHeight + 3.5;
      }

      // Rodapé da página final do capítulo
      doc.setFont('times', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120, 110, 100);
      doc.text(`— ${pageNumber} —`, pageWidth / 2, pageHeight - 12, { align: 'center' });
      pageNumber++;
    }

    onProgress?.({ status: 'done', message: 'Download iniciado com sucesso!' });

    // Dispara o download automático do arquivo PDF formatado
    const fileName = `${book.id}_edicao_classica.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('[PDF] Erro ao gerar PDF:', error);
    onProgress?.({ status: 'error', message: 'Erro ao gerar o documento PDF.' });
    throw error;
  }
}
