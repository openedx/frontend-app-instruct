import { screen, fireEvent, waitFor } from '@testing-library/react';
import DetailAssessmentsList from './DetailAssessmentsList';
import { useDetailAssessmentsData } from '../data/apiHook';
import { renderWithIntl } from '../../testUtils';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ courseId: 'course-v1:edX+Test+2024' }),
}));

jest.mock('../data/apiHook', () => ({
  useDetailAssessmentsData: jest.fn(),
}));

const mockResults = [
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
    staffOraGradingUrl: 'http://test-url.com',
  },
];

describe('DetailAssessmentsList', () => {
  it('renders loading state', () => {
    (useDetailAssessmentsData as jest.Mock).mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: true,
    });
    renderWithIntl(<DetailAssessmentsList />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders table with data', () => {
    (useDetailAssessmentsData as jest.Mock).mockReturnValue({
      data: { count: 1, results: mockResults },
      isLoading: false,
    });
    renderWithIntl(<DetailAssessmentsList />);
    expect(screen.getByText(mockResults[0].unitName)).toBeInTheDocument();
    expect(screen.getByText(mockResults[0].displayName)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View and Grade Responses/i })).toBeInTheDocument();
  });

  it('renders correct number of columns', () => {
    (useDetailAssessmentsData as jest.Mock).mockReturnValue({
      data: { count: 1, results: mockResults },
      isLoading: false,
    });
    renderWithIntl(<DetailAssessmentsList />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(10);
  });

  it('calls fetchData on page change', async () => {
    (useDetailAssessmentsData as jest.Mock).mockReturnValue({
      data: { count: 30, results: mockResults },
      isLoading: false,
    });
    renderWithIntl(<DetailAssessmentsList />);
    const nextButton = screen.getByLabelText(/next/i);
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(useDetailAssessmentsData).toHaveBeenCalled();
    });
  });

  it('renders empty state when no data', () => {
    (useDetailAssessmentsData as jest.Mock).mockReturnValue({
      data: { count: 0, results: [] },
      isLoading: false,
    });
    renderWithIntl(<DetailAssessmentsList />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.queryByText('View and Grade Responses')).not.toBeInTheDocument();
  });
});
