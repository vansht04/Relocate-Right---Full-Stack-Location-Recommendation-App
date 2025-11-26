import { MapPin, LogIn, LogOut, User } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      toast.success('Logged out successfully');
    } else {
      try {
        await login();
        toast.success('Logged in successfully');
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        } else {
          toast.error('Login failed. Please try again.');
        }
      }
    }
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/assets/generated/relocate-right-logo-transparent.dim_200x200.png"
                alt="Relocate Right Logo"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Relocate Right
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && !profileLoading && userProfile && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">{userProfile.name}</span>
              </div>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="font-medium"
            >
              {isLoggingIn ? (
                <>Logging in...</>
              ) : isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
