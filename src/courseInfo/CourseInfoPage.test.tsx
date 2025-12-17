import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CourseInfoPage from './CourseInfoPage';
import { renderWithIntl } from '@src/testUtils';

jest.mock('./components/generalCourseInfo', () => ({
  GeneralCourseInfo: () => <div>General Course Info Component</div>,
}));

describe('CourseInfoPage', () => {
  const renderComponent = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return renderWithIntl(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CourseInfoPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders GeneralCourseInfo component', () => {
    renderComponent();
    expect(screen.getByText('General Course Info Component')).toBeInTheDocument();
  });
});
