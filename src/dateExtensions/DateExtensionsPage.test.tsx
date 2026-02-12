import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateExtensionsPage from './DateExtensionsPage';
import { useDateExtensions, useGradedSubsections, useAddDateExtensionMutation, useResetDateExtensionMutation } from './data/apiHook';
import { renderWithAlertAndIntl } from '@src/testUtils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    courseId: 'course-v1:edX+DemoX+Demo_Course',
  }),
}));

jest.mock('./data/apiHook', () => ({
  useDateExtensions: jest.fn(),
  useResetDateExtensionMutation: jest.fn(),
  useAddDateExtensionMutation: jest.fn(() => ({ mutate: jest.fn() })),
  useGradedSubsections: jest.fn(),
}));

const mockDateExtensions = [
  {
    id: 1,
    username: 'edByun',
    fullName: 'Ed Byun',
    email: 'ed.byun@example.com',
    unitTitle: 'Three body diagrams',
    extendedDueDate: '2026-07-15'
  },
];

const mockGradedSubsections = [
  {
    subsectionId: 'subsection-1block-v1:edX+DemoX+2015+type@problem+block@618c5933b8b544e4a4cc103d3e508378',
    displayName: 'Three body diagrams'
  }
];

const mutateMock = jest.fn();

describe('DateExtensionsPage', () => {
  beforeEach(() => {
    (useDateExtensions as jest.Mock).mockReturnValue({
      data: { count: mockDateExtensions.length, results: mockDateExtensions },
      isLoading: false,
    });
    (useResetDateExtensionMutation as jest.Mock).mockReturnValue({
      mutate: mutateMock,
    });
    (useAddDateExtensionMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });
    (useGradedSubsections as jest.Mock).mockReturnValue({
      data: { items: mockGradedSubsections },
      isLoading: false,
    });
  });

  it('renders page title', () => {
    renderWithAlertAndIntl(<DateExtensionsPage />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders add extension button', () => {
    renderWithAlertAndIntl(<DateExtensionsPage />);
    expect(screen.getByRole('button', { name: /add individual extension/i })).toBeInTheDocument();
  });

  it('renders date extensions list', () => {
    renderWithAlertAndIntl(<DateExtensionsPage />);
    expect(screen.getByText('Ed Byun')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Three body diagrams' })).toBeInTheDocument();
  });

  it('shows loading state on table when fetching data', () => {
    (useDateExtensions as jest.Mock).mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: true,
    });
    renderWithAlertAndIntl(<DateExtensionsPage />);
    expect(document.querySelectorAll('.react-loading-skeleton')).toHaveLength(6);
  });

  it('renders reset link for each row', () => {
    renderWithAlertAndIntl(<DateExtensionsPage />);
    const resetLinks = screen.getAllByRole('button', { name: 'Reset Extensions' });
    expect(resetLinks).toHaveLength(mockDateExtensions.length);
  });

  it('opens reset modal when reset button is clicked', async () => {
    renderWithAlertAndIntl(<DateExtensionsPage />);
    const user = userEvent.setup();
    const resetButton = screen.getByRole('button', { name: 'Reset Extensions' });
    await user.click(resetButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/reset extensions for/i)).toBeInTheDocument();
    const confirmButton = screen.getByRole('button', { name: /reset due date/i });
    expect(confirmButton).toBeInTheDocument();
  });

  it('calls reset mutation when confirm reset is clicked', async () => {
    renderWithAlertAndIntl(<DateExtensionsPage />);
    const user = userEvent.setup();
    const resetButton = screen.getByRole('button', { name: 'Reset Extensions' });
    await user.click(resetButton);
    const confirmButton = screen.getByRole('button', { name: /reset due date/i });
    await user.click(confirmButton);
    expect(mutateMock).toHaveBeenCalled();
  });

  it('closes reset modal when cancel is clicked', async () => {
    renderWithAlertAndIntl(<DateExtensionsPage />);
    const user = userEvent.setup();
    const resetButton = screen.getByRole('button', { name: 'Reset Extensions' });
    await user.click(resetButton);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
