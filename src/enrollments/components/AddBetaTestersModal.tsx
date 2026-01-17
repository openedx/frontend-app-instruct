import { useParams } from 'react-router-dom';
import { useAddBetaTesters } from '../data/apiHook';
import AddModal from './AddModal';
import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';

export interface AddBetaTestersModalProps {
  isOpen: boolean,
  onClose: () => void,
  onSuccess: () => void,
}

const AddBetaTestersModal = ({ isOpen, onClose, onSuccess }: AddBetaTestersModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { mutate: addBetaTesters } = useAddBetaTesters(courseId);

  const handleEnroll = (emailList: string[]) => {
    addBetaTesters(emailList, {
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
      instructions={intl.formatMessage(messages.addBetaTestersInstructions)}
      isOpen={isOpen}
      title={intl.formatMessage(messages.addBetaTesters)}
      onClose={onClose}
      onSave={handleEnroll}
    />
  );
};

export default AddBetaTestersModal;
