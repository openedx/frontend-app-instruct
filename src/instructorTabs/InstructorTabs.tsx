import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tab, Tabs } from '@openedx/paragon';
import { SlotContext, useWidgetsForId } from '@openedx/frontend-base';

export interface TabProps {
  tab_id: string,
  url: string,
  title: string,
}

const extractWidgetProps = (widget: React.ReactNode): TabProps | null => {
  if (widget && typeof widget === 'object' && 'props' in widget) {
    const props = widget.props.children.props as TabProps;
    if (props?.tab_id && props?.url && props?.title) {
      return props;
    }
  }
  return null;
};

const useWidgetProps = (slotId: string): TabProps[] => {
  const widgets = useWidgetsForId(slotId);
  return widgets.map(extractWidgetProps).filter((props): props is TabProps => props !== null);
};

const InstructorTabs = () => {
  const navigate = useNavigate();
  const { courseId, tabId } = useParams<{ courseId: string, tabId?: string }>();
  const { id: slotId } = useContext(SlotContext);
  const widgetPropsArray = useWidgetProps(slotId);

  const activeKey = tabId ?? 'course_info';
  const handleSelect = (eventKey: string | null) => {
    if (eventKey && courseId) {
      const selectedTab = widgetPropsArray.find(({ tab_id }) => tab_id === eventKey);
      if (selectedTab) {
        navigate(`/${courseId}/${eventKey}`);
      }
    }
  };

  if (widgetPropsArray.length === 0) return null;

  return (
    <Tabs id="instructor-tabs" activeKey={activeKey} onSelect={handleSelect}>
      {widgetPropsArray.map(({ tab_id, title }) => (
        <Tab key={tab_id} eventKey={tab_id} title={title} />
      ))}
    </Tabs>
  );
};

export default InstructorTabs;
