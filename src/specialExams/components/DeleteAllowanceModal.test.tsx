import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteAllowanceModal from './DeleteAllowanceModal';
import { renderWithAlertAndIntl } from '@src/testUtils';
import { useDeleteAllowance } from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('@src/specialExams/data/apiHook', () => ({
  useDeleteAllowance: jest.fn(),
}));

const mockAllowance = {
  id: 1,
  user: {
    username: 'john_doe',
    email: 'john.doe@hotmail.com',
    id: 5,
  },
  proctoredExam: {
    examName: 'Midterm Exam',
    examType: 'proctored',
    id: 1,
  },
  key: 'additional_time_granted',
  value: '30 minutes',
};

const defaultProps = {
  allowance: mockAllowance,
  isOpen: true,
  onClose: jest.fn(),
};

describe('DeleteAllowanceModal', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDeleteAllowance as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  it('renders modal with correct title and confirmation message', () => {
    renderWithAlertAndIntl(<DeleteAllowanceModal {...defaultProps} />);
    expect(screen.getByRole('dialog', { name: messages.deleteAllowance.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(/Delete allowance for john_doe for Midterm Exam?/)).toBeInTheDocument();
  });

  it('renders cancel and delete buttons', () => {
    renderWithAlertAndIntl(<DeleteAllowanceModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: messages.cancel.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.delete.defaultMessage })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithAlertAndIntl(<DeleteAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls deleteAllowance mutate when delete button is clicked', async () => {
    renderWithAlertAndIntl(<DeleteAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.delete.defaultMessage }));
    expect(mockMutate).toHaveBeenCalledWith(
      {
        examId: mockAllowance.proctoredExam.id,
        userIds: [mockAllowance.user.id],
        allowanceType: mockAllowance.key,
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('disables delete button when isPending is true', () => {
    (useDeleteAllowance as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });
    renderWithAlertAndIntl(<DeleteAllowanceModal {...defaultProps} />);
    const deleteButton = screen.getByRole('button', { name: messages.delete.defaultMessage });
    expect(deleteButton).toBeDisabled();
  });

  it('does not render when isOpen is false', () => {
    renderWithAlertAndIntl(<DeleteAllowanceModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose on successful deletion', async () => {
    let onSuccessCallback: () => void;
    mockMutate.mockImplementation((_params, options) => {
      onSuccessCallback = options.onSuccess;
    });

    renderWithAlertAndIntl(<DeleteAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.delete.defaultMessage }));

    // Simulate successful deletion
    onSuccessCallback!();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
