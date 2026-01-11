/**
 * Operations Module
 *
 * Pure functions for arithmetic calculations.
 * All functions are side-effect free and deterministic.
 */

import type { CalculationInput, CalculationResult } from './types';
import { ERRORS, OPERATOR_FUNCTIONS } from './types';

/**
 * Performs arithmetic calculation
 *
 * @param input - Validated calculation input
 * @returns Result with value or error
 *
 * Pure function - no side effects
 */
export function calculate(input: CalculationInput): CalculationResult {
  const { firstOperand, secondOperand, operator } = input;

  // Validate division by zero
  if (operator === '÷' && secondOperand === 0) {
    return { success: false, error: ERRORS.DIVISION_BY_ZERO };
  }

  // Validate modulus by zero
  if (operator === '%' && secondOperand === 0) {
    return { success: false, error: ERRORS.DIVISION_BY_ZERO };
  }

  // Validate operands are finite
  if (!Number.isFinite(firstOperand) || !Number.isFinite(secondOperand)) {
    return { success: false, error: ERRORS.INVALID_INPUT };
  }

  try {
    // Get the operator function and perform calculation
    const operatorFn = OPERATOR_FUNCTIONS[operator];
    const result = operatorFn(firstOperand, secondOperand);

    // Check if result is too large
    if (!Number.isFinite(result) || Math.abs(result) > Number.MAX_SAFE_INTEGER) {
      return { success: false, error: ERRORS.NUMBER_TOO_LARGE };
    }

    return { success: true, value: result };
  } catch {
    return { success: false, error: ERRORS.INVALID_OPERATION };
  }
}
