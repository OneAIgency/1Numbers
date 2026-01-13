// Social Media Sharing and Link Generation
import { Language } from './translations';

export interface ShareData {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}

export interface CompatibilityShareData {
  person1Name: string;
  person2Name: string;
  compatibilityScore: number;
  url: string;
}

/**
 * Share to Facebook using Web Share API or Facebook URL.
 * @param data - Share data
 */
export const shareToFacebook = (data: ShareData): void => {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`;
  
  if (navigator.share) {
    navigator.share({
      title: data.title,
      text: data.text,
      url: data.url
    }).catch(() => {
      // Fallback to URL
      window.open(shareUrl, '_blank', 'width=600,height=400');
    });
  } else {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

/**
 * Share to Twitter/X using Web Share API or Twitter URL.
 * @param data - Share data
 */
export const shareToTwitter = (data: ShareData): void => {
  const text = `${data.title} - ${data.text}`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data.url)}`;
  
  if (navigator.share) {
    navigator.share({
      title: data.title,
      text: data.text,
      url: data.url
    }).catch(() => {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    });
  } else {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

/**
 * Share to WhatsApp using Web Share API or WhatsApp URL.
 * @param data - Share data
 */
export const shareToWhatsApp = (data: ShareData): void => {
  const text = `${data.title}\n\n${data.text}\n\n${data.url}`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  
  if (navigator.share) {
    navigator.share({
      title: data.title,
      text: text,
      url: data.url
    }).catch(() => {
      window.open(shareUrl, '_blank');
    });
  } else {
    window.open(shareUrl, '_blank');
  }
};

/**
 * Share to Instagram (opens Instagram app or website).
 * Note: Instagram doesn't support direct URL sharing, so we use Web Share API.
 * @param data - Share data
 */
export const shareToInstagram = (data: ShareData): void => {
  // Instagram doesn't support direct URL sharing
  // Use Web Share API if available, otherwise show message
  if (navigator.share) {
    navigator.share({
      title: data.title,
      text: data.text,
      url: data.url
    }).catch(() => {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${data.title}\n\n${data.text}\n\n${data.url}`);
      alert('Link copied to clipboard! You can paste it in Instagram.');
    });
  } else {
    // Copy to clipboard
    navigator.clipboard.writeText(`${data.title}\n\n${data.text}\n\n${data.url}`);
    alert('Link copied to clipboard! You can paste it in Instagram.');
  }
};

/**
 * Send report by email using mailto: link.
 * @param data - Share data
 * @param recipientEmail - Optional recipient email
 */
export const sendReportByEmail = (data: ShareData, recipientEmail?: string): void => {
  const subject = encodeURIComponent(data.title);
  const body = encodeURIComponent(`${data.text}\n\n${data.url}`);
  const mailtoUrl = recipientEmail 
    ? `mailto:${recipientEmail}?subject=${subject}&body=${body}`
    : `mailto:?subject=${subject}&body=${body}`;
  
  window.location.href = mailtoUrl;
};

/**
 * Create email template for numerology report.
 * @param reportData - Report data
 * @param language - Language for template
 * @returns Email template HTML/text
 */
export const createEmailTemplate = (
  reportData: {
    fullName: string;
    birthDate: Date;
    lifePath: number;
    destiny: number;
  },
  language: Language = 'en'
): string => {
  const templates = {
    en: {
      subject: 'My Numerology Report',
      body: `Hello!

I wanted to share my numerology report with you:

Name: ${reportData.fullName}
Birth Date: ${reportData.birthDate.toLocaleDateString()}
Life Path Number: ${reportData.lifePath}
Destiny Number: ${reportData.destiny}

Check out my full report at: {URL}

Best regards!`
    },
    ro: {
      subject: 'Raportul Meu Numerologic',
      body: `Bună!

Am vrut să îți împărtășesc raportul meu numerologic:

Nume: ${reportData.fullName}
Data Nașterii: ${reportData.birthDate.toLocaleDateString('ro-RO')}
Numărul Drumului Vieții: ${reportData.lifePath}
Numărul Destinului: ${reportData.destiny}

Vezi raportul complet la: {URL}

Cu respect!`
    },
    ru: {
      subject: 'Мой Нумерологический Отчёт',
      body: `Привет!

Я хотел поделиться с тобой своим нумерологическим отчётом:

Имя: ${reportData.fullName}
Дата Рождения: ${reportData.birthDate.toLocaleDateString('ru-RU')}
Число Жизненного Пути: ${reportData.lifePath}
Число Судьбы: ${reportData.destiny}

Посмотри мой полный отчёт здесь: {URL}

С уважением!`
    }
  };
  
  return templates[language].body;
};

/**
 * Schedule email reports (client-side only - stores in localStorage).
 * Note: Actual email sending requires backend.
 * @param reportData - Report data
 * @param scheduleDate - Date to send report
 * @param recipientEmail - Recipient email
 */
export const scheduleEmailReports = (
  reportData: ShareData,
  scheduleDate: Date,
  recipientEmail: string
): void => {
  // Store in localStorage (in production, this would be sent to backend)
  const scheduledReports = JSON.parse(localStorage.getItem('scheduledReports') || '[]');
  scheduledReports.push({
    ...reportData,
    recipientEmail,
    scheduleDate: scheduleDate.toISOString(),
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('scheduledReports', JSON.stringify(scheduledReports));
  
  // Show confirmation
  alert(`Report scheduled to be sent to ${recipientEmail} on ${scheduleDate.toLocaleDateString()}`);
};

/**
 * Generate shareable link for numerology report.
 * @param reportData - Report data (name, birth date)
 * @param baseUrl - Base URL of the application
 * @returns Shareable URL with encoded data
 */
export const generateShareableLink = (
  reportData: {
    fullName: string;
    birthDate: string; // ISO string
  },
  baseUrl: string = window.location.origin
): string => {
  const params = new URLSearchParams({
    name: reportData.fullName,
    birthDate: reportData.birthDate,
    type: 'report'
  });
  
  return `${baseUrl}/?${params.toString()}`;
};

/**
 * Generate compatibility link for sharing compatibility results.
 * @param data - Compatibility share data
 * @param baseUrl - Base URL of the application
 * @returns Shareable URL with encoded compatibility data
 */
export const generateCompatibilityLink = (
  data: CompatibilityShareData,
  baseUrl: string = window.location.origin
): string => {
  const params = new URLSearchParams({
    person1: data.person1Name,
    person2: data.person2Name,
    score: data.compatibilityScore.toString(),
    type: 'compatibility'
  });
  
  return `${baseUrl}/compatibility?${params.toString()}`;
};

/**
 * Create temporary shareable link (with expiration).
 * Stores link data in localStorage with expiration timestamp.
 * @param data - Share data
 * @param expiresInHours - Hours until link expires (default: 24)
 * @returns Temporary shareable link
 */
export const createTemporaryLink = (
  data: ShareData,
  expiresInHours: number = 24
): string => {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + expiresInHours);
  
  const linkId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store in localStorage
  const tempLinks = JSON.parse(localStorage.getItem('tempShareLinks') || '{}');
  tempLinks[linkId] = {
    ...data,
    expiresAt: expirationDate.toISOString(),
    createdAt: new Date().toISOString()
  };
  localStorage.setItem('tempShareLinks', JSON.stringify(tempLinks));
  
  const baseUrl = window.location.origin;
  return `${baseUrl}/share/${linkId}`;
};

/**
 * Copy text to clipboard.
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Use native Web Share API if available.
 * @param data - Share data
 * @returns Promise that resolves when share is complete
 */
export const nativeShare = async (data: ShareData): Promise<boolean> => {
  if (!navigator.share) {
    return false;
  }
  
  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
      ...(data.imageUrl && { files: [] }) // Files not supported in all browsers
    });
    return true;
  } catch (err) {
    // User cancelled or error occurred
    return false;
  }
};

