import { createContext, useContext, useState, ReactNode, useCallback, useMemo, FC } from 'react';
import { Toast } from '@openedx/paragon';

interface AppToast {
  id: string,
  message: string,
  type: 'success' | 'error',
}

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error') => void,
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode,
}

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<(AppToast & { visible: boolean })[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = `toast-${Date.now()}`;
    const newToast = { id, message, type, visible: true };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const discardToast = useCallback((id: string) => {
    // First hide the toast
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, visible: false } : t)));

    // Then remove it after animation completes
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 500);
  }, []);

  const value = useMemo(() => ({
    showToast,
  }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            show={toast.visible}
            onClose={() => discardToast(toast.id)}
            className="text-break"
          >
            {toast.message}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
