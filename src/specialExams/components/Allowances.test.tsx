import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Allowances from '@src/specialExams/components/Allowances';
import { renderWithAlertAndIntl } from '@src/testUtils';
import messages from '@src/specialExams/messages';
import { useAddAllowance, useAllowances, useSpecialExams } from '@src/specialExams/data/apiHook';
import { useLearner } from '@src/data/apiHook';

const mockLearnerData = {
  username: 'testuser',
  fullName: 'Test User',
  email: 'test@email.com',
  isEnrolled: true,
  progressUrl: 'http://example.com/progress',
};

const mockAllowance = {
  user: {
    username: 'john_doe',
    email: 'john.doe@hotmail.com',
  },
  proctoredExam: {
    examName: 'Midterm Exam',
    examType: 'proctored',
  },
  value: '30 minutes',
  key: 'additional_time_granted',
};

const mockSpecialExams = [
  { id: 1, examName: 'Midterm Exam' },
  { id: 2, examName: 'Final Exam' },
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('@src/data/apiHook', () => ({
  useLearner: jest.fn(),
  useCourseInfo: jest.fn().mockReturnValue({ data: { permissions: { admin: true, dataResearcher: false } } }),
}));

jest.mock('@src/specialExams/data/apiHook', () => ({
  useAllowances: jest.fn(),
  useAddAllowance: jest.fn(),
  useSpecialExams: jest.fn(),
  useDeleteAllowance: jest.fn().mockReturnValue({ mutate: jest.fn() }),
}));

describe('Allowances', () => {
  let mockAddAllowance: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAddAllowance = jest.fn();
    (useLearner as jest.Mock).mockReturnValue({
      data: mockLearnerData,
      refetch: jest.fn().mockResolvedValue({ data: mockLearnerData }),
      error: null,
    });
    (useAllowances as jest.Mock).mockReturnValue({
      data: { results: [], count: 0, numPages: 0 },
      isLoading: false,
    });
    (useAddAllowance as jest.Mock).mockReturnValue({ mutate: mockAddAllowance });
    (useSpecialExams as jest.Mock).mockReturnValue({
      data: mockSpecialExams,
      refetch: jest.fn().mockResolvedValue({ data: mockSpecialExams }),
    });
  });

  it('renders AllowancesList and AddAllowanceModal', () => {
    renderWithAlertAndIntl(<Allowances />);
    expect(screen.getByText('No allowances found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add allowance/i })).toBeInTheDocument();
  });

  it('opens AddAllowanceModal when add button is clicked', async () => {
    renderWithAlertAndIntl(<Allowances />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add allowance/i }));
    expect(screen.getByRole('dialog', { name: /add allowance/i })).toBeInTheDocument();
  });

  it('closes AddAllowanceModal when cancel is clicked', async () => {
    renderWithAlertAndIntl(<Allowances />);
    const user = userEvent.setup();

    // Open modal
    await user.click(screen.getByRole('button', { name: /add allowance/i }));
    expect(screen.getByRole('dialog', { name: /add allowance/i })).toBeInTheDocument();

    // Close modal
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));
    expect(screen.queryByRole('dialog', { name: /add allowance/i })).not.toBeInTheDocument();
  });

  it('calls addAllowance mutation and closes modal on successful add', async () => {
    mockAddAllowance.mockImplementation((_data, options) => {
      options.onSuccess();
    });

    renderWithAlertAndIntl(<Allowances />);
    const user = userEvent.setup();

    // Open modal
    await user.click(screen.getByRole('button', { name: /add allowance/i }));

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

    // Submit form (will trigger confirmAddAllowance)
    await user.click(screen.getByRole('button', { name: messages.createAllowance.defaultMessage }));

    expect(mockAddAllowance).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: /add allowance/i })).not.toBeInTheDocument();
    });
  });

  it('opens EditAllowanceModal when actions and Edit is clicked', async () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: {
        results: [mockAllowance],
        count: 1,
        numPages: 1,
      },
      isLoading: false,
    });
    renderWithAlertAndIntl(<Allowances />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.actions.defaultMessage }));
    const editBtn = await screen.findByRole('button', { name: /edit/i });
    await user.click(editBtn);
    expect(screen.getByRole('dialog', { name: messages.editAllowance.defaultMessage })).toBeInTheDocument();
  });

  it('closes EditAllowanceModal when onClose is called', async () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: {
        results: [mockAllowance],
        count: 1,
        numPages: 1,
      },
      isLoading: false,
    });
    renderWithAlertAndIntl(<Allowances />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.actions.defaultMessage }));
    const editBtn = screen.getByText('Edit');
    await user.click(editBtn);
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));
    expect(screen.queryByRole('dialog', { name: messages.editAllowance.defaultMessage })).not.toBeInTheDocument();
  });

  it('opens DeleteAllowanceModal when actions and Delete is clicked', async () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: {
        results: [mockAllowance],
        count: 1,
        numPages: 1,
      },
      isLoading: false,
    });
    renderWithAlertAndIntl(<Allowances />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.actions.defaultMessage }));
    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    await user.click(deleteBtn);
    expect(screen.getByRole('dialog', { name: messages.deleteAllowance.defaultMessage })).toBeInTheDocument();
  });

  it('closes DeleteAllowanceModal when onClose is called', async () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: {
        results: [mockAllowance],
        count: 1,
        numPages: 1,
      },
      isLoading: false,
    });
    renderWithAlertAndIntl(<Allowances />);
    const user = userEvent.setup();

    // Open delete modal
    await user.click(screen.getByRole('button', { name: messages.actions.defaultMessage }));
    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    await user.click(deleteBtn);
    expect(screen.getByRole('dialog', { name: messages.deleteAllowance.defaultMessage })).toBeInTheDocument();

    // Close modal
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));
    expect(screen.queryByRole('dialog', { name: messages.deleteAllowance.defaultMessage })).not.toBeInTheDocument();
  });

  it('handles selectedAllowance state correctly for edit modal', async () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: {
        results: [mockAllowance],
        count: 1,
        numPages: 1,
      },
      isLoading: false,
    });
    renderWithAlertAndIntl(<Allowances />);
    const user = userEvent.setup();

    // Open edit modal
    await user.click(screen.getByRole('button', { name: messages.actions.defaultMessage }));
    const editBtn = await screen.findByRole('button', { name: /edit/i });
    await user.click(editBtn);

    // Verify modal is open with the selected allowance
    expect(screen.getByRole('dialog', { name: messages.editAllowance.defaultMessage })).toBeInTheDocument();

    // Close modal - should reset selectedAllowance
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));
    expect(screen.queryByRole('dialog', { name: messages.editAllowance.defaultMessage })).not.toBeInTheDocument();
  });

  it('handles selectedAllowance state correctly for delete modal', async () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: {
        results: [mockAllowance],
        count: 1,
        numPages: 1,
      },
      isLoading: false,
    });
    renderWithAlertAndIntl(<Allowances />);
    const user = userEvent.setup();

    // Open delete modal
    await user.click(screen.getByRole('button', { name: messages.actions.defaultMessage }));
    const deleteBtn = await screen.findByRole('button', { name: /delete/i });
    await user.click(deleteBtn);

    // Verify modal is open with the selected allowance
    expect(screen.getByRole('dialog', { name: messages.deleteAllowance.defaultMessage })).toBeInTheDocument();

    // Close modal - should reset selectedAllowance
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));
    expect(screen.queryByRole('dialog', { name: messages.deleteAllowance.defaultMessage })).not.toBeInTheDocument();
  });

  it('does not render edit modal when no allowance is selected', () => {
    renderWithAlertAndIntl(<Allowances />);
    // EditAllowanceModal should not render without selectedAllowance
    expect(screen.queryByRole('dialog', { name: messages.editAllowance.defaultMessage })).not.toBeInTheDocument();
  });

  it('does not render delete modal when no allowance is selected', () => {
    renderWithAlertAndIntl(<Allowances />);
    // DeleteAllowanceModal should not render without selectedAllowance
    expect(screen.queryByRole('dialog', { name: messages.deleteAllowance.defaultMessage })).not.toBeInTheDocument();
  });
});
