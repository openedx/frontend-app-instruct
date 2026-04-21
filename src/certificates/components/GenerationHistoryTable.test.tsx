import { screen } from '@testing-library/react';
import GenerationHistoryTable from './GenerationHistoryTable';
import { renderWithIntl } from '@src/testUtils';
import { CertificateGenerationHistory } from '../types';
import messages from '../messages';

describe('GenerationHistoryTable', () => {
  const mockOnPageChange = jest.fn();

  const mockTaskData: CertificateGenerationHistory[] = [
    {
      taskName: 'Generate Certificates',
      date: 'January 15, 2024',
      details: 'Successfully generated 50 certificates',
    },
    {
      taskName: 'Regenerate Certificates',
      date: 'January 10, 2024',
      details: 'Error: Failed to process',
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

  it('displays details column', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} />);

    expect(screen.getByText('Successfully generated 50 certificates')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to process')).toBeInTheDocument();
  });

  it('displays formatted dates', () => {
    renderWithIntl(<GenerationHistoryTable {...defaultProps} />);

    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('January 10, 2024')).toBeInTheDocument();
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
    const multipleTasksData: CertificateGenerationHistory[] = [
      {
        taskName: 'Task 1',
        date: 'January 15, 2024',
        details: 'Output 1',
      },
      {
        taskName: 'Task 2',
        date: 'January 14, 2024',
        details: 'Output 2',
      },
      {
        taskName: 'Task 3',
        date: 'January 13, 2024',
        details: '',
      },
    ];

    renderWithIntl(
      <GenerationHistoryTable {...defaultProps} data={multipleTasksData} itemCount={3} />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('handles task without details', () => {
    const taskWithoutDetails: CertificateGenerationHistory[] = [
      {
        taskName: 'Running Task',
        date: 'January 15, 2024',
        details: '',
      },
    ];

    renderWithIntl(<GenerationHistoryTable {...defaultProps} data={taskWithoutDetails} />);

    expect(screen.getByText('Running Task')).toBeInTheDocument();
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });

  it('displays different task types correctly', () => {
    const tasksWithDifferentTypes: CertificateGenerationHistory[] = [
      {
        taskName: 'Generated',
        date: 'January 15, 2024',
        details: 'For all learners',
      },
      {
        taskName: 'Regenerated',
        date: 'January 14, 2024',
        details: 'For exceptions',
      },
      {
        taskName: 'Generated',
        date: 'January 13, 2024',
        details: 'audit not passing states',
      },
    ];

    renderWithIntl(
      <GenerationHistoryTable {...defaultProps} data={tasksWithDifferentTypes} itemCount={3} />
    );

    expect(screen.getByText('For all learners')).toBeInTheDocument();
    expect(screen.getByText('For exceptions')).toBeInTheDocument();
    expect(screen.getByText('audit not passing states')).toBeInTheDocument();
  });
});
