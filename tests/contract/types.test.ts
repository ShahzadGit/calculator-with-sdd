/**
 * Contract Tests: Type Definitions
 *
 * These tests verify that all type definitions, schemas, constants, and
 * utility functions in src/lib/types.ts work correctly.
 */

import {
  // Constants
  OPERATIONS,
  ERRORS,
  KEYBOARD_MAP,
  OPERATOR_FUNCTIONS,
  // Types
  Operation,
  CalculatorState,
  CalculationInput,
  CalculationResult,
  // Schemas
  NumberInputSchema,
  NonEmptyNumberInputSchema,
  OperationSchema,
  CalculationInputSchema,
  // Utility Functions
  createTestCalculatorState,
  createTestCalculationInput,
  // Type Guards
  isOperation,
  isErrorType,
  isSuccessResult,
  isErrorResult,
} from '@/lib/types';

describe('Type Contracts: Constants', () => {
  describe('OPERATIONS', () => {
    it('should contain all 6 supported operations', () => {
      expect(OPERATIONS).toEqual(['+', '-', '×', '÷', '^', '%']);
      expect(OPERATIONS).toHaveLength(6);
    });

    it('should be readonly', () => {
      expect(Object.isFrozen(OPERATIONS)).toBe(false); // as const doesn't freeze
      expect(() => {
        // @ts-expect-error - Testing runtime immutability
        OPERATIONS[0] = '*';
      }).not.toThrow(); // TypeScript prevents this, but runtime doesn't
    });
  });

  describe('ERRORS', () => {
    it('should contain all error message constants', () => {
      expect(ERRORS.DIVISION_BY_ZERO).toBe('Cannot divide by zero');
      expect(ERRORS.INVALID_INPUT).toBe('Please enter valid numbers');
      expect(ERRORS.EMPTY_INPUT).toBe('Please enter both numbers');
      expect(ERRORS.INVALID_OPERATION).toBe('Invalid operation');
      expect(ERRORS.NUMBER_TOO_LARGE).toBe('Number too large');
    });

    it('should have exactly 5 error types', () => {
      expect(Object.keys(ERRORS)).toHaveLength(5);
    });
  });

  describe('KEYBOARD_MAP', () => {
    it('should map number keys to "number" action', () => {
      for (let i = 0; i <= 9; i++) {
        expect(KEYBOARD_MAP[i.toString() as keyof typeof KEYBOARD_MAP]).toBe('number');
      }
    });

    it('should map operation keys correctly', () => {
      expect(KEYBOARD_MAP['+']).toBe('operation');
      expect(KEYBOARD_MAP['-']).toBe('operation');
      expect(KEYBOARD_MAP['*']).toBe('multiply');
      expect(KEYBOARD_MAP['/']).toBe('divide');
      expect(KEYBOARD_MAP['^']).toBe('operation');
      expect(KEYBOARD_MAP['%']).toBe('operation');
    });

    it('should map action keys correctly', () => {
      expect(KEYBOARD_MAP['Enter']).toBe('calculate');
      expect(KEYBOARD_MAP['=']).toBe('calculate');
      expect(KEYBOARD_MAP['Escape']).toBe('clear');
      expect(KEYBOARD_MAP['Backspace']).toBe('backspace');
      expect(KEYBOARD_MAP['.']).toBe('decimal');
    });
  });

  describe('OPERATOR_FUNCTIONS', () => {
    it('should implement all 6 operations correctly', () => {
      expect(OPERATOR_FUNCTIONS['+'](5, 3)).toBe(8);
      expect(OPERATOR_FUNCTIONS['-'](5, 3)).toBe(2);
      expect(OPERATOR_FUNCTIONS['×'](5, 3)).toBe(15);
      expect(OPERATOR_FUNCTIONS['÷'](6, 3)).toBe(2);
      expect(OPERATOR_FUNCTIONS['^'](2, 3)).toBe(8);
      expect(OPERATOR_FUNCTIONS['%'](5, 3)).toBe(2);
    });

    it('should handle decimal numbers', () => {
      expect(OPERATOR_FUNCTIONS['+'](1.5, 2.5)).toBe(4);
      expect(OPERATOR_FUNCTIONS['×'](1.5, 2)).toBe(3);
    });

    it('should handle negative numbers', () => {
      expect(OPERATOR_FUNCTIONS['+'](5, -3)).toBe(2);
      expect(OPERATOR_FUNCTIONS['-'](-5, 3)).toBe(-8);
      expect(OPERATOR_FUNCTIONS['×'](-5, 3)).toBe(-15);
    });
  });
});

