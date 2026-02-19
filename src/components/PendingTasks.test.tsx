import { screen } from '@testing-library/react';
import { PendingTasks } from './PendingTasks';
import { usePendingTasks } from '@src/data/apiHook';
import { renderWithQueryClient } from '@src/testUtils';

jest.mock('@src/data/apiHook');

const mockUsePendingTasks = usePendingTasks as jest.MockedFunction<typeof usePendingTasks>;

describe('PendingTasks', () => {
  const mockFetchTasks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePendingTasks.mockReturnValue({
      data: undefined,
      isPending: false,
      isLoading: false,
    } as any);
  });

  it('should render the collapsible pending tasks section', () => {
    renderWithQueryClient(<PendingTasks />);

    expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show loading skeleton when tasks are being fetched', async () => {
    mockUsePendingTasks.mockReturnValue({
      data: undefined,
      isPending: true,
      isLoading: true,
    } as any);

    const { container } = renderWithQueryClient(<PendingTasks />);
    const toggleButton = screen.getByRole('button');
    await toggleButton.click();

    expect(screen.queryByText('No tasks currently running.')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByText('Task Type')).not.toBeInTheDocument();

    const skeletons = container.querySelectorAll('.react-loading-skeleton');
    expect(skeletons).toHaveLength(3);
  });

  it('should display no tasks message when tasks array is empty', async () => {
    mockUsePendingTasks.mockReturnValue({
      mutate: mockFetchTasks,
      data: [],
      isPending: false,
    } as any);

    renderWithQueryClient(<PendingTasks />);
    const toggleButton = screen.getByRole('button');
    await toggleButton.click();

    expect(screen.getByText('No tasks currently running.')).toBeInTheDocument();
  });

  it('should render data table with tasks when data is available', async () => {
    const mockTasks = [
      {
        taskType: 'grade_course',
        taskInput: 'course data',
        taskId: '12345',
        requester: 'instructor@example.com',
        taskState: 'SUCCESS',
        created: '2023-01-01',
        taskOutput: 'output.csv',
        duration: '5 minutes',
        status: 'Completed',
        taskMessage: 'Task completed successfully',
      },
    ];

    mockUsePendingTasks.mockReturnValue({
      data: mockTasks,
      isPending: false,
      isLoading: false,
    } as any);

    renderWithQueryClient(<PendingTasks />);
    const toggleButton = screen.getByRole('button');
    await toggleButton.click();

    expect(screen.getByText('Task Type')).toBeInTheDocument();
    expect(screen.getByText('Task ID')).toBeInTheDocument();
    expect(screen.getByText('grade_course')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('should fetch tasks on component mount', async () => {
    renderWithQueryClient(<PendingTasks />);
    expect(mockUsePendingTasks).toHaveBeenCalledTimes(1);
  });
});
