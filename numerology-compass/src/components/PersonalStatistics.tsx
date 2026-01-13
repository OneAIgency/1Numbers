import { BarChart3, TrendingUp, Calendar, Tag, Smile } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JournalStatistics } from '@/lib/journal';
import { cn } from '@/lib/utils';

interface PersonalStatisticsProps {
  statistics: JournalStatistics;
  className?: string;
}

export const PersonalStatistics = ({ statistics, className }: PersonalStatisticsProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-mystic">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-cinzel font-bold text-foreground">
              {statistics.totalEntries}
            </p>
          </CardContent>
        </Card>

        <Card className="card-mystic">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Jurnal</span>
            </div>
            <p className="text-2xl font-cinzel font-bold text-foreground">
              {statistics.entriesByType.journal || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="card-mystic">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Previziuni</span>
            </div>
            <p className="text-2xl font-cinzel font-bold text-foreground">
              {statistics.entriesByType.prediction || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="card-mystic">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Tag-uri</span>
            </div>
            <p className="text-2xl font-cinzel font-bold text-foreground">
              {statistics.topTags.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Tags */}
      {statistics.topTags.length > 0 && (
        <Card className="card-mystic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Tag className="h-5 w-5 text-primary" />
              Tag-uri Populare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {statistics.topTags.map((tag) => (
                <div
                  key={tag.tag}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20"
                >
                  <span className="text-sm font-medium">{tag.tag}</span>
                  <span className="text-xs text-muted-foreground">({tag.count})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Distribution */}
      {statistics.entriesByMood.length > 0 && (
        <Card className="card-mystic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Smile className="h-5 w-5 text-primary" />
              Distribuție Stări
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statistics.entriesByMood.map((mood) => (
                <div key={mood.mood} className="flex items-center justify-between">
                  <span className="text-sm text-foreground/90">{mood.mood}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(mood.count / statistics.totalEntries) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {mood.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Activity */}
      {statistics.entriesPerMonth.length > 0 && (
        <Card className="card-mystic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Activitate Lunară
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statistics.entriesPerMonth.slice(0, 6).map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm text-foreground/90">{month.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(month.count / Math.max(...statistics.entriesPerMonth.map(m => m.count))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {month.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

