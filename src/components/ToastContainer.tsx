import React from 'react';
import { useToast } from '../context/ToastContext';
import { ToastType } from '../types/task';
import {
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
  XIcon,
} from './Icons';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
      case 'error':
        return <AlertCircleIcon className="w-4 h-4 text-rose-600 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangleIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case 'info':
      default:
        return <InfoIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500 text-emerald-950 bg-emerald-50/90';
      case 'error':
        return 'border-rose-500 text-rose-950 bg-rose-50/90';
      case 'warning':
        return 'border-amber-500 text-amber-950 bg-amber-50/90';
      case 'info':
      default:
        return 'border-emerald-500 text-slate-900 bg-white';
    }
  };

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full px-3 sm:px-0 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto shadow-lg rounded-xl border p-3 transition-all duration-300 transform translate-y-0 opacity-100 flex items-center gap-2.5 backdrop-blur-sm ${getBorderColor(
            toast.type
          )}`}
        >
          {getToastIcon(toast.type)}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold leading-tight">
              {toast.title}
            </h4>
            <p className="text-[11px] text-slate-600 truncate mt-0.5">
              {toast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            aria-label="Đóng thông báo"
            className="text-slate-400 hover:text-slate-700 rounded p-0.5 hover:bg-black/5 transition-colors flex-shrink-0"
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
