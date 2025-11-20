# `frontend-app-instruct` Slots

## Overview

Slots in `frontend-app-instruct` use the slot system from `@openedx/frontend-base` to provide modular extension points in the application. This system allows different widgets to be dynamically registered at specific UI locations.

## Slot Architecture

### Main Components

1. **Slot Operations**: Operation definitions that specify how and where widgets will be inserted
2. **Slot Components**: React components that act as containers for widgets
3. **Widget Components**: Individual components that are inserted into slots

## Instructor Tabs Slot

### 1. Slot Operations Definition

```tsx
import { SlotOperation, WidgetOperationTypes } from '@openedx/frontend-base';
import { InstructorTab } from 'src/slots/instructorTabsSlot/InstructorTabsSlot';

// Tab configuration data
const tabData = { tab_id: 'course_info', url: 'course_info', title: 'Course Info' };

// Create slot operations
export const tabSlots: SlotOperation[] = [{
  slotId: `org.openedx.frontend.slot.instructor.tabs.v1`,
  id: `org.openedx.frontend.widget.instructor.tab.${tab_id}`,
  op: WidgetOperationTypes.APPEND,
  element: <InstructorTab tab_id={tabData.tab_id} title={tabData.title} url={tabData.url} />,
}];
```

### 2. Slot Element

The `TabSlot` component acts as a placeholder that maintains the necessary props:

```tsx
import { TabProps } from '../../instructorTabs/InstructorTabs';

const TabSlot = (_props: TabProps) => {
  return null; // Placeholder component
};

export default TabSlot;
```

### 3. Slot Consumer

The `InstructorTabs` component consumes the registered slots:

```tsx
import { SlotContext, useSlotOperations } from '@openedx/frontend-base';

const InstructorTabs = () => {
  const { id: slotId } = useContext(SlotContext);
  const widgets = useSlotOperations(slotId);

  return (
    <Tabs>
      {widgets.map((widget, index) => {
        const { tab_id, title } = widget.element.props;
        return <Tab key={tab_id} eventKey={tab_id} title={title} />;
      })}
    </Tabs>
  );
};
```
