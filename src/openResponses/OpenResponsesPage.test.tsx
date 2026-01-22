import { screen } from '@testing-library/react';
import OpenResponsesPage from './OpenResponsesPage';
import { renderWithQueryClient } from '../testUtils';
import messages from './messages';
import { useDetailAssessmentsData, useOpenResponsesData } from './data/apiHook';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('./data/apiHook', () => ({
  useOpenResponsesData: jest.fn(),
  useDetailAssessmentsData: jest.fn(),
}));

const mockResults = {
  useDetailAssessmentsData: [
    {
      id: '1',
      unitName: 'Unit 1',
      displayName: 'Assessment 1',
      totalResponses: 2,
      training: 0,
      peer: 1,
      self: 0,
      waiting: 0,
      staff: 0,
      finalGradeReceived: 1,
      url: 'http://test-url.com',
    },
  ],
  useOpenResponsesData: {
    totalUnits: '5',
    totalAssessments: '10',
    totalResponses: '15',
    training: '2',
    peer: '3',
    self: '4',
    waiting: '1',
    staff: '6',
    finalGradeReceived: '7',
  }
};

describe('OpenResponsesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDetailAssessmentsData as jest.Mock).mockReturnValue({
      data: { count: 1, results: mockResults.useDetailAssessmentsData },
      isLoading: false,
    });
    (useOpenResponsesData as jest.Mock).mockReturnValue({
      data: { count: 1, results: mockResults.useOpenResponsesData },
      isLoading: false,
    });
  });

  it('renders OpenResponsesSummary component', () => {
    renderWithQueryClient(<OpenResponsesPage />);
    expect(screen.getByRole('heading', { name: messages.summaryTitle.defaultMessage })).toBeInTheDocument();
  });

  it('renders DetailAssessmentsList component', () => {
    renderWithQueryClient(<OpenResponsesPage />);
    expect(screen.getByRole('heading', { name: messages.details.defaultMessage })).toBeInTheDocument();
  });
});
