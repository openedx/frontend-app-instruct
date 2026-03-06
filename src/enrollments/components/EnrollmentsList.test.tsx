import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnrollmentsList from './EnrollmentsList';
import { useEnrollments } from '../data/apiHook';
import { renderWithIntl } from '@src/testUtils';

jest.mock('../data/apiHook', () => ({
  useEnrollments: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

const mockLearners = [
  {
    id: '1',
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    track: 'Verified',
    betaTester: true,
  },
  {
    id: '2',
    username: 'janedoe',
    fullName: 'Jane Doe',
    email: 'janedoe@example.com',
    track: 'Audit',
    betaTester: false,
  },
];

const renderComponent = (onUnenroll = jest.fn()) => {
  return renderWithIntl(
    <EnrollmentsList onUnenroll={onUnenroll} />
  );
};

describe('EnrollmentsList', () => {
  beforeEach(() => {
    (useEnrollments as jest.Mock).mockReturnValue({
      data: { count: 2, results: mockLearners },
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders table with enrollments data', () => {
    renderComponent();

    expect(screen.getByText(mockLearners[0].username)).toBeInTheDocument();
    expect(screen.getByText(mockLearners[0].fullName)).toBeInTheDocument();
    expect(screen.getByText(mockLearners[0].email)).toBeInTheDocument();
    expect(screen.getByText(mockLearners[0].track)).toBeInTheDocument();
  });

  test('displays beta tester status correctly', () => {
    renderComponent();

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('True'); // First learner is beta tester
    expect(rows[2]).not.toHaveTextContent('True'); // Second learner is not beta tester
  });

  test('calls onUnenroll when unenroll button is clicked', async () => {
    const mockOnUnenroll = jest.fn();
    renderComponent(mockOnUnenroll);

    const unenrollButtons = screen.getAllByRole('button', { name: /unenroll/i });
    const user = userEvent.setup();
    await user.click(unenrollButtons[0]);

    expect(mockOnUnenroll).toHaveBeenCalledWith(mockLearners[0]);
  });

  test('handles loading state', () => {
    (useEnrollments as jest.Mock).mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: true,
    });

    renderComponent();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('handles empty data', () => {
    (useEnrollments as jest.Mock).mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: false,
    });

    renderComponent();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  test('displays N/A for missing track', () => {
    const learnersWithoutTrack = [
      { ...mockLearners[0], track: null },
    ];

    (useEnrollments as jest.Mock).mockReturnValue({
      data: { count: 1, results: learnersWithoutTrack },
      isLoading: false,
    });

    renderComponent();
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});
