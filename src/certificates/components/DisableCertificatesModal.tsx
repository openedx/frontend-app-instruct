import { ActionRow, Button, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/certificates/messages';

interface DisableCertificatesModalProps {
  isOpen: boolean,
  isEnabled: boolean,
  onClose: () => void,
  onConfirm: () => void,
  isSubmitting: boolean,
}

const DisableCertificatesModal = ({
  isOpen,
  isEnabled,
  onClose,
  onConfirm,
  isSubmitting,
}: DisableCertificatesModalProps) => {
  const intl = useIntl();

  const title = isEnabled
    ? intl.formatMessage(messages.disableCertificatesModalTitle)
    : intl.formatMessage(messages.enableCertificatesModalTitle);

  const message = isEnabled
    ? intl.formatMessage(messages.disableCertificatesModalMessage)
    : intl.formatMessage(messages.enableCertificatesModalMessage);

  return (
    <ModalDialog
      title={title}
      onClose={onClose}
      isOpen={isOpen}
      size="sm"
      hasCloseButton={false}
      isOverflowVisible={false}
    >
      <div className="mx-4 mt-4 mb-2.5">
        <p>{message}</p>
      </div>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={onClose} disabled={isSubmitting}>
            {intl.formatMessage(messages.cancel)}
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isSubmitting}>
            {intl.formatMessage(messages.confirm)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default DisableCertificatesModal;
