import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import TabSlot from '../slots/instructorTabsSlot/TabSlot';
import { TabProps } from './InstructorTabs';

enum InstructorTabKeys {
  COURSE_INFO = 'courseInfo',
  ENROLLMENTS = 'enrollments',
  COURSE_TEAM = 'courseTeam',
  GRADING = 'grading',
  DATE_EXTENSIONS = 'dateExtensions',
  DATA_DOWNLOADS = 'dataDownloads',
  OPEN_RESPONSES = 'openResponses',
  CERTIFICATES = 'certificates',
  COHORTS = 'cohorts',
  SPECIAL_EXAMS = 'specialExams',
}

// example of tabs response from an API, should be refactored to react query when backend is ready
const tabData: TabProps[] = [
  { tab_id: InstructorTabKeys.COURSE_INFO, url: 'course_info', title: 'Course Info' },
  { tab_id: InstructorTabKeys.ENROLLMENTS, url: 'enrollments', title: 'Enrollments' },
  { tab_id: InstructorTabKeys.COURSE_TEAM, url: 'course_team', title: 'Course Team' },
  { tab_id: InstructorTabKeys.GRADING, url: 'grading', title: 'Grading' },
  { tab_id: InstructorTabKeys.DATE_EXTENSIONS, url: 'date_extensions', title: 'Date Extensions' },
  { tab_id: InstructorTabKeys.DATA_DOWNLOADS, url: 'data_downloads', title: 'Data Downloads' },
  { tab_id: InstructorTabKeys.OPEN_RESPONSES, url: 'open_responses', title: 'Open Responses' },
  { tab_id: InstructorTabKeys.CERTIFICATES, url: 'certificates', title: 'Certificates' },
  { tab_id: InstructorTabKeys.COHORTS, url: 'cohorts', title: 'Cohorts' },
  { tab_id: InstructorTabKeys.SPECIAL_EXAMS, url: 'special_exams', title: 'Special Exams' },
];

export const tabSlots: SlotOperation[] = tabData.map(({ tab_id, title, url }: TabProps) => ({
  slotId: `org.openedx.frontend.slot.instructor.tabs.v1`,
  id: `org.openedx.frontend.widget.instructor.tab.${tab_id}`,
  op: WidgetOperationTypes.APPEND,
  element: <TabSlot tab_id={tab_id} title={title} url={url} />,
}));
