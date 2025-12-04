import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import { ToastManagerProvider, useToastManager, ToastTypeEnum } from './ToastManagerProvider';

// Test component to trigger toast actions
const TestComponent = () => {
  const { showToast } = useToastManager();

  return (
    <div>
      <button
        onClick={() => showToast({
          message: 'Success message',
          type: ToastTypeEnum.SUCCESS
        })}
      >
        Show Success Toast
      </button>

      <button
        onClick={() => showToast({
          message: 'Error message',
          type: ToastTypeEnum.ERROR
        })}
      >
        Show Error Toast
      </button>

      <button
        onClick={() => showToast({
          message: 'Error with retry',
          type: ToastTypeEnum.ERROR_RETRY,
          onRetry: () => console.log('Retry clicked')
        })}
      >
        Show Error Retry Toast
      </button>
    </div>
  );
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <IntlProvider locale="en">
      <ToastManagerProvider>
        {component}
      </ToastManagerProvider>
    </IntlProvider>
  );
};

describe('ToastManagerProvider', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
    user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render children correctly', () => {
    renderWithProvider(<div>Test Content</div>);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should throw error when useToastManager is used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const InvalidComponent = () => {
      useToastManager();
      return <div>Invalid</div>;
    };

    expect(() => render(<InvalidComponent />)).toThrow(
      'useToastManager must be used within a ToastManagerProvider'
    );

    consoleError.mockRestore();
  });

  it('should display success toast when showToast is called', async () => {
    renderWithProvider(<TestComponent />);

    await user.click(screen.getByText('Show Success Toast'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should display error toast with retry button', async () => {
    renderWithProvider(<TestComponent />);

    await user.click(screen.getByText('Show Error Retry Toast'));

    expect(screen.getByText('Error with retry')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should remove toast after timeout', async () => {
    renderWithProvider(<TestComponent />);

    await user.click(screen.getByText('Show Success Toast'));

    expect(screen.getByText('Success message')).toBeInTheDocument();

    // Fast-forward timers to trigger toast removal
    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('should handle multiple toasts simultaneously', async () => {
    renderWithProvider(<TestComponent />);

    await user.click(screen.getByText('Show Success Toast'));
    await user.click(screen.getByText('Show Error Toast'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
