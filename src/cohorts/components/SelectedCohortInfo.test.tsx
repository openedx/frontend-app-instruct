import { screen } from '@testing-library/react';
import SelectedCohortInfo from './SelectedCohortInfo';
import messages from '../messages';
import dataDownloadsMessages from '@src/dataDownloads/messages';
import { renderWithAlertAndIntl } from '@src/testUtils';
import * as CohortContextModule from '@src/cohorts/components/CohortContext';
import { CohortProvider } from './CohortContext';
import { useCohorts, useContentGroupsData } from '../data/apiHook';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+DemoX+Demo_Course' }),
}));

const mockCohorts = [
  {
    id: 1,
    name: 'Initial Cohort',
    assignmentType: 'manual',
    groupId: 2,
    userPartitionId: 3,
    userCount: 0
  },
  { id: 2, name: 'Cohort 2',
    assignmentType: 'automatic',
    groupId: null,
    userPartitionId: null,
    userCount: 5
  },
];

const mockContentGroups = [
  { id: '2', name: 'Group 1' },
  { id: '3', name: 'Group 2' },
];

jest.mock('@src/cohorts/data/apiHook', () => ({
  useCohorts: jest.fn(),
  useContentGroupsData: jest.fn(),
  useCreateCohort: () => ({ mutate: jest.fn() }),
  usePatchCohort: () => ({ mutate: jest.fn() }),
  useAddLearnersToCohort: () => ({ mutate: jest.fn() }),
}));

function renderWithProviders() {
  return renderWithAlertAndIntl(
    <CohortProvider>
      <SelectedCohortInfo />
    </CohortProvider>
  );
}

describe('SelectedCohortInfo', () => {
  beforeEach(() => {
    (useCohorts as jest.Mock).mockReturnValue({ data: mockCohorts });
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { allGroupConfigurations: [{ groups: mockContentGroups }] } });
    jest.spyOn(CohortContextModule, 'useCohortContext').mockReturnValue({
      selectedCohort: mockCohorts[0],
      setSelectedCohort: jest.fn(),
      clearSelectedCohort: jest.fn(),
      updateCohortField: jest.fn(),
    });
  });

  it('if a cohort is selected renders CohortCard', () => {
    renderWithProviders();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: messages.manageLearners.defaultMessage })).toBeInTheDocument();
  });

  it('renders cohort disclaimer message', () => {
    renderWithProviders();
    expect(screen.getByText(new RegExp(messages.cohortDisclaimer.defaultMessage))).toBeInTheDocument();
  });

  it('renders data downloads hyperlink with correct destination', () => {
    renderWithProviders();
    const link = screen.getByRole('link', { name: dataDownloadsMessages.pageTitle.defaultMessage });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/instructor/course-v1:edX+DemoX+Demo_Course/data_downloads');
  });
});
