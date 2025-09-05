import { EnvironmentTypes, SiteConfig } from '@openedx/frontend-base';

const siteConfig: SiteConfig = {
  siteId: 'instructor-test-site',
  siteName: 'Instructor Test Site',
  baseUrl: 'http://localhost:8080',
  lmsBaseUrl: 'http://localhost:8000',
  loginUrl: 'http://localhost:8000/login',
  logoutUrl: 'http://localhost:8000/logout',

  environment: EnvironmentTypes.TEST,
  basename: '/instructor',
  apps: [{
    appId: 'org.openedx.frontend.app.instructor',
    config: {}
  }],
};

export default siteConfig;
