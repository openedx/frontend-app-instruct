import { useState } from 'react';
import { useIntl } from '@openedx/frontend-base';
import { Button, FormControl, ModalDialog } from '@openedx/paragon';
import messages from '../messages';
import { FormCheckbox, FormCheckboxSet } from '@openedx/paragon/dist/Form';

export interface AddModalProps {
  instructions: string,
  isOpen: boolean,
  title: string,
  onClose: () => void,
  onSave: (emailList: string[]) => void,
}

const AddModal = ({
  instructions,
  isOpen,
  title,
  onClose,
  onSave }: AddModalProps) => {
  const intl = useIntl();
  const [emails, setEmails] = useState('');

  const handleSave = () => {
    const emailList = emails.split(',').map(email => email.trim()).filter(email => email);
    onSave(emailList);
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} isOverflowVisible={false} title={title}>
      <ModalDialog.Header className="border-light-700 border-bottom">
        <h3 className="text-primary-500">{title}</h3>
      </ModalDialog.Header>
      <ModalDialog.Body className="py-4">
        {/* TABS will be added as a follow up */}
        {/* <Tabs id={`${title.replace(/\s+/g, '-')}-tabs`} className="mt-0 mb-2" onSelect={() => {}}>
          <Tab key={`${title.replace(/\s+/g, '-')}`} eventKey={`${title.replace(/\s+/g, '-')}`} title={title}> */}
        <p className="text-gray-700 x-small mb-2">{instructions}</p>
        <FormControl
          as="textarea"
          rows={4}
          placeholder={intl.formatMessage(messages.userIdentifierPlaceholder)}
          onChange={(e) => setEmails(e.target.value)}
        />
        <FormCheckboxSet isInline className="mt-3 text-primary-500">
          <FormCheckbox controlClassName="border-primary-500">{intl.formatMessage(messages.autoEnrollCheckbox)}</FormCheckbox>
          <FormCheckbox controlClassName="border-primary-500" className="ml-4">{intl.formatMessage(messages.notifyUsersCheckbox)}</FormCheckbox>
        </FormCheckboxSet>
        {/* </Tab>
          <Tab key="upload-csv" eventKey="upload-csv" title={intl.formatMessage(messages.uploadCSV)}>
          </Tab>
        </Tabs> */}
      </ModalDialog.Body>
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

export default AddModal;
