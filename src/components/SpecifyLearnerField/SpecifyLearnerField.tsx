import { Button, FormControl, FormGroup, FormLabel } from '@openedx/paragon';

interface SpecifyLearnerFieldProps {
  onChange: (value: string) => void,
}

const SpecifyLearnerField = ({ onChange }: SpecifyLearnerFieldProps) => {
  return (
    <FormGroup size="sm">
      <FormLabel>Specify Learner:</FormLabel>
      <div className="d-flex">
        <FormControl className="mr-2" name="email_or_username" placeholder="Learner email, address or username" size="md" autoResize onChange={(e) => onChange(e.target.value)} />
        <Button>Select</Button>
      </div>
    </FormGroup>
  );
};

export default SpecifyLearnerField;