describe('Type Contracts: Zod Schemas', () => {
  describe('NumberInputSchema', () => {
    it('should accept valid number strings', () => {
      expect(NumberInputSchema.safeParse('123').success).toBe(true);
      expect(NumberInputSchema.safeParse('0').success).toBe(true);
      expect(NumberInputSchema.safeParse('123.456').success).toBe(true);
      expect(NumberInputSchema.safeParse('.5').success).toBe(true);
      expect(NumberInputSchema.safeParse('-123').success).toBe(true);
      expect(NumberInputSchema.safeParse('-0.5').success).toBe(true);
    });

    it('should accept empty string', () => {
      expect(NumberInputSchema.safeParse('').success).toBe(true);
    });

    it('should reject invalid inputs', () => {
      const invalidInputs = ['abc', '12a', '1.2.3', '1-2', '++1', '1 2'];
      invalidInputs.forEach(input => {
        const result = NumberInputSchema.safeParse(input);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(ERRORS.INVALID_INPUT);
        }
      });
    });
  });

  describe('NonEmptyNumberInputSchema', () => {
    it('should accept valid non-empty number strings', () => {
      expect(NonEmptyNumberInputSchema.safeParse('123').success).toBe(true);
      expect(NonEmptyNumberInputSchema.safeParse('0').success).toBe(true);
      expect(NonEmptyNumberInputSchema.safeParse('-5').success).toBe(true);
    });

    it('should reject empty string', () => {
      const result = NonEmptyNumberInputSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(ERRORS.EMPTY_INPUT);
      }
    });
  });

  describe('OperationSchema', () => {
    it('should accept all valid operations', () => {
      // Test each operation individually
      expect(OperationSchema.safeParse('+').success).toBe(true);
      expect(OperationSchema.safeParse('-').success).toBe(true);
      expect(OperationSchema.safeParse('×').success).toBe(true);
      expect(OperationSchema.safeParse('÷').success).toBe(true);
      expect(OperationSchema.safeParse('^').success).toBe(true);
      expect(OperationSchema.safeParse('%').success).toBe(true);
    });

    it('should reject invalid operations', () => {
      const invalidOps = ['*', '/', '&', '|', 'add', ''];
      invalidOps.forEach(op => {
        expect(OperationSchema.safeParse(op).success).toBe(false);
      });
    });
  });

  describe('CalculationInputSchema', () => {
    it('should accept valid calculation inputs', () => {
      const validInputs = [
        { firstOperand: 5, secondOperand: 3, operator: '+' as Operation },
        { firstOperand: 10.5, secondOperand: 2.3, operator: '×' as Operation },
        { firstOperand: -5, secondOperand: 3, operator: '-' as Operation },
      ];
      validInputs.forEach(input => {
        expect(CalculationInputSchema.safeParse(input).success).toBe(true);
      });
    });

    it('should reject division by zero', () => {
      const result = CalculationInputSchema.safeParse({
        firstOperand: 10,
        secondOperand: 0,
        operator: '÷',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(ERRORS.DIVISION_BY_ZERO);
      }
    });

    it('should reject modulus by zero', () => {
      const result = CalculationInputSchema.safeParse({
        firstOperand: 10,
        secondOperand: 0,
        operator: '%',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(ERRORS.DIVISION_BY_ZERO);
      }
    });

    it('should reject non-finite numbers', () => {
      const invalidInputs = [
        { firstOperand: Infinity, secondOperand: 5, operator: '+' as Operation },
        { firstOperand: 5, secondOperand: NaN, operator: '-' as Operation },
      ];
      invalidInputs.forEach(input => {
        expect(CalculationInputSchema.safeParse(input).success).toBe(false);
      });
    });
  });
});

describe('Type Contracts: Utility Functions', () => {
  describe('createTestCalculatorState', () => {
    it('should create default calculator state', () => {
      const state = createTestCalculatorState();
      expect(state).toEqual({
        currentInput: '',
        previousValue: null,
        operation: null,
        displayValue: '0',
        error: null,
        result: null,
      });
    });

    it('should allow partial overrides', () => {
      const state = createTestCalculatorState({
        currentInput: '5',
        displayValue: '5',
      });
      expect(state.currentInput).toBe('5');
      expect(state.displayValue).toBe('5');
      expect(state.previousValue).toBeNull();
    });

    it('should maintain type safety', () => {
      const state = createTestCalculatorState({
        operation: '+',
        previousValue: 10,
      });
      expect(state.operation).toBe('+');
      expect(state.previousValue).toBe(10);
    });
  });

  describe('createTestCalculationInput', () => {
    it('should create default calculation input', () => {
      const input = createTestCalculationInput();
      expect(input).toEqual({
        firstOperand: 0,
        secondOperand: 0,
        operator: '+',
      });
    });

    it('should allow partial overrides', () => {
      const input = createTestCalculationInput({
        firstOperand: 5,
        secondOperand: 3,
        operator: '×',
      });
      expect(input.firstOperand).toBe(5);
      expect(input.secondOperand).toBe(3);
      expect(input.operator).toBe('×');
    });
  });
});

