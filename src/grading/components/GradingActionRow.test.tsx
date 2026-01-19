import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import GradingActionRow from '@src/grading/components/GradingActionRow';
import messages from '../messages';

describe('GradingActionRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ActionRow with gradebook and configuration buttons', () => {
    renderWithIntl(<GradingActionRow />);
    expect(screen.getByRole('button', { name: messages.viewGradebook.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.configurationAlt.defaultMessage })).toBeInTheDocument();
  });

  it('opens configuration menu when configuration button is clicked', async () => {
    renderWithIntl(<GradingActionRow />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.configurationAlt.defaultMessage }));
    expect(screen.getByText('View Grading Configuration')).toBeInTheDocument();
    expect(screen.getByText('View Course Grading Settings')).toBeInTheDocument();
  });

  it('opens and closes GradingConfigurationModal when menu item is clicked', async () => {
    renderWithIntl(<GradingActionRow />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.configurationAlt.defaultMessage }));
    const gradingConfigButton = screen.getByText('View Grading Configuration');
    await user.click(gradingConfigButton);
    expect(screen.getByRole('dialog', { name: messages.gradingConfiguration.defaultMessage })).toBeInTheDocument();

    // Close modal
    await user.click(screen.getAllByRole('button', { name: messages.close.defaultMessage })[0]);
    expect(screen.queryByRole('dialog', { name: messages.gradingConfiguration.defaultMessage })).not.toBeInTheDocument();
  });
});
