import { screen } from '@testing-library/react';
import { ReportNameCell } from './ReportNameCell';
import { renderWithIntl } from '@src/testUtils';

const createMockRow = (reportName: string | undefined = 'Test Report Name') => ({
  original: {
    dateGenerated: '2025-10-01T12:00:00Z',
    reportType: 'Type A',
    reportName,
    downloadLink: 'https://example.com/report.pdf',
  },
});

const renderComponent = (props) => renderWithIntl(<ReportNameCell {...props} />);

describe('ReportNameCell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with short name', async () => {
    const reportName = 'Test Report Name';
    const mockRow = createMockRow(reportName);

    renderComponent({ row: mockRow });
    const nameElement = screen.getByText(reportName);

    expect(nameElement).toBeInTheDocument();
    expect(nameElement).toHaveTextContent(reportName);
    expect(nameElement).toHaveAttribute('title', reportName);
  });

  it('should render with long report name and show full name in title attribute', async () => {
    const longReportName = 'Very Long Report Name That Should Be Truncated With Ellipsis Because It Exceeds The Maximum Width Of The Container Element And Should Show Full Text In Title';
    const mockRow = createMockRow(longReportName);

    renderComponent({ row: mockRow });

    const nameElement = screen.getByText(longReportName);
    expect(nameElement).toBeInTheDocument();
    expect(nameElement).toHaveTextContent(longReportName);
    expect(nameElement).toHaveAttribute('title', longReportName);
    expect(nameElement).toHaveClass('text-truncate');
  });
});
