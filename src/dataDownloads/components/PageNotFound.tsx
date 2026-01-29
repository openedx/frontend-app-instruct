import { Container } from '@openedx/paragon';
import { useIntl } from '@openedx/frontend-base';
import { messages } from '../messages';

const PageNotFound = () => {
  const intl = useIntl();

  return (
    <Container className="mt-4.5 mb-4" fluid>
      <main
        className="d-flex justify-content-center align-items-center flex-column"
        style={{
          height: '50vh',
        }}
      >
        <h1 className="h3">
          {intl.formatMessage(messages.pageNotFoundHeader)}
        </h1>
        <p>
          {intl.formatMessage(messages.pageNotFoundBody)}
        </p>
      </main>
    </Container>
  );
};

export default PageNotFound;
