import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Form, ModalDialog } from '@openedx/paragon';
import { useAddTeamMember, useRoles } from '@src/courseTeam/data/apiHook';
import messages from '@src/courseTeam/messages';
import { useCourseInfo } from '@src/data/apiHook';
import { useDebouncedFilter } from '@src/hooks/useDebouncedFilter';
import { useAlert } from '@src/providers/AlertProvider';

interface AddTeamMemberModalProps {
  isOpen: boolean,
  onClose: () => void,
}

const AddTeamMemberModal = ({
  isOpen,
  onClose,
}: AddTeamMemberModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data: { displayName } = { displayName: '' } } = useCourseInfo(courseId);
  const { data: { results } = { results: [] } } = useRoles(courseId);
  const [users, setUsers] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const { inputValue, handleChange } = useDebouncedFilter({
    filterValue: users,
    setFilter: setUsers,
  });
  const { mutate: addTeamMember } = useAddTeamMember(courseId);
  const { showModal } = useAlert();

  const roles = [{ role: '', displayName: intl.formatMessage(messages.rolePlaceholder) }, ...(results || [])];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  const handleSave = () => {
    const identifier = inputValue.split(',').map(user => user.trim()).filter(user => user);
    addTeamMember({ identifier, role: selectedRole }, {
      onSuccess: () => {
        setUsers('');
        setSelectedRole('');
        onClose();
      },
      onError: () => {
        showModal({
          message: intl.formatMessage(messages.addTeamMemberError),
          variant: 'danger',
          confirmText: intl.formatMessage(messages.closeButton),
        });
      }
    });
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
          <Form.Control as="textarea" rows={3} placeholder={intl.formatMessage(messages.usersPlaceholder)} value={inputValue} onChange={handleInputChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>{intl.formatMessage(messages.roleLabel)}</Form.Label>
          <Form.Control as="select" defaultValue="" disabled={roles.length === 1} onChange={handleSelectChange}>
            {
              roles.map((role) => (
                <option key={role.role} value={role.role}>
                  {role.displayName}
                </option>
              ))
            }
          </Form.Control>
        </Form.Group>
      </ModalDialog.Body>
      <ModalDialog.Footer>
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancelButton)}</Button>
          <Button variant="primary" onClick={handleSave} disabled={!selectedRole || !inputValue}>{intl.formatMessage(messages.saveButton)}</Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default AddTeamMemberModal;
