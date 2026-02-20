import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import { Button, Tab, Tabs } from '@openedx/paragon';
import MembersContent from './components/MembersContent';
import RolesContent from './components/RolesContent';

const CourseTeamPage = () => {
  const intl = useIntl();

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-primary-700 mb-0">{intl.formatMessage(messages.courseTeamTitle)}</h3>
        <Button variant="primary">+ {intl.formatMessage(messages.addTeamMember)}</Button>
      </div>
      <Tabs>
        <Tab eventKey="members" title={intl.formatMessage(messages.membersTab)}>
          <MembersContent />
        </Tab>
        <Tab eventKey="roles" title={intl.formatMessage(messages.rolesTab)}>
          <RolesContent />
        </Tab>
      </Tabs>
    </>
  );
};

export default CourseTeamPage;
