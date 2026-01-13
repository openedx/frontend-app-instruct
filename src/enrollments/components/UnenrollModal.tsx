import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, ModalDialog } from '@openedx/paragon';
import { useAlert } from '@src/providers/AlertProvider';
import { useUnenrollLearners } from '../data/apiHook';
import messages from '../messages';
import { EnrolledLearner } from '../types';

interface UnenrollModalProps {
  learner: EnrolledLearner,
  isOpen: boolean,
  onClose: () => void,
  onSuccess: () => void,
}

const UnenrollModal = ({ learner, isOpen, onClose, onSuccess }: UnenrollModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { mutate: unenrollLearners, isPending } = useUnenrollLearners(courseId);
  const { showModal } = useAlert();

  const handleUnenroll = () => {
    unenrollLearners([learner.email], {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
      onError: (error) => {
        showModal({
          message: error.message || intl.formatMessage(messages.unenrollLearnerError),
          variant: 'danger',
        });
      }
    });
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={intl.formatMessage(messages.unenrollLearners)} isOverflowVisible={false}>
      <ModalDialog.Header>
        <h3 className="text-primary-500">{intl.formatMessage(messages.unenrollLearnerTitle)}</h3>
      </ModalDialog.Header>
      <ModalDialog.Body className="py-4">
        <p>{intl.formatMessage(messages.unenrollLearnersConfirmation, { name: learner.fullName })}</p>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancelButton)}</Button>
        <Button
          className="ml-2"
          onClick={handleUnenroll}
          disabled={isPending}
        >
          {intl.formatMessage(messages.unenrollButton)}
        </Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default UnenrollModal;
