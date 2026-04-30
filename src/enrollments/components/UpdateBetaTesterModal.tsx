import { useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, ModalDialog } from '@openedx/paragon';
import { useAlert } from '@src/providers/AlertProvider';
import { useUpdateBetaTesters } from '@src/enrollments/data/apiHook';
import messages from '@src/enrollments/messages';
import { EnrolledLearner } from '@src/enrollments/types';

interface UpdateBetaTesterModalProps {
  learner: EnrolledLearner,
  isOpen: boolean,
  onClose: () => void,
}

const UpdateBetaTesterModal = ({ learner, isOpen, onClose }: UpdateBetaTesterModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { mutate: updateBetaTester, isPending } = useUpdateBetaTesters(courseId);
  const { addAlert, showModal } = useAlert();

  const handleUpdateBetaTester = useCallback(() => {
    updateBetaTester({
      identifier: [learner.username],
      action: learner.isBetaTester ? 'remove' : 'add',
    }, {
      onSuccess: (data) => {
        const failedUsernames = data.results?.filter(user => user.userDoesNotExist).map(user => user.identifier) || [];
        const inactiveUsernames = data.results?.filter(user => !user.isActive && user.isActive !== null && !user.userDoesNotExist).map(user => user.identifier) || [];
        if (failedUsernames.length > 0) {
          addAlert({
            type: 'danger',
            message: intl.formatMessage(messages.failedBetaTesters),
            extraContent: (
              failedUsernames.map((learner: string) => (
                <p key={learner} className="mb-0">• {intl.formatMessage(messages.unknownLearner, { learner })}</p>
              ))
            )
          });
        }
        if (inactiveUsernames.length > 0) {
          addAlert({
            type: 'warning',
            message: intl.formatMessage(messages.inactiveUsers),
            extraContent: (
              inactiveUsernames.map((learner: string) => (
                <p key={learner} className="mb-0">• {intl.formatMessage(messages.inactiveLearner, { learner })}</p>
              ))
            )
          });
        }
      },
      onError: () => {
        showModal({
          message: learner.isBetaTester ? intl.formatMessage(messages.removeBetaTesterError) : intl.formatMessage(messages.addBetaTesterError),
          variant: 'danger',
          confirmText: intl.formatMessage(messages.closeButton),
        });
      }
    });

    onClose();
  }, [updateBetaTester, learner.username, learner.isBetaTester, addAlert, intl, showModal, onClose]);

  useEffect(() => {
    if (isOpen && !learner.isBetaTester) {
      handleUpdateBetaTester();
    }
  }, [handleUpdateBetaTester, isOpen, learner.isBetaTester]);

  // Only show modal for removing beta testers (requires confirmation)
  if (!isOpen || !learner.isBetaTester) {
    return null;
  }

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={intl.formatMessage(messages.removeBetaTesterTitle)} isOverflowVisible={false}>
      <ModalDialog.Header>
        <h3 className="text-primary-500">{intl.formatMessage(messages.removeBetaTesterTitle)}</h3>
      </ModalDialog.Header>
      <ModalDialog.Body className="py-4">
        <p>{intl.formatMessage(messages.removeBetaTesterDescription)}</p>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancelButton)}</Button>
        <Button
          className="ml-2"
          onClick={handleUpdateBetaTester}
          disabled={isPending}
        >
          {intl.formatMessage(messages.revoke)}
        </Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default UpdateBetaTesterModal;
