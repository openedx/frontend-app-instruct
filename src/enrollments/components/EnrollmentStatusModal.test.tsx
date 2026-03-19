import { screen, waitFor } from '@testing-library/react';
import EnrollmentStatusModal from './EnrollmentStatusModal';
import { useEnrollmentByUserId } from '../data/apiHook';
import { renderWithIntl } from '@src/testUtils';
import userEvent from '@testing-library/user-event';

jest.mock('../data/apiHook', () => ({
  useEnrollmentByUserId: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: 'test-course-id' }),
}));

const renderComponent = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    ...props,
  };

  return renderWithIntl(<EnrollmentStatusModal {...defaultProps} />);
};

describe('EnrollmentStatusModal', () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    (useEnrollmentByUserId as jest.Mock).mockReturnValue({
      data: { enrollmentStatus: '' },
      refetch: mockRefetch,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    renderComponent();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    renderComponent({ isOpen: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    renderComponent({ onClose });

    const user = userEvent.setup();
    await user.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('updates learner identifier input value', async () => {
    renderComponent();
    const input = screen.getByRole('textbox');

    const user = userEvent.setup();
    await user.type(input, 'test@example.com');
    expect(input).toHaveValue('test@example.com');
  });

  it('disables search button when input is empty', () => {
    renderComponent();
    const searchButton = screen.getByRole('button', { name: /check enrollment status/i });

    expect(searchButton).toBeDisabled();
  });

  it('enables search button when input has value', async () => {
    renderComponent();
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /check enrollment status/i });

    const user = userEvent.setup();
    await user.type(input, 'test@example.com');
    expect(searchButton).toBeEnabled();
  });

  it('calls refetch when search button is clicked', async () => {
    renderComponent();
    const input = screen.getByRole('textbox');
    const searchButton = screen.getByRole('button', { name: /check enrollment status/i });

    const user = userEvent.setup();
    await user.type(input, 'test@example.com');
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  it('displays status message when data and learner identifier exist', async () => {
    (useEnrollmentByUserId as jest.Mock).mockReturnValue({
      data: { enrollmentStatus: 'enrolled' },
      refetch: mockRefetch,
    });

    renderComponent();
    const input = screen.getByRole('textbox');

    const user = userEvent.setup();
    await user.type(input, 'test@example.com');

    expect(screen.getByText(/enrolled/)).toBeInTheDocument();
  });

  it('does not display status message when status is empty', async () => {
    renderComponent();
    const input = screen.getByRole('textbox');

    const user = userEvent.setup();
    await user.type(input, 'test@example.com');

    expect(screen.queryByText(/test@example.com/)).not.toBeInTheDocument();
  });
});
