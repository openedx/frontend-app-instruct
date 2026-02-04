import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import { DataDownloadTable } from './DataDownloadTable';
import { DownloadReportData } from '../types';

const mockData: DownloadReportData[] = [
  {
    dateGenerated: '2025-10-01T12:00:00Z',
    reportType: 'Type A',
    reportName: 'Test Report A',
    downloadLink: 'https://example.com/report-a.pdf',
  },
  {
    dateGenerated: '2025-10-02T12:00:00Z',
    reportType: 'Type B',
    reportName: 'Test Report B',
    downloadLink: 'https://example.com/report-b.pdf',
  },
];

const renderComponent = (props) => {
  return render(
    <IntlProvider locale="en">
      <DataDownloadTable {...props} />
    </IntlProvider>
  );
};

describe('DataDownloadTable', () => {
  const mockOnDownloadClick = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render table with data and handle download click', async () => {
    const user = userEvent.setup();
    renderComponent({ data: mockData, isLoading: false, onDownloadClick: mockOnDownloadClick });

    expect(screen.getByText('Date Generated')).toBeInTheDocument();
    expect(screen.getByText('Report Type')).toBeInTheDocument();
    expect(screen.getByText('Report Name')).toBeInTheDocument();

    expect(screen.getByText('2025-10-01T12:00:00Z')).toBeInTheDocument();
    expect(screen.getByText('Type A')).toBeInTheDocument();
    expect(screen.getByText('Test Report A')).toBeInTheDocument();

    const downloadButtons = screen.getAllByText('Download Report');
    expect(downloadButtons).toHaveLength(2);

    await user.click(downloadButtons[0]);
    expect(mockOnDownloadClick).toHaveBeenCalledWith('https://example.com/report-a.pdf');
  });

  it('should render loading state', () => {
    renderComponent({ data: [], isLoading: true, onDownloadClick: mockOnDownloadClick });

    expect(screen.getByText('Date Generated')).toBeInTheDocument();
    expect(screen.getByText('Report Type')).toBeInTheDocument();
    expect(screen.getByText('Report Name')).toBeInTheDocument();
  });

  it('should render empty table when no data provided', () => {
    renderComponent({ data: [], isLoading: false, onDownloadClick: mockOnDownloadClick });

    expect(screen.getByText('Date Generated')).toBeInTheDocument();
    expect(screen.getByText('Report Type')).toBeInTheDocument();
    expect(screen.getByText('Report Name')).toBeInTheDocument();
  });
});
