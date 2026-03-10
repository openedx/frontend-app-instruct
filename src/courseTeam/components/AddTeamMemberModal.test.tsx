import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import AddTeamMemberModal from './AddTeamMemberModal';
import messages from '../messages';
import { useRoles } from '../data/apiHook';

// Mocks
jest.mock('react-router-dom', () => ({
  useParams: () => ({ courseId: 'course-v1:test+id' }),
}));

jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: () => ({ data: { displayName: 'Test Course' } }),
}));

jest.mock('../data/apiHook', () => ({
  useRoles: jest.fn(),
}));

describe('AddTeamMemberModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRoles as jest.Mock).mockReturnValue({ data: [{ id: 'admin', name: 'Admin' }] });
  });

  it('renders modal with correct title and description', () => {
    renderWithIntl(<AddTeamMemberModal {...defaultProps} />);
    expect(screen.getByText(messages.addNewTeamMember.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.addNewTeamMemberDescription.defaultMessage.replace('{courseName}', 'Test Course'))).toBeInTheDocument();
  });

  it('renders users textarea and role select', () => {
    renderWithIntl(<AddTeamMemberModal {...defaultProps} />);
    expect(screen.getByLabelText(messages.addUsersLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.usersPlaceholder.defaultMessage)).toBeInTheDocument();
    expect(screen.getByLabelText(messages.roleLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.rolePlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    renderWithIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(messages.cancelButton.defaultMessage));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onSave when Save button is clicked', async () => {
    renderWithIntl(<AddTeamMemberModal {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByText(messages.saveButton.defaultMessage));
    expect(defaultProps.onSave).toHaveBeenCalledWith({ users: [''], role: '' });
  });

  it('does not render modal when isOpen is false', () => {
    renderWithIntl(<AddTeamMemberModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText(messages.addNewTeamMember.defaultMessage)).not.toBeInTheDocument();
  });

  it('disables role select when only placeholder role exists', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: [] });
    renderWithIntl(<AddTeamMemberModal {...defaultProps} />);
    expect(screen.getByLabelText(messages.roleLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.rolePlaceholder.defaultMessage)).toBeDisabled();
  });
});
