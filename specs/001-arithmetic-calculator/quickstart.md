# Quickstart Guide: Arithmetic Calculator

**Feature**: 001-arithmetic-calculator
**Date**: 2026-01-09
**Target Audience**: Developers implementing this feature

## Overview

This guide provides step-by-step instructions for implementing the arithmetic calculator feature. Follow the TDD workflow as mandated by the constitution.

---

## Prerequisites

### Required Knowledge
- TypeScript fundamentals
- React 19 features (hooks, components)
- Next.js 15 App Router
- TailwindCSS utility-first styling
- Test-driven development (TDD) workflow

### Required Tools
- Node.js 20+ and npm 10+
- Git (for version control)
- Code editor with TypeScript support (VS Code recommended)

### Environment Setup
Ensure you're on the feature branch:
```bash
git checkout 001-arithmetic-calculator
```

---

## Project Initialization

### 1. Create Next.js Project (if not already exists)

```bash
npx create-next-app@15.3.6 . --typescript --tailwind --app --no-src-dir
```

**Options explained**:
- `--typescript`: Enable TypeScript
- `--tailwind`: Include TailwindCSS
- `--app`: Use App Router (not Pages Router)
- `--no-src-dir`: Use `app/` at root (adjust if using `src/` directory)

### 2. Install Dependencies

```bash
npm install zod react-hook-form
npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 3. Configure Testing

Create `jest.config.js`:
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

Create `jest.setup.js`:
```javascript
import '@testing-library/jest-dom';
```

### 4. Update `package.json` Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest --watch",
    "test:ci": "jest --ci --coverage",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Implementation Workflow (TDD)

### Phase 1: Core Business Logic (Unit Tests)

#### Step 1.1: Implement Arithmetic Operations

**RED** - Write failing test first:

```typescript
// tests/unit/operations.test.ts
import { calculate } from '@/lib/operations';

describe('calculate', () => {
  it('should add two numbers correctly', () => {
    const result = calculate({ firstOperand: 5, secondOperand: 3, operator: '+' });
    expect(result).toEqual({ success: true, value: 8 });
  });

  it('should handle division by zero', () => {
    const result = calculate({ firstOperand: 10, secondOperand: 0, operator: '÷' });
    expect(result).toEqual({ success: false, error: 'Cannot divide by zero' });
  });

  // Add tests for all 6 operations + edge cases
});
```

**Run test** (should fail):
```bash
npm test
```

**GREEN** - Implement minimal code to pass:

```typescript
// src/lib/operations.ts
import type { CalculationInput, CalculationResult } from './types';
import { ERRORS, OPERATOR_FUNCTIONS } from './types';

export const calculate = (input: CalculationInput): CalculationResult => {
  // Validate division/modulus by zero
  if ((input.operator === '÷' || input.operator === '%') && input.secondOperand === 0) {
    return { success: false, error: ERRORS.DIVISION_BY_ZERO };
  }

  // Perform operation
  const operation = OPERATOR_FUNCTIONS[input.operator];
  const value = operation(input.firstOperand, input.secondOperand);

  // Check for invalid results
  if (!Number.isFinite(value)) {
    return { success: false, error: ERRORS.NUMBER_TOO_LARGE };
  }

  return { success: true, value };
};
```

**Run test** (should pass):
```bash
npm test
```

**REFACTOR** - Clean up code if needed

---

#### Step 1.2: Implement Number Formatting

**RED** - Write test:
```typescript
// tests/unit/formatter.test.ts
import { formatResult } from '@/lib/formatter';

describe('formatResult', () => {
  it('should remove trailing zeros', () => {
    expect(formatResult(8.0)).toBe('8');
    expect(formatResult(8.50)).toBe('8.5');
  });

  it('should limit to 10 decimal places', () => {
    expect(formatResult(1 / 3)).toBe('0.3333333333');
  });
});
```

**GREEN** - Implement:
```typescript
// src/lib/formatter.ts
export const formatResult = (value: number): string => {
  return value.toFixed(10).replace(/\.?0+$/, '');
};
```

**Run test** and verify pass.

---

#### Step 1.3: Implement Input Validation

**RED** - Write test:
```typescript
// tests/unit/validation.test.ts
import { validateNumberInput } from '@/lib/validation';

