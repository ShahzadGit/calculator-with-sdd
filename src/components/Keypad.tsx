/**
 * Keypad Component
 *
 * Number input buttons (0-9), decimal point, and negative sign.
 * Enhanced with calculator.number colors, touch targets, and neumorphic styling.
 *
 * @see specs/002-ui-enhancements/spec.md - US1 Visual Hierarchy
 */

'use client';

import type { KeypadProps } from '@/lib/types';

const numbers = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'];

// T029, T110: Number button styling with calculator.number colors, touch-target utility, and responsive text sizing
const buttonClasses = `
  bg-calculator-number
  hover:brightness-125
  active:brightness-90
  text-calculator-text
  text-xl sm:text-2xl lg:text-3xl
  font-semibold
  min-h-touch min-w-touch
  py-4
  rounded-lg
  neomorphic-raised
  animate-on-hover
  focus-ring
  transition-all
`.replace(/\s+/g, ' ').trim();

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
