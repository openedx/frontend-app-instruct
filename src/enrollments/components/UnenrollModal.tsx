import { Learner } from '../types';
interface UnenrollModalProps {
  learner: Learner,
  isOpen: boolean,
  onClose: () => void,
}

const UnenrollModal = ({ learner, isOpen, onClose }: UnenrollModalProps) => {
  console.log(learner, isOpen, onClose);

  return <div>Unenroll Modal</div>;
};

export default UnenrollModal;
