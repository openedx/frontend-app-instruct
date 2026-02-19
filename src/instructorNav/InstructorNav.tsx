import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Nav, Navbar, Skeleton } from '@openedx/paragon';
import { useCourseInfo } from '@src/data/apiHook';
import { useAlert } from '@src/providers/AlertProvider';
import { useWidgetProps } from '../slots/SlotUtils';

export interface TabProps {
  tabId: string,
  url: string,
  title: string,
  sortOrder: number,
}

const InstructorNav = () => {
  const { courseId = '', tabId = '' } = useParams<{ courseId: string, tabId?: string }>();
  const { data: courseInfo, isLoading } = useCourseInfo(courseId);
  const widgetPropsArray = useWidgetProps('org.openedx.frontend.slot.instructor.tabs.v1') as TabProps[];
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

  if (isLoading) {
    return <Skeleton className="lead" />;
  }

  if (sortedTabs.length === 0) return null;

  return (
    <Navbar expand="md" className="py-0">
      <Nav
        variant="tabs"
        activeKey={tabId}
      >
        <Navbar.Toggle aria-controls="instructor-nav" />
        <Navbar.Collapse id="instructor-nav">
          {
            sortedTabs.map((tab) => (
              <Nav.Item key={tab.tabId}>
                <Nav.Link
                  as={Link}
                  to={tab.url}
                  active={tab.tabId === tabId}
                  onClick={() => clearAlerts()}
                >
                  {tab.title}
                </Nav.Link>
              </Nav.Item>
            ))
          }
        </Navbar.Collapse>
      </Nav>
    </Navbar>
  );
};

export default InstructorNav;
