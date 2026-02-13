import CohortsPage from './cohorts/CohortsPage';
import CourseInfoPage from './courseInfo/CourseInfoPage';
import { DataDownloadsPage } from './dataDownloads/DataDownloadsPage';
import Main from './Main';
import CohortsPage from '@src/cohorts/CohortsPage';
import CourseInfoPage from '@src/courseInfo/CourseInfoPage';
import DateExtensionsPage from '@src/dateExtensions/DateExtensionsPage';
import OpenResponsesPage from '@src/openResponses/OpenResponsesPage';

const routes = [
  {
    id: 'org.openedx.frontend.route.instructor.main',
    path: ':courseId',
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
      // {
      //   path: 'membership',
      //   element: <MembershipPage />
      // },
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
