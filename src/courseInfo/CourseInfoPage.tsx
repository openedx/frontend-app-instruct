import { Container } from '@openedx/paragon';
import { GeneralCourseInfo } from './components/generalCourseInfo';

const CourseInfoPage = () => {
  return (
    <Container className="mt-4.5 mb-4" fluid>
      <GeneralCourseInfo />
    </Container>
  );
};

export default CourseInfoPage;
