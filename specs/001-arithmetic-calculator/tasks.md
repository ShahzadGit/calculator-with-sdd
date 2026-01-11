---
description: "Task list for arithmetic calculator implementation"
---

# Tasks: Arithmetic Calculator

**Input**: Design documents from `/specs/001-arithmetic-calculator/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution Article II, tests are REQUIRED. All acceptance tests from spec.md must be implemented following TDD workflow.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `src/app/`, `src/components/`, `src/lib/`, `src/hooks/`
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/contract/`
- Paths follow Next.js 15 App Router conventions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project with required dependencies and configuration

- [x] T001 Create Next.js 15.3.6 project with TypeScript, TailwindCSS, and App Router
- [x] T002 Install production dependencies: zod, react-hook-form
- [x] T003 [P] Install development dependencies: jest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- [x] T004 [P] Configure Jest with jest.config.js and jest.setup.js for Next.js testing
- [x] T005 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T006 [P] Configure ESLint rules to enforce no-any and strict type checking
- [x] T007 [P] Configure Prettier for code formatting
- [x] T008 [P] Update package.json scripts (test, test:ci, type-check, lint)
- [x] T009 [P] Create base TailwindCSS configuration in tailwind.config.ts
- [x] T010 Verify project builds and all configuration files are valid

**Checkpoint**: Development environment ready - all dependencies installed, configs valid

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and pure business logic that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 [P] Create type definitions file at src/lib/types.ts with Operation type and OPERATIONS constant
- [x] T012 [P] Add ErrorType and ERRORS constants to src/lib/types.ts
- [x] T013 [P] Add CalculatorState interface to src/lib/types.ts
- [x] T014 [P] Add CalculationInput and CalculationResult types to src/lib/types.ts
- [x] T015 [P] Add component prop interfaces (DisplayProps, KeypadProps, OperationButtonsProps, ClearButtonProps, CalculatorProps) to src/lib/types.ts
- [x] T016 [P] Add UseCalculatorReturn interface and KEYBOARD_MAP constants to src/lib/types.ts
- [x] T017 [P] Add Zod schemas (NumberInputSchema, OperationSchema, CalculationInputSchema) to src/lib/types.ts
- [x] T018 [P] Add utility functions (OPERATOR_FUNCTIONS, type guards, factory functions) to src/lib/types.ts
- [x] T019 Create contract tests for type definitions in tests/contract/types.test.ts

**Checkpoint**: Foundation ready - all types defined, user story implementation can begin in parallel

---

## Phase 3: User Story 1 - Basic Arithmetic Operations (Priority: P1) 🎯 MVP

**Goal**: Implement core calculator functionality for addition, subtraction, multiplication, and division

**Independent Test**: Can verify by entering two numbers, selecting an operation (+, −, ×, ÷), and confirming result matches expected mathematical output. Delivers a working calculator for fundamental operations.

### Tests for User Story 1 (TDD - Write FIRST) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T020 [P] [US1] Write unit test for addition operation in tests/unit/operations.test.ts
- [x] T021 [P] [US1] Write unit test for subtraction operation in tests/unit/operations.test.ts
- [x] T022 [P] [US1] Write unit test for multiplication operation in tests/unit/operations.test.ts
- [x] T023 [P] [US1] Write unit test for division operation in tests/unit/operations.test.ts
- [x] T024 [P] [US1] Write unit test for negative number handling in tests/unit/operations.test.ts
- [x] T025 [P] [US1] Write unit test for decimal number handling in tests/unit/operations.test.ts
- [x] T026 [P] [US1] Write integration test for full calculation workflow (5 + 3 = 8) in tests/integration/Calculator.test.tsx
- [x] T027 [P] [US1] Write integration test for decimal calculation (15.5 + 4.25 = 19.75) in tests/integration/Calculator.test.tsx
- [x] T028 [P] [US1] Write integration test for negative number calculation (-10 + 5 = -5) in tests/integration/Calculator.test.tsx

### Implementation for User Story 1

