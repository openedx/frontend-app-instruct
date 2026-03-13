import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import IssuedCertificates from './IssuedCertificates';
import { useIssuedCertificates, useRegenerateCertificatesMutation } from '../data/apiHook';
import { AlertProvider } from '@src/providers/AlertProvider';
import { renderWithQueryClient } from '@src/testUtils';
import messages from '../messages';

jest.mock('../data/apiHook');

const mockUseIssuedCertificates = useIssuedCertificates as jest.MockedFunction<typeof useIssuedCertificates>;
const mockUseRegenerateCertificatesMutation = useRegenerateCertificatesMutation as jest.MockedFunction<typeof useRegenerateCertificatesMutation>;

const mockCertificatesData = {
  results: [
    {
      username: 'john_doe',
      email: 'john@example.com',
      enrollmentTrack: 'verified',
      certificateStatus: 'downloadable',
      specialCase: null,
      exceptionGranted: null,
      exceptionNotes: null,
      invalidatedBy: null,
      invalidationDate: null,
    },
    {
      username: 'jane_smith',
      email: 'jane@example.com',
      enrollmentTrack: 'audit',
      certificateStatus: 'notpassing',
      specialCase: 'honor_code',
      exceptionGranted: 'admin',
      exceptionNotes: 'Special permission',
      invalidatedBy: 'instructor',
      invalidationDate: '2025-01-15',
    },
  ],
  count: 2,
};

const renderWithProviders = (component: React.ReactElement, courseId = 'course-123') => {
  return renderWithQueryClient(
    <AlertProvider>
      <MemoryRouter initialEntries={[`/course/${courseId}/certificates`]}>
        <Routes>
          <Route path="/course/:courseId/certificates" element={component} />
        </Routes>
      </MemoryRouter>
    </AlertProvider>
  );
};

