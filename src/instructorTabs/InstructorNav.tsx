import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { SlotContext } from '@openedx/frontend-base';
import { Nav, Navbar, Skeleton } from '@openedx/paragon';
import { useCourseInfo } from '@src/data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';
import { TabProps } from './InstructorTabs';
import { useWidgetProps } from './TabUtils';

const InstructorNav = () => {
  const { courseId = '', tabId } = useParams<{ courseId: string, tabId?: string }>();
  const { id: slotId } = useContext(SlotContext);
  const { data: courseInfo, isLoading } = useCourseInfo(courseId);
  const widgetPropsArray = useWidgetProps(slotId) as TabProps[];
  const { clearAlerts } = useAlert();

  const sortedTabs = useMemo(() => {
    if (isLoading) return [];
    const apiTabs: TabProps[] = courseInfo?.tabs ?? [];
    const tabMap = new Map<string, TabProps>();

    // Adding tabs from API and from slot into a map to avoid duplicates
    apiTabs.forEach(tab => {
      tabMap.set(tab.tabId, tab);
    });

    widgetPropsArray.forEach(slotTab => {
      // If the slotTab doesn't have a tabId or title, we can't render it properly, so we skip it.
      if (!slotTab.tabId || !slotTab.title) {
        return;
      }

      tabMap.set(slotTab.tabId, slotTab);
    });

    const allTabs = Array.from(tabMap.values());

    // Tabs are sorted by sortOrder, with a fallback to 1000 to be placed at the end for tabs that don't have sortOrder defined (to avoid NaN issues)
    return allTabs.sort((a, b) => (a.sortOrder ?? 1000) - (b.sortOrder ?? 1000));
  }, [courseInfo?.tabs, isLoading, widgetPropsArray]);

  const activeKey = tabId ?? '';

  if (isLoading) {
    return <Skeleton className="lead" />;
  }

  if (sortedTabs.length === 0) return null;

  return (
    <Navbar>
      <Nav
        variant="tabs"
        activeKey={activeKey}
        onSelect={() => clearAlerts()}
      >
        {
          sortedTabs.map((tab) => {
            const { tabId, title, url } = tab;

            return (
              <Nav.Item key={tabId}>
                <Nav.Link
                  href={url}
                  active={tabId === activeKey}
                >
                  {title}
                </Nav.Link>
              </Nav.Item>
            );
          })
        }
      </Nav>
    </Navbar>
  );
};

export default InstructorNav;
