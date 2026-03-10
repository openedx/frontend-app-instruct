import { useIntl } from '@openedx/frontend-base';
import LearnerActionModal from './LearnerActionModal';
import messages from '../messages';

interface InvalidateCertificateModalProps {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (learners: string, notes: string) => void,
  isSubmitting: boolean,
}

const InvalidateCertificateModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: InvalidateCertificateModalProps) => {
  const intl = useIntl();

  return (
    <LearnerActionModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      title={intl.formatMessage(messages.invalidateCertificateModalTitle)}
      description={intl.formatMessage(messages.invalidateCertificateModalDescription)}
      learnersLabel={intl.formatMessage(messages.learnersLabel)}
      learnersPlaceholder={intl.formatMessage(messages.learnersPlaceholder)}
      notesLabel={intl.formatMessage(messages.notesLabel)}
      notesPlaceholder={intl.formatMessage(messages.notesPlaceholder)}
      submitLabel={intl.formatMessage(messages.submit)}
      cancelLabel={intl.formatMessage(messages.cancel)}
    />
  );
};

export default InvalidateCertificateModal;
