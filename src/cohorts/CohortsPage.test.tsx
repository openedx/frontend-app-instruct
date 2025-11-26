import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CohortsPage from './CohortsPage';
import { useCohorts, useDisableCohorts, useEnableCohorts } from '../data/apiHook';
import { renderWithIntl } from '../testUtils';
import messages from './messages';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('../data/apiHook', () => ({
  useCohorts: jest.fn(),
  useEnableCohorts: jest.fn(),
  useDisableCohorts: jest.fn(),
}));

describe('CohortsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cohorts list and add button when cohorts exist', () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [{ id: '1', name: 'Cohort 1' }] });
    (useEnableCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (useDisableCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    renderWithIntl(<CohortsPage />);
    expect(screen.getByText(messages.cohortsTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cohort 1' })).toBeInTheDocument();
    expect(screen.getByText(`+ ${messages.addCohort.defaultMessage}`)).toBeInTheDocument();
  });

  it('renders no cohorts message and enable button when no cohorts', () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    (useEnableCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (useDisableCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    renderWithIntl(<CohortsPage />);
    expect(screen.getByText(messages.noCohortsMessage.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.enableCohorts.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: messages.learnMore.defaultMessage })).toBeInTheDocument();
  });

  it('calls enableCohortsMutate when enable button is clicked', async () => {
    const enableMock = jest.fn();
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    (useEnableCohorts as jest.Mock).mockReturnValue({ mutate: enableMock });
    (useDisableCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    renderWithIntl(<CohortsPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.enableCohorts.defaultMessage }));
    expect(enableMock).toHaveBeenCalled();
  });

  it('opens and closes the disable cohorts modal', async () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [{ id: '1', name: 'Cohort 1' }] });
    (useEnableCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (useDisableCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    renderWithIntl(<CohortsPage />);
    const user = userEvent.setup();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    screen.debug();
    await user.click(screen.getByRole('button', { name: messages.disableCohorts.defaultMessage }));
    expect(screen.getByRole('dialog', { name: messages.disableCohorts.defaultMessage })).toBeInTheDocument();
  });

  it('calls disableCohortsMutate and closes modal on confirm', async () => {
    const disableMock = jest.fn();
    (useCohorts as jest.Mock).mockReturnValue({ data: [{ id: '1', name: 'Cohort 1' }] });
    (useEnableCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });
    (useDisableCohorts as jest.Mock).mockReturnValue({ mutate: disableMock });

    renderWithIntl(<CohortsPage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.disableCohorts.defaultMessage }));
  });
});
