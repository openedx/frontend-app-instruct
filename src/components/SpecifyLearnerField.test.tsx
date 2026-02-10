import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpecifyLearnerField from './SpecifyLearnerField';
import messages from './messages';
import { renderWithIntl } from '@src/testUtils';

describe('SpecifyLearnerField', () => {
  it('renders label and input', () => {
    renderWithIntl(<SpecifyLearnerField onChange={jest.fn()} />);
    expect(screen.getByText(messages.specifyLearner.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage)).toBeInTheDocument();
  });

  it('renders select button', () => {
    renderWithIntl(<SpecifyLearnerField onChange={jest.fn()} />);
    expect(screen.getByText(messages.select.defaultMessage)).toBeInTheDocument();
  });

  it('calls onChange when input changes', async () => {
    const handleChange = jest.fn();
    renderWithIntl(<SpecifyLearnerField onChange={handleChange} />);
    const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
    const user = userEvent.setup();
    await user.type(input, 'testuser');
    expect(handleChange).toHaveBeenCalled();
  });

  it('input has correct name attribute', () => {
    renderWithIntl(<SpecifyLearnerField onChange={jest.fn()} />);
    const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
    expect(input).toHaveAttribute('name', 'emailOrUsername');
  });
});
