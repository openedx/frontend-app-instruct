import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataDownloadTable } from './DataDownloadTable';
import { DownloadReportData } from '@src/dataDownloads/types';
import { renderWithIntl } from '@src/testUtils';
import messages from '@src/dataDownloads/messages';

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

const renderComponent = (props) => renderWithIntl(<DataDownloadTable {...props} />);

describe('DataDownloadTable', () => {
  const mockOnDownloadClick = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render table with data and handle download click', async () => {
    const user = userEvent.setup();
    renderComponent({ data: mockData, isLoading: false, onDownloadClick: mockOnDownloadClick });

    expect(screen.getByText(messages.dateGeneratedColumnName.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.reportTypeColumnName.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.reportNameColumnName.defaultMessage)).toBeInTheDocument();

    expect(screen.getByText(mockData[0].dateGenerated)).toBeInTheDocument();
    expect(screen.getByText(mockData[0].reportType)).toBeInTheDocument();
    expect(screen.getByText(mockData[0].reportName)).toBeInTheDocument();

    const downloadButtons = screen.getAllByText(messages.downloadLinkLabel.defaultMessage);
    expect(downloadButtons).toHaveLength(mockData.length);

    await user.click(downloadButtons[0]);
    expect(mockOnDownloadClick).toHaveBeenCalledWith(mockData[0].downloadLink, mockData[0].reportName);
  });

  it('should render loading state', () => {
    renderComponent({ data: [], isLoading: true, onDownloadClick: mockOnDownloadClick });

    expect(screen.getByText(messages.dateGeneratedColumnName.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.reportTypeColumnName.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.reportNameColumnName.defaultMessage)).toBeInTheDocument();
  });

  it('should render empty table when no data provided', () => {
    renderComponent({ data: [], isLoading: false, onDownloadClick: mockOnDownloadClick });

    expect(screen.getByText(messages.dateGeneratedColumnName.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.reportTypeColumnName.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.reportNameColumnName.defaultMessage)).toBeInTheDocument();
  });

  it('should render pagination footer when data exceeds page size', () => {
    const manyReports: DownloadReportData[] = Array.from({ length: 11 }, (_, i) => ({
      dateGenerated: `2025-10-0${(i % 9) + 1}T12:00:00Z`,
      reportType: `Type ${i}`,
      reportName: `Report ${i}`,
      downloadLink: `https://example.com/report-${i}.pdf`,
    }));

    renderComponent({ data: manyReports, isLoading: false, onDownloadClick: mockOnDownloadClick });

    // With 11 items and page size of 10, pageCount > 1 so footer with pagination should render
    const navElements = screen.getAllByRole('navigation');
    expect(navElements.length).toBeGreaterThan(0);
  });
});
