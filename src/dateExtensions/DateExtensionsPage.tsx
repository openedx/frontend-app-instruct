import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import messages from './messages';
import DateExtensionsList from './components/DateExtensionsList';
import ResetExtensionsModal from './components/ResetExtensionsModal';
import { LearnerDateExtension } from './types';
import { useResetDateExtensionMutation } from './data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';

const DateExtensionsPage = () => {
  const intl = useIntl();
  const { courseId } = useParams<{ courseId: string }>();
  const { mutate: resetMutation } = useResetDateExtensionMutation();
  const [selectedUser, setSelectedUser] = useState<LearnerDateExtension | null>(null);
  const isResetModalOpen = selectedUser !== null;
  const { showToast, showModal, removeAlert, clearAlerts } = useAlert();

  const handleResetExtensions = (user: LearnerDateExtension) => {
    clearAlerts();
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleErrorOnReset = (error: Error) => {
    showModal({
      confirmText: intl.formatMessage(messages.close),
      message: error.message,
      variant: 'danger',
      onConfirm: (id) => removeAlert(id)
    });
  };

  const handleSuccessOnReset = (response: string) => {
    showToast(response);
    handleCloseModal();
  };

  const handleConfirmReset = async () => {
    if (selectedUser && courseId) {
      resetMutation({
        courseId,
        params: {
          student: selectedUser.username,
          url: selectedUser.unitLocation,
        }
      }, {
        onError: handleErrorOnReset,
        onSuccess: handleSuccessOnReset
      });
    } else {
      showModal({
        confirmText: intl.formatMessage(messages.close),
        message: intl.formatMessage(messages.missingUserOrCourseIdError),
        variant: 'danger',
        onConfirm: (id) => removeAlert(id)
      });
    }
  };

  return (
    <div className="mt-4.5 mb-4 mx-4">
      <h3>{intl.formatMessage(messages.dateExtensionsTitle)}</h3>
      <div className="d-flex align-items-center justify-content-between mb-3.5">
        <p>filters</p>
        <Button>+ {intl.formatMessage(messages.addIndividualExtension)}</Button>
      </div>
      <DateExtensionsList onResetExtensions={handleResetExtensions} />
      <ResetExtensionsModal
        isOpen={isResetModalOpen}
        message={intl.formatMessage(messages.resetConfirmationMessage)}
        title={intl.formatMessage(messages.resetConfirmationHeader, { username: selectedUser?.username })}
        onCancelReset={handleCloseModal}
        onClose={handleCloseModal}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
};

export default DateExtensionsPage;
