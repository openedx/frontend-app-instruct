import { useParams } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import { CohortProvider } from '@src/cohorts/components/CohortContext';
import EnabledCohortsView from '@src/cohorts/components/EnabledCohortsView';
import { useCohorts, useContentGroupsData } from '@src/cohorts/data/apiHook';
import messages from '@src/cohorts/messages';
import { AlertProvider } from '@src/components/AlertContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('@src/cohorts/data/apiHook', () => ({
  useCohorts: jest.fn(),
  useContentGroupsData: jest.fn(),
  useCreateCohort: () => ({ mutate: jest.fn() }),
  usePatchCohort: () => ({ mutate: jest.fn() }),
  useAddLearnersToCohort: () => ({ mutate: jest.fn() }),
}));

const mockCohorts = [
  { id: 1, name: 'Cohort 1' },
  { id: 2, name: 'Cohort 2' },
];

const mockContentGroups = [
  { id: '2', name: 'Group 1' },
  { id: '3', name: 'Group 2' },
];

describe('EnabledCohortsView', () => {
  const renderWithCohortProvider = () => renderWithIntl(<CohortProvider><AlertProvider><EnabledCohortsView /></AlertProvider></CohortProvider>);

  beforeEach(() => {
    jest.clearAllMocks();
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { allGroupConfigurations: [{ groups: mockContentGroups }] } });
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+Test+2024' });
  });

  it('renders select with placeholder and cohorts', () => {
    (useCohorts as jest.Mock).mockReturnValue({
      data: mockCohorts,
    });

    renderWithCohortProvider();
    expect(screen.getByText(messages.selectCohortPlaceholder.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(mockCohorts[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockCohorts[1].name)).toBeInTheDocument();
  });

  it('calls handleSelectCohort on select change', async () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: mockCohorts });
    renderWithCohortProvider();
    const select = screen.getByRole('combobox');
    const user = userEvent.setup();
    await user.selectOptions(select, '1');
    expect((select as HTMLSelectElement).value).toBe('1');
  });

  it('calls handleAddCohort on button click', async () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    renderWithCohortProvider();
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: `+ ${messages.addCohort.defaultMessage}` });
    await user.click(button);
    expect(screen.getByPlaceholderText(messages.cohortName.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.saveLabel.defaultMessage })).toBeInTheDocument();
  });

  it('renders correctly when no cohorts are returned', () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    renderWithCohortProvider();
    const cohortsOptions = screen.getAllByRole('option');
    expect(cohortsOptions.length).toBe(1);
    expect(cohortsOptions[0]).toHaveTextContent(messages.selectCohortPlaceholder.defaultMessage);
  });

  it('uses default courseId if not present in params', () => {
    (useParams as jest.Mock).mockReturnValue({});
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    renderWithCohortProvider();
    expect(useCohorts).toHaveBeenCalledWith('');
  });
});
