// TODO: remove next eslint disable when the variables get used
/* eslint-disable @typescript-eslint/no-unused-vars */
import { camelCaseObject, getAppConfig, getAuthenticatedHttpClient } from '@openedx/frontend-base';
import { appId } from '../constants';

const getApiBaseUrl = () => getAppConfig(appId).LMS_BASE_URL as string;
