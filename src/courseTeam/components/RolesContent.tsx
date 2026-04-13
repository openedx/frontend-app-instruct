import { useParams } from 'react-router-dom';
import { useIntl } from '@openedx/frontend-base';
import messages from '@src/courseTeam/messages';
import { useRoles } from '@src/courseTeam/data/apiHook';
import { Role } from '@src/courseTeam/types';

export const rolesOrder = [
  'staff',
  'limitedStaff',
  'admin',
  'beta',
  'courseDataResearchers',
  'discussionAdmin',
  'discussionModerator',
  'groupCommunityTA',
  'communityTA'
] as const;

const RolesContent = () => {
  const intl = useIntl();
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { data: { results } = { results: [] } } = useRoles(courseId);
  const isCCXCoachEnabled = !!results?.find(({ role }: Role) => role === 'ccx_coach');

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
