import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddExtensionModal from './AddExtensionModal';
import { renderWithQueryClient } from '@src/testUtils';
import messages from '../messages';

const mockProps = {
  isOpen: true,
  title: 'Add Extension Test',
  onClose: jest.fn(),
  onSubmit: jest.fn(),
};

const items = [
  { displayName: 'Quiz 1', subsectionId: 'sub1' },
  { displayName: 'Quiz 2', subsectionId: 'sub2' },
];

jest.mock('../data/apiHook', () => ({
  useGradedSubsections: jest.fn().mockReturnValue({ data: { items } }),
}));

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
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('submits form with correct data', async () => {
    renderWithQueryClient(<AddExtensionModal {...mockProps} />);
    const user = userEvent.setup();

    const learnerInput = screen.getByLabelText(/Specify Learner/i);
    const blockInput = screen.getByRole('combobox');
    const dueDateInput = screen.getByLabelText(messages.extensionDate.defaultMessage + ':');
    const dueTimeInput = document.querySelector('input[type="time"]') as HTMLInputElement;
    const reasonInput = screen.getByPlaceholderText(messages.reasonForExtension.defaultMessage);

    await user.type(learnerInput, 'testuser');
    await user.click(screen.getByRole('button', { name: /select/i }));
    await user.selectOptions(blockInput, 'sub1');
    await user.type(dueDateInput, '2024-12-31');
    await user.type(dueTimeInput, '23:59');
    await user.type(reasonInput, 'Medical emergency');

    const submitButton = screen.getByRole('button', { name: messages.addExtension.defaultMessage });
    await waitFor(() => expect(submitButton).not.toBeDisabled());

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        emailOrUsername: 'testuser',
        blockId: 'sub1',
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
