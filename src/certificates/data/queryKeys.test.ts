import { certificatesQueryKeys } from './queryKeys';

describe('certificatesQueryKeys', () => {
  it('should generate all key', () => {
    expect(certificatesQueryKeys.all).toEqual(['certificates']);
  });

  it('should generate lists key', () => {
    expect(certificatesQueryKeys.lists()).toEqual(['certificates', 'list']);
  });

  it('should generate list key with all parameters', () => {
    const result = certificatesQueryKeys.list(
      'course-123',
      { page: 0, pageSize: 10 },
      'john',
      'received'
    );

    expect(result).toEqual([
      'certificates',
      'list',
      'course-123',
      { page: 0, pageSize: 10 },
      'john',
      'received',
    ]);
  });

  it('should generate list key without search and filter', () => {
    const result = certificatesQueryKeys.list(
      'course-456',
      { page: 1, pageSize: 20 }
    );

    expect(result).toEqual([
      'certificates',
      'list',
      'course-456',
      { page: 1, pageSize: 20 },
      undefined,
      undefined,
    ]);
  });

  it('should generate list key with search only', () => {
    const result = certificatesQueryKeys.list(
      'course-789',
      { page: 2, pageSize: 15 },
      'jane'
    );

    expect(result).toEqual([
      'certificates',
      'list',
      'course-789',
      { page: 2, pageSize: 15 },
      'jane',
      undefined,
    ]);
  });

  it('should generate list key with filter only', () => {
    const result = certificatesQueryKeys.list(
      'course-999',
      { page: 0, pageSize: 10 },
      undefined,
      'error'
    );

    expect(result).toEqual([
      'certificates',
      'list',
      'course-999',
      { page: 0, pageSize: 10 },
      undefined,
      'error',
    ]);
  });

  it('should generate history key', () => {
    const result = certificatesQueryKeys.history(
      'course-111',
      { page: 0, pageSize: 20 }
    );

    expect(result).toEqual([
      'certificates',
      'history',
      'course-111',
      { page: 0, pageSize: 20 },
    ]);
  });

  it('should generate config key', () => {
    const result = certificatesQueryKeys.config('course-222');

    expect(result).toEqual(['certificates', 'config', 'course-222']);
  });

  it('should generate different keys for different courses', () => {
    const key1 = certificatesQueryKeys.list('course-a', { page: 0, pageSize: 10 });
    const key2 = certificatesQueryKeys.list('course-b', { page: 0, pageSize: 10 });

    expect(key1).not.toEqual(key2);
  });

  it('should generate different keys for different pagination', () => {
    const key1 = certificatesQueryKeys.list('course-123', { page: 0, pageSize: 10 });
    const key2 = certificatesQueryKeys.list('course-123', { page: 1, pageSize: 10 });

    expect(key1).not.toEqual(key2);
  });

  it('should generate different keys for different search terms', () => {
    const key1 = certificatesQueryKeys.list('course-123', { page: 0, pageSize: 10 }, 'john');
    const key2 = certificatesQueryKeys.list('course-123', { page: 0, pageSize: 10 }, 'jane');

    expect(key1).not.toEqual(key2);
  });

  it('should generate different keys for different filters', () => {
    const key1 = certificatesQueryKeys.list('course-123', { page: 0, pageSize: 10 }, undefined, 'received');
    const key2 = certificatesQueryKeys.list('course-123', { page: 0, pageSize: 10 }, undefined, 'error');

    expect(key1).not.toEqual(key2);
  });
});
