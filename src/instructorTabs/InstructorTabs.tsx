import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tab, Tabs } from '@openedx/paragon';
import { SlotContext } from '@openedx/frontend-base';
import { useCourseInfo } from '../data/apiHook';
import { useWidgetProps } from './TabUtils';

export interface TabProps {
  tabId: string,
  url: string,
  title: string,
  sort_order: number,
}

const InstructorTabs = () => {
  const navigate = useNavigate();
  const { courseId, tabId } = useParams<{ courseId: string, tabId?: string }>();
  const { id: slotId } = useContext(SlotContext);
  const { data: courseInfo, isLoading } = useCourseInfo(courseId ?? '');
  const widgetPropsArray = useWidgetProps(slotId) as TabProps[];

  const apiTabs: TabProps[] = courseInfo?.tabs ?? [];
  const allTabs = [...apiTabs];

  // Tabs added via slot take priority over (read: src/slots/README.md) tabs from the API
  // All tabs added via slot are placed at the end of the tabs array
  widgetPropsArray.forEach(slotTab => {
    if (!apiTabs.find(apiTab => apiTab.tabId === slotTab.tabId)) {
      allTabs.push(slotTab);
    } else {
      const indexToRemove = allTabs.findIndex(({ tabId }) => tabId === slotTab.tabId);
      if (indexToRemove !== -1) {
        allTabs.splice(indexToRemove, 1);
      }
      allTabs.push(slotTab);
    }
  });

  const activeKey = tabId ?? 'course_info';
  const handleSelect = (eventKey: string | null) => {
    if (eventKey && courseId) {
      const selectedTab = allTabs.find(({ tabId }) => tabId === eventKey);
      if (selectedTab) {
        navigate(`/${courseId}/${eventKey}`);
      }
    }
  };

  if (isLoading) {
    return <div>Loading tabs...</div>;
  }

  if (allTabs.length === 0) return null;

  return (
    <Tabs id="instructor-tabs" activeKey={activeKey} onSelect={handleSelect}>
      {allTabs.map(({ tabId, title }) => (
        <Tab key={tabId} eventKey={tabId} title={title} />
      ))}
    </Tabs>
  );
};

export default InstructorTabs;
