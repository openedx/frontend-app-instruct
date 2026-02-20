import CohortsPage from '@src/cohorts/CohortsPage';
import CourseInfoPage from '@src/courseInfo/CourseInfoPage';
import CourseTeamPage from './courseTeam/CourseTeamPage';
import DataDownloadsPage from '@src/dataDownloads/DataDownloadsPage';
import DateExtensionsPage from '@src/dateExtensions/DateExtensionsPage';
import OpenResponsesPage from '@src/openResponses/OpenResponsesPage';

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
      // {
      //   path: 'student_admin',
      //   element: <StudentAdminPage />
      // },
      {
        path: 'data_downloads',
        element: <DataDownloadsPage />
      },
      // {
      //   path: 'special_exams',
      //   element: <SpecialExamsPage />
      // },
      // {
      //   path: 'certificates',
      //   element: <CertificatesPage />
      // },
      {
        path: 'open_responses',
        element: <OpenResponsesPage />
      }
    ]
  }
];

export default routes;
