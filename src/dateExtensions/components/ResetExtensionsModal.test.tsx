import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetExtensionsModal from './ResetExtensionsModal';
import { renderWithIntl } from '../../testUtils';
import messages from '../messages';

describe('ResetExtensionsModal', () => {
  const defaultProps = {
    isOpen: true,
    message: 'Test message',
    title: 'Test title',
    onCancelReset: jest.fn(),
    onClose: jest.fn(),
    onConfirmReset: jest.fn(),
  };

  const renderModal = (props = {}) => renderWithIntl(
    <ResetExtensionsModal {...defaultProps} {...props} />
  );

  it('renders modal with correct title and message', () => {
    renderModal();
    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onCancelReset when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: messages.cancel.defaultMessage }));
    expect(defaultProps.onCancelReset).toHaveBeenCalled();
  });

  it('calls onConfirmReset when confirm button is clicked', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: messages.confirm.defaultMessage }));
    expect(defaultProps.onConfirmReset).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    renderModal({ isOpen: false });
    expect(screen.queryByText('Test title')).not.toBeInTheDocument();
  });
});
