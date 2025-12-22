import siteConfig from 'site.config';
import { mergeSiteConfig } from '@openedx/frontend-base';
import '@testing-library/jest-dom';

mergeSiteConfig(siteConfig);

class ResizeObserver {
  observe() {
    // do nothing
  }

  unobserve() {
    // do nothing
  }

  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = ResizeObserver;
