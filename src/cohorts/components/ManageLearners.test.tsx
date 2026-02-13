import { screen, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { useAddLearnersToCohort } from '@src/cohorts/data/apiHook';
import { useCohortContext } from '@src/cohorts/components/CohortContext';
import ManageLearners from '@src/cohorts/components/ManageLearners';
import messages from '@src/cohorts/messages';
import { renderWithAlertAndIntl } from '@src/testUtils';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('@src/cohorts/data/apiHook', () => ({
  useAddLearnersToCohort: jest.fn(),
}));

jest.mock('@src/cohorts/components/CohortContext', () => ({
  useCohortContext: jest.fn(),
}));

const renderWithAlertProvider = () => renderWithAlertAndIntl(<ManageLearners />);

describe('ManageLearners', () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+Test+2024' });
    (useCohortContext as jest.Mock).mockReturnValue({ selectedCohort: { id: 123 } });
    (useAddLearnersToCohort as jest.Mock).mockReturnValue({ mutate: mutateMock });
    mutateMock.mockReset();
  });

  it('render all static texts', () => {
    renderWithAlertProvider();
    expect(screen.getByRole('heading', { name: messages.addLearnersTitle.defaultMessage })).toBeInTheDocument();
    expect(screen.getByText(messages.addLearnersSubtitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.addLearnersInstructions.defaultMessage)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(messages.learnersExample.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.addLearnersFootnote.defaultMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Add Learners/i })).toBeInTheDocument();
  });

  it('updates textarea value and calls mutate on button click', () => {
    renderWithAlertProvider();
    const textarea = screen.getByPlaceholderText(messages.learnersExample.defaultMessage);
    fireEvent.change(textarea, { target: { value: 'user1@example.com,user2@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /\+ Add Learners/i }));
    expect(mutateMock).toHaveBeenCalledWith(
      ['user1@example.com', 'user2@example.com'],
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('handles empty input gracefully', () => {
    renderWithAlertProvider();
    fireEvent.click(screen.getByRole('button', { name: /\+ Add Learners/i }));
    expect(mutateMock).toHaveBeenCalledWith(
      [],
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('calls onError if mutate fails', () => {
    renderWithAlertProvider();
    const textarea = screen.getByPlaceholderText(messages.learnersExample.defaultMessage);
    fireEvent.change(textarea, { target: { value: 'user@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /\+ Add Learners/i }));

    const callArgs = mutateMock.mock.calls[0][1];
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    callArgs.onError('error!');
    expect(consoleErrorSpy).toHaveBeenCalledWith('error!');
    consoleErrorSpy.mockRestore();
  });

  it('uses default cohort id 0 if selectedCohort is missing', () => {
    (useCohortContext as jest.Mock).mockReturnValue({ selectedCohort: undefined });
    renderWithAlertProvider();
    fireEvent.click(screen.getByRole('button', { name: /\+ Add Learners/i }));
    expect(mutateMock).toHaveBeenCalled();
  });
});
