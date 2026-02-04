import { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { AlertProvider, useAlert } from '@src/components/AlertContext';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
  const { alerts, addAlert, removeAlert, clearAlerts } = useAlert();

  return (
    <div>
      <button
        onClick={() => addAlert({ type: 'success', message: 'Success!' })}
      >
        Add Success
      </button>
      <button
        onClick={() => addAlert({ type: 'error', message: 'Error!' })}
      >
        Add Error
      </button>
      <button
        onClick={() => alerts.length > 0 && removeAlert(alerts[0].id)}
      >
        Remove First
      </button>
      <button
        onClick={clearAlerts}
      >
        Clear All
      </button>
      <ul>
        {alerts.map(alert => (
          <li key={alert.id}>
            {alert.type}: {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

const renderWithProvider = (ui: ReactElement) =>
  render(<AlertProvider>{ui}</AlertProvider>);

describe('AlertContext', () => {
  it('throws error when used outside provider', () => {
    const BrokenComponent = () => {
      useAlert();
      return <></>;
    };
    expect(() => render(<BrokenComponent />)).toThrow(
      'useAlert must be used within a AlertProvider'
    );
  });

  it('adds an alert', async () => {
    renderWithProvider(<TestComponent />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Add Success/i }));
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('adds multiple alerts of different types', async () => {
    renderWithProvider(<TestComponent />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Add Success/i }));
    await user.click(screen.getByRole('button', { name: /Add Error/i }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('success: Success!')).toBeInTheDocument();
    expect(screen.getByText('error: Error!')).toBeInTheDocument();
  });

  it('removes an alert by id', async () => {
    renderWithProvider(<TestComponent />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Add Success/i }));
    await user.click(screen.getByRole('button', { name: /Remove First/i }));
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('clears all alerts', async () => {
    renderWithProvider(<TestComponent />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Add Success/i }));
    await user.click(screen.getByRole('button', { name: /Add Error/i }));
    await user.click(screen.getByRole('button', { name: /Clear All/i }));
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('alerts have unique ids', async () => {
    renderWithProvider(<TestComponent />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Add Success/i }));
    await user.click(screen.getByRole('button', { name: /Add Success/i }));
    const alerts = screen.getAllByRole('listitem');
    expect(alerts.length).toBe(2);
    expect(alerts[0].textContent).toBe('success: Success!');
    expect(alerts[1].textContent).toBe('success: Success!');
  });
});
