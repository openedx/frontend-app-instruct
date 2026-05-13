import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AttemptsList, { ATTEMPTS_PAGE_SIZE } from './AttemptsList';
import { renderWithIntl } from '@src/testUtils';
import { useAttempts } from '../data/apiHook';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('../data/apiHook', () => ({
  useAttempts: jest.fn(),
}));

const mockExamAttempts = {
  results: [
    {
      id: 1,
      user: {
        username: 'user1',
        id: 1,
      },
      examName: 'Midterm',
      allowedTimeLimitMins: 60,
      examType: 'proctored',
      startTime: '2024-01-01',
      endTime: '2024-01-02',
      status: 'completed',
      readyToResume: false,
    },
    {
      id: 2,
      user: { username: 'testuser2', id: 2 },
      examId: 43,
      examName: 'Final Exam',
      allowedTimeLimitMins: 120,
      examType: 'timed',
      startTime: '2024-01-03T00:00:00Z',
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
      startTime: '2024-01-04T00:00:00Z',
      endTime: null,
      status: 'error',
      readyToResume: true,
    },
  ],
  count: 1,
  numPages: 1,
};

describe('AttemptsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockReset = jest.fn();
  const mockResume = jest.fn();

  const renderComponent = () => renderWithIntl(<AttemptsList onReset={mockReset} onResume={mockResume} />);

  it('renders DataTable with correct columns and empty data', () => {
    (useAttempts as jest.Mock).mockReturnValue({
      data: { results: [], count: 0, numPages: 0 },
      isLoading: false,
    });

    renderComponent();

    expect(screen.getByText('No exam attempts found')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search By Username or Email')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    (useAttempts as jest.Mock).mockReturnValue({
      data: { results: [], count: 0, numPages: 0 },
      isLoading: true,
    });

    renderComponent();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders attempts data', () => {
    (useAttempts as jest.Mock).mockReturnValue({
      data: mockExamAttempts,
      isLoading: false,
    });

    renderComponent();
    expect(screen.getByText(mockExamAttempts.results[0].user.username)).toBeInTheDocument();
    expect(screen.getByText(mockExamAttempts.results[0].examName)).toBeInTheDocument();
    expect(screen.getByText(mockExamAttempts.results[0].allowedTimeLimitMins.toString())).toBeInTheDocument();
    expect(screen.getByText(mockExamAttempts.results[0].examType)).toBeInTheDocument();
    expect(screen.getByText(/01\/01\/2024.*UTC/)).toBeInTheDocument();
    expect(screen.getByText(/01\/02\/2024.*UTC/)).toBeInTheDocument();
    expect(screen.getByText(mockExamAttempts.results[0].status)).toBeInTheDocument();
  });

  it('calls fetchData when filter changes', async () => {
    (useAttempts as jest.Mock).mockReturnValue({
      data: { results: [], count: 0, numPages: 0 },
      isLoading: false,
    });

    renderComponent();

    const input = screen.getByRole('textbox');
    const user = userEvent.setup();
    await user.type(input, 'testuser');

    await waitFor(() => {
      expect(useAttempts).toHaveBeenCalledWith(
        'course-v1:edX+Test+2024', expect.objectContaining({ emailOrUsername: 'testuser', page: 0, pageSize: ATTEMPTS_PAGE_SIZE }),
      );
    });
  });

  it('uses courseId from route params', () => {
    (useAttempts as jest.Mock).mockReturnValue({
      data: { results: [], count: 0, numPages: 0 },
      isLoading: false,
    });

    renderComponent();
    expect(useAttempts).toHaveBeenCalledWith('course-v1:edX+Test+2024', expect.any(Object));
  });

  describe('Resume option visibility', () => {
    beforeEach(() => {
      (useAttempts as jest.Mock).mockReturnValue({
        data: mockExamAttempts,
        isLoading: false,
      });
    });

    it('does not show Resume option when status is not "error"', async () => {
      renderComponent();

      const user = userEvent.setup();
      const actionsButton = screen.getAllByRole('button', { name: 'Actions' });
      await user.click(actionsButton[0]);

      expect(screen.queryByText('Resume')).not.toBeInTheDocument();
    });

    it('shows Resume option when status is "error" and readyToResume is false', async () => {
      renderComponent();

      const user = userEvent.setup();
      const actionsButton = screen.getAllByRole('button', { name: 'Actions' });
      await user.click(actionsButton[1]);

      expect(screen.getByText('Resume')).toBeInTheDocument();
    });

    it('does not show Resume option when readyToResume is true', async () => {
      renderComponent();

      const user = userEvent.setup();
      const actionsButton = screen.getAllByRole('button', { name: 'Actions' });
      await user.click(actionsButton[2]);

      expect(screen.queryByText('Resume')).not.toBeInTheDocument();
    });
  });
});
