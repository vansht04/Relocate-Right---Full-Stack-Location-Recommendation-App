import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Loader2, Hospital, School, Trees, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetUserData, useGetRecommendations, useSaveUserData } from '../hooks/useQueries';
import type { UserPreferences, Recommendation } from '../backend';

interface PreferencesFormProps {
  onGetRecommendations: (
    location: string,
    preferences: UserPreferences,
    recommendations: Recommendation[]
  ) => void;
}

const preferenceConfig = [
  {
    key: 'hospitalImportance' as const,
    label: 'Hospital Proximity',
    icon: Hospital,
    description: 'Access to quality healthcare facilities',
    color: 'text-red-500',
  },
  {
    key: 'schoolImportance' as const,
    label: 'School Quality',
    icon: School,
    description: 'Educational institutions and ratings',
    color: 'text-blue-500',
  },
  {
    key: 'parkImportance' as const,
    label: 'Parks & Recreation',
    icon: Trees,
    description: 'Green spaces and outdoor activities',
    color: 'text-green-500',
  },
  {
    key: 'safetyImportance' as const,
    label: 'Safety Rating',
    icon: Shield,
    description: 'Crime rates and neighborhood security',
    color: 'text-amber-500',
  },
  {
    key: 'communityCenterImportance' as const,
    label: 'Community Centers',
    icon: Users,
    description: 'Social facilities and community engagement',
    color: 'text-purple-500',
  },
];

export default function PreferencesForm({ onGetRecommendations }: PreferencesFormProps) {
  const { identity } = useInternetIdentity();
  const { data: userData, isLoading: userDataLoading } = useGetUserData();
  const getRecommendationsMutation = useGetRecommendations();
  const saveUserDataMutation = useSaveUserData();

  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    hospitalImportance: 0.5,
    schoolImportance: 0.5,
    parkImportance: 0.5,
    safetyImportance: 0.5,
    communityCenterImportance: 0.5,
  });
  const [hasLoadedUserData, setHasLoadedUserData] = useState(false);

  // Load saved preferences when user data is available
  useEffect(() => {
    if (identity && userData && !hasLoadedUserData) {
      setPreferences(userData.preferences);
      setHasLoadedUserData(true);
      toast.success('Loaded your saved preferences');
    }
  }, [identity, userData, hasLoadedUserData]);

  // Reset when user logs out
  useEffect(() => {
    if (!identity) {
      setHasLoadedUserData(false);
    }
  }, [identity]);

  const handleSliderChange = (key: keyof UserPreferences, value: number[]) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value[0],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      toast.error('Please enter your current location');
      return;
    }

    try {
      const recommendations = await getRecommendationsMutation.mutateAsync(preferences);

      if (recommendations.length === 0) {
        toast.error('No recommendations found. Please try different preferences.');
        return;
      }

      // Save user data if authenticated
      if (identity) {
        try {
          await saveUserDataMutation.mutateAsync({ preferences, recommendations });
        } catch (error) {
          console.error('Failed to save user data:', error);
          // Don't show error to user, just log it
        }
      }

      onGetRecommendations(location, preferences, recommendations);
      toast.success(`Found ${recommendations.length} perfect matches for you!`);
    } catch (error) {
      toast.error('Failed to get recommendations. Please try again.');
      console.error('Error getting recommendations:', error);
    }
  };

  const getImportanceLabel = (value: number) => {
    if (value === 0) return 'Not Important';
    if (value < 0.3) return 'Low';
    if (value < 0.7) return 'Medium';
    return 'High';
  };

  const isLoading = getRecommendationsMutation.isPending || saveUserDataMutation.isPending;

  return (
    <Card className="shadow-xl border-2">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl">Your Preferences</CardTitle>
        <CardDescription className="text-base">
          Adjust the sliders to indicate what matters most to you in your ideal location.
          {identity && ' Your preferences will be saved for next time.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base font-semibold">
              Current Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="Enter your city or address..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Importance Levels</h3>
            {preferenceConfig.map((pref) => {
              const Icon = pref.icon;
              const value = preferences[pref.key];
              return (
                <div key={pref.key} className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className={`h-5 w-5 mt-0.5 ${pref.color}`} />
                      <div className="flex-1 min-w-0">
                        <Label className="text-base font-medium">{pref.label}</Label>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {pref.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-primary min-w-[80px] text-right">
                      {getImportanceLabel(value)}
                    </span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(val) => handleSliderChange(pref.key, val)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full text-base font-semibold h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Finding Your Perfect Match...
              </>
            ) : (
              'Get Recommendations'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
