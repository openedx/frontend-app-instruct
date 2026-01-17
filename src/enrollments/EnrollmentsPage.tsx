import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, IconButton } from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';
import messages from './messages';
import EnrollmentsList from './components/EnrollmentsList';
import EnrollmentStatusModal from './components/EnrollmentStatusModal';
import UnenrollModal from './components/UnenrollModal';
import EnrollLearnersModal from './components/EnrollLearnersModal';
import { Learner } from './types';
import AddBetaTestersModal from './components/AddBetaTestersModal';

const EnrollmentsPage = () => {
  const intl = useIntl();
  const [isEnrollmentStatusModalOpen, setIsEnrollmentStatusModalOpen] = useState(false);
  const [isEnrollLearnersModalOpen, setIsEnrollLearnersModalOpen] = useState(false);
  const [isAddBetaTestersModalOpen, setIsAddBetaTestersModalOpen] = useState(false);
  const [isUnenrollModalOpen, setIsUnenrollModalOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);

  const handleMoreButton = () => {
    setIsEnrollmentStatusModalOpen(true);
  };

  const handleUnenroll = (learner: Learner) => {
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
  };

  const handleAddBetaTesters = () => {
    setIsAddBetaTestersModalOpen(true);
  };

  return (
    <div className="my-4.5 mx-4">
      <div className="d-flex justify-content-between align-items-center">
        <h3>{intl.formatMessage(messages.enrollmentsPageTitle)}</h3>
        <ActionRow>
          <IconButton
            alt={intl.formatMessage(messages.checkEnrollmentStatus)}
            className="lead"
            iconAs={MoreVert}
            onClick={handleMoreButton}
          />
          <Button variant="outline-primary" onClick={handleAddBetaTesters}>+ {intl.formatMessage(messages.addBetaTesters)}</Button>
          <Button onClick={handleEnrollLearners}>+ {intl.formatMessage(messages.enrollLearners)}</Button>
        </ActionRow>
      </div>
      <EnrollmentsList onUnenroll={handleUnenroll} />
      <EnrollmentStatusModal isOpen={isEnrollmentStatusModalOpen} onClose={handleCloseEnrollmentStatusModal} />
      <UnenrollModal isOpen={isUnenrollModalOpen} learner={selectedLearner} onClose={handleUnenrollModalClose} />
      <EnrollLearnersModal isOpen={isEnrollLearnersModalOpen} onClose={() => setIsEnrollLearnersModalOpen(false)} onSuccess={() => {}} />
      <AddBetaTestersModal isOpen={isAddBetaTestersModalOpen} onClose={() => setIsAddBetaTestersModalOpen(false)} onSuccess={() => {}} />
    </div>
  );
};

export default EnrollmentsPage;
