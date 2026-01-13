import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Plus, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { JournalEntry, JournalStatistics } from '@/lib/journal';
import { api } from '@/services/api';
import { JournalEntry as JournalEntryComponent } from '@/components/JournalEntry';
import { PersonalStatistics } from '@/components/PersonalStatistics';
import { PredictionHistory } from '@/components/PredictionHistory';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Journal = () => {
  const { t } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [statistics, setStatistics] = useState<JournalStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'journal' | 'prediction'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  const [formData, setFormData] = useState({
    entryType: 'journal' as 'journal' | 'prediction',
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    mood: '',
    tags: '',
  });

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getJournalEntries({
        entryType: filterType !== 'all' ? filterType : undefined,
        limit: 50,
      });
      if (response.success && response.entries) {
        setEntries(response.entries as JournalEntry[]);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
      toast({
        title: t.error,
        description: 'Failed to load journal entries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filterType, toast, t]);

  const loadStatistics = useCallback(async () => {
    try {
      const response = await api.getJournalStatistics();
      if (response.success && response.statistics) {
        setStatistics(response.statistics as JournalStatistics);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/auth');
        return;
      }
      loadEntries();
      loadStatistics();
    }
  }, [isAuthenticated, authLoading, navigate, loadEntries, loadStatistics]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: t.error,
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      if (editingEntry) {
        const response = await api.updateJournalEntry(editingEntry.id, {
          title: formData.title,
          content: formData.content || undefined,
          date: formData.date,
          mood: formData.mood || undefined,
          tags: tags.length > 0 ? tags : undefined,
        });

        if (response.success) {
          toast({
            title: 'Entry updated successfully',
          });
          setShowCreateDialog(false);
          setEditingEntry(null);
          resetForm();
          await loadEntries();
          await loadStatistics();
        }
      } else {
        const response = await api.createJournalEntry({
          entryType: formData.entryType,
          title: formData.title,
          content: formData.content || undefined,
          date: formData.date,
          mood: formData.mood || undefined,
          tags: tags.length > 0 ? tags : undefined,
        });

        if (response.success) {
          toast({
            title: 'Entry created successfully',
          });
          setShowCreateDialog(false);
          resetForm();
          await loadEntries();
          await loadStatistics();
        }
      }
    } catch (error: unknown) {
      console.error('Error saving entry:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save entry';
      toast({
        title: t.error,
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      const response = await api.deleteJournalEntry(entryId);
      if (response.success) {
        toast({
          title: 'Entry deleted successfully',
        });
        await loadEntries();
        await loadStatistics();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: t.error,
        description: 'Failed to delete entry',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setFormData({
      entryType: entry.entryType,
      title: entry.title,
      content: entry.content || '',
      date: entry.date,
      mood: entry.mood || '',
      tags: entry.tags?.join(', ') || '',
    });
    setShowCreateDialog(true);
  };

  const resetForm = () => {
    setFormData({
      entryType: 'journal',
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      mood: '',
      tags: '',
    });
    setEditingEntry(null);
  };

  const predictions = entries.filter(e => e.entryType === 'prediction');

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40" />
          <div className="h-4 w-32 bg-primary/20 rounded" />
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Jurnal Numerologic"
        subtitle="Ține evidența experiențelor tale numerologice și previziunilor"
        badge={{
          icon: <BookOpen className="h-4 w-4 text-primary" />,
          label: 'Jurnal'
        }}
      />

      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={(value: 'all' | 'journal' | 'prediction') => setFilterType(value)}>
                <SelectTrigger className="w-[150px] input-mystic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate</SelectItem>
                  <SelectItem value="journal">Jurnal</SelectItem>
                  <SelectItem value="prediction">Previziuni</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={showCreateDialog} onOpenChange={(open) => {
              setShowCreateDialog(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="btn-mystic">
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă Intrare
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingEntry ? 'Editează Intrare' : 'Intrare Nouă'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tip</Label>
                    <Select
                      value={formData.entryType}
                      onValueChange={(value: 'journal' | 'prediction') => setFormData({ ...formData, entryType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="journal">Jurnal</SelectItem>
                        <SelectItem value="prediction">Previziune</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Titlu *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Titlu intrare"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Conținut</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Descrie experiența ta..."
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Stare</Label>
                      <Input
                        value={formData.mood}
                        onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                        placeholder="Ex: fericit, calm, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tag-uri</Label>
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Separate prin virgulă"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {
                      setShowCreateDialog(false);
                      resetForm();
                    }}>
                      Anulează
                    </Button>
                    <Button onClick={handleSave} className="btn-mystic">
                      Salvează
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics */}
          {statistics && <PersonalStatistics statistics={statistics} />}

          {/* Prediction History */}
          {predictions.length > 0 && <PredictionHistory predictions={predictions} />}

          {/* Journal Entries */}
          <div className="space-y-4">
            <h2 className="font-cinzel text-2xl text-foreground">
              {filterType === 'all' ? 'Toate Intrările' : filterType === 'journal' ? 'Jurnal' : 'Previziuni'}
            </h2>
            {entries.length > 0 ? (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <JournalEntryComponent
                    key={entry.id}
                    entry={entry}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <Card className="card-mystic">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nu există intrări încă</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default Journal;

