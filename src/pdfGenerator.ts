import jsPDF from 'jspdf';
import { Estimate, UNIT_LABELS, ROOM_LABELS, EstimateItem } from './types';

export type PDFDetailLevel = 'simple' | 'standard' | 'detailed';

// Polish characters - mapping to ASCII (for basic jsPDF)
const polishToAscii: Record<string, string> = {
  'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
  'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
  'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N',
  'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z',
  '²': '2', '³': '3'
};

const sanitizePolish = (text: string): string => {
  return text.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ²³]/g, char => polishToAscii[char] || char);
};

interface PDFOptions {
  detailLevel: PDFDetailLevel;
  showMaterials: boolean;
}

interface CompanyInfo {
  companyName?: string;
  phoneNumber?: string;
}

// Groups items by workId for compact display
const groupByWork = (items: EstimateItem[]): Map<string, EstimateItem[]> => {
  const groups = new Map<string, EstimateItem[]>();
  const ungrouped: EstimateItem[] = [];
  
  items.forEach(item => {
    if (item.workId) {
      const existing = groups.get(item.workId) || [];
      existing.push(item);
      groups.set(item.workId, existing);
    } else {
      ungrouped.push(item);
    }
  });
  
  if (ungrouped.length > 0) {
    groups.set('_ungrouped', ungrouped);
  }
  
  return groups;
};

