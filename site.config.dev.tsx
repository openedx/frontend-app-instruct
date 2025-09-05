import { EnvironmentTypes, SiteConfig, footerApp, headerApp, shellApp } from '@openedx/frontend-base';

import { instructApp } from './src';

import './src/main.scss';

const siteConfig: SiteConfig = {
  siteId: 'instructor-dev',
  siteName: 'Instructor Dev',
  baseUrl: 'http://apps.local.openedx.io:8080',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  basename: '/instructor',
  apps: [
    shellApp,
    headerApp,
    footerApp,
    instructApp
  ],
  externalRoutes: [
    {
      role: 'profile',
      url: 'http://apps.local.openedx.io:1995/profile/'
    },
    {
      role: 'account',
      url: 'http://apps.local.openedx.io:1997/account/'
    },
    {
      role: 'logout',
      url: 'http://local.openedx.io:8000/logout'
    },
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
