/**
 * Validation Module
 *
 * Pure functions for input validation and parsing.
 */

import { NumberInputSchema, ERRORS } from './types';

/**
 * Validates number input string
 *
 * @param input - Input string to validate
 * @returns Validation result
 */
export function validateNumberInput(input: string): {
  success: boolean;
  error?: string;
} {
  // Check if empty
  if (input === '') {
    return { success: false, error: ERRORS.EMPTY_INPUT };
  }

  // Validate using Zod schema
  const result = NumberInputSchema.safeParse(input);

  if (!result.success) {
    return { success: false, error: ERRORS.INVALID_INPUT };
  }

  return { success: true };
}

/**
 * Parses validated string to number
 *
 * @param input - Validated number string
 * @returns Parsed number or null if invalid
 *
 * Pure function - no side effects
 */
export function parseNumber(input: string): number | null {
  // Handle empty string
  if (input === '' || input === '-' || input === '.') {
    return null;
  }

  const parsed = parseFloat(input);

  // Check if parsing was successful
  if (isNaN(parsed) || !Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}
