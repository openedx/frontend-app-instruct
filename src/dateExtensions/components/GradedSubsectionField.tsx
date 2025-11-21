import { FormAutosuggest, FormAutosuggestOption, FormGroup, FormLabel } from '@openedx/paragon';

const options = [
  { label: 'is an example', value: 'example' },
  { label: 'another example', value: 'another' }
];

interface GradedSubsectionFieldProps {
  onChange: (value: string) => void,
}

const GradedSubsectionField = ({ onChange }: GradedSubsectionFieldProps) => {
  return (
    <FormGroup size="sm">
      <FormLabel>Select Graded Subsection:</FormLabel>
      <FormAutosuggest placeholder="Select Graded Subsection">
        {
          options.map((option) => (
            <FormAutosuggestOption key={option.value} name="block_id" value={option.value} onChange={onChange}>
              {option.label}
            </FormAutosuggestOption>
          ))
        }
      </FormAutosuggest>
    </FormGroup>
  );
};

export default GradedSubsectionField;
