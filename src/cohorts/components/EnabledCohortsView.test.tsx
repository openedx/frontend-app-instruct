import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useParams } from 'react-router-dom';
import { renderWithIntl } from '../../testUtils';
import { useCohorts, useContentGroupsData } from '../data/apiHook';
import messages from '../messages';
import EnabledCohortsView from './EnabledCohortsView';
import { CohortProvider } from './CohortContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

jest.mock('../data/apiHook', () => ({
  useCohorts: jest.fn(),
  useContentGroupsData: jest.fn(),
  useCreateCohort: () => ({ mutate: jest.fn() }),
}));

const mockCohorts = [
  { id: 1, name: 'Cohort 1' },
  { id: 2, name: 'Cohort 2' },
];

describe('EnabledCohortsView', () => {
  const renderWithCohortProvider = () => renderWithIntl(<CohortProvider><EnabledCohortsView /></CohortProvider>);

  beforeEach(() => {
    jest.clearAllMocks();
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

  // TODO: Modify test when add functionality to select
  it('calls handleSelectCohort on select change', () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: mockCohorts });
    renderWithCohortProvider();
  });

  // TODO: Modify test when add functionality to button
  it('calls handleAddCohort on button click', async () => {
    (useCohorts as jest.Mock).mockReturnValue({ data: [] });
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: [] });
    renderWithCohortProvider();
    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: `+ ${messages.addCohort.defaultMessage}` });
    await user.click(button);
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
