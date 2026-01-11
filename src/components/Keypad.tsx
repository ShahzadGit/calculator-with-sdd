/**
 * Keypad Component
 *
 * Number input buttons (0-9), decimal point, and negative sign.
 */

'use client';

import type { KeypadProps } from '@/lib/types';

const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];
const buttonClasses = "bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-2xl font-semibold py-4 rounded-lg transition-colors";

export default function Keypad({
  onNumberClick,
  onDecimalClick,
  onNegativeClick,
}: KeypadProps) {

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Number buttons 7-9, 4-6, 1-3 */}
      {numbers.slice(0, 9).map((num) => (
        <button
          key={num}
          onClick={() => onNumberClick(num)}
          aria-label={`Number ${num}`}
          className={buttonClasses}
        >
          {num}
        </button>
      ))}

      {/* Bottom row: +/-, 0, . */}
      <button
        onClick={onNegativeClick}
        aria-label="Toggle negative"
        className={buttonClasses}
      >
        +/-
      </button>

      <button
        onClick={() => onNumberClick('0')}
        aria-label="Number 0"
        className={buttonClasses}
      >
        0
      </button>

      <button
        onClick={onDecimalClick}
        aria-label="Decimal point"
        className={buttonClasses}
      >
        .
      </button>
    </div>
  );
}
