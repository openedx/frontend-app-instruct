import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import { AlertProvider, useAlert } from './AlertProvider';

const TestComponent = () => {
  const {
    showToast,
    showModal,
    showInlineAlert,
    dismissInlineAlert,
    clearAlerts,
    inlineAlerts,
  } = useAlert();

  return (
    <div>
      {/* Toast Buttons */}
      <button onClick={() => showToast('Success toast', 'success')}>
        Show Success Toast
      </button>
      <button onClick={() => showToast('Error toast', 'error')}>
        Show Error Toast
      </button>

      {/* Modal Buttons */}
      <button onClick={() => showModal({
        title: 'Test Modal',
        message: 'Modal message',
        variant: 'warning',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: () => console.log('confirmed'),
        onCancel: () => console.log('cancelled'),
      })}
      >
        Show Modal
      </button>

      {/* Inline Alert Buttons */}
      <button onClick={() => showInlineAlert('Inline alert message', 'info', true)}>
        Show Inline Alert
      </button>
      <button onClick={() => clearAlerts()}>
        Clear All Alerts
      </button>

      {/* Render inline alerts */}
      <div data-testid="inline-alerts-container">
        {inlineAlerts.map(alert => (
          <div key={alert.id} data-testid={`inline-alert-${alert.id}`}>
            {alert.message}
            {alert.dismissible && (
              <button onClick={() => dismissInlineAlert(alert.id)}>Dismiss</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

describe('AlertProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render AlertProvider without crashing', () => {
    render(
      <IntlProvider locale="en">
        <AlertProvider>
          <div>Test Child</div>
        </AlertProvider>
      </IntlProvider>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  describe('Toast Alerts', () => {
    it('should show success toast', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestComponent />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Success Toast' });
      await user.click(button);

      expect(screen.getByText('Success toast')).toBeInTheDocument();
    });

    it('should show error toast', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestComponent />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Error Toast' });
      await user.click(button);

      expect(screen.getByText('Error toast')).toBeInTheDocument();
    });

    it('should remove toast after close button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestComponent />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Success Toast' });
      await user.click(button);

      expect(screen.getByText('Success toast')).toBeInTheDocument();

      const closeButton = screen.getByLabelText('Close');
      await user.click(closeButton);

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.queryByText('Success toast')).not.toBeInTheDocument();
      });
    });
  });

  describe('Modal Alerts', () => {
    it('should show modal alert', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestComponent />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Modal' });
      await user.click(button);

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should close modal when cancel is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestComponent />
          </AlertProvider>
        </IntlProvider>
      );

      const showButton = screen.getByRole('button', { name: 'Show Modal' });
      await user.click(showButton);

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
      });
    });

    it('should close modal when confirm is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestComponent />
          </AlertProvider>
        </IntlProvider>
      );

      const showButton = screen.getByRole('button', { name: 'Show Modal' });
      await user.click(showButton);

      const confirmButton = screen.getByRole('button', { name: 'Confirm' });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
      });
    });
  });

  describe('Inline Alerts', () => {
    it('should show inline alert', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestComponent />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Inline Alert' });
      await user.click(button);

      expect(screen.getByText('Inline alert message')).toBeInTheDocument();
    });

    it('should dismiss inline alert', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestComponent />
          </AlertProvider>
        </IntlProvider>
      );

      const showButton = screen.getByRole('button', { name: 'Show Inline Alert' });
      await user.click(showButton);

      expect(screen.getByText('Inline alert message')).toBeInTheDocument();

      const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
      await user.click(dismissButton);

      await waitFor(() => {
        expect(screen.queryByText('Inline alert message')).not.toBeInTheDocument();
      });
    });
  });

  describe('Clear All Alerts', () => {
    it('should clear all alerts when clearAlerts is called', async () => {
      const user = userEvent.setup({ delay: null });
      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestComponent />
          </AlertProvider>
        </IntlProvider>
      );

      // Show toast and inline alert (skip modal to avoid button name conflicts)
      await user.click(screen.getByRole('button', { name: 'Show Success Toast' }));
      await user.click(screen.getByRole('button', { name: 'Show Inline Alert' }));

      expect(screen.getByText('Success toast')).toBeInTheDocument();
      expect(screen.getByText('Inline alert message')).toBeInTheDocument();

      // Clear all alerts
      const clearButton = screen.getAllByRole('button').find(btn => btn.textContent === 'Clear All Alerts');
      if (clearButton) {
        await user.click(clearButton);
      }

      await waitFor(() => {
        expect(screen.queryByText('Success toast')).not.toBeInTheDocument();
        expect(screen.queryByText('Inline alert message')).not.toBeInTheDocument();
      });
    });
  });

  it('should throw error when useAlert is used outside AlertProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    const ComponentWithoutProvider = () => {
      useAlert();
      return <div>Test</div>;
    };

    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('useAlert must be used within an AlertProvider');

    consoleError.mockRestore();
  });
});
