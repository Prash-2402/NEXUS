import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-5 left-1/2 z-[70] w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 transition-all duration-500 ease-out sm:bottom-8',
        message ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-800/90 px-5 py-4 shadow-2xl backdrop-blur-xl">
        <span className="h-2 w-2 shrink-0 rounded-full bg-ice shadow-[0_0_12px_#8fb8ff]" />
        <p className="flex-1 text-sm text-fg">{message}</p>
        <button onClick={onDismiss} className="text-fg-faint transition-colors hover:text-fg" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
