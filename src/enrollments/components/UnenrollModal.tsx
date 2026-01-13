import { useIntl } from '@openedx/frontend-base';
import { Button, ModalDialog } from '@openedx/paragon';
import messages from '../messages';
import { Learner } from '../types';

interface UnenrollModalProps {
  learner: Learner | null,
  isOpen: boolean,
  onClose: () => void,
}

const UnenrollModal = ({ learner, isOpen, onClose }: UnenrollModalProps) => {
  const intl = useIntl();

  if (!isOpen || learner === null) {
    onClose();
    return null;
  }

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
        <Button className="ml-2">{intl.formatMessage(messages.unenrollButton)}</Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default UnenrollModal;
