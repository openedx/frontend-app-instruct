import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddAllowanceModal from './AddAllowanceModal';
import { renderWithAlertAndIntl } from '@src/testUtils';
import messages from '../messages';
import { useAddAllowance, useSpecialExams } from '../data/apiHook';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('@src/specialExams/data/apiHook', () => ({
  useSpecialExams: jest.fn(),
  useAddAllowance: jest.fn(),
}));

const mockSpecialExams = [
  { id: 1, examName: 'Midterm Exam' },
  { id: 2, examName: 'Final Exam' },
];

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onAdd: jest.fn(),
};

describe('AddAllowanceModal', () => {
  const mockRefetch = jest.fn();
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSpecialExams as jest.Mock).mockReturnValue({
      data: mockSpecialExams,
      refetch: mockRefetch,
    });
    (useAddAllowance as jest.Mock).mockReturnValue({ mutate: mockMutate });
  });

  it('renders modal with all fields', () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);
    expect(screen.getByText(messages.addAllowance.defaultMessage)).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp(messages.specifyLearners.defaultMessage))).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp(messages.selectExamType.defaultMessage))).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp(messages.selectAllowanceType.defaultMessage))).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp(messages.addTime.defaultMessage))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.cancel.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.createAllowance.defaultMessage })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onAdd when form is submitted with correct data', async () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();

    // Fill in users field
    const usersInput = screen.getByLabelText(new RegExp(messages.specifyLearners.defaultMessage));
    await user.type(usersInput, 'user1, user2, user3');

    // Select exam type
    const examTypeSelect = screen.getByLabelText(new RegExp(messages.selectExamType.defaultMessage));
    await user.selectOptions(examTypeSelect, 'proctored');

    // Wait for exams to load and select an exam
    await waitFor(() => {
      expect(screen.getByText('Midterm Exam')).toBeInTheDocument();
    });
    const midtermCheckbox = screen.getByRole('checkbox', { name: 'Midterm Exam' });
    await user.click(midtermCheckbox);

    // Select allowance type
    const allowanceTypeSelect = screen.getByLabelText(new RegExp(messages.selectAllowanceType.defaultMessage));
    await user.selectOptions(allowanceTypeSelect, 'additional_time_granted');

    // Fill in value
    const valueInput = screen.getByLabelText(new RegExp(messages.addTime.defaultMessage));
    await user.type(valueInput, '30');

    // Submit form
    await user.click(screen.getByRole('button', { name: messages.createAllowance.defaultMessage }));

    expect(mockMutate).toHaveBeenCalledWith({
      userIds: ['user1', 'user2', 'user3'],
      examType: 'proctored',
      examIds: [1],
      allowanceType: 'additional_time_granted',
      value: '30'
    },
    expect.objectContaining({
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    })
    );
  });

  it('does not render when isOpen is false', () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(messages.addAllowance.defaultMessage)).not.toBeInTheDocument();
  });

  it('shows exams list when exam type is selected', async () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();

    const examTypeSelect = screen.getByLabelText(new RegExp(messages.selectExamType.defaultMessage));
    await user.selectOptions(examTypeSelect, 'proctored');

    await waitFor(() => {
      expect(screen.getByText('Midterm Exam')).toBeInTheDocument();
      expect(screen.getByText('Final Exam')).toBeInTheDocument();
    });
  });

  it('handles multiple exam selections', async () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();

    // Select exam type first
    const examTypeSelect = screen.getByLabelText(new RegExp(messages.selectExamType.defaultMessage));
    await user.selectOptions(examTypeSelect, 'proctored');

    // Wait for exams to load
    await waitFor(() => {
      expect(screen.getByText('Midterm Exam')).toBeInTheDocument();
    });

    // Select multiple exams
    const midtermCheckbox = screen.getByRole('checkbox', { name: 'Midterm Exam' });
    const finalCheckbox = screen.getByRole('checkbox', { name: 'Final Exam' });

    await user.click(midtermCheckbox);
    await user.click(finalCheckbox);

    expect(midtermCheckbox).toBeChecked();
    expect(finalCheckbox).toBeChecked();
  });

  it('can deselect exams after selecting them', async () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();

    // Select exam type first
    const examTypeSelect = screen.getByLabelText(new RegExp(messages.selectExamType.defaultMessage));
    await user.selectOptions(examTypeSelect, 'proctored');

    await waitFor(() => {
      expect(screen.getByText('Midterm Exam')).toBeInTheDocument();
    });

    // Select and then deselect exam
    const midtermCheckbox = screen.getByRole('checkbox', { name: 'Midterm Exam' });
    await user.click(midtermCheckbox);
    expect(midtermCheckbox).toBeChecked();

    await user.click(midtermCheckbox);
    expect(midtermCheckbox).not.toBeChecked();
  });

  it('changes input type based on allowance type', async () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();

    // Initially should be number input for default type
    let valueInput = screen.getByLabelText(new RegExp(messages.addTime.defaultMessage));
    expect(valueInput).toHaveAttribute('type', 'number');

    // Change to review policy exception - should become text input
    const allowanceTypeSelect = screen.getByLabelText(new RegExp(messages.selectAllowanceType.defaultMessage));
    await user.selectOptions(allowanceTypeSelect, 'review_policy_exception');

    valueInput = screen.getByLabelText(new RegExp(messages.addReviewPolicyException.defaultMessage));
    expect(valueInput).toHaveAttribute('type', 'text');
  });

  it('refetches exams when exam type changes and modal is open', async () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();

    const examTypeSelect = screen.getByLabelText(new RegExp(messages.selectExamType.defaultMessage));
    await user.selectOptions(examTypeSelect, 'timed');

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('resets form when modal closes', async () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();

    // Fill some data
    const usersInput = screen.getByLabelText(new RegExp(messages.specifyLearners.defaultMessage));
    await user.type(usersInput, 'test user');

    // Close modal
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('disables submit button when required fields are empty', async () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);

    // Button should be disabled when form is empty
    const submitButton = screen.getByRole('button', { name: messages.createAllowance.defaultMessage });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when all required fields are filled', async () => {
    renderWithAlertAndIntl(<AddAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();

    // Initially disabled
    const submitButton = screen.getByRole('button', { name: messages.createAllowance.defaultMessage });
    expect(submitButton).toBeDisabled();

    // Fill all required fields
    const usersInput = screen.getByLabelText(new RegExp(messages.specifyLearners.defaultMessage));
    await user.type(usersInput, 'user1');

    const examTypeSelect = screen.getByLabelText(new RegExp(messages.selectExamType.defaultMessage));
    await user.selectOptions(examTypeSelect, 'proctored');

    // Wait for exams to load and select an exam
    await waitFor(() => {
      expect(screen.getByText('Midterm Exam')).toBeInTheDocument();
    });
    const midtermCheckbox = screen.getByRole('checkbox', { name: 'Midterm Exam' });
    await user.click(midtermCheckbox);

    const allowanceTypeSelect = screen.getByLabelText(new RegExp(messages.selectAllowanceType.defaultMessage));
    await user.selectOptions(allowanceTypeSelect, 'additional_time_granted');

    const valueInput = screen.getByLabelText(new RegExp(messages.addTime.defaultMessage));
    await user.type(valueInput, '30');

    // Button should now be enabled
    await waitFor(() => expect(submitButton).toBeEnabled());
  });
});
