/**
 * OperationButtons Component
 *
 * Arithmetic operation buttons (+, −, ×, ÷).
 * Enhanced with calculator.operation colors and distinct visual treatment.
 *
 * @see specs/002-ui-enhancements/spec.md - US1 Visual Hierarchy
 */

'use client';

import type { OperationButtonsProps, Operation } from '@/lib/types';

const operations: Array<{ op: Operation; label: string; ariaLabel: string }> = [
  { op: '÷', label: '÷', ariaLabel: 'Divide' },
  { op: '×', label: '×', ariaLabel: 'Multiply' },
  { op: '-', label: '−', ariaLabel: 'Subtract' },
  { op: '+', label: '+', ariaLabel: 'Add' },
  { op: '^', label: '^', ariaLabel: 'Exponentiate' },
  { op: '%', label: '%', ariaLabel: 'Modulus' },
];

export default function OperationButtons({
  onOperationClick,
  selectedOperation,
}: OperationButtonsProps) {

  return (
    <div className="grid grid-cols-1 gap-2">
      {operations.map(({ op, label, ariaLabel }) => (
        <button
          key={op}
          onClick={() => onOperationClick(op)}
          aria-label={ariaLabel}
          aria-pressed={selectedOperation === op}
          className={`
            text-xl sm:text-2xl lg:text-3xl
            font-semibold
            min-h-touch
            py-4
            rounded-lg
            neomorphic-raised
            animate-on-hover
            focus-ring
            transition-all
            ${selectedOperation === op
              ? 'bg-calculator-operation brightness-125 ring-2 ring-white/30'
              : 'bg-calculator-operation hover:brightness-110 active:brightness-90'
            }
            text-white
          `.replace(/\s+/g, ' ').trim()}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
