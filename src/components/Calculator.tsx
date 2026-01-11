/**
 * Calculator Component
 *
 * Main calculator container that integrates all child components
 * and manages calculator state via useCalculator hook.
 */

'use client';

import { useEffect } from 'react';
import { useCalculator } from '@/hooks/useCalculator';
import Display from './Display';
import Keypad from './Keypad';
import OperationButtons from './OperationButtons';

export default function Calculator() {
  const {
    state,
    handleNumberInput,
    handleDecimalInput,
    handleNegativeInput,
    handleOperationSelect,
    handleCalculate,
    handleClear,
  } = useCalculator();

  // T072-T077: Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      // T073: Map keyboard numbers (0-9)
      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        handleNumberInput(key);
        return;
      }

      // T076: Map decimal point (.)
      if (key === '.') {
        event.preventDefault();
        handleDecimalInput();
        return;
      }

      // T074: Map keyboard operators
      switch (key) {
        case '+':
          event.preventDefault();
          handleOperationSelect('+');
          break;
        case '-':
          event.preventDefault();
          handleOperationSelect('-');
          break;
        case '*':
          event.preventDefault();
          handleOperationSelect('×');
          break;
        case '/':
          event.preventDefault();
          handleOperationSelect('÷');
          break;
        case '^':
          event.preventDefault();
          handleOperationSelect('^');
          break;
        case '%':
          event.preventDefault();
          handleOperationSelect('%');
          break;
        // T075: Map Enter/= key
        case 'Enter':
        case '=':
          event.preventDefault();
          handleCalculate();
          break;
        // Map Escape key to clear
        case 'Escape':
          event.preventDefault();
          handleClear();
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // T077: Cleanup on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    handleNumberInput,
    handleDecimalInput,
    handleOperationSelect,
    handleCalculate,
    handleClear,
  ]);

  return (
    <div
      className="w-full max-w-md mx-auto bg-gray-800 p-6 rounded-2xl shadow-2xl"
      role="region"
      aria-label="Arithmetic calculator"
    >
      {/* Display */}
      <Display
        value={state.displayValue}
        error={state.error}
        operation={state.operation}
      />

      {/* Main calculator layout */}
      <div className="grid grid-cols-4 gap-3">
        {/* Left side: Keypad (3 columns) */}
        <div className="col-span-3">
          <Keypad
            onNumberClick={handleNumberInput}
            onDecimalClick={handleDecimalInput}
            onNegativeClick={handleNegativeInput}
          />

          {/* Clear and Equals buttons below keypad */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={handleClear}
              aria-label="Clear calculator"
              className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
            >
              C
            </button>

            <button
              onClick={handleCalculate}
              aria-label="Calculate result"
              className="bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-xl font-semibold py-4 rounded-lg transition-colors"
            >
              =
            </button>
          </div>
        </div>

        {/* Right side: Operation buttons (1 column) */}
        <div className="col-span-1">
          <OperationButtons
            onOperationClick={handleOperationSelect}
            selectedOperation={state.operation}
          />
        </div>
      </div>
    </div>
  );
}
