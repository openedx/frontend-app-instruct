import { App } from '@openedx/frontend-base';
import { appId } from '@src/constants';
import routes from '@src/routes';
import slots from '@src/slots';
import provides from '@src/provides';

const app: App = {
  appId,
  routes,
  provides,
  slots,
  config: {
    NODE_ENV: 'development',
    LMS_BASE_URL: 'http://local.openedx.io:8000'
  },
};

export default app;
