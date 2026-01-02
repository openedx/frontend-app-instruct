import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import EnrollmentsPage from './EnrollmentsPage';
import { Learner } from './types';
import userEvent from '@testing-library/user-event';
import messages from './messages';

// Mock the child components
jest.mock('./components/EnrollmentsList', () => {
  return function MockEnrollmentsList({ onUnenroll }: { onUnenroll: (learner: Learner) => void }) {
    return (
      <div role="table">
        <button onClick={() => onUnenroll({
          id: '1', fullName: 'Tester', email: 'test@example.com',
          username: '',
          track: '',
          betaTester: false
        })}
        >
          Unenroll Test Learner
        </button>
      </div>
    );
  };
});

jest.mock('./components/EnrollmentStatusModal', () => {
  return function MockEnrollmentStatusModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return isOpen ? (
      <div role="dialog">
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null;
  };
});

jest.mock('./components/UnenrollModal', () => {
  return function MockUnenrollModal({ isOpen, learner, onClose }: { isOpen: boolean, learner: Learner | null, onClose: () => void }) {
    return isOpen ? (
      <div role="dialog">
        <span>Unenroll {learner?.fullName}</span>
        <button onClick={onClose}>Close Unenroll Modal</button>
      </div>
    ) : null;
  };
});

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <IntlProvider locale="en">
      {component}
    </IntlProvider>
  );
};

describe('EnrollmentsPage', () => {
  it('renders the page title', () => {
    renderWithIntl(<EnrollmentsPage />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderWithIntl(<EnrollmentsPage />);
    expect(screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(messages.addBetaTesters.defaultMessage) })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: new RegExp(messages.enrollLearners.defaultMessage) })).toBeInTheDocument();
  });

  it('renders EnrollmentsList component', () => {
    renderWithIntl(<EnrollmentsPage />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('opens enrollment status modal when more button is clicked', async () => {
    renderWithIntl(<EnrollmentsPage />);

    const moreButton = screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage });
    const user = userEvent.setup();
    await user.click(moreButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes enrollment status modal', async () => {
    renderWithIntl(<EnrollmentsPage />);

    const moreButton = screen.getByRole('button', { name: messages.checkEnrollmentStatus.defaultMessage });
    const user = userEvent.setup();
    await user.click(moreButton);

    const closeButton = screen.getByText('Close Modal');
    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens unenroll modal when unenroll is triggered', async () => {
    renderWithIntl(<EnrollmentsPage />);

    const unenrollButton = screen.getByText('Unenroll Test Learner');
    const user = userEvent.setup();
    await user.click(unenrollButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Tester/)).toBeInTheDocument();
  });

  it('closes unenroll modal and clears selected learner', async () => {
    renderWithIntl(<EnrollmentsPage />);

    const unenrollButton = screen.getByText('Unenroll Test Learner');
    const user = userEvent.setup();
    await user.click(unenrollButton);

    const closeUnenrollButton = screen.getByText('Close Unenroll Modal');
    await user.click(closeUnenrollButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('modals are closed by default', () => {
    renderWithIntl(<EnrollmentsPage />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
