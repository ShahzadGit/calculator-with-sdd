/**
 * Unit Tests: Operations
 *
 * Tests for the calculate function covering all arithmetic operations.
 * Following TDD principles - these tests should FAIL until implementation is complete.
 */

import { describe, it, expect } from '@jest/globals';
import type { CalculationInput } from '@/lib/types';
import { ERRORS } from '@/lib/types';

// Import the function we'll implement
// This will cause an error until we create the file
import { calculate } from '@/lib/operations';

describe('calculate function', () => {
  describe('T020: Addition operation', () => {
    it('should add two positive integers', () => {
      const input: CalculationInput = {
        firstOperand: 5,
        secondOperand: 3,
        operator: '+',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(8);
      }
    });

    it('should add two positive decimals', () => {
      const input: CalculationInput = {
        firstOperand: 15.5,
        secondOperand: 4.25,
        operator: '+',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBeCloseTo(19.75);
      }
    });

    it('should add negative and positive numbers', () => {
      const input: CalculationInput = {
        firstOperand: -10,
        secondOperand: 5,
        operator: '+',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(-5);
      }
    });

    it('should add two negative numbers', () => {
      const input: CalculationInput = {
        firstOperand: -7,
        secondOperand: -3,
        operator: '+',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(-10);
      }
    });
  });

  describe('T021: Subtraction operation', () => {
    it('should subtract two positive integers', () => {
      const input: CalculationInput = {
        firstOperand: 10,
        secondOperand: 4,
        operator: '-',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(6);
      }
    });

    it('should subtract resulting in negative number', () => {
      const input: CalculationInput = {
        firstOperand: 3,
        secondOperand: 8,
        operator: '-',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(-5);
      }
    });

    it('should subtract decimals', () => {
      const input: CalculationInput = {
        firstOperand: 20.5,
        secondOperand: 8.25,
        operator: '-',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBeCloseTo(12.25);
      }
    });

    it('should subtract negative numbers', () => {
      const input: CalculationInput = {
        firstOperand: 5,
        secondOperand: -3,
        operator: '-',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(8);
      }
    });
  });

  describe('T022: Multiplication operation', () => {
    it('should multiply two positive integers', () => {
      const input: CalculationInput = {
        firstOperand: 6,
        secondOperand: 7,
        operator: '×',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(42);
      }
    });

    it('should multiply decimals', () => {
      const input: CalculationInput = {
        firstOperand: 2.5,
        secondOperand: 4,
        operator: '×',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(10);
      }
    });

    it('should multiply by zero', () => {
      const input: CalculationInput = {
        firstOperand: 15,
        secondOperand: 0,
        operator: '×',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(0);
      }
    });

    it('should multiply negative numbers', () => {
      const input: CalculationInput = {
        firstOperand: -5,
        secondOperand: 3,
        operator: '×',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(-15);
      }
    });

    it('should multiply two negative numbers to get positive', () => {
      const input: CalculationInput = {
        firstOperand: -4,
        secondOperand: -3,
        operator: '×',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(12);
      }
    });
  });

  describe('T023: Division operation', () => {
    it('should divide two positive integers', () => {
      const input: CalculationInput = {
        firstOperand: 20,
        secondOperand: 4,
        operator: '÷',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(5);
      }
    });

    it('should divide resulting in decimal', () => {
      const input: CalculationInput = {
        firstOperand: 7,
        secondOperand: 2,
        operator: '÷',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(3.5);
      }
    });

    it('should divide decimals', () => {
      const input: CalculationInput = {
        firstOperand: 15.5,
        secondOperand: 2.5,
        operator: '÷',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBeCloseTo(6.2);
      }
    });

    it('should divide negative numbers', () => {
      const input: CalculationInput = {
        firstOperand: -20,
        secondOperand: 4,
        operator: '÷',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(-5);
      }
    });

    it('should return error for division by zero', () => {
      const input: CalculationInput = {
        firstOperand: 10,
        secondOperand: 0,
        operator: '÷',
      };
      const result = calculate(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERRORS.DIVISION_BY_ZERO);
      }
    });
  });

  describe('T024: Negative number handling', () => {
    it('should handle negative first operand', () => {
      const input: CalculationInput = {
        firstOperand: -15,
        secondOperand: 3,
        operator: '+',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(-12);
      }
    });

    it('should handle negative second operand', () => {
      const input: CalculationInput = {
        firstOperand: 10,
        secondOperand: -5,
        operator: '×',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(-50);
      }
    });

    it('should handle both operands negative', () => {
      const input: CalculationInput = {
        firstOperand: -8,
        secondOperand: -2,
        operator: '÷',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(4);
      }
    });
  });

  describe('T025: Decimal number handling', () => {
    it('should handle decimal first operand', () => {
      const input: CalculationInput = {
        firstOperand: 7.5,
        secondOperand: 2,
        operator: '+',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(9.5);
      }
    });

    it('should handle decimal second operand', () => {
      const input: CalculationInput = {
        firstOperand: 10,
        secondOperand: 2.5,
        operator: '-',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(7.5);
      }
    });

    it('should handle both operands as decimals', () => {
      const input: CalculationInput = {
        firstOperand: 3.5,
        secondOperand: 2.5,
        operator: '×',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBeCloseTo(8.75);
      }
    });

    it('should handle very small decimals', () => {
      const input: CalculationInput = {
        firstOperand: 0.1,
        secondOperand: 0.2,
        operator: '+',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBeCloseTo(0.3);
      }
    });
  });

  describe('T041: Exponentiation operation', () => {
    it('should calculate positive base to positive exponent', () => {
      const input: CalculationInput = {
        firstOperand: 2,
        secondOperand: 8,
        operator: '^',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(256);
      }
    });

    it('should calculate positive base to zero exponent', () => {
      const input: CalculationInput = {
        firstOperand: 5,
        secondOperand: 0,
        operator: '^',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(1);
      }
    });

    it('should calculate positive base to negative exponent', () => {
      const input: CalculationInput = {
        firstOperand: 2,
        secondOperand: -3,
        operator: '^',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(0.125);
      }
    });

    it('should calculate negative base to positive exponent', () => {
      const input: CalculationInput = {
        firstOperand: -2,
        secondOperand: 3,
        operator: '^',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(-8);
      }
    });

    it('should calculate decimal base to exponent', () => {
      const input: CalculationInput = {
        firstOperand: 1.5,
        secondOperand: 2,
        operator: '^',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(2.25);
      }
    });

    it('should calculate base to decimal exponent', () => {
      const input: CalculationInput = {
        firstOperand: 4,
        secondOperand: 0.5,
        operator: '^',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(2);
      }
    });
  });

  describe('T042: Modulus operation', () => {
    it('should calculate modulus of two positive integers', () => {
      const input: CalculationInput = {
        firstOperand: 17,
        secondOperand: 5,
        operator: '%',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(2);
      }
    });

    it('should calculate modulus when divisor is larger', () => {
      const input: CalculationInput = {
        firstOperand: 3,
        secondOperand: 7,
        operator: '%',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(3);
      }
    });

    it('should calculate modulus with zero result', () => {
      const input: CalculationInput = {
        firstOperand: 10,
        secondOperand: 5,
        operator: '%',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(0);
      }
    });

    it('should handle negative dividend', () => {
      const input: CalculationInput = {
        firstOperand: -17,
        secondOperand: 5,
        operator: '%',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(-2);
      }
    });

    it('should handle decimal numbers in modulus', () => {
      const input: CalculationInput = {
        firstOperand: 5.5,
        secondOperand: 2,
        operator: '%',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBeCloseTo(1.5);
      }
    });

    it('should return error for modulus by zero', () => {
      const input: CalculationInput = {
        firstOperand: 10,
        secondOperand: 0,
        operator: '%',
      };
      const result = calculate(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERRORS.DIVISION_BY_ZERO);
      }
    });
  });

  describe('T054: Large number handling', () => {
    it('should return error for result exceeding MAX_SAFE_INTEGER', () => {
      const input: CalculationInput = {
        firstOperand: Number.MAX_SAFE_INTEGER,
        secondOperand: 2,
        operator: '×',
      };
      const result = calculate(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERRORS.NUMBER_TOO_LARGE);
      }
    });

    it('should return error for exponentiation resulting in very large number', () => {
      const input: CalculationInput = {
        firstOperand: 10,
        secondOperand: 1000,
        operator: '^',
      };
      const result = calculate(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERRORS.NUMBER_TOO_LARGE);
      }
    });

    it('should return error for Infinity result', () => {
      const input: CalculationInput = {
        firstOperand: Number.MAX_VALUE,
        secondOperand: 2,
        operator: '×',
      };
      const result = calculate(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERRORS.NUMBER_TOO_LARGE);
      }
    });

    it('should accept numbers within safe range', () => {
      const input: CalculationInput = {
        firstOperand: 1000,
        secondOperand: 999,
        operator: '×',
      };
      const result = calculate(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(999000);
      }
    });
  });
});