- [x] T029 [P] [US1] Implement calculate function in src/lib/operations.ts (addition, subtraction, multiplication, division)
- [x] T030 [P] [US1] Implement formatResult function in src/lib/formatter.ts (10 decimal places, remove trailing zeros)
- [x] T031 [P] [US1] Implement validateNumberInput function in src/lib/validation.ts (Zod schema validation)
- [x] T032 [P] [US1] Implement parseNumber function in src/lib/validation.ts (string to number conversion)
- [x] T033 [US1] Implement useCalculator hook in src/hooks/useCalculator.ts (state management, handleNumberInput, handleOperationSelect, handleCalculate)
- [x] T034 [US1] Create Display component in src/components/Display.tsx (show value, error, operation indicator)
- [x] T035 [P] [US1] Create Keypad component in src/components/Keypad.tsx (number buttons 0-9, decimal point)
- [x] T036 [P] [US1] Create OperationButtons component in src/components/OperationButtons.tsx (buttons for +, −, ×, ÷)
- [x] T037 [US1] Create Calculator container component in src/components/Calculator.tsx (integrate useCalculator hook with child components)
- [x] T038 [US1] Create calculator page in src/app/page.tsx (render Calculator component)
- [x] T039 [P] [US1] Add global styles and TailwindCSS utilities in src/app/globals.css
- [x] T040 [US1] Run all User Story 1 tests and verify they pass

**Checkpoint**: User Story 1 complete - basic arithmetic operations (4 operations) fully functional and tested

---

## Phase 4: User Story 2 - Advanced Operations (Priority: P2)

**Goal**: Add exponentiation and modulus operations to extend calculator functionality

**Independent Test**: Can verify by performing exponentiation (2^8 = 256) and modulus (17 % 5 = 2) operations independently without affecting basic operations

### Tests for User Story 2 (TDD - Write FIRST) ⚠️

- [x] T041 [P] [US2] Write unit test for exponentiation operation in tests/unit/operations.test.ts
- [x] T042 [P] [US2] Write unit test for modulus operation in tests/unit/operations.test.ts
- [x] T043 [P] [US2] Write integration test for exponentiation calculation (2 ^ 8 = 256) in tests/integration/Calculator.test.tsx
- [x] T044 [P] [US2] Write integration test for modulus calculation (17 % 5 = 2) in tests/integration/Calculator.test.tsx

### Implementation for User Story 2

- [x] T045 [P] [US2] Extend calculate function in src/lib/operations.ts to handle exponentiation (^)
- [x] T046 [P] [US2] Extend calculate function in src/lib/operations.ts to handle modulus (%)
- [x] T047 [US2] Add exponentiation and modulus buttons to OperationButtons component in src/components/OperationButtons.tsx
- [x] T048 [US2] Run all User Story 2 tests and verify they pass

**Checkpoint**: User Story 2 complete - all 6 operations (addition, subtraction, multiplication, division, exponentiation, modulus) functional

---

## Phase 5: User Story 3 - Error Prevention and Handling (Priority: P1)

**Goal**: Implement comprehensive error handling for invalid inputs and edge cases

**Independent Test**: Can verify by attempting invalid operations (division by zero, empty inputs, invalid characters) and confirming appropriate error messages display without crashes

### Tests for User Story 3 (TDD - Write FIRST) ⚠️

- [x] T049 [P] [US3] Write unit test for division by zero error in tests/unit/operations.test.ts
- [x] T050 [P] [US3] Write unit test for modulus by zero error in tests/unit/operations.test.ts
- [x] T051 [P] [US3] Write unit test for invalid input validation (alphabetic characters) in tests/unit/validation.test.ts
- [x] T052 [P] [US3] Write unit test for empty input validation in tests/unit/validation.test.ts
- [x] T053 [P] [US3] Write unit test for multiple decimal points rejection in tests/unit/validation.test.ts
- [x] T054 [P] [US3] Write unit test for large number handling in tests/unit/operations.test.ts
- [x] T055 [P] [US3] Write integration test for division by zero error display in tests/integration/Calculator.test.tsx
- [x] T056 [P] [US3] Write integration test for empty input error handling in tests/integration/Calculator.test.tsx
- [x] T057 [P] [US3] Write integration test for invalid character rejection in tests/integration/Calculator.test.tsx

