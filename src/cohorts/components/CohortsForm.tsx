import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ActionRow, Button, Form, FormControl, FormGroup, FormLabel, FormRadioSet, Hyperlink, Icon } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';
import { useContentGroupsData } from '../data/apiHook';
import { Warning } from '@openedx/paragon/icons';
import { assignmentTypes } from '../constants';
import { CohortData, useCohortContext } from './CohortContext';

interface CohortsFormProps {
  disableManualAssignment?: boolean,
  onCancel: () => void,
  onSubmit: (data: Partial<CohortData>) => void,
}

const CohortsForm = ({ disableManualAssignment = false, onCancel, onSubmit }: CohortsFormProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data = [] } = useContentGroupsData(courseId);
  const { selectedCohort } = useCohortContext();

  const initialCohortName = (selectedCohort?.name) ?? '';
  const initialAssignmentType = selectedCohort?.assignmentType ?? assignmentTypes.automatic;
  const initialContentGroupOption = selectedCohort?.groupId ? 'selectContentGroup' : 'noContentGroup';
  const initialContentGroup = selectedCohort?.groupId && selectedCohort?.userPartitionId ? `${selectedCohort.groupId}:${selectedCohort.userPartitionId}` : 'null';

  const [selectedContentGroup, setSelectedContentGroup] = useState<string>(initialContentGroup);
  const [selectedContentGroupOption, setSelectedContentGroupOption] = useState<string>(initialContentGroupOption);
  const [selectedAssignmentType, setSelectedAssignmentType] = useState<string>(initialAssignmentType);
  const [name, setName] = useState<string>(initialCohortName);

  useEffect(() => {
    if (selectedCohort) {
      const contentGroup = selectedCohort.groupId && selectedCohort.userPartitionId ? `${selectedCohort.groupId}:${selectedCohort.userPartitionId}` : 'null';
      setName(selectedCohort.name);
      setSelectedAssignmentType(selectedCohort.assignmentType);
      setSelectedContentGroupOption(selectedCohort.groupId ? 'selectContentGroup' : 'noContentGroup');
      setSelectedContentGroup(contentGroup);
    }
  }, [selectedCohort]);

  const contentGroups = [{ id: 'null', displayName: intl.formatMessage(messages.notSelected) }, ...data];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contentGroups = selectedContentGroupOption.split(':');
    const groupId = contentGroups.length > 1 ? Number(contentGroups[0]) : null;
    const userPartitionId = contentGroups.length > 1 ? Number(contentGroups[1]) : null;
    onSubmit({
      name,
      assignmentType: selectedAssignmentType,
      groupId,
      userPartitionId,
    });
  };

  return (
    <Form className="my-3.5 mx-4" onSubmit={handleSubmit}>
      <FormGroup className="w-md-50">
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.cohortName)}</FormLabel>
        <FormControl value={name} onChange={(e) => setName(e.target.value)} placeholder={intl.formatMessage(messages.cohortName)} />
      </FormGroup>
      <FormGroup>
        <FormLabel className="text-primary-500">{intl.formatMessage(messages.cohortAssignmentMethod)}</FormLabel>
        <FormRadioSet name="assignmentType" value={selectedAssignmentType} onChange={(e) => setSelectedAssignmentType(e.target.value)}>
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
                    onChange={(e) => setSelectedContentGroup(e.target.value)}
                    value={selectedContentGroup}
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
