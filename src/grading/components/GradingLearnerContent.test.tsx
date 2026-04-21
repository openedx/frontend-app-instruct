import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GradingLearnerContent from '@src/grading/components/GradingLearnerContent';
import { useChangeScore, useDeleteHistory, useRescoreSubmission, useResetAttempts } from '@src/grading/data/apiHook';
import { usePendingTasks } from '@src/data/apiHook';
import messages from '@src/grading/messages';
import { renderWithIntl } from '@src/testUtils';

// Mock dependencies
jest.mock('@src/grading/data/apiHook');
jest.mock('@src/data/apiHook');
jest.mock('@src/components/SpecifyLearnerField', () => ({
  __esModule: true,
  default: ({ onClickSelect }: { onClickSelect: (value: string) => void }) => (
    <div data-testid="specify-learner-field">
      <button onClick={() => onClickSelect('testuser@example.com')}>
        Select Learner
      </button>
    </div>
  ),
}));
jest.mock('@src/components/SpecifyProblemField', () => ({
  __esModule: true,
  default: ({ onClickSelect, disabled }: { onClickSelect: (value: string, event: React.MouseEvent<HTMLButtonElement>) => void, disabled?: boolean }) => (
    <div data-testid="specify-problem-field">
      <button
        onClick={(event) => onClickSelect('block-v1:test+problem', event)}
        disabled={disabled}
      >
        Select Problem
      </button>
    </div>
  ),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

const mockUseResetAttempts = useResetAttempts as jest.MockedFunction<typeof useResetAttempts>;
const mockUseDeleteHistory = useDeleteHistory as jest.MockedFunction<typeof useDeleteHistory>;
const mockUseChangeScore = useChangeScore as jest.MockedFunction<typeof useChangeScore>;
const mockUseRescoreSubmission = useRescoreSubmission as jest.MockedFunction<typeof useRescoreSubmission>;
const mockUsePendingTasks = usePendingTasks as jest.MockedFunction<typeof usePendingTasks>;

const defaultProps = {
  toolType: 'single' as const,
  onShowTasks: jest.fn(),
};

describe('GradingLearnerContent', () => {
  const mockMutateReset = jest.fn();
  const mockMutateDelete = jest.fn();
  const mockMutateChangeScore = jest.fn();
  const mockMutateRescore = jest.fn();
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseResetAttempts.mockReturnValue({ mutate: mockMutateReset } as any);
    mockUseDeleteHistory.mockReturnValue({ mutate: mockMutateDelete } as any);
    mockUseChangeScore.mockReturnValue({ mutate: mockMutateChangeScore } as any);
    mockUseRescoreSubmission.mockReturnValue({ mutate: mockMutateRescore } as any);
    mockUsePendingTasks.mockReturnValue({ refetch: mockRefetch } as any);
  });

  it('renders correctly for single learner mode', () => {
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    expect(screen.getByText(messages.descriptionSingleLearner.defaultMessage)).toBeInTheDocument();
    expect(screen.getByTestId('specify-learner-field')).toBeInTheDocument();
    expect(screen.getByTestId('specify-problem-field')).toBeInTheDocument();

    // Check that all action cards are rendered
    expect(screen.getByText(messages.resetAttempts.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.rescoreSubmission.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.overrideScore.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.deleteHistory.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.taskStatus.defaultMessage)).toBeInTheDocument();
  });

  it('renders correctly for all learners mode', () => {
    renderWithIntl(
      <GradingLearnerContent
        {...defaultProps}
        toolType="all"
      />
    );

    expect(screen.getByText(messages.descriptionAllLearners.defaultMessage)).toBeInTheDocument();
    expect(screen.queryByTestId('specify-learner-field')).not.toBeInTheDocument();
    expect(screen.getByTestId('specify-problem-field')).toBeInTheDocument();
  });

  it('handles learner selection correctly', async () => {
    const user = userEvent.setup();
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    const selectLearnerButton = screen.getByText('Select Learner');
    await user.click(selectLearnerButton);

    // The problem field should now be enabled
    const selectProblemButton = screen.getByText('Select Problem');
    expect(selectProblemButton).not.toBeDisabled();
  });

  it('handles problem selection correctly', async () => {
    const user = userEvent.setup();
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    // First select learner
    const selectLearnerButton = screen.getByText('Select Learner');
    await user.click(selectLearnerButton);

    // Then select problem
    const selectProblemButton = screen.getByText('Select Problem');
    await user.click(selectProblemButton);

    // Action buttons should now be enabled
    const resetButton = screen.getAllByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage })[0];
    expect(resetButton).not.toBeDisabled();
  });

  it('calls reset attempts when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Click reset attempts button
    const resetButton = screen.getAllByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage })[0];
    await user.click(resetButton);

    expect(mockMutateReset).toHaveBeenCalledWith({
      learner: 'testuser@example.com',
      problem: 'block-v1:test+problem',
    });
  });

  it('calls rescore submission when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Click rescore submission button
    const rescoreButton = screen.getByText(messages.rescoreSubmissionButtonLabel.defaultMessage);
    await user.click(rescoreButton);

    expect(mockMutateRescore).toHaveBeenCalledWith({
      learner: 'testuser@example.com',
      problem: 'block-v1:test+problem',
      onlyIfHigher: false,
    });
  });

  it('calls rescore submission with onlyIfHigher when "only if improves" button is clicked', async () => {
    const user = userEvent.setup();
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Click rescore if improves button
    const rescoreIfImprovesButton = screen.getByText(messages.rescoreIfImprovesScoreButtonLabel.defaultMessage);
    await user.click(rescoreIfImprovesButton);

    expect(mockMutateRescore).toHaveBeenCalledWith({
      learner: 'testuser@example.com',
      problem: 'block-v1:test+problem',
      onlyIfHigher: true,
    });
  });

  it('handles score input correctly', async () => {
    const user = userEvent.setup();
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Find the score input field
    const scoreInput = screen.getByPlaceholderText(messages.overrideScorePlaceholder.defaultMessage);
    expect(scoreInput).toBeInTheDocument();

    // Type a valid score
    await user.type(scoreInput, '85.5');

    // Click override score button
    const overrideButton = screen.getByText(messages.overrideScoreButtonLabel.defaultMessage);
    await user.click(overrideButton);

    expect(mockMutateChangeScore).toHaveBeenCalledWith({
      learner: 'testuser@example.com',
      problem: 'block-v1:test+problem',
      newScore: 85.5,
    });
  });

  it('validates score input to only allow numeric values', async () => {
    const user = userEvent.setup();
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Find the score input field using placeholder text
    const scoreInput = screen.getByPlaceholderText(messages.overrideScorePlaceholder.defaultMessage) as HTMLInputElement;
    screen.debug(scoreInput);
    // Try to type invalid characters
    await user.type(scoreInput, 'abc');
    expect(scoreInput.value).toBe('');

    // Try valid numeric input
    await user.type(scoreInput, '123.45');
    expect(scoreInput).toHaveValue(123.45);

    // Try negative number
    await user.clear(scoreInput);
    await user.type(scoreInput, '-10.5');
    expect(scoreInput).toHaveValue(-10.5);
  });

  it('calls delete history when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Click delete history button
    const deleteButton = screen.getByText(messages.deleteHistoryButtonLabel.defaultMessage);
    await user.click(deleteButton);

    expect(mockMutateDelete).toHaveBeenCalledWith({
      learner: 'testuser@example.com',
      problem: 'block-v1:test+problem',
    });
  });

  it('calls onShowTasks and refetches when task status button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnShowTasks = jest.fn();

    renderWithIntl(
      <GradingLearnerContent
        {...defaultProps}
        onShowTasks={mockOnShowTasks}
      />
    );

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    // Click task status button
    const taskStatusButton = screen.getByText(messages.taskStatusButtonLabel.defaultMessage);
    await user.click(taskStatusButton);

    expect(mockRefetch).toHaveBeenCalled();
    expect(mockOnShowTasks).toHaveBeenCalled();
  });

  it('disables problem selection when no learner is selected in single mode', () => {
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    const selectProblemButton = screen.getByText('Select Problem');
    expect(selectProblemButton).toBeDisabled();
  });

  it('disables action buttons when learner or problem is not selected', () => {
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    const resetButtons = screen.getAllByRole('button', { name: messages.resetAttemptsButtonLabel.defaultMessage });
    const rescoreButton = screen.getByRole('button', { name: messages.rescoreSubmissionButtonLabel.defaultMessage });
    const deleteButton = screen.getByRole('button', { name: messages.deleteHistoryButtonLabel.defaultMessage });
    const taskStatusButton = screen.getByRole('button', { name: messages.taskStatusButtonLabel.defaultMessage });

    expect(resetButtons[0]).toBeDisabled();
    expect(resetButtons[1]).toBeDisabled();
    expect(rescoreButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
    expect(taskStatusButton).toBeDisabled();
  });

  it('disables override score button when no score is entered', async () => {
    const user = userEvent.setup();
    renderWithIntl(<GradingLearnerContent {...defaultProps} />);

    // Select learner and problem first
    await user.click(screen.getByText('Select Learner'));
    await user.click(screen.getByText('Select Problem'));

    const overrideButton = screen.getByText(messages.overrideScoreButtonLabel.defaultMessage);
    expect(overrideButton).toBeDisabled();
  });
});
