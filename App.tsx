import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import PreferencesForm from './components/PreferencesForm';
import RecommendationsList from './components/RecommendationsList';
import MapView from './components/MapView';
import Footer from './components/Footer';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from './components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import type { UserPreferences, Recommendation } from './backend';

const queryClient = new QueryClient();

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const [currentLocation, setCurrentLocation] = useState('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    hospitalImportance: 0.5,
    schoolImportance: 0.5,
    parkImportance: 0.5,
    safetyImportance: 0.5,
    communityCenterImportance: 0.5,
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [showResults, setShowResults] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleGetRecommendations = (
    location: string,
    prefs: UserPreferences,
    recs: Recommendation[]
  ) => {
    setCurrentLocation(location);
    setPreferences(prefs);
    setRecommendations(recs);
    setShowResults(true);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          {!showResults ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Find Your Perfect Place
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Tell us what matters most to you, and we'll recommend the best areas to call
                  home.
                </p>
              </div>
              <PreferencesForm onGetRecommendations={handleGetRecommendations} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">Your Top Matches</h2>
                  <p className="text-muted-foreground">
                    Based on your preferences from {currentLocation || 'your location'}
                  </p>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  New Search
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <RecommendationsList recommendations={recommendations} />
                </div>
                <div className="lg:sticky lg:top-8 h-fit">
                  <MapView currentLocation={currentLocation} recommendations={recommendations} />
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
        <Toaster />
      </div>
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
