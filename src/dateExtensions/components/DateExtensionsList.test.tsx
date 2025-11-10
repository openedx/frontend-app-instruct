import { screen } from '@testing-library/react';
import DateExtensionsList, { DateExtensionListProps } from './DateExtensionsList';
import { renderWithIntl } from '../../testUtils';

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

describe('DateExtensionsList', () => {
  const renderComponent = (props: DateExtensionListProps) => renderWithIntl(
    <DateExtensionsList {...props} />
  );

  it('renders loading state on the table', () => {
    renderComponent({ data: [], isLoading: true });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders table with data', () => {
    renderComponent({ data: mockData });
    expect(screen.getByText('test_user')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
  });

  it('renders empty table when no data provided', () => {
    renderComponent({ data: [] });
    expect(screen.queryByText('test_user')).not.toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });
});
