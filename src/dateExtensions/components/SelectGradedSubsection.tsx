import { useParams } from 'react-router-dom';
import { FormLabel, FormControl, FormGroup } from '@openedx/paragon';
import { useGradedSubsections } from '../data/apiHook';

interface SelectGradedSubsectionProps {
  label?: string,
  placeholder: string,
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
}

const SelectGradedSubsection = ({ label, placeholder, onChange }: SelectGradedSubsectionProps) => {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = { items: [] } } = useGradedSubsections(courseId);
  const selectOptions = [{ displayName: placeholder, subsectionId: '' }, ...data.items];
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event);
  };

  return (
    <FormGroup size="sm">
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl placeholder={placeholder} name="blockId" as="select" onChange={handleChange} size="md">
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
