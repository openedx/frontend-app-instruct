import { useState } from 'react';
import { ActionRow, Button, Form, FormControl, FormGroup, FormLabel, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import SpecifyLearnerField from '../../components/SpecifyLearnerField/SpecifyLearnerField';
import messages from '../messages';
import SelectGradedSubsection from './SelectGradedSubsection';

interface AddExtensionModalProps {
  isOpen: boolean,
  title: string,
  onClose: () => void,
  onSubmit: ({ email_or_username, block_id, due_datetime, reason }: {
    email_or_username: string,
    block_id: string,
    due_datetime: string,
    reason: string,
  }) => void,
}

const AddExtensionModal = ({ isOpen, title, onClose, onSubmit }: AddExtensionModalProps) => {
  const intl = useIntl();
  const [formData, setFormData] = useState({
    email_or_username: '',
    block_id: '',
    due_date: '',
    due_time: '',
    reason: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const { email_or_username, block_id, due_date, due_time, reason } = formData;
    onSubmit({
      email_or_username,
      block_id,
      due_datetime: `${due_date} ${due_time}`,
      reason
    });
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={title} isOverflowVisible={false} size="xl">
      <Form onSubmit={handleSubmit}>
        <ModalDialog.Header className="p-3 pl-4">
          <h3>{title}</h3>
        </ModalDialog.Header>
        <ModalDialog.Body className="border-bottom border-top">
          <div className="pt-3">
            <p>{intl.formatMessage(messages.extensionInstructions)}</p>
            <div className="container-fluid border-bottom mb-4.5 pb-3">
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <SpecifyLearnerField onChange={() => {}} />
                </div>
                <div className="col-sm-12 col-md-4">
                  <SelectGradedSubsection
                    label={intl.formatMessage(messages.selectGradedSubsection)}
                    placeholder={intl.formatMessage(messages.selectGradedSubsection)}
                    onChange={onChange}
                  />
                </div>
              </div>
            </div>
            <div>
              <h4>{intl.formatMessage(messages.defineExtension)}</h4>
              <FormGroup size="sm">
                <FormLabel>
                  {intl.formatMessage(messages.extensionDate)}:
                </FormLabel>
                <div className="d-md-flex w-md-50 align-items-center">
                  <FormControl name="due_date" type="date" size="md" />
                  <FormControl name="due_time" type="time" size="md" className="mt-sm-3 mt-md-0" />
                </div>
              </FormGroup>
              <FormGroup className="mt-3" size="sm">
                <FormLabel>
                  {intl.formatMessage(messages.reasonForExtension)}:
                </FormLabel>
                <FormControl name="reason" placeholder={intl.formatMessage(messages.reasonForExtension)} size="md" />
              </FormGroup>
            </div>
          </div>
        </ModalDialog.Body>
        <ModalDialog.Footer className="p-4">
          <ActionRow>
            <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancel)}</Button>
            <Button type="submit">{intl.formatMessage(messages.addExtension)}</Button>
          </ActionRow>
        </ModalDialog.Footer>
      </Form>
    </ModalDialog>
  );
};

export default AddExtensionModal;
