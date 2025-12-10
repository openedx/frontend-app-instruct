import { Container } from '@openedx/paragon';
import { GeneralCourseInfo } from './components/generalCourseInfo';
import { PendingTasks } from '../components/PendingTasks';

const CourseInfoPage = () => {
  return (
    <Container className="mt-4.5 mb-4" fluid="xl">
      <GeneralCourseInfo />
      <PendingTasks />
    </Container>
  );
};

export default CourseInfoPage;
