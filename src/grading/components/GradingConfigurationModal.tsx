import { Button, ModalDialog } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';

interface GradingConfigurationModalProps {
  isOpen: boolean,
  onClose: () => void,
}

const GradingConfigurationModal = ({ isOpen, onClose }: GradingConfigurationModalProps) => {
  const intl = useIntl();

  return (
    <ModalDialog title={intl.formatMessage(messages.gradingConfiguration)} isOpen={isOpen} onClose={onClose} isOverflowVisible={false}>
      <ModalDialog.Header>
        <h3>{intl.formatMessage(messages.gradingConfiguration)}</h3>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <p>x</p>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <Button onClick={onClose}>{intl.formatMessage(messages.close)}</Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default GradingConfigurationModal;
