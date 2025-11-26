import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            © 2025. Built with{' '}
            <Heart className="h-4 w-4 text-destructive fill-destructive inline" />{' '}
            using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
