import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateExtensionsList, { DateExtensionListProps } from './DateExtensionsList';
import { renderWithIntl } from '../../testUtils';
import { useDateExtensions } from '../data/apiHook';

const mockData = [
  {
    id: 1,
    username: 'test_user',
    fullName: 'Test User',
    email: 'test@example.com',
    unitTitle: 'Test Section',
    extendedDueDate: '2025-11-07T00:00:00Z'
  }
];

jest.mock('../data/apiHook', () => ({
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
    expect(screen.getByText(mockData[0].username)).toBeInTheDocument();
    expect(screen.getByText(mockData[0].fullName)).toBeInTheDocument();
    expect(screen.getByText(mockData[0].email)).toBeInTheDocument();
    expect(screen.getByText(mockData[0].unitTitle)).toBeInTheDocument();
    expect(screen.getByText('11/07/2025, 12:00 AM')).toBeInTheDocument();
    const resetExtensions = screen.getByRole('button', { name: /reset extensions/i });
    expect(resetExtensions).toBeInTheDocument();
    await user.click(resetExtensions);
    expect(mockResetExtensions).toHaveBeenCalledWith(mockData[0]);
  });

  it('renders empty table when no data provided', () => {
    (useDateExtensions as jest.Mock).mockReturnValue({ data: { count: 0, results: [] } });
    renderComponent({});
    expect(screen.queryByText(mockData[0].username)).not.toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});
