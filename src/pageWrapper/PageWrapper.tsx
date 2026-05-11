import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import { Container } from '@openedx/paragon';
import InstructorNav from '@src/instructorNav/InstructorNav';
import { AccessErrorGuard } from '@src/providers/AccessErrorProvider';
import AccessErrorObserver from '@src/providers/AccessErrorObserver';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { formatMessage } = useIntl();
  return (
    <Container size="xl" fluid>
      <AccessErrorObserver />
      <h2 className="text-primary-700 m-4">{formatMessage(messages.pageTitle)}</h2>
      <InstructorNav />
      <AccessErrorGuard>
        <div className="m-4">
          {children}
        </div>
      </AccessErrorGuard>
    </Container>
  );
};

export default PageWrapper;
