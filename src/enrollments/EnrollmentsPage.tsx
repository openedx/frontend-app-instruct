import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Dropdown, IconButton } from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';
import messages from '@src/enrollments/messages';
import AddBetaTestersModal from '@src/enrollments/components/AddBetaTestersModal';
import EnrollLearnersModal from '@src/enrollments/components/EnrollLearnersModal';
import EnrollmentsList from '@src/enrollments/components/EnrollmentsList';
import EnrollmentStatusModal from '@src/enrollments/components/EnrollmentStatusModal';
import UnenrollModal from '@src/enrollments/components/UnenrollModal';
import { EnrolledLearner } from '@src/enrollments/types';
import { AlertOutlet, useAlert } from '@src/providers/AlertProvider';
import UpdateBetaTesterModal from './components/UpdateBetaTesterModal';

const EnrollmentsPage = () => {
  const intl = useIntl();
  const [isEnrollmentStatusModalOpen, setIsEnrollmentStatusModalOpen] = useState(false);
  const [isEnrollLearnersModalOpen, setIsEnrollLearnersModalOpen] = useState(false);
  const [isAddBetaTestersModalOpen, setIsAddBetaTestersModalOpen] = useState(false);
  const [isUnenrollModalOpen, setIsUnenrollModalOpen] = useState(false);
  const [isUpdateBetaTesterModalOpen, setIsUpdateBetaTesterModalOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<EnrolledLearner | null>(null);
  const { clearAlerts } = useAlert();

  const handleOpenEnrollmentStatusModal = () => {
    setIsEnrollmentStatusModalOpen(true);
  };

  const handleUnenroll = (learner: EnrolledLearner) => {
    setIsUnenrollModalOpen(true);
    setSelectedLearner(learner);
  };

  const handleUnenrollModalClose = () => {
    setIsUnenrollModalOpen(false);
    setSelectedLearner(null);
  };

  const handleCloseEnrollmentStatusModal = () => {
    setIsEnrollmentStatusModalOpen(false);
  };

  const handleEnrollLearners = () => {
    setIsEnrollLearnersModalOpen(true);
    clearAlerts();
  };

  const handleCloseEnrollLearnersModal = () => {
    setIsEnrollLearnersModalOpen(false);
  };

  const handleAddBetaTesters = () => {
    setIsAddBetaTestersModalOpen(true);
    clearAlerts();
  };

  const handleBetaTesterChange = (learner: EnrolledLearner) => {
    setIsUpdateBetaTesterModalOpen(true);
    setSelectedLearner(learner);
  };

  const handleCloseUpdateBetaTesterModal = () => {
    setIsUpdateBetaTesterModalOpen(false);
    setSelectedLearner(null);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-primary-700">{intl.formatMessage(messages.enrollmentsPageTitle)}</h3>
        <ActionRow>
          <Dropdown>
            <Dropdown.Toggle
              as={IconButton}
              src={MoreVert}
              alt={intl.formatMessage(messages.checkEnrollmentStatus)}
              id="check-enrollment-status-menu"
            />
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleOpenEnrollmentStatusModal}>
                {intl.formatMessage(messages.checkEnrollmentStatus)}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button variant="outline-primary" onClick={handleAddBetaTesters}>+ {intl.formatMessage(messages.addBetaTesters)}</Button>
          <Button onClick={handleEnrollLearners}>+ {intl.formatMessage(messages.enrollLearners)}</Button>
        </ActionRow>
      </div>
      <AlertOutlet />
      <EnrollmentsList onUnenroll={handleUnenroll} onBetaTesterChange={handleBetaTesterChange} />
      <EnrollmentStatusModal isOpen={isEnrollmentStatusModalOpen} onClose={handleCloseEnrollmentStatusModal} />
      {selectedLearner && <UnenrollModal isOpen={isUnenrollModalOpen} learner={selectedLearner} onClose={handleUnenrollModalClose} />}
      <EnrollLearnersModal isOpen={isEnrollLearnersModalOpen} onClose={handleCloseEnrollLearnersModal} />
      <AddBetaTestersModal isOpen={isAddBetaTestersModalOpen} onClose={() => setIsAddBetaTestersModalOpen(false)} />
      {selectedLearner && <UpdateBetaTesterModal isOpen={isUpdateBetaTesterModalOpen} learner={selectedLearner} onClose={handleCloseUpdateBetaTesterModal} />}
    </>
  );
};

export default EnrollmentsPage;
