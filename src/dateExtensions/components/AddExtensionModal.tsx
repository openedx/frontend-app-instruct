import { ActionRow, Button, FormAutosuggest, FormAutosuggestOption, FormControl, FormGroup, FormLabel, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import SpecifyLearnerField from '../../components/SpecifyLearnerField/SpecifyLearnerField';
import messages from '../messages';

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

  const options = [
    { label: 'is an example', value: 'example' },
    { label: 'another example', value: 'another' }
  ];

  const handleSubmit = () => {
    onSubmit({
      email_or_username: 'dianasalas',
      block_id: 'block-v1:DV-edtech+check+2025-05+type@sequential+block@a9500056bbb544ea82fad0d3957c6932',
      due_datetime: '2025-01-21 00:00:00',
      reason: 'Personal reasons'
    });
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={title} isOverflowVisible={false} size="xl">
      <ModalDialog.Header className="p-3 pl-4">
        <h3>{title}</h3>
      </ModalDialog.Header>
      <ModalDialog.Body className="border-bottom border-top">
        <div className="pt-3">
          <p>{intl.formatMessage(messages.extensionInstructions)}</p>
          <FormGroup size="sm">
            <div className="container-fluid border-bottom mb-4.5 pb-3">
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <SpecifyLearnerField onChange={() => {}} />
                </div>
                <div className="col-sm-12 col-md-4">
                  <FormLabel>{intl.formatMessage(messages.selectGradedSubsection)}</FormLabel>
                  <FormAutosuggest placeholder={intl.formatMessage(messages.selectGradedSubsection)} name="block_id">
                    {
                      options.map((option) => (
                        <FormAutosuggestOption key={option.value} value={option.value} onChange={() => {}}>
                          {option.label}
                        </FormAutosuggestOption>
                      ))
                    }
                  </FormAutosuggest>
                </div>
              </div>
            </div>
            <div>
              <h4>{intl.formatMessage(messages.defineExtension)}</h4>
              <FormLabel>
                {intl.formatMessage(messages.extensionDate)}:
              </FormLabel>
              <div className="d-md-flex w-md-50 align-items-center">
                <FormControl name="due_date" type="date" size="md" />
                <FormControl name="due_time" type="time" size="md" className="mt-sm-3 mt-md-0" />
              </div>
              <div className="mt-3">
                <FormLabel>
                  {intl.formatMessage(messages.reasonForExtension)}:
                </FormLabel>
                <FormControl name="reason" placeholder="Reason for extension" size="md" />
              </div>
            </div>
          </FormGroup>
        </div>
      </ModalDialog.Body>
      <ModalDialog.Footer className="p-4">
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancel)}</Button>
          <Button onClick={handleSubmit}>{intl.formatMessage(messages.addExtension)}</Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default AddExtensionModal;
