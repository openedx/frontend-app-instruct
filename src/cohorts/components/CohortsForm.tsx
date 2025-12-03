import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { ActionRow, Button, Form, FormControl, FormGroup, FormLabel, FormRadioSet, Hyperlink, Icon } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';
import { useContentGroupsData } from '../data/apiHook';
import { Warning } from '@openedx/paragon/icons';
import { assignmentTypes } from '../constants';

interface CohortsFormProps {
  disableManualAssignment?: boolean,
  onCancel: () => void,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
}

const CohortsForm = ({ disableManualAssignment = false, onCancel, onSubmit }: CohortsFormProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = [] } = useContentGroupsData(courseId);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('0');
  const [selectedContentGroupOption, setSelectedContentGroupOption] = useState<string>('noContentGroup');
  const [selectedAssignmentMethod, setSelectedAssignmentMethod] = useState<string>('automatic');
  const [cohortName, setCohortName] = useState<string>('');

  const contentGroups = [{ id: '', displayName: intl.formatMessage(messages.notSelected) }, ...data];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    onSubmit(event);
  };

  return (
    <Form className="my-3.5 mx-4" onSubmit={handleSubmit}>
      <FormGroup className="w-md-50">
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.cohortName)}</FormLabel>
        <FormControl value={cohortName} onChange={(e) => setCohortName(e.target.value)} placeholder={intl.formatMessage(messages.cohortName)} />
      </FormGroup>
      <FormGroup>
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.cohortAssignmentMethod)}</FormLabel>
        <FormRadioSet name="cohortAssignmentMethod" value={selectedAssignmentMethod} onChange={(e) => setSelectedAssignmentMethod(e.target.value)}>
          <Form.Radio className="mb-2" value={assignmentTypes.automatic}>{intl.formatMessage(messages.automatic)}</Form.Radio>
          <Form.Radio disabled={disableManualAssignment} value={assignmentTypes.manual}>{intl.formatMessage(messages.manual)}</Form.Radio>
        </FormRadioSet>
      </FormGroup>
      <FormGroup className="mb-3.5">
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.associatedContentGroup)}</FormLabel>
        <FormRadioSet
          name="associatedContentGroup"
          value={selectedContentGroupOption}
          onChange={(e) => setSelectedContentGroupOption(e.target.value)}
        >
          <Form.Radio value="noContentGroup">{intl.formatMessage(messages.noContentGroup)}</Form.Radio>
          <div className="d-flex align-items-center">
            <Form.Radio value="selectContentGroup" disabled={data.length === 0}>{intl.formatMessage(messages.selectAContentGroup)}</Form.Radio>
            { data.length > 0
              ? (
                  <FormControl
                    as="select"
                    className="ml-2"
                    size="sm"
                    disabled={selectedContentGroupOption !== 'selectContentGroup'}
                    name="contentGroup"
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    value={selectedGroupId}
                  >
                    {
                      contentGroups.map((contentGroup) => (
                        <option key={contentGroup.id} value={contentGroup.id}>
                          {contentGroup.displayName}
                        </option>
                      ))
                    }
                  </FormControl>
                )
              : (
                  <div className="d-flex align-items-center small">
                    <Icon className="ml-2 text-danger-500" src={Warning} size="sm" />
                    <p className="mb-0 ml-1 text-danger-500">{intl.formatMessage(messages.noContentGroups)}</p>
                    <Hyperlink className="ml-1">{intl.formatMessage(messages.createContentGroup)}</Hyperlink>
                  </div>
                )}
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
