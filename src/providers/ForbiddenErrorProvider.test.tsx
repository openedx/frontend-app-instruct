import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import { ForbiddenErrorProvider, ForbiddenErrorGuard, useForbiddenError } from './ForbiddenErrorProvider';

const TestComponent = () => {
  const { errorType, setErrorType } = useForbiddenError();

  return (
    <div>
      <p data-testid="error-status">{errorType ?? 'allowed'}</p>
      <button
        data-testid="trigger-forbidden"
        onClick={() => setErrorType('forbidden')}
      >
        Trigger Forbidden
      </button>
      <button
        data-testid="trigger-unauthorized"
        onClick={() => setErrorType('unauthorized')}
      >
        Trigger Unauthorized
      </button>
      <ForbiddenErrorGuard>
        <div data-testid="protected-content">Protected Content</div>
      </ForbiddenErrorGuard>
    </div>
  );
};

describe('ForbiddenErrorProvider', () => {
  it('should render protected content when no error', () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <ForbiddenErrorProvider>
          <TestComponent />
        </ForbiddenErrorProvider>
      </IntlProvider>
    );

    expect(screen.getByTestId('error-status')).toHaveTextContent('allowed');
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should show forbidden error message when errorType is forbidden', async () => {
    const user = userEvent.setup();

    render(
      <IntlProvider locale="en" messages={{}}>
        <ForbiddenErrorProvider>
          <TestComponent />
        </ForbiddenErrorProvider>
      </IntlProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId('trigger-forbidden'));
    });

    expect(screen.getByTestId('error-status')).toHaveTextContent('forbidden');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('should show unauthorized error message when errorType is unauthorized', async () => {
    const user = userEvent.setup();

    render(
      <IntlProvider locale="en" messages={{}}>
        <ForbiddenErrorProvider>
          <TestComponent />
        </ForbiddenErrorProvider>
      </IntlProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId('trigger-unauthorized'));
    });

    expect(screen.getByTestId('error-status')).toHaveTextContent('unauthorized');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
  });

  it('should throw error when used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useForbiddenError must be used within a ForbiddenErrorProvider');

    spy.mockRestore();
  });
});
