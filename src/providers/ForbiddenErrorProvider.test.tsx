import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ForbiddenErrorProvider, ForbiddenErrorGuard, useForbiddenError } from './ForbiddenErrorProvider';

const TestComponent = () => {
  const { hasForbiddenError, setForbiddenError } = useForbiddenError();

  return (
    <div>
      <p data-testid="error-status">{hasForbiddenError ? 'forbidden' : 'allowed'}</p>
      <button
        data-testid="trigger-error"
        onClick={() => setForbiddenError(true)}
      >
        Trigger Error
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
      <ForbiddenErrorProvider>
        <TestComponent />
      </ForbiddenErrorProvider>
    );

    expect(screen.getByTestId('error-status')).toHaveTextContent('allowed');
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should show error message when forbidden error is set', async () => {
    const user = userEvent.setup();

    render(
      <ForbiddenErrorProvider>
        <TestComponent />
      </ForbiddenErrorProvider>
    );

    const triggerButton = screen.getByTestId('trigger-error');

    await act(async () => {
      await user.click(triggerButton);
    });

    expect(screen.getByTestId('error-status')).toHaveTextContent('forbidden');
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByText('Acceso Denegado')).toBeInTheDocument();
  });

  it('should throw error when used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useForbiddenError must be used within a ForbiddenErrorProvider');

    spy.mockRestore();
  });
});
