import { instructorDashboardBasePath } from '@src/constants';

// Helper function to check if a URL belongs to the instructor dashboard routes
export const hasInstructorDashboardBasePath = (url: string, courseId: string): boolean => {
  try {
    const baseIfRelative = 'http://example.com';
    const urlObj = new URL(url, baseIfRelative);

    if (urlObj.href.startsWith(baseIfRelative)) {
      return true;
    }

    const urlPath = urlObj.pathname;
    const instructorDashboardBasePathWithCourse = `${instructorDashboardBasePath}/${courseId}`;

    return urlPath.startsWith(instructorDashboardBasePathWithCourse);
  } catch {
    // For safety, we log it and treat it as internal navigation in case of malformed URLs to return a 404 instead of risking an open redirect.
    console.warn('URL parsing failed, using internal navigation for safety:', url);
    return true;
  }
};
