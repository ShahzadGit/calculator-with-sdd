/**
 * Type Definitions: Arithmetic Calculator
 *
 * This file defines all TypeScript types, Zod schemas, and utility functions
 * for the calculator feature. It serves as the single source of truth for
 * data structures and validation rules.
 */

import { z } from 'zod';

// ============================================================================
// Enumerations
// ============================================================================

/**
 * Supported arithmetic operations
 */
export const OPERATIONS = ['+', '-', '×', '÷', '^', '%'] as const;
export type Operation = typeof OPERATIONS[number];

/**
 * Error message constants
 */
export const ERRORS = {
  DIVISION_BY_ZERO: 'Cannot divide by zero',
  INVALID_INPUT: 'Please enter valid numbers',
  EMPTY_INPUT: 'Please enter both numbers',
  INVALID_OPERATION: 'Invalid operation',
  NUMBER_TOO_LARGE: 'Number too large',
} as const;

export type ErrorType = typeof ERRORS[keyof typeof ERRORS];

// ============================================================================
// Core Entities
// ============================================================================

/**
 * Calculator runtime state
 *
 * Represents the complete state of the calculator at any moment.
 *
 * Invariants:
 * - error and result are mutually exclusive
 * - currentInput must match number input regex when non-empty
 * - operation requires previousValue to be set
 * - displayValue is never empty
 */
export interface CalculatorState {
  /** Current number being entered (as string for input handling) */
  currentInput: string;

  /** First operand of the calculation */
  previousValue: number | null;

  /** Selected arithmetic operation */
  operation: Operation | null;

  /** Value shown in the display */
  displayValue: string;

  /** Current error message if any */
  error: ErrorType | null;

  /** Calculated result */
  result: number | null;
}

/**
 * Input parameters for a single calculation
 */
export interface CalculationInput {
  firstOperand: number;
  secondOperand: number;
  operator: Operation;
}

/**
 * Result of a calculation (discriminated union for type-safe error handling)
 */
export type CalculationResult =
  | { success: true; value: number }
  | { success: false; error: ErrorType };

// ============================================================================
// Zod Validation Schemas
// ============================================================================

/**
 * Validates number input string
 *
 * Rules:
 * - Optional leading minus sign (negative numbers)
 * - Digits only
 * - Optional single decimal point
 * - No other characters allowed
 */
export const NumberInputSchema = z
  .string()
  .regex(/^-?\d*\.?\d*$/, ERRORS.INVALID_INPUT);

/**
 * Validates number input is not empty
 */
export const NonEmptyNumberInputSchema = NumberInputSchema.refine(
  (val) => val !== '',
  { message: ERRORS.EMPTY_INPUT }
);

/**
 * Validates operation selection
 */
export const OperationSchema = z.enum(['+', '-', '×', '÷', '^', '%']);

/**
 * Validates calculation input
 *
 * Rules:
 * - Operands must be finite numbers
 * - Division by zero is prevented
 * - Modulus by zero is prevented
 */
export const CalculationInputSchema = z
  .object({
    firstOperand: z.number().finite(),
    secondOperand: z.number().finite(),
    operator: OperationSchema,
  })
  .refine(
    (data) => !(data.operator === '÷' && data.secondOperand === 0),
    { message: ERRORS.DIVISION_BY_ZERO, path: ['secondOperand'] }
  )
  .refine(
    (data) => !(data.operator === '%' && data.secondOperand === 0),
    { message: ERRORS.DIVISION_BY_ZERO, path: ['secondOperand'] }
  );

// ============================================================================
// Function Signatures
// ============================================================================

/**
 * Performs arithmetic calculation
 *
 * @param input - Validated calculation input
 * @returns Result with value or error
 *
 * Pure function - no side effects
 */
export type CalculateFunction = (input: CalculationInput) => CalculationResult;

/**
 * Formats number for display
 *
 * @param value - Number to format
 * @returns Formatted string (max 10 decimal places, trailing zeros removed)
 *
 * Pure function - no side effects
 */
export type FormatResultFunction = (value: number) => string;

/**
 * Validates number input string
 *
 * @param input - Input string to validate
 * @returns Validation result
 */
export type ValidateNumberInputFunction = (input: string) => {
  success: boolean;
  error?: string;
};

/**
 * Parses validated string to number
 *
 * @param input - Validated number string
 * @returns Parsed number or null if invalid
 *
 * Pure function - no side effects
 */
