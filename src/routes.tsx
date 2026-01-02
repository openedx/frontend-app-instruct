import CohortsPage from './cohorts/CohortsPage';
import CourseInfoPage from './courseInfo/CourseInfoPage';
import DateExtensionsPage from './dateExtensions/DateExtensionsPage';
import Main from './Main';

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
      // {
      //   path: 'data_download',
      //   element: <DataDownloadPage />
      // },
      // {
      //   path: 'special_exams',
      //   element: <SpecialExamsPage />
      // },
      // {
      //   path: 'certificates',
      //   element: <CertificatesPage />
      // },
      // {
      //   path: 'open_responses',
      //   element: <OpenResponsesPage />
      // }
    ]
  }
];

export default routes;
