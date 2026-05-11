import { useIntl } from '@openedx/frontend-base';
import messages from './messages';
import { Container } from '@openedx/paragon';
import InstructorNav from '@src/instructorNav/InstructorNav';
import { ForbiddenErrorGuard } from '@src/providers/ForbiddenErrorProvider';
import ForbiddenErrorObserver from '@src/providers/ForbiddenErrorObserver';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { formatMessage } = useIntl();
  return (
    <Container size="xl" fluid>
      <ForbiddenErrorObserver />
      <h2 className="text-primary-700 m-4">{formatMessage(messages.pageTitle)}</h2>
      <InstructorNav />
      <ForbiddenErrorGuard>
        <div className="m-4">
          {children}
        </div>
      </ForbiddenErrorGuard>
    </Container>
  );
};

export default PageWrapper;