describe('IssuedCertificates', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseIssuedCertificates.mockReturnValue({
      data: mockCertificatesData,
      isLoading: false,
      error: null,
    } as any);

    mockUseRegenerateCertificatesMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

  it('should render table with certificate data', () => {
    renderWithProviders(<IssuedCertificates />);

    expect(screen.getByText('john_doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane_smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('should render regenerate button', () => {
    renderWithProviders(<IssuedCertificates />);

    const button = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    expect(button).toBeInTheDocument();
  });

  it('should disable regenerate button when filter is "all"', () => {
    renderWithProviders(<IssuedCertificates />);

    const button = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    expect(button).toBeDisabled();
  });

  it('should disable regenerate button when filter is "invalidated"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const invalidatedOption = screen.getByText(messages.invalidated.defaultMessage);
    await user.click(invalidatedOption);

    const button = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    expect(button).toBeDisabled();
  });

  it('should enable regenerate button when filter is "received"', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const receivedOption = screen.getByText(messages.received.defaultMessage);
    await user.click(receivedOption);

    const button = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    expect(button).not.toBeDisabled();
  });

  it('should disable regenerate button when count is 0', () => {
    mockUseIssuedCertificates.mockReturnValue({
      data: { results: [], count: 0 },
      isLoading: false,
      error: null,
    } as any);

    renderWithProviders(<IssuedCertificates />);

    const button = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    expect(button).toBeDisabled();
  });

  it('should open modal when regenerate button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const receivedOption = screen.getByText(messages.received.defaultMessage);
    await user.click(receivedOption);

    const buttons = screen.getAllByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(buttons[0]);

    expect(screen.getByText(messages.regenerateAllLearnersMessage.defaultMessage)).toBeInTheDocument();
  });

  it('should display correct modal content for "received" filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const receivedOption = screen.getByText(messages.received.defaultMessage);
    await user.click(receivedOption);

    const button = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(button);

    expect(screen.getByText(messages.regenerateAllLearnersMessage.defaultMessage)).toBeInTheDocument();
  });

  it('should display correct modal content for "granted_exceptions" filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const exceptionsOption = screen.getByText(messages.grantedExceptions.defaultMessage);
    await user.click(exceptionsOption);

    const button = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(button);

    expect(screen.getByText(messages.generateCertificatesTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.generateExceptionsMessage.defaultMessage)).toBeInTheDocument();
  });

  it('should close modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const receivedOption = screen.getByText(messages.received.defaultMessage);
    await user.click(receivedOption);

    const regenerateButtons = screen.getAllByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(regenerateButtons[0]);

    const cancelButton = screen.getByRole('button', { name: messages.cancel.defaultMessage });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(messages.regenerateAllLearnersMessage.defaultMessage)).not.toBeInTheDocument();
    });
  });

  it('should call regenerate mutation with correct params for "received" filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const receivedOption = screen.getByText(messages.received.defaultMessage);
    await user.click(receivedOption);

    const regenerateButton = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(regenerateButton);

    const confirmButton = screen.getByRole('button', { name: messages.regenerate.defaultMessage });
    await user.click(confirmButton);

    expect(mockMutate).toHaveBeenCalledWith(
      { courseId: 'course-123', params: { statuses: ['downloadable'] } },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('should call regenerate mutation with correct params for "not_received" filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const notReceivedOption = screen.getByText(messages.notReceived.defaultMessage);
    await user.click(notReceivedOption);

    const regenerateButton = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(regenerateButton);

    const confirmButton = screen.getByRole('button', { name: messages.regenerate.defaultMessage });
    await user.click(confirmButton);

    expect(mockMutate).toHaveBeenCalledWith(
      { courseId: 'course-123', params: { statuses: ['notpassing', 'unavailable'] } },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('should call regenerate mutation with correct params for "granted_exceptions" filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const exceptionsOption = screen.getByText(messages.grantedExceptions.defaultMessage);
    await user.click(exceptionsOption);

    const regenerateButton = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(regenerateButton);

    const confirmButton = screen.getByRole('button', { name: messages.generate.defaultMessage });
    await user.click(confirmButton);

    expect(mockMutate).toHaveBeenCalledWith(
      { courseId: 'course-123', params: { studentSet: 'allowlisted' } },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('should show success toast on successful regeneration', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const receivedOption = screen.getByText(messages.received.defaultMessage);
    await user.click(receivedOption);

    const regenerateButton = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(regenerateButton);

    const confirmButton = screen.getByRole('button', { name: messages.regenerate.defaultMessage });
    await user.click(confirmButton);

    capturedCallbacks.onSuccess();

    await waitFor(() => {
      expect(screen.getByText(messages.regenerateSuccess.defaultMessage)).toBeInTheDocument();
    });
  });

  it('should show error modal on regeneration failure', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
    });

    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const receivedOption = screen.getByText(messages.received.defaultMessage);
    await user.click(receivedOption);

    const regenerateButton = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(regenerateButton);

    const confirmButton = screen.getByRole('button', { name: messages.regenerate.defaultMessage });
    await user.click(confirmButton);

    const error = { response: { data: { error: 'Custom error message' } } };
    capturedCallbacks.onError(error);

    await waitFor(() => {
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
  });

  it('should handle search filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const searchInput = screen.getByPlaceholderText(messages.searchPlaceholder.defaultMessage);
    await user.type(searchInput, 'john');

    await waitFor(() => {
      const calls = mockUseIssuedCertificates.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall[2]).toBe('john');
    }, { timeout: 500 });
  });

  it('should render error state', () => {
    mockUseIssuedCertificates.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load'),
    } as any);

    renderWithProviders(<IssuedCertificates />);

    expect(screen.getByText('Error loading certificates')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    mockUseIssuedCertificates.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProviders(<IssuedCertificates />);

    expect(screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage })).toBeInTheDocument();
  });

  it('should disable regenerate button while regenerating', () => {
    mockUseRegenerateCertificatesMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    renderWithProviders(<IssuedCertificates />);

    const button = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    expect(button).toBeDisabled();
  });

  it('should render special case cells with dash when value is null', () => {
    renderWithProviders(<IssuedCertificates />);

    const dashCells = screen.getAllByText('—');
    expect(dashCells.length).toBeGreaterThan(0);
  });

  it('should reset to page 0 when search filter changes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const searchInput = screen.getByPlaceholderText(messages.searchPlaceholder.defaultMessage);
    await user.type(searchInput, 'test');

    await waitFor(() => {
      const calls = mockUseIssuedCertificates.mock.calls;
      const hasExpectedCall = calls.some(call =>
        call[0] === 'course-123'
        && call[1].page === 0
        && call[1].pageSize === 10
        && call[2] === 'test'
        && call[3] === 'all'
      );
      expect(hasExpectedCall).toBe(true);
    }, { timeout: 1000 });
  });

  it('should handle error without response data', async () => {
    const user = userEvent.setup();
    let capturedCallbacks: any;

    mockMutate.mockImplementation((_, callbacks) => {
      capturedCallbacks = callbacks;
      return undefined;
    });

    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const receivedOption = screen.getByText(messages.received.defaultMessage);
    await user.click(receivedOption);

    const regenerateButton = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(regenerateButton);

    const confirmButton = screen.getByRole('button', { name: messages.regenerate.defaultMessage });
    await user.click(confirmButton);

    // Wait for mutation to be called
    await waitFor(() => {
      expect(capturedCallbacks).toBeDefined();
    });

    const error = new Error('Network error');
    capturedCallbacks.onError(error);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should display correct confirmation count', async () => {
    const user = userEvent.setup();
    renderWithProviders(<IssuedCertificates />);

    const dropdown = screen.getByText(messages.allLearners.defaultMessage);
    await user.click(dropdown);

    const receivedOption = screen.getByText(messages.received.defaultMessage);
    await user.click(receivedOption);

    const regenerateButton = screen.getByRole('button', { name: messages.regenerateCertificates.defaultMessage });
    await user.click(regenerateButton);

    expect(screen.getByText(/Regenerate certificates for 2 learners?/)).toBeInTheDocument();
  });
});
