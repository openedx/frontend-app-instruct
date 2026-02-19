import { screen } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import OpenResponsesSummary from '@src/openResponses/components/OpenResponsesSummary';
import { useOpenResponsesData } from '@src/openResponses/data/apiHook';
import messages from '@src/openResponses/messages';
import { renderWithIntl } from '@src/testUtils';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

jest.mock('../data/apiHook', () => ({
  useOpenResponsesData: jest.fn(),
}));

const mockData = {
  totalUnits: 5,
  totalAssessments: 10,
  totalResponses: 15,
  training: 2,
  peer: 3,
  self: 4,
  waiting: 1,
  staff: 6,
  finalGradeReceived: 7,
};

describe('OpenResponsesSummary', () => {
  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+Test+2024' });
  });

  it('renders all summary titles', () => {
    (useOpenResponsesData as jest.Mock).mockReturnValue({ data: {} });
    renderWithIntl(<OpenResponsesSummary />);
    expect(screen.getByText(messages.summaryTitle.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.totalUnits.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.totalAssessments.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.totalResponses.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.training.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.peer.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.self.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.waiting.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.staff.defaultMessage)).toBeInTheDocument();
    expect(screen.getByText(messages.finalGradeReceived.defaultMessage)).toBeInTheDocument();
  });

  it('renders default values when data is empty', () => {
    (useOpenResponsesData as jest.Mock).mockReturnValue({ data: {} });
    renderWithIntl(<OpenResponsesSummary />);
    expect(screen.getAllByText(0).length).toBe(9);
  });

  it('renders values from data', () => {
    (useOpenResponsesData as jest.Mock).mockReturnValue({
      data: mockData,
    });
    renderWithIntl(<OpenResponsesSummary />);
    expect(screen.getByText(5)).toBeInTheDocument();
    expect(screen.getByText(10)).toBeInTheDocument();
    expect(screen.getByText(15)).toBeInTheDocument();
    expect(screen.getByText(2)).toBeInTheDocument();
    expect(screen.getByText(3)).toBeInTheDocument();
    expect(screen.getByText(4)).toBeInTheDocument();
    expect(screen.getByText(1)).toBeInTheDocument();
    expect(screen.getByText(6)).toBeInTheDocument();
    expect(screen.getByText(7)).toBeInTheDocument();
  });

  it('renders icons', () => {
    (useOpenResponsesData as jest.Mock).mockReturnValue({ data: mockData });
    renderWithIntl(<OpenResponsesSummary />);
    expect(screen.getAllByRole('img', { hidden: true }).length).toBe(2);
  });

  it('uses courseId from params', () => {
    (useParams as jest.Mock).mockReturnValue({ courseId: 'course-v1:edX+Another+2024' });
    (useOpenResponsesData as jest.Mock).mockReturnValue({ data: {} });
    renderWithIntl(<OpenResponsesSummary />);
    expect(useOpenResponsesData).toHaveBeenCalledWith('course-v1:edX+Another+2024');
  });
});
