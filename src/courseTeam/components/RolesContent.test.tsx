import { screen } from '@testing-library/react';
import { renderWithIntl } from '@src/testUtils';
import RolesContent, { rolesOrder } from './RolesContent';
import messages from '../messages';
import { useRoles } from '../data/apiHook';

jest.mock('../data/apiHook', () => ({
  useRoles: jest.fn(),
}));

const mockRoles = rolesOrder.map((role) => ({ id: role, name: messages[role].defaultMessage }));

describe('RolesContent', () => {
  it('renders all roles in the correct order with their descriptions', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: mockRoles });
    renderWithIntl(<RolesContent />);

    rolesOrder.forEach((role) => {
      expect(screen.getByText(messages[role].defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages[`${role}Description`].defaultMessage)).toBeInTheDocument();
    });
  });

  it('does not render CCX Coach role when isCCXCoachEnabled is false', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: mockRoles });
    renderWithIntl(<RolesContent />);
    expect(screen.queryByText(messages.ccxCoach.defaultMessage)).not.toBeInTheDocument();
    expect(screen.queryByText(messages.ccxCoachDescription.defaultMessage)).not.toBeInTheDocument();
  });

  it('renders correct number of role sections', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: mockRoles });
    renderWithIntl(<RolesContent />);
    // There are 9 roles in rolesOrder
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(9);
  });

  it('renders CCX Coach role when isCCXCoachEnabled is true', () => {
    (useRoles as jest.Mock).mockReturnValue({ data: [...mockRoles, { id: 'ccxCoach', name: messages.ccxCoach.defaultMessage }] });

    renderWithIntl(<RolesContent />);
    expect(screen.getByText(messages.ccxCoach.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.ccxCoachDescription.defaultMessage)).toBeInTheDocument();
  });
});
