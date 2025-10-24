import { formatNumberWithCommas } from './utils';

describe('formatNumberWithCommas', () => {
  it('formats valid numbers with commas', () => {
    expect(formatNumberWithCommas('1000')).toBe('1,000');
    expect(formatNumberWithCommas('1234567')).toBe('1,234,567');
  });

  it('removes existing commas and spaces before formatting', () => {
    expect(formatNumberWithCommas('1,000')).toBe('1,000');
    expect(formatNumberWithCommas('1 000')).toBe('1,000');
    expect(formatNumberWithCommas('1, 000')).toBe('1,000');
  });

  it('returns original string for invalid numbers', () => {
    expect(formatNumberWithCommas('abc')).toBe('abc');
    expect(formatNumberWithCommas('12abc')).toBe('12abc');
  });

  it('handles small numbers without commas', () => {
    expect(formatNumberWithCommas('123')).toBe('123');
    expect(formatNumberWithCommas('0')).toBe('0');
  });
});
