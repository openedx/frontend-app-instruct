import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CohortsForm from './CohortsForm';
import messages from '../messages';
import { renderWithIntl } from '../../testUtils';
import { useContentGroupsData } from '../data/apiHook';
import { CohortProvider } from './CohortContext';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ courseId: 'course-v1:edX+DemoX+Demo_Course' }),
}));

const mockContentGroups = [
  { id: '1', displayName: 'Group 1' },
  { id: '2', displayName: 'Group 2' },
];

jest.mock('../data/apiHook', () => ({
  useContentGroupsData: jest.fn(),
}));

describe('CohortsForm', () => {
  const onCancel = jest.fn();
  const onSubmit = jest.fn();

  const renderComponent = () =>
    renderWithIntl(
      <CohortProvider>
        <CohortsForm onCancel={onCancel} onSubmit={onSubmit} />
      </CohortProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cohort name input', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: mockContentGroups });
    renderComponent();
    expect(screen.getByPlaceholderText(messages.cohortName.defaultMessage)).toBeInTheDocument();
  });

  it('renders assignment method radios', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: mockContentGroups });
    renderComponent();
    expect(screen.getByLabelText(messages.automatic.defaultMessage)).toBeInTheDocument();
    expect(screen.getByLabelText(messages.manual.defaultMessage)).toBeInTheDocument();
  });

  it('renders content group radios and select', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: mockContentGroups });
    renderComponent();
    expect(screen.getByLabelText(messages.noContentGroup.defaultMessage)).toBeInTheDocument();
    expect(screen.getByLabelText(messages.selectAContentGroup.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(mockContentGroups[0].displayName)).toBeInTheDocument();
    expect(screen.getByText(mockContentGroups[1].displayName)).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: mockContentGroups });
    renderComponent();
    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: messages.cancelLabel.defaultMessage });
    await user.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onSubmit when Save button is clicked', async () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: mockContentGroups });
    renderComponent();
    const user = userEvent.setup();
    await user.click(screen.getByText(messages.saveLabel.defaultMessage));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('updates cohort name input value', async () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: mockContentGroups });
    renderComponent();
    const input = screen.getByPlaceholderText(messages.cohortName.defaultMessage);
    const user = userEvent.setup();
    await user.type(input, 'Test Cohort');
    expect(input).toHaveValue('Test Cohort');
  });

  it('disables select when "Select a Content Group" is not chosen', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: mockContentGroups });
    renderComponent();
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    fireEvent.click(screen.getByLabelText(messages.selectAContentGroup.defaultMessage));
    expect(select).not.toBeDisabled();
  });

  it('renders warning and create link when no content groups', () => {
    (useContentGroupsData as jest.Mock).mockReturnValue({ data: [] });
    renderComponent();
    expect(screen.getByText(messages.noContentGroups.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.createContentGroup.defaultMessage)).toBeInTheDocument();
  });
});
