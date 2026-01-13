import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, IconButton } from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';
import messages from './messages';
import EnrollmentsList from './components/EnrollmentsList';
import EnrollmentStatusModal from './components/EnrollmentStatusModal';
import UnenrollModal from './components/UnenrollModal';
import EnrollLearnersModal from './components/EnrollLearnersModal';
import { EnrolledLearner } from './types';

const EnrollmentsPage = () => {
  const intl = useIntl();
  const [isEnrollmentStatusModalOpen, setIsEnrollmentStatusModalOpen] = useState(false);
  const [isEnrollLearnersModalOpen, setIsEnrollLearnersModalOpen] = useState(false);
  const [isUnenrollModalOpen, setIsUnenrollModalOpen] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<EnrolledLearner | null>(null);

  const handleMoreButton = () => {
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
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-primary-700">{intl.formatMessage(messages.enrollmentsPageTitle)}</h3>
        <ActionRow>
          <IconButton
            alt={intl.formatMessage(messages.checkEnrollmentStatus)}
            className="lead"
            iconAs={MoreVert}
            onClick={handleMoreButton}
          />
          <Button variant="outline-primary">+ {intl.formatMessage(messages.addBetaTesters)}</Button>
          <Button onClick={handleEnrollLearners}>+ {intl.formatMessage(messages.enrollLearners)}</Button>
        </ActionRow>
      </div>
      <EnrollmentsList onUnenroll={handleUnenroll} />
      <EnrollmentStatusModal isOpen={isEnrollmentStatusModalOpen} onClose={handleCloseEnrollmentStatusModal} />
      {selectedLearner && <UnenrollModal isOpen={isUnenrollModalOpen} learner={selectedLearner} onClose={handleUnenrollModalClose} onSuccess={() => {}} />}
      <EnrollLearnersModal isOpen={isEnrollLearnersModalOpen} onClose={() => setIsEnrollLearnersModalOpen(false)} onSuccess={() => {}} />
    </>
  );
};

export default EnrollmentsPage;
