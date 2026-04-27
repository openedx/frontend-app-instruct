import { useIntl } from '@openedx/frontend-base';
import LearnerActionModal from '@src/certificates/components/LearnerActionModal';
import messages from '@src/certificates/messages';

interface GrantExceptionsModalProps {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: (learners: string[], notes: string) => void,
  isSubmitting: boolean,
}

const GrantExceptionsModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: GrantExceptionsModalProps) => {
  const intl = useIntl();

  return (
    <LearnerActionModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      title={intl.formatMessage(messages.grantExceptionsModalTitle)}
      description={intl.formatMessage(messages.grantExceptionsModalDescription)}
      learnersLabel={intl.formatMessage(messages.learnersLabel)}
      learnersPlaceholder={intl.formatMessage(messages.learnersPlaceholder)}
      notesLabel={intl.formatMessage(messages.notesLabel)}
      notesPlaceholder={intl.formatMessage(messages.notesPlaceholder)}
      submitLabel={intl.formatMessage(messages.submit)}
      cancelLabel={intl.formatMessage(messages.cancel)}
    />
  );
};

export default GrantExceptionsModal;
