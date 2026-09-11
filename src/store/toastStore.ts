import { create } from 'zustand';

// 'delete' gets its own type (not just 'success'/'error') so it can be color-coded distinctly —
// a deletion is a successful operation but not a "green" one.
export type ToastType = 'success' | 'delete';

export interface ToastData {
  id: number;
  message: string;
  type: ToastType;
  durationMs: number;
}

interface ToastState {
  toasts: ToastData[];
  addToast: (message: string, type: ToastType, durationMs?: number) => void;
  removeToast: (id: number) => void;
}

let nextId = 1;

// UI-only, ephemeral notification state. Auto-dismiss timing lives in the Toast component
// (an effect, not a store side effect) — the store just holds what's currently visible.
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, durationMs = 4000) =>
    set((state) => ({ toasts: [...state.toasts, { id: nextId++, message, type, durationMs }] })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
