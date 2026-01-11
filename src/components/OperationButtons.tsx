/**
 * OperationButtons Component
 *
 * Arithmetic operation buttons (+, −, ×, ÷).
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
          className={`text-2xl font-semibold py-4 rounded-lg transition-colors ${
            selectedOperation === op
              ? 'bg-orange-600 hover:bg-orange-500 active:bg-orange-700'
              : 'bg-orange-500 hover:bg-orange-400 active:bg-orange-600'
          } text-white`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
