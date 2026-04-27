import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditAllowanceModal from './EditAllowanceModal';
import { renderWithAlertAndIntl } from '@src/testUtils';
import * as apiHook from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';
import { useLearner } from '@src/data/apiHook';

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  allowance: {
    user: { username: 'john_doe', email: 'john.doe@hotmail.com', id: 5 },
    key: 'time_multiplier',
    value: '3',
    proctoredExam: { examType: 'proctored', examName: 'Midterm Exam', id: 1 },
    id: 1,
  },
};

const mockLearnerData = {
  username: 'john_doe',
  fullName: 'John Doe',
  email: 'john.doe@hotmail.com',
  isEnrolled: true,
  progressUrl: 'http://example.com/progress',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('@src/data/apiHook', () => ({
  useLearner: jest.fn(),
  useCourseInfo: jest.fn().mockReturnValue({ data: { permissions: { admin: true, dataResearcher: false } } }),
}));

jest.mock('@src/specialExams/data/apiHook');

describe('EditAllowanceModal', () => {
  const mutate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (apiHook.useAddAllowance as jest.Mock).mockReturnValue({ mutate });
    (useLearner as jest.Mock).mockReturnValue({
      data: mockLearnerData,
      refetch: jest.fn().mockResolvedValue({ data: mockLearnerData }),
      error: null,
    });
  });

  it('renders modal with all fields', () => {
    renderWithAlertAndIntl(<EditAllowanceModal {...defaultProps} />);
    expect(screen.getByRole('heading', { name: messages.editAllowance.defaultMessage })).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp(messages.selectExamType.defaultMessage))).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp(messages.selectAllowanceType.defaultMessage))).toBeInTheDocument();
    expect(screen.getByLabelText(new RegExp(messages.addTime.defaultMessage))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.cancel.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.editAllowance.defaultMessage })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithAlertAndIntl(<EditAllowanceModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls mutate when form is submitted', async () => {
    renderWithAlertAndIntl(<EditAllowanceModal {...defaultProps} />);
    const inputTime = screen.getByLabelText(new RegExp(messages.addTime.defaultMessage));
    await userEvent.clear(inputTime);
    await userEvent.type(inputTime, '45');
    const user = userEvent.setup();
    const editBtn = screen.getByRole('button', { name: messages.editAllowance.defaultMessage });
    await user.click(editBtn);
    expect(mutate).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    renderWithAlertAndIntl(<EditAllowanceModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(messages.editAllowance.defaultMessage)).not.toBeInTheDocument();
  });
});
