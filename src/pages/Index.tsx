import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LocationInput } from "@/components/LocationInput";
import { PreferenceSlider } from "@/components/PreferenceSlider";
import { RecommendationCard } from "@/components/RecommendationCard";
import { RecommendationMap } from "@/components/RecommendationMap";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchHistory, SearchHistoryItem } from "@/components/SearchHistory";
import { calculateRecommendations, UserPreferences, RecommendedArea } from "@/utils/recommendationEngine";
import { 
  Hospital, 
  GraduationCap, 
  Trees, 
  Shield, 
  Users,
  MapPin,
  Compass,
  Search,
  Sparkles,
  RotateCcw,
  History
} from "lucide-react";

const defaultPreferences: UserPreferences = {
  hospitals: 50,
  schools: 50,
  parks: 50,
  safety: 50,
  communityCenters: 50
};

const Index = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedArea[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSearchHistory(parsed.map((item: SearchHistoryItem) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (e) {
        console.error("Failed to parse search history");
      }
    }
  }, []);

  // Save search history to localStorage
  const saveHistory = (history: SearchHistoryItem[]) => {
    localStorage.setItem("searchHistory", JSON.stringify(history));
    setSearchHistory(history);
  };

  // Mock user location based on input
  const userLocation = currentLocation.trim() 
    ? { lat: 40.7128, lng: -74.006 } 
    : null;

  const handleFindLocations = async () => {
    if (currentLocation.trim()) {
      setIsSearching(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const results = calculateRecommendations(preferences);
      setRecommendations(results);
      setShowResults(true);
      setIsSearching(false);

      // Add to history
      const newHistoryItem: SearchHistoryItem = {
        id: Date.now().toString(),
        location: currentLocation,
        preferences: { ...preferences },
        recommendations: results,
        timestamp: new Date()
      };
      const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 10);
      saveHistory(updatedHistory);
    }
  };

  const handleResetPreferences = () => {
    setPreferences(defaultPreferences);
    if (showResults) {
      setShowResults(false);
    }
  };

  const handleSelectHistory = (item: SearchHistoryItem) => {
    setCurrentLocation(item.location);
    setPreferences(item.preferences);
    setRecommendations(item.recommendations);
    setShowResults(true);
  };

  const handleDeleteHistory = (id: string) => {
    const updated = searchHistory.filter(item => item.id !== id);
    saveHistory(updated);
  };

  const handleClearHistory = () => {
    saveHistory([]);
  };

  const updatePreference = (key: keyof UserPreferences) => (value: number) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    if (showResults) {
      setShowResults(false);
    }
  };

  const handleLocationChange = (value: string) => {
    setCurrentLocation(value);
    if (showResults) {
      setShowResults(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30">
                <Compass className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Relocate Right</h1>
                <p className="text-xs text-muted-foreground">Find your perfect place to live</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="rounded-xl border-border/50 bg-card/50 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300"
                  >
                    <History className="h-5 w-5 text-primary" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="glass-effect">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-primary" />
                      Search History
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <SearchHistory
                      history={searchHistory}
                      onSelect={handleSelectHistory}
                      onDelete={handleDeleteHistory}
                      onClear={handleClearHistory}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <section className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 border border-accent/20">
            <Sparkles className="h-4 w-4" />
            AI-Powered Recommendations
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 tracking-tight">
            Find Your <span className="text-primary">Ideal</span> Neighborhood
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tell us what matters most to you, and we'll recommend the top 3 areas 
            that match your lifestyle and priorities.
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Location Card */}
            <Card className="border-border/50 shadow-xl shadow-primary/5 overflow-hidden bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
                <CardTitle className="flex items-center gap-2.5 text-lg">
                  <div className="p-1.5 rounded-lg bg-primary/20">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  Where Do You Live Now?
                </CardTitle>
                <CardDescription>
                  Enter your current location so we can find nearby options
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <LocationInput 
                  value={currentLocation} 
                  onChange={handleLocationChange} 
                />
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card className="border-border/50 shadow-xl shadow-primary/5 overflow-hidden bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2.5 text-lg">
                      <div className="p-1.5 rounded-lg bg-primary/20">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      What Matters to You?
                    </CardTitle>
                    <CardDescription className="mt-1.5">
                      Drag the sliders to set how important each factor is (0-100%)
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetPreferences}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <PreferenceSlider
                  label="Hospital Proximity"
                  description="Access to medical facilities and healthcare"
                  value={preferences.hospitals}
                  onChange={updatePreference("hospitals")}
                  icon={Hospital}
                />
                <PreferenceSlider
                  label="School Quality"
                  description="Quality and proximity of educational institutions"
                  value={preferences.schools}
                  onChange={updatePreference("schools")}
                  icon={GraduationCap}
                />
                <PreferenceSlider
                  label="Parks & Recreation"
                  description="Access to green spaces and outdoor activities"
                  value={preferences.parks}
                  onChange={updatePreference("parks")}
                  icon={Trees}
                />
                <PreferenceSlider
                  label="Safety Level"
                  description="Low crime rates and secure neighborhoods"
                  value={preferences.safety}
                  onChange={updatePreference("safety")}
                  icon={Shield}
                />
                <PreferenceSlider
                  label="Community Centers"
                  description="Social facilities and community programs"
                  value={preferences.communityCenters}
                  onChange={updatePreference("communityCenters")}
                  icon={Users}
                />
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button 
              size="lg" 
              className="w-full text-lg py-7 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] text-primary-foreground font-semibold"
              onClick={handleFindLocations}
              disabled={!currentLocation.trim() || isSearching}
            >
              {isSearching ? (
                <>
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-3" />
                  Finding Best Matches...
                </>
              ) : (
                <>
                  <Search className="mr-3 h-5 w-5" />
                  Find My Perfect Locations
                </>
              )}
            </Button>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {showResults && recommendations.length > 0 ? (
              <>
                {/* Map */}
                <Card className="border-border/50 shadow-xl shadow-primary/5 overflow-hidden bg-card/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
                    <CardTitle className="text-lg">Recommended Areas Map</CardTitle>
                    <CardDescription>
                      🔵 Your location • 🥇🥈🥉 Top 3 matches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <RecommendationMap 
                      recommendations={recommendations}
                      userLocation={userLocation}
                    />
                  </CardContent>
                </Card>

                {/* Recommendation Cards */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    Top 3 Recommended Areas
                  </h3>
                  {recommendations.map((area, index) => (
                    <RecommendationCard 
                      key={area.id} 
                      area={area} 
                      rank={index} 
                    />
                  ))}
                </div>
              </>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[600px] border-border/50 shadow-xl shadow-primary/5 bg-gradient-to-br from-card/80 to-primary/5 backdrop-blur-sm">
                <CardContent className="text-center py-16 px-8">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
                    <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 shadow-inner">
                      <Compass className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Ready to Find Your New Home?
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Enter your current location and adjust your preferences on the left, 
                    then click the button to see your personalized recommendations.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {[
                      { icon: "🏥", label: "Hospitals" },
                      { icon: "🎓", label: "Schools" },
                      { icon: "🌳", label: "Parks" },
                      { icon: "🛡️", label: "Safety" },
                      { icon: "👥", label: "Community" }
                    ].map((item) => (
                      <span 
                        key={item.label} 
                        className="px-4 py-2 bg-primary/10 rounded-full text-sm text-primary border border-primary/20 font-medium"
                      >
                        {item.icon} {item.label}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Relocate Right</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Relocate Right. Helping you find the perfect place to call home.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
