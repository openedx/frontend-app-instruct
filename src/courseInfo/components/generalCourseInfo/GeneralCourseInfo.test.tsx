import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GeneralCourseInfo } from './GeneralCourseInfo';
import { useCourseInfo } from '@src/data/apiHook';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createQueryMock, renderWithIntl } from '@src/testUtils';

jest.mock('@src/data/apiHook');
jest.mock('react-router', () => ({
  useParams: () => ({ courseId: 'test-course-id' }),
}));

const mockUseCourseInfo = useCourseInfo as jest.MockedFunction<typeof useCourseInfo>;

const mockCourseInfo = {
  org: 'TestOrg',
  courseId: 'CS101',
  courseRun: '2024_T1',
  displayName: 'Introduction to Computer Science',
  start: '2024-01-15T00:00:00Z',
  end: '2024-06-15T00:00:00Z',
  hasStarted: true,
  hasEnded: false,
};

describe('GeneralCourseInfo', () => {
  let queryClient: QueryClient;
  const renderComponent = () => {
    return renderWithIntl(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <GeneralCourseInfo />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  it('displays skeleton when is in loading state', () => {
    mockUseCourseInfo.mockReturnValue(createQueryMock(undefined, true));
    const { container } = renderComponent();
    expect(container.querySelector('.react-loading-skeleton')).toBeInTheDocument();
  });

  it('renders course information', () => {
    mockUseCourseInfo.mockReturnValue(createQueryMock(mockCourseInfo));
    renderComponent();

    expect(screen.getByText(mockCourseInfo.org)).toBeInTheDocument();
    expect(screen.getByText(mockCourseInfo.courseId)).toBeInTheDocument();
    expect(screen.getByText(mockCourseInfo.courseRun)).toBeInTheDocument();
    expect(screen.getByText(mockCourseInfo.displayName)).toBeInTheDocument();
  });

  it('displays active status for ongoing course', () => {
    mockUseCourseInfo.mockReturnValue(createQueryMock(mockCourseInfo));
    renderComponent();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('displays upcoming status for future course', () => {
    const upcomingCourse = { ...mockCourseInfo, hasStarted: false };
    mockUseCourseInfo.mockReturnValue(createQueryMock(upcomingCourse));
    renderComponent();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });

  it('displays archived status for ended course', () => {
    const archivedCourse = { ...mockCourseInfo, hasStarted: true, hasEnded: true };
    mockUseCourseInfo.mockReturnValue(createQueryMock(archivedCourse));
    renderComponent();
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  it('displays formatted dates', () => {
    mockUseCourseInfo.mockReturnValue(createQueryMock(mockCourseInfo));
    renderComponent();
    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/Jun 15, 2024/)).toBeInTheDocument();
  });

  it('displays "Not set" fallback for all missing course data fields', () => {
    const incompleteCourseInfo = {
      org: null,
      courseId: null,
      run: null,
      displayName: null,
      start: null,
      end: null,
    };
    mockUseCourseInfo.mockReturnValue(createQueryMock(incompleteCourseInfo));
    renderComponent();
    const notSetElements = screen.getAllByText(/Not Set/);
    expect(notSetElements.length).toBeGreaterThanOrEqual(6); // org, courseId, run, status, displayName, start date, end date
  });
});
