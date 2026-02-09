import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import InstructorTabsSlot from '../slots/instructorTabsSlot/InstructorTabsSlot';
import { Container } from '@openedx/paragon';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { formatMessage } = useIntl();
  return (
    <Container size="xl" fluid>
      <h2 className="text-primary-700">{formatMessage(messages.pageTitle)}</h2>
      <InstructorTabsSlot />
      <div className="mt-4.5 mb-4 mx-4">
        {children}
      </div>
    </Container>
  );
};

export default PageWrapper;
