import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CertificatesPage from './CertificatesPage';
import { renderWithAlertAndIntl } from '@src/testUtils';
import {
  useGrantBulkExceptions,
  useInstructorTasks,
  useInvalidateCertificate,
  useRemoveException,
  useRemoveInvalidation,
  useToggleCertificateGeneration,
} from './data/apiHook';
import messages from './messages';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('./data/apiHook');
jest.mock('./data/dummyData', () => ({
  dummyCertificateData: [
    {
      username: 'user1',
      email: 'user1@example.com',
      enrollmentTrack: 'verified',
      certificateStatus: 'downloadable',
      specialCase: '',
    },
  ],
}));

const mockUseInstructorTasks = useInstructorTasks as jest.MockedFunction<typeof useInstructorTasks>;
const mockUseGrantBulkExceptions = useGrantBulkExceptions as jest.MockedFunction<typeof useGrantBulkExceptions>;
const mockUseInvalidateCertificate = useInvalidateCertificate as jest.MockedFunction<typeof useInvalidateCertificate>;
const mockUseRemoveException = useRemoveException as jest.MockedFunction<typeof useRemoveException>;
const mockUseRemoveInvalidation = useRemoveInvalidation as jest.MockedFunction<typeof useRemoveInvalidation>;
const mockUseToggleCertificateGeneration = useToggleCertificateGeneration as jest.MockedFunction<typeof useToggleCertificateGeneration>;

describe('CertificatesPage', () => {
  const mockGrantExceptions = jest.fn();
  const mockInvalidateCert = jest.fn();
  const mockRemoveException = jest.fn();
  const mockRemoveInvalidation = jest.fn();
  const mockToggleGeneration = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseInstructorTasks.mockReturnValue({
      data: {
        results: [],
        count: 0,
        numPages: 0,
        next: null,
        previous: null,
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useInstructorTasks>);

    mockUseGrantBulkExceptions.mockReturnValue({
      mutate: mockGrantExceptions,
      isPending: false,
    } as unknown as ReturnType<typeof useGrantBulkExceptions>);

    mockUseInvalidateCertificate.mockReturnValue({
      mutate: mockInvalidateCert,
      isPending: false,
    } as unknown as ReturnType<typeof useInvalidateCertificate>);

    mockUseRemoveException.mockReturnValue({
      mutate: mockRemoveException,
    } as unknown as ReturnType<typeof useRemoveException>);

    mockUseRemoveInvalidation.mockReturnValue({
      mutate: mockRemoveInvalidation,
      isPending: false,
    } as unknown as ReturnType<typeof useRemoveInvalidation>);

    mockUseToggleCertificateGeneration.mockReturnValue({
      mutate: mockToggleGeneration,
      isPending: false,
    } as unknown as ReturnType<typeof useToggleCertificateGeneration>);
  });

  it('renders page with header and tabs', () => {
    renderWithAlertAndIntl(<CertificatesPage />);

    expect(screen.getByText(messages.issuedCertificatesTab.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.generationHistoryTab.defaultMessage)).toBeInTheDocument();
  });

  it('renders issued certificates tab by default', () => {
    renderWithAlertAndIntl(<CertificatesPage />);

    expect(screen.getByText(messages.issuedCertificatesTab.defaultMessage)).toBeInTheDocument();
  });

  it('switches to generation history tab', async () => {
    renderWithAlertAndIntl(<CertificatesPage />);
    const user = userEvent.setup();

    const historyTab = screen.getByText(messages.generationHistoryTab.defaultMessage);
    await user.click(historyTab);

    await waitFor(() => {
      expect(screen.getByText(messages.generationHistoryTab.defaultMessage)).toBeInTheDocument();
    });
  });

  it('renders page header with action buttons', () => {
    renderWithAlertAndIntl(<CertificatesPage />);

    expect(screen.getByText(messages.grantExceptionsButton.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.invalidateCertificateButton.defaultMessage)).toBeInTheDocument();
  });

  it('opens Grant Exceptions modal when button is clicked', async () => {
    renderWithAlertAndIntl(<CertificatesPage />);
    const user = userEvent.setup();

    const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
    await user.click(grantButton);

    await waitFor(() => {
      expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
    });
  });

  it('opens Invalidate Certificate modal when button is clicked', async () => {
    renderWithAlertAndIntl(<CertificatesPage />);
    const user = userEvent.setup();

    const invalidateButton = screen.getByText(messages.invalidateCertificateButton.defaultMessage);
    await user.click(invalidateButton);

    await waitFor(() => {
      expect(screen.getByText(messages.invalidateCertificateModalTitle.defaultMessage)).toBeInTheDocument();
    });
  });

  it('displays certificate data in table', () => {
    renderWithAlertAndIntl(<CertificatesPage />);

    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
  });

  it('fetches instructor tasks on mount', () => {
    renderWithAlertAndIntl(<CertificatesPage />);

    expect(mockUseInstructorTasks).toHaveBeenCalledWith(
      'course-v1:edX+Test+2024',
      { page: 0, pageSize: 25 }
    );
  });
});
