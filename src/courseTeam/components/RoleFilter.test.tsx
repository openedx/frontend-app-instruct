import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoleFilter from '@src/courseTeam/components/RoleFilter';
import { useRoles } from '@src/courseTeam/data/apiHook';
import messages from '@src/courseTeam/messages';
import { renderWithIntl } from '@src/testUtils';

// Mocks
jest.mock('react-router-dom', () => ({
  useParams: () => ({ courseId: 'course-v1:test+course+run' }),
}));

jest.mock('@src/courseTeam/data/apiHook', () => ({
  useRoles: jest.fn(),
}));

const mockRoles = [
  { role: 'instructor', displayName: 'Instructor' },
  { role: 'staff', displayName: 'Staff' },
  { role: 'admin', displayName: 'Admin' },
  { role: 'beta_testers', displayName: 'Beta Testers' },
  { role: 'data_researcher', displayName: 'Data Researcher' },
];

describe('RoleFilter', () => {
  const mockSetFilter = jest.fn();
  const defaultProps = {
    column: {
      filterValue: '',
      setFilter: mockSetFilter,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with data loaded', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: { results: mockRoles } });

    renderWithIntl(<RoleFilter {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).not.toBeDisabled();
  });

  it('renders disabled when data is not loaded', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: null });

    renderWithIntl(<RoleFilter {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toBeDisabled();
  });

  it('displays "All Roles" as the first option', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: { results: mockRoles } });

    renderWithIntl(<RoleFilter {...defaultProps} />);

    const allRolesOption = screen.getByRole('option', { name: messages.allRoles.defaultMessage });
    expect(allRolesOption).toBeInTheDocument();
    expect(allRolesOption).toHaveValue('');
  });

  it('displays role options from API data', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: { results: mockRoles } });

    renderWithIntl(<RoleFilter {...defaultProps} />);

    mockRoles.forEach((role) => {
      const roleOption = screen.getByRole('option', { name: role.displayName });
      expect(roleOption).toBeInTheDocument();
      expect(roleOption).toHaveValue(role.role);
    });
  });

  it('displays current filter value as selected', () => {
    const propsWithFilterValue = {
      column: {
        filterValue: 'staff',
        setFilter: mockSetFilter,
      },
    };

    (useRoles as jest.Mock).mockReturnValue({ data: { results: mockRoles } });

    renderWithIntl(<RoleFilter {...propsWithFilterValue} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveValue('staff');
  });

  it('calls setFilter when option is selected', async () => {
    const user = userEvent.setup();
    (useRoles as jest.Mock).mockReturnValue({ data: { results: mockRoles } });

    renderWithIntl(<RoleFilter {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    await user.selectOptions(selectElement, 'instructor');

    expect(mockSetFilter).toHaveBeenCalledWith('instructor');
  });

  it('calls setFilter with empty string when "All Roles" is selected', async () => {
    const user = userEvent.setup();
    const propsWithFilterValue = {
      column: {
        filterValue: 'staff',
        setFilter: mockSetFilter,
      },
    };

    (useRoles as jest.Mock).mockReturnValue({ data: { results: mockRoles } });

    renderWithIntl(<RoleFilter {...propsWithFilterValue} />);

    const selectElement = screen.getByRole('combobox');
    await user.selectOptions(selectElement, '');

    expect(mockSetFilter).toHaveBeenCalledWith('');
  });

  it('handles empty roles array gracefully', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: { results: [] } });

    renderWithIntl(<RoleFilter {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).not.toBeDisabled();

    // Should still have "All Roles" option
    const allRolesOption = screen.getByRole('option', { name: messages.allRoles.defaultMessage });
    expect(allRolesOption).toBeInTheDocument();

    // Should not have any other options
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
  });

  it('handles undefined results gracefully', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: { results: undefined } });

    renderWithIntl(<RoleFilter {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).not.toBeDisabled();

    // Should still have "All Roles" option
    const allRolesOption = screen.getByRole('option', { name: messages.allRoles.defaultMessage });
    expect(allRolesOption).toBeInTheDocument();

    // Should not have any other options
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
  });

  it('includes filter icon as leading element', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: { results: mockRoles } });

    renderWithIntl(<RoleFilter {...defaultProps} />);

    // The icon is rendered as a leading element, we can check it exists by looking for the svg
    const iconElement = document.querySelector('svg');
    expect(iconElement).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: { results: mockRoles } });

    renderWithIntl(<RoleFilter {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toHaveAttribute('name', 'role');
  });
});
