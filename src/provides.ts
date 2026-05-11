import { providesCourseBarRolesId } from '@openedx/frontend-base';
import { instructorDashboardRole } from './constants';

const provides = {
  [providesCourseBarRolesId]: instructorDashboardRole
};

export default provides;
