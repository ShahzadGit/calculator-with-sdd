# Data Model: Arithmetic Calculator

**Feature**: 001-arithmetic-calculator
**Date**: 2026-01-09
**Phase**: Phase 1 - Design

## Overview

This document defines the data structures and state models for the arithmetic calculator. Since this is a client-side application with no persistence, all data is ephemeral runtime state.

## Entities

### 1. CalculatorState

**Description**: Represents the complete runtime state of the calculator at any given moment.

**Attributes**:

| Attribute | Type | Required | Description | Validation Rules |
|-----------|------|----------|-------------|------------------|
| `currentInput` | `string` | Yes | Current number being entered by user | Matches regex: `/^-?\d*\.?\d*$/` |
| `previousValue` | `number \| null` | Yes | First operand of the calculation | Must be valid JavaScript number or null |
| `operation` | `Operation \| null` | Yes | Selected arithmetic operation | One of: `+`, `-`, `×`, `÷`, `^`, `%`, or null |
| `displayValue` | `string` | Yes | Value shown in the display | Non-empty string |
| `error` | `string \| null` | Yes | Current error message if any | One of predefined error constants or null |
| `result` | `number \| null` | Yes | Calculated result | Valid JavaScript number or null |

**State Transitions**:

```
Initial State:
{
  currentInput: '',
  previousValue: null,
  operation: null,
  displayValue: '0',
  error: null,
  result: null
}

After entering first number "5":
{
  currentInput: '5',
  previousValue: null,
  operation: null,
  displayValue: '5',
  error: null,
  result: null
}

After selecting operation "+":
{
  currentInput: '',
  previousValue: 5,
  operation: '+',
  displayValue: '5',
  error: null,
  result: null
}

After entering second number "3":
{
  currentInput: '3',
  previousValue: 5,
  operation: '+',
  displayValue: '3',
  error: null,
  result: null
}

After pressing equals/calculate:
{
  currentInput: '',
  previousValue: null,
  operation: null,
  displayValue: '8',
  error: null,
  result: 8
}

Error state (division by zero):
{
  currentInput: '',
  previousValue: 10,
  operation: '÷',
  displayValue: '',
  error: 'Cannot divide by zero',
  result: null
}
```

**Invariants**:
- `error` and `result` are mutually exclusive (if error is set, result is null)
- `currentInput` must always match number input regex when non-empty
- `operation` can only be set if `previousValue` is not null
- `displayValue` is never empty (defaults to '0')

---

### 2. Operation

**Description**: Enumeration of supported arithmetic operations

**Type**: `string` literal union

**Valid Values**:
- `'+'` - Addition
- `'-'` - Subtraction
- `'×'` - Multiplication
- `'÷'` - Division
- `'^'` - Exponentiation
- `'%'` - Modulus

**Mapping to JavaScript Operators**:
```typescript
const operatorMap = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '×': (a, b) => a * b,
  '÷': (a, b) => a / b,
  '^': (a, b) => Math.pow(a, b),
  '%': (a, b) => a % b,
};
```

---

### 3. ErrorType

**Description**: Enumeration of possible error conditions

**Type**: `string` constant

**Valid Values**:
- `'Cannot divide by zero'` - Triggered when user attempts division by 0
- `'Please enter valid numbers'` - Triggered when input contains invalid characters
- `'Please enter both numbers'` - Triggered when calculation attempted with empty input
- `'Invalid operation'` - Triggered when operation is malformed
- `'Number too large'` - Triggered when result exceeds safe number range

**Usage**: Error constants should be defined in a single source of truth to ensure consistency across validation and display.

---

### 4. CalculationInput

**Description**: Input parameters for a single arithmetic calculation

**Attributes**:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `firstOperand` | `number` | Yes | First number in the operation |
| `secondOperand` | `number` | Yes | Second number in the operation |
| `operator` | `Operation` | Yes | Arithmetic operation to perform |

**Validation**:
- `firstOperand` and `secondOperand` must be valid JavaScript numbers
- `firstOperand` and `secondOperand` must not be `NaN` or `Infinity`
- `operator` must be one of the valid Operation values
- For division: `secondOperand` must not be 0
- For modulus: `secondOperand` must not be 0

---

### 5. CalculationResult

**Description**: Output of an arithmetic calculation

**Type**: Discriminated union

**Success Case**:
```typescript
{
  success: true;
  value: number;
}
```

