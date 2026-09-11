interface EmptyStateProps {
  message: string;
}

// Generic empty/no-results placeholder — message is fully parametrized by the caller.
export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-blue">
      <span className="text-3xl" aria-hidden="true">
        —
      </span>
      <p>{message}</p>
    </div>
  );
}
