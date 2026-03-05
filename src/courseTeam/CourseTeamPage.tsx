import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import { Button, Tab, Tabs, useToggle } from '@openedx/paragon';
import messages from './messages';
import MembersContent from './components/MembersContent';
import RolesContent from './components/RolesContent';
import AddTeamMemberModal from './components/AddTeamMemberModal';
import { useAddTeamMember } from './data/apiHook';

const CourseTeamPage = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const [isOpenAddModal, openAddModal, closeAddModal] = useToggle(false);
  const { mutate: addTeamMember } = useAddTeamMember(courseId);

  const handleAdd = ({ users, role }: { users: string[], role: string }) => {
    addTeamMember({ users, role });
    closeAddModal();
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary-700 mb-0">{intl.formatMessage(messages.courseTeamTitle)}</h3>
        <Button variant="primary" onClick={openAddModal}>+ {intl.formatMessage(messages.addTeamMember)}</Button>
      </div>
      <Tabs>
        <Tab eventKey="members" title={intl.formatMessage(messages.membersTab)}>
          <MembersContent />
        </Tab>
        <Tab eventKey="roles" title={intl.formatMessage(messages.rolesTab)}>
          <RolesContent />
        </Tab>
      </Tabs>
      {isOpenAddModal && <AddTeamMemberModal isOpen={isOpenAddModal} onClose={closeAddModal} onSave={handleAdd} />}
    </>
  );
};

export default CourseTeamPage;
