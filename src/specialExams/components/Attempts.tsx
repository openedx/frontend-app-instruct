import { useParams } from 'react-router-dom';
import { Attempt } from '../types';
import AttemptsList from './AttemptsList';
import { useResetAttempt } from '../data/apiHook';

const Attempts = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { mutate: resetAttempt } = useResetAttempt(courseId);

  const handleResume = (attempt: Attempt) => {
    // Implement resume logic here
    console.log('Resume attempt:', courseId, attempt);
  };

  const handleReset = (attempt: Attempt) => {
    const { user, examId } = attempt;
    resetAttempt({ username: user.username, examId });
  };

  return (
    <AttemptsList onResume={handleResume} onReset={handleReset} />
  );
};

export default Attempts;
