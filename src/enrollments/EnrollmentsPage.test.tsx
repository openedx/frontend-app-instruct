import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EnrollmentsPage from './EnrollmentsPage';
import { EnrolledLearner } from './types';
import messages from './messages';
import { useEnrollmentByUserId, useEnrollments, useEnrollLearners, useUnenrollLearners } from './data/apiHook';
import { renderWithAlertAndIntl } from '@src/testUtils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

jest.mock('./data/apiHook', () => ({
  useEnrollments: jest.fn(),
  useEnrollmentByUserId: jest.fn(),
  useEnrollLearners: jest.fn(),
  useUnenrollLearners: jest.fn(),
}));

jest.mock('./components/EnrollmentsList', () => {
  return function MockEnrollmentsList({ onUnenroll }: { onUnenroll: (learner: EnrolledLearner) => void }) {
    return (
      <div role="table">
        <button onClick={() => onUnenroll({
          fullName: 'Tester',
          email: 'test@example.com',
          username: '',
          mode: '',
          isBetaTester: false
        })}
        >
          Unenroll Test Learner
        </button>
      </div>
    );
  };
});

describe('EnrollmentsPage', () => {
  beforeAll(() => {
    (useEnrollments as jest.Mock).mockReturnValue({
      data: { count: 1, numPages: 1, results: [{ username: 'testuser', fullName: 'Test User', email: 'test@example.com', mode: 'audit', isBetaTester: false }] },
      isLoading: false,
    });
    (useEnrollmentByUserId as jest.Mock).mockReturnValue({
      data: { enrollmentStatus: 'enrolled' },
      refetch: jest.fn(),
    });
    (useEnrollLearners as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
      error: null,
    });
    (useUnenrollLearners as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  it('renders the page title', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    expect(screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(messages.addBetaTesters.defaultMessage) })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(messages.enrollLearners.defaultMessage) })).toBeInTheDocument();
  });

  it('renders EnrollmentsList component', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('opens enrollment status modal when more button is clicked', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    const moreButton = screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage });
    const user = userEvent.setup();
    await user.click(moreButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes enrollment status modal', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    const moreButton = screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage });
    const user = userEvent.setup();
    await user.click(moreButton);

    const closeButton = screen.getByText('Close');
    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens unenroll modal when unenroll is triggered', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    const unenrollButton = screen.getByText('Unenroll Test Learner');
    const user = userEvent.setup();
    await user.click(unenrollButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Tester/)).toBeInTheDocument();
  });

  it('closes unenroll modal and clears selected learner', async () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    const unenrollButton = screen.getByText('Unenroll Test Learner');
    const user = userEvent.setup();
    await user.click(unenrollButton);

    const closeUnenrollButton = screen.getByText('Cancel');
    await user.click(closeUnenrollButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('modals are closed by default', () => {
    renderWithAlertAndIntl(<EnrollmentsPage />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
