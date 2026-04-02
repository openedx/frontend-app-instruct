import { parseObject, parseLearnersCount, filterCertificates } from './formatters';

describe('parseObject', () => {
  it('should parse and format valid JSON string', () => {
    const jsonString = { course_id: 'course-v1:Example+Course+2023', report_type: 'enrolled_students' };
    const result = parseObject(jsonString);

    expect(result).toBe(`{
  "course_id": "course-v1:Example+Course+2023",
  "report_type": "enrolled_students"
}`);
  });

  it('should return original string when JSON parsing fails', () => {
    const invalidJson = 'invalid json string';
    const result = parseObject(invalidJson);

    expect(result).toBe('invalid json string');
  });

  it('should handle null, undefined, and empty values', () => {
    expect(parseObject(null)).toBe('null');
    expect(parseObject(undefined)).toBe(undefined);
    expect(parseObject('')).toBe('');
    expect(parseObject({})).toBe('{}');
  });
});

describe('parseLearnersCount', () => {
  it('should count comma-separated learners', () => {
    expect(parseLearnersCount('user1, user2, user3')).toBe(3);
  });

  it('should count newline-separated learners', () => {
    expect(parseLearnersCount('user1\nuser2\nuser3')).toBe(3);
  });

  it('should count mixed separators', () => {
    expect(parseLearnersCount('user1, user2\nuser3')).toBe(3);
  });

  it('should handle single learner', () => {
    expect(parseLearnersCount('user1')).toBe(1);
  });

  it('should trim whitespace', () => {
    expect(parseLearnersCount(' user1 , user2 ')).toBe(2);
  });

  it('should ignore empty entries', () => {
    expect(parseLearnersCount('user1,,user2')).toBe(2);
    expect(parseLearnersCount('user1\n\nuser2')).toBe(2);
  });

  it('should return 0 for empty string', () => {
    expect(parseLearnersCount('')).toBe(0);
  });
});

describe('filterCertificates', () => {
  const mockData = [
    { username: 'alice', email: 'alice@example.com', status: 'active' },
    { username: 'bob', email: 'bob@test.com', status: 'inactive' },
    { username: 'charlie', email: 'charlie@example.com', status: 'active' },
  ];

  it('should filter by custom function', () => {
    const result = filterCertificates(
      mockData,
      (item) => item.status === 'active',
      '',
    );
    expect(result).toHaveLength(2);
    expect(result[0].username).toBe('alice');
    expect(result[1].username).toBe('charlie');
  });

  it('should search by username', () => {
    const result = filterCertificates(
      mockData,
      () => true,
      'alice',
    );
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe('alice');
  });

  it('should search by email', () => {
    const result = filterCertificates(
      mockData,
      () => true,
      'test.com',
    );
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe('bob');
  });

  it('should search case-insensitively', () => {
    const result = filterCertificates(
      mockData,
      () => true,
      'ALICE',
    );
    expect(result).toHaveLength(1);
    expect(result[0].username).toBe('alice');
  });

  it('should combine filter and search', () => {
    const result = filterCertificates(
      mockData,
      (item) => item.status === 'active',
      'example.com',
    );
    expect(result).toHaveLength(2);
  });

  it('should return all items when search is empty', () => {
    const result = filterCertificates(
      mockData,
      () => true,
      '',
    );
    expect(result).toHaveLength(3);
  });

  it('should return empty array when nothing matches', () => {
    const result = filterCertificates(
      mockData,
      () => false,
      '',
    );
    expect(result).toHaveLength(0);
  });
});