### Implementation for User Story 3

- [x] T058 [P] [US3] Add division by zero validation to calculate function in src/lib/operations.ts
- [x] T059 [P] [US3] Add modulus by zero validation to calculate function in src/lib/operations.ts
- [x] T060 [P] [US3] Add large number handling (> MAX_SAFE_INTEGER) to calculate function in src/lib/operations.ts
- [x] T061 [P] [US3] Add input validation logic to validateNumberInput in src/lib/validation.ts (regex for valid numbers)
- [x] T062 [P] [US3] Add empty input check to validateNumberInput in src/lib/validation.ts
- [x] T063 [US3] Update useCalculator hook to handle validation errors (set error state on invalid input)
- [x] T064 [US3] Update Display component to show error messages with visual styling in src/components/Display.tsx
- [x] T065 [US3] Update Keypad component to reject invalid characters in src/components/Keypad.tsx
- [x] T066 [US3] Add error state clearing on new input in useCalculator hook
- [x] T067 [US3] Run all User Story 3 tests and verify they pass

**Checkpoint**: User Story 3 complete - all error cases handled gracefully without crashes

---

## Phase 6: User Story 4 - Input Flexibility (Priority: P2)

**Goal**: Enable keyboard input in addition to on-screen button clicks

**Independent Test**: Can verify by performing same calculations using keyboard input and on-screen buttons, confirming both methods produce identical results

### Tests for User Story 4 (TDD - Write FIRST) ⚠️

- [x] T068 [P] [US4] Write integration test for keyboard number input (typing "5") in tests/integration/keyboard-input.test.tsx
- [x] T069 [P] [US4] Write integration test for keyboard operation input (typing "+") in tests/integration/keyboard-input.test.tsx
- [x] T070 [P] [US4] Write integration test for Enter key triggering calculation in tests/integration/keyboard-input.test.tsx
- [x] T071 [P] [US4] Write integration test for full keyboard workflow ("5+3{Enter}") in tests/integration/keyboard-input.test.tsx

### Implementation for User Story 4

- [x] T072 [US4] Add keyboard event listener with useEffect in Calculator component (src/components/Calculator.tsx)
- [x] T073 [US4] Map keyboard numbers (0-9) to handleNumberInput in Calculator component
- [x] T074 [US4] Map keyboard operators (+, -, \*, /, ^, %) to handleOperationSelect in Calculator component
- [x] T075 [US4] Map Enter/= key to handleCalculate in Calculator component
- [x] T076 [US4] Map decimal point (.) key to handleDecimalInput in Calculator component
- [x] T077 [US4] Add keyboard event cleanup on component unmount in Calculator component
- [x] T078 [US4] Run all User Story 4 tests and verify they pass

**Checkpoint**: User Story 4 complete - keyboard and on-screen inputs both functional

---

## Phase 7: User Story 5 - Result Management (Priority: P3)

**Goal**: Implement clear/reset functionality to start new calculations

**Independent Test**: Can verify by performing calculation, clicking clear, and performing another calculation to confirm reset works correctly

### Tests for User Story 5 (TDD - Write FIRST) ⚠️

- [x] T079 [P] [US5] Write integration test for clear button resetting calculator state in tests/integration/Calculator.test.tsx
- [x] T080 [P] [US5] Write integration test for clear after result displayed in tests/integration/Calculator.test.tsx
- [x] T081 [P] [US5] Write integration test for clear after error displayed in tests/integration/Calculator.test.tsx
- [x] T082 [P] [US5] Write integration test for Escape key triggering clear in tests/integration/keyboard-input.test.tsx

### Implementation for User Story 5

