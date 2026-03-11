import { getErrorMessage, parseLearnersCount, type ApiError } from '../../utils/errorHandling';

describe('errorHandling', () => {
  describe('getErrorMessage', () => {
    it('returns error message from response data', () => {
      const error: ApiError = {
        response: {
          data: {
            error: 'API error occurred',
          },
        },
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('API error occurred');
    });

    it('returns error message from error object', () => {
      const error: ApiError = {
        message: 'Direct error message',
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Direct error message');
    });

    it('returns fallback message when no error details', () => {
      const error: ApiError = {};
      expect(getErrorMessage(error, 'Fallback message')).toBe('Fallback message');
    });

    it('prioritizes response.data.error over message', () => {
      const error: ApiError = {
        response: {
          data: {
            error: 'Response error',
          },
        },
        message: 'Generic message',
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Response error');
    });

    it('handles undefined error gracefully', () => {
      const error: ApiError = {};
      expect(getErrorMessage(error, 'Default error')).toBe('Default error');
    });

    it('handles empty error response', () => {
      const error: ApiError = {
        response: {
          data: {},
        },
      };
      expect(getErrorMessage(error, 'Fallback')).toBe('Fallback');
    });
  });

  describe('parseLearnersCount', () => {
    it('counts single learner', () => {
      expect(parseLearnersCount('user1')).toBe(1);
    });

    it('counts comma-separated learners', () => {
      expect(parseLearnersCount('user1,user2,user3')).toBe(3);
    });

    it('counts newline-separated learners', () => {
      expect(parseLearnersCount('user1\nuser2\nuser3')).toBe(3);
    });

    it('counts mixed comma and newline separators', () => {
      expect(parseLearnersCount('user1,user2\nuser3,user4')).toBe(4);
    });

    it('returns 0 for empty string', () => {
      expect(parseLearnersCount('')).toBe(0);
    });

    it('handles whitespace around usernames', () => {
      expect(parseLearnersCount('user1 , user2 , user3')).toBe(3);
    });

    it('handles multiple newlines and commas', () => {
      expect(parseLearnersCount('user1,,\n\nuser2,user3')).toBe(3);
    });

    it('filters out empty entries', () => {
      expect(parseLearnersCount('user1,,,user2')).toBe(2);
      expect(parseLearnersCount('user1\n\n\nuser2')).toBe(2);
    });

    it('handles single learner with whitespace', () => {
      expect(parseLearnersCount('  user1  ')).toBe(1);
    });

    it('handles trailing commas and newlines', () => {
      expect(parseLearnersCount('user1,user2,\nuser3\n')).toBe(3);
    });
  });
});
