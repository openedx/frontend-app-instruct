import { App } from '@openedx/frontend-base';
import { appId } from '@src/constants';
import routes from '@src/routes';
import slots from '@src/slots';
import providers from '@src/providers';

const app: App = {
  appId,
  routes,
  providers,
  slots,
  config: {
    NODE_ENV: 'development',
    LMS_BASE_URL: 'http://local.openedx.io:8000'
  },
  provides: {
    'org.openedx.frontend.provides.courseNavigationRoles.v1': {
      courseNavigationRoles: ['org.openedx.frontend.role.instructor'],
    },
  },
};

export default app;
