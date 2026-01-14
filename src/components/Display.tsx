/**
 * Display Component
 *
 * Shows the current value, error messages, and operation indicator.
 * Enhanced with calculator.display colors and visual separation.
 * Supports animations for result pulse and error shake (US3).
 *
 * @see specs/002-ui-enhancements/spec.md - US1 Visual Hierarchy, US3 Animations
 */

'use client';

import type { DisplayProps } from '@/lib/types';

export default function Display({
  value,
  error,
  operation,
  showPulse = false,
  showShake = false,
}: DisplayProps) {
  // T093-T096: Build animation classes based on state
  const animationList = [
    showPulse && 'animate-pulse-result',
    showShake && error && 'animate-shake-error',
  ].filter(Boolean);
  const animationClasses = animationList.length > 0 ? ` ${animationList.join(' ')}` : '';

  return (
    <div className="relative w-full bg-calculator-display rounded-xl p-4 sm:p-5 mb-4 shadow-inner border border-white/5">
      {/* Operation Indicator */}
      {operation && !error && (
        <div
          className="absolute top-2 right-4 text-sm text-calculator-textMuted font-medium"
          aria-live="polite"
          aria-label={`Selected operation: ${operation}`}
        >
          {operation}
        </div>
      )}

      {/* Display Value - T062: Use aria-live="assertive" for errors */}
      {/* T093-T096: Animation classes for pulse/shake/fade effects */}
      <output
        role="status"
        aria-label={error ? 'Calculator error message' : 'Calculator display value'}
        aria-live={error ? 'assertive' : 'polite'}
        className={`block w-full bg-transparent text-right text-3xl sm:text-4xl lg:text-5xl font-mono outline-none truncate ${
          error ? 'text-calculator-clear' : 'text-calculator-text'
        }${animationClasses}`}
      >
        {error || value}
      </output>
    </div>
  );
}
