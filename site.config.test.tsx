import { EnvironmentTypes, SiteConfig } from '@openedx/frontend-base';

const siteConfig: SiteConfig = {
  siteId: 'instructor-test-site',
  siteName: 'Instructor Test Site',
  baseUrl: 'http://localhost:8080',
  lmsBaseUrl: 'http://localhost:8000',
  loginUrl: 'http://localhost:8000/login',
  logoutUrl: 'http://localhost:8000/logout',

  // if EnvironmentTypes.TEST is set, some tests fails due to it, TODO: update here once this issue is fixed in frontend-base
  environment: EnvironmentTypes?.TEST ?? 'test',
  basename: '/instructor',
  apps: [{
    appId: 'org.openedx.frontend.app.instructor',
    config: {}
  }],
};

export default siteConfig;