export const generatePDF = (
  estimate: Estimate, 
  companyName: string,
  options: PDFOptions = { detailLevel: 'standard', showMaterials: true },
  companyInfo?: CompanyInfo
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = 12;

  const colors = {
    primary: [37, 99, 235] as [number, number, number],
    primaryLight: [219, 234, 254] as [number, number, number],
    accent: [249, 115, 22] as [number, number, number],
    dark: [31, 41, 55] as [number, number, number],
    gray: [107, 114, 128] as [number, number, number],
    grayLight: [156, 163, 175] as [number, number, number],
    light: [243, 244, 246] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    green: [5, 150, 105] as [number, number, number],
  };

  const checkNewPage = (needed: number = 20) => {
    if (yPos > pageHeight - needed - 10) {
      doc.addPage();
      yPos = 15;
    }
  };

  // ============ HEADER - Compact ============
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 2, 'F');

  yPos = 18;
  // Logo and title in one line
  doc.setFontSize(16);
  doc.setTextColor(...colors.dark);
  doc.text('KOSZTORYS', margin, yPos);
  
  // Company name from settings or username
  const displayCompanyName = companyInfo?.companyName || companyName;
  doc.setFontSize(9);
  doc.setTextColor(...colors.gray);
  doc.text(sanitizePolish(displayCompanyName), pageWidth - margin, yPos, { align: 'right' });

  // Separator line
  yPos += 4;
  doc.setDrawColor(...colors.primaryLight);
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  // ============ DANE KONTAKTOWE - Tabelka ============
  yPos += 6;
  
  // Draw info table
  const tableWidth = contentWidth;
  const leftColWidth = tableWidth * 0.55;
  
  // Table header background
  doc.setFillColor(...colors.light);
  doc.roundedRect(margin, yPos - 2, tableWidth, 32, 2, 2, 'F');
  
  // Left column - Client info
  doc.setFontSize(7);
  doc.setTextColor(...colors.grayLight);
  doc.text('KLIENT', margin + 4, yPos + 3);
  
  doc.setFontSize(11);
  doc.setTextColor(...colors.dark);
  doc.text(sanitizePolish(estimate.clientName), margin + 4, yPos + 10);
  
  if (estimate.clientAddress) {
    doc.setFontSize(8);
    doc.setTextColor(...colors.gray);
    doc.text(sanitizePolish(estimate.clientAddress), margin + 4, yPos + 16);
  }
  
  if (estimate.projectDescription) {
    doc.setFontSize(8);
    doc.setTextColor(...colors.gray);
    const descY = estimate.clientAddress ? yPos + 22 : yPos + 16;
    doc.text(sanitizePolish(estimate.projectDescription), margin + 4, descY);
  }
  
  // Right column - Company info and date
  const rightColX = margin + leftColWidth + 4;
  
  doc.setFontSize(7);
  doc.setTextColor(...colors.grayLight);
  doc.text('WYKONAWCA', rightColX, yPos + 3);
  
  doc.setFontSize(10);
  doc.setTextColor(...colors.dark);
  doc.text(sanitizePolish(displayCompanyName), rightColX, yPos + 10);
  
  if (companyInfo?.phoneNumber) {
    doc.setFontSize(9);
    doc.setTextColor(...colors.primary);
    doc.text(sanitizePolish('Tel: ' + companyInfo.phoneNumber), rightColX, yPos + 16);
  }
  
  doc.setFontSize(8);
  doc.setTextColor(...colors.gray);
  const dateY = companyInfo?.phoneNumber ? yPos + 22 : yPos + 16;
  doc.text('Data: ' + new Date(estimate.createdAt).toLocaleDateString('pl-PL'), rightColX, dateY);
  
  yPos += 34;

  // ============ OBLICZENIA ============
  let totalLabor = 0;
  let totalMaterial = 0;

  for (const room of estimate.rooms) {
    for (const item of room.items) {
      const value = item.quantity * item.pricePerUnit;
      if (item.category === 'labor') totalLabor += value;
      else totalMaterial += value;
    }
  }

  const laborDiscount = totalLabor * (estimate.laborDiscountPercent || 0) / 100;
  const materialDiscount = totalMaterial * (estimate.materialDiscountPercent || 0) / 100;
  const finalLabor = totalLabor - laborDiscount;
  const finalMaterial = estimate.includeMaterials ? (totalMaterial - materialDiscount) : 0;
  const grandTotal = finalLabor + finalMaterial;

  // ============ WIDOK UPROSZCZONY ============
  if (options.detailLevel === 'simple') {
    yPos += 15;
    
    doc.setFillColor(...colors.light);
    doc.roundedRect(margin, yPos, contentWidth, 50, 2, 2, 'F');
    
    yPos += 12;
    doc.setFontSize(11);
    doc.setTextColor(...colors.dark);
    doc.text('PODSUMOWANIE KOSZTOW', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 10;
    doc.setFontSize(9);
    doc.text('Robocizna:', margin + 10, yPos);
    doc.text(sanitizePolish(`${finalLabor.toFixed(2)} zl`), pageWidth - margin - 10, yPos, { align: 'right' });
    
    if (estimate.includeMaterials) {
      yPos += 6;
      doc.text('Materialy:', margin + 10, yPos);
      doc.text(sanitizePolish(`${finalMaterial.toFixed(2)} zl`), pageWidth - margin - 10, yPos, { align: 'right' });
    }
    
    yPos += 10;
    doc.setFillColor(...colors.primary);
    doc.roundedRect(margin + 5, yPos - 4, contentWidth - 10, 12, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setTextColor(...colors.white);
    doc.text('RAZEM:', margin + 12, yPos + 3);
    doc.text(sanitizePolish(`${grandTotal.toFixed(2)} zl`), pageWidth - margin - 12, yPos + 3, { align: 'right' });
    
  } else {
    // ============ WIDOK STANDARD/DETAILED - Kompaktowy ============
    
    yPos += 8;
    
    for (const room of estimate.rooms) {
      checkNewPage(25);
      
      // Nagłówek pomieszczenia - kompaktowy
      doc.setFillColor(...colors.primaryLight);
      doc.roundedRect(margin, yPos, contentWidth, 8, 1, 1, 'F');
      doc.setFontSize(9);
      doc.setTextColor(...colors.primary);
      doc.text(sanitizePolish(`${room.name} (${ROOM_LABELS[room.roomType]})`), margin + 3, yPos + 5);
      yPos += 11;

      const laborItems = room.items.filter(i => i.category === 'labor');
      const materialItems = room.items.filter(i => i.category === 'material');
      
      // Grupowanie według prac dla kompaktowości
      const workGroups = groupByWork(room.items);

      if (options.detailLevel === 'detailed') {
        // Szczegółowy widok - grupowane według prac
        for (const [workId, items] of workGroups) {
          if (workId === '_ungrouped') continue;
          
          checkNewPage(15);
          const workName = items[0]?.workName || 'Praca';
          const workTotal = items.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
          
          // Nagłówek pracy
          doc.setFontSize(8);
          doc.setTextColor(...colors.accent);
          doc.text(sanitizePolish(workName), margin + 2, yPos);
          doc.setTextColor(...colors.dark);
          doc.text(sanitizePolish(`${workTotal.toFixed(2)} zl`), pageWidth - margin, yPos, { align: 'right' });
          yPos += 4;
          
          // Pozycje w pracy
          for (const item of items) {
            checkNewPage(8);
            const value = item.quantity * item.pricePerUnit;
            const prefix = item.category === 'material' ? '  - ' : '  ';
            doc.setFontSize(7);
            const itemColor = item.category === 'material' ? colors.gray : colors.dark;
            doc.setTextColor(...itemColor);
            
            const name = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;
            doc.text(sanitizePolish(prefix + name), margin + 2, yPos);
            doc.text(`${item.quantity.toFixed(1)} ${sanitizePolish(UNIT_LABELS[item.unit])}`, 115, yPos);
            doc.text(sanitizePolish(`${item.pricePerUnit.toFixed(0)}`), 135, yPos);
            doc.text(sanitizePolish(`${value.toFixed(2)}`), pageWidth - margin, yPos, { align: 'right' });
            yPos += 3.5;
          }
          yPos += 1;
        }
        
        // Niezgrupowane pozycje
        const ungrouped = workGroups.get('_ungrouped') || [];
        if (ungrouped.length > 0) {
          for (const item of ungrouped) {
            checkNewPage(8);
            const value = item.quantity * item.pricePerUnit;
            doc.setFontSize(7);
            const itemColor = item.category === 'material' ? colors.gray : colors.dark;
            doc.setTextColor(...itemColor);
            const name = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;
            doc.text(sanitizePolish(name), margin + 2, yPos);
            doc.text(`${item.quantity.toFixed(1)} ${sanitizePolish(UNIT_LABELS[item.unit])}`, 115, yPos);
            doc.text(sanitizePolish(`${item.pricePerUnit.toFixed(0)}`), 135, yPos);
            doc.text(sanitizePolish(`${value.toFixed(2)}`), pageWidth - margin, yPos, { align: 'right' });
            yPos += 3.5;
          }
        }
        
      } else {
        // Standardowy widok - tylko nazwy prac z kwotami
        const workGroups = groupByWork(laborItems);
        
        for (const [workId, items] of workGroups) {
          checkNewPage(8);
          const laborItem = items.find(i => i.category === 'labor') || items[0];
          const workName = laborItem?.workName || laborItem?.name || 'Praca';
          
          // Znajdź powiązane materiały
          const relatedMaterials = materialItems.filter(m => m.workId === workId);
          const laborValue = items.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
          const materialValue = relatedMaterials.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
          const totalValue = laborValue + (estimate.includeMaterials ? materialValue : 0);
          
          doc.setFontSize(8);
          doc.setTextColor(...colors.dark);
          const name = workName.length > 50 ? workName.substring(0, 47) + '...' : workName;
          doc.text(sanitizePolish(name), margin + 2, yPos);
          doc.text(sanitizePolish(`${totalValue.toFixed(2)} zl`), pageWidth - margin, yPos, { align: 'right' });
          yPos += 4;
        }
        
        // Niezgrupowane pozycje
        const ungroupedLabor = laborItems.filter(i => !i.workId);
        for (const item of ungroupedLabor) {
          checkNewPage(8);
          const value = item.quantity * item.pricePerUnit;
          doc.setFontSize(8);
          doc.setTextColor(...colors.dark);
          const name = item.name.length > 50 ? item.name.substring(0, 47) + '...' : item.name;
          doc.text(sanitizePolish(name), margin + 2, yPos);
          doc.text(sanitizePolish(`${value.toFixed(2)} zl`), pageWidth - margin, yPos, { align: 'right' });
          yPos += 4;
        }
      }

      // Suma pomieszczenia - kompaktowa
      const roomLabor = laborItems.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
      const roomMaterial = materialItems.reduce((s, i) => s + i.quantity * i.pricePerUnit, 0);
      const roomTotal = roomLabor + (estimate.includeMaterials ? roomMaterial : 0);
      
      doc.setDrawColor(...colors.light);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 4;
      
      doc.setFontSize(8);
      doc.setTextColor(...colors.primary);
      doc.text(sanitizePolish(`${ROOM_LABELS[room.roomType]}: ${roomTotal.toFixed(2)} zl`), pageWidth - margin, yPos, { align: 'right' });
      yPos += 6;
    }

    // ============ PODSUMOWANIE KOŃCOWE ============
    checkNewPage(45);
    yPos += 3;
    
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    
    const hasLaborDiscount = estimate.laborDiscountPercent && estimate.laborDiscountPercent > 0;
    const hasMaterialDiscount = estimate.materialDiscountPercent && estimate.materialDiscountPercent > 0;
    const hasAnyDiscount = hasLaborDiscount || hasMaterialDiscount;
    const totalDiscount = laborDiscount + materialDiscount;
    
    yPos += 6;
    doc.setFontSize(8);
    
    // Wiersz: Robocizna
    doc.setTextColor(...colors.gray);
    doc.text('Robocizna:', margin + 60, yPos);
    doc.setTextColor(...colors.dark);
    doc.text(sanitizePolish(`${totalLabor.toFixed(2)} zl`), pageWidth - margin, yPos, { align: 'right' });
    
    if (hasLaborDiscount) {
      yPos += 4;
      doc.setTextColor(...colors.green);
      doc.text(sanitizePolish(`Rabat ${estimate.laborDiscountPercent}%:`), margin + 60, yPos);
      doc.text(sanitizePolish(`-${laborDiscount.toFixed(2)} zl`), pageWidth - margin, yPos, { align: 'right' });
    }
    
    if (estimate.includeMaterials) {
      yPos += 4;
      doc.setTextColor(...colors.gray);
      doc.text('Materialy:', margin + 60, yPos);
      doc.setTextColor(...colors.dark);
      doc.text(sanitizePolish(`${totalMaterial.toFixed(2)} zl`), pageWidth - margin, yPos, { align: 'right' });
      
      if (hasMaterialDiscount) {
        yPos += 4;
        doc.setTextColor(...colors.green);
        doc.text(sanitizePolish(`Rabat ${estimate.materialDiscountPercent}%:`), margin + 60, yPos);
        doc.text(sanitizePolish(`-${materialDiscount.toFixed(2)} zl`), pageWidth - margin, yPos, { align: 'right' });
      }
    }
    
    if (hasAnyDiscount) {
      yPos += 5;
      doc.setFillColor(...colors.green);
      doc.roundedRect(pageWidth - margin - 55, yPos - 3, 55, 8, 1, 1, 'F');
      doc.setFontSize(7);
      doc.setTextColor(...colors.white);
      doc.text(sanitizePolish(`Oszczedzasz: ${totalDiscount.toFixed(2)} zl`), pageWidth - margin - 3, yPos + 2, { align: 'right' });
      yPos += 6;
    }
    
    // Final amount
    yPos += 5;
    doc.setFillColor(...colors.primary);
    doc.roundedRect(margin, yPos - 4, contentWidth, 14, 2, 2, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(...colors.white);
    doc.text('DO ZAPLATY:', margin + 8, yPos + 4);
    doc.setFontSize(13);
    doc.text(sanitizePolish(`${grandTotal.toFixed(2)} zl`), pageWidth - margin - 8, yPos + 4, { align: 'right' });
    
    // Notes section
    if (estimate.notes && estimate.notes.trim()) {
      yPos += 20;
      checkNewPage(30);
      
      doc.setFontSize(8);
      doc.setTextColor(...colors.gray);
      doc.text('UWAGI:', margin, yPos);
      yPos += 4;
      
      doc.setFontSize(8);
      doc.setTextColor(...colors.dark);
      const notesLines = doc.splitTextToSize(sanitizePolish(estimate.notes), contentWidth - 10);
      doc.text(notesLines, margin, yPos);
      yPos += notesLines.length * 4;
    }
  }

  // ============ FOOTER ============
  const footerY = pageHeight - 12;
  
  // Company contact info - more prominent
  doc.setFillColor(...colors.primaryLight);
  doc.roundedRect(margin, footerY - 10, contentWidth, 12, 2, 2, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(...colors.primary);
  const footerText = companyInfo?.phoneNumber 
    ? `${displayCompanyName} | Tel: ${companyInfo.phoneNumber}`
    : displayCompanyName;
  doc.text(
    sanitizePolish(footerText),
    pageWidth / 2, 
    footerY - 4, 
    { align: 'center' }
  );
  
  doc.setFontSize(6);
  doc.setTextColor(...colors.grayLight);
  doc.text(
    'Kosztorys wygenerowany w KosztorysPro | Ceny orientacyjne',
    pageWidth / 2, 
    footerY + 2, 
    { align: 'center' }
  );

  doc.setFillColor(...colors.primary);
  doc.rect(0, pageHeight - 2, pageWidth, 2, 'F');

  const fileName = `kosztorys_${estimate.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(sanitizePolish(fileName));
};
