import { Container } from '@openedx/paragon';
import ORSummary from './components/ORSummary';
import DetailAssessmentsList from './components/DetailAssessmentsList';

const OpenResponsesPage = () => {
  return (
    <Container fluid>
      <ORSummary />
      <DetailAssessmentsList />
    </Container>
  );
};

export default OpenResponsesPage;
