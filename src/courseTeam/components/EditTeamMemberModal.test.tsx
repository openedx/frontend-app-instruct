import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditTeamMemberModal from '@src/courseTeam/components/EditTeamMemberModal';
import { useRoles, useAddTeamMember, useRemoveTeamMember } from '@src/courseTeam/data/apiHook';
import messages from '@src/courseTeam/messages';
import { CourseTeamMember } from '@src/courseTeam/types';
import { renderWithAlertAndIntl } from '@src/testUtils';

// Mocks
jest.mock('react-router-dom', () => ({
  useParams: () => ({ courseId: 'course-v1:test+course+run' }),
}));

jest.mock('@src/courseTeam/data/apiHook', () => ({
  useRoles: jest.fn(),
  useAddTeamMember: jest.fn(() => ({ mutate: jest.fn() })),
  useRemoveTeamMember: jest.fn(() => ({ mutate: jest.fn() })),
}));

const mockUser: CourseTeamMember = {
  username: 'test_user',
  fullName: 'Test User',
  email: 'test@example.com',
  roles: [{ role: 'staff', displayName: 'Staff' }, { role: 'admin', displayName: 'Admin' }],
};

const mockRoles = [
  { role: 'instructor', displayName: 'Instructor' },
  { role: 'staff', displayName: 'Staff' },
  { role: 'admin', displayName: 'Admin' },
  { role: 'beta_testers', displayName: 'Beta Testers' },
  { role: 'data_researcher', displayName: 'Data Researcher' },
];