export type ParseNumberFunction = (input: string) => number | null;

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for Display component
 */
export interface DisplayProps {
  /** Value to display (result or current input) */
  value: string;

  /** Error message to display (if any) */
  error: ErrorType | null;

  /** Currently selected operation (shown as indicator) */
  operation: Operation | null;
}

/**
 * Props for Keypad component
 */
export interface KeypadProps {
  /** Callback when number button clicked */
  onNumberClick: (digit: string) => void;

  /** Callback when decimal point clicked */
  onDecimalClick: () => void;

  /** Callback when negative sign clicked */
  onNegativeClick: () => void;
}

/**
 * Props for OperationButtons component
 */
export interface OperationButtonsProps {
  /** Callback when operation selected */
  onOperationClick: (operation: Operation) => void;

  /** Currently selected operation (for visual feedback) */
  selectedOperation: Operation | null;
}

/**
 * Props for ClearButton component
 */
export interface ClearButtonProps {
  /** Callback when clear button clicked */
  onClear: () => void;
}

/**
 * Props for Calculator component (root component)
 */
export interface CalculatorProps {
  /** Optional initial state (for testing) */
  initialState?: Partial<CalculatorState>;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * Return type for useCalculator hook
 */
export interface UseCalculatorReturn {
  /** Current calculator state */
  state: CalculatorState;

  /** Handle number input (0-9) */
  handleNumberInput: (digit: string) => void;

  /** Handle decimal point input */
  handleDecimalInput: () => void;

  /** Handle negative sign input */
  handleNegativeInput: () => void;

  /** Handle operation selection */
  handleOperationSelect: (operation: Operation) => void;

  /** Handle calculate action (equals button) */
  handleCalculate: () => void;

  /** Handle clear/reset action */
  handleClear: () => void;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Keyboard event keys mapped to calculator actions
 */
export const KEYBOARD_MAP = {
  // Numbers
  '0': 'number' as const,
  '1': 'number' as const,
  '2': 'number' as const,
  '3': 'number' as const,
  '4': 'number' as const,
  '5': 'number' as const,
  '6': 'number' as const,
  '7': 'number' as const,
  '8': 'number' as const,
  '9': 'number' as const,

  // Operations
  '+': 'operation' as const,
  '-': 'operation' as const,
  '*': 'multiply' as const,  // Keyboard * maps to ×
  '/': 'divide' as const,     // Keyboard / maps to ÷
  '^': 'operation' as const,
  '%': 'operation' as const,

  // Actions
  'Enter': 'calculate' as const,
  '=': 'calculate' as const,
  'Escape': 'clear' as const,
  'Backspace': 'backspace' as const,
  '.': 'decimal' as const,
} as const;

export type KeyboardAction = typeof KEYBOARD_MAP[keyof typeof KEYBOARD_MAP];

/**
 * Operator map for calculation
 */
export const OPERATOR_FUNCTIONS: Record<Operation, (a: number, b: number) => number> = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => a / b,
  '^': (a, b) => Math.pow(a, b),
  '%': (a, b) => a % b,
};

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Factory function for creating test calculator state
 */
export const createTestCalculatorState = (
  overrides?: Partial<CalculatorState>
): CalculatorState => ({
  currentInput: '',
  previousValue: null,
  operation: null,
  displayValue: '0',
  error: null,
  result: null,
  ...overrides,
});

/**
 * Factory function for creating test calculation input
 */
export const createTestCalculationInput = (
  overrides?: Partial<CalculationInput>
): CalculationInput => ({
  firstOperand: 0,
  secondOperand: 0,
  operator: '+',
  ...overrides,
});

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard for Operation
 */
export const isOperation = (value: unknown): value is Operation => {
  return typeof value === 'string' && OPERATIONS.includes(value as Operation);
};

/**
 * Type guard for ErrorType
 */
export const isErrorType = (value: unknown): value is ErrorType => {
  return typeof value === 'string' && Object.values(ERRORS).includes(value as ErrorType);
};

/**
 * Type guard for successful calculation result
 */
export const isSuccessResult = (
  result: CalculationResult
): result is { success: true; value: number } => {
  return result.success === true;
};

/**
 * Type guard for error calculation result
 */
export const isErrorResult = (
  result: CalculationResult
): result is { success: false; error: ErrorType } => {
  return result.success === false;
};
