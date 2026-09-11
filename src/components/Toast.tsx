import { useEffect } from 'react';
import type { ToastData } from '../store/toastStore';
import { useToastStore } from '../store/toastStore';

interface ToastProps {
  toast: ToastData;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m5 5v6m4-6v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Single toast: slides in, counts down via a shrinking timer bar, then removes itself.
export default function Toast({ toast }: ToastProps) {
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), toast.durationMs);
    return () => clearTimeout(timer);
  }, [toast.id, toast.durationMs, removeToast]);

  const isSuccess = toast.type === 'success';
  // Same accent color for both — only the icon differs (checkmark vs trash) to distinguish delete
  // from create/update, since a deletion is still a successful, intentional operation.
  const accentClass = 'bg-primary-teal';

  return (
    <div
      role="status"
      className="toast-slide-in relative w-72 overflow-hidden rounded-none border border-white/10 bg-dark-slate text-white shadow-lg"
    >
      <div className="flex items-start gap-3 py-3 pl-3 pr-3">
        <span
          aria-hidden="true"
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${accentClass}`}
        >
          {isSuccess ? <CheckIcon /> : <TrashIcon />}
        </span>
        <p className="flex-1 pt-0.5 text-sm">{toast.message}</p>
        <button
          type="button"
          onClick={() => removeToast(toast.id)}
          aria-label="Dismiss notification"
          className="text-white/60 hover:text-white"
        >
          ×
        </button>
      </div>
      <span
        aria-hidden="true"
        className={`toast-timer-bar block h-1 ${accentClass}`}
        style={{ animationDuration: `${toast.durationMs}ms` }}
      />
    </div>
  );
}
