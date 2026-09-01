'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastShortcuts {
  success: (message: string, title?: string, duration?: number) => string;
  error: (message: string, title?: string, duration?: number) => string;
  warning: (message: string, title?: string, duration?: number) => string;
  info: (message: string, title?: string, duration?: number) => string;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  toast: ToastShortcuts;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', title, message, duration }: ToastOptions) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toastDuration = duration ?? (type === 'error' || type === 'warning' ? 6000 : 4000);

    const newToast: ToastItem = {
      id,
      type,
      title,
      message,
      duration: toastDuration,
    };

    setToasts((prev) => [...prev, newToast]);

    if (toastDuration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toastDuration);
    }

    return id;
  }, [removeToast]);

  const toast: ToastShortcuts = React.useMemo(() => ({
    success: (message: string, title?: string, duration?: number) =>
      showToast({ type: 'success', title: title || 'Success', message, duration }),
    error: (message: string, title?: string, duration?: number) =>
      showToast({ type: 'error', title: title || 'Error', message, duration }),
    warning: (message: string, title?: string, duration?: number) =>
      showToast({ type: 'warning', title: title || 'Warning', message, duration }),
    info: (message: string, title?: string, duration?: number) =>
      showToast({ type: 'info', title: title || 'Notice', message, duration }),
  }), [showToast]);

  const contextValue = React.useMemo(() => ({
    toasts,
    showToast,
    removeToast,
    toast,
  }), [toasts, showToast, removeToast, toast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast notification container rendered at top level
const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed z-[9999] top-4 right-4 left-4 sm:left-auto sm:w-96 flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onRemove={() => onRemove(toast.id)} />
      ))}
    </div>
  );
};

const ToastCard: React.FC<{
  toast: ToastItem;
  onRemove: () => void;
}> = ({ toast, onRemove }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950',
    error: 'border-rose-200 bg-rose-50/95 text-rose-950',
    warning: 'border-amber-200 bg-amber-50/95 text-amber-950',
    info: 'border-sky-200 bg-sky-50/95 text-sky-950',
  };

  const progressColors = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
  };

  return (
    <div
      className={clsx(
        'pointer-events-auto relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-md p-4 transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-top-4 sm:slide-in-from-right-4',
        borders[toast.type]
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {icons[toast.type]}
        <div className="flex-1 min-w-0 pr-2">
          {toast.title && (
            <h4 className="font-semibold text-sm leading-snug truncate">
              {toast.title}
            </h4>
          )}
          <p className="text-xs sm:text-sm font-normal text-gray-700 mt-0.5 whitespace-pre-line leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button
          onClick={onRemove}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors focus:outline-none"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Animated progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
          <div
            className={clsx('h-full opacity-60', progressColors[toast.type])}
            style={{
              animation: `toast-progress ${toast.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
};

