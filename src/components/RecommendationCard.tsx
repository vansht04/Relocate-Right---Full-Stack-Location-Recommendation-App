import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecommendedArea } from "@/utils/recommendationEngine";
import { MapPin, Users, User, Sparkles, Lightbulb } from "lucide-react";

interface RecommendationCardProps {
  area: RecommendedArea;
  rank: number;
}

export function RecommendationCard({ area, rank }: RecommendationCardProps) {
  const rankStyles = [
    {
      bg: "bg-gradient-to-br from-yellow-400/20 via-amber-400/15 to-orange-400/10",
      border: "border-yellow-500/40 hover:border-yellow-400/60",
      glow: "hover:shadow-yellow-500/20",
      icon: "🥇"
    },
    {
      bg: "bg-gradient-to-br from-slate-300/20 via-gray-300/15 to-slate-400/10",
      border: "border-slate-400/40 hover:border-slate-300/60",
      glow: "hover:shadow-slate-400/20",
      icon: "🥈"
    },
    {
      bg: "bg-gradient-to-br from-amber-600/20 via-orange-500/15 to-amber-400/10",
      border: "border-amber-600/40 hover:border-amber-500/60",
      glow: "hover:shadow-amber-500/20",
      icon: "🥉"
    }
  ];

  const style = rankStyles[rank] || rankStyles[2];

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${style.glow} hover:scale-[1.02] border ${style.border} ${style.bg} backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border-2 ${style.border} bg-card/50 shadow-inner`}>
              <span className="text-3xl">{style.icon}</span>
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-foreground">{area.name}</CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3" />
                <span>{area.coordinates.lat.toFixed(3)}°N, {Math.abs(area.coordinates.lng).toFixed(3)}°W</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {area.matchScore.toFixed(1)}%
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Match</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground/80 leading-relaxed">{area.lifestyle}</p>
        
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-accent" />
            Why This Area Matches
          </h4>
          <div className="flex flex-wrap gap-2">
            {area.matchReasons.map((reason, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-primary/15 text-primary border border-primary/20 font-medium">
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-muted/50">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Population</div>
              <div className="text-sm font-bold text-foreground">{area.population.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-muted/50">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Mayor</div>
              <div className="text-sm font-bold text-foreground">{area.mayor}</div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
          <p className="text-xs text-foreground/80">
            <Lightbulb className="h-3.5 w-3.5 inline-block mr-1.5 text-accent" />
            <span className="font-semibold text-accent">Fun Fact:</span> {area.funFact}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
