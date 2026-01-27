import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { AlertModal, Button, Container, FormControl, Icon, Toast } from '@openedx/paragon';
import messages from './messages';
import DateExtensionsList from './components/DateExtensionsList';
import ResetExtensionsModal from './components/ResetExtensionsModal';
import { LearnerDateExtension } from './types';
import { useAddDateExtensionMutation, useResetDateExtensionMutation } from './data/apiHook';
import AddExtensionModal from './components/AddExtensionModal';
import SelectGradedSubsection from './components/SelectGradedSubsection';
import { Search } from '@openedx/paragon/icons';

// const successMessage = 'Successfully reset due date for student Phu Nguyen for A subsection with two units (block-v1:SchemaAximWGU+WGU101+1+type@sequential+block@3984030755104708a86592cf23fb1ae4) to 2025-08-21 00:00';

const DateExtensionsPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { mutate: resetMutation } = useResetDateExtensionMutation();
  const { mutate: addExtensionMutation } = useAddDateExtensionMutation();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LearnerDateExtension | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAddExtensionModalOpen, setIsAddExtensionModalOpen] = useState(false);
  const [searchedLearner, setSearchedLearner] = useState<string>('');
  const [gradedSubsectionFilter, setGradedSubsectionFilter] = useState<string>('');

  const handleResetExtensions = (user: LearnerDateExtension) => {
    setIsResetModalOpen(true);
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setIsResetModalOpen(false);
    setSelectedUser(null);
  };

  const handleErrorOnReset = (error: any) => {
    setErrorMessage(error.message);
  };

  const handleSuccessOnReset = (response: any) => {
    const { message } = response;
    setSuccessMessage(message);
    handleCloseModal();
  };

  const handleConfirmReset = async () => {
    if (selectedUser && courseId) {
      resetMutation({
        courseId,
        userId: selectedUser.id
      }, {
        onError: handleErrorOnReset,
        onSuccess: handleSuccessOnReset
      });
    }
  };

  const handleOpenAddExtension = () => {
    setIsAddExtensionModalOpen(true);
  };

  const handleAddExtension = ({ email_or_username, block_id, due_datetime, reason }) => {
    addExtensionMutation({ courseId, extensionData: {
      email_or_username,
      block_id,
      due_datetime,
      reason
    } }, {
      onError: handleErrorOnReset,
      onSuccess: handleSuccessOnReset
    });
  };

  return (
    <Container className="mt-4.5 mb-4 mx-4">
      <h3>{intl.formatMessage(messages.dateExtensionsTitle)}</h3>
      <div className="d-flex align-items-center justify-content-between mb-3.5">
        <div className="d-flex">
          <FormControl
            onChange={(e) => setSearchedLearner(e.target.value)}
            placeholder={intl.formatMessage(messages.searchLearnerPlaceholder)}
            trailingElement={<Icon src={Search} />}
            value={searchedLearner}
          />
          <SelectGradedSubsection
            placeholder={intl.formatMessage(messages.allGradedSubsections)}
            onChange={(e) => setGradedSubsectionFilter(e.target.value)}
            value={gradedSubsectionFilter}
          />
        </div>
        <Button onClick={handleOpenAddExtension}>+ {intl.formatMessage(messages.addIndividualExtension)}</Button>
      </div>
      <DateExtensionsList
        searchedLearner={searchedLearner}
        gradedSubsectionFilter={gradedSubsectionFilter}
        onResetExtensions={handleResetExtensions}
      />
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
      <Toast show={!!successMessage} onClose={() => {}} className="text-break">
        {successMessage}
      </Toast>
      <AlertModal title={errorMessage} isOpen={!!errorMessage} footerNode={<Button onClick={() => setErrorMessage('')}>{intl.formatMessage(messages.close)}</Button>}>
        {errorMessage}
      </AlertModal>
    </Container>
  );
};

export default DateExtensionsPage;
