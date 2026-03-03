import { PendingTasks } from '@src/components/PendingTasks';
import { GeneralCourseInfo } from '@src/courseInfo/components/generalCourseInfo';
import { EnrollmentSummary } from './components/EnrollmentSummary';

const CourseInfoPage = () => (
  <>
    <GeneralCourseInfo />
    <EnrollmentSummary />
    <PendingTasks />
  </>
);

export default CourseInfoPage;
