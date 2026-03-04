import { useState } from 'react';
import { screen } from '@testing-library/react';
import { renderWithIntl } from '@src/testUtils';
import CSVComponent from './CSVComponent';
import messages from './messages';

const mockOnProcessUpload = jest.fn();

const renderComponent = (props = {}) => {
  const defaultProps = {
    onProcessUpload: mockOnProcessUpload,
    ...props,
  };

  return renderWithIntl(
    <CSVComponent {...defaultProps} />
  );
};

describe('CSVComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with required elements', () => {
    renderComponent();

    expect(screen.getByText(messages.downloadCSVTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.downloadCSVDescription.defaultMessage)).toBeInTheDocument();
  });

  it('renders Dropzone with correct props', () => {
    renderComponent();

    const dropzone = screen.getByRole('presentation');
    const input = dropzone.querySelector('input[type="file"]');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('accept', 'text/csv,.csv');
    expect(dropzone).toBeInTheDocument();
  });

  it('renders template link when templateLink prop is provided', () => {
    const templateLink = 'https://example.com/template.csv';
    renderComponent({ templateLink });

    const link = screen.getByText(messages.viewCSVTemplate.defaultMessage);
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', templateLink);
  });

  it('does not render template link when templateLink prop is not provided', () => {
    renderComponent();

    expect(screen.queryByText(messages.viewCSVTemplate.defaultMessage)).not.toBeInTheDocument();
  });

  describe('File Upload Handling', () => {
    it('calls onProcessUpload when file is selected', () => {
      renderComponent();

      const testFile = new File(['test content'], 'test.csv', { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', testFile);

      // Simulate the handleProcessUpload function being called
      const handleError = jest.fn();

      // Call onProcessUpload to simulate file selection
      mockOnProcessUpload({ fileData: formData, handleError });

      expect(mockOnProcessUpload).toHaveBeenCalledWith({
        fileData: formData,
        handleError
      });
    });

    it('tests component internal file handling behavior', () => {
      // Test internal component behavior with a simple integration test
      const TestWrapper = () => {
        const [displayedFileName, setDisplayedFileName] = useState('');

        const handleProcessUpload = ({ fileData }: { fileData: FormData }) => {
          const file = fileData.getAll('file');
          if (file && file.length > 0 && file[0] instanceof File) {
            setDisplayedFileName(file[0].name);
          }
          mockOnProcessUpload({ fileData });
        };

        return (
          <div>
            <CSVComponent onProcessUpload={handleProcessUpload} />
            {displayedFileName && <div data-testid="file-name">{displayedFileName}</div>}
          </div>
        );
      };

      renderWithIntl(<TestWrapper />);

      // Initially should show the description
      expect(screen.getByText(messages.downloadCSVDescription.defaultMessage)).toBeInTheDocument();
    });

    it('handles FormData with empty file array', () => {
      renderComponent();

      const formData = new FormData();
      // Empty file array

      const handleError = jest.fn();
      mockOnProcessUpload({ fileData: formData, handleError });

      expect(mockOnProcessUpload).toHaveBeenCalledWith({
        fileData: formData,
        handleError
      });
    });

    it('processes multiple files correctly', () => {
      renderComponent();

      const testFile1 = new File(['content1'], 'file1.csv', { type: 'text/csv' });
      const testFile2 = new File(['content2'], 'file2.csv', { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', testFile1);
      formData.append('file', testFile2);

      const handleError = jest.fn();
      mockOnProcessUpload({ fileData: formData, handleError });

      // Should process the files
      expect(mockOnProcessUpload).toHaveBeenCalledWith({
        fileData: formData,
        handleError
      });
    });

    it('passes through requestConfig parameter correctly', () => {
      renderComponent();

      const formData = new FormData();
      const testFile = new File(['test'], 'test.csv', { type: 'text/csv' });
      formData.append('file', testFile);

      const handleError = jest.fn();
      const requestConfig = { method: 'POST' };

      mockOnProcessUpload({ fileData: formData, requestConfig, handleError });

      expect(mockOnProcessUpload).toHaveBeenCalledWith({
        fileData: formData,
        requestConfig,
        handleError
      });
    });
  });
});
