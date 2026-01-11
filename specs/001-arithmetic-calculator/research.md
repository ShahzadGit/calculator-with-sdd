# Research & Technical Decisions: Arithmetic Calculator

**Feature**: 001-arithmetic-calculator
**Date**: 2026-01-09
**Phase**: Phase 0 - Research & Analysis

## Overview

This document captures research findings and technical decisions made during the planning phase for the arithmetic calculator feature. All decisions align with the project constitution's tech stack requirements.

## Technical Decisions

### Decision 1: State Management Approach

**Decision**: Custom React hook (`useCalculator`) with React's built-in `useState`

**Rationale**:
- Calculator state is simple and localized to a single component tree
- No global state needed (no multi-page coordination or data sharing)
- Built-in React hooks provide sufficient functionality for:
  - Current input tracking
  - Operation selection
  - Previous value storage
  - Error state management
- Avoids unnecessary complexity and bundle size from external state libraries

**Alternatives Considered**:
1. **React Hook Form**: Rejected - Designed for form validation workflows, not calculator logic. Would add unnecessary abstraction for simple state.
2. **Zustand/Redux**: Rejected - Overkill for component-local state. Calculator doesn't need global state or time-travel debugging.
3. **Context API**: Rejected - No prop drilling issues with flat component structure. Context adds unnecessary re-render overhead.

**Implementation Pattern**:
```typescript
// useCalculator.ts
const useCalculator = () => {
  const [currentInput, setCurrentInput] = useState<string>('');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [error, setError] = useState<string | null>(null);
  // ... business logic
};
```

---

### Decision 2: Input Validation Strategy

**Decision**: Zod schemas for runtime validation with TypeScript for compile-time types

**Rationale**:
- Constitution Article V mandates Zod for runtime validation
- Provides declarative validation rules that are self-documenting
- Automatic TypeScript type inference from schemas
- Excellent error messages for debugging
- Prevents invalid states at runtime (division by zero, non-numeric input, etc.)

**Alternatives Considered**:
1. **Manual validation functions**: Rejected - Error-prone, requires duplicate logic for TS types and runtime checks
2. **Yup**: Rejected - Not specified in constitution; Zod has better TypeScript integration
3. **TypeScript-only validation**: Rejected - No runtime safety (user input is always untyped at runtime)

**Implementation Pattern**:
```typescript
// validation.ts
import { z } from 'zod';

const NumberInputSchema = z.string()
  .regex(/^-?\d*\.?\d*$/, 'Please enter valid numbers')
  .refine(val => val !== '', 'Please enter both numbers');

const OperationSchema = z.enum(['+', '-', '×', '÷', '^', '%']);
```

---

### Decision 3: Number Formatting Library

**Decision**: Custom formatter using `Number.toFixed()` with trailing zero removal

**Rationale**:
- Simple requirements: format to 10 decimal places, remove trailing zeros
- No internationalization needed (out of scope per spec)
- Built-in JavaScript methods are sufficient and zero-dependency
- `Intl.NumberFormat` would add complexity for features we don't need

**Alternatives Considered**:
1. **Intl.NumberFormat**: Rejected - Designed for i18n (locale-specific formatting). Out of scope and adds complexity.
2. **numeral.js / accounting.js**: Rejected - External dependencies for simple formatting. Violates "simplest viable" principle.
3. **Big.js / decimal.js**: Rejected - Spec accepts JavaScript floating-point limitations. High-precision math not required.

**Implementation Pattern**:
```typescript
// formatter.ts
const formatResult = (value: number): string => {
  return value.toFixed(10).replace(/\.?0+$/, '');
};
```

---

### Decision 4: Testing Framework

**Decision**: Jest with React Testing Library

**Rationale**:
- Jest is industry standard for React/Next.js testing
- React Testing Library promotes testing user behavior, not implementation details
- Excellent Next.js integration and community support
- Built-in mocking, coverage reporting, snapshot testing
- Fast watch mode for TDD workflow

**Alternatives Considered**:
1. **Vitest**: Considered - Faster than Jest, better ESM support. However, Jest has more mature Next.js integration and better documentation for this use case.
2. **Mocha + Chai**: Rejected - Requires more configuration, less React-specific tooling

**Testing Strategy**:
- **Unit tests**: Pure functions (operations, validation, formatting)
- **Integration tests**: Component interactions, user workflows
- **Contract tests**: TypeScript type definitions and Zod schemas

---

### Decision 5: Keyboard Event Handling

**Decision**: Global keyboard event listener with `useEffect` hook

**Rationale**:
- Spec requires keyboard input support (FR-013)
- Global listener allows input from anywhere on page (better UX than requiring focus on input field)
- Clean separation: keyboard handler delegates to same business logic as button clicks
- Easy to test by simulating keyboard events

**Implementation Pattern**:
```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key >= '0' && event.key <= '9') handleNumberInput(event.key);
    if (['+', '-', '*', '/', '^', '%'].includes(event.key)) handleOperation(event.key);
    if (event.key === 'Enter') handleCalculate();
    if (event.key === 'Escape') handleClear();
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [dependencies]);
```

