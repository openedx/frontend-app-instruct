import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LearnerActionModal from './LearnerActionModal';
import { renderWithIntl } from '@src/testUtils';

describe('LearnerActionModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    isSubmitting: false,
    title: 'Test Action Modal',
    description: 'This is a test description',
    learnersLabel: 'Enter Learners',
    learnersPlaceholder: 'username1, username2',
    notesLabel: 'Add Notes',
    notesPlaceholder: 'Enter notes here',
    submitLabel: 'Submit',
    cancelLabel: 'Cancel',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with title and description', () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);

    expect(screen.getAllByText('Test Action Modal')[0]).toBeInTheDocument();
    expect(screen.getByText('This is a test description')).toBeInTheDocument();
  });

  it('renders learners and notes input fields', () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);

    expect(screen.getByText('Enter Learners')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('username1, username2')).toBeInTheDocument();
    expect(screen.getByText('Add Notes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter notes here')).toBeInTheDocument();
  });

  it('renders submit and cancel buttons', () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('disables submit button when learners field is empty', () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when learners field has value', async () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnersInput = screen.getByPlaceholderText('username1, username2');
    await user.type(learnersInput, 'testuser');

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).not.toBeDisabled();
  });

  it('calls onSubmit with learners and notes when submit is clicked', async () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnersInput = screen.getByPlaceholderText('username1, username2');
    const notesInput = screen.getByPlaceholderText('Enter notes here');

    await user.type(learnersInput, 'user1, user2');
    await user.type(notesInput, 'Test notes');

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('user1, user2', 'Test notes');
  });

  it('clears form fields after successful submit', async () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnersInput = screen.getByPlaceholderText('username1, username2') as HTMLTextAreaElement;
    const notesInput = screen.getByPlaceholderText('Enter notes here') as HTMLTextAreaElement;

    await user.type(learnersInput, 'user1');
    await user.type(notesInput, 'notes');

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    await waitFor(() => {
      expect(learnersInput.value).toBe('');
      expect(notesInput.value).toBe('');
    });
  });

  it('calls onClose and clears fields when cancel is clicked', async () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnersInput = screen.getByPlaceholderText('username1, username2') as HTMLTextAreaElement;
    await user.type(learnersInput, 'user1');

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('disables all buttons when isSubmitting is true', () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('does not call onSubmit when learners field contains only whitespace', async () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnersInput = screen.getByPlaceholderText('username1, username2');
    await user.type(learnersInput, '   ');

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });

  it('does not render modal when isOpen is false', () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Test Action Modal')).not.toBeInTheDocument();
  });

  it('allows submitting with learners but empty notes', async () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnersInput = screen.getByPlaceholderText('username1, username2');
    await user.type(learnersInput, 'user1');

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('user1', '');
  });

  it('handles multiline learner input', async () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);
    const user = userEvent.setup();

    const learnersInput = screen.getByPlaceholderText('username1, username2');
    await user.type(learnersInput, 'user1{Enter}user2{Enter}user3');

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('user1\nuser2\nuser3', '');
  });

  it('renders textarea with correct number of rows', () => {
    renderWithIntl(<LearnerActionModal {...defaultProps} />);

    const learnersInput = screen.getByPlaceholderText('username1, username2');
    const notesInput = screen.getByPlaceholderText('Enter notes here');

    expect(learnersInput).toHaveAttribute('rows', '4');
    expect(notesInput).toHaveAttribute('rows', '3');
  });
});
