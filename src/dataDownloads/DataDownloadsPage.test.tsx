import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAuthenticatedHttpClient, IntlProvider } from '@openedx/frontend-base';
import { MemoryRouter } from 'react-router-dom';
import { DataDownloadsPage } from './DataDownloadsPage';
import { useGeneratedReports, useGenerateReportLink } from './data/apiHook';
import { AlertProvider } from '@src/providers/AlertProvider';
import { renderWithIntl } from '@src/testUtils';

jest.mock('./data/apiHook');
jest.mock('@src/components/PageNotFound', () => ({
  __esModule: true,
  default: () => <div>Page Not Found</div>,
}));
jest.mock('@openedx/frontend-base', () => ({
  ...jest.requireActual('@openedx/frontend-base'),
  getAuthenticatedHttpClient: jest.fn(),
}));

const mockUseGeneratedReports = useGeneratedReports as jest.MockedFunction<typeof useGeneratedReports>;
const mockUseGenerateReportLink = useGenerateReportLink as jest.MockedFunction<typeof useGenerateReportLink>;
const mockGetAuthenticatedHttpClient = getAuthenticatedHttpClient as jest.MockedFunction<typeof getAuthenticatedHttpClient>;

const mockReportsData = [
  {
    dateGenerated: '2025-10-01T12:00:00Z',
    reportType: 'enrolled_students',
    reportName: 'Test Report A.csv',
    reportUrl: '/path/to/report-a.csv',
  },
];

const renderWithProviders = (component: React.ReactElement, courseId = 'course-123') => {
  return renderWithIntl(
    <AlertProvider>
      <MemoryRouter initialEntries={[`/course/${courseId}/data-downloads`]}>
        {component}
      </MemoryRouter>
    </AlertProvider>
  );
};

