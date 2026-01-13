// PDF Export and Report Generation
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculatePersonalYearNumber,
  getNumberMeaning
} from './numerology';
import { calculatePinnacles, calculateChallenges } from './pinnacles';
import { calculateKarmicDebts, calculateKarmicLessons } from './karmic';
import { Language } from './translations';

export interface ReportData {
  fullName: string;
  birthDate: Date;
  language: Language;
}

export interface CustomReportOptions {
  includeCharts?: boolean;
  includeKarmic?: boolean;
  includePinnacles?: boolean;
  includeCycles?: boolean;
  includePredictions?: boolean;
}

/**
 * Apply branding to PDF document (logo, colors, footer).
 * @param doc - jsPDF document instance
 */
export const applyPDFBranding = (doc: jsPDF): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Footer with branding
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Numerology Compass - Discover Your Life Path Through Numbers',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
  
  // Page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 20,
      pageHeight - 10,
      { align: 'right' }
    );
  }
};

/**
 * Generate full numerology report as PDF.
 * @param data - Report data (name, birth date, language)
 * @param options - Custom report options
 * @returns Promise that resolves when PDF is generated
 */
export const generateFullReportPDF = async (
  data: ReportData,
  options: CustomReportOptions = {}
): Promise<void> => {
  const {
    includeCharts = true,
    includeKarmic = true,
    includePinnacles = true,
    includeCycles = true,
    includePredictions = false
  } = options;
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;
  
  // Title
  doc.setFontSize(24);
  doc.setTextColor(139, 92, 246); // Purple color
  doc.setFont('helvetica', 'bold');
  doc.text('Numerology Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.fullName}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`Born: ${data.birthDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 20;
  
  // Core Numbers Section
  doc.setFontSize(18);
  doc.setTextColor(139, 92, 246);
  doc.setFont('helvetica', 'bold');
  doc.text('Core Numbers', margin, yPos);
  yPos += 10;
  
  const lifePath = calculateLifePathNumber(data.birthDate);
  const destiny = calculateDestinyNumber(data.fullName);
  const soulUrge = calculateSoulUrgeNumber(data.fullName);
  const personality = calculatePersonalityNumber(data.fullName);
  const personalYear = calculatePersonalYearNumber(data.birthDate);
  
  const numberMeanings = {
    ro: {
      lifePath: 'Numărul Drumului Vieții',
      destiny: 'Numărul Destinului',
      soulUrge: 'Numărul Sufletului',
      personality: 'Numărul Personalității',
      personalYear: 'Anul Personal'
    },
    en: {
      lifePath: 'Life Path Number',
      destiny: 'Destiny Number',
      soulUrge: 'Soul Urge Number',
      personality: 'Personality Number',
      personalYear: 'Personal Year'
    },
    ru: {
      lifePath: 'Число Жизненного Пути',
      destiny: 'Число Судьбы',
      soulUrge: 'Число Души',
      personality: 'Число Личности',
      personalYear: 'Личный Год'
    }
  }[data.language];
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  
  // Life Path
  doc.text(`${numberMeanings.lifePath}:`, margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${lifePath}`, margin + 80, yPos);
  const lifePathMeaning = getNumberMeaning(lifePath);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  yPos += 7;
  doc.text(lifePathMeaning.description[data.language].substring(0, 150) + '...', margin, yPos, { maxWidth: pageWidth - 2 * margin });
  yPos += 12;
  
  // Destiny
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`${numberMeanings.destiny}:`, margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${destiny}`, margin + 80, yPos);
  const destinyMeaning = getNumberMeaning(destiny);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  yPos += 7;
  doc.text(destinyMeaning.description[data.language].substring(0, 150) + '...', margin, yPos, { maxWidth: pageWidth - 2 * margin });
  yPos += 12;
  
  // Soul Urge
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`${numberMeanings.soulUrge}:`, margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${soulUrge}`, margin + 80, yPos);
  const soulUrgeMeaning = getNumberMeaning(soulUrge);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  yPos += 7;
  doc.text(soulUrgeMeaning.description[data.language].substring(0, 150) + '...', margin, yPos, { maxWidth: pageWidth - 2 * margin });
  yPos += 12;
  
  // Personality
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`${numberMeanings.personality}:`, margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${personality}`, margin + 80, yPos);
  const personalityMeaning = getNumberMeaning(personality);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  yPos += 7;
  doc.text(personalityMeaning.description[data.language].substring(0, 150) + '...', margin, yPos, { maxWidth: pageWidth - 2 * margin });
  yPos += 12;
  
  // Personal Year
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(`${numberMeanings.personalYear}:`, margin, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${personalYear}`, margin + 80, yPos);
  yPos += 15;
  
  // Check if we need a new page
  if (yPos > doc.internal.pageSize.getHeight() - 40) {
    doc.addPage();
    yPos = margin;
  }
  
  // Pinnacles Section
  if (includePinnacles) {
    doc.setFontSize(18);
    doc.setTextColor(139, 92, 246);
    doc.setFont('helvetica', 'bold');
    doc.text('Pinnacles & Challenges', margin, yPos);
    yPos += 10;
    
    const pinnacles = calculatePinnacles(data.birthDate);
    const challenges = calculateChallenges(data.birthDate);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Pinnacles:', margin, yPos);
    yPos += 7;
    
    pinnacles.forEach((pinnacle, index) => {
      doc.setFont('helvetica', 'normal');
      doc.text(`Pinnacle ${index + 1}: ${pinnacle.number} (Ages ${pinnacle.startAge}-${pinnacle.endAge})`, margin + 5, yPos);
      yPos += 6;
      
      if (yPos > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPos = margin;
      }
    });
    
    doc.setFont('helvetica', 'bold');
    doc.text('Challenges:', margin, yPos);
    yPos += 7;
    
    challenges.forEach((challenge, index) => {
      doc.setFont('helvetica', 'normal');
      doc.text(`Challenge ${index + 1}: ${challenge.number} (Ages ${challenge.startAge}-${challenge.endAge})`, margin + 5, yPos);
      yPos += 6;
      
      if (yPos > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        yPos = margin;
      }
    });
    
    yPos += 10;
  }
  
  // Karmic Section
  if (includeKarmic) {
    if (yPos > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.setFontSize(18);
    doc.setTextColor(139, 92, 246);
    doc.setFont('helvetica', 'bold');
    doc.text('Karmic Analysis', margin, yPos);
    yPos += 10;
    
    const karmicDebts = calculateKarmicDebts(data.birthDate, data.fullName);
    const karmicLessons = calculateKarmicLessons(data.fullName);
    
    if (karmicDebts.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text('Karmic Debts:', margin, yPos);
      yPos += 7;
      
      karmicDebts.forEach((debt) => {
        doc.setFont('helvetica', 'normal');
        doc.text(`Number ${debt.number}: ${debt.meaning[data.language]}`, margin + 5, yPos);
        yPos += 6;
        
        if (yPos > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPos = margin;
        }
      });
    }
    
    if (karmicLessons.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Karmic Lessons:', margin, yPos);
      yPos += 7;
      
      karmicLessons.forEach((lesson) => {
        doc.setFont('helvetica', 'normal');
        doc.text(`Missing Number: ${lesson}`, margin + 5, yPos);
        yPos += 6;
        
        if (yPos > doc.internal.pageSize.getHeight() - 40) {
          doc.addPage();
          yPos = margin;
        }
      });
    }
  }
  
  // Apply branding
  applyPDFBranding(doc);
  
  // Save PDF
  const fileName = `numerology-report-${data.fullName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
  doc.save(fileName);
};

/**
 * Generate custom report PDF with selected sections.
 * @param data - Report data
 * @param options - Custom report options
 * @returns Promise that resolves when PDF is generated
 */
export const generateCustomReportPDF = async (
  data: ReportData,
  options: CustomReportOptions
): Promise<void> => {
  return generateFullReportPDF(data, options);
};

/**
 * Generate PDF from HTML element (for charts and visualizations).
 * @param elementId - ID of HTML element to capture
 * @param fileName - Output file name
 * @returns Promise that resolves when PDF is generated
 */
export const generatePDFFromElement = async (
  elementId: string,
  fileName: string = 'numerology-chart.pdf'
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }
  
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('landscape', 'mm', 'a4');
  const imgWidth = pdf.internal.pageSize.getWidth();
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  applyPDFBranding(pdf);
  pdf.save(fileName);
};

