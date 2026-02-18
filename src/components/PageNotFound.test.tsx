import { screen } from '@testing-library/react';
import { renderWithIntl } from '@src/testUtils';
import PageNotFound from './PageNotFound';
import messages from './messages';

describe('PageNotFound', () => {
  it('should render the page not found header', () => {
    renderWithIntl(<PageNotFound />);
    expect(screen.getByRole('heading', { name: messages.pageNotFoundHeader.defaultMessage })).toBeInTheDocument();
  });

  it('should render the page not found body text', () => {
    renderWithIntl(<PageNotFound />);
    expect(screen.getByText(messages.pageNotFoundBody.defaultMessage)).toBeInTheDocument();
  });

  it('should render a main element', () => {
    renderWithIntl(<PageNotFound />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
