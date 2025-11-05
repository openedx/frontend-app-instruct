import { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tab, Tabs } from '@openedx/paragon';
import { SlotContext, BaseSlotOperation, useSlotOperations } from '@openedx/frontend-base';

export interface TabProps {
  tab_id: string,
  url: string,
  title: string,
}

interface SlotWithElementOperation extends BaseSlotOperation {
  element: React.ReactElement,
}

const InstructorTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: slotId } = useContext(SlotContext);
  const widgets: SlotWithElementOperation[] = useSlotOperations(slotId) as SlotWithElementOperation[];

  const [tabKey, setTabKey] = useState<string>('courseInfo');

  const getActiveTabFromUrl = useCallback(() => {
    const currentPath = location.pathname.split('/').pop() ?? '';
    const activeTab = widgets.find((slot) => slot.element.props.url === currentPath)?.element;
    return activeTab ? activeTab.props.tab_id : '';
  }, [widgets, location.pathname]);

  useEffect(() => {
    setTabKey(getActiveTabFromUrl());
  }, [getActiveTabFromUrl]);

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      const tabKey = eventKey;
      const selectedElement = widgets.find((slot) => slot?.element?.props.tab_id === tabKey)?.element;
      const selectedUrl = selectedElement?.props.url;
      setTabKey(tabKey);
      if (selectedUrl) {
        navigate(`/${selectedUrl}`);
      }
    }
  };

  if (widgets.length === 0) return null;

  return (
    <Tabs id="instructor-tabs" activeKey={tabKey} onSelect={handleSelect}>
      {widgets.map((widget: any, index: number) => {
        // We get props from TabSlot to create each Tab
        const element = widget.element;
        const { tab_id, title } = element.props;
        return <Tab key={tab_id ?? index} eventKey={tab_id} title={title} />;
      })}
    </Tabs>
  );
};

export default InstructorTabs;
