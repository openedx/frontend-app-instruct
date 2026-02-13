import { Button, FormControl, FormGroup, FormLabel } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from './messages';

interface SpecifyLearnerFieldProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

const SpecifyLearnerField = ({ onChange }: SpecifyLearnerFieldProps) => {
  const intl = useIntl();

  return (
    <FormGroup size="sm">
      <FormLabel>{intl.formatMessage(messages.specifyLearner)}</FormLabel>
      <div className="d-flex">
        <FormControl className="mr-2" name="emailOrUsername" placeholder={intl.formatMessage(messages.specifyLearnerPlaceholder)} size="md" autoResize onChange={onChange} />
        <Button>{intl.formatMessage(messages.select)}</Button>
      </div>
    </FormGroup>
  );
};

export default SpecifyLearnerField;
