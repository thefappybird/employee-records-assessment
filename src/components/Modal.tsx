import { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

// Overlay + centered panel; sharp edges (rounded-none) per design system, deliberate contrast with rounded buttons.
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-slate/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-none border border-slate-blue/20 bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        {title && <h2 className="mb-4 text-lg font-semibold text-dark-slate">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
