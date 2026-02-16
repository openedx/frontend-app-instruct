import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import { Container } from '@openedx/paragon';
import InstructorNav from '@src/instructorTabs/InstructorNav';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { formatMessage } = useIntl();
  return (
    <Container size="xl" fluid>
      <h2 className="text-primary-700">{formatMessage(messages.pageTitle)}</h2>
      <InstructorNav />
      <div className="m-4 px-3">
        {children}
      </div>
    </Container>
  );
};

export default PageWrapper;