describe('validateNumberInput', () => {
  it('should accept valid numbers', () => {
    expect(validateNumberInput('123').success).toBe(true);
    expect(validateNumberInput('-45.6').success).toBe(true);
  });

  it('should reject invalid input', () => {
    const result = validateNumberInput('abc');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Please enter valid numbers');
  });
});
```

**GREEN** - Implement:
```typescript
// src/lib/validation.ts
import { NumberInputSchema } from './types';

export const validateNumberInput = (input: string) => {
  const result = NumberInputSchema.safeParse(input);
  return result.success
    ? { success: true }
    : { success: false, error: result.error.errors[0].message };
};
```

---

### Phase 2: Calculator State Management

#### Step 2.1: Implement useCalculator Hook

**RED** - Write integration test:
```typescript
// tests/integration/useCalculator.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '@/hooks/useCalculator';

describe('useCalculator', () => {
  it('should perform basic addition', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.handleNumberInput('5');
    });
    expect(result.current.state.currentInput).toBe('5');

    act(() => {
      result.current.handleOperationSelect('+');
    });

    act(() => {
      result.current.handleNumberInput('3');
    });

    act(() => {
      result.current.handleCalculate();
    });

    expect(result.current.state.result).toBe(8);
    expect(result.current.state.displayValue).toBe('8');
  });
});
```

**GREEN** - Implement hook:
```typescript
// src/hooks/useCalculator.ts
import { useState, useCallback } from 'react';
import type { CalculatorState, Operation } from '@/lib/types';
import { calculate } from '@/lib/operations';
import { formatResult } from '@/lib/formatter';
import { validateNumberInput } from '@/lib/validation';

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    currentInput: '',
    previousValue: null,
    operation: null,
    displayValue: '0',
    error: null,
    result: null,
  });

  const handleNumberInput = useCallback((digit: string) => {
    setState(prev => ({
      ...prev,
      currentInput: prev.currentInput + digit,
      displayValue: prev.currentInput + digit,
      error: null,
    }));
  }, []);

  const handleOperationSelect = useCallback((operation: Operation) => {
    setState(prev => {
      const value = parseFloat(prev.currentInput || prev.displayValue);
      return {
        ...prev,
        previousValue: value,
        operation,
        currentInput: '',
      };
    });
  }, []);

  const handleCalculate = useCallback(() => {
    setState(prev => {
      if (!prev.previousValue || !prev.operation || !prev.currentInput) {
        return { ...prev, error: 'Please enter both numbers' };
      }

      const result = calculate({
        firstOperand: prev.previousValue,
        secondOperand: parseFloat(prev.currentInput),
        operator: prev.operation,
      });

      if (!result.success) {
        return { ...prev, error: result.error, displayValue: '' };
      }

      const formatted = formatResult(result.value);
      return {
        currentInput: '',
        previousValue: null,
        operation: null,
        displayValue: formatted,
        error: null,
        result: result.value,
      };
    });
  }, []);

  const handleClear = useCallback(() => {
    setState({
      currentInput: '',
      previousValue: null,
      operation: null,
      displayValue: '0',
      error: null,
      result: null,
    });
  }, []);

  return {
    state,
    handleNumberInput,
    handleOperationSelect,
    handleCalculate,
    handleClear,
    handleDecimalInput: () => {}, // TODO: implement
    handleNegativeInput: () => {}, // TODO: implement
  };
};
```

---

### Phase 3: UI Components

#### Step 3.1: Display Component

**RED** - Write component test:
```typescript
// tests/integration/Display.test.tsx
import { render, screen } from '@testing-library/react';
import { Display } from '@/components/Display';

