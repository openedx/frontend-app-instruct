import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CertificatesPage from './CertificatesPage';
import { useCertificateConfig } from './data/apiHook';
import { renderWithQueryClient } from '@src/testUtils';
import messages from './messages';

jest.mock('./data/apiHook');
jest.mock('./components/IssuedCertificates', () => ({
  __esModule: true,
  default: () => <div>Issued Certificates Component</div>,
}));
jest.mock('./components/CertificateGenerationHistory', () => ({
  __esModule: true,
  default: () => <div>Certificate Generation History Component</div>,
}));
jest.mock('@src/components/PageNotFound', () => ({
  __esModule: true,
  default: () => <div>Page Not Found</div>,
}));

const mockUseCertificateConfig = useCertificateConfig as jest.MockedFunction<typeof useCertificateConfig>;

const renderWithProviders = (component: React.ReactElement, courseId = 'course-123') => {
  return renderWithQueryClient(
    <MemoryRouter initialEntries={[`/course/${courseId}/certificates`]}>
      <Routes>
        <Route path="/course/:courseId/certificates" element={component} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CertificatesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCertificateConfig.mockReturnValue({
      data: { enabled: true },
      isLoading: false,
      error: null,
    } as any);
  });

  it('should render page with title and tabs', () => {
    renderWithProviders(<CertificatesPage />);

    expect(screen.getByText(messages.certificatesTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: messages.issuedCertificatesTab.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: messages.generationHistoryTab.defaultMessage })).toBeInTheDocument();
  });

  it('should render IssuedCertificates component by default', () => {
    renderWithProviders(<CertificatesPage />);

    expect(screen.getByText('Issued Certificates Component')).toBeInTheDocument();
  });

  it('should switch to generation history tab', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CertificatesPage />);

    const historyTab = screen.getByRole('tab', { name: messages.generationHistoryTab.defaultMessage });
    await user.click(historyTab);

    expect(screen.getByText('Certificate Generation History Component')).toBeInTheDocument();
  });

  it('should switch back to issued certificates tab', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CertificatesPage />);

    const historyTab = screen.getByRole('tab', { name: messages.generationHistoryTab.defaultMessage });
    await user.click(historyTab);

    const issuedTab = screen.getByRole('tab', { name: messages.issuedCertificatesTab.defaultMessage });
    await user.click(issuedTab);

    expect(screen.getByText('Issued Certificates Component')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    mockUseCertificateConfig.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    const { container } = renderWithProviders(<CertificatesPage />);

    // Check for spinner element
    expect(container.querySelector('.spinner-border')).toBeInTheDocument();
  });

  it('should render PageNotFound when certificates are not enabled', () => {
    mockUseCertificateConfig.mockReturnValue({
      data: { enabled: false },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<CertificatesPage />);

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should render PageNotFound when 404 error occurs', () => {
    mockUseCertificateConfig.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { response: { status: 404 } },
    } as any);

    renderWithProviders(<CertificatesPage />);

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should not render PageNotFound for non-404 errors', () => {
    mockUseCertificateConfig.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { response: { status: 500 } },
    } as any);

    renderWithProviders(<CertificatesPage />);

    expect(screen.queryByText('Page Not Found')).not.toBeInTheDocument();
  });

  it('should call useCertificateConfig with correct courseId', () => {
    renderWithProviders(<CertificatesPage />, 'course-456');

    expect(mockUseCertificateConfig).toHaveBeenCalledWith('course-456');
  });

  it('should maintain active tab state when switching tabs', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CertificatesPage />);

    const issuedTab = screen.getByRole('tab', { name: messages.issuedCertificatesTab.defaultMessage });
    expect(issuedTab).toHaveAttribute('aria-selected', 'true');

    const historyTab = screen.getByRole('tab', { name: messages.generationHistoryTab.defaultMessage });
    expect(historyTab).toHaveAttribute('aria-selected', 'false');

    await user.click(historyTab);

    await waitFor(() => {
      expect(historyTab).toHaveAttribute('aria-selected', 'true');
      expect(issuedTab).toHaveAttribute('aria-selected', 'false');
    });
  });


  it('should render certificates page when config is enabled', () => {
    mockUseCertificateConfig.mockReturnValue({
      data: { enabled: true },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<CertificatesPage />);

    expect(screen.getByText(messages.certificatesTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.queryByText('Page Not Found')).not.toBeInTheDocument();
  });

  it('should not render page content while loading', () => {
    mockUseCertificateConfig.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<CertificatesPage />);

    expect(screen.queryByText(messages.certificatesTitle.defaultMessage)).not.toBeInTheDocument();
    expect(screen.queryByText('Issued Certificates Component')).not.toBeInTheDocument();
  });

  it('should handle error without response object', () => {
    mockUseCertificateConfig.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
    } as any);

    renderWithProviders(<CertificatesPage />);

    expect(screen.queryByText('Page Not Found')).not.toBeInTheDocument();
  });

  it('should render both tabs simultaneously', () => {
    renderWithProviders(<CertificatesPage />);

    const issuedTab = screen.getByRole('tab', { name: messages.issuedCertificatesTab.defaultMessage });
    const historyTab = screen.getByRole('tab', { name: messages.generationHistoryTab.defaultMessage });

    expect(issuedTab).toBeInTheDocument();
    expect(historyTab).toBeInTheDocument();
  });
});
