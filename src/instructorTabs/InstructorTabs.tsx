import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab } from '@openedx/paragon';

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

interface TabConfig {
  tab_id: InstructorTabKeys,
  url: string,
  title: string,
}

// example of tabs response from an API, should be refactored to react query when backend is ready
const tabs: TabConfig[] = [
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

const InstructorTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const getActiveTabFromUrl = useCallback((): InstructorTabKeys => {
    const currentPath = location.pathname.split('/').pop() ?? '';
    const activeTab = tabs.find(({ url }) => url === currentPath);
    return (activeTab ? activeTab.tab_id : InstructorTabKeys.COURSE_INFO) as InstructorTabKeys;
  }, [location.pathname]);

  const [tabKey, setTabKey] = useState<InstructorTabKeys>(getActiveTabFromUrl);

  useEffect(() => {
    setTabKey(getActiveTabFromUrl());
  }, [getActiveTabFromUrl]);

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      const tabKey = eventKey as InstructorTabKeys;
      const selectedUrl = tabs.find(tab => tab.tab_id === tabKey)?.url;
      setTabKey(tabKey);
      if (selectedUrl) {
        navigate(`/${selectedUrl}`);
      }
    }
  };

  return (
    <Tabs id="instructor-tabs" activeKey={tabKey} onSelect={handleSelect}>
      {tabs.map(({ tab_id, title }) => (
        <Tab key={tab_id} eventKey={tab_id} title={title} />
      ))}
    </Tabs>
  );
};

export default InstructorTabs;
