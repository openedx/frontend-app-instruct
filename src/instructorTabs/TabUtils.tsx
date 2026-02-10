import { useWidgetsForId } from '@openedx/frontend-base';
import { ReactNode } from 'react';

export function extractWidgetProps<T>(widget: ReactNode, validate?: (props: T) => boolean): T | null {
  if (widget && typeof widget === 'object' && 'props' in widget) {
    const props = widget.props.children.props as T;
    if (!validate || validate(props)) {
      return props;
    }
  }
  return null;
}

export function useWidgetProps<T>(slotId: string, validate?: (props: T) => boolean): T[] {
  const widgets = useWidgetsForId(slotId);
  return widgets
    .map(widget => extractWidgetProps<T>(widget, validate))
    .filter((props): props is T => props !== null);
}
