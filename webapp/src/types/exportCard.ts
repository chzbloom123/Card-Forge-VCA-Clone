import { toPng } from 'html-to-image';

export async function exportCardPng(
  threatScanEl: HTMLElement,
  dossierEl: HTMLElement,
  entityName: string
): Promise<void> {
  const sanitized = entityName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'entity';

  const threatPng = await toPng(threatScanEl, { pixelRatio: 2, cacheBust: true });
  const dossierPng = await toPng(dossierEl, { pixelRatio: 2, cacheBust: true });

  const a1 = document.createElement('a');
  a1.href = threatPng;
  a1.download = `${sanitized}_threat_scan.png`;
  a1.click();

  await new Promise<void>(r => setTimeout(r, 200));

  const a2 = document.createElement('a');
  a2.href = dossierPng;
  a2.download = `${sanitized}_containment_dossier.png`;
  a2.click();
}
