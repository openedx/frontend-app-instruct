import { CurrentAppProvider, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import { AlertProvider } from './providers/AlertProvider';
import { AccessErrorProvider } from './providers/AccessErrorProvider';
import { appId } from './constants';
import messages from './messages';
import PageWrapper from './pageWrapper/PageWrapper';

import './style.scss';

const Main = () => {
  const { formatMessage } = useIntl();
  return (
    <CurrentAppProvider appId={appId}>
      <Helmet>
        <title>
          {formatMessage(messages['instructor-dashboard.page.title'], {
            siteName: getSiteConfig().siteName,
          })}
        </title>
      </Helmet>
      <AlertProvider>
        <AccessErrorProvider>
          <main className="d-flex flex-column flex-grow-1">
            <PageWrapper>
              <Outlet />
            </PageWrapper>
          </main>
        </AccessErrorProvider>
      </AlertProvider>
    </CurrentAppProvider>
  );
};

export default Main;
