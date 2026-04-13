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
};

export default app;
