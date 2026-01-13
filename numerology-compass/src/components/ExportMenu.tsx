import { useState } from 'react';
import { Download, FileText, Image, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateFullReportPDF, generateCustomReportPDF, ReportData, CustomReportOptions } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';

interface ExportMenuProps {
  reportData: ReportData;
  elementId?: string; // For exporting specific element (e.g., chart)
}

export const ExportMenu = ({ reportData, elementId }: ExportMenuProps) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<CustomReportOptions>({
    includeCharts: true,
    includeKarmic: true,
    includePinnacles: true,
    includeCycles: true,
    includePredictions: false
  });
  
  const labels = {
    ro: {
      export: "Export",
      fullReport: "Raport Complet PDF",
      customReport: "Raport Personalizat",
      exportChart: "Exportă Grafic",
      options: "Opțiuni",
      includeCharts: "Include Grafice",
      includeKarmic: "Include Analiză Karmică",
      includePinnacles: "Include Pinnacles",
      includeCycles: "Include Cicluri",
      includePredictions: "Include Previziuni",
      exporting: "Se exportă...",
      success: "Export reușit!",
      error: "Eroare la export"
    },
    en: {
      export: "Export",
      fullReport: "Full Report PDF",
      customReport: "Custom Report",
      exportChart: "Export Chart",
      options: "Options",
      includeCharts: "Include Charts",
      includeKarmic: "Include Karmic Analysis",
      includePinnacles: "Include Pinnacles",
      includeCycles: "Include Cycles",
      includePredictions: "Include Predictions",
      exporting: "Exporting...",
      success: "Export successful!",
      error: "Export error"
    },
    ru: {
      export: "Экспорт",
      fullReport: "Полный Отчёт PDF",
      customReport: "Настраиваемый Отчёт",
      exportChart: "Экспорт Графика",
      options: "Опции",
      includeCharts: "Включить Графики",
      includeKarmic: "Включить Кармический Анализ",
      includePinnacles: "Включить Пики",
      includeCycles: "Включить Циклы",
      includePredictions: "Включить Прогнозы",
      exporting: "Экспорт...",
      success: "Экспорт успешен!",
      error: "Ошибка экспорта"
    }
  }[language];
  
  const handleFullReport = async () => {
    setIsExporting(true);
    try {
      await generateFullReportPDF(reportData);
      toast({
        title: labels.success,
        description: labels.fullReport
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: labels.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleCustomReport = async () => {
    setIsExporting(true);
    try {
      await generateCustomReportPDF(reportData, options);
      toast({
        title: labels.success,
        description: labels.customReport
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: labels.error,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-primary/30 text-primary hover:bg-primary/10"
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {labels.exporting}
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              {labels.export}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{labels.export}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleFullReport} disabled={isExporting}>
          <FileText className="h-4 w-4 mr-2" />
          {labels.fullReport}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCustomReport} disabled={isExporting}>
          <Settings className="h-4 w-4 mr-2" />
          {labels.customReport}
        </DropdownMenuItem>
        {elementId && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={isExporting}>
              <Image className="h-4 w-4 mr-2" />
              {labels.exportChart}
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{labels.options}</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={options.includeCharts}
          onCheckedChange={(checked) => setOptions({ ...options, includeCharts: checked })}
        >
          {labels.includeCharts}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={options.includeKarmic}
          onCheckedChange={(checked) => setOptions({ ...options, includeKarmic: checked })}
        >
          {labels.includeKarmic}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={options.includePinnacles}
          onCheckedChange={(checked) => setOptions({ ...options, includePinnacles: checked })}
        >
          {labels.includePinnacles}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={options.includeCycles}
          onCheckedChange={(checked) => setOptions({ ...options, includeCycles: checked })}
        >
          {labels.includeCycles}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={options.includePredictions}
          onCheckedChange={(checked) => setOptions({ ...options, includePredictions: checked })}
        >
          {labels.includePredictions}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

