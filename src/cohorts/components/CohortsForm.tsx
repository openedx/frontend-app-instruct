import { useParams } from 'react-router-dom';
import { ActionRow, Button, Form, FormControl, FormGroup, FormLabel, FormRadioSet } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';
import { useContentGroupsData } from '../../data/apiHook';

interface CohortsFormProps {
  onCancel: () => void,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
}

const CohortsForm = ({ onCancel, onSubmit }: CohortsFormProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = [] } = useContentGroupsData(courseId);

  const contentGroups = [{ id: '', displayName: intl.formatMessage(messages.notSelected) }, ...data];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    onSubmit(event);
  };

  return (
    <Form className="my-3.5 mx-4" onSubmit={handleSubmit}>
      <FormGroup className="w-md-50">
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.cohortName)}</FormLabel>
        <FormControl placeholder={intl.formatMessage(messages.cohortName)} />
      </FormGroup>
      <FormGroup>
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.cohortAssignmentMethod)}</FormLabel>
        <FormRadioSet name="cohortAssignmentMethod">
          <Form.Radio className="mb-2">{intl.formatMessage(messages.automatic)}</Form.Radio>
          <Form.Radio>{intl.formatMessage(messages.manual)}</Form.Radio>
        </FormRadioSet>
      </FormGroup>
      <FormGroup className="mb-3.5">
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.associatedContentGroup)}</FormLabel>
        <FormRadioSet name="associatedContentGroup">
          <Form.Radio>{intl.formatMessage(messages.noContentGroup)}</Form.Radio>
          <div className="d-flex align-items-center">
            <Form.Radio>{intl.formatMessage(messages.selectAContentGroup)}</Form.Radio>
            <FormControl as="select" className="ml-2" size="sm">
              {
                contentGroups.map((contentGroup) => (
                  <option key={contentGroup.id} value={contentGroup.id}>
                    {contentGroup.displayName}
                  </option>
                ))
              }
            </FormControl>
          </div>
        </FormRadioSet>
      </FormGroup>
      <ActionRow>
        <Button variant="tertiary" onClick={onCancel}>{intl.formatMessage(messages.cancelLabel)}</Button>
        <Button type="submit">{intl.formatMessage(messages.saveLabel)}</Button>
      </ActionRow>
    </Form>
  );
};

export default CohortsForm;
