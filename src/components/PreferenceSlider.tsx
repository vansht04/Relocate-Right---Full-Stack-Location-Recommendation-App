import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface PreferenceSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: LucideIcon;
  description: string;
}

export function PreferenceSlider({ 
  label, 
  value, 
  onChange, 
  icon: Icon,
  description 
}: PreferenceSliderProps) {
  return (
    <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5">
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <Label className="text-sm font-semibold text-foreground">{label}</Label>
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        </div>
        <div className="flex items-center gap-1 bg-gradient-to-r from-primary/20 to-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <span className="text-lg font-bold text-primary">{value}</span>
          <span className="text-xs text-primary/70 font-medium">%</span>
        </div>
      </div>
      <div className="px-1">
        <Slider
          value={[value]}
          onValueChange={([val]) => onChange(val)}
          max={100}
          min={0}
          step={1}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground/70 font-medium">
          <span>Not Important</span>
          <span>Very Important</span>
        </div>
      </div>
    </div>
  );
}
