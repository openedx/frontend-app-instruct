import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DateExtensionsPage from './DateExtensionsPage';
import { useDateExtensions } from '../data/apiHook';

jest.mock('../data/apiHook', () => ({
  useDateExtensions: jest.fn(),
}));

const mockDateExtensions = [
  {
    id: 1,
    username: 'edByun',
    fullname: 'Ed Byun',
    email: 'ed.byun@example.com',
    graded_subsection: 'Three body diagrams',
    extended_due_date: '2026-07-15'
  },
];

describe('DateExtensionsPage', () => {
  beforeEach(() => {
    (useDateExtensions as jest.Mock).mockReturnValue({
      data: mockDateExtensions,
      isLoading: false,
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
      data: null,
      isLoading: true,
    });
    render(<RenderWithRouter />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
