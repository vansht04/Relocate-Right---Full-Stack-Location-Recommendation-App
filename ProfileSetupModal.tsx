import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const saveProfileMutation = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfileMutation.mutateAsync({
        name: name.trim(),
        preferences: undefined,
      });
      toast.success('Profile created successfully!');
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error('Error saving profile:', error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Welcome to Relocate Right!</DialogTitle>
            <DialogDescription>
              Please tell us your name to personalize your experience.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                autoFocus
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={saveProfileMutation.isPending}
            >
              {saveProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
