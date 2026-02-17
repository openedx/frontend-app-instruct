import { screen } from '@testing-library/react';
import { renderWithIntl } from '@src/testUtils';
import PageNotFound from './PageNotFound';

describe('PageNotFound', () => {
  it('should render the page not found header', () => {
    renderWithIntl(<PageNotFound />);
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('should render the page not found body text', () => {
    renderWithIntl(<PageNotFound />);
    expect(screen.getByText('The page you were looking for was not found.')).toBeInTheDocument();
  });

  it('should render a main element', () => {
    renderWithIntl(<PageNotFound />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
