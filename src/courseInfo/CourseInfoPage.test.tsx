import { screen } from '@testing-library/react';
import CourseInfoPage from './CourseInfoPage';
import { renderWithIntl } from '../testUtils';

describe('CourseInfoPage', () => {
  it('renders course information', () => {
    renderWithIntl(<CourseInfoPage />);
    expect(screen.getByText('Course Info')).toBeInTheDocument();
  });
});
