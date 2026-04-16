import { useIntl } from '@openedx/frontend-base';
import { Button, Tab, Tabs, useToggle } from '@openedx/paragon';
import { Plus } from '@openedx/paragon/icons';
import AddTeamMemberModal from '@src/courseTeam/components/AddTeamMemberModal';
import MembersContent from '@src/courseTeam/components/MembersContent';
import RolesContent from '@src/courseTeam/components/RolesContent';
import messages from '@src/courseTeam/messages';
import { AlertOutlet } from '@src/providers/AlertProvider';

const CourseTeamPage = () => {
  const intl = useIntl();
  const [isOpenAddModal, openAddModal, closeAddModal] = useToggle(false);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary-700 mb-0">{intl.formatMessage(messages.courseTeamTitle)}</h3>
        <Button iconBefore={Plus} variant="primary" onClick={openAddModal}>{intl.formatMessage(messages.addTeamMember)}</Button>
      </div>
      <AlertOutlet />
      <Tabs>
        <Tab eventKey="members" title={intl.formatMessage(messages.membersTab)}>
          <MembersContent />
        </Tab>
        <Tab eventKey="roles" title={intl.formatMessage(messages.rolesTab)}>
          <RolesContent />
        </Tab>
      </Tabs>
      {isOpenAddModal && <AddTeamMemberModal isOpen={isOpenAddModal} onClose={closeAddModal} />}
    </>
  );
};

export default CourseTeamPage;
