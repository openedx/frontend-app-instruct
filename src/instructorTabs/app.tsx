import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import TabSlot from '../slots/instructorTabsSlot/TabSlot';
import { TabProps } from './InstructorTabs';

enum InstructorTabKeys {
  COURSE_INFO = 'course_info',
  ENROLLMENTS = 'enrollments',
  COURSE_TEAM = 'course_team',
  GRADING = 'grading',
  DATE_EXTENSIONS = 'date_extensions',
  DATA_DOWNLOADS = 'data_downloads',
  OPEN_RESPONSES = 'open_responses',
  CERTIFICATES = 'certificates',
  COHORTS = 'cohorts',
  SPECIAL_EXAMS = 'special_exams',
}

// example of tabs response from an API, should be refactored to react query when backend is ready
const tabData: TabProps[] = [
  { tab_id: InstructorTabKeys.COURSE_INFO, url: 'http://apps.local.openedx.io:8081/instructor/course-v1:OpenedX+DemoX+DemoCourse/course_info', title: 'Course Info' },
  { tab_id: InstructorTabKeys.ENROLLMENTS, url: 'http://apps.local.openedx.io:8081/instructor/course-v1:OpenedX+DemoX+DemoCourse/enrollments', title: 'Enrollments' },
  { tab_id: InstructorTabKeys.COURSE_TEAM, url: 'http://apps.local.openedx.io:8081/instructor/course-v1:OpenedX+DemoX+DemoCourse/course_team', title: 'Course Team' },
  { tab_id: InstructorTabKeys.GRADING, url: 'http://apps.local.openedx.io:8081/instructor/course-v1:OpenedX+DemoX+DemoCourse/grading', title: 'Grading' },
  { tab_id: InstructorTabKeys.DATE_EXTENSIONS, url: 'http://apps.local.openedx.io:8081/instructor/course-v1:OpenedX+DemoX+DemoCourse/date_extensions', title: 'Date Extensions' },
  { tab_id: InstructorTabKeys.DATA_DOWNLOADS, url: 'http://apps.local.openedx.io:8081/instructor/course-v1:OpenedX+DemoX+DemoCourse/data_downloads', title: 'Data Downloads' },
  { tab_id: InstructorTabKeys.OPEN_RESPONSES, url: 'http://apps.local.openedx.io:8081/instructor/course-v1:OpenedX+DemoX+DemoCourse/open_responses', title: 'Open Responses' },
  { tab_id: InstructorTabKeys.CERTIFICATES, url: 'http://apps.local.openedx.io:8081/instructor/course-v1:OpenedX+DemoX+DemoCourse/certificates', title: 'Certificates' },
  { tab_id: InstructorTabKeys.COHORTS, url: 'http://apps.local.openedx.io:8081/instructor/course-v1:OpenedX+DemoX+DemoCourse/cohorts', title: 'Cohorts' },
  { tab_id: InstructorTabKeys.SPECIAL_EXAMS, url: 'http://apps.local.openedx.io:8081/instructor/course-v1:OpenedX+DemoX+DemoCourse/special_exams', title: 'Special Exams' },
];

export const tabSlots: SlotOperation[] = tabData.map(({ tab_id, title, url }: TabProps) => ({
  slotId: `org.openedx.frontend.slot.instructor.tabs.v1`,
  id: `org.openedx.frontend.widget.instructor.tab.${tab_id}`,
  op: WidgetOperationTypes.APPEND,
  element: <TabSlot tab_id={tab_id} title={title} url={url} />,
}));
