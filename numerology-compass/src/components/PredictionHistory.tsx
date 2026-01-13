import { TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PredictionEntry, analyzePredictionAccuracy } from '@/lib/journal';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PredictionHistoryProps {
  predictions: PredictionEntry[];
  className?: string;
}

export const PredictionHistory = ({ predictions, className }: PredictionHistoryProps) => {
  const accuracy = analyzePredictionAccuracy(predictions);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Accuracy Overview */}
      <Card className="card-mystic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Acuratețe Previziuni
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-cinzel font-bold">{accuracy.totalPredictions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Evaluate</p>
              <p className="text-2xl font-cinzel font-bold">{accuracy.ratedPredictions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Medie</p>
              <p className="text-2xl font-cinzel font-bold">{accuracy.averageAccuracy}%</p>
            </div>
          </div>

          {accuracy.accuracyDistribution.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground/90">Distribuție Acuratețe</p>
              {accuracy.accuracyDistribution.map((dist) => (
                <div key={dist.range} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{dist.range}%</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full",
                          dist.range === '81-100' ? "bg-green-500" :
                          dist.range === '61-80' ? "bg-primary" :
                          dist.range === '41-60' ? "bg-yellow-500" :
                          "bg-destructive"
                        )}
                        style={{
                          width: `${accuracy.ratedPredictions > 0 ? (dist.count / accuracy.ratedPredictions) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {dist.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Predictions */}
      <div className="space-y-4">
        <h3 className="font-cinzel text-xl text-foreground">Previziuni Recente</h3>
        {predictions.length > 0 ? (
          <div className="space-y-3">
            {predictions.slice(0, 5).map((prediction) => (
              <Card key={prediction.id} className="card-mystic">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{prediction.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(prediction.date), 'dd MMM yyyy')}
                      </p>
                    </div>
                    {prediction.numerologyData?.accuracy !== undefined && (
                      <Badge
                        variant={
                          (prediction.numerologyData.accuracy || 0) >= 70 ? 'default' : 'secondary'
                        }
                        className="shrink-0"
                      >
                        {(prediction.numerologyData.accuracy || 0) >= 70 ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {prediction.numerologyData.accuracy}%
                      </Badge>
                    )}
                  </div>
                  {prediction.content && (
                    <p className="text-sm text-foreground/80 line-clamp-2">{prediction.content}</p>
                  )}
                  {prediction.numerologyData?.personalDay && (
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        Zi: {prediction.numerologyData.personalDay}
                      </Badge>
                      {prediction.numerologyData.personalMonth && (
                        <Badge variant="outline" className="text-xs">
                          Lună: {prediction.numerologyData.personalMonth}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-mystic">
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nu există previziuni încă</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

