import { SlotOperation } from '@openedx/frontend-base';
import { tabSlots } from './instructorTabs/app';

const slots: SlotOperation[] = [
  ...tabSlots ?? [],
];

export default slots;
