import { Share2, Facebook, Twitter, MessageCircle, Mail, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  shareToFacebook, 
  shareToTwitter, 
  shareToWhatsApp, 
  shareToInstagram,
  sendReportByEmail,
  copyToClipboard,
  nativeShare,
  ShareData
} from '@/lib/sharing';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonsProps {
  shareData: ShareData;
  showEmail?: boolean;
  showLink?: boolean;
  compatibilityData?: {
    person1Name: string;
    person2Name: string;
    compatibilityScore: number;
  };
}

export const ShareButtons = ({ 
  shareData, 
  showEmail = true, 
  showLink = true,
  compatibilityData 
}: ShareButtonsProps) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const labels = {
    ro: {
      share: "Partajează",
      shareTo: "Partajează pe",
      facebook: "Facebook",
      twitter: "Twitter",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
      email: "Trimite prin Email",
      copyLink: "Copiază Link",
      linkCopied: "Link copiat!",
      nativeShare: "Partajează"
    },
    en: {
      share: "Share",
      shareTo: "Share to",
      facebook: "Facebook",
      twitter: "Twitter",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
      email: "Send by Email",
      copyLink: "Copy Link",
      linkCopied: "Link copied!",
      nativeShare: "Share"
    },
    ru: {
      share: "Поделиться",
      shareTo: "Поделиться в",
      facebook: "Facebook",
      twitter: "Twitter",
      whatsapp: "WhatsApp",
      instagram: "Instagram",
      email: "Отправить по Email",
      copyLink: "Копировать Ссылку",
      linkCopied: "Ссылка скопирована!",
      nativeShare: "Поделиться"
    }
  }[language];
  
  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareData.url);
    if (success) {
      setCopied(true);
      toast({
        title: labels.linkCopied,
        description: shareData.url
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleNativeShare = async () => {
    const success = await nativeShare(shareData);
    if (!success) {
      // Fallback to copy link
      handleCopyLink();
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      {/* Native Share Button (mobile) */}
      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {labels.nativeShare}
        </Button>
      )}
      
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {labels.share}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{labels.shareTo}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => shareToFacebook(shareData)}>
            <Facebook className="h-4 w-4 mr-2" />
            {labels.facebook}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareToTwitter(shareData)}>
            <Twitter className="h-4 w-4 mr-2" />
            {labels.twitter}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareToWhatsApp(shareData)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {labels.whatsapp}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => shareToInstagram(shareData)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {labels.instagram}
          </DropdownMenuItem>
          {showEmail && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => sendReportByEmail(shareData)}>
                <Mail className="h-4 w-4 mr-2" />
                {labels.email}
              </DropdownMenuItem>
            </>
          )}
          {showLink && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopyLink}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {labels.linkCopied}
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    {labels.copyLink}
                  </>
                )}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

