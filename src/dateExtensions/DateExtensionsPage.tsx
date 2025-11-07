import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button } from '@openedx/paragon';
import messages from './messages';
import DateExtensionsList from './components/DateExtensionsList';
import ResetExtensionsModal from './components/ResetExtensionsModal';
import { LearnerDateExtension } from './types';

// const successMessage = 'Successfully reset due date for student Phu Nguyen for A subsection with two units (block-v1:SchemaAximWGU+WGU101+1+type@sequential+block@3984030755104708a86592cf23fb1ae4) to 2025-08-21 00:00';

const DateExtensionsPage = () => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LearnerDateExtension | null>(null);

  const handleResetExtensions = (user: LearnerDateExtension) => {
    setIsModalOpen(true);
    setSelectedUser(user);
  };

  const handleConfirmReset = () => {
    if (selectedUser) {
      // Call the API to reset the extensions for the selected user
      console.log(`Resetting extensions for user: ${selectedUser.username}`);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleCancelReset = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
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
        isOpen={isModalOpen}
        message={intl.formatMessage(messages.resetConfirmationMessage)}
        title={intl.formatMessage(messages.resetConfirmationHeader, { username: selectedUser?.username })}
        onCancelReset={handleCancelReset}
        onClose={handleCancelReset}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
};

export default DateExtensionsPage;