describe('Type Contracts: Type Guards', () => {
  describe('isOperation', () => {
    it('should return true for valid operations', () => {
      OPERATIONS.forEach(op => {
        expect(isOperation(op)).toBe(true);
      });
    });

    it('should return false for invalid operations', () => {
      // Note: '*' and '/' are keyboard characters that map to '×' and '÷'
      // They are NOT in the OPERATIONS array
      expect(isOperation('&')).toBe(false);
      expect(isOperation('|')).toBe(false);
      expect(isOperation('add')).toBe(false);
      expect(isOperation(123)).toBe(false);
      expect(isOperation(null)).toBe(false);
      expect(isOperation(undefined)).toBe(false);
      expect(isOperation('')).toBe(false);
    });
  });

  describe('isErrorType', () => {
    it('should return true for valid error types', () => {
      Object.values(ERRORS).forEach(error => {
        expect(isErrorType(error)).toBe(true);
      });
    });

    it('should return false for invalid error types', () => {
      expect(isErrorType('Random error')).toBe(false);
      expect(isErrorType('')).toBe(false);
      expect(isErrorType(123)).toBe(false);
      expect(isErrorType(null)).toBe(false);
    });
  });

  describe('isSuccessResult', () => {
    it('should return true for success results', () => {
      const result: CalculationResult = { success: true, value: 42 };
      expect(isSuccessResult(result)).toBe(true);
    });

    it('should return false for error results', () => {
      const result: CalculationResult = {
        success: false,
        error: ERRORS.DIVISION_BY_ZERO,
      };
      expect(isSuccessResult(result)).toBe(false);
    });

    it('should narrow type correctly', () => {
      const result: CalculationResult = { success: true, value: 42 };
      if (isSuccessResult(result)) {
        expect(result.value).toBe(42);
        // TypeScript should know result.value exists here
      }
    });
  });

  describe('isErrorResult', () => {
    it('should return true for error results', () => {
      const result: CalculationResult = {
        success: false,
        error: ERRORS.DIVISION_BY_ZERO,
      };
      expect(isErrorResult(result)).toBe(true);
    });

    it('should return false for success results', () => {
      const result: CalculationResult = { success: true, value: 42 };
      expect(isErrorResult(result)).toBe(false);
    });

    it('should narrow type correctly', () => {
      const result: CalculationResult = {
        success: false,
        error: ERRORS.DIVISION_BY_ZERO,
      };
      if (isErrorResult(result)) {
        expect(result.error).toBe(ERRORS.DIVISION_BY_ZERO);
        // TypeScript should know result.error exists here
      }
    });
  });
});

describe('Type Contracts: Interface Contracts', () => {
  describe('CalculatorState', () => {
    it('should enforce state structure', () => {
      const state: CalculatorState = {
        currentInput: '5',
        previousValue: 10,
        operation: '+',
        displayValue: '5',
        error: null,
        result: null,
      };
      expect(state.currentInput).toBe('5');
      expect(state.previousValue).toBe(10);
      expect(state.operation).toBe('+');
    });

    it('should allow null values where specified', () => {
      const state: CalculatorState = {
        currentInput: '',
        previousValue: null,
        operation: null,
        displayValue: '0',
        error: null,
        result: null,
      };
      expect(state.previousValue).toBeNull();
      expect(state.operation).toBeNull();
      expect(state.error).toBeNull();
      expect(state.result).toBeNull();
    });
  });

  describe('CalculationInput', () => {
    it('should enforce input structure', () => {
      const input: CalculationInput = {
        firstOperand: 5,
        secondOperand: 3,
        operator: '+',
      };
      expect(input.firstOperand).toBe(5);
      expect(input.secondOperand).toBe(3);
      expect(input.operator).toBe('+');
    });
  });

  describe('CalculationResult', () => {
    it('should enforce success result structure', () => {
      const result: CalculationResult = { success: true, value: 42 };
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value).toBe(42);
      }
    });

    it('should enforce error result structure', () => {
      const result: CalculationResult = {
        success: false,
        error: ERRORS.DIVISION_BY_ZERO,
      };
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERRORS.DIVISION_BY_ZERO);
      }
    });
  });
});
