import { parseObject } from './formatters';

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
