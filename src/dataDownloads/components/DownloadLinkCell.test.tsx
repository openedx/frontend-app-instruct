import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DownloadLinkCell } from './DownloadLinkCell';
import { renderWithIntl } from '@src/testUtils';
import messages from '@src/dataDownloads/messages';

const mockOnDownloadClick = jest.fn();

const createMockRow = (downloadLink: string | undefined) => ({
  original: {
    dateGenerated: '2025-10-01T12:00:00Z',
    reportType: 'Type A',
    reportName: 'Test Report',
    downloadLink,
  },
});

const renderComponent = (props) => renderWithIntl(<DownloadLinkCell {...props} />);

describe('DownloadLinkCell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render download button and handle click with valid download link', async () => {
    const user = userEvent.setup();
    const downloadLink = 'https://example.com/report.pdf';
    const mockRow = createMockRow(downloadLink);

    renderComponent({ row: mockRow, onDownloadClick: mockOnDownloadClick });

    const button = screen.getByRole('button', { name: messages.downloadLinkLabel.defaultMessage });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(mockOnDownloadClick).toHaveBeenCalledWith(downloadLink, mockRow.original.reportName);
  });

  it('should handle click with empty download link when downloadLink is undefined', async () => {
    const user = userEvent.setup();
    const mockRow = createMockRow(undefined);

    renderComponent({ row: mockRow, onDownloadClick: mockOnDownloadClick });

    const button = screen.getByRole('button', { name: messages.downloadLinkLabel.defaultMessage });
    await user.click(button);

    expect(mockOnDownloadClick).toHaveBeenCalledWith('', mockRow.original.reportName);
  });

  it('should handle click with empty download link when original is undefined', async () => {
    const user = userEvent.setup();
    const mockRow = { original: undefined };

    renderComponent({ row: mockRow, onDownloadClick: mockOnDownloadClick });

    const button = screen.getByRole('button', { name: messages.downloadLinkLabel.defaultMessage });
    await user.click(button);

    expect(mockOnDownloadClick).toHaveBeenCalledWith('', '');
  });
});
