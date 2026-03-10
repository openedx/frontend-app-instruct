import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '@src/testUtils';
import CourseTeamPage from './CourseTeamPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ courseId: 'course-v1:test-course' })),
}));

jest.mock('./data/apiHook', () => ({
  useAddTeamMember: () => ({ mutate: jest.fn() }),
}));

// Mock the child components, each component should have its own test suite
jest.mock('./components/MembersContent', () => {
  return function MembersContent() {
    return <div>Members Content</div>;
  };
});

jest.mock('./components/RolesContent', () => {
  return function RolesContent() {
    return <div>Roles Content</div>;
  };
});

jest.mock('./components/AddTeamMemberModal', () => {
  return function AddTeamMemberModal() {
    return <div>Add Team Member Modal</div>;
  };
});

describe('CourseTeamPage', () => {
  it('renders the course team title', () => {
    renderWithIntl(<CourseTeamPage />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders the add team member button', () => {
    renderWithIntl(<CourseTeamPage />);
    expect(screen.getByRole('button', { name: /add team member/i })).toBeInTheDocument();
  });

  it('renders both tabs', () => {
    renderWithIntl(<CourseTeamPage />);
    expect(screen.getByRole('tab', { name: /members/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /roles/i })).toBeInTheDocument();
  });

  it('renders MembersContent by default', () => {
    renderWithIntl(<CourseTeamPage />);
    expect(screen.getByText('Members Content')).toBeInTheDocument();
  });

  it('has correct CSS classes on title', () => {
    renderWithIntl(<CourseTeamPage />);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveClass('text-primary-700', 'mb-0');
  });

  it('shows the AddTeamMemberModal when add button is clicked', async () => {
    renderWithIntl(<CourseTeamPage />);
    const button = screen.getByRole('button', { name: /add team member/i });
    const user = userEvent.setup();
    await user.click(button);
    expect(screen.getByText('Add Team Member Modal')).toBeInTheDocument();
  });

  it('renders RolesContent when Roles tab is selected', async () => {
    renderWithIntl(<CourseTeamPage />);
    const rolesTab = screen.getByRole('tab', { name: /roles/i });
    const user = userEvent.setup();
    await user.click(rolesTab);
    expect(screen.getByText('Roles Content')).toBeInTheDocument();
  });
});
