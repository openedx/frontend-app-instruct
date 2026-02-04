import { AppProvider } from '@openedx/frontend-base';
import { QueryProvider } from './providers/QueryProvider';
import { AlertProvider } from './providers/AlertProvider';

const providers: AppProvider[] = [
  QueryProvider,
  AlertProvider,
];

export default providers;
