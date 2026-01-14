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
      className="w-full max-w-md mx-auto glass-container p-4 sm:p-6 lg:p-8 shadow-2xl"
      role="region"
      aria-label="Arithmetic calculator"
    >
      {/* Display - T093-T096: Pass animation props for result pulse and error shake */}
      <Display
        value={state.displayValue}
        error={state.error}
        operation={state.operation}
        showPulse={state.result !== null}
        showShake={state.error !== null}
      />

      {/* Main calculator layout */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {/* Left side: Keypad (3 columns) */}
        <div className="col-span-3">
          <Keypad
            onNumberClick={handleNumberInput}
            onDecimalClick={handleDecimalInput}
            onNegativeClick={handleNegativeInput}
          />

          {/* Clear and Equals buttons below keypad */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* T031, T110: Clear button with calculator.clear color and responsive text sizing */}
            <button
              onClick={handleClear}
              aria-label="Clear calculator"
              className="bg-calculator-clear hover:brightness-110 active:brightness-90 text-white text-lg sm:text-xl lg:text-2xl font-semibold min-h-touch py-4 rounded-lg neomorphic-raised animate-on-hover focus-ring transition-all"
            >
              C
            </button>

            {/* T032, T110: Equals button with calculator.equals color and responsive text sizing */}
            <button
              onClick={handleCalculate}
              aria-label="Calculate result"
              className="bg-calculator-equals hover:brightness-110 active:brightness-90 text-white text-lg sm:text-xl lg:text-2xl font-semibold min-h-touch py-4 rounded-lg neomorphic-raised animate-on-hover focus-ring transition-all"
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
