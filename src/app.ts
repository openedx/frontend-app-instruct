import { App } from '@openedx/frontend-base';
import { appId } from '@src/constants';
import routes from '@src/routes';
import messages from '@src/i18n';
import slots from '@src/slots';
import providers from '@src/providers';

const app: App = {
  appId,
  routes,
  messages,
  providers,
  slots,
  config: {
    NODE_ENV: 'development',
    LMS_BASE_URL: 'http://local.openedx.io:8000'
  }
};

export default app;
