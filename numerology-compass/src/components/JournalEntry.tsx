import { useState } from 'react';
import { Edit, Trash2, Calendar, Tag as TagIcon, Smile } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JournalEntry as JournalEntryType } from '@/lib/journal';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface JournalEntryProps {
  entry: JournalEntryType;
  onEdit?: (entry: JournalEntryType) => void;
  onDelete?: (entryId: string) => void;
  className?: string;
}

export const JournalEntry = ({ entry, onEdit, onDelete, className }: JournalEntryProps) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const isLongContent = entry.content && entry.content.length > 200;

  return (
    <Card className={cn("card-mystic", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="font-cinzel text-lg text-foreground mb-2">
              {entry.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(entry.date), 'dd MMM yyyy')}</span>
              </div>
              {entry.mood && (
                <div className="flex items-center gap-1">
                  <Smile className="h-3 w-3" />
                  <span>{entry.mood}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(entry)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(entry.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {entry.content && (
          <div className="text-foreground/90">
            {isLongContent && !showFullContent ? (
              <>
                <p>{entry.content.substring(0, 200)}...</p>
                <Button
                  variant="link"
                  onClick={() => setShowFullContent(true)}
                  className="p-0 h-auto text-primary"
                >
                  Citește mai mult
                </Button>
              </>
            ) : (
              <p className="whitespace-pre-wrap">{entry.content}</p>
            )}
          </div>
        )}

        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <TagIcon className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {entry.numerologyData && (
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-xs text-muted-foreground mb-1">Date numerologice:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(entry.numerologyData).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key}: {String(value)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

