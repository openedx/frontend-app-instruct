import { defineMessages } from '@openedx/frontend-base';

const messages = defineMessages({
  courseTeamTitle: {
    id: 'instruct.courseTeam.page.title',
    defaultMessage: 'Course Team Management',
    description: 'Title for the course team page',
  },
  addTeamMember: {
    id: 'instruct.courseTeam.addTeamMember',
    defaultMessage: 'Add Team Member',
    description: 'Button label for adding a team member',
  },
  membersTab: {
    id: 'instruct.courseTeam.membersTab',
    defaultMessage: 'Members',
    description: 'Tab title for course team members',
  },
  rolesTab: {
    id: 'instruct.courseTeam.rolesTab',
    defaultMessage: 'Roles',
    description: 'Tab title for course team roles',
  },
  username: {
    id: 'instruct.courseTeam.username',
    defaultMessage: 'Username',
    description: 'Column header for team member username',
  },
  email: {
    id: 'instruct.courseTeam.email',
    defaultMessage: 'Email',
    description: 'Column header for team member email',
  },
  role: {
    id: 'instruct.courseTeam.role',
    defaultMessage: 'Role',
    description: 'Column header for team member role',
  },
  actions: {
    id: 'instruct.courseTeam.actions',
    defaultMessage: 'Actions',
    description: 'Column header for team member actions',
  },
  edit: {
    id: 'instruct.courseTeam.edit',
    defaultMessage: 'Edit',
    description: 'Button label for editing a team member',
  },
  noTeamMembers: {
    id: 'instruct.courseTeam.noTeamMembers',
    defaultMessage: 'No team members found.',
    description: 'Message displayed when there are no team members',
  },
});

export default messages;
