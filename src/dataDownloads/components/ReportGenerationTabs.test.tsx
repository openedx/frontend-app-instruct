import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ReportGenerationTabs } from './ReportGenerationTabs';
import { useTriggerReportGeneration } from '../data/apiHook';
import { renderWithProviders } from '../../testUtils';

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock the hooks
jest.mock('../data/apiHook');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:Example+Course+2023' }),
}));

// Mock the report tabs constant
jest.mock('../constants', () => ({
  REPORTS_TABS: [
    {
      key: 'enrollment',
      title: { id: 'enrollment.title', defaultMessage: 'Enrollment Reports' },
      reports: [
        {
          reportKey: 'enrolled_students',
          reportName: { id: 'enrollment.enrolled', defaultMessage: 'Enrolled Students' },
          reportDescription: { id: 'enrollment.enrolled.desc', defaultMessage: 'Generate enrolled students report' },
          buttonText: { id: 'enrollment.enrolled.button', defaultMessage: 'Generate Report' },
        },
        {
          reportKey: 'unenrolled_students',
          reportName: { id: 'enrollment.unenrolled', defaultMessage: 'Unenrolled Students' },
          reportDescription: { id: 'enrollment.unenrolled.desc', defaultMessage: 'Generate unenrolled students report' },
          buttonText: { id: 'enrollment.unenrolled.button', defaultMessage: 'Generate Report' },
          customAction: () => <button>Custom Action</button>,
        },
      ],
    },
    {
      key: 'grades',
      title: { id: 'grades.title', defaultMessage: 'Grade Reports' },
      reports: [
        {
          reportKey: 'grade_export',
          reportName: { id: 'grades.export', defaultMessage: 'Grade Export' },
          reportDescription: { id: 'grades.export.desc', defaultMessage: 'Export all grades' },
          buttonText: { id: 'grades.export.button', defaultMessage: 'Export Grades' },
        },
      ],
    },
  ],
}));

const mockUseTriggerReportGeneration = useTriggerReportGeneration as jest.MockedFunction<typeof useTriggerReportGeneration>;

describe('ReportGenerationTabs', () => {
  let user: ReturnType<typeof userEvent.setup>;
  const mockTriggerReportGeneration = jest.fn();

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();

    mockUseTriggerReportGeneration.mockReturnValue({
      mutate: mockTriggerReportGeneration,
      isPending: false,
    } as any);
  });

  it('should render all tabs with correct titles', () => {
    renderWithProviders(<ReportGenerationTabs />);

    expect(screen.getByText('Enrollment Reports')).toBeInTheDocument();
    expect(screen.getByText('Grade Reports')).toBeInTheDocument();
  });

  it('should render report cards in the first tab by default', () => {
    renderWithProviders(<ReportGenerationTabs />);

    expect(screen.getByText('Enrolled Students')).toBeInTheDocument();
    expect(screen.getByText('Generate enrolled students report')).toBeInTheDocument();
    expect(screen.getByText('Unenrolled Students')).toBeInTheDocument();
  });

  it('should switch between tabs and show different reports', async () => {
    renderWithProviders(<ReportGenerationTabs />);

    // Initially in enrollment tab
    expect(screen.getByText('Enrolled Students')).toBeInTheDocument();

    // Click on grades tab
    await user.click(screen.getByText('Grade Reports'));

    expect(screen.getByText('Grade Export')).toBeInTheDocument();
    expect(screen.getByText('Export all grades')).toBeInTheDocument();
  });

  it('should disable buttons when reports are being generated', () => {
    mockUseTriggerReportGeneration.mockReturnValue({
      mutate: mockTriggerReportGeneration,
      isPending: true,
    } as any);

    renderWithProviders(<ReportGenerationTabs />);

    const generateButtons = screen.getAllByRole('button', { name: 'Generate Report' });
    generateButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });
});
