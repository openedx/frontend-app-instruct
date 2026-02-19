import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectedCohortInfo from './SelectedCohortInfo';
import messages from '../messages';
import dataDownloadsMessages from '@src/dataDownloads/messages';
import { renderWithAlertAndIntl } from '@src/testUtils';
import * as CohortContextModule from '@src/cohorts/components/CohortContext';
import { CohortProvider } from './CohortContext';
import { useCohorts, useContentGroupsData } from '../data/apiHook';
import { assignmentTypes } from '../constants';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+DemoX+Demo_Course' }),
}));

const mockCohorts = [
  {
    id: 1,
    name: 'Initial Cohort',
    assignmentType: assignmentTypes.manual,
    groupId: 2,
    userPartitionId: 3,
    userCount: 0
  },
  {
    id: 2,
    name: 'Cohort 2',
    assignmentType: assignmentTypes.automatic,
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
  const mockSetSelectedCohort = jest.fn();
  const mockClearSelectedCohort = jest.fn();
  const mockUpdateCohortField = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCohorts as jest.Mock).mockReturnValue({ data: mockCohorts });
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: { groups: mockContentGroups, id: 1 } });
    jest.spyOn(CohortContextModule, 'useCohortContext').mockReturnValue({
      selectedCohort: mockCohorts[0],
      setSelectedCohort: mockSetSelectedCohort,
      clearSelectedCohort: mockClearSelectedCohort,
      updateCohortField: mockUpdateCohortField,
    });
  });

  describe('Basic Rendering with Selected Cohort', () => {
    it('renders CohortCard when a cohort is selected', () => {
      renderWithProviders();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: messages.manageLearners.defaultMessage })).toBeInTheDocument();
    });

    it('renders data downloads hyperlink with correct destination', () => {
      renderWithProviders();
      const link = screen.getByRole('link', { name: dataDownloadsMessages.pageTitle.defaultMessage });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/instructor/course-v1:edX+DemoX+Demo_Course/data_downloads');
    });

    it('renders complete disclaimer paragraph with correct structure', () => {
      renderWithProviders();
      const paragraph = screen.getByText(new RegExp(messages.cohortDisclaimer.defaultMessage)).closest('p');
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toHaveTextContent(messages.cohortDisclaimer.defaultMessage);
      expect(paragraph).toHaveTextContent(dataDownloadsMessages.pageTitle.defaultMessage);
      expect(paragraph).toHaveTextContent(messages.page.defaultMessage);
    });
  });

  describe('No Selected Cohort', () => {
    it('still renders disclaimer when no cohort is selected', () => {
      jest.spyOn(CohortContextModule, 'useCohortContext').mockReturnValue({
        selectedCohort: null,
        setSelectedCohort: mockSetSelectedCohort,
        clearSelectedCohort: mockClearSelectedCohort,
        updateCohortField: mockUpdateCohortField,
      });

      renderWithProviders();
      expect(screen.getByText(new RegExp(messages.cohortDisclaimer.defaultMessage))).toBeInTheDocument();
      expect(screen.getByRole('link', { name: dataDownloadsMessages.pageTitle.defaultMessage })).toBeInTheDocument();
    });

    it('do not render CohortCard component even when no cohort selected', () => {
      jest.spyOn(CohortContextModule, 'useCohortContext').mockReturnValue({
        selectedCohort: null,
        setSelectedCohort: mockSetSelectedCohort,
        clearSelectedCohort: mockClearSelectedCohort,
        updateCohortField: mockUpdateCohortField,
      });

      renderWithProviders();
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    });
  });

  describe('Integration with CohortCard', () => {
    it('renders with manual cohort type and content group', async () => {
      jest.spyOn(CohortContextModule, 'useCohortContext').mockReturnValue({
        selectedCohort: mockCohorts[0],
        setSelectedCohort: mockSetSelectedCohort,
        clearSelectedCohort: mockClearSelectedCohort,
        updateCohortField: mockUpdateCohortField,
      });

      renderWithProviders();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText(messages.manualCohortWarning.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(messages.cohortDisclaimer.defaultMessage))).toBeInTheDocument();
      const settingsTab = screen.getByRole('tab', { name: 'Settings' });
      await userEvent.click(settingsTab);
      const selectElement = screen.getByRole('combobox');
      expect(selectElement).toHaveValue('2');
    });

    it('renders with automatic cohort type and without content group', () => {
      jest.spyOn(CohortContextModule, 'useCohortContext').mockReturnValue({
        selectedCohort: mockCohorts[1],
        setSelectedCohort: mockSetSelectedCohort,
        clearSelectedCohort: mockClearSelectedCohort,
        updateCohortField: mockUpdateCohortField,
      });

      renderWithProviders();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByText(messages.automaticCohortWarning.defaultMessage)).toBeInTheDocument();
    });
  });
});
