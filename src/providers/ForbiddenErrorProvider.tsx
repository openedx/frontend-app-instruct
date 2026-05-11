import { createContext, useContext, useState, ReactNode, useCallback, useMemo, FC } from 'react';
import { Alert, Skeleton } from '@openedx/paragon';
import { Error as ErrorIcon } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/providers/messages';

type ErrorType = 'forbidden' | 'unauthorized' | 'generic' | null;

interface ForbiddenErrorContextType {
  errorType: ErrorType,
  setErrorType: (error: ErrorType) => void,
  clearError: () => void,
  isLoading: boolean,
  setLoading: (loading: boolean) => void,
}

const ForbiddenErrorContext = createContext<ForbiddenErrorContextType | undefined>(undefined);

interface ForbiddenErrorProviderProps {
  children: ReactNode,
}

export const ForbiddenErrorProvider: FC<ForbiddenErrorProviderProps> = ({ children }) => {
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [isLoading, setLoading] = useState(false);

  const clearError = useCallback(() => {
    setErrorType(null);
  }, []);

  const value = useMemo(() => ({
    errorType,
    setErrorType,
    clearError,
    isLoading,
    setLoading,
  }), [errorType, clearError, isLoading]);

  return (
    <ForbiddenErrorContext.Provider value={value}>
      {children}
    </ForbiddenErrorContext.Provider>
  );
};

interface ForbiddenErrorGuardProps {
  children: ReactNode,
}

export const ForbiddenErrorGuard: FC<ForbiddenErrorGuardProps> = ({ children }) => {
  const intl = useIntl();
  const { errorType, isLoading } = useForbiddenError();

  if (isLoading) {
    return <Skeleton className="lead" />;
  }

  if (errorType) {
    const headingMap = {
      unauthorized: messages.unauthorizedErrorHeading,
      forbidden: messages.forbiddenErrorHeading,
      generic: messages.genericErrorHeading,
    };
    const messageMap = {
      unauthorized: messages.unauthorizedErrorMessage,
      forbidden: messages.forbiddenErrorMessage,
      generic: messages.genericErrorMessage,
    };

    return (
      <Alert
        variant="danger"
        icon={ErrorIcon}
      >
        <Alert.Heading>{intl.formatMessage(headingMap[errorType])}</Alert.Heading>
        <p>
          {intl.formatMessage(messageMap[errorType])}
        </p>
      </Alert>
    );
  }

  return <>{children}</>;
};

export const useForbiddenError = (): ForbiddenErrorContextType => {
  const context = useContext(ForbiddenErrorContext);
  if (context === undefined) {
    throw new Error('useForbiddenError must be used within a ForbiddenErrorProvider');
  }
  return context;
};
