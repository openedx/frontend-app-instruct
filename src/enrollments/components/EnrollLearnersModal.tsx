import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl, ModalDialog, Form } from '@openedx/paragon';
import { useAlert } from '@src/providers/AlertProvider';
import messages from '../messages';
import { useUpdateEnrollments } from '../data/apiHook';
import { isAxiosError } from 'axios';

export interface EnrollLearnersModalProps {
  isOpen: boolean,
  onClose: () => void,
  onSuccess: () => void,
}

const EnrollLearnersModal = ({
  isOpen,
  onClose,
  onSuccess
}: EnrollLearnersModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [emails, setEmails] = useState('');
  const [autoEnroll, setAutoEnroll] = useState(true);
  const [emailStudents, setEmailStudents] = useState(true);
  const { mutate: enrollLearners } = useUpdateEnrollments(courseId);
  const { showModal } = useAlert();

  const handleSave = () => {
    const identifier = emails.split(',').map(email => email.trim()).filter(email => email);
    enrollLearners({ identifier, action: 'enroll', autoEnroll, emailStudents }, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
      onError: (error) => {
        const notFound = isAxiosError(error) && error.response?.status === 404;
        const errorMessage = notFound
          ? intl.formatMessage(messages.enrollLearnerNotFoundError)
          : error.message || intl.formatMessage(messages.enrollLearnerError);
        showModal({
          message: errorMessage,
          variant: 'danger',
          confirmText: intl.formatMessage(messages.closeButton),
        });
      }
    });
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} isOverflowVisible={false} title={intl.formatMessage(messages.enrollLearners)}>
      <ModalDialog.Header className="border-light-700 border-bottom">
        <h3 className="text-primary-500">{intl.formatMessage(messages.enrollLearners)}</h3>
      </ModalDialog.Header>
      <div className="position-relative overflow-auto">
        <ModalDialog.Body className="py-4">
          <p className="text-gray-700 x-small mb-2">{intl.formatMessage(messages.addLearnerInstructions)}</p>
          <FormControl
            name="identifier"
            as="textarea"
            rows={4}
            placeholder={intl.formatMessage(messages.userIdentifierPlaceholder)}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmails(e.target.value)}
          />
          <div className="d-flex mt-3 text-primary-500">
            <Form.Checkbox
              controlClassName="border-primary-500"
              checked={autoEnroll}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoEnroll(e.target.checked)}
            >{intl.formatMessage(messages.autoEnrollCheckbox)}
            </Form.Checkbox>
            <Form.Checkbox
              controlClassName="border-primary-500"
              className="ml-4"
              checked={emailStudents}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailStudents(e.target.checked)}
            >{intl.formatMessage(messages.notifyUsersCheckbox)}
            </Form.Checkbox>
          </div>
        </ModalDialog.Body>
      </div>
      <ModalDialog.Footer className="border-light-700 border-top">
        <Button variant="tertiary" onClick={onClose}>
          {intl.formatMessage(messages.cancelButton)}
        </Button>
        <Button className="ml-2" variant="primary" onClick={handleSave} disabled={emails.trim().length === 0}>
          {intl.formatMessage(messages.saveButton)}
        </Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default EnrollLearnersModal;
