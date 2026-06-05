'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ─── Toast Types ────────────────────────────────────────────────────────────
export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

// ─── Provider ───────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastIdCounter}`;
    const newToast: Toast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto-remove after duration (default 4s)
    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ─── Toast Container ────────────────────────────────────────────────────────
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

// ─── Toast Item ─────────────────────────────────────────────────────────────
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const borderColorMap = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    warning: 'border-l-amber-500',
    info: 'border-l-blue-500',
  };

  const bgMap = {
    success: 'from-emerald-500/10 to-emerald-500/5',
    error: 'from-red-500/10 to-red-500/5',
    warning: 'from-amber-500/10 to-amber-500/5',
    info: 'from-blue-500/10 to-blue-500/5',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-l-4 ${borderColorMap[toast.type]} bg-gradient-to-r ${bgMap[toast.type]} backdrop-blur-xl px-4 py-3 shadow-2xl transition-all duration-300 ease-out max-w-sm dark:border-white/[0.08] dark:bg-[#16161f]/95 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
      }`}
      role="alert"
    >
      <span className="text-base mt-0.5">{iconMap[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-gray-400 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-white transition-colors text-sm ml-2 mt-0.5"
      >
        ✕
      </button>
    </div>
  );
}
