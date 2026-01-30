import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import { ToastProvider, useToast } from './ToastContext';

const TestComponent = () => {
  const { showToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')}>
        Show Success Toast
      </button>
      <button onClick={() => showToast('Error message', 'error')}>
        Show Error Toast
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render ToastProvider without crashing', () => {
    render(
      <IntlProvider locale="en">
        <ToastProvider>
          <div>Test Child</div>
        </ToastProvider>
      </IntlProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should show success toast when showToast is called with success type', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <IntlProvider locale="en">
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </IntlProvider>
    );

    const button = screen.getByRole('button', { name: 'Show Success Toast' });
    await user.click(button);

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should show error toast when showToast is called with error type', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <IntlProvider locale="en">
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </IntlProvider>
    );

    const button = screen.getByRole('button', { name: 'Show Error Toast' });
    await user.click(button);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should show multiple toasts', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <IntlProvider locale="en">
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </IntlProvider>
    );

    const successButton = screen.getByRole('button', { name: 'Show Success Toast' });
    const errorButton = screen.getByRole('button', { name: 'Show Error Toast' });

    await user.click(successButton);
    await user.click(errorButton);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should remove toast after close button is clicked and timeout', async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <IntlProvider locale="en">
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      </IntlProvider>
    );

    const button = screen.getByRole('button', { name: 'Show Success Toast' });
    await user.click(button);

    expect(screen.getByText('Success message')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);

    // Fast-forward time to after the animation completes (500ms)
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    });
  });

  it('should throw error when useToast is used outside ToastProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    const ComponentWithoutProvider = () => {
      useToast();
      return <div>Test</div>;
    };

    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleError.mockRestore();
  });
});
