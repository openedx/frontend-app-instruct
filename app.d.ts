/// <reference types="@openedx/frontend-base" />

declare module 'site.config' {
  export default SiteConfig;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
