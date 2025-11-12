import { useParams, Navigate } from 'react-router-dom';
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

const TabContent = () => {
  const { tabId } = useParams<{ tabId: string }>();

  switch (tabId) {
    case 'course_info':
      return <CourseInfoPage />;
    case 'enrollments':
      return <EnrollmentsPage />;
    case 'course_team':
      return <CourseTeamPage />;
    case 'cohorts':
      return <CohortsPage />;
    case 'date_extensions':
      return <DateExtensionsPage />;
    case 'grading':
      return <GradingPage />;
    case 'data_downloads':
      return <DataDownloadsPage />;
    case 'special_exams':
      return <SpecialExamsPage />;
    case 'certificates':
      return <CertificatesPage />;
    case 'open_responses':
      return <OpenResponsesPage />;
    default:
      return <Navigate to="course_info" replace />;
  }
};

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
        path: ':tabId',
        element: <TabContent />
      },
      {
        path: '',
        element: <Navigate to="course_info" replace />
      }
    ]
  }
];

export default routes;
