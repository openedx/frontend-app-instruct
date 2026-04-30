import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SpecifyLearnerField from './SpecifyLearnerField';
import messages from './messages';
import { renderWithIntl } from '@src/testUtils';
import { useCourseInfo, useLearner } from '@src/data/apiHook';

jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: jest.fn(),
  useLearner: jest.fn(),
}));

const mockLearnerData = {
  username: 'testuser',
  fullName: 'Test User',
  email: 'test@email.com',
  isEnrolled: true,
  progressUrl: 'http://example.com/progress',
};

describe('SpecifyLearnerField', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useCourseInfo as jest.Mock).mockReturnValue({ data: { permissions: { admin: true, dataResearcher: false } } });
  });

  describe('when learner is provided', () => {
    beforeEach(() => {
      (useLearner as jest.Mock).mockReturnValue({
        data: mockLearnerData,
        refetch: jest.fn().mockResolvedValue({ data: mockLearnerData }),
        error: null,
      });
    });

    it('renders selected learner label when learner is provided', () => {
      renderWithIntl(<SpecifyLearnerField learner={mockLearnerData} onClickSelect={jest.fn()} />);
      expect(screen.getByText(messages.selectedLearner.defaultMessage)).toBeInTheDocument();
      expect(screen.queryByText(messages.specifyLearner.defaultMessage)).not.toBeInTheDocument();
    });

    it('shows learner details when learner is provided', () => {
      renderWithIntl(<SpecifyLearnerField learner={mockLearnerData} onClickSelect={jest.fn()} />);
      expect(screen.getByText(mockLearnerData.username)).toBeInTheDocument();
      expect(screen.getByText(mockLearnerData.fullName)).toBeInTheDocument();
      expect(screen.getByText(mockLearnerData.email)).toBeInTheDocument();
    });

    it('hides input field when learner is shown', () => {
      renderWithIntl(<SpecifyLearnerField learner={mockLearnerData} onClickSelect={jest.fn()} />);
      const input = screen.queryByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      expect(input?.parentNode).toHaveClass('d-none');
    });
  });

  describe('when learner is found after search', () => {
    beforeEach(() => {
      (useLearner as jest.Mock).mockReturnValue({
        data: null,
        refetch: jest.fn().mockResolvedValue({ data: mockLearnerData }),
        error: null,
      });
    });

    it('renders select button', () => {
      renderWithIntl(<SpecifyLearnerField onClickSelect={jest.fn()} />);
      expect(screen.getByText(messages.select.defaultMessage)).toBeInTheDocument();
    });

    it('calls onClickSelect when clicking select', async () => {
      const handleClick = jest.fn();
      renderWithIntl(<SpecifyLearnerField onClickSelect={handleClick} />);
      const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      const user = userEvent.setup();
      await user.type(input, mockLearnerData.username);
      const button = screen.getByText(messages.select.defaultMessage);
      await user.click(button);
      expect(handleClick).toHaveBeenCalledWith(mockLearnerData.username);
    });

    it('changes to selected learner label after selection', async () => {
      const handleClick = jest.fn();
      renderWithIntl(<SpecifyLearnerField onClickSelect={handleClick} />);

      // Initially shows default label
      expect(screen.getByText(messages.specifyLearner.defaultMessage)).toBeInTheDocument();

      // After learner is found and has username, should show selected label
      renderWithIntl(<SpecifyLearnerField learner={mockLearnerData} onClickSelect={handleClick} />);
      expect(screen.getByText(messages.selectedLearner.defaultMessage)).toBeInTheDocument();
    });
  });

  describe('when no learner is provided', () => {
    beforeEach(() => {
      (useLearner as jest.Mock).mockReturnValue({
        data: mockLearnerData,
        refetch: jest.fn().mockResolvedValue({ data: mockLearnerData }),
        error: null,
      });
    });

    it('renders default label', () => {
      (useLearner as jest.Mock).mockReturnValue({
        data: null,
        refetch: jest.fn().mockResolvedValue({ data: mockLearnerData }),
        error: null,
      });
      renderWithIntl(<SpecifyLearnerField onClickSelect={jest.fn()} />);
      expect(screen.getByText(messages.specifyLearner.defaultMessage)).toBeInTheDocument();
    });

    it('renders input field and placeholder', () => {
      renderWithIntl(<SpecifyLearnerField onClickSelect={jest.fn()} />);
      expect(screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage)).toBeInTheDocument();
    });

    it('input has correct name attribute', () => {
      renderWithIntl(<SpecifyLearnerField onClickSelect={jest.fn()} />);
      const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      expect(input).toHaveAttribute('name', 'emailOrUsername');
    });

    it('shows learner info and change button after select', async () => {
      const handleClick = jest.fn();
      renderWithIntl(<SpecifyLearnerField onClickSelect={handleClick} />);
      const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      const user = userEvent.setup();
      await user.type(input, mockLearnerData.username);
      const button = screen.getByText(messages.select.defaultMessage);
      await user.click(button);
      expect(screen.getByText(mockLearnerData.username)).toBeInTheDocument();
      expect(screen.getByText(mockLearnerData.fullName)).toBeInTheDocument();
      expect(screen.getByText(mockLearnerData.email)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: messages.change.defaultMessage })).toBeInTheDocument();
    });

    it('resets values when clicking change button', async () => {
      const handleClick = jest.fn();
      renderWithIntl(<SpecifyLearnerField onClickSelect={handleClick} />);
      const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      const user = userEvent.setup();

      // First select a learner
      await user.type(input, mockLearnerData.username);
      const selectButton = screen.getByText(messages.select.defaultMessage);
      await user.click(selectButton);

      // Verify learner is shown and change button appears
      expect(screen.getByText(mockLearnerData.username)).toBeInTheDocument();
      const changeButton = screen.getByRole('button', { name: messages.change.defaultMessage });
      expect(changeButton).toBeInTheDocument();

      // Click change button
      await user.click(changeButton);

      // Verify reset behavior
      expect(handleClick).toHaveBeenLastCalledWith('');
      expect(screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage)).toBeVisible();
      expect(screen.getByText(messages.select.defaultMessage)).toBeInTheDocument();
      expect(screen.queryByText(mockLearnerData.username)).not.toBeInTheDocument();
    });

    it('clears input value when clicking change button', async () => {
      const handleClick = jest.fn();
      renderWithIntl(<SpecifyLearnerField onClickSelect={handleClick} />);
      const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      const user = userEvent.setup();

      // First select a learner
      await user.type(input, mockLearnerData.username);
      const selectButton = screen.getByText(messages.select.defaultMessage);
      await user.click(selectButton);

      // Click change button
      const changeButton = screen.getByRole('button', { name: messages.change.defaultMessage });
      await user.click(changeButton);

      // Verify input is cleared
      const inputAfterReset = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      expect(inputAfterReset).toHaveValue('');
    });

    it('hides learner information when clicking change button', async () => {
      const handleClick = jest.fn();
      renderWithIntl(<SpecifyLearnerField onClickSelect={handleClick} />);
      const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      const user = userEvent.setup();

      // First select a learner
      await user.type(input, mockLearnerData.username);
      const selectButton = screen.getByText(messages.select.defaultMessage);
      await user.click(selectButton);

      // Verify learner info is visible
      expect(screen.getByText(mockLearnerData.username)).toBeInTheDocument();
      expect(screen.getByText(mockLearnerData.fullName)).toBeInTheDocument();
      expect(screen.getByText(mockLearnerData.email)).toBeInTheDocument();

      // Click change button
      const changeButton = screen.getByRole('button', { name: messages.change.defaultMessage });
      await user.click(changeButton);

      // Verify learner info is hidden
      expect(screen.queryByText(mockLearnerData.fullName)).not.toBeInTheDocument();
      expect(screen.queryByText(mockLearnerData.email)).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: messages.change.defaultMessage })).not.toBeInTheDocument();
    });
  });

  describe('when learner not found', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (useCourseInfo as jest.Mock).mockReturnValue({ data: { permissions: { admin: true, dataResearcher: false } } });
      (useLearner as jest.Mock).mockReturnValue({
        data: {},
        refetch: jest.fn().mockResolvedValue({ data: {}, error: { isAxiosError: true, response: { status: 404 } } }),
        error: { isAxiosError: true, response: { status: 404 } },
      });
    });

    it('shows error message if learner not found', async () => {
      renderWithIntl(<SpecifyLearnerField onClickSelect={jest.fn()} />);
      const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      const user = userEvent.setup();
      await user.type(input, mockLearnerData.username);
      const button = screen.getByText(messages.select.defaultMessage);
      await user.click(button);
      const staticPart = messages.learnerNotFound.defaultMessage.split(':')[0];
      expect(
        screen.getByText(new RegExp(staticPart + ':'))
      ).toBeInTheDocument();
    });
  });

  describe('when learner is found but not enrolled', () => {
    const mockNotEnrolledLearnerData = {
      username: 'notenrolleduser',
      fullName: 'Not Enrolled User',
      email: 'notenrolled@email.com',
      isEnrolled: false,
    };

    beforeEach(() => {
      jest.resetAllMocks();
      (useCourseInfo as jest.Mock).mockReturnValue({ data: { permissions: { admin: true, dataResearcher: false } } });
      (useLearner as jest.Mock).mockReturnValue({
        data: mockNotEnrolledLearnerData,
        refetch: jest.fn().mockResolvedValue({ data: mockNotEnrolledLearnerData }),
        error: null,
      });
    });

    it('shows learner not enrolled message', async () => {
      renderWithIntl(<SpecifyLearnerField onClickSelect={jest.fn()} />);
      const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      const user = userEvent.setup();
      await user.type(input, mockNotEnrolledLearnerData.username);
      const button = screen.getByText(messages.select.defaultMessage);
      await user.click(button);

      // Wait for the message to appear
      await expect(screen.findByText(messages.learnerNotEnrolled.defaultMessage.replace('{identifier}', mockNotEnrolledLearnerData.username))).resolves.toBeInTheDocument();
    });

    it('calls onClickSelect with empty string when learner is not enrolled', async () => {
      const handleClick = jest.fn();
      renderWithIntl(<SpecifyLearnerField onClickSelect={handleClick} />);
      const input = screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage);
      const user = userEvent.setup();
      await user.type(input, mockNotEnrolledLearnerData.username);
      const button = screen.getByText(messages.select.defaultMessage);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledWith('');
    });
  });
});
