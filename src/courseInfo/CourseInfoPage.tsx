import { Container } from '@openedx/paragon';
import { PendingTasks } from '@src/components/PendingTasks';
import { GeneralCourseInfo } from '@src/courseInfo/components/generalCourseInfo';

const CourseInfoPage = () => {
  return (
    <Container className="mt-4.5 mb-4" fluid>
      <GeneralCourseInfo />
      <PendingTasks />
    </Container>
  );
};

export default CourseInfoPage;
