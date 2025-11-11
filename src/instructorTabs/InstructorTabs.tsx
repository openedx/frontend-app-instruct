import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tab, Tabs } from '@openedx/paragon';
import { SlotContext, useWidgetsForId } from '@openedx/frontend-base';

export interface TabProps {
  tab_id: string,
  url: string,
  title: string,
}

const extractWidgetProps = (widget: React.ReactNode): TabProps | null => {
  if (widget && typeof widget === 'object' && 'props' in widget) {
    return widget.props.children.props as TabProps;
  }
  return null;
};

const useWidgetProps = (slotId: string): TabProps[] => {
  const widgets = useWidgetsForId(slotId);
  return widgets.map(extractWidgetProps).filter((props): props is TabProps => props !== null);
};

const InstructorTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: slotId } = useContext(SlotContext);
  const widgetPropsArray = useWidgetProps(slotId);

  const [tabKey, setTabKey] = useState<string>('courseInfo');

  const getActiveTabFromUrl = useCallback(() => {
    const currentPath = location.pathname.split('/').pop() ?? '';

    const activeTab = widgetPropsArray.find(({ url }) => url === currentPath);

    return activeTab ? activeTab.tab_id : '';
  }, [widgetPropsArray, location.pathname]);

  useEffect(() => {
    setTabKey(getActiveTabFromUrl());
  }, [getActiveTabFromUrl]);

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      const selectedTab = widgetPropsArray.find(({ tab_id }) => tab_id === eventKey);
      const urlToNavigate = selectedTab?.url;

      setTabKey(eventKey);
      if (urlToNavigate) {
        navigate(`/${urlToNavigate}`);
      }
    }
  };

  if (widgetPropsArray.length === 0) return null;

  return (
    <Tabs id="instructor-tabs" activeKey={tabKey} onSelect={handleSelect}>
      {widgetPropsArray.map(({ tab_id, title }) => (
        <Tab key={tab_id} eventKey={tab_id} title={title} />
      ))}
    </Tabs>
  );
};

export default InstructorTabs;
