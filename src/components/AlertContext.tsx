import { createContext, useContext, useState, ReactNode } from 'react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertProps {
  id: string,
  type: AlertType,
  message: string,
  extraContent?: ReactNode,
}

interface AlertContextProps {
  alerts: AlertProps[],
  addAlert: (alert: Omit<AlertProps, 'id'>) => void,
  removeAlert: (id: string) => void,
  clearAlerts: () => void,
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within a AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const addAlert = (alert: Omit<AlertProps, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    setAlerts(prev => [...prev, { ...alert, id }]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const clearAlerts = () => setAlerts([]);

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, clearAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};
