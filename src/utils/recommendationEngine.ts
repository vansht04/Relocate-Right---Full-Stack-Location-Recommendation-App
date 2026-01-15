import { AreaData, areasData } from "@/data/areasData";

export interface UserPreferences {
  hospitals: number;
  schools: number;
  parks: number;
  safety: number;
  communityCenters: number;
}

export interface RecommendedArea extends AreaData {
  matchScore: number;
  matchReasons: string[];
}

const criteriaLabels: Record<keyof UserPreferences, string> = {
  hospitals: "Hospital Proximity",
  schools: "School Quality",
  parks: "Park Access",
  safety: "Safety Level",
  communityCenters: "Community Centers"
};

export function calculateRecommendations(
  preferences: UserPreferences
): RecommendedArea[] {
  // Convert 0-100 to weights (0-100 scale now)
  const totalWeight = Object.values(preferences).reduce((sum, val) => sum + val, 0);
  
  if (totalWeight === 0) {
    // If no preferences set, return top 3 by overall score
    return areasData.slice(0, 3).map(area => ({
      ...area,
      matchScore: 50,
      matchReasons: ["Set your preferences to get personalized recommendations"]
    }));
  }

  const scoredAreas = areasData.map(area => {
    let weightedScore = 0;
    const matchReasons: string[] = [];
    
    (Object.keys(preferences) as Array<keyof UserPreferences>).forEach(key => {
      const weight = preferences[key]; // 0-100
      const areaScore = area.scores[key]; // 1-10
      
      if (weight > 0) {
        weightedScore += (areaScore * weight);
        
        // Add reasons for high-scoring, high-priority items
        if (areaScore >= 8 && weight >= 60) {
          matchReasons.push(`Excellent ${criteriaLabels[key].toLowerCase()} (${areaScore}/10)`);
        } else if (areaScore >= 7 && weight >= 40) {
          matchReasons.push(`Good ${criteriaLabels[key].toLowerCase()} (${areaScore}/10)`);
        }
      }
    });

    // Normalize to percentage (max possible is 10 * totalWeight)
    const maxPossible = 10 * totalWeight;
    const matchScore = (weightedScore / maxPossible) * 100;

    return {
      ...area,
      matchScore: Math.round(matchScore * 10) / 10,
      matchReasons: matchReasons.length > 0 
        ? matchReasons.slice(0, 3) 
        : [`Balanced scores across your preferences`]
    };
  });

  // Sort by match score descending and return top 3
  return scoredAreas
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}
