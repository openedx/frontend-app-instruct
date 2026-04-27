import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import SpecialExamsPage from './SpecialExamsPage';

// Mock child components
jest.mock('./components/Allowances', () => {
  function MockedAllowances() {
    return <div>Allowances Component</div>;
  }
  return MockedAllowances;
});
jest.mock('./components/AttemptsList', () => {
  function MockedAttemptsList() {
    return <div>AttemptsList Component</div>;
  }
  return MockedAttemptsList;
});

describe('SpecialExamsPage', () => {
  it('renders the page title', () => {
    renderWithIntl(<SpecialExamsPage />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders the attempts tab and its content by default', () => {
    renderWithIntl(<SpecialExamsPage />);
    expect(screen.getByText('Exam Attempts')).toBeInTheDocument();
    expect(screen.getByText('AttemptsList Component')).toBeInTheDocument();
    expect(screen.queryByText('Allowances Component')).not.toBeInTheDocument();
  });

  it('switches to allowances tab when clicked', async () => {
    renderWithIntl(<SpecialExamsPage />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Allowances'));
    expect(screen.getByText('Allowances Component')).toBeInTheDocument();
    expect(screen.queryByText('AttemptsList Component')).not.toBeInTheDocument();
  });

  it('switches back to attempts tab when clicked', async () => {
    renderWithIntl(<SpecialExamsPage />);
    const user = userEvent.setup();
    await user.click(screen.getByText('Allowances'));
    await user.click(screen.getByText('Exam Attempts'));
    expect(screen.getByText('AttemptsList Component')).toBeInTheDocument();
    expect(screen.queryByText('Allowances Component')).not.toBeInTheDocument();
  });

  it('applies correct button variants based on selected tab', async () => {
    renderWithIntl(<SpecialExamsPage />);
    const attemptsButton = screen.getByText('Exam Attempts');
    const allowancesButton = screen.getByText('Allowances');
    expect(attemptsButton).toHaveClass('btn-primary');
    expect(allowancesButton).toHaveClass('btn-outline-primary');
    const user = userEvent.setup();
    await user.click(allowancesButton);
    expect(allowancesButton).toHaveClass('btn-primary');
    expect(attemptsButton).toHaveClass('btn-outline-primary');
  });
});
