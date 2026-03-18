import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export async function exportCardPdf(
  threatScanEl: HTMLElement,
  dossierEl: HTMLElement,
  entityName: string,
  classColor: string
): Promise<void> {
  const sanitized = entityName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'entity';

  const [threatPng, dossierPng] = await Promise.all([
    toPng(threatScanEl, { pixelRatio: 2, cacheBust: true }),
    toPng(dossierEl, { pixelRatio: 2, cacheBust: true }),
  ]);

  // Landscape US Letter: 11" x 8.5" at 72dpi = 792 x 612pt
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
  const pageW = 792;
  const pageH = 612;

  // Background
  pdf.setFillColor(20, 20, 20);
  pdf.rect(0, 0, pageW, pageH, 'F');

  // Header
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MUTANTS & MONSTERS — CARD PORTFOLIO', pageW / 2, 24, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setTextColor(220, 220, 220);
  pdf.text(entityName.toUpperCase(), pageW / 2, 42, { align: 'center' });

  // Cards side by side
  const cardW = 260;
  const cardH = 364;
  const gap = 20;
  const totalW = cardW * 2 + gap;
  const startX = (pageW - totalW) / 2;
  const startY = 55;

  pdf.addImage(threatPng, 'PNG', startX, startY, cardW, cardH);
  pdf.addImage(dossierPng, 'PNG', startX + cardW + gap, startY, cardW, cardH);

  // Labels
  pdf.setFontSize(7);
  pdf.setTextColor(120, 120, 120);
  pdf.text('THREAT SCAN', startX + cardW / 2, startY + cardH + 10, { align: 'center' });
  pdf.text('CONTAINMENT DOSSIER', startX + cardW + gap + cardW / 2, startY + cardH + 10, { align: 'center' });

  // Color accent bar at bottom
  const hex = classColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  pdf.setFillColor(r, g, b);
  pdf.rect(0, pageH - 4, pageW, 4, 'F');

  pdf.save(`${sanitized}_page.pdf`);
}
