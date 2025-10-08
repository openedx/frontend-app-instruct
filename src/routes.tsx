import CertificatesPage from './certificates/CertificatesPage';
import CohortsPage from './cohorts/CohortsPage';
import CourseInfoPage from './courseInfo/CourseInfoPage';
import CourseTeamPage from './courseTeam/CourseTeamPage';
import DataDownloadsPage from './dataDownloads/DataDownloadsPage';
import DateExtensionsPage from './dateExtensions/DateExtensionsPage';
import EnrollmentsPage from './enrollments/EnrollmentsPage';
import GradingPage from './grading/GradingPage';
import Main from './Main';
import OpenResponsesPage from './openResponses/OpenResponsesPage';
import SpecialExamsPage from './specialExams/SpecialExamsPage';

const routes = [
  {
    id: 'org.openedx.frontend.route.instructor.main',
    path: ':courseId',
    handle: {
      role: 'org.openedx.frontend.role.instructor'
    },
    Component: Main,
    children: [
      {
        path: 'course_info',
        element: <CourseInfoPage />
      },
      {
        path: 'enrollments',
        element: <EnrollmentsPage />
      },
      {
        path: 'course_team',
        element: <CourseTeamPage />
      },
      {
        path: 'cohorts',
        element: <CohortsPage />
      },
      {
        path: 'date_extensions',
        element: <DateExtensionsPage />
      },
      {
        path: 'grading',
        element: <GradingPage />
      },
      {
        path: 'data_downloads',
        element: <DataDownloadsPage />
      },
      {
        path: 'special_exams',
        element: <SpecialExamsPage />
      },
      {
        path: 'certificates',
        element: <CertificatesPage />
      },
      {
        path: 'open_responses',
        element: <OpenResponsesPage />
      }
    ]
  }
];

export default routes;
