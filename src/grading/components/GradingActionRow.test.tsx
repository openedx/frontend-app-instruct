import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCourseInfo } from '@src/data/apiHook';
import GradingActionRow from '@src/grading/components/GradingActionRow';
import { useGradingConfiguration } from '@src/grading/data/apiHook';
import messages from '@src/grading/messages';
import { renderWithIntl } from '@src/testUtils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    courseId: 'course-v1:edX+DemoX+Demo_Course',
  }),
}));

jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: jest.fn(),
}));

jest.mock('@src/grading/data/apiHook', () => ({
  useGradingConfiguration: jest.fn(),
}));

describe('GradingActionRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCourseInfo as jest.Mock).mockReturnValue({ data: { gradebookUrl: 'https://example.com/gradebook', studioGradingUrl: 'https://example.com/studio' } });
    // TODO: Update this mock to use similar structure when API is ready, currently just returning random text to ensure component renders without error
    (useGradingConfiguration as jest.Mock).mockReturnValue({ data: 'Some random text' });
  });

  it('renders ActionRow with gradebook and configuration buttons', () => {
    renderWithIntl(<GradingActionRow />);
    expect(screen.getByRole('link', { name: messages.viewGradebook.defaultMessage })).toBeInTheDocument();
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