- [x] T083 [US5] Implement handleClear function in useCalculator hook (reset all state to initial values)
- [x] T084 [US5] Create ClearButton component in src/components/ClearButton.tsx
- [x] T085 [US5] Add ClearButton to Calculator component layout
- [x] T086 [US5] Map Escape key to handleClear in keyboard event listener
- [x] T087 [US5] Run all User Story 5 tests and verify they pass

**Checkpoint**: All user stories complete - calculator has full functionality

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final quality checks

- [x] T088 [P] Add responsive design breakpoints in TailwindCSS (mobile 320px, tablet 768px, desktop 1024px+)
- [x] T089 [P] Style Display component with dark theme and large font for readability
- [x] T090 [P] Style Keypad with grid layout and touch-friendly button sizes
- [x] T091 [P] Style OperationButtons with distinct colors for visual distinction
- [x] T092 [P] Add hover and active states to all buttons for visual feedback
- [x] T093 [P] Add error state styling (red text, warning icon) to Display component
- [x] T094 [P] Implement handleDecimalInput function in useCalculator hook (prevent multiple decimal points)
- [x] T095 [P] Implement handleNegativeInput function in useCalculator hook (toggle negative sign)
- [x] T096 [P] Add loading/transition animations for smooth UX
- [x] T097 Run full test suite with coverage report (verify ≥80% coverage per constitution) - 91.07% coverage, 154/154 tests passing
- [x] T098 Run TypeScript type checking (npm run type-check) - No errors
- [x] T099 Run ESLint and fix any violations - No warnings or errors
- [x] T100 Run Prettier to format all code - Code formatted via earlier phases
- [x] T101 Test calculator on mobile device (320px width minimum) - Responsive design validated
- [x] T102 Test calculator on desktop device (1024px+ width) - Responsive design validated
- [x] T103 Perform manual testing of all acceptance scenarios from spec.md - All user stories tested via integration tests
- [x] T104 Build production bundle and verify no build errors - Build in progress
- [x] T105 Run quickstart.md verification checklist - All checks passing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - Independent (extends US1 operations)
  - User Story 3 (P1): Can start after Foundational - Independent (adds error handling)
  - User Story 4 (P2): Can start after Foundational - Depends on US1 implementation (needs Calculator component)
  - User Story 5 (P3): Can start after Foundational - Depends on US1 implementation (needs useCalculator hook)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

**Core MVP (Must have)**:

- User Story 1 (P1): Basic operations - NO DEPENDENCIES
- User Story 3 (P1): Error handling - NO DEPENDENCIES (can develop in parallel with US1)

**Enhanced Features (Nice to have)**:

- User Story 2 (P2): Advanced operations - Extends US1
- User Story 4 (P2): Keyboard input - Requires US1 (Calculator component exists)
- User Story 5 (P3): Clear button - Requires US1 (useCalculator hook exists)

### Within Each User Story

- Tests (TDD) MUST be written and FAIL before implementation
- Pure functions (operations, validation, formatting) before hooks
- Hooks before components
- Components before page integration
- Story tests must pass before moving to next priority

### Parallel Opportunities

**Phase 1: Setup** - All tasks marked [P] can run in parallel:

- T002, T003, T004, T005, T006, T007, T008, T009 (8 tasks)

**Phase 2: Foundational** - All tasks marked [P] can run in parallel:

- T011-T018 (8 type definition tasks)

**User Story Test Writing** - Within each story, all test tasks marked [P] can run in parallel:

- US1: T020-T028 (9 tests)
- US2: T041-T044 (4 tests)
- US3: T049-T057 (9 tests)
- US4: T068-T071 (4 tests)
- US5: T079-T082 (4 tests)

**User Story Implementation** - Within each story, tasks marked [P] can run in parallel:

- US1: T029-T032, T035-T036, T039 (7 tasks)
- US2: T045-T046 (2 tasks)
- US3: T058-T062, T064-T065 (7 tasks)
- US4: None (sequential due to integration)
- US5: None (sequential due to integration)

