import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationInput({ value, onChange }: LocationInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="text-sm font-medium text-foreground">
        Your Current Location
      </Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="location"
          type="text"
          placeholder="Enter your city or address..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Enter where you currently live to help us find nearby relocation options
      </p>
    </div>
  );
}
