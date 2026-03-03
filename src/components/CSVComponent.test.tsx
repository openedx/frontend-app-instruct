import { screen } from '@testing-library/react';
import CSVComponent from './CSVComponent';
import messages from './messages';
import { renderWithIntl } from '@src/testUtils';

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
});
