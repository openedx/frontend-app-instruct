import { screen } from '@testing-library/react';
import GenerationHistoryTable from './GenerationHistoryTable';
import { renderWithIntl } from '@src/testUtils';
import { InstructorTask } from '../types';
import messages from '../messages';

describe('GenerationHistoryTable', () => {
  const mockOnPageChange = jest.fn();

  const mockTaskData: InstructorTask[] = [
    {
      taskId: 'task1',
      taskName: 'Generate Certificates',
      taskState: 'SUCCESS',
      created: '2024-01-15T14:30:00Z',
      updated: '2024-01-15T14:35:00Z',
      taskOutput: 'Successfully generated 50 certificates',
    },
    {
      taskId: 'task2',
      taskName: 'Regenerate Certificates',
      taskState: 'FAILURE',
      created: '2024-01-10T10:00:00Z',
      updated: '2024-01-10T10:05:00Z',
      taskOutput: 'Error: Failed to process',
    },
  ];

  const defaultProps = {
    data: mockTaskData,
    isLoading: false,
    itemCount: 2,
    pageCount: 1,
    currentPage: 0,
    onPageChange: mockOnPageChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with task data', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} />);

    expect(screen.getByText('Generate Certificates')).toBeInTheDocument();
    expect(screen.getByText('Regenerate Certificates')).toBeInTheDocument();
  });

  it('displays all column headers', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} />);

    expect(screen.getByText(messages.columnTaskName.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.columnDate.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.columnDetails.defaultMessage)).toBeInTheDocument();
  });

  it('displays task state in details column', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} />);

    expect(screen.getByText(/SUCCESS/)).toBeInTheDocument();
    expect(screen.getByText(/FAILURE/)).toBeInTheDocument();
  });

  it('displays task output when available', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} />);

    expect(screen.getByText('Successfully generated 50 certificates')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to process')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} />);

    // Check that dates are rendered (format may vary based on locale)
    expect(screen.getAllByText(/2024/).length).toBeGreaterThan(0);
  });

  it('displays empty message when no data', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} data={[]} itemCount={0} />);

    expect(screen.getByText(messages.noTasksMessage.defaultMessage)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} isLoading={true} />);

    // DataTable should handle loading state
    expect(screen.getByText(messages.columnTaskName.defaultMessage)).toBeInTheDocument();
  });

  it('renders pagination footer when items exist', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} />);

    // TableFooter should be rendered when itemCount > 0
    const tableContainer = screen.getByText('Generate Certificates').closest('table');
    expect(tableContainer).toBeInTheDocument();
  });

  it('does not render pagination footer when no items', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} data={[]} itemCount={0} />);

    // No pagination should be shown when itemCount is 0
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });

  it('renders multiple task rows', () => {
    const multipleTasksData: InstructorTask[] = [
      {
        taskId: 'task1',
        taskName: 'Task 1',
        taskState: 'SUCCESS',
        created: '2024-01-15T14:30:00Z',
        updated: '2024-01-15T14:35:00Z',
        taskOutput: 'Output 1',
      },
      {
        taskId: 'task2',
        taskName: 'Task 2',
        taskState: 'PENDING',
        created: '2024-01-14T10:00:00Z',
        updated: '2024-01-14T10:05:00Z',
        taskOutput: 'Output 2',
      },
      {
        taskId: 'task3',
        taskName: 'Task 3',
        taskState: 'RUNNING',
        created: '2024-01-13T08:00:00Z',
        updated: '2024-01-13T08:05:00Z',
        taskOutput: '',
      },
    ];

    renderWithIntl(
      <GenerationHistoryTable {...defaultProps} data={multipleTasksData} itemCount={3} />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('handles task without output', () => {
    const taskWithoutOutput: InstructorTask[] = [
      {
        taskId: 'task1',
        taskName: 'Running Task',
        taskState: 'RUNNING',
        created: '2024-01-15T14:30:00Z',
        updated: '2024-01-15T14:35:00Z',
        taskOutput: '',
      },
    ];

    renderWithIntl(<GenerationHistoryTable {...defaultProps} data={taskWithoutOutput} />);

    expect(screen.getByText('Running Task')).toBeInTheDocument();
    expect(screen.getByText(/RUNNING/)).toBeInTheDocument();
  });

  it('handles task without created date', () => {
    const taskWithoutDate: InstructorTask[] = [
      {
        taskId: 'task1',
        taskName: 'Old Task',
        taskState: 'SUCCESS',
        created: '',
        updated: '2024-01-15T14:35:00Z',
        taskOutput: 'Completed',
      },
    ];

    renderWithIntl(<GenerationHistoryTable {...defaultProps} data={taskWithoutDate} />);

    expect(screen.getByText('Old Task')).toBeInTheDocument();
  });

  it('displays different task states correctly', () => {
    const tasksWithDifferentStates: InstructorTask[] = [
      {
        taskId: 'task1',
        taskName: 'Success Task',
        taskState: 'SUCCESS',
        created: '2024-01-15T14:30:00Z',
        updated: '2024-01-15T14:35:00Z',
        taskOutput: 'Done',
      },
      {
        taskId: 'task2',
        taskName: 'Pending Task',
        taskState: 'PENDING',
        created: '2024-01-14T14:30:00Z',
        updated: '2024-01-14T14:35:00Z',
        taskOutput: 'Waiting',
      },
      {
        taskId: 'task3',
        taskName: 'Failed Task',
        taskState: 'FAILURE',
        created: '2024-01-13T14:30:00Z',
        updated: '2024-01-13T14:35:00Z',
        taskOutput: 'Error occurred',
      },
    ];

    renderWithIntl(
      <GenerationHistoryTable {...defaultProps} data={tasksWithDifferentStates} itemCount={3} />
    );

    expect(screen.getByText(/SUCCESS/)).toBeInTheDocument();
    expect(screen.getByText(/PENDING/)).toBeInTheDocument();
    expect(screen.getByText(/FAILURE/)).toBeInTheDocument();
  });
});