**Error Case**:
```typescript
{
  success: false;
  error: ErrorType;
}
```

**Purpose**: Type-safe result handling that forces explicit error checking.

---

## Data Flow Diagram

```
User Input (Keyboard/Button)
        ↓
  Input Validation (Zod)
        ↓
  Update CalculatorState
        ↓
  Calculate (if operation complete)
        ↓
  Format Result
        ↓
  Update Display
```

## State Management

### State Location
All state is managed in the `useCalculator` custom React hook. No global state or external state management library is used.

### State Updates
State updates follow React's immutable update patterns:
```typescript
setState(prevState => ({
  ...prevState,
  currentInput: newInput
}));
```

### State Persistence
**None**. State is ephemeral and resets on page reload. This is intentional per the spec (no calculation history or memory functions).

---

## Validation Rules (Zod Schemas)

### NumberInputSchema
```typescript
z.string()
  .regex(/^-?\d*\.?\d*$/, 'Please enter valid numbers')
  .refine(val => val !== '', 'Please enter both numbers')
```

**Validates**:
- String contains only digits, optional minus sign, optional decimal point
- String is not empty when calculation is attempted
- Leading minus sign allowed (for negative numbers)
- Multiple decimal points rejected
- Alphabetic or special characters rejected

### OperationSchema
```typescript
z.enum(['+', '-', '×', '÷', '^', '%'])
```

**Validates**:
- Operation is one of the six supported operators
- Rejects any invalid operation strings

### CalculationInputSchema
```typescript
z.object({
  firstOperand: z.number().finite(),
  secondOperand: z.number().finite(),
  operator: OperationSchema
}).refine(
  data => !(data.operator === '÷' && data.secondOperand === 0),
  { message: 'Cannot divide by zero' }
).refine(
  data => !(data.operator === '%' && data.secondOperand === 0),
  { message: 'Cannot divide by zero' }
);
```

**Validates**:
- Operands are finite numbers (not NaN or Infinity)
- Division by zero is prevented
- Modulus by zero is prevented

---

## Business Logic Functions

### Pure Functions (No Side Effects)

**calculate(input: CalculationInput): CalculationResult**
- Performs arithmetic operation
- Returns success with value or error with message
- No mutations, no side effects

**formatResult(value: number): string**
- Formats number to max 10 decimal places
- Removes trailing zeros
- Handles scientific notation for very small numbers

**validateNumberInput(input: string): ValidationResult**
- Checks input against NumberInputSchema
- Returns validation errors if any

**parseNumber(input: string): number | null**
- Converts validated string to JavaScript number
- Returns null if parsing fails

---

## Edge Case Handling

### Division by Zero
- **Detection**: Zod schema refine rule
- **Behavior**: Return error result, set `error` state, display error message
- **Recovery**: Clear error on next input

### Large Numbers
- **Detection**: Check if result > Number.MAX_SAFE_INTEGER
- **Behavior**: Gracefully display "Number too large" or accept precision loss
- **Recovery**: Allow continued use, warn user

### Decimal Precision
- **Limitation**: JavaScript floating-point (IEEE 754)
- **Acceptance**: Spec allows precision limitations
- **Mitigation**: Format to 10 decimal places to avoid extreme precision errors

### Empty Input
- **Detection**: Zod schema empty string check
- **Behavior**: Prevent calculation, display "Please enter both numbers"
- **Recovery**: Prompt user to enter values

---

## Relationships

```
CalculatorState
  ├── contains → Operation (0 or 1)
  ├── contains → ErrorType (0 or 1)
  └── produces → CalculationInput (when ready to calculate)

CalculationInput
  ├── validated by → CalculationInputSchema
  └── processed by → calculate() function

CalculationResult
  ├── success → updates CalculatorState.result
  └── error → updates CalculatorState.error
```

---

## TypeScript Type Definitions

See `contracts/types.ts` for full TypeScript definitions of all entities, schemas, and function signatures.

All types are exported from a central location to ensure consistency across components and tests.

---

## Summary

The data model is intentionally simple:
- **Single state object** (CalculatorState) captures all runtime state
- **Enumerations** (Operation, ErrorType) ensure type safety
- **Validation schemas** (Zod) enforce invariants at runtime
- **Pure functions** for all business logic (testable, predictable)
- **No persistence** (client-side ephemeral state only)

This design supports the constitution's principles of clarity, modularity, and testability while keeping complexity minimal.
