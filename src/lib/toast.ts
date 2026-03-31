import { useState, useEffect } from "react";
import type { Toast } from "@/components/ui/common/toast-container";

export type ToastOptions = {
  title: string;
  description?: string;
  duration?: number | typeof Infinity;
  variant?: "default" | "destructive";
  actionUrl?: string;
  actionLabel?: string;
};

// Global toast state management
let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toasts]));
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notifyListeners();
}

export function toast(options: ToastOptions) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newToast: Toast = {
    id,
    title: options.title,
    description: options.description,
    variant: options.variant || "default",
    duration: options.duration,
    actionUrl: options.actionUrl,
    actionLabel: options.actionLabel,
  };

  toasts = [...toasts, newToast];
  notifyListeners();

  return {
    dismiss: () => {
      dismissToast(id);
    },
  };
}

// Hook for components to subscribe to toast updates
export function useToasts() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    const handleUpdate = (updatedToasts: Toast[]) => {
      setCurrentToasts(updatedToasts);
    };

    toastListeners.push(handleUpdate);
    return () => {
      toastListeners = toastListeners.filter((listener) => listener !== handleUpdate);
    };
  }, []);

  return currentToasts;
}

// Export Toast type for use in components
export type { Toast };



