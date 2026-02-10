import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton, Tab, Tabs } from '@openedx/paragon';
import { SlotContext } from '@openedx/frontend-base';
import { useCourseInfo } from '../data/apiHook';
import { useWidgetProps } from './TabUtils';
import { useAlert } from '@src/providers/AlertProvider';

export interface TabProps {
  tabId: string,
  url: string,
  title: string,
  sortOrder: number,
}

const InstructorTabs = () => {
  const navigate = useNavigate();
  const { courseId, tabId } = useParams<{ courseId: string, tabId?: string }>();
  const { id: slotId } = useContext(SlotContext);
  const { data: courseInfo, isLoading } = useCourseInfo(courseId ?? '');
  const widgetPropsArray = useWidgetProps(slotId) as TabProps[];
  const { addAlert, clearAlerts } = useAlert();

  const apiTabs: TabProps[] = courseInfo?.tabs ?? [];
  const allTabs = [...apiTabs];

  // Tabs added via slot take priority over (read: src/slots/README.md) tabs from the API
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

  // Tabs are sorted by sortOrder, with a fallback to 1000 to be placed at the end for tabs that don't have sortOrder defined (to avoid NaN issues)
  const sortedTabs = [...allTabs].sort((a, b) => (a.sortOrder ?? 1000) - (b.sortOrder ?? 1000));

  const activeKey = tabId ?? 'course_info';
  const handleSelect = (eventKey: string | null) => {
    clearAlerts();
    if (eventKey && courseId) {
      const selectedTab = sortedTabs.find(({ tabId }) => tabId === eventKey);
      if (!selectedTab) return addAlert({ type: 'error', message: 'Selected tab url not found' });

      // Adding this check to allow adding "paths"
      // This is needed for tabs added via slot, as they may not have a url, but rather a path that we can navigate to within the app.
      const isAUrl = /^https?:\/\//i.test(selectedTab.url);
      const isInternalNav = isAUrl && new URL(selectedTab?.url ?? '').origin === window.location.origin;
      if (isInternalNav || !isAUrl) {
        navigate(`/${courseId}/${eventKey}`);
      } else {
        window.location.assign(selectedTab.url);
      }
    }
  };

  if (isLoading) {
    return <Skeleton className="lead" />;
  }

  if (sortedTabs.length === 0) return null;

  return (
    <Tabs id="instructor-tabs" activeKey={activeKey} onSelect={handleSelect}>
      {sortedTabs.map(({ tabId, title }) => (
        <Tab key={tabId} eventKey={tabId} title={title} />
      ))}
    </Tabs>
  );
};

export default InstructorTabs;
