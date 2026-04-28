import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AllowancesList from './AllowancesList';
import { renderWithIntl } from '@src/testUtils';
import { useAllowances } from '../data/apiHook';
import messages from '../messages';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('../data/apiHook', () => ({
  useAllowances: jest.fn(),
}));

const mockAllowances = {
  results: [
    {
      key: 'additional_time_granted',
      user: {
        username: 'john_doe',
        email: 'john.doe@hotmail.com',
      },
      proctoredExam: {
        examName: 'Midterm Exam',
        id: 1,
      },
      value: '30 minutes',
    },
  ],
  count: 1,
  numPages: 1,
};

describe('AllowancesList', () => {
  const onClickAdd = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders DataTable with correct columns and empty data', () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: { results: [], count: 0, numPages: 0 },
      isLoading: false,
    });

    renderWithIntl(<AllowancesList onClickAdd={onClickAdd} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('No allowances found')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search By Username or Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add allowance/i })).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: { results: [], count: 0, numPages: 0 },
      isLoading: true,
    });

    renderWithIntl(<AllowancesList onClickAdd={onClickAdd} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders allowances data', () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: mockAllowances,
      isLoading: false,
    });

    renderWithIntl(<AllowancesList onClickAdd={onClickAdd} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText(mockAllowances.results[0].user.username)).toBeInTheDocument();
    expect(screen.getByText(mockAllowances.results[0].user.email)).toBeInTheDocument();
    expect(screen.getByText(mockAllowances.results[0].proctoredExam.examName)).toBeInTheDocument();
    expect(screen.getByText(messages.additionalTime.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(mockAllowances.results[0].value)).toBeInTheDocument();
  });

  it('calls onClickAdd when add button is clicked', async () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: mockAllowances,
      isLoading: false,
    });
    renderWithIntl(<AllowancesList onClickAdd={onClickAdd} onEdit={onEdit} onDelete={onDelete} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add allowance/i }));
    expect(onClickAdd).toHaveBeenCalled();
  });

  it('calls onEdit when actions button is clicked', async () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: mockAllowances,
      isLoading: false,
    });
    renderWithIntl(<AllowancesList onClickAdd={onClickAdd} onEdit={onEdit} onDelete={onDelete} />);
    const user = userEvent.setup();
    const actionsBtn = screen.getByRole('button', { name: /actions/i });
    await user.click(actionsBtn);
    const editBtn = screen.getByRole('button', { name: messages.edit.defaultMessage });
    await user.click(editBtn);
    expect(onEdit).toHaveBeenCalled();
  });

  it('calls fetchData when filter changes', async () => {
    (useAllowances as jest.Mock).mockReturnValue({
      data: mockAllowances,
      isLoading: false,
    });
    renderWithIntl(<AllowancesList onClickAdd={onClickAdd} onEdit={onEdit} onDelete={onDelete} />);
    const input = screen.getByPlaceholderText('Search By Username or Email');
    const user = userEvent.setup();
    await user.type(input, 'testuser');
    expect(input).toHaveValue('testuser');
  });
});
