import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateExtensionsList, { DateExtensionListProps } from './DateExtensionsList';
import { renderWithIntl } from '../../testUtils';
import { useDateExtensions } from '../../data/apiHook';

const mockData = [
  {
    id: 1,
    username: 'test_user',
    fullname: 'Test User',
    email: 'test@example.com',
    graded_subsection: 'Test Section',
    extended_due_date: '2024-01-01'
  }
];

jest.mock('../../data/apiHook', () => ({
  useDateExtensions: jest.fn(),
}));

const mockResetExtensions = jest.fn();

describe('DateExtensionsList', () => {
  const renderComponent = (props: DateExtensionListProps) => renderWithIntl(
    <DateExtensionsList {...props} />
  );

  it('renders loading state on the table', () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ isLoading: true, data: { count: 0, results: [] } });
    renderComponent({});
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders table with data', async () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ isLoading: false, data: { count: mockData.length, results: mockData } });
    renderComponent({ onResetExtensions: mockResetExtensions });
    const user = userEvent.setup();
    expect(screen.getByText('test_user')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    const resetExtensions = screen.getByRole('button', { name: /reset extensions/i });
    expect(resetExtensions).toBeInTheDocument();
    await user.click(resetExtensions);
    expect(mockResetExtensions).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders empty table when no data provided', () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ data: { count: 0, results: [] } });
    renderComponent({});
    expect(screen.queryByText('test_user')).not.toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});
