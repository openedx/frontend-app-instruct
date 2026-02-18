# `frontend-app-instruct` Slots

## Overview

Slots in `frontend-app-instruct` use the slot system from `@openedx/frontend-base` to provide modular extension points in the application. This system allows different widgets to be dynamically registered at specific UI locations.

## Slot Architecture

### Main Components

1. **Slot Operations**: Operation definitions that specify how and where widgets will be inserted
2. **Slot Components**: React components that act as containers for widgets
3. **Widget Components**: Individual components that are inserted into slots

## Instructor Tabs Slot

### Description
We created following slots to handle Instructor Tabs:
- Tab Slots uses the slot context to render tab widgets.
- Route Slots uses registered slots to render tab content dynamically.


### 1. Slot Operations Definition

The following `site.config.dev.tsx` will add a custom tab, route and tab content in dev environment.

```tsx
import { WidgetOperationTypes } from '@openedx/frontend-base';
import { PlaceholderSlot } from './src/slots/PlaceholderSlot/PlaceholderSlot';
import { EnvironmentTypes, SiteConfig, footerApp, headerApp, shellApp } from '@openedx/frontend-base';

import { instructApp } from './src';

import './src/app.scss';

const siteConfig: SiteConfig = {
  siteId: 'instructor-dev',
  siteName: 'Instructor Dev',
  baseUrl: 'http://apps.local.openedx.io:8080',
  lmsBaseUrl: 'http://local.openedx.io:8000',
  loginUrl: 'http://local.openedx.io:8000/login',
  logoutUrl: 'http://local.openedx.io:8000/logout',

  environment: EnvironmentTypes.DEVELOPMENT,
  apps: [
    shellApp,
    headerApp,
    footerApp,
    {
      ...instructApp,
      slots: [
        {
          slotId: 'org.openedx.frontend.slot.instructor.tabs.v1',
          id: 'org.openedx.frontend.widget.instructor.tab.my_tab',
          op: WidgetOperationTypes.APPEND,
          element: <PlaceholderSlot tabId="my_tab" title="New Tab" URL="my_tab" sortOrder={25} />,
        },
        {
          slotId: 'org.openedx.frontend.slot.instructor.routes.v1',
          id: 'org.openedx.frontend.widget.instructor.route.my_tab',
          op: WidgetOperationTypes.APPEND,
          element: <PlaceholderSlot tabId="my_tab" content={<div>Dynamic Content</div>} />,
        }
      ]
    }
  ],
  externalRoutes: [
    {
      role: 'profile',
      url: 'http://apps.local.openedx.io:1995/profile/'
    },
    {
      role: 'account',
      url: 'http://apps.local.openedx.io:1997/account/'
    },
    {
      role: 'logout',
      url: 'http://local.openedx.io:8000/logout'
    },
  ],

  accessTokenCookieName: 'edx-jwt-cookie-header-payload',
};

export default siteConfig;
```

#### UI with New Tab Selected and Dynamic Content Displayed

![Instructor Tabs with New Tab and Dynamic Content Displayed](./instructorTabsSlot/NewTabSlot.png)


### 2. How it works
#### 2.1 Explanation on Slot Element

The `PlaceholderSlot` component acts as a placeholder that maintains the necessary props:

```tsx
export const PlaceholderSlot = (_props: Record<string, any>) => null;
```

#### 2.2 Explanation of Slot Consumer

[`InstructorNav`](../instructorTabsSlot/InstructorNav.tsx) component consumes the registered slots and tabs coming from the endpoint, orders them, and renders them.

[`TabContent`](../instructorTabsSlot/routes.tsx) consumes the registered slots for the content of each tab.

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