---

### Decision 6: Error Handling Pattern

**Decision**: Error state in calculator hook with conditional rendering in Display component

**Rationale**:
- Errors are transient UI state (cleared on next input)
- Centralized error state simplifies error management
- Display component conditionally shows error or result based on state
- All error messages defined as constants for consistency

**Error Categories**:
1. **Validation errors**: Invalid input format, empty fields
2. **Operation errors**: Division by zero, number too large
3. **System errors**: Unexpected calculation failures (graceful degradation)

**Implementation Pattern**:
```typescript
// Error constants
const ERRORS = {
  DIVISION_BY_ZERO: 'Cannot divide by zero',
  INVALID_INPUT: 'Please enter valid numbers',
  EMPTY_INPUT: 'Please enter both numbers',
  NUMBER_TOO_LARGE: 'Number too large',
} as const;
```

---

### Decision 7: Component Architecture

**Decision**: 5-component structure with clear separation of concerns

**Components**:
1. **Calculator** (container): Orchestrates state and business logic via `useCalculator` hook
2. **Display**: Presents current input, result, or error (read-only view)
3. **Keypad**: Number buttons (0-9, decimal, negative sign)
4. **OperationButtons**: Operation selectors (+, −, ×, ÷, ^, %)
5. **ClearButton**: Reset functionality

**Rationale**:
- Each component has single responsibility (SRP)
- Easy to test in isolation
- Clear data flow: Calculator (state) → child components (props)
- Reusable components (e.g., Display can show result or error)

**Data Flow**:
```
Calculator (useCalculator hook)
  ├─> Display (displayValue, error)
  ├─> Keypad (onNumberClick)
  ├─> OperationButtons (onOperationClick, selectedOperation)
  └─> ClearButton (onClear)
```

---

## Performance Considerations

### Target Metrics (from spec SC-007, SC-004)
- Operation response time: <100ms
- Error message display: <100ms
- UI interactions: 60fps

### Optimization Strategies

1. **Pure Functions**: All arithmetic operations are pure functions (no side effects, easily memoizable)
2. **Minimal Re-renders**: State updates are batched; only changed components re-render
3. **No External API Calls**: All computation is client-side synchronous
4. **Lightweight Bundle**: No heavy math libraries, minimal dependencies

**Validation**: Performance metrics will be verified in integration tests using React Testing Library's timing utilities.

---

## Best Practices Applied

### From Next.js 15 / React 19
- Use `'use client'` directive for interactive components
- Server components for static layout (if applicable)
- App Router file conventions (`page.tsx`, `layout.tsx`)

### From TypeScript
- Strict mode enabled (`tsconfig.json`)
- Explicit types for all function parameters and return values
- No `any` types allowed (enforced by ESLint)

### From TailwindCSS
- Utility-first styling
- Responsive design with breakpoint prefixes (`sm:`, `md:`, `lg:`)
- Design tokens for consistent spacing and colors

### From Constitution Article IV (Development Principles)
- Clarity: Self-documenting code with descriptive names
- Modularity: Single-responsibility components and functions
- Testability: Business logic separated from UI rendering

---

## Dependencies Summary

### Production Dependencies
```json
{
  "next": "15.3.6",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "zod": "^3.22.0"
}
```

### Development Dependencies
```json
{
  "@types/react": "^19.0.0",
  "@types/node": "^20.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "eslint": "^8.0.0",
  "prettier": "^3.0.0",
  "jest": "^29.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0"
}
```

**Rationale**: Minimal dependency footprint. All dependencies are either constitution-mandated or essential for testing/development workflow.

---

## Open Questions & Future Considerations

### Resolved in This Phase
- ✅ State management approach
- ✅ Input validation strategy
- ✅ Number formatting approach
- ✅ Testing framework selection
- ✅ Component architecture

### Deferred to Implementation
- Exact Tailwind class names (determined during UI implementation)
- Specific keyboard shortcuts (Enter for calculate, Escape for clear confirmed)
- Animation/transition timing (visual polish, not critical path)

### Out of Scope (per spec)
- Accessibility (ARIA labels, screen reader support) - future iteration
- Calculation history - not in MVP
- Scientific functions - explicitly excluded
- Expression parsing - explicitly excluded

---

## Architectural Decision Records (ADR) Candidates

The following decisions are architecturally significant and should be documented as ADRs if implemented:

1. **State Management**: Custom hook vs. external library (Zustand/Redux)
2. **Input Validation**: Zod schemas vs. manual validation
3. **Number Formatting**: Custom formatter vs. Intl.NumberFormat vs. decimal library

**Recommendation**: Create ADRs during implementation for decisions 1 and 2. Decision 3 is tactical (can be changed easily without architectural impact).

---

## Conclusion

All technical unknowns from the plan's Technical Context section have been resolved. The architecture is simple, testable, and fully aligned with the project constitution. No constitution violations identified.

**Ready for Phase 1**: Design artifacts (data-model.md, contracts, quickstart.md)
