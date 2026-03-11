import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import RemoveInvalidationModal from '../../components/RemoveInvalidationModal';
import { renderWithIntl } from '@src/testUtils';
import messages from '../../messages';

describe('RemoveInvalidationModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    email: 'user@example.com',
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    isSubmitting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    renderWithIntl(<RemoveInvalidationModal {...defaultProps} />);

    expect(screen.getAllByText(messages.removeInvalidationModalTitle.defaultMessage)[0]).toBeInTheDocument();
  });

  it('renders message with email address', () => {
    renderWithIntl(<RemoveInvalidationModal {...defaultProps} />);

    const messageText = screen.getAllByText((_content, element) => {
      return element?.textContent?.includes('user@example.com') || false;
    })[0];
    expect(messageText).toBeInTheDocument();
  });

  it('renders confirm and cancel buttons', () => {
    renderWithIntl(<RemoveInvalidationModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: messages.removeInvalidationAction.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.cancel.defaultMessage })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    renderWithIntl(<RemoveInvalidationModal {...defaultProps} />);
    const user = userEvent.setup();

    const confirmButton = screen.getByRole('button', { name: messages.removeInvalidationAction.defaultMessage });
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithIntl(<RemoveInvalidationModal {...defaultProps} />);
    const user = userEvent.setup();

    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isSubmitting is true', () => {
    renderWithIntl(<RemoveInvalidationModal {...defaultProps} isSubmitting={true} />);

    const confirmButton = screen.getByRole('button', { name: messages.removeInvalidationAction.defaultMessage });
    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('does not render when isOpen is false', () => {
    renderWithIntl(<RemoveInvalidationModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText(messages.removeInvalidationModalTitle.defaultMessage)).not.toBeInTheDocument();
  });

  it('renders with different email addresses', () => {
    const { rerender } = renderWithIntl(
      <RemoveInvalidationModal {...defaultProps} email="test1@example.com" />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(
      <IntlProvider locale="en" messages={{}}>
        <RemoveInvalidationModal {...defaultProps} email="test2@example.com" />
      </IntlProvider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not have close button in header', () => {
    renderWithIntl(<RemoveInvalidationModal {...defaultProps} />);

    // Modal should not have the default close button (X) in header
    const closeButtons = screen.queryAllByLabelText('Close');
    expect(closeButtons.length).toBe(0);
  });

  it('enables buttons when not submitting', () => {
    renderWithIntl(<RemoveInvalidationModal {...defaultProps} isSubmitting={false} />);

    const confirmButton = screen.getByRole('button', { name: messages.removeInvalidationAction.defaultMessage });
    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });

    expect(confirmButton).not.toBeDisabled();
    expect(cancelButton).not.toBeDisabled();
  });
});
