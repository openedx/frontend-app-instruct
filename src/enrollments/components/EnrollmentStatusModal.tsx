import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl, ModalDialog } from '@openedx/paragon';
import { useEnrollmentByUserId } from '../data/apiHook';
import messages from '../messages';

interface EnrollmentStatusModalProps {
  isOpen: boolean,
  onClose: () => void,
}

const EnrollmentStatusModal = ({ isOpen, onClose }: EnrollmentStatusModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [learnerIdentifier, setLearnerIdentifier] = useState<string>('');
  const { data = { status: '' }, refetch } = useEnrollmentByUserId(courseId, learnerIdentifier);

  const handleSearch = async () => {
    refetch();
  };

  return (
    <ModalDialog title={intl.formatMessage(messages.checkEnrollmentStatus)} isOpen={isOpen} onClose={onClose} isOverflowVisible={false}>
      <ModalDialog.Header><h3 className="text-primary-500">{intl.formatMessage(messages.checkEnrollmentStatus)}</h3></ModalDialog.Header>
      <ModalDialog.Body className="py-4">
        <p>{intl.formatMessage(messages.addLearnerInstructions)}</p>
        <FormControl
          placeholder={intl.formatMessage(messages.enrollLearnersPlaceholder)}
          value={learnerIdentifier}
          onChange={(e) => setLearnerIdentifier(e.target.value)}
        />
        <Button
          className="mt-3"
          onClick={handleSearch}
          disabled={!learnerIdentifier.trim()}
        >
          {intl.formatMessage(messages.checkEnrollmentStatus)}
        </Button>

        {data.status && learnerIdentifier && (
          <p>{intl.formatMessage(messages.statusResponseMessage, { learnerIdentifier, status: data.status })}</p>
        )}
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button onClick={onClose}>{intl.formatMessage(messages.closeButton)}</Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default EnrollmentStatusModal;
