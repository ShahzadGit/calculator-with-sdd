/**
 * Formatter Module
 *
 * Pure functions for formatting numbers for display.
 */

/**
 * Formats number for display
 *
 * @param value - Number to format
 * @returns Formatted string (max 10 decimal places, trailing zeros removed)
 *
 * Pure function - no side effects
 */
export function formatResult(value: number): string {
  // Handle special cases
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  // Round to 10 decimal places to avoid floating point precision issues
  const rounded = Math.round(value * 10000000000) / 10000000000;

  // Convert to string and remove trailing zeros
  let formatted = rounded.toString();

  // If the number has a decimal point, remove trailing zeros
  if (formatted.includes('.')) {
    formatted = formatted.replace(/\.?0+$/, '');
  }

  return formatted;
}
