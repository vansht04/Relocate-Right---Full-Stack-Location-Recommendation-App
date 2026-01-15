import { UserPreferences, RecommendedArea } from "@/utils/recommendationEngine";
import { X, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface SearchHistoryItem {
  id: string;
  location: string;
  preferences: UserPreferences;
  recommendations: RecommendedArea[];
  timestamp: Date;
}

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function SearchHistory({ history, onSelect, onDelete, onClear }: SearchHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No search history yet</p>
        <p className="text-xs mt-1">Your searches will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Recent Searches</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear All
        </Button>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="group relative p-3 rounded-lg bg-muted/50 hover:bg-primary/10 border border-border/50 cursor-pointer transition-all duration-200"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    📍 {item.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.timestamp).toLocaleDateString()} at{" "}
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {item.recommendations.slice(0, 2).map((rec, idx) => (
                      <span 
                        key={rec.id} 
                        className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                      >
                        {idx === 0 ? "🥇" : "🥈"} {rec.name}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
