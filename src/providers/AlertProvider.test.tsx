import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import { AlertProvider, useAlert, AlertOutlet } from './AlertProvider';

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
    it('should properly map through all toasts when discarding one', async () => {
      const user = userEvent.setup({ delay: null });

      const TestToastMap = () => {
        const { showToast } = useAlert();
        return (
          <>
            <button onClick={() => {
              showToast('Toast 1', 'success');
              setTimeout(() => showToast('Toast 2', 'info'), 10);
            }}>Show Both</button>
          </>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestToastMap />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Both' });
      await user.click(button);

      jest.advanceTimersByTime(10);

      await waitFor(() => {
        expect(screen.getByText('Toast 1')).toBeInTheDocument();
        expect(screen.getByText('Toast 2')).toBeInTheDocument();
      });

      const closeButtons = screen.getAllByLabelText('Close');
      await user.click(closeButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Toast 2')).toBeInTheDocument();
      });

      jest.advanceTimersByTime(500);
    });

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

    it('should show toast with default variant when variant is not specified', async () => {
      const user = userEvent.setup({ delay: null });

      const TestDefaultToast = () => {
        const { showToast } = useAlert();
        return <button onClick={() => showToast('Default variant toast')}>Show Default</button>;
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestDefaultToast />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Default' });
      await user.click(button);

      expect(screen.getByText('Default variant toast')).toBeInTheDocument();
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

    it('should show warning toast', async () => {
      const user = userEvent.setup({ delay: null });

      const TestWarningToast = () => {
        const { showToast } = useAlert();
        return <button onClick={() => showToast('Warning toast', 'warning')}>Show Warning Toast</button>;
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestWarningToast />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Warning Toast' });
      await user.click(button);

      expect(screen.getByText('Warning toast')).toBeInTheDocument();
    });

    it('should show info toast', async () => {
      const user = userEvent.setup({ delay: null });

      const TestInfoToast = () => {
        const { showToast } = useAlert();
        return <button onClick={() => showToast('Info toast', 'info')}>Show Info Toast</button>;
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestInfoToast />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Info Toast' });
      await user.click(button);

      expect(screen.getByText('Info toast')).toBeInTheDocument();
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

    it('should handle multiple toasts and only mark targeted toast as invisible', async () => {
      const user = userEvent.setup({ delay: null });

      const TestMultipleToasts = () => {
        const { showToast } = useAlert();
        return (
          <div>
            <button onClick={() => showToast('Toast A', 'success')}>Show A</button>
            <button onClick={() => showToast('Toast B', 'info')}>Show B</button>
          </div>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestMultipleToasts />
          </AlertProvider>
        </IntlProvider>
      );

      await user.click(screen.getByRole('button', { name: 'Show A' }));
      await user.click(screen.getByRole('button', { name: 'Show B' }));

      expect(screen.getByText('Toast A')).toBeInTheDocument();
      expect(screen.getByText('Toast B')).toBeInTheDocument();

      const closeButtons = screen.getAllByLabelText('Close');
      expect(closeButtons.length).toBeGreaterThanOrEqual(2);

      await user.click(closeButtons[0]);

      expect(screen.getByText('Toast B')).toBeInTheDocument();

      jest.advanceTimersByTime(500);

      await waitFor(() => {
        expect(screen.queryByText('Toast A')).not.toBeInTheDocument();
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

    it('should show modal with default variant', async () => {
      const user = userEvent.setup({ delay: null });

      const TestDefaultModal = () => {
        const { showModal } = useAlert();
        return (
          <button onClick={() => showModal({
            message: 'Default modal',
            variant: 'default',
          })}
          >
            Show Default Modal
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestDefaultModal />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Default Modal' });
      await user.click(button);

      expect(screen.getByText('Default modal')).toBeInTheDocument();
    });

    it('should show modal with danger variant', async () => {
      const user = userEvent.setup({ delay: null });

      const TestDangerModal = () => {
        const { showModal } = useAlert();
        return (
          <button onClick={() => showModal({
            message: 'Danger modal',
            variant: 'danger',
            confirmText: 'Delete',
          })}
          >
            Show Danger Modal
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestDangerModal />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Danger Modal' });
      await user.click(button);

      expect(screen.getByText('Danger modal')).toBeInTheDocument();
      const deleteButton = screen.getByRole('button', { name: 'Delete' });
      expect(deleteButton).toHaveClass('btn-danger');
    });

    it('should show modal with success variant', async () => {
      const user = userEvent.setup({ delay: null });

      const TestSuccessModal = () => {
        const { showModal } = useAlert();
        return (
          <button onClick={() => showModal({
            message: 'Success modal',
            variant: 'success',
          })}
          >
            Show Success Modal
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestSuccessModal />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Success Modal' });
      await user.click(button);

      expect(screen.getByText('Success modal')).toBeInTheDocument();
    });

    it('should show modal without title', async () => {
      const user = userEvent.setup({ delay: null });

      const TestModalNoTitle = () => {
        const { showModal } = useAlert();
        return (
          <button onClick={() => showModal({
            message: 'Modal without title',
          })}
          >
            Show Modal No Title
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestModalNoTitle />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Modal No Title' });
      await user.click(button);

      expect(screen.getByText('Modal without title')).toBeInTheDocument();
    });

    it('should show modal without cancel and confirm buttons', async () => {
      const user = userEvent.setup({ delay: null });

      const TestModalNoButtons = () => {
        const { showModal } = useAlert();
        return (
          <button onClick={() => showModal({
            title: 'Info',
            message: 'This is just information',
          })}
          >
            Show Info Modal
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestModalNoButtons />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Info Modal' });
      await user.click(button);

      expect(screen.getByText('This is just information')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
    });

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      const onCancel = jest.fn();

      const TestModalWithCancel = () => {
        const { showModal } = useAlert();
        return (
          <button onClick={() => showModal({
            title: 'Cancelable Modal',
            message: 'Click cancel',
            cancelText: 'Cancel',
            onCancel,
          })}
          >
            Show Modal With Cancel
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestModalWithCancel />
          </AlertProvider>
        </IntlProvider>
      );

      const showButton = screen.getByRole('button', { name: 'Show Modal With Cancel' });
      await user.click(showButton);

      expect(screen.getByText('Click cancel')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Click cancel')).not.toBeInTheDocument();
      });
      expect(onCancel).toHaveBeenCalled();
    });

    it('should close modal and call onCancel when clicking backdrop', async () => {
      const user = userEvent.setup({ delay: null });
      const onCancel = jest.fn();

      const TestModalWithBackdrop = () => {
        const { showModal } = useAlert();
        return (
          <button onClick={() => showModal({
            title: 'Modal with backdrop',
            message: 'Click backdrop to close',
            onCancel,
          })}
          >
            Show Modal
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestModalWithBackdrop />
          </AlertProvider>
        </IntlProvider>
      );

      const showButton = screen.getByRole('button', { name: 'Show Modal' });
      await user.click(showButton);

      expect(screen.getByText('Click backdrop to close')).toBeInTheDocument();

      const backdrop = screen.getByTestId('modal-backdrop');
      await user.click(backdrop);

      await waitFor(() => {
        expect(screen.queryByText('Click backdrop to close')).not.toBeInTheDocument();
      });
      expect(onCancel).toHaveBeenCalled();
    });

    it('should close modal without calling onCancel when modal has no onCancel callback', async () => {
      const user = userEvent.setup({ delay: null });

      const TestModalNoOnCancel = () => {
        const { showModal } = useAlert();
        return (
          <button onClick={() => showModal({
            title: 'Modal without onCancel',
            message: 'No callback',
            cancelText: 'Cancel',
          })}
          >
            Show Modal
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestModalNoOnCancel />
          </AlertProvider>
        </IntlProvider>
      );

      const showButton = screen.getByRole('button', { name: 'Show Modal' });
      await user.click(showButton);

      expect(screen.getByText('No callback')).toBeInTheDocument();

      const backdrop = screen.getByTestId('modal-backdrop');
      await user.click(backdrop);

      await waitFor(() => {
        expect(screen.queryByText('No callback')).not.toBeInTheDocument();
      });
    });

    it('should confirm modal without calling onConfirm when modal has no onConfirm callback', async () => {
      const user = userEvent.setup({ delay: null });

      const TestModalNoOnConfirm = () => {
        const { showModal } = useAlert();
        return (
          <button onClick={() => showModal({
            title: 'Modal without onConfirm',
            message: 'No confirm callback',
            confirmText: 'OK',
          })}
          >
            Show Modal
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestModalNoOnConfirm />
          </AlertProvider>
        </IntlProvider>
      );

      const showButton = screen.getByRole('button', { name: 'Show Modal' });
      await user.click(showButton);

      expect(screen.getByText('No confirm callback')).toBeInTheDocument();

      const confirmButton = screen.getByRole('button', { name: 'OK' });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('No confirm callback')).not.toBeInTheDocument();
      });
    });

    it('should test closeModal default callOnCancel parameter', async () => {
      const user = userEvent.setup({ delay: null });
      const onCancel = jest.fn();

      const TestCloseModalDefault = () => {
        const { showModal } = useAlert();
        return (
          <button onClick={() => showModal({
            title: 'Test default param',
            message: 'Testing closeModal default',
            confirmText: 'OK',
            onCancel,
          })}
          >
            Show Modal
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestCloseModalDefault />
          </AlertProvider>
        </IntlProvider>
      );

      const showButton = screen.getByRole('button', { name: 'Show Modal' });
      await user.click(showButton);

      expect(screen.getByText('Testing closeModal default')).toBeInTheDocument();

      const confirmButton = screen.getByRole('button', { name: 'OK' });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('Testing closeModal default')).not.toBeInTheDocument();
      });

      expect(onCancel).not.toHaveBeenCalled();
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

    it('should show inline alert with success variant', async () => {
      const user = userEvent.setup({ delay: null });

      const TestSuccessInlineAlert = () => {
        const { showInlineAlert, inlineAlerts } = useAlert();
        return (
          <div>
            <button onClick={() => showInlineAlert('Success message', 'success')}>Show Success</button>
            {inlineAlerts.map(alert => <div key={alert.id}>{alert.message}</div>)}
          </div>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestSuccessInlineAlert />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Success' });
      await user.click(button);

      expect(screen.getByText('Success message')).toBeInTheDocument();
    });

    it('should show inline alert with danger variant', async () => {
      const user = userEvent.setup({ delay: null });

      const TestDangerInlineAlert = () => {
        const { showInlineAlert, inlineAlerts } = useAlert();
        return (
          <div>
            <button onClick={() => showInlineAlert('Danger message', 'danger')}>Show Danger</button>
            {inlineAlerts.map(alert => <div key={alert.id}>{alert.message}</div>)}
          </div>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestDangerInlineAlert />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Danger' });
      await user.click(button);

      expect(screen.getByText('Danger message')).toBeInTheDocument();
    });

    it('should show inline alert with warning variant', async () => {
      const user = userEvent.setup({ delay: null });

      const TestWarningInlineAlert = () => {
        const { showInlineAlert, inlineAlerts } = useAlert();
        return (
          <div>
            <button onClick={() => showInlineAlert('Warning message', 'warning')}>Show Warning</button>
            {inlineAlerts.map(alert => <div key={alert.id}>{alert.message}</div>)}
          </div>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestWarningInlineAlert />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Warning' });
      await user.click(button);

      expect(screen.getByText('Warning message')).toBeInTheDocument();
    });

    it('should show non-dismissible inline alert', async () => {
      const user = userEvent.setup({ delay: null });

      const TestNonDismissibleAlert = () => {
        const { showInlineAlert, inlineAlerts } = useAlert();
        return (
          <div>
            <button onClick={() => showInlineAlert('Cannot dismiss', 'info', false)}>Show Non-Dismissible</button>
            {inlineAlerts.map(alert => (
              <div key={alert.id}>
                {alert.message}
                {alert.dismissible && <button>Dismiss</button>}
              </div>
            ))}
          </div>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestNonDismissibleAlert />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Non-Dismissible' });
      await user.click(button);

      expect(screen.getByText('Cannot dismiss')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
    });

    it('should show inline alert with default variant and dismissible when not specified', async () => {
      const user = userEvent.setup({ delay: null });

      const TestDefaultInlineAlert = () => {
        const { showInlineAlert, inlineAlerts } = useAlert();
        return (
          <div>
            <button onClick={() => showInlineAlert('Default params alert')}>Show Default</button>
            {inlineAlerts.map(alert => (
              <div key={alert.id}>
                {alert.message}
                {alert.dismissible && <button>Dismiss</button>}
              </div>
            ))}
          </div>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestDefaultInlineAlert />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Show Default' });
      await user.click(button);

      expect(screen.getByText('Default params alert')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
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

  describe('AlertOutlet', () => {
    it('should render alerts from addAlert', async () => {
      const user = userEvent.setup({ delay: null });

      const TestAlertOutlet = () => {
        const { addAlert } = useAlert();
        return (
          <div>
            <button onClick={() => addAlert({ type: 'success', message: 'Success alert' })}>
              Add Success Alert
            </button>
            <button onClick={() => addAlert({ type: 'error', message: 'Error alert' })}>
              Add Error Alert
            </button>
          </div>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestAlertOutlet />
            <AlertOutlet />
          </AlertProvider>
        </IntlProvider>
      );

      const successButton = screen.getByRole('button', { name: 'Add Success Alert' });
      await user.click(successButton);

      expect(screen.getByText('Success alert')).toBeInTheDocument();
    });

    it('should remove alert when dismiss button is clicked', async () => {
      const user = userEvent.setup({ delay: null });

      const TestAlertOutlet = () => {
        const { addAlert } = useAlert();
        return (
          <button onClick={() => addAlert({ type: 'info', message: 'Info alert' })}>
            Add Info Alert
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestAlertOutlet />
            <AlertOutlet />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Add Info Alert' });
      await user.click(button);

      expect(screen.getByText('Info alert')).toBeInTheDocument();

      const dismissButton = screen.getByRole('button', { name: 'Dismiss' });
      await user.click(dismissButton);

      await waitFor(() => {
        expect(screen.queryByText('Info alert')).not.toBeInTheDocument();
      });
    });

    it('should display alert with extraContent', async () => {
      const user = userEvent.setup({ delay: null });

      const TestAlertWithExtra = () => {
        const { addAlert } = useAlert();
        return (
          <button onClick={() => addAlert({
            type: 'warning',
            message: 'Warning alert',
            extraContent: <div>Extra content here</div>,
          })}
          >
            Add Alert With Extra
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestAlertWithExtra />
            <AlertOutlet />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Add Alert With Extra' });
      await user.click(button);

      expect(screen.getByText('Warning alert')).toBeInTheDocument();
      expect(screen.getByText('Extra content here')).toBeInTheDocument();
    });

    it('should render error type as danger variant', async () => {
      const user = userEvent.setup({ delay: null });

      const TestErrorAlert = () => {
        const { addAlert } = useAlert();
        return (
          <button onClick={() => addAlert({ type: 'error', message: 'Error message' })}>
            Add Error
          </button>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestErrorAlert />
            <AlertOutlet />
          </AlertProvider>
        </IntlProvider>
      );

      const button = screen.getByRole('button', { name: 'Add Error' });
      await user.click(button);

      const alert = screen.getByText('Error message').closest('.alert');
      expect(alert).toHaveClass('alert-danger');
    });
  });

  describe('addAlert and removeAlert', () => {
    it('should add and remove alerts using IDs', async () => {
      const user = userEvent.setup({ delay: null });

      const TestAddRemove = () => {
        const { addAlert, removeAlert, alerts } = useAlert();
        return (
          <div>
            <button onClick={() => addAlert({ type: 'info', message: 'Test alert' })}>
              Add Alert
            </button>
            <div>
              {alerts.map(alert => (
                <div key={alert.id}>
                  {alert.message}
                  <button onClick={() => removeAlert(alert.id)}>Remove</button>
                </div>
              ))}
            </div>
          </div>
        );
      };

      render(
        <IntlProvider locale="en">
          <AlertProvider>
            <TestAddRemove />
          </AlertProvider>
        </IntlProvider>
      );

      const addButton = screen.getByRole('button', { name: 'Add Alert' });
      await user.click(addButton);

      expect(screen.getByText('Test alert')).toBeInTheDocument();

      const removeButton = screen.getByRole('button', { name: 'Remove' });
      await user.click(removeButton);

      await waitFor(() => {
        expect(screen.queryByText('Test alert')).not.toBeInTheDocument();
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
