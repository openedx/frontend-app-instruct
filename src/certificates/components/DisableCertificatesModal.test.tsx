import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import DisableCertificatesModal from './DisableCertificatesModal';
import { renderWithIntl } from '@src/testUtils';
import messages from '../messages';

describe('DisableCertificatesModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    isEnabled: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    isSubmitting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders disable modal when certificates are enabled', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders enable modal when certificates are disabled', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} isEnabled={false} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders confirm and cancel buttons', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: messages.confirm.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.cancel.defaultMessage })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);
    const user = userEvent.setup();

    const confirmButton = screen.getByRole('button', { name: messages.confirm.defaultMessage });
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);
    const user = userEvent.setup();

    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isSubmitting is true', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} isSubmitting={true} />);

    const confirmButton = screen.getByRole('button', { name: messages.confirm.defaultMessage });
    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('does not render when isOpen is false', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText(messages.disableCertificatesModalTitle.defaultMessage)).not.toBeInTheDocument();
  });

  it('switches title and message based on isEnabled prop', () => {
    const { rerender } = renderWithIntl(
      <DisableCertificatesModal {...defaultProps} isEnabled={true} />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(
      <IntlProvider locale="en" messages={{}}>
        <DisableCertificatesModal {...defaultProps} isEnabled={false} />
      </IntlProvider>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('enables buttons when not submitting', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} isSubmitting={false} />);

    const confirmButton = screen.getByRole('button', { name: messages.confirm.defaultMessage });
    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });

    expect(confirmButton).not.toBeDisabled();
    expect(cancelButton).not.toBeDisabled();
  });

  it('renders with small size modal', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  it('does not have close button in header', () => {
    renderWithIntl(<DisableCertificatesModal {...defaultProps} />);

    // Modal should not have the default close button (X) in header
    const closeButtons = screen.queryAllByLabelText('Close');
    expect(closeButtons.length).toBe(0);
  });
});
