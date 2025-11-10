import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DateExtensionsPage from './DateExtensionsPage';
import { useDateExtensions, useResetDateExtensionMutation } from './data/apiHook';

jest.mock('./data/apiHook', () => ({
  useDateExtensions: jest.fn(),
  useResetDateExtensionMutation: jest.fn(),
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
  });

  const RenderWithRouter = () => (
    <IntlProvider messages={{}}>
      <MemoryRouter initialEntries={['/course-v1:edX+DemoX+Demo_Course']}>
        <Routes>
          <Route path="/:courseId" element={<DateExtensionsPage />} />
        </Routes>
      </MemoryRouter>
    </IntlProvider>
  );

  it('renders page title', () => {
    render(<RenderWithRouter />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders add extension button', () => {
    render(<RenderWithRouter />);
    expect(screen.getByRole('button', { name: /add individual extension/i })).toBeInTheDocument();
  });

  it('renders date extensions list', () => {
    render(<RenderWithRouter />);
    expect(screen.getByText('Ed Byun')).toBeInTheDocument();
    expect(screen.getByText('Three body diagrams')).toBeInTheDocument();
  });

  it('shows loading state on table when fetching data', () => {
    (useDateExtensions as jest.Mock).mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: true,
    });
    render(<RenderWithRouter />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders reset link for each row', () => {
    render(<RenderWithRouter />);
    const resetLinks = screen.getAllByRole('button', { name: 'Reset Extensions' });
    expect(resetLinks).toHaveLength(mockDateExtensions.length);
  });

  it('opens reset modal when reset button is clicked', async () => {
    render(<RenderWithRouter />);
    const user = userEvent.setup();
    const resetButton = screen.getByRole('button', { name: 'Reset Extensions' });
    await user.click(resetButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/reset extensions for/i)).toBeInTheDocument();
    const confirmButton = screen.getByRole('button', { name: /reset due date/i });
    expect(confirmButton).toBeInTheDocument();
  });

  it('calls reset mutation when confirm reset is clicked', async () => {
    render(<RenderWithRouter />);
    const user = userEvent.setup();
    const resetButton = screen.getByRole('button', { name: 'Reset Extensions' });
    await user.click(resetButton);
    const confirmButton = screen.getByRole('button', { name: /reset due date/i });
    await user.click(confirmButton);
    expect(mutateMock).toHaveBeenCalled();
  });

  it('closes reset modal when cancel is clicked', async () => {
    render(<RenderWithRouter />);
    const user = userEvent.setup();
    const resetButton = screen.getByRole('button', { name: 'Reset Extensions' });
    await user.click(resetButton);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
