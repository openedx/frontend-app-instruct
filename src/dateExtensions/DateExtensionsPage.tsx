import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import messages from './messages';
import DateExtensionsList from './components/DateExtensionsList';
import ResetExtensionsModal from './components/ResetExtensionsModal';
import { LearnerDateExtension } from './types';
import { useAddDateExtensionMutation, useResetDateExtensionMutation } from './data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';
import AddExtensionModal from './components/AddExtensionModal';
import { APIError } from '@src/types';
import SelectGradedSubsection from './components/SelectGradedSubsection';

const DateExtensionsPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { mutate: resetMutation } = useResetDateExtensionMutation();
  const { mutate: addExtensionMutation } = useAddDateExtensionMutation();
  const [selectedUser, setSelectedUser] = useState<LearnerDateExtension | null>(null);
  const isResetModalOpen = selectedUser !== null;
  const { showToast, showModal, removeAlert, clearAlerts } = useAlert();
  const [isAddExtensionModalOpen, setIsAddExtensionModalOpen] = useState(false);

  const handleResetExtensions = (user: LearnerDateExtension) => {
    clearAlerts();
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleErrorOnReset = (error: APIError | Error) => {
    showModal({
      confirmText: intl.formatMessage(messages.close),
      message: 'response' in error ? error.response.data.error : error.message,
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

  const handleAddExtension = ({ emailOrUsername, blockId, dueDatetime, reason }) => {
    addExtensionMutation({ courseId, extensionData: {
      emailOrUsername,
      blockId,
      dueDatetime,
      reason
    } }, {
      onError: handleErrorOnReset,
      onSuccess: (response) => {
        setIsAddExtensionModalOpen(false);
        showToast(response.message);
      }
    });
  };

  return (
    <div className="mt-4.5 mb-4 mx-4">
      <h3>{intl.formatMessage(messages.dateExtensionsTitle)}</h3>
      <div className="d-flex align-items-center justify-content-between mb-3.5">
        <div>
          <SelectGradedSubsection
            placeholder={intl.formatMessage(messages.allGradedSubsections)}
            onChange={() => {}}
          />
        </div>
        <Button onClick={() => setIsAddExtensionModalOpen(true)}>+ {intl.formatMessage(messages.addIndividualExtension)}</Button>
      </div>
      <DateExtensionsList onResetExtensions={handleResetExtensions} />
      <AddExtensionModal
        isOpen={isAddExtensionModalOpen}
        title={intl.formatMessage(messages.addIndividualDueDateExtension)}
        onClose={() => setIsAddExtensionModalOpen(false)}
        onSubmit={handleAddExtension}
      />
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
