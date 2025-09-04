import { render } from '@testing-library/react';
import { IntlProvider } from '@openedx/frontend-base';


export const renderWithIntl = (component) => {
  return render(<IntlProvider locale='en' messages={{}}>{ component }</IntlProvider>);
};
