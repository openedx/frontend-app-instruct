import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddExtensionModal from './AddExtensionModal';
import { renderWithQueryClient } from '@src/testUtils';

const mockProps = {
  isOpen: true,
  title: 'Add Extension Test',
  onClose: jest.fn(),
  onSubmit: jest.fn(),
};

describe('AddExtensionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    renderWithQueryClient(<AddExtensionModal {...mockProps} />);
    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    renderWithQueryClient(<AddExtensionModal {...mockProps} isOpen={false} />);
    expect(screen.queryByText(mockProps.title)).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithQueryClient(<AddExtensionModal {...mockProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('submits form with correct data', async () => {
    renderWithQueryClient(<AddExtensionModal {...mockProps} />);
    const user = userEvent.setup();

    const dueDateInput = screen.getByLabelText(/extension date/i);
    const dueTimeInput = document.querySelector('input[type="time"]') as HTMLInputElement;
    const reasonInput = screen.getByPlaceholderText(/reason/i);

    await user.type(dueDateInput, '2024-12-31');
    await user.type(dueTimeInput, '23:59');
    await user.type(reasonInput, 'Medical emergency');

    await user.click(screen.getByRole('button', { name: /add extension/i }));

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        emailOrUsername: '',
        blockId: '',
        dueDatetime: new Date('2024-12-31T23:59').toISOString(),
        reason: 'Medical emergency'
      });
    });
  });

  it('updates form data when input values change', async () => {
    renderWithQueryClient(<AddExtensionModal {...mockProps} />);
    const user = userEvent.setup();

    const reasonInput = screen.getByPlaceholderText(/reason/i);
    await user.type(reasonInput, 'Test reason');

    expect(reasonInput).toHaveValue('Test reason');
  });

  it('renders all required form fields', () => {
    renderWithQueryClient(<AddExtensionModal {...mockProps} />);

    expect(screen.getByLabelText(/Specify Learner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Graded Subsection/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/extension date/i)).toBeInTheDocument();
    expect(document.querySelector('input[type="time"]')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/reason/i)).toBeInTheDocument();
  });
});
