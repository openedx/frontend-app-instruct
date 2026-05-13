import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError } from 'axios';
import Attempts from './Attempts';
import { useAttempts, useResetAttempt, useResumeAttempt } from '../data/apiHook';
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
  useResumeAttempt: jest.fn(),
}));

const mockAttempts: Attempt[] = [{
  id: 1,
  user: { username: 'testuser', id: 1 },
  examId: 42,
  examName: 'Midterm Exam',
  allowedTimeLimitMins: 60,
  examType: 'proctored',
  startTime: '2024-01-01T00:00:00Z',
  endTime: '2024-01-01T01:00:00Z',
  status: 'started',
  readyToResume: false,
}, {
  id: 2,
  user: { username: 'testuser2', id: 2 },
  examId: 43,
  examName: 'Final Exam',
  allowedTimeLimitMins: 120,
  examType: 'proctored',
  startTime: '2024-01-02T00:00:00Z',
  endTime: null,
  status: 'error',
  readyToResume: false,
},
{
  id: 3,
  user: { username: 'testuser3', id: 3 },
  examId: 44,
  examName: 'Quiz',
  allowedTimeLimitMins: 30,
  examType: 'timed',
  startTime: '2024-01-03T00:00:00Z',
  endTime: null,
  status: 'error',
  readyToResume: true,
}
];

describe('Attempts', () => {
  const mockResetAttempt = jest.fn();
  const mockResumeAttempt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useResetAttempt as jest.Mock).mockReturnValue({ mutate: mockResetAttempt });
    (useResumeAttempt as jest.Mock).mockReturnValue({ mutate: mockResumeAttempt });
    (useAttempts as jest.Mock).mockReturnValue({
      data: { results: mockAttempts },
      isLoading: false,
      isError: false,
    });
  });

  const clickReset = async (index = 0) => {
    const actionsButton = screen.getAllByRole('button', { name: messages.actions.defaultMessage });
    await userEvent.click(actionsButton[index]);
    const resetButton = screen.getByRole('button', { name: messages.reset.defaultMessage });
    await userEvent.click(resetButton);
    const confirmationModal = screen.getByRole('dialog', { name: messages.confirmationModal.defaultMessage });
    expect(confirmationModal).toBeInTheDocument();
    const confirmReset = screen.getByRole('button', { name: messages.reset.defaultMessage });
    await userEvent.click(confirmReset);
  };

  const clickResume = async (index = 0) => {
    const actionsButton = screen.getAllByRole('button', { name: messages.actions.defaultMessage });
    await userEvent.click(actionsButton[index]);
    const resumeButton = screen.getByRole('button', { name: messages.resume.defaultMessage });
    await userEvent.click(resumeButton);
    const confirmationModal = screen.getByRole('dialog', { name: messages.confirmationModal.defaultMessage });
    expect(confirmationModal).toBeInTheDocument();
    const confirmResume = screen.getByRole('button', { name: messages.resume.defaultMessage });
    await userEvent.click(confirmResume);
  };

  it('renders AttemptsList component', () => {
    renderWithAlertAndIntl(<Attempts />);
    const usernameCell = screen.getByRole('cell', { name: mockAttempts[0].user.username });
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

    const successMessage = screen.getByText(messages.successOnReset.defaultMessage.replace('{student}', mockAttempts[0].user.username).replace('{examName}', mockAttempts[0].examName));

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

  it('calls useResumeAttempt with courseId from route params', () => {
    renderWithAlertAndIntl(<Attempts />);
    expect(useResumeAttempt).toHaveBeenCalledWith('course-v1:edX+Test+2024');
  });

  it('calls resumeAttempt with attemptId and userId when onResume is triggered', async () => {
    renderWithAlertAndIntl(<Attempts />);
    const studentIndexToTest = 1;
    await clickResume(studentIndexToTest);

    expect(mockResumeAttempt).toHaveBeenCalledWith(
      { attemptId: mockAttempts[studentIndexToTest].id, userId: mockAttempts[studentIndexToTest].user.id },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });

  it('shows a success toast when resume succeeds', async () => {
    mockResumeAttempt.mockImplementation((_params, options) => {
      options.onSuccess();
    });

    renderWithAlertAndIntl(<Attempts />);
    const studentIndexToTest = 1;
    await clickResume(studentIndexToTest);

    const successMessage = screen.getByText(messages.successOnResume.defaultMessage.replace('{student}', mockAttempts[studentIndexToTest].user.username));

    await waitFor(() => {
      expect(successMessage).toBeInTheDocument();
    });
  });

  it('shows an error modal with API detail when resume fails with AxiosError', async () => {
    const axiosError = new AxiosError('Request failed');
    axiosError.response = {
      data: { detail: 'Cannot resume this attempt.' },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as any,
    };

    mockResumeAttempt.mockImplementation((_params, options) => {
      options.onError(axiosError);
    });

    renderWithAlertAndIntl(<Attempts />);

    const studentIndexToTest = 1;
    await clickResume(studentIndexToTest);

    await waitFor(() => {
      expect(screen.getByText('Cannot resume this attempt.')).toBeInTheDocument();
    });
    expect(screen.getByText(messages.close.defaultMessage)).toBeInTheDocument();
  });

  it('shows a generic error modal when resume fails with a non-Axios error', async () => {
    const genericError = new Error('Something went wrong');

    mockResumeAttempt.mockImplementation((_params, options) => {
      options.onError(genericError);
    });

    renderWithAlertAndIntl(<Attempts />);

    const studentIndexToTest = 1;
    await clickResume(studentIndexToTest);

    await waitFor(() => {
      expect(screen.getByText(messages.errorOnResume.defaultMessage)).toBeInTheDocument();
    });
    expect(screen.getByText(messages.close.defaultMessage)).toBeInTheDocument();
  });
});
