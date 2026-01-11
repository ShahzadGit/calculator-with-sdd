/**
 * useCalculator Hook
 *
 * Custom hook for managing calculator state and operations.
 * Provides handlers for all calculator actions.
 */

'use client';

import { useState, useCallback } from 'react';
import type {
  CalculatorState,
  Operation,
  UseCalculatorReturn,
} from '@/lib/types';
import { calculate } from '@/lib/operations';
import { formatResult } from '@/lib/formatter';
import { parseNumber } from '@/lib/validation';

const INITIAL_STATE: CalculatorState = {
  currentInput: '',
  previousValue: null,
  operation: null,
  displayValue: '0',
  error: null,
  result: null,
};

/**
 * Custom hook for calculator logic
 */
export function useCalculator(): UseCalculatorReturn {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);

  /**
   * Handle number input (0-9)
   */
  const handleNumberInput = useCallback((digit: string) => {
    setState((prev) => {
      // Clear error if any
      if (prev.error) {
        return {
          ...INITIAL_STATE,
          currentInput: digit,
          displayValue: digit,
        };
      }

      // If result exists, start new calculation
      if (prev.result !== null) {
        return {
          ...INITIAL_STATE,
          currentInput: digit,
          displayValue: digit,
        };
      }

      // Append digit to current input
      const newInput = prev.currentInput + digit;
      return {
        ...prev,
        currentInput: newInput,
        displayValue: newInput,
      };
    });
  }, []);

  /**
   * Handle decimal point input
   */
  const handleDecimalInput = useCallback(() => {
    setState((prev) => {
      // Clear error if any
      if (prev.error) {
        return {
          ...INITIAL_STATE,
          currentInput: '0.',
          displayValue: '0.',
        };
      }

      // If result exists, start new calculation
      if (prev.result !== null) {
        return {
          ...INITIAL_STATE,
          currentInput: '0.',
          displayValue: '0.',
        };
      }

      // Don't add decimal if already present
      if (prev.currentInput.includes('.')) {
        return prev;
      }

      // If empty, start with "0."
      if (prev.currentInput === '') {
        return {
          ...prev,
          currentInput: '0.',
          displayValue: '0.',
        };
      }

      // Append decimal point
      const newInput = prev.currentInput + '.';
      return {
        ...prev,
        currentInput: newInput,
        displayValue: newInput,
      };
    });
  }, []);

  /**
   * Handle negative sign input
   */
  const handleNegativeInput = useCallback(() => {
    setState((prev) => {
      // Clear error if any
      if (prev.error) {
        return {
          ...INITIAL_STATE,
          currentInput: '-',
          displayValue: '-',
        };
      }

      // If result exists, start new calculation with negative
      if (prev.result !== null) {
        return {
          ...INITIAL_STATE,
          currentInput: '-',
          displayValue: '-',
        };
      }

      // Toggle negative sign
      if (prev.currentInput.startsWith('-')) {
        const newInput = prev.currentInput.slice(1);
        return {
          ...prev,
          currentInput: newInput,
          displayValue: newInput || '0',
        };
      } else {
        const newInput = '-' + prev.currentInput;
        return {
          ...prev,
          currentInput: newInput,
          displayValue: newInput,
        };
      }
    });
  }, []);

  /**
   * Handle operation selection
   */
  const handleOperationSelect = useCallback((operation: Operation) => {
    setState((prev) => {
      // If there's an error, clear it first
      if (prev.error) {
        return INITIAL_STATE;
      }

      // Parse current input
      const currentValue = parseNumber(prev.currentInput);

      // If no valid current input and no previous value, can't proceed
      if (currentValue === null && prev.previousValue === null) {
        return prev;
      }

      // If we have a previous operation and current input, calculate first
      if (
        prev.operation !== null &&
        prev.previousValue !== null &&
        currentValue !== null
      ) {
        const result = calculate({
          firstOperand: prev.previousValue,
          secondOperand: currentValue,
          operator: prev.operation,
        });

        if (!result.success) {
          return {
            ...prev,
            error: result.error,
            displayValue: result.error,
            currentInput: '',
          };
        }

        return {
          ...prev,
          previousValue: result.value,
          operation,
          currentInput: '',
          displayValue: formatResult(result.value),
          result: null,
        };
      }

      // Store current value as previous and set operation
      const valueToStore = currentValue !== null ? currentValue : prev.previousValue;

      return {
        ...prev,
        previousValue: valueToStore,
        operation,
        currentInput: '',
        result: null,
      };
    });
  }, []);

  /**
   * Handle calculate action (equals button)
   */
  const handleCalculate = useCallback(() => {
    setState((prev) => {
      // Need both values and an operation
      if (prev.operation === null || prev.previousValue === null) {
        return prev;
      }

      const currentValue = parseNumber(prev.currentInput);
      if (currentValue === null) {
        return prev;
      }

      // Perform calculation
      const result = calculate({
        firstOperand: prev.previousValue,
        secondOperand: currentValue,
        operator: prev.operation,
      });

      if (!result.success) {
        return {
          ...prev,
          error: result.error,
          displayValue: result.error,
          currentInput: '',
          previousValue: null,
          operation: null,
        };
      }

      // Display result
      const formatted = formatResult(result.value);
      return {
        ...prev,
        result: result.value,
        displayValue: formatted,
        currentInput: formatted,
        previousValue: null,
        operation: null,
        error: null,
      };
    });
  }, []);

  /**
   * Handle clear/reset action
   */
  const handleClear = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    handleNumberInput,
    handleDecimalInput,
    handleNegativeInput,
    handleOperationSelect,
    handleCalculate,
    handleClear,
  };
}
