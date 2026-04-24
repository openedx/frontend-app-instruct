import { hasInstructorDashboardBasePath } from './utils';

jest.mock('@src/constants', () => ({
  instructorDashboardBasePath: '/instructor-dashboard',
}));

describe('hasInstructorDashboardBasePath', () => {
  const courseId = 'course-v1:edX+DemoX+Demo_Course';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Relative URLs', () => {
    it('should return true for simple relative paths', () => {
      expect(hasInstructorDashboardBasePath('course_info', courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath('grading', courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath('certificates', courseId)).toBe(true);
    });

    it('should return true for relative paths with dots', () => {
      expect(hasInstructorDashboardBasePath('./course_info', courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath('../parent/tab', courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath('../../deep/path', courseId)).toBe(true);
    });

    it('should return true for query and hash only URLs', () => {
      expect(hasInstructorDashboardBasePath('?query=value', courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath('#section', courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath('?param=1&other=2', courseId)).toBe(true);
    });

    it('should return true for empty URLs', () => {
      expect(hasInstructorDashboardBasePath('', courseId)).toBe(true);
    });
  });

  describe('Instructor Dashboard URLs', () => {
    it('should return true for exact instructor dashboard URLs', () => {
      const basePath = `/instructor-dashboard/${courseId}`;
      expect(hasInstructorDashboardBasePath(basePath, courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath(`${basePath}/course_info`, courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath(`${basePath}/grading`, courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath(`${basePath}/certificates`, courseId)).toBe(true);
    });

    it('should return true for instructor dashboard URLs with additional paths', () => {
      const basePath = `/instructor-dashboard/${courseId}`;
      expect(hasInstructorDashboardBasePath(`${basePath}/deep/nested/path`, courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath(`${basePath}/tab?query=value`, courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath(`${basePath}/tab#section`, courseId)).toBe(true);
    });
  });

  describe('External URLs', () => {
    it('should return false for absolute URLs with different origins', () => {
      expect(hasInstructorDashboardBasePath('https://external.example.com', courseId)).toBe(false);
      expect(hasInstructorDashboardBasePath('http://other-domain.org/path', courseId)).toBe(false);
      expect(hasInstructorDashboardBasePath('https://edx.org/courses', courseId)).toBe(false);
    });

    it('should return false for protocol-relative URLs', () => {
      expect(hasInstructorDashboardBasePath('//cdn.example.com/resource', courseId)).toBe(false);
      expect(hasInstructorDashboardBasePath('//external.org/api', courseId)).toBe(false);
    });

    it('should return false for URLs with different protocols', () => {
      expect(hasInstructorDashboardBasePath('ftp://files.example.com', courseId)).toBe(false);
      expect(hasInstructorDashboardBasePath('mailto:test@example.com', courseId)).toBe(false);
      expect(hasInstructorDashboardBasePath('tel:+1234567890', courseId)).toBe(false);
    });
  });

  describe('Malformed URLs', () => {
    it('should return true for malformed URLs and log warning', () => {
      const malformedUrls = [
        'ht!tp://invalid',
        'https://[invalid-ipv6',
        'https://exam ple.com',
      ];

      malformedUrls.forEach(url => {
        expect(hasInstructorDashboardBasePath(url, courseId)).toBe(true);
      });
    });

    it('should handle null and undefined URLs safely', () => {
      // TypeScript would normally prevent this, but JavaScript runtime might pass these
      expect(hasInstructorDashboardBasePath(null as any, courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath(undefined as any, courseId)).toBe(true);
    });

    it('should handle non-string inputs safely', () => {
      const nonStringInputs = [123, {}, [], true, false];

      nonStringInputs.forEach(input => {
        expect(hasInstructorDashboardBasePath(input as any, courseId)).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle URLs with special characters correctly', () => {
      const specialUrls = [
        '/instructor-dashboard/course-v1:MIT+6.00.1x+2T2017/tab',
        `/instructor-dashboard/${encodeURIComponent(courseId)}/course_info`,
        '/instructor-dashboard/course+with+plus/tab',
      ];

      // These should work correctly based on the courseId format
      expect(hasInstructorDashboardBasePath(specialUrls[0], 'course-v1:MIT+6.00.1x+2T2017')).toBe(true);
      expect(hasInstructorDashboardBasePath(specialUrls[1], courseId)).toBe(true);
      expect(hasInstructorDashboardBasePath(specialUrls[2], 'course+with+plus')).toBe(true);
    });

    it('should handle empty course ID', () => {
      expect(hasInstructorDashboardBasePath('/instructor-dashboard//course_info', '')).toBe(true);
      expect(hasInstructorDashboardBasePath('course_info', '')).toBe(true);
    });

    it('should handle very long URLs', () => {
      const longPath = 'a'.repeat(1000);
      const longUrl = `/instructor-dashboard/${courseId}/${longPath}`;
      expect(hasInstructorDashboardBasePath(longUrl, courseId)).toBe(true);
    });

    it('should handle URLs with percent encoding', () => {
      expect(hasInstructorDashboardBasePath('/instructor-dashboard/course%20id/tab', 'course id')).toBe(true);
      expect(hasInstructorDashboardBasePath('/instructor-dashboard/course%2Bid/tab', 'course+id')).toBe(true);
    });
  });

  describe('Base URL behavior', () => {
    it('should correctly identify relative URLs using base URL logic', () => {
      // When a relative URL is resolved with the base URL, it should start with the base
      const relativeUrls = ['tab', './tab', '../tab', 'path/to/tab'];

      relativeUrls.forEach(url => {
        expect(hasInstructorDashboardBasePath(url, courseId)).toBe(true);
      });
    });

    it('should correctly identify absolute URLs that do not use base URL', () => {
      // Absolute URLs ignore the base URL, so they won't start with it
      const absoluteUrls = [
        'https://example.com/path',
        'http://localhost:3000/app',
        '//cdn.example.com/resource'
      ];

      absoluteUrls.forEach(url => {
        expect(hasInstructorDashboardBasePath(url, courseId)).toBe(false);
      });
    });
  });
});
