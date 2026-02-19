import { useParams } from 'react-router-dom';
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
import PageNotFound from '@src/components/PageNotFound';
import { useWidgetProps } from './slots/SlotUtils';

interface InstructorRouteProps {
  tabId: string,
  content: React.ReactNode,
}

const defaultTabs: InstructorRouteProps[] = [
  { tabId: 'course_info', content: <CourseInfoPage /> },
  { tabId: 'enrollments', content: <EnrollmentsPage /> },
  { tabId: 'course_team', content: <CourseTeamPage /> },
  { tabId: 'cohorts', content: <CohortsPage /> },
  { tabId: 'date_extensions', content: <DateExtensionsPage /> },
  { tabId: 'grading', content: <GradingPage /> },
  { tabId: 'data_downloads', content: <DataDownloadsPage /> },
  { tabId: 'special_exams', content: <SpecialExamsPage /> },
  { tabId: 'certificates', content: <CertificatesPage /> },
  { tabId: 'open_responses', content: <OpenResponsesPage /> },
];

const TabContent = () => {
  const { tabId } = useParams<{ tabId: string }>();
  const routeWidgets = useWidgetProps('org.openedx.frontend.slot.instructor.routes.v1') as InstructorRouteProps[];

  const tabRoutes = [
    ...defaultTabs.filter(
      defaultTab => !routeWidgets.some(slotTab => slotTab.tabId === defaultTab.tabId)
    ),
    ...routeWidgets
  ];

  const foundTab = tabRoutes.find(tab => tab.tabId === tabId);

  return foundTab ? foundTab.content : <PageNotFound />;
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
        index: true,
        element: <PageNotFound />
      },
      {
        path: ':tabId',
        element: <TabContent />
      },
    ]
  }
];

export default routes;
