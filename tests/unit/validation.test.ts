/**
 * Unit Tests: Validation
 *
 * Tests for input validation functions covering edge cases and error conditions.
 * Following TDD principles - these tests should FAIL until implementation is complete.
 */

import { describe, it, expect } from '@jest/globals';
import { validateNumberInput, parseNumber } from '@/lib/validation';
import { ERRORS } from '@/lib/types';

describe('validateNumberInput function', () => {
  describe('T051: Invalid input validation (alphabetic characters)', () => {
    it('should reject alphabetic characters', () => {
      const result = validateNumberInput('abc');
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERRORS.INVALID_INPUT);
    });

    it('should reject mixed alphanumeric input', () => {
      const result = validateNumberInput('12a34');
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERRORS.INVALID_INPUT);
    });

    it('should reject special characters (except valid ones)', () => {
      const result = validateNumberInput('12@34');
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERRORS.INVALID_INPUT);
    });

    it('should reject input with spaces', () => {
      const result = validateNumberInput('12 34');
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERRORS.INVALID_INPUT);
    });

    it('should reject symbols other than minus and decimal', () => {
      const result = validateNumberInput('12+34');
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERRORS.INVALID_INPUT);
    });
  });

  describe('T052: Empty input validation', () => {
    it('should reject empty string', () => {
      const result = validateNumberInput('');
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERRORS.EMPTY_INPUT);
    });
  });

  describe('T053: Multiple decimal points rejection', () => {
    it('should reject input with multiple decimal points', () => {
      const result = validateNumberInput('12.34.56');
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERRORS.INVALID_INPUT);
    });

    it('should reject input with two decimal points', () => {
      const result = validateNumberInput('1..5');
      expect(result.success).toBe(false);
      expect(result.error).toBe(ERRORS.INVALID_INPUT);
    });

    it('should accept input with single decimal point', () => {
      const result = validateNumberInput('12.34');
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Valid inputs', () => {
    it('should accept positive integers', () => {
      const result = validateNumberInput('123');
      expect(result.success).toBe(true);
    });

    it('should accept negative integers', () => {
      const result = validateNumberInput('-123');
      expect(result.success).toBe(true);
    });

    it('should accept positive decimals', () => {
      const result = validateNumberInput('12.34');
      expect(result.success).toBe(true);
    });

    it('should accept negative decimals', () => {
      const result = validateNumberInput('-12.34');
      expect(result.success).toBe(true);
    });

    it('should accept leading decimal point', () => {
      const result = validateNumberInput('.5');
      expect(result.success).toBe(true);
    });

    it('should accept trailing decimal point', () => {
      const result = validateNumberInput('5.');
      expect(result.success).toBe(true);
    });

    it('should accept just minus sign (for input in progress)', () => {
      const result = validateNumberInput('-');
      expect(result.success).toBe(true);
    });

    it('should accept just decimal point (for input in progress)', () => {
      const result = validateNumberInput('.');
      expect(result.success).toBe(true);
    });
  });
});

describe('parseNumber function', () => {
  it('should parse positive integers', () => {
    expect(parseNumber('123')).toBe(123);
  });

  it('should parse negative integers', () => {
    expect(parseNumber('-123')).toBe(-123);
  });

  it('should parse positive decimals', () => {
    expect(parseNumber('12.34')).toBe(12.34);
  });

  it('should parse negative decimals', () => {
    expect(parseNumber('-12.34')).toBe(-12.34);
  });

  it('should return null for empty string', () => {
    expect(parseNumber('')).toBe(null);
  });

  it('should return null for just minus sign', () => {
    expect(parseNumber('-')).toBe(null);
  });

  it('should return null for just decimal point', () => {
    expect(parseNumber('.')).toBe(null);
  });

  it('should return null for invalid input', () => {
    expect(parseNumber('abc')).toBe(null);
  });
});
