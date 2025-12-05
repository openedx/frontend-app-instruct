import { useParams, Navigate } from 'react-router-dom';
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
    path: ':courseId',
    handle: {
      role: 'org.openedx.frontend.role.instructor'
    },
    Component: Main,
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
