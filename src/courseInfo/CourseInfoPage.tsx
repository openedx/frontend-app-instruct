import { PendingTasks } from '@src/components/PendingTasks';
import { GeneralCourseInfo } from '@src/courseInfo/components/generalCourseInfo';

const CourseInfoPage = () => {
  return (
    <>
      <GeneralCourseInfo />
      <PendingTasks />
    </>
  );
};

export default CourseInfoPage;
