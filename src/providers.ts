import { AppProvider } from '@openedx/frontend-base';
import { AlertProvider } from './providers/AlertProvider';

const providers: AppProvider[] = [
  AlertProvider,
];

export default providers;
