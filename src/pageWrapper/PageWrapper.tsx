import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import InstructorTabsSlot from '../slots/instructorTabsSlot/instructorTabsSlot';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="container-xl">
      <h2>{formatMessage(messages.pageTitle)}</h2>
      <InstructorTabsSlot />
      {children}
    </div>
  );
};

export default PageWrapper;
