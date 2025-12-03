import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataDownloadsPage } from './DataDownloadsPage';
import { useGeneratedReports, useGenerateReportLink } from './data/apiHook';
import { renderWithProviders } from '../testUtils';

jest.mock('./data/apiHook');

const mockUseGeneratedReports = useGeneratedReports as jest.MockedFunction<typeof useGeneratedReports>;
const mockUseGenerateReportLink = useGenerateReportLink as jest.MockedFunction<typeof useGenerateReportLink>;

const mockReportsData = [
  {
    dateGenerated: '2025-10-01T12:00:00Z',
    reportType: 'Type A',
    reportName: 'Test Report A',
    downloadLink: 'https://example.com/report-a',
  },
];

describe('DataDownloadsPage', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGenerateReportLink.mockReturnValue({
      mutate: mockMutate,
    } as any);
  });

  it('should render page with data', async () => {
    mockUseGeneratedReports.mockReturnValue({
      data: mockReportsData,
      isLoading: false,
    } as any);
    renderWithProviders(<DataDownloadsPage />);

    expect(screen.getByText('Available Reports')).toBeInTheDocument();
    expect(screen.getByText(/The reports listed below are available for download/)).toBeInTheDocument();
    expect(screen.getByText(/To keep student data secure/)).toBeInTheDocument();
  });

  it('should handle download report click', async () => {
    const user = userEvent.setup();
    mockUseGeneratedReports.mockReturnValue({
      data: mockReportsData,
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    await user.click(screen.getByText('Download Report'));
    expect(mockMutate).toHaveBeenCalledWith('https://example.com/report-a');
  });

  it('should render pending tasks', async () => {
    mockUseGeneratedReports.mockReturnValue({
      data: mockReportsData,
      isLoading: false,
    } as any);

    renderWithProviders(<DataDownloadsPage />);
    const pendingTasks = screen.getByText('Pending Tasks');
    expect(pendingTasks).toBeInTheDocument();
  });
});