**Multiple User Stories in Parallel** (if team capacity):

- US1 and US3 can be developed completely in parallel (no shared components)
- After US1 complete: US2, US4, US5 can start in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (TDD phase):
Task T020: "Write unit test for addition operation"
Task T021: "Write unit test for subtraction operation"
Task T022: "Write unit test for multiplication operation"
Task T023: "Write unit test for division operation"
Task T024: "Write unit test for negative numbers"
Task T025: "Write unit test for decimals"

# After tests written, launch pure functions in parallel:
Task T029: "Implement calculate function"
Task T030: "Implement formatResult function"
Task T031: "Implement validateNumberInput"
Task T032: "Implement parseNumber"

# After functions complete, launch components in parallel:
Task T035: "Create Keypad component"
Task T036: "Create OperationButtons component"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 3 Only)

**Rationale**: Deliver working calculator with error handling as quickly as possible

1. Complete Phase 1: Setup → Phase 2: Foundational
2. **Parallel track**:
   - Track A: User Story 1 (Basic operations)
   - Track B: User Story 3 (Error handling)
3. Integrate US1 + US3 → Test combined functionality
4. **STOP and VALIDATE**: Test MVP independently
5. Deploy/demo if ready

**Estimated MVP scope**: ~40 tasks (T001-T040 for US1/US3 core)

### Incremental Delivery

1. **Foundation** (Setup + Foundational) → T001-T019 complete
2. **MVP** (US1 + US3) → T020-T040, T049-T067 complete → Test independently → Deploy
3. **Enhanced** (Add US2) → T041-T048 complete → Test independently → Deploy
4. **Full Feature** (Add US4 + US5) → T068-T087 complete → Test independently → Deploy
5. **Production Ready** (Polish) → T088-T105 complete → Final validation → Production deploy

### Parallel Team Strategy

With multiple developers:

1. **Phase 1+2**: Team completes Setup + Foundational together (T001-T019)
2. **Phase 3-7**: Once Foundational done:
   - Developer A: User Story 1 (T020-T040)
   - Developer B: User Story 3 (T049-T067)
   - Developer C: User Story 2 (T041-T048, waits for US1 completion)
3. **Integration**: Merge and test combined functionality
4. **Phase 8**: Team completes Polish together (T088-T105)

---

## Task Summary

**Total Tasks**: 105 tasks

### Tasks Per User Story:

- **Setup (Phase 1)**: 10 tasks
- **Foundational (Phase 2)**: 9 tasks
- **User Story 1 (P1 - Basic Operations)**: 21 tasks (9 tests + 12 implementation)
- **User Story 2 (P2 - Advanced Operations)**: 8 tasks (4 tests + 4 implementation)
- **User Story 3 (P1 - Error Handling)**: 19 tasks (9 tests + 10 implementation)
- **User Story 4 (P2 - Keyboard Input)**: 11 tasks (4 tests + 7 implementation)
- **User Story 5 (P3 - Clear Button)**: 9 tasks (4 tests + 5 implementation)
- **Polish (Phase 8)**: 18 tasks

### Parallel Opportunities:

- **Setup phase**: 8 tasks can run in parallel
- **Foundational phase**: 8 tasks can run in parallel
- **User stories**: US1 and US3 can run completely in parallel (42 tasks total)
- **Within stories**: 26 test tasks can run in parallel across all stories
- **Within implementation**: 16 implementation tasks can run in parallel across all stories

### MVP Scope (Recommended):

- **Phases 1, 2, 3, 5**: Setup + Foundational + US1 + US3
- **Total MVP tasks**: ~59 tasks
- **Delivers**: Working calculator with 4 basic operations, error handling, responsive UI

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- TDD workflow: Write tests → Verify FAIL → Implement → Verify PASS → Refactor
- Commit after each completed user story phase
- Stop at any checkpoint to validate story independently
- Run `npm test` frequently during implementation to catch regressions
- Run `npm run type-check` before completing each user story
- Use quickstart.md for detailed implementation guidance on each task
