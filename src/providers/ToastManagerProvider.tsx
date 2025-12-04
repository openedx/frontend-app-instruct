import {
  createContext, useContext, useState, useMemo,
} from 'react';
import { Toast } from '@openedx/paragon';
import { messages } from './messages';
import { useIntl } from '@openedx/frontend-base';
import { DEFAULT_TOAST_DELAY } from '../constants';

export const ToastTypeEnum = {
  SUCCESS: 'success',
  ERROR: 'error',
  ERROR_RETRY: 'error-retry',
} as const;

export type ToastType = typeof ToastTypeEnum[keyof typeof ToastTypeEnum];

export interface AppToast {
  id: string,
  message: string,
  type: ToastType,
  onRetry?: () => void,
  delay?: number,
}

interface ToastManagerContextType {
  showToast: (toast: Omit<AppToast, 'id'>) => void,
}

interface ToastManagerProviderProps {
  children: React.ReactNode | React.ReactNode[],
}

const ToastManagerContext = createContext<ToastManagerContextType | undefined>(undefined);

export const ToastManagerProvider = ({ children }: ToastManagerProviderProps) => {
  const intl = useIntl();
  const [toasts, setToasts] = useState<(AppToast & { visible: boolean })[]>([]);

  const showToast = (toast: Omit<AppToast, 'id'>) => {
    const id = `toast-notification-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    const newToast = { ...toast, id, visible: true };
    setToasts(prev => [...prev, newToast]);
  };

  const discardToast = (id: string) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, visible: false } : t)));

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const value = useMemo<ToastManagerContextType>(() => {
    return ({
      showToast
    });
  }, []);

  return (
    <ToastManagerContext.Provider value={value}>
      {children}

      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            show={toast.visible}
            onClose={() => discardToast(toast.id)}
            delay={toast.delay ?? DEFAULT_TOAST_DELAY}
            action={toast.onRetry && {
              onClick: () => {
                discardToast(toast.id);
                toast.onRetry?.();
              },
              label: intl.formatMessage(messages.toastRetryLabel),
            }}
          >
            {toast.message}
          </Toast>
        ))}
      </div>
    </ToastManagerContext.Provider>
  );
};

export const useToastManager = (): ToastManagerContextType => {
  const context = useContext(ToastManagerContext);
  if (!context) {
    throw new Error('useToastManager must be used within a ToastManagerProvider');
  }
  return context;
};
