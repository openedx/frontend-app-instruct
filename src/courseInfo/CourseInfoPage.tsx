import { GeneralCourseInfo } from './components/generalCourseInfo';
import { EnrollmentSummary } from './components/EnrollmentSummary';

const CourseInfoPage = () => {
  // TODO: replace this mock data with real data from API
  const mockEnrollmentCounts = {
    total: 3640,
    staffAndAdmins: 10,
    learners: 3630,
    verified: 2400,
    audit: 1230,
  };
  return (
    <div className="mt-4.5 mb-4">
      <GeneralCourseInfo />
      <EnrollmentSummary enrollmentCounts={mockEnrollmentCounts} />
    </div>
  );
};

export default CourseInfoPage;
