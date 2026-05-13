import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Attempt } from '../types';
import AttemptsList from './AttemptsList';
import { useResetAttempt } from '../data/apiHook';
import messages from '../messages';
import { useAlert } from '@src/providers/AlertProvider';
import { useIntl } from '@openedx/frontend-base';

const Attempts = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const intl = useIntl();
  const { mutate: resetAttempt } = useResetAttempt(courseId);
  const { showModal, showToast } = useAlert();

  const handleResume = (attempt: Attempt) => {
    // Implement resume logic here
    console.log('Resume attempt:', courseId, attempt);
  };

  const handleReset = (attempt: Attempt) => {
    const { user, examId, examName } = attempt;
    resetAttempt({ username: user.username, examId }, {
      onSuccess: () => {
        showToast(intl.formatMessage(messages.successOnReset, { examName, student: user.username }));
      },
      onError: (error) => {
        const errorMessage = (isAxiosError(error) && error?.response?.data?.detail) || intl.formatMessage(messages.errorOnReset, { examName, student: user.username });
        showModal({ message: errorMessage, confirmText: intl.formatMessage(messages.close) });
      }
    });
  };

  return (
    <AttemptsList onResume={handleResume} onReset={handleReset} />
  );
};

export default Attempts;
