import { Container } from '@openedx/paragon';
import OpenResponsesSummary from '@src/openResponses/components/OpenResponsesSummary';
import DetailAssessmentsList from '@src/openResponses/components/DetailAssessmentsList';

const OpenResponsesPage = () => {
  return (
    <Container fluid>
      <OpenResponsesSummary />
      <DetailAssessmentsList />
    </Container>
  );
};

export default OpenResponsesPage;
