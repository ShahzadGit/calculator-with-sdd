/**
 * Home Page
 *
 * Main page displaying the arithmetic calculator with modern UI styling.
 * Uses custom calculator color scheme with gradient background.
 *
 * @see specs/002-ui-enhancements/spec.md - US1 Visual Hierarchy
 */

import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-calculator-bg via-slate-900 to-calculator-bg p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-calculator-text mb-6 sm:mb-8 text-center">
          Arithmetic Calculator
        </h1>
        <Calculator />
      </div>
    </main>
  );
}
