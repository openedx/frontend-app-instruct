import { screen } from '@testing-library/react';
import { renderWithIntl } from '../../testUtils';
import messages from '../messages';
import DisabledCohortsView from './DisabledCohortsView';
import userEvent from '@testing-library/user-event';

describe('DisabledCohortsView', () => {
  const onEnableCohorts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the no cohorts message', () => {
    renderWithIntl(<DisabledCohortsView onEnableCohorts={onEnableCohorts} />);
    expect(screen.getByText(messages.noCohortsMessage.defaultMessage)).toBeInTheDocument();
  });

  it('renders the learn more link with correct href', () => {
    renderWithIntl(<DisabledCohortsView onEnableCohorts={onEnableCohorts} />);
    const link = screen.getByRole('link', { name: messages.learnMore.defaultMessage }) as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link.href).toContain('https://openedx.atlassian.net/wiki/spaces/ENG/pages/123456789/Cohorts+Feature+Documentation');
  });

  it('renders the enable cohorts button', () => {
    renderWithIntl(<DisabledCohortsView onEnableCohorts={onEnableCohorts} />);
    expect(screen.getByRole('button', { name: messages.enableCohorts.defaultMessage })).toBeInTheDocument();
  });

  it('calls onEnableCohorts when button is clicked', async () => {
    renderWithIntl(<DisabledCohortsView onEnableCohorts={onEnableCohorts} />);
    const user = userEvent.setup();
    const enableCohortsButton = screen.getByRole('button', { name: messages.enableCohorts.defaultMessage });
    await user.click(enableCohortsButton);
    expect(onEnableCohorts).toHaveBeenCalledTimes(1);
  });
});
