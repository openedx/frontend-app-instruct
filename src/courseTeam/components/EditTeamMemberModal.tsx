import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { ActionRow, Button, Form, FormControl, FormLabel, ModalDialog } from '@openedx/paragon';
import { useAddTeamMember, useRemoveTeamMember, useRoles } from '@src/courseTeam/data/apiHook';
import messages from '@src/courseTeam/messages';
import { CourseTeamMember, Role } from '@src/courseTeam/types';

interface EditTeamMemberModalProps {
  isOpen: boolean,
  user: CourseTeamMember,
  onClose: () => void,
}

const EditTeamMemberModal = ({ isOpen, user, onClose }: EditTeamMemberModalProps) => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [selectedRole, setSelectedRole] = useState('');
  const [keepRoles, setKeepRoles] = useState<string[]>(user.roles.map(role => role.role));
  const { mutate: addTeamMember } = useAddTeamMember(courseId);
  const { mutate: removeTeamMember } = useRemoveTeamMember(courseId);

  const { data: { results } = { results: [] } } = useRoles(courseId);

  const filteredRoles = results?.filter(role => !user.roles.some(userRole => userRole.role === role.role)) || [];

  const roles = [{ role: '', displayName: intl.formatMessage(messages.rolePlaceholder) }, ...filteredRoles];

  const handleToggleRole = (roleName: string) => {
    if (keepRoles.includes(roleName)) {
      setKeepRoles(keepRoles.filter(role => role !== roleName));
    } else {
      setKeepRoles([...keepRoles, roleName]);
    }
  };

  const handleSave = () => {
    if (selectedRole) {
      addTeamMember({ identifiers: [user.username], role: selectedRole });
    }
    const rolesToRemove = user.roles.filter(role => !keepRoles.includes(role.role)).map(role => role.role);
    if (rolesToRemove.length > 0) {
      removeTeamMember({ identifier: user.username, role: rolesToRemove });
    }
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      title={intl.formatMessage(messages.editTeamTitle, { username: user.username })}
      onClose={onClose}
      isOverflowVisible={false}
    >
      <ModalDialog.Header className="border-light-700 border-bottom">
        <h3 className="text-primary-500">{intl.formatMessage(messages.editTeamTitle, { username: user.username })}</h3>
      </ModalDialog.Header>
      <ModalDialog.Body className="position-relative overflow-auto">
        <p>{intl.formatMessage(messages.editInstructions, { username: user.username })}</p>
        <Form.CheckboxSet onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleToggleRole(e.target.value)} value={keepRoles} name="keepRoles">
          {
            (user.roles || [])
              .map((role: Role) => (
                <Form.Checkbox className="mt-2" key={role.role} value={role.role}>
                  {role.displayName}
                </Form.Checkbox>
              ))
          }
        </Form.CheckboxSet>
        <FormLabel className="mt-4">{intl.formatMessage(messages.addRole)}</FormLabel>
        <FormControl
          as="select"
          disabled={roles.length === 1}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRole(e.target.value)}
          value={selectedRole}
        >
          {
            roles.map((role) => (
              <option key={role.role} value={role.role}>
                {role.displayName}
              </option>
            ))
          }
        </FormControl>
      </ModalDialog.Body>
      <ModalDialog.Footer className="border-light-700 border-top">
        <ActionRow>
          <Button variant="tertiary" onClick={onClose}>{intl.formatMessage(messages.cancelButton)}</Button>
          <Button variant="primary" onClick={handleSave}>{intl.formatMessage(messages.saveButton)}</Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

export default EditTeamMemberModal;
