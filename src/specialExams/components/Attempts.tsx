import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, ModalDialog, useToggle } from '@openedx/paragon';
import AttemptsList from '@src/specialExams/components/AttemptsList';
import { useResetAttempt, useResumeAttempt } from '@src/specialExams/data/apiHook';
import messages from '@src/specialExams/messages';
import { Attempt, AttemptAction } from '@src/specialExams/types';
import { useAlert } from '@src/providers/AlertProvider';

const Attempts = () => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const intl = useIntl();
  const { mutate: resetAttempt } = useResetAttempt(courseId);
  const { mutate: resumeAttempt } = useResumeAttempt(courseId);
  const { showModal, showToast } = useAlert();
  const [isOpenConfirmationModal, openConfirmationModal, closeConfirmationModal] = useToggle(false);
  const [attemptAction, setAttemptAction] = useState<AttemptAction>('reset');
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  const handleResume = () => {
    if (!attempt) return;
    const { user, id } = attempt;
    resumeAttempt({ attemptId: id, userId: user.id }, {
      onSuccess: () => {
        showToast(intl.formatMessage(messages.successOnResume, { student: attempt.user.username }));
      },
      onError: (error) => {
        const errorMessage = (isAxiosError(error) && error?.response?.data?.detail) || intl.formatMessage(messages.errorOnResume);
        showModal({ variant: 'danger', message: errorMessage, confirmText: intl.formatMessage(messages.close) });
      }
    });
    closeConfirmationModal();
  };

  const handleReset = () => {
    if (!attempt) return;
    const { user, examId, examName } = attempt;
    resetAttempt({ username: user.username, examId }, {
      onSuccess: () => {
        showToast(intl.formatMessage(messages.successOnReset, { examName, student: user.username }));
      },
      onError: (error) => {
        const errorMessage = (isAxiosError(error) && error?.response?.data?.detail) || intl.formatMessage(messages.errorOnReset, { examName, student: user.username });
        showModal({ variant: 'danger', message: errorMessage, confirmText: intl.formatMessage(messages.close) });
      }
    });
    closeConfirmationModal();
  };

  const openAndSetConfirmationModal = (action: AttemptAction, attempt: Attempt) => {
    openConfirmationModal();
    setAttemptAction(action);
    setAttempt(attempt);
  };

  return (
    <>
      <AttemptsList
        onResume={(attempt: Attempt) => openAndSetConfirmationModal('resume', attempt)}
        onReset={(attempt: Attempt) => openAndSetConfirmationModal('reset', attempt)}
      />
      { attempt && (
        <ModalDialog
          title={intl.formatMessage(messages.confirmationModal)}
          isOpen={isOpenConfirmationModal}
          onClose={closeConfirmationModal}
          isOverflowVisible={false}
          hasCloseButton={false}
        >
          <ModalDialog.Body>
            {attemptAction === 'reset' ? intl.formatMessage(messages.confirmationMessageReset) : intl.formatMessage(messages.confirmationMessageResume)}
          </ModalDialog.Body>
          <ModalDialog.Footer>
            <ActionRow>
              <Button variant="tertiary" onClick={closeConfirmationModal}>
                {intl.formatMessage(messages.cancel)}
              </Button>
              <Button
                variant="primary"
                onClick={() => attemptAction === 'reset' ? handleReset() : handleResume()}
              >
                {attemptAction === 'reset' ? intl.formatMessage(messages.reset) : intl.formatMessage(messages.resume)}
              </Button>
            </ActionRow>
          </ModalDialog.Footer>
        </ModalDialog>
      )}
    </>
  );
};

export default Attempts;
