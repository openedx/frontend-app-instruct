import CohortsPage from '@src/cohorts/CohortsPage';
import CourseInfoPage from '@src/courseInfo/CourseInfoPage';
import CertificatesPage from '@src/certificates/CertificatesPage';
import CourseTeamPage from '@src/courseTeam/CourseTeamPage';
import DataDownloadsPage from '@src/dataDownloads/DataDownloadsPage';
import DateExtensionsPage from '@src/dateExtensions/DateExtensionsPage';
import EnrollmentsPage from '@src/enrollments/EnrollmentsPage';
import GradingPage from '@src/grading/GradingPage';
import OpenResponsesPage from '@src/openResponses/OpenResponsesPage';
import SpecialExamsPage from '@src/specialExams/SpecialExamsPage';

const routes = [
  {
    id: 'org.openedx.frontend.route.instructor.main',
    path: 'instructor/:courseId',
    handle: {
      role: 'org.openedx.frontend.role.instructor'
    },
    async lazy() {
      const module = await import('./Main');
      return { Component: module.default };
    },
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
