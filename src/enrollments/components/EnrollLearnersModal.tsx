import { useParams } from 'react-router-dom';
import { useEnrollLearners } from '../data/apiHook';
import AddModal from './AddModal';
import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';

export interface EnrollLearnersModalProps {
  isOpen: boolean,
  onClose: () => void,
  onSuccess: () => void,
}

const EnrollLearnersModal = ({ isOpen, onClose, onSuccess }: EnrollLearnersModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { mutate: enrollLearners } = useEnrollLearners(courseId);

  const handleEnroll = (emailList: string[]) => {
    enrollLearners(emailList, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
      onError: (error) => {
        console.error(error);
      }
    });
  };
  return (
    <AddModal
      instructions={intl.formatMessage(messages.enrollLearnerInstructions)}
      isOpen={isOpen}
      title={intl.formatMessage(messages.enrollLearners)}
      onClose={onClose}
      onSave={handleEnroll}
    />
  );
};

export default EnrollLearnersModal;
