import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError } from 'axios';
import Attempts from './Attempts';
import { useAttempts, useResetAttempt } from '../data/apiHook';
import { Attempt } from '../types';
import { renderWithAlertAndIntl } from '@src/testUtils';
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

  const clickReset = async () => {
    const actionsButton = screen.getByRole('button', { name: messages.actions.defaultMessage });
    await userEvent.click(actionsButton);
    const resetButton = screen.getByRole('button', { name: messages.reset.defaultMessage });
    await userEvent.click(resetButton);
  };

  it('renders AttemptsList component', () => {
    renderWithAlertAndIntl(<Attempts />);
    const usernameCell = screen.getByRole('cell', { name: mockAttempt.user.username });
    expect(usernameCell).toBeInTheDocument();
  });

  it('calls useResetAttempt with courseId from route params', () => {
    renderWithAlertAndIntl(<Attempts />);
    expect(useResetAttempt).toHaveBeenCalledWith('course-v1:edX+Test+2024');
  });

  it('calls resetAttempt with username and examId when onReset is triggered', async () => {
    renderWithAlertAndIntl(<Attempts />);
    await clickReset();

    expect(mockResetAttempt).toHaveBeenCalledWith(
      { username: 'testuser', examId: 42 },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });

  it('shows a success toast when reset succeeds', async () => {
    mockResetAttempt.mockImplementation((_params, options) => {
      options.onSuccess();
    });

    renderWithAlertAndIntl(<Attempts />);
    await clickReset();

    const successMessage = screen.getByText(messages.successOnReset.defaultMessage.replace('{student}', mockAttempt.user.username).replace('{examName}', mockAttempt.examName));

    await waitFor(() => {
      expect(successMessage).toBeInTheDocument();
    });
  });

  it('shows an error modal with API detail when reset fails with AxiosError', async () => {
    const axiosError = new AxiosError('Request failed');
    axiosError.response = {
      data: { detail: 'Student has no active attempt.' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    };

    mockResetAttempt.mockImplementation((_params, options) => {
      options.onError(axiosError);
    });

    renderWithAlertAndIntl(<Attempts />);
    await clickReset();

    await waitFor(() => {
      expect(screen.getByText('Student has no active attempt.')).toBeInTheDocument();
    });
    expect(screen.getByText(messages.close.defaultMessage)).toBeInTheDocument();
  });

  it('shows a generic error modal when reset fails with a non-Axios error', async () => {
    const genericError = new Error('Something went wrong');

    mockResetAttempt.mockImplementation((_params, options) => {
      options.onError(genericError);
    });

    renderWithAlertAndIntl(<Attempts />);
    await clickReset();

    await waitFor(() => {
      expect(screen.getByText(messages.errorOnReset.defaultMessage)).toBeInTheDocument();
    });
    expect(screen.getByText(messages.close.defaultMessage)).toBeInTheDocument();
  });
});
