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
};

describe('SpecifyLearnerField', () => {
  describe('when learner is found', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (useCourseInfo as jest.Mock).mockReturnValue({ data: { permissions: { admin: true, dataResearcher: false } } });
      (useLearner as jest.Mock).mockReturnValue({
        data: mockLearnerData,
        refetch: jest.fn().mockResolvedValue({ data: mockLearnerData }),
        error: null,
      });
    });
    it('renders label and input', () => {
      renderWithIntl(<SpecifyLearnerField onClickSelect={jest.fn()} />);
      expect(screen.getByText(messages.specifyLearner.defaultMessage)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(messages.specifyLearnerPlaceholder.defaultMessage)).toBeInTheDocument();
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
  });

  describe('when learner not found', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      (useCourseInfo as jest.Mock).mockReturnValue({ data: { permissions: { admin: true, dataResearcher: false } } });
      (useLearner as jest.Mock).mockReturnValue({
        data: {},
        refetch: jest.fn().mockResolvedValue({ data: {} }),
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
});
