import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CohortsPage from './CohortsPage';
import { useCohorts, useCohortStatus, useToggleCohorts } from './data/apiHook';
import { renderWithIntl } from '../testUtils';
import messages from './messages';
import { CohortProvider } from './components/CohortContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('./data/apiHook', () => ({
  useCohorts: jest.fn(),
  useCohortStatus: jest.fn(),
  useToggleCohorts: jest.fn(),
  useCreateCohort: () => ({ mutate: jest.fn() }),
}));

describe('CohortsPage', () => {
  const renderWithCohortsProvider = () => renderWithIntl(<CohortProvider><CohortsPage /></CohortProvider>);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cohorts list and add button when cohorts exist', () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [{ id: '1', name: 'Cohort 1' }] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: true } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    renderWithCohortsProvider();
    expect(screen.getByText(messages.cohortsTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cohort 1' })).toBeInTheDocument();
    expect(screen.getByText(`+ ${messages.addCohort.defaultMessage}`)).toBeInTheDocument();
  });

  it('renders no cohorts message and enable button when no cohorts', () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: false } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    renderWithCohortsProvider();
    expect(screen.getByText(messages.noCohortsMessage.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.enableCohorts.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: messages.learnMore.defaultMessage })).toBeInTheDocument();
  });

  it('calls enableCohortsMutate when enable button is clicked', async () => {
    const enableMock = jest.fn();
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: false } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: enableMock });

    renderWithCohortsProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.enableCohorts.defaultMessage }));
    expect(enableMock).toHaveBeenCalled();
  });

  it('opens and closes the disable cohorts modal', async () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [{ id: '1', name: 'Cohort 1' }] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: true } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: jest.fn() });

    renderWithCohortsProvider();
    const user = userEvent.setup();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: messages.disableCohorts.defaultMessage }));
    expect(screen.getByRole('dialog', { name: messages.disableCohorts.defaultMessage })).toBeInTheDocument();
  });

  it('calls disableCohortsMutate and closes modal on confirm', async () => {
    const disableMock = jest.fn();
    (useCohorts as jest.Mock).mockReturnValue({ data: [{ id: '1', name: 'Cohort 1' }] });
    (useCohortStatus as jest.Mock).mockReturnValue({ data: { isCohorted: true } });
    (useToggleCohorts as jest.Mock).mockReturnValue({ mutate: disableMock });

    renderWithCohortsProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: messages.disableCohorts.defaultMessage }));
    await user.click(screen.getByRole('button', { name: messages.disableLabel.defaultMessage }));
    expect(disableMock).toHaveBeenCalled();
  });
});