describe('Display', () => {
  it('should show value when no error', () => {
    render(<Display value="42" error={null} operation={null} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should show error message when error exists', () => {
    render(<Display value="42" error="Cannot divide by zero" operation={null} />);
    expect(screen.getByText('Cannot divide by zero')).toBeInTheDocument();
  });
});
```

**GREEN** - Implement component:
```typescript
// src/components/Display.tsx
import type { DisplayProps } from '@/lib/types';

export const Display = ({ value, error, operation }: DisplayProps) => {
  return (
    <div className="bg-gray-900 text-white p-4 rounded-t-lg">
      <div className="text-sm text-gray-400 h-6">
        {operation && <span>Operation: {operation}</span>}
      </div>
      <div className="text-3xl font-mono text-right">
        {error ? (
          <span className="text-red-400 text-lg">{error}</span>
        ) : (
          <span>{value || '0'}</span>
        )}
      </div>
    </div>
  );
};
```

**Repeat TDD cycle** for:
- Keypad component
- OperationButtons component
- ClearButton component
- Calculator container component

---

### Phase 4: Integration & Keyboard Support

#### Step 4.1: Add Keyboard Event Handler

```typescript
// In Calculator.tsx
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key >= '0' && event.key <= '9') {
      handleNumberInput(event.key);
    } else if (event.key === '+' || event.key === '-') {
      handleOperationSelect(event.key);
    } else if (event.key === '*') {
      handleOperationSelect('×');
    } else if (event.key === '/') {
      event.preventDefault();
      handleOperationSelect('÷');
    } else if (event.key === 'Enter' || event.key === '=') {
      handleCalculate();
    } else if (event.key === 'Escape') {
      handleClear();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [handleNumberInput, handleOperationSelect, handleCalculate, handleClear]);
```

**Test keyboard integration**:
```typescript
// tests/integration/keyboard-input.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from '@/components/Calculator';

describe('Keyboard Input', () => {
  it('should handle keyboard number input', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard('5');
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should calculate on Enter key', async () => {
    const user = userEvent.setup();
    render(<Calculator />);

    await user.keyboard('5+3{Enter}');
    expect(screen.getByText('8')).toBeInTheDocument();
  });
});
```

---

## Verification Checklist

Before considering implementation complete, verify:

### Functional Requirements
- [ ] All 6 operations work correctly (FR-001 through FR-006)
- [ ] Decimal numbers supported (FR-007)
- [ ] Negative numbers supported (FR-008)
- [ ] Results formatted correctly (FR-009, FR-010)
- [ ] On-screen buttons functional (FR-011, FR-012)
- [ ] Keyboard input functional (FR-013)
- [ ] Display shows input, operation, result clearly (FR-014, FR-015, FR-016)
- [ ] Clear button works (FR-017)
- [ ] Immediate calculation (FR-018)
- [ ] All error cases handled (FR-019 through FR-024)
- [ ] Responsive design (FR-026, FR-027)
- [ ] Visual feedback for errors (FR-028)

### Success Criteria
- [ ] Calculation completes in <5 seconds (SC-001)
- [ ] All operations mathematically correct (SC-002)
- [ ] All edge cases pass without crashes (SC-003)
- [ ] Error messages display within 100ms (SC-004)
- [ ] Works on 320px-2560px screens (SC-005)
- [ ] Response time <100ms (SC-007)
- [ ] Zero crashes (SC-008)

### Test Coverage
- [ ] Unit tests for all pure functions
- [ ] Integration tests for component interactions
- [ ] Contract tests for type definitions
- [ ] Coverage ≥80% (per constitution)

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] No `any` types
- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] All components have clear single responsibility

---

## Running the Application

### Development Mode
```bash
npm run dev
```

Visit `http://localhost:3000` and test the calculator.

### Run Tests
```bash
npm test              # Watch mode
npm run test:ci       # CI mode with coverage
```

### Type Check
```bash
npm run type-check
```

### Build for Production
```bash
npm run build
npm start
```

---

## Common Issues & Solutions

### Issue: Tests failing with module resolution errors
**Solution**: Ensure `tsconfig.json` has correct path mappings:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Keyboard events not firing in tests
**Solution**: Use `@testing-library/user-event` instead of `fireEvent`:
```typescript
import userEvent from '@testing-library/user-event';
const user = userEvent.setup();
await user.keyboard('5');
```

### Issue: Coverage below 80%
**Solution**: Add tests for edge cases and error paths. Use `npm run test:ci -- --coverage` to see uncovered lines.

---

## Next Steps

After implementation is complete and all tests pass:

1. **Run `/sp.tasks`** to generate task breakdown
2. **Create ADRs** for significant decisions (state management, validation strategy)
3. **Commit changes** with descriptive message
4. **Create pull request** linking to this spec

---

## Reference Links

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Type Contracts**: [contracts/types.ts](./contracts/types.ts)
- **Research**: [research.md](./research.md)

---

**Questions?** Refer to the feature spec for requirements clarification or the research document for technical decision rationale.
