import { Learner } from '../types';
interface UnenrollModalProps {
  learner: Learner | null,
  isOpen: boolean,
  onClose: () => void,
}

const UnenrollModal = ({ learner, isOpen, onClose }: UnenrollModalProps) => {
  console.log(learner, isOpen);

  if (!isOpen || learner === null) {
    onClose();
    return null;
  }

  return <div>Unenroll Modal</div>;
};

export default UnenrollModal;
