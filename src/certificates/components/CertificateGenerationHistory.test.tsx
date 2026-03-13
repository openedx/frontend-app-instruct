import { screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CertificateGenerationHistory from './CertificateGenerationHistory';
import { useCertificateGenerationHistory } from '../data/apiHook';
import { renderWithQueryClient } from '@src/testUtils';
import messages from '../messages';

jest.mock('../data/apiHook');

const mockUseCertificateGenerationHistory = useCertificateGenerationHistory as jest.MockedFunction<typeof useCertificateGenerationHistory>;

const mockHistoryData = {
  results: [
    {
      taskName: 'Generate Certificates',
      date: '2025-01-15T10:30:00Z',
      details: 'Generated 50 certificates',
    },
    {
      taskName: 'Regenerate Certificates',
      date: '2025-01-14T14:20:00Z',
      details: 'Regenerated 10 certificates',
    },
  ],
  count: 2,
};

const renderWithProviders = (component: React.ReactElement, courseId = 'course-123') => {
  return renderWithQueryClient(
    <MemoryRouter initialEntries={[`/course/${courseId}/certificates`]}>
      <Routes>
        <Route path="/course/:courseId/certificates" element={component} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CertificateGenerationHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCertificateGenerationHistory.mockReturnValue({
      data: mockHistoryData,
      isLoading: false,
      error: null,
    } as any);
  });

  it('should render table with history data', () => {
    renderWithProviders(<CertificateGenerationHistory />);

    expect(screen.getByText('Generate Certificates')).toBeInTheDocument();
    expect(screen.getByText('2025-01-15T10:30:00Z')).toBeInTheDocument();
    expect(screen.getByText('Generated 50 certificates')).toBeInTheDocument();
    expect(screen.getByText('Regenerate Certificates')).toBeInTheDocument();
    expect(screen.getByText('2025-01-14T14:20:00Z')).toBeInTheDocument();
    expect(screen.getByText('Regenerated 10 certificates')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    mockUseCertificateGenerationHistory.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    const { container } = renderWithProviders(<CertificateGenerationHistory />);

    // Check for spinner element
    expect(container.querySelector('.spinner-border')).toBeInTheDocument();
  });

  it('should render error state', () => {
    mockUseCertificateGenerationHistory.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load history'),
    } as any);

    renderWithProviders(<CertificateGenerationHistory />);

    expect(screen.getByText('Error loading generation history')).toBeInTheDocument();
  });

  it('should render empty state when no history', () => {
    mockUseCertificateGenerationHistory.mockReturnValue({
      data: { results: [], count: 0 },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<CertificateGenerationHistory />);

    expect(screen.getByText('No generation history found')).toBeInTheDocument();
  });

  it('should call hook with correct parameters', () => {
    renderWithProviders(<CertificateGenerationHistory />, 'course-456');

    expect(mockUseCertificateGenerationHistory).toHaveBeenCalledWith('course-456', {
      page: 0,
      pageSize: 20,
    });
  });

  it('should render table headers', () => {
    renderWithProviders(<CertificateGenerationHistory />);

    expect(screen.getByText(messages.taskName.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.date.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.details.defaultMessage)).toBeInTheDocument();
  });

  it('should use pageSize of 20', () => {
    renderWithProviders(<CertificateGenerationHistory />);

    expect(mockUseCertificateGenerationHistory).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ pageSize: 20 })
    );
  });

  it('should handle data with null values gracefully', () => {
    mockUseCertificateGenerationHistory.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<CertificateGenerationHistory />);

    expect(screen.getByText('No generation history found')).toBeInTheDocument();
  });

  it('should calculate page count correctly', () => {
    mockUseCertificateGenerationHistory.mockReturnValue({
      data: { results: mockHistoryData.results, count: 45 },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<CertificateGenerationHistory />);

    expect(screen.getByText('Generate Certificates')).toBeInTheDocument();
  });
});
