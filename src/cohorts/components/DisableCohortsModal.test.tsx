import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DisableCohortsModal from './DisableCohortsModal';
import { renderWithIntl } from '../../testUtils';
import messages from '../messages';

describe('DisableCohortsModal', () => {
  const onClose = jest.fn();
  const onConfirmDisable = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    renderWithIntl(
      <DisableCohortsModal
        isOpen={true}
        onClose={onClose}
        onConfirmDisable={onConfirmDisable}
      />
    );
    expect(screen.getByRole('dialog', { name: messages.modalTitle.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(messages.disableMessage.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.cancelLabel.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.disableLabel.defaultMessage)).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    renderWithIntl(
      <DisableCohortsModal
        isOpen={false}
        onClose={onClose}
        onConfirmDisable={onConfirmDisable}
      />
    );
    expect(screen.queryByText(messages.modalTitle.defaultMessage)).not.toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', async () => {
    renderWithIntl(
      <DisableCohortsModal
        isOpen={true}
        onClose={onClose}
        onConfirmDisable={onConfirmDisable}
      />
    );
    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: messages.cancelLabel.defaultMessage });
    await user.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onConfirmDisable when disable button is clicked', async () => {
    renderWithIntl(
      <DisableCohortsModal
        isOpen={true}
        onClose={onClose}
        onConfirmDisable={onConfirmDisable}
      />
    );
    const user = userEvent.setup();
    const disableButton = screen.getByRole('button', { name: messages.disableLabel.defaultMessage });
    await user.click(disableButton);
    expect(onConfirmDisable).toHaveBeenCalled();
  });
});
