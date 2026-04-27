import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GrantExceptionsModal from '@src/certificates/components/GrantExceptionsModal';
import { renderWithIntl } from '@src/testUtils';
import messages from '@src/certificates/messages';

describe('GrantExceptionsModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getAllByText(messages.grantExceptionsModalTitle.defaultMessage)[0]).toBeInTheDocument();
  });

  it('renders modal with correct description', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getByText(messages.grantExceptionsModalDescription.defaultMessage)).toBeInTheDocument();
  });

  it('renders learners input field', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getByText(messages.learnersLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.learnersPlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('renders notes input field', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getByText(messages.notesLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.notesPlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('renders submit and cancel buttons', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: messages.submit.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.cancel.defaultMessage })).toBeInTheDocument();
  });

  it('calls onSubmit with learners and notes when form is submitted', async () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnersInput = screen.getByPlaceholderText(messages.learnersPlaceholder.defaultMessage);
    const notesInput = screen.getByPlaceholderText(messages.notesPlaceholder.defaultMessage);

    await user.type(learnersInput, 'user1@example.com');
    await user.type(notesInput, 'Granting exception for completion');

    const submitButton = screen.getByRole('button', { name: messages.submit.defaultMessage });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('user1@example.com', 'Granting exception for completion');
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);
    const user = userEvent.setup();

    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isSubmitting is true', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: messages.submit.defaultMessage });
    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('does not render when isOpen is false', () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText(messages.grantExceptionsModalTitle.defaultMessage)).not.toBeInTheDocument();
  });

  it('handles multiple learners input', async () => {
    renderWithIntl(<GrantExceptionsModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnersInput = screen.getByPlaceholderText(messages.learnersPlaceholder.defaultMessage);
    await user.type(learnersInput, 'user1, user2, user3');

    const submitButton = screen.getByRole('button', { name: messages.submit.defaultMessage });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('user1, user2, user3', '');
  });
});
