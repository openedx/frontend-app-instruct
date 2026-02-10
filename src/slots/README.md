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
import { PlaceholderSlot } from 'src/slots/instructorTabsSlot/InstructorTabsSlot';

// Tab configuration data
const tabData = { tabId: 'my_tab', url: 'my_tab', title: 'New Tab', sortOrder={25} };

// Create slot operations for tabs
export const tabSlots: SlotOperation[] = [{
  slotId: `org.openedx.frontend.slot.instructor.tabs.v1`,
  id: `org.openedx.frontend.widget.instructor.tab.${tabId}`,
  op: WidgetOperationTypes.APPEND,
  element: <PlaceholderSlot tabId={tabData.tabId} title={tabData.title} url={tabData.url} />,
}];

// Create slot operations for route and content
const routeSlots: SlotOperation[] = [
  {
    slotId: 'org.openedx.frontend.slot.instructor.routes.v1',
    id: 'org.openedx.frontend.widget.instructor.route.my_tab',
    op: WidgetOperationTypes.APPEND,
    element: <PlaceholderSlot tabId="my_tab" content={<MyTabContent />} />,
  },
];
```


### 2. Slot Element

The `PlaceholderSlot` component acts as a placeholder that maintains the necessary props:

```tsx
export const PlaceholderSlot = (_props: Record<string, any>) => null;
```

### 3. Slot Consumer

The `InstructorTabs` component consumes the registered slots:

```tsx
import { SlotContext } from '@openedx/frontend-base';

const InstructorTabs = () => {
  const { id: slotId } = useContext(SlotContext);
  const widgets = useWidgetProps(slotId);

  return (
    <Tabs>
      {widgets.map((widget, index) => {
        const { tabId, title, sortOrder } = widget.element.props;
        return <Tab key={tabId} eventKey={tabId} title={title} sortOrder={sortOrder} />;
      })}
    </Tabs>
  );
};
```

And `TabContent` in `routes.tsx` consume the registered slots for the content.

```tsx
const TabContent = () => {
  const { tabId } = useParams<{ tabId: string }>();
  const routeWidgets = useWidgetProps('org.openedx.frontend.slot.instructor.routes.v1') as InstructorRouteProps[];

  const tabRoutes = [
    ...defaultTabs.filter(
      defaultTab => !routeWidgets.some(slotTab => slotTab.tabId === defaultTab.tabId)
    ),
    ...routeWidgets
  ];

  return tabRoutes.find(tab => tab.tabId === tabId)?.content;
};
```
