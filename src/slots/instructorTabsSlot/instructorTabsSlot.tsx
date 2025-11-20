import { Slot } from '@openedx/frontend-base';
import InstructorTabs, { TabProps } from '../../instructorTabs/InstructorTabs';

// This component will be a placeholder/dummy component just to retrieve Tab props
// Since we are using a slot-based architecture and Paragon is passing Tabs/Tab through
// We can't have context provider between Tabs and Tab when rendering it should be direct parent/children relation

/* eslint-disable @typescript-eslint/no-unused-vars */
export const InstructorTab = (_props: TabProps) => {
  return null;
};

export const InstructorTabsSlot = () => (
  <Slot id="org.openedx.frontend.slot.instructor.tabs.v1">
    <InstructorTabs />
  </Slot>
);

export default InstructorTabsSlot;
