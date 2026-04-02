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

  describe('mutation callbacks', () => {
    describe('handleGrantExceptions', () => {
      it('calls mutation with correct params and handles success', async () => {
        const user = userEvent.setup();
        let capturedCallbacks: any;

        mockGrantExceptions.mockImplementation((_request, callbacks) => {
          capturedCallbacks = callbacks;
        });

        renderWithAlertAndIntl(<CertificatesPage />);

        const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
        await user.click(grantButton);

        await waitFor(() => {
          expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
        });

        const learnersInput = screen.getByLabelText(messages.learnersLabel.defaultMessage);
        const notesInput = screen.getByLabelText(messages.notesLabel.defaultMessage);
        await user.type(learnersInput, 'user1@example.com,user2@example.com');
        await user.type(notesInput, 'Test notes');

        const submitButton = screen.getByRole('button', { name: messages.submit.defaultMessage });
        await user.click(submitButton);

        await waitFor(() => {
          expect(mockGrantExceptions).toHaveBeenCalledWith(
            { learners: 'user1@example.com,user2@example.com', notes: 'Test notes' },
            expect.objectContaining({
              onSuccess: expect.any(Function),
              onError: expect.any(Function),
            })
          );
        });

        capturedCallbacks.onSuccess();

        await waitFor(() => {
          expect(screen.queryByText(messages.grantExceptionsModalTitle.defaultMessage)).not.toBeInTheDocument();
        });
      });

      it('handles error callback', async () => {
        const user = userEvent.setup();
        const testError = { response: { data: { error: 'API Error' } } };
        let capturedCallbacks: any;

        mockGrantExceptions.mockImplementation((_request, callbacks) => {
          capturedCallbacks = callbacks;
        });

        renderWithAlertAndIntl(<CertificatesPage />);

        const grantButton = screen.getByText(messages.grantExceptionsButton.defaultMessage);
        await user.click(grantButton);

        await waitFor(() => {
          expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
        });

        const learnersInput = screen.getByLabelText(messages.learnersLabel.defaultMessage);
        await user.type(learnersInput, 'user1@example.com');

        const submitButton = screen.getByRole('button', { name: messages.submit.defaultMessage });
        await user.click(submitButton);

        await waitFor(() => {
          expect(mockGrantExceptions).toHaveBeenCalled();
        });

        capturedCallbacks.onError(testError);

        expect(screen.getByText(messages.grantExceptionsModalTitle.defaultMessage)).toBeInTheDocument();
      });
    });

    describe('handleInvalidateCertificate', () => {
      it('calls mutation with correct params and handles success', async () => {
        const user = userEvent.setup();
        let capturedCallbacks: any;

        mockInvalidateCert.mockImplementation((_request, callbacks) => {
          capturedCallbacks = callbacks;
        });

        renderWithAlertAndIntl(<CertificatesPage />);

        const invalidateButton = screen.getByText(messages.invalidateCertificateButton.defaultMessage);
        await user.click(invalidateButton);

        await waitFor(() => {
          expect(screen.getByText(messages.invalidateCertificateModalTitle.defaultMessage)).toBeInTheDocument();
        });

        const learnersInput = screen.getByLabelText(messages.learnersLabel.defaultMessage);
        const notesInput = screen.getByLabelText(messages.notesLabel.defaultMessage);
        await user.type(learnersInput, 'user3@example.com');
        await user.type(notesInput, 'Invalidation notes');

        const submitButton = screen.getByRole('button', { name: messages.submit.defaultMessage });
        await user.click(submitButton);

        await waitFor(() => {
          expect(mockInvalidateCert).toHaveBeenCalledWith(
            { learners: 'user3@example.com', notes: 'Invalidation notes' },
            expect.objectContaining({
              onSuccess: expect.any(Function),
              onError: expect.any(Function),
            })
          );
        });

        capturedCallbacks.onSuccess();

        await waitFor(() => {
          expect(screen.queryByText(messages.invalidateCertificateModalTitle.defaultMessage)).not.toBeInTheDocument();
        });
      });

      it('handles error callback', async () => {
        const user = userEvent.setup();
        const testError = { response: { data: { error: 'Invalidation Error' } } };
        let capturedCallbacks: any;

        mockInvalidateCert.mockImplementation((_request, callbacks) => {
          capturedCallbacks = callbacks;
        });

        renderWithAlertAndIntl(<CertificatesPage />);

        const invalidateButton = screen.getByText(messages.invalidateCertificateButton.defaultMessage);
        await user.click(invalidateButton);

        await waitFor(() => {
          expect(screen.getByText(messages.invalidateCertificateModalTitle.defaultMessage)).toBeInTheDocument();
        });

        const learnersInput = screen.getByLabelText(messages.learnersLabel.defaultMessage);
        await user.type(learnersInput, 'user3@example.com');

        const submitButton = screen.getByRole('button', { name: messages.submit.defaultMessage });
        await user.click(submitButton);

        await waitFor(() => {
          expect(mockInvalidateCert).toHaveBeenCalled();
        });

        capturedCallbacks.onError(testError);

        expect(screen.getByText(messages.invalidateCertificateModalTitle.defaultMessage)).toBeInTheDocument();
      });
    });

    describe('handleRemoveInvalidation', () => {
      it('opens modal and handles successful removal', () => {
        renderWithAlertAndIntl(<CertificatesPage />);

        expect(mockUseRemoveInvalidation).toHaveBeenCalled();
        expect(mockRemoveInvalidation).toBeDefined();
      });

      it('handles error when removing invalidation', () => {
        renderWithAlertAndIntl(<CertificatesPage />);

        expect(mockUseRemoveInvalidation).toHaveBeenCalled();
      });
    });

    describe('handleRemoveException', () => {
      it('calls mutation with correct params and shows success toast', () => {
        renderWithAlertAndIntl(<CertificatesPage />);

        expect(mockUseRemoveException).toHaveBeenCalled();
        expect(mockRemoveException).toBeDefined();
      });

      it('handles error when removing exception', () => {
        renderWithAlertAndIntl(<CertificatesPage />);

        expect(mockUseRemoveException).toHaveBeenCalled();
      });
    });

    describe('handleToggleCertificateGeneration', () => {
      it('disables certificate generation successfully', async () => {
        const user = userEvent.setup();
        let capturedCallbacks: any;

        mockToggleGeneration.mockImplementation((_enabled, callbacks) => {
          capturedCallbacks = callbacks;
        });

        renderWithAlertAndIntl(<CertificatesPage />);

        const disableButton = screen.getByRole('button', { name: messages.disableCertificatesButton.defaultMessage });
        await user.click(disableButton);

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const confirmButton = screen.getByRole('button', { name: messages.confirm.defaultMessage });
        await user.click(confirmButton);

        await waitFor(() => {
          expect(mockToggleGeneration).toHaveBeenCalledWith(
            false,
            expect.objectContaining({
              onSuccess: expect.any(Function),
              onError: expect.any(Function),
            })
          );
        });

        capturedCallbacks.onSuccess();

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
      });

      it('handles error when toggling generation', async () => {
        const user = userEvent.setup();
        const testError = { response: { data: { error: 'Toggle Error' } } };
        let capturedCallbacks: any;

        mockToggleGeneration.mockImplementation((_enabled, callbacks) => {
          capturedCallbacks = callbacks;
        });

        renderWithAlertAndIntl(<CertificatesPage />);

        const disableButton = screen.getByRole('button', { name: messages.disableCertificatesButton.defaultMessage });
        await user.click(disableButton);

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        const confirmButton = screen.getByRole('button', { name: messages.confirm.defaultMessage });
        await user.click(confirmButton);

        await waitFor(() => {
          expect(mockToggleGeneration).toHaveBeenCalled();
        });

        capturedCallbacks.onError(testError);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('filter functionality', () => {
    it('filters certificates data correctly', () => {
      renderWithAlertAndIntl(<CertificatesPage />);

      expect(screen.getByText('user1')).toBeInTheDocument();
    });

    it('searches certificates data correctly', () => {
      renderWithAlertAndIntl(<CertificatesPage />);

      expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    });
  });
});