describe('EditTeamMemberModal', () => {
  const defaultProps = {
    isOpen: true,
    user: mockUser,
    onClose: jest.fn(),
  };

  const mockAddTeamMember = jest.fn();
  const mockRemoveTeamMember = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRoles as jest.Mock).mockReturnValue({ data: { results: mockRoles } });
    (useAddTeamMember as jest.Mock).mockReturnValue({ mutate: mockAddTeamMember });
    (useRemoveTeamMember as jest.Mock).mockReturnValue({ mutate: mockRemoveTeamMember });
  });

  it('renders modal with correct title', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const expectedTitle = messages.editTeamTitle.defaultMessage.replace('{username}', mockUser.username);
    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });

  it('renders modal header and body correctly', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const expectedTitle = messages.editTeamTitle.defaultMessage.replace('{username}', mockUser.username);
    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });

  it('renders edit instructions with username', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const expectedInstructions = messages.editInstructions.defaultMessage.replace('{username}', mockUser.username);
    expect(screen.getByText(expectedInstructions)).toBeInTheDocument();
  });

  it('renders current user roles as checkboxes that are initially checked', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    mockUser.roles.forEach((role) => {
      const checkbox = screen.getByRole('checkbox', { name: role.displayName });
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });
  });

  it('renders add role label', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    expect(screen.getByText(messages.addRole.defaultMessage)).toBeInTheDocument();
  });

  it('renders role selection dropdown with filtered roles', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    // Verify select is present
    expect(screen.getByRole('option', { name: messages.rolePlaceholder.defaultMessage })).toBeInTheDocument();

    // Verify only roles not already assigned to user are available
    const availableRoles = mockRoles.filter(role => !mockUser.roles.some(userRole => userRole.role === role.role));
    availableRoles.forEach((role) => {
      expect(screen.getByRole('option', { name: role.displayName })).toBeInTheDocument();
    });

    // Verify user's current roles are not in the dropdown options
    mockUser.roles.forEach((userRole) => {
      const roleInMockData = mockRoles.find(role => role.role === userRole.role);
      if (roleInMockData) {
        expect(screen.queryByRole('option', { name: roleInMockData.displayName })).not.toBeInTheDocument();
      }
    });
  });

  it('renders cancel and save buttons', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: messages.cancelButton.defaultMessage })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: messages.saveButton.defaultMessage })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const mockOnClose = jest.fn();
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} onClose={mockOnClose} />);

    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: messages.cancelButton.defaultMessage });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when save button is clicked', async () => {
    const mockOnClose = jest.fn();
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} onClose={mockOnClose} />);

    const user = userEvent.setup();
    const saveButton = screen.getByRole('button', { name: messages.saveButton.defaultMessage });
    await user.click(saveButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} isOpen={false} />);

    const expectedTitle = messages.editTeamTitle.defaultMessage.replace('{username}', mockUser.username);
    expect(screen.queryByText(expectedTitle)).not.toBeInTheDocument();
  });

  it('renders correctly when no roles data is available', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: [] });
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    // Should only show placeholder in dropdown
    expect(screen.getByText(messages.rolePlaceholder.defaultMessage)).toBeInTheDocument();

    // Select should be disabled when no roles are available
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeDisabled();

    // Should still show current user roles as checkboxes that are checked
    mockUser.roles.forEach((role) => {
      const checkbox = screen.getByRole('checkbox', { name: role.displayName });
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });
  });

  it('renders correctly when useRoles returns undefined data', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: undefined });
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    // Should only show placeholder in dropdown
    expect(screen.getByText(messages.rolePlaceholder.defaultMessage)).toBeInTheDocument();

    // Select should be disabled when no roles are available
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeDisabled();

    // Should still show current user roles as checkboxes that are checked
    mockUser.roles.forEach((role) => {
      const checkbox = screen.getByRole('checkbox', { name: role.displayName });
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });
  });

  it('handles user with all available roles assigned', () => {
    const userWithAllRoles = {
      ...mockUser,
      roles: mockRoles.map(role => ({ role: role.role, displayName: role.displayName })),
    };
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} user={userWithAllRoles} />);

    // Should show all roles as checkboxes that are checked
    userWithAllRoles.roles.forEach((role) => {
      const checkbox = screen.getByRole('checkbox', { name: role.displayName });
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });

    // Dropdown should only have placeholder since all roles are assigned
    expect(screen.getByText(messages.rolePlaceholder.defaultMessage)).toBeInTheDocument();
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1); // Only placeholder option
  });

  it('enables select when roles are available for assignment', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    // Should be enabled when there are roles available to assign
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).not.toBeDisabled();
  });

  it('handles checkbox interactions for keeping/removing roles', async () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const user = userEvent.setup();
    const staffCheckbox = screen.getByRole('checkbox', { name: 'Staff' });

    // Initially checked (role will be kept)
    expect(staffCheckbox).toBeChecked();

    // Uncheck to mark role for removal
    await user.click(staffCheckbox);
    expect(staffCheckbox).not.toBeChecked();

    // Check again to keep the role
    await user.click(staffCheckbox);
    expect(staffCheckbox).toBeChecked();
  });

  it('handles role selection from dropdown', async () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const user = userEvent.setup();
    const selectElement = screen.getByRole('combobox');

    // Select a role
    await user.selectOptions(selectElement, 'instructor');
    expect(selectElement).toHaveValue('instructor');
  });

  it('calls addTeamMember when save is clicked with selected role', async () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const user = userEvent.setup();
    const selectElement = screen.getByRole('combobox');
    const saveButton = screen.getByRole('button', { name: messages.saveButton.defaultMessage });

    // Select a role and save
    await user.selectOptions(selectElement, 'instructor');
    await user.click(saveButton);

    expect(mockAddTeamMember).toHaveBeenCalledWith({
      identifiers: [mockUser.username],
      role: 'instructor',
    }, expect.any(Object));
  });

  it('calls removeTeamMember when save is clicked with roles unchecked for removal', async () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const user = userEvent.setup();
    const staffCheckbox = screen.getByRole('checkbox', { name: 'Staff' });
    const saveButton = screen.getByRole('button', { name: messages.saveButton.defaultMessage });

    // Initially checked, uncheck to mark role for removal
    expect(staffCheckbox).toBeChecked();
    await user.click(staffCheckbox);
    await user.click(saveButton);

    expect(mockRemoveTeamMember).toHaveBeenCalledWith({
      identifier: mockUser.username,
      roles: ['staff'],
    }, expect.any(Object));
  });

  it('calls both addTeamMember and removeTeamMember when both actions are needed', async () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const user = userEvent.setup();
    const selectElement = screen.getByRole('combobox');
    const staffCheckbox = screen.getByRole('checkbox', { name: 'Staff' });
    const saveButton = screen.getByRole('button', { name: messages.saveButton.defaultMessage });

    // Select a new role and uncheck existing role for removal
    await user.selectOptions(selectElement, 'instructor');
    expect(staffCheckbox).toBeChecked();
    await user.click(staffCheckbox);
    await user.click(saveButton);

    expect(mockAddTeamMember).toHaveBeenCalledWith({
      identifiers: [mockUser.username],
      role: 'instructor'
    }, expect.any(Object));
    expect(mockRemoveTeamMember).toHaveBeenCalledWith({
      identifier: mockUser.username,
      roles: ['staff']
    }, expect.any(Object));
  });

  it('does not call addTeamMember when no role is selected', async () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const user = userEvent.setup();
    const saveButton = screen.getByRole('button', { name: messages.saveButton.defaultMessage });

    // Save without selecting a role
    await user.click(saveButton);

    expect(mockAddTeamMember).not.toHaveBeenCalled();
  });

  it('does not call removeTeamMember when all roles remain checked', async () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const user = userEvent.setup();
    const saveButton = screen.getByRole('button', { name: messages.saveButton.defaultMessage });

    // Save without unchecking any roles (all remain checked/kept)
    await user.click(saveButton);

    expect(mockRemoveTeamMember).not.toHaveBeenCalled();
  });

  it('handles multiple role unchecking for removal', async () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const user = userEvent.setup();
    const staffCheckbox = screen.getByRole('checkbox', { name: 'Staff' });
    const adminCheckbox = screen.getByRole('checkbox', { name: 'Admin' });
    const saveButton = screen.getByRole('button', { name: messages.saveButton.defaultMessage });

    // Initially both are checked, uncheck both to remove them
    expect(staffCheckbox).toBeChecked();
    expect(adminCheckbox).toBeChecked();
    await user.click(staffCheckbox);
    await user.click(adminCheckbox);
    await user.click(saveButton);

    expect(mockRemoveTeamMember).toHaveBeenCalledWith({
      identifier: mockUser.username,
      roles: ['staff', 'admin']
    }, expect.any(Object));
  });

  it('handles role selection with empty string value', async () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const user = userEvent.setup();
    const selectElement = screen.getByRole('combobox');
    const saveButton = screen.getByRole('button', { name: messages.saveButton.defaultMessage });

    // Select placeholder (empty value) and save
    await user.selectOptions(selectElement, '');
    await user.click(saveButton);

    expect(mockAddTeamMember).not.toHaveBeenCalled();
  });

  it('renders correct number of user roles as checkboxes', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(mockUser.roles.length);
  });

  it('filters out user current roles from dropdown options', () => {
    renderWithAlertAndIntl(<EditTeamMemberModal {...defaultProps} />);

    // Should have placeholder + available roles (not user's current roles)
    const expectedAvailableRoles = mockRoles.filter(role =>
      !mockUser.roles.some(userRole => userRole.role === role.role)
    );

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(expectedAvailableRoles.length + 1); // +1 for placeholder
  });
});
