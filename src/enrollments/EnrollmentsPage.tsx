import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, IconButton } from '@openedx/paragon';
import { MoreVert } from '@openedx/paragon/icons';
import messages from './messages';
import EnrollmentsList from './components/EnrollmentsList';
import EnrollmentStatusModal from './components/EnrollmentStatusModal';
import UnenrollModal from './components/UnenrollModal';

const EnrollmentsPage = () => {
  const intl = useIntl();
  const [isEnrollmentStatusModalOpen, setIsEnrollmentStatusModalOpen] = useState(false);
  const [isUnenrollModalOpen, setIsUnenrollModalOpen] = useState(false);
  const [unenrollId, setUnenrollId] = useState<number | null>(null);

  const handleMoreButton = () => {
    setIsEnrollmentStatusModalOpen(true);
  };

  const handleUnenroll = (enrollmentId: number) => {
    setIsUnenrollModalOpen(true);
    setUnenrollId(enrollmentId);
  };

  const handleUnenrollModalClose = () => {
    setIsUnenrollModalOpen(false);
    setUnenrollId(null);
  };

  const handleCloseEnrollmentStatusModal = () => {
    setIsEnrollmentStatusModalOpen(false);
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
          <Button variant="outline-primary">+ {intl.formatMessage(messages.addBetaTesters)}</Button>
          <Button>+ {intl.formatMessage(messages.enrollLearners)}</Button>
        </ActionRow>
      </div>
      <EnrollmentsList onUnenroll={handleUnenroll} />
      <EnrollmentStatusModal isOpen={isEnrollmentStatusModalOpen} onClose={handleCloseEnrollmentStatusModal} />
      <UnenrollModal isOpen={isUnenrollModalOpen} unenrollId={unenrollId} onClose={handleUnenrollModalClose} />
    </div>
  );
};

export default EnrollmentsPage;
