import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import InstructorTabs from '../instructorTabs/InstructorTabs';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="container-xl">
      <h2>{formatMessage(messages.pageTitle)}</h2>
      <InstructorTabs />
      {children}
    </div>
  );
};

export default PageWrapper;
