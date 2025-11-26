import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Users, Sparkles } from 'lucide-react';
import type { Recommendation } from '../backend';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export default function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'from-amber-500 to-yellow-500';
      case 1:
        return 'from-slate-400 to-slate-500';
      case 2:
        return 'from-orange-600 to-amber-700';
      default:
        return 'from-primary to-accent';
    }
  };

  const getRankLabel = (index: number) => {
    switch (index) {
      case 0:
        return '🥇 Best Match';
      case 1:
        return '🥈 Great Option';
      case 2:
        return '🥉 Good Choice';
      default:
        return `#${index + 1}`;
    }
  };

  return (
    <div className="space-y-6">
      {recommendations.map((rec, index) => (
        <Card
          key={rec.area.name}
          className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div className={`h-2 bg-gradient-to-r ${getRankColor(index)}`} />
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">
                    {getRankLabel(index)}
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-2">{rec.area.name}</CardTitle>
                <CardDescription className="text-base">
                  {rec.area.lifestyleDescription}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  {rec.matchPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground font-medium">Match</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground leading-relaxed">{rec.explanation}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Population:</span>
                <span className="font-semibold">{rec.area.population.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Mayor:</span>
                <span className="font-semibold">{rec.area.mayor}</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground italic">
                💡 Fun Fact: {rec.area.funFact}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
