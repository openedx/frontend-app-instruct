import { CurrentAppProvider, getSiteConfig, useIntl } from '@openedx/frontend-base';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router-dom';
import { AlertProvider } from './providers/AlertProvider';
import { ForbiddenErrorProvider } from './providers/ForbiddenErrorProvider';
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
        <ForbiddenErrorProvider>
          <main className="d-flex flex-column flex-grow-1">
            <PageWrapper>
              <Outlet />
            </PageWrapper>
          </main>
        </ForbiddenErrorProvider>
      </AlertProvider>
    </CurrentAppProvider>
  );
};

export default Main;
