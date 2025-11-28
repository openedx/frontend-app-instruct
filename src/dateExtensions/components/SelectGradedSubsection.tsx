import { FormLabel, FormControl, FormGroup } from '@openedx/paragon';
import { useGradedSubsections } from '../data/apiHook';
import { useParams } from 'react-router';

interface SelectGradedSubsectionProps {
  label?: string,
  placeholder: string,
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
}

// Example API response used to test
// const options = [
//   { displayName: 'is an example', subsectionId: 'example' },
//   { displayName: 'another example', subsectionId: 'another' }
// ];

const SelectGradedSubsection = ({ label, placeholder, onChange }: SelectGradedSubsectionProps) => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = { results: [] } } = useGradedSubsections(courseId);
  const selectOptions = [{ displayName: placeholder, subsectionId: '' }, ...data.results];
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event);
  };

  return (
    <FormGroup size="sm">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl placeholder={placeholder} name="block_id" as="select" onChange={handleChange} size="md">
        {
          selectOptions.map((option) => (
            <option key={option.subsectionId} value={option.subsectionId}>
              {option.displayName}
            </option>
          ))
        }
      </FormControl>
    </FormGroup>
  );
};

export default SelectGradedSubsection;
