import { useIntl } from '@openedx/frontend-base';
import messages from '../messages';
import { useParams } from 'react-router-dom';
import { useRoles } from '../data/apiHook';

export const rolesOrder = [
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
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data: roles = [] } = useRoles(courseId);
  const isCCXCoachEnabled = roles.find((role) => role.id === 'ccxCoach');

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
