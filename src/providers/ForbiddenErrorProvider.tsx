import { createContext, useContext, useState, ReactNode, useCallback, useMemo, FC } from 'react';
import { Alert, Container } from '@openedx/paragon';
import { Error as ErrorIcon } from '@openedx/paragon/icons';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/providers/messages';

interface ForbiddenErrorContextType {
  hasForbiddenError: boolean,
  setForbiddenError: (error: boolean) => void,
  clearForbiddenError: () => void,
}

const ForbiddenErrorContext = createContext<ForbiddenErrorContextType | undefined>(undefined);

interface ForbiddenErrorProviderProps {
  children: ReactNode,
}

export const ForbiddenErrorProvider: FC<ForbiddenErrorProviderProps> = ({ children }) => {
  const [hasForbiddenError, setHasForbiddenError] = useState(false);

  const setForbiddenError = useCallback((error: boolean) => {
    setHasForbiddenError(error);
  }, []);

  const clearForbiddenError = useCallback(() => {
    setHasForbiddenError(false);
  }, []);

  const value = useMemo(() => ({
    hasForbiddenError,
    setForbiddenError,
    clearForbiddenError,
  }), [hasForbiddenError, setForbiddenError, clearForbiddenError]);

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
  const { hasForbiddenError } = useForbiddenError();

  if (hasForbiddenError) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Alert
          variant="danger"
          icon={ErrorIcon}
          className="text-center"
        >
          <Alert.Heading>{intl.formatMessage(messages.forbiddenErrorHeading)}</Alert.Heading>
          <p>
            {intl.formatMessage(messages.forbiddenErrorMessage)}
          </p>
        </Alert>
      </Container>
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
