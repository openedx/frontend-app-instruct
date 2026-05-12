import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Attempts from './Attempts';
import { useAttempts, useResetAttempt } from '../data/apiHook';
import { Attempt } from '../types';
import { renderWithIntl } from '@src/testUtils';
import messages from '../messages';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('../data/apiHook', () => ({
  useAttempts: jest.fn(),
  useResetAttempt: jest.fn(),
}));

const mockAttempt: Attempt = {
  id: 1,
  user: { username: 'testuser' },
  examId: 42,
  examName: 'Midterm Exam',
  allowedTimeLimitMins: 60,
  type: 'proctored',
  startTime: '2024-01-01T00:00:00Z',
  endTime: '2024-01-01T01:00:00Z',
  status: 'started',
  readyToResume: false,
};

describe('Attempts', () => {
  const mockResetAttempt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useResetAttempt as jest.Mock).mockReturnValue({ mutate: mockResetAttempt });
    (useAttempts as jest.Mock).mockReturnValue({
      data: { results: [mockAttempt] },
      isLoading: false,
      isError: false,
    });
  });

  it('renders AttemptsList component', () => {
    renderWithIntl(<Attempts />);
    const usernameCell = screen.getByRole('cell', { name: mockAttempt.user.username });
    expect(usernameCell).toBeInTheDocument();
  });

  it('calls useResetAttempt with courseId from route params', () => {
    renderWithIntl(<Attempts />);
    expect(useResetAttempt).toHaveBeenCalledWith('course-v1:edX+Test+2024');
  });

  it('calls resetAttempt with username and examId when onReset is triggered', async () => {
    renderWithIntl(<Attempts />);
    const actionsButton = screen.getByRole('button', { name: messages.actions.defaultMessage });
    await userEvent.click(actionsButton);
    const resetButton = screen.getByRole('button', { name: messages.reset.defaultMessage });
    await userEvent.click(resetButton);

    expect(mockResetAttempt).toHaveBeenCalledWith({
      username: 'testuser',
      examId: 42,
    });
  });
});
