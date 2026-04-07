import { EnrolledLearner } from '../types';
interface UnenrollModalProps {
  learner: EnrolledLearner,
  isOpen: boolean,
  onClose: () => void,
}

const UnenrollModal = ({ learner, isOpen, onClose }: UnenrollModalProps) => {
  console.log(learner, isOpen, onClose);

  return <div>Unenroll Modal</div>;
};

export default UnenrollModal;
