/**
 * Display Component
 *
 * Shows the current value, error messages, and operation indicator.
 */

'use client';

import type { DisplayProps } from '@/lib/types';

export default function Display({ value, error, operation }: DisplayProps) {
  return (
    <div className="relative w-full bg-gray-900 rounded-lg p-4 mb-4">
      {/* Operation Indicator */}
      {operation && !error && (
        <div
          className="absolute top-2 right-4 text-sm text-gray-400"
          aria-live="polite"
          aria-label={`Selected operation: ${operation}`}
        >
          {operation}
        </div>
      )}

      {/* Display Value */}
      <output
        aria-label={error ? 'Calculator error message' : 'Calculator display value'}
        className={`block w-full bg-transparent text-right text-4xl font-mono outline-none ${
          error ? 'text-red-500' : 'text-white'
        }`}
      >
        {error || value}
      </output>
    </div>
  );
}
