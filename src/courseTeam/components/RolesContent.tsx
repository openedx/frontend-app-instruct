import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';

const rolesOrder = [
  'staff',
  'limitedStaff',
  'admin',
  'betaTesters',
  'courseDataResearchers',
  'discussionAdmin',
  'discussionModerator',
  'groupCommunityTA',
  'communityTA'
];

const RolesContent = () => {
  const intl = useIntl();
  const isCCXCoachEnabled = false; // This would be determined if ccx coach role is present on roles list from API

  return (
    <div className="mt-4">
      {
        rolesOrder.map((role) => (
          <div key={role} className="mb-4">
            <h4 className="text-primary-500">{intl.formatMessage(messages[role])}</h4>
            <p className="text-gray-700">{intl.formatMessage(messages[`${role}Description`])}</p>
          </div>
        ))
      }
      {
        isCCXCoachEnabled && (
          <div className="mb-4">
            <h4 className="text-primary-500">{intl.formatMessage(messages.ccxCoach)}</h4>
            <p className="text-gray-700">{intl.formatMessage(messages.ccxCoachDescription)}</p>
          </div>
        )
      }
    </div>
  );
};

export default RolesContent;
