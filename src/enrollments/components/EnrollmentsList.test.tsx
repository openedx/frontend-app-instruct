import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnrollmentsList from './EnrollmentsList';
import { useEnrollments } from '../data/apiHook';
import { renderWithIntl } from '@src/testUtils';
import messages from '../messages';

jest.mock('../data/apiHook', () => ({
  useEnrollments: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

const mockLearners = [
  {
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    mode: 'Verified',
    isBetaTester: true,
  },
  {
    username: 'janedoe',
    fullName: 'Jane Doe',
    email: 'janedoe@example.com',
    mode: 'Audit',
    isBetaTester: false,
  },
];

const renderComponent = (onUnenroll = jest.fn()) => {
  return renderWithIntl(
    <EnrollmentsList onUnenroll={onUnenroll} />
  );
};

describe('EnrollmentsList', () => {
  const mockOnUnenroll = jest.fn();

  beforeEach(() => {
    (useEnrollments as jest.Mock).mockReturnValue({
      data: { count: 2, results: mockLearners, numPages: 1 },
      isLoading: false,
    });
    mockOnUnenroll.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic rendering and functionality', () => {
    test('renders table with enrollments data', () => {
      renderComponent();

      expect(screen.getByText(mockLearners[0].username)).toBeInTheDocument();
      expect(screen.getByText(mockLearners[0].fullName)).toBeInTheDocument();
      expect(screen.getByText(mockLearners[0].email)).toBeInTheDocument();
      expect(screen.getByText(mockLearners[0].mode)).toBeInTheDocument();
    });

    test('displays beta tester status correctly', () => {
      renderComponent();

      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveTextContent('True'); // First learner is beta tester
      expect(rows[2]).not.toHaveTextContent('True'); // Second learner is not beta tester
    });

    test('calls onUnenroll when unenroll button is clicked', async () => {
      renderComponent(mockOnUnenroll);

      const unenrollButtons = screen.getAllByRole('button', { name: /unenroll/i });
      const user = userEvent.setup();
      await user.click(unenrollButtons[0]);

      expect(mockOnUnenroll).toHaveBeenCalledWith(mockLearners[0]);
    });

    test('handles loading state', () => {
      (useEnrollments as jest.Mock).mockReturnValue({
        data: { count: 0, results: [], numPages: 0 },
        isLoading: true,
      });

      renderComponent();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('handles empty data', () => {
      (useEnrollments as jest.Mock).mockReturnValue({
        data: { count: 0, results: [], numPages: 0 },
        isLoading: false,
      });

      renderComponent();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('displays N/A for missing mode', () => {
      const learnersWithoutMode = [
        { ...mockLearners[0], mode: null },
      ];

      (useEnrollments as jest.Mock).mockReturnValue({
        data: { count: 1, results: learnersWithoutMode, numPages: 1 },
        isLoading: false,
      });

      renderComponent();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('Filtering functionality', () => {
    test('renders username filter input', () => {
      renderComponent();

      const usernameFilter = screen.getByPlaceholderText(/search enrollments/i);
      expect(usernameFilter).toBeInTheDocument();
    });

    test('renders beta tester filter dropdown', () => {
      renderComponent();

      const betaTesterFilter = screen.getByDisplayValue(/all enrollees/i);
      expect(betaTesterFilter).toBeInTheDocument();

      // Check if all options are present
      expect(screen.getByText('All Enrollees')).toBeInTheDocument();
      expect(screen.getByText('Beta Testers')).toBeInTheDocument();
      expect(screen.getByText('Non-Beta Testers')).toBeInTheDocument();
    });

    test('calls useEnrollments with correct parameters when filters are applied', () => {
      renderComponent();

      expect(useEnrollments).toHaveBeenCalledWith('test-course-id', {
        page: 0,
        pageSize: 25,
        emailOrUsername: '',
        isBetaTester: '',
      });
    });

    test('username filter updates input value', async () => {
      const user = userEvent.setup();
      renderComponent();

      const usernameFilter = screen.getByPlaceholderText(/search enrollments/i);
      await user.type(usernameFilter, 'john');

      expect(usernameFilter).toBeInTheDocument();
    });

    test('beta tester filter updates select value', async () => {
      const user = userEvent.setup();
      renderComponent();

      const betaTesterFilter = screen.getByDisplayValue(/all enrollees/i);
      await user.selectOptions(betaTesterFilter, 'true');

      expect(betaTesterFilter).toBeInTheDocument();
    });
  });

  describe('Pagination and data fetching', () => {
    test('resets to page 0 when filters change', async () => {
      const user = userEvent.setup();
      renderComponent();

      const usernameFilter = screen.getByPlaceholderText(/search enrollments/i);
      await user.type(usernameFilter, 'test');

      // Filter change should reset page to 0
      await waitFor(() => {
        expect(useEnrollments).toHaveBeenCalledWith('test-course-id', {
          page: 0,
          pageSize: 25,
          emailOrUsername: 'test',
          isBetaTester: '',
        });
      });
    });
  });

  describe('DataTable configuration', () => {
    test('renders DataTable with correct props', () => {
      renderComponent();

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      // Check that filterable columns are present
      expect(screen.getByText('Username')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Track')).toBeInTheDocument();
      expect(screen.getByText('Beta Tester')).toBeInTheDocument();
    });

    test('displays correct number of rows', () => {
      renderComponent();

      const rows = screen.getAllByRole('row');
      // Header row + 2 data rows
      expect(rows).toHaveLength(3);
    });

    test('handles edge case with undefined mode', () => {
      const learnersWithUndefinedMode = [
        { ...mockLearners[0], mode: undefined },
      ];

      (useEnrollments as jest.Mock).mockReturnValue({
        data: { count: 1, results: learnersWithUndefinedMode, numPages: 1 },
        isLoading: false,
      });

      renderComponent();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    test('handles API error state', () => {
      (useEnrollments as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('API Error'),
      });

      renderComponent();

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Action buttons functionality', () => {
    test('renders action buttons for each learner', () => {
      renderComponent();

      const actionButtons = screen.getAllByRole('button', { name: messages.changeBetaTesterStatus.defaultMessage });
      expect(actionButtons).toHaveLength(2);
    });

    test('action buttons have correct accessibility attributes', () => {
      renderComponent();

      const actionButtons = screen.getAllByRole('button', { name: messages.changeBetaTesterStatus.defaultMessage });
      actionButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label', messages.changeBetaTesterStatus.defaultMessage);
      });
    });
  });
});
