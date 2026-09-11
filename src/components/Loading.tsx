interface LoadingProps {
  message?: string;
}

// Generic inline loading indicator, reused wherever async state is pending.
export default function Loading({ message = 'Loading…' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-slate-blue">
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-slate-blue border-t-transparent"
        aria-hidden="true"
      />
      <span>{message}</span>
    </div>
  );
}
