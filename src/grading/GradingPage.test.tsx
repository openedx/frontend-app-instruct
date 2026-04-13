import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import GradingPage from '@src/grading/GradingPage';
import messages from '@src/grading/messages';

// Mock child components, each component should have its own test suite
jest.mock('@src/grading/components/GradingLearnerContent', () => {
  return function MockGradingLearnerContent({ toolType }: { toolType: string }) {
    return <div>Grading Content for: {toolType}</div>;
  };
});

jest.mock('@src/grading/components/GradingActionRow', () => {
  return function MockGradingActionRow() {
    return <div>Grading Action Row</div>;
  };
});

jest.mock('@src/components/PendingTasks', () => {
  return {
    PendingTasks: function MockPendingTasks() {
      return <div>Pending Tasks</div>;
    }
  };
});

describe('GradingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page title correctly', () => {
    renderWithIntl(<GradingPage />);
    expect(screen.getByText(messages.pageTitle.defaultMessage)).toBeInTheDocument();
  });

  it('renders all child components', () => {
    renderWithIntl(<GradingPage />);
    expect(screen.getByText('Grading Action Row')).toBeInTheDocument();
    expect(screen.getByText('Grading Content for: single')).toBeInTheDocument();
    expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
  });

  it('renders both button options with correct labels', () => {
    renderWithIntl(<GradingPage />);
    expect(screen.getByRole('button', { name: messages.singleLearner.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.allLearners.defaultMessage })).toBeInTheDocument();
  });

  it('defaults to single learner tool being selected', () => {
    renderWithIntl(<GradingPage />);
    const singleLearnerButton = screen.getByRole('button', { name: messages.singleLearner.defaultMessage });
    const allLearnersButton = screen.getByRole('button', { name: messages.allLearners.defaultMessage });

    // Single learner should have primary variant (selected state)
    expect(singleLearnerButton).toHaveClass('btn-primary');
    expect(allLearnersButton).toHaveClass('btn-outline-primary');

    // GradingLearnerContent should receive 'single' as initial toolType
    expect(screen.getByText('Grading Content for: single')).toBeInTheDocument();
  });

  it('switches to All Learners when All Learners button is clicked', async () => {
    renderWithIntl(<GradingPage />);
    const user = userEvent.setup();

    const allLearnersButton = screen.getByRole('button', { name: messages.allLearners.defaultMessage });

    await user.click(allLearnersButton);

    // All learners should now be selected
    expect(allLearnersButton).toHaveClass('btn-primary');
    expect(screen.getByRole('button', { name: messages.singleLearner.defaultMessage })).toHaveClass('btn-outline-primary');

    // GradingLearnerContent should receive 'all' as toolType
    expect(screen.getByText('Grading Content for: all')).toBeInTheDocument();
  });

  it('switches back to Single Learner when Single Learner button is clicked', async () => {
    renderWithIntl(<GradingPage />);
    const user = userEvent.setup();

    const singleLearnerButton = screen.getByRole('button', { name: messages.singleLearner.defaultMessage });
    const allLearnersButton = screen.getByRole('button', { name: messages.allLearners.defaultMessage });

    // First switch to all learners
    await user.click(allLearnersButton);
    expect(screen.getByText('Grading Content for: all')).toBeInTheDocument();

    // Then switch back to single learner
    await user.click(singleLearnerButton);

    // Single learner should be selected again
    expect(singleLearnerButton).toHaveClass('btn-primary');
    expect(allLearnersButton).toHaveClass('btn-outline-primary');
    expect(screen.getByText('Grading Content for: single')).toBeInTheDocument();
  });

  it('maintains correct button states during multiple interactions', async () => {
    renderWithIntl(<GradingPage />);
    const user = userEvent.setup();

    const singleLearnerButton = screen.getByRole('button', { name: messages.singleLearner.defaultMessage });
    const allLearnersButton = screen.getByRole('button', { name: messages.allLearners.defaultMessage });

    // Initial state - single learner selected
    expect(singleLearnerButton).toHaveClass('btn-primary');
    expect(allLearnersButton).toHaveClass('btn-outline-primary');

    // Click all learners multiple times - should remain selected
    await user.click(allLearnersButton);
    await user.click(allLearnersButton);

    expect(allLearnersButton).toHaveClass('btn-primary');
    expect(singleLearnerButton).toHaveClass('btn-outline-primary');
    expect(screen.getByText('Grading Content for: all')).toBeInTheDocument();

    // Click single learner multiple times - should remain selected
    await user.click(singleLearnerButton);
    await user.click(singleLearnerButton);

    expect(singleLearnerButton).toHaveClass('btn-primary');
    expect(allLearnersButton).toHaveClass('btn-outline-primary');
    expect(screen.getByText('Grading Content for: single')).toBeInTheDocument();
  });

  it('passes correct toolType prop to GradingLearnerContent component', () => {
    renderWithIntl(<GradingPage />);

    // Initially should pass 'single'
    expect(screen.getByText('Grading Content for: single')).toBeInTheDocument();
    expect(screen.queryByText('Grading Content for: all')).not.toBeInTheDocument();
  });
});
