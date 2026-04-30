import { screen } from '@testing-library/react';
import CourseInfoSlot from '@src/slots/CourseInfoSlot/CourseInfoSlot';
import { renderWithQueryClient } from '@src/testUtils';

jest.mock('@src/data/apiHook', () => ({
  useCourseInfo: () => ({
    data: {
      displayName: 'My Test Course',
      org: 'edX',
      courseNumber: '40-800',
    },
  }),
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    courseId: 'course-v1:edX+Test+2023',
  }),
}));

describe('CourseInfoSlot', () => {
  it('renders org and course name', () => {
    renderWithQueryClient(<CourseInfoSlot />);
    expect(screen.getByText('My Test Course')).toBeInTheDocument();
    expect(screen.getByText('edX 40-800')).toBeInTheDocument();
  });
});
