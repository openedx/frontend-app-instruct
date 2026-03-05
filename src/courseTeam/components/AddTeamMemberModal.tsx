import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';
import messages from '../messages';
import { useCourseInfo } from '@src/data/apiHook';
import { useRoles } from '../data/apiHook';

interface AddTeamMemberModalProps {
  isOpen: boolean,
  onClose: () => void,
  onSave: ({ users, role }: { users: string[], role: string }) => void,
}

const AddTeamMemberModal = ({
  isOpen,
  onClose,
  onSave,
}: AddTeamMemberModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data: { displayName } = { displayName: '' } } = useCourseInfo(courseId);
  const { data } = useRoles(courseId);

  const roles = [{ id: '', name: intl.formatMessage(messages.rolePlaceholder) }, ...(data || [])];

  const handleSave = () => {
    onSave({ users: [''], role: '' });
  };

  return (
    <ModalDialog isOpen={isOpen} onClose={onClose} title={intl.formatMessage(messages.addNewTeamMember)} isOverflowVisible={false} size="lg">
      <ModalDialog.Header>
        <h3 className="text-primary-500">{intl.formatMessage(messages.addNewTeamMember)}</h3>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <p>{intl.formatMessage(messages.addNewTeamMemberDescription, { courseName: displayName })}</p>
        <Form.Group>
          <Form.Label>{intl.formatMessage(messages.addUsersLabel)}</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder={intl.formatMessage(messages.usersPlaceholder)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>{intl.formatMessage(messages.roleLabel)}</Form.Label>
          <Form.Control as="select" defaultValue="" placeholder={intl.formatMessage(messages.rolePlaceholder)} disabled={roles.length === 1}>
            {
              roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))
            }
          </Form.Control>
        </Form.Group>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancelButton)}</Button>
          <Button variant="primary" onClick={handleSave}>{intl.formatMessage(messages.saveButton)}</Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default AddTeamMemberModal;
