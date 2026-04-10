import { providesCourseNavigationRolesId } from '@openedx/frontend-base';
import { instructorDashboardRole } from './constants';

const provides = {
  [providesCourseNavigationRolesId]: instructorDashboardRole
};

export default provides;
