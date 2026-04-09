import { screen } from '@testing-library/react';
import UsernameFilter from './UsernameFilter';
import { renderWithIntl } from '../testUtils';
import messages from './messages';

describe('UsernameFilter', () => {
  const setup = (filterValue = '', setFilter = jest.fn()) => {
    renderWithIntl(
      <UsernameFilter column={{ filterValue, setFilter }} />
    );
    return { setFilter };
  };

  it('shows the placeholder correctly', () => {
    setup();
    expect(screen.getByPlaceholderText(messages.searchPlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('shows the initial value correctly', () => {
    setup('value');
    expect(screen.getByDisplayValue('value')).toBeInTheDocument();
  });
});