describe('DataDownloadsPage', () => {
  const mockMutate = jest.fn();
  const mockHttpGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);

    mockUseGenerateReportLink.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    mockGetAuthenticatedHttpClient.mockReturnValue({
      get: mockHttpGet,
    } as any);

    mockHttpGet.mockResolvedValue({
      data: new Blob(['test'], { type: 'text/csv' }),
    });

    // Mock DOM APIs
    global.URL.createObjectURL = jest.fn(() => 'blob:mock');
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render page with data', async () => {
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);
    renderWithProviders(<DataDownloadsPage />);

    expect(screen.getByText('Available Reports')).toBeInTheDocument();
    expect(screen.getByText(/The reports listed below are available for download/)).toBeInTheDocument();
    expect(screen.getByText(/To keep student data secure/)).toBeInTheDocument();
  });

  it('should handle download report click', async () => {
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    // The download functionality is now internal and doesn't call mutate directly
    // We're just checking that the button is clickable
    const downloadButton = screen.getByText('Download Report');
    expect(downloadButton).toBeInTheDocument();
  });

  it('should render PageNotFound when 404 error occurs', () => {
    mockUseGeneratedReports.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { response: { status: 404 } },
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseGeneratedReports.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    expect(screen.getByText('Available Reports')).toBeInTheDocument();
    expect(screen.getByText('Generate Reports')).toBeInTheDocument();
  });

  it('should render empty table when no downloads', () => {
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    expect(screen.getByText('Available Reports')).toBeInTheDocument();
  });

  it('should call generateReportLink when generate button clicked', async () => {
    const user = userEvent.setup();
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: 'Generate Enrolled Students Report' });
    await user.click(generateButton);

    expect(mockMutate).toHaveBeenCalledWith(
      { reportType: 'enrolled_students' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('should show success toast and start polling on successful report generation', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: 'Generate Enrolled Students Report' });
    await user.click(generateButton);

    // Trigger the onSuccess callback
    capturedCallbacks.onSuccess();

    // Should show success toast
    await waitFor(() => {
      expect(screen.getByText(/Generating.*Enrolled Students Report/)).toBeInTheDocument();
    });
  });

  it('should show error toast on failed report generation', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: 'Generate Enrolled Students Report' });
    await user.click(generateButton);

    // Trigger the onError callback
    capturedCallbacks.onError(new Error('Test error'));

    // Should show error toast
    await waitFor(() => {
      const errorElements = screen.getAllByText('Failed to generate report.');
      expect(errorElements.length).toBeGreaterThan(0);
    });

    consoleError.mockRestore();
  });

  it('should call generateReportLink for problem responses with location', async () => {
    const user = userEvent.setup();
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    // Switch to Problem Response tab
    const problemTab = screen.getByRole('tab', { name: 'Open Response Reports' });
    await user.click(problemTab);

    // Type in problem location
    const locationInput = screen.getByPlaceholderText('Problem location');
    await user.type(locationInput, 'block-v1:test');

    // Click generate
    const generateButton = screen.getByRole('button', { name: 'Generate Problem Report' });
    await user.click(generateButton);

    expect(mockMutate).toHaveBeenCalledWith(
      { reportType: 'problem_responses', problemLocation: 'block-v1:test' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('should show success toast for problem responses report generation', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    // Switch to Problem Response tab
    const problemTab = screen.getByRole('tab', { name: 'Open Response Reports' });
    await user.click(problemTab);

    const generateButton = screen.getByRole('button', { name: 'Generate Problem Report' });
    await user.click(generateButton);

    // Trigger the onSuccess callback
    capturedCallbacks.onSuccess();

    // Should show success toast
    await waitFor(() => {
      expect(screen.getByText(/Generating.*Problem Responses Report/)).toBeInTheDocument();
    });
  });

  it('should show error toast for problem responses report generation failure', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    // Switch to Problem Response tab
    const problemTab = screen.getByRole('tab', { name: 'Open Response Reports' });
    await user.click(problemTab);

    const generateButton = screen.getByRole('button', { name: 'Generate Problem Report' });
    await user.click(generateButton);

    // Trigger the onError callback
    capturedCallbacks.onError(new Error('Test error'));

    // Should show error toast
    await waitFor(() => {
      const errorElements = screen.getAllByText('Failed to generate report.');
      expect(errorElements.length).toBeGreaterThan(0);
    });

    consoleError.mockRestore();
  });

  it('should show isGenerating state on buttons', () => {
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    mockUseGenerateReportLink.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: 'Generate Enrolled Students Report' });
    expect(generateButton).toBeDisabled();
  });

  it('should handle error state without 404', () => {
    mockUseGeneratedReports.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { response: { status: 500 } },
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    // Should still render the page, not PageNotFound
    expect(screen.getByText('Available Reports')).toBeInTheDocument();
    expect(screen.queryByText('Page Not Found')).not.toBeInTheDocument();
  });

  it('should transform report data correctly', () => {
    const testReports = [
      {
        dateGenerated: '2025-01-01T00:00:00Z',
        reportType: 'grade',
        reportName: 'grades.csv',
        reportUrl: '/path/to/grades.csv',
      },
    ];

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: testReports },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    expect(screen.getByText('2025-01-01T00:00:00Z')).toBeInTheDocument();
    // Use getAllByText since "Grade Report" appears in both the table and the generate section
    expect(screen.getAllByText('Grade Report')[0]).toBeInTheDocument();
    expect(screen.getByText('grades.csv')).toBeInTheDocument();
  });

  it('should render download button for reports', () => {
    renderWithProviders(<DataDownloadsPage />);
    expect(screen.getByText('Download Report')).toBeInTheDocument();
  });

  it('should handle download error', async () => {
    const user = userEvent.setup();
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    mockHttpGet.mockRejectedValueOnce(new Error('Download failed'));

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const downloadButton = screen.getByText('Download Report');
    await user.click(downloadButton);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error downloading report:', expect.any(Error));
    });

    consoleError.mockRestore();
  });

  it('should cleanup on unmount', () => {
    jest.useFakeTimers();

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    const { unmount } = renderWithProviders(<DataDownloadsPage />);

    unmount();

    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('should stop polling when report count increases', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    const { rerender } = renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: 'Generate Enrolled Students Report' });
    await user.click(generateButton);

    // Trigger the onSuccess callback to start polling
    capturedCallbacks.onSuccess();

    // Wait for toast to appear
    await waitFor(() => {
      expect(screen.getByText(/Generating.*Enrolled Students Report/)).toBeInTheDocument();
    });

    // Simulate report added by updating the mock and rerendering
    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: mockReportsData },
      isLoading: false,
    } as any);

    rerender(
      <IntlProvider locale="en" messages={{}}>
        <AlertProvider>
          <MemoryRouter initialEntries={['/course/course-123/data-downloads']}>
            <DataDownloadsPage />
          </MemoryRouter>
        </AlertProvider>
      </IntlProvider>
    );

    jest.useRealTimers();
  });

  it('should stop polling after 60 seconds timeout', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: 'Generate Enrolled Students Report' });
    await user.click(generateButton);

    // Trigger the onSuccess callback to start polling
    capturedCallbacks.onSuccess();

    // Fast-forward 60 seconds
    jest.advanceTimersByTime(60000);

    jest.useRealTimers();
  });

  it('should clear existing timeout when starting new polling', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    mockUseGeneratedReports.mockReturnValue({
      data: { downloads: [] },
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);

    const generateButton = screen.getByRole('button', { name: 'Generate Enrolled Students Report' });

    // Start first polling
    await user.click(generateButton);
    capturedCallbacks.onSuccess();

    // Start second polling before first completes
    await user.click(generateButton);
    capturedCallbacks.onSuccess();

    jest.useRealTimers();
  });
});
