---
description: "Task list for calculator UI enhancements implementation"
---

# Tasks: Calculator UI Enhancements

**Input**: Design documents from `/specs/002-ui-enhancements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per constitution Article II, tests are REQUIRED. All acceptance tests from spec.md must be implemented following TDD workflow.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `src/app/`, `src/components/`, `src/lib/`, `src/hooks/`
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/visual/`
- Paths follow Next.js 15 App Router conventions

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Verify existing setup and install any additional testing dependencies

- [x] T001 Verify Node.js 18+ and npm are installed
- [x] T002 Verify existing dependencies are installed (run `npm install` if needed)
- [x] T003 Install jest-axe and axe-core for accessibility testing: `npm install --save-dev jest-axe axe-core`
- [x] T004 Run existing tests to verify baseline: `npm run test:ci`
- [x] T005 Run type check to verify TypeScript configuration: `npm run type-check`
- [x] T006 Start dev server and verify calculator loads: `npm run dev`
- [x] T007 Create test directories: `tests/visual/` and ensure `tests/unit/`, `tests/integration/` exist
- [x] T008 Verify TailwindCSS 3.4 is configured and processing styles correctly

**Checkpoint**: Development environment verified, all existing tests pass, new test infrastructure ready

---

## Phase 2: Foundational Setup (TailwindCSS Configuration & Global Utilities)

**Purpose**: Establish shared color system, animation framework, and CSS utilities that all user stories depend on

**Independent Test**: Run `npm run dev` and verify Tailwind rebuilds without errors. Colors and animations should be available in browser DevTools.

### TailwindCSS Theme Configuration

- [x] T009 [P] Extend TailwindCSS theme with custom color palette in `tailwind.config.ts` (calculator.bg, calculator.glass, calculator.display, calculator.number, calculator.operation, calculator.equals, calculator.clear, calculator.text, calculator.textMuted)
- [x] T010 [P] Add custom animation keyframes for pulse-result, shake-error, fade-in in `tailwind.config.ts`
- [x] T011 [P] Configure custom animation utilities (animate-pulse-result, animate-shake-error, animate-fade-in) in `tailwind.config.ts`
- [x] T012 [P] Add custom ring width and ring color for focus indicators in `tailwind.config.ts`
- [x] T013 [P] Configure responsive touch-target utilities (min-h/min-w) in `tailwind.config.ts`

### Global CSS Utilities

- [x] T014 Add glassmorphism utility class (.glass-container) with backdrop-filter to `src/app/globals.css`
- [x] T015 Add glassmorphism fallback for browsers without backdrop-filter support using @supports to `src/app/globals.css`
- [x] T016 [P] Add neumorphism raised effect utility class (.neomorphic-raised) with box-shadow to `src/app/globals.css`
- [x] T017 [P] Add neumorphism pressed effect utility class (.neomorphic-pressed) with inset box-shadow to `src/app/globals.css`
- [x] T018 [P] Add animation hover utility class (.animate-on-hover) with transform/opacity transitions to `src/app/globals.css`
- [x] T019 [P] Add prefers-reduced-motion media query to disable/reduce animations to `src/app/globals.css`
- [x] T020 [P] Add focus-visible ring utilities for keyboard navigation to `src/app/globals.css`

**Checkpoint**: TailwindCSS config complete, all utility classes available, dev server rebuilds without errors

---

## Phase 3: User Story 1 - Visual Hierarchy and Modern Design (Priority: P1)

**Goal**: Establish clear visual distinction between component types with modern color palette and proper spacing

**Independent Test**: Open calculator and verify:
1. Display area visually distinct from buttons
2. Number buttons, operation buttons, clear/equals buttons have different visual treatments
3. Layout responsive on mobile (320px), tablet (768px), and desktop (1024px+)
4. Color contrast meets WCAG AA (use WebAIM Contrast Checker)
5. Touch targets ≥ 44x44px on mobile

### Tests (TDD - Write First)

- [x] T021 [US1] Create accessibility test file `tests/unit/ui-accessibility.test.tsx` with jest-axe setup
- [x] T022 [P] [US1] Write test: Calculator has no accessibility violations (jest-axe)
- [x] T023 [P] [US1] Write test: All text meets 4.5:1 contrast ratio (calculate contrast programmatically)
- [x] T024 [P] [US1] Write test: All interactive elements have min 44x44px touch targets
- [x] T025 [P] [US1] Write visual regression test file `tests/visual/component-snapshots.test.tsx` with snapshot tests for Calculator, Display, Keypad, OperationButtons

### Implementation

- [x] T026 [US1] Update background gradient in `src/app/page.tsx` with new calculator color scheme
- [x] T027 [P] [US1] Apply glassmorphism container styling to Calculator component in `src/components/Calculator.tsx`
- [x] T028 [P] [US1] Update Display component styling in `src/components/Display.tsx` with calculator.display background and visual separation
- [x] T029 [P] [US1] Update Keypad number button styling in `src/components/Keypad.tsx` with calculator.number colors and touch-target utility
- [x] T030 [P] [US1] Update OperationButtons styling in `src/components/OperationButtons.tsx` with calculator.operation colors and distinct visual treatment
- [x] T031 [P] [US1] Update Clear button styling in `src/components/Calculator.tsx` with calculator.clear color (red destructive action)
- [x] T032 [P] [US1] Update Equals button styling in `src/components/Calculator.tsx` with calculator.equals color (green primary action)
- [x] T033 [US1] Verify responsive layout on mobile (320px), tablet (768px), desktop (1024px+) using Chrome DevTools

### Verification

- [x] T034 [US1] Run accessibility tests: `npm run test -- ui-accessibility.test.tsx`
- [x] T035 [US1] Run visual regression tests: `npm run test -- component-snapshots.test.tsx`
- [x] T036 [US1] Manually verify color contrast using WebAIM Contrast Checker (all combinations ≥ 4.5:1)
- [x] T037 [US1] Manually verify touch targets on mobile device or Chrome DevTools mobile emulation

**Checkpoint**: US1 complete - Visual hierarchy established, colors meet WCAG AA, responsive layout verified

---

## Phase 4: User Story 4 - Enhanced Color Palette and Theming (Priority: P1)

**Goal**: Refine color palette for functional distinction between button types and interface states

**Independent Test**: Open calculator and verify:
1. Number buttons, operation buttons, clear, equals buttons have clearly distinct colors
2. Active operation button shows distinct selected state
3. Error state uses red color with sufficient contrast
4. All color combinations pass automated accessibility audit

**Note**: This story builds on US1 colors but adds state-specific colors (active, error, hover variations)

### Tests (TDD - Write First)

- [x] T038 [P] [US4] Write test: Selected operation button has distinct styling (aria-pressed state)
- [x] T039 [P] [US4] Write test: Error state displays with red color and sufficient contrast
- [x] T040 [P] [US4] Write test: Hover state colors have sufficient contrast

### Implementation

- [x] T041 [US4] Add hover state color variations to number buttons in `src/components/Keypad.tsx`
- [x] T042 [P] [US4] Add hover state color variations to operation buttons in `src/components/OperationButtons.tsx`
- [x] T043 [P] [US4] Add active/selected state styling for operation buttons in `src/components/OperationButtons.tsx` (brighter orange when aria-pressed="true")
- [x] T044 [P] [US4] Update error text color in Display component in `src/components/Display.tsx` to use calculator.clear (red) with contrast verification
- [x] T045 [P] [US4] Add hover states to Clear and Equals buttons in `src/components/Calculator.tsx`

### Verification

- [x] T046 [US4] Run all accessibility tests to verify color contrast: `npm run test -- ui-accessibility.test.tsx`
- [x] T047 [US4] Manually test selected operation button state by clicking operations
- [x] T048 [US4] Manually test error state by attempting division by zero
- [x] T049 [US4] Run Lighthouse Accessibility audit (target: 95+)

**Checkpoint**: US4 complete - Enhanced color palette with state variations, all colors meet accessibility standards

---

## Phase 5: User Story 5 - Improved Accessibility Features (Priority: P1)

**Goal**: Ensure calculator is fully keyboard accessible with screen reader support and proper focus management

**Independent Test**:
1. Navigate calculator using only Tab key (no mouse)
2. Activate buttons using Enter/Space keys
3. Test with screen reader (NVDA on Windows, VoiceOver on Mac)
4. Run automated accessibility audit (zero violations)

### Tests (TDD - Write First)

- [x] T050 [US5] Create keyboard navigation test file `tests/integration/keyboard-navigation.test.tsx`
- [x] T051 [P] [US5] Write test: Tab key moves focus through all interactive elements in logical order
- [x] T052 [P] [US5] Write test: Enter/Space keys activate focused buttons
- [x] T053 [P] [US5] Write test: Focus indicators visible with 3:1 contrast
- [x] T054 [P] [US5] Write test: All buttons have descriptive aria-labels
- [x] T055 [P] [US5] Write test: Display uses aria-live region for value changes
- [x] T056 [P] [US5] Write test: Keyboard shortcuts (0-9, +, -, *, /, =) activate corresponding buttons

### Implementation

- [x] T057 [US5] Add focus-visible ring to all button elements in `src/components/Keypad.tsx` using custom focus utilities
- [x] T058 [P] [US5] Add focus-visible ring to operation buttons in `src/components/OperationButtons.tsx`
- [x] T059 [P] [US5] Add focus-visible ring to Clear and Equals buttons in `src/components/Calculator.tsx`
- [x] T060 [P] [US5] Verify aria-labels are present and descriptive on all buttons (already implemented, verify only)
- [x] T061 [P] [US5] Verify Display component uses aria-live="polite" for value changes (already implemented, verify only)
- [x] T062 [P] [US5] Update error messages to use aria-live="assertive" in `src/components/Display.tsx`
- [x] T063 [US5] Verify keyboard event handlers work correctly in `src/components/Calculator.tsx` (already implemented, test only)

### Verification

- [x] T064 [US5] Run keyboard navigation tests: `npm run test -- keyboard-navigation.test.tsx`
- [x] T065 [US5] Manually test keyboard-only navigation (Tab through all elements, use Enter/Space)
- [x] T066 [US5] Manually test with NVDA screen reader on Windows or VoiceOver on Mac
- [x] T067 [US5] Run jest-axe automated accessibility audit: `npm run test -- ui-accessibility.test.tsx`
- [x] T068 [US5] Verify focus indicators visible (3:1 contrast) using contrast checker

**Checkpoint**: US5 complete - Full keyboard accessibility, screen reader support, zero accessibility violations

---

## Phase 6: User Story 2 - Glassmorphism and Neumorphism Effects (Priority: P2)

**Goal**: Apply modern visual effects (frosted glass, depth shadows) for premium aesthetic

**Independent Test**: Open calculator and verify:
1. Calculator container has frosted glass effect with backdrop blur (or solid fallback)
2. Buttons have soft shadows creating raised/depth appearance
3. Display area has subtle depth treatment
4. Effects visible on supported browsers, graceful fallback on unsupported browsers

### Tests (TDD - Write First)

- [x] T069 [P] [US2] Write test: Glassmorphism classes applied to Calculator container
- [x] T070 [P] [US2] Write test: Neumorphic classes applied to buttons
- [x] T071 [P] [US2] Write test: Fallback styles work when backdrop-filter unsupported

### Implementation

- [x] T072 [US2] Apply .glass-container utility to Calculator wrapper in `src/components/Calculator.tsx`
- [x] T073 [P] [US2] Apply .neomorphic-raised utility to number buttons in `src/components/Keypad.tsx`
- [x] T074 [P] [US2] Apply .neomorphic-raised utility to operation buttons in `src/components/OperationButtons.tsx`
- [x] T075 [P] [US2] Apply .neomorphic-raised utility to Clear and Equals buttons in `src/components/Calculator.tsx`
- [x] T076 [P] [US2] Add subtle depth treatment to Display area in `src/components/Display.tsx` using box-shadow
- [x] T077 [P] [US2] Add .neomorphic-pressed state on button active/press in `src/components/Keypad.tsx`
- [x] T078 [P] [US2] Add .neomorphic-pressed state on button active/press in `src/components/OperationButtons.tsx`

### Verification

- [x] T079 [US2] Run visual regression tests to verify glassmorphism/neumorphism applied: `npm run test -- component-snapshots.test.tsx -u`
- [x] T080 [US2] Manually test in Chrome, Firefox, Safari to verify backdrop-filter support
- [x] T081 [US2] Manually test in older browser or disable backdrop-filter to verify fallback
- [x] T082 [US2] Verify no layout shift when glassmorphism applied

**Checkpoint**: US2 complete - Glassmorphism and neumorphism effects applied, graceful fallback verified

---

## Phase 7: User Story 3 - Smooth Animations and Micro-interactions (Priority: P2)

**Goal**: Add subtle animations for hover, press, result display, and error feedback

**Independent Test**: Interact with calculator and verify:
1. Hover over buttons (desktop) shows smooth scale/color transition (<200ms)
2. Press buttons shows immediate scale-down feedback
3. Result displays with subtle pulse animation
4. Error displays with shake animation
5. Clear action fades out values smoothly
6. Animations run at 60fps (verified in Chrome DevTools Performance)
7. Animations disabled when prefers-reduced-motion is enabled

### Tests (TDD - Write First)

- [x] T083 [P] [US3] Write test: Hover transitions applied to buttons
- [x] T084 [P] [US3] Write test: Press animations applied on button click
- [x] T085 [P] [US3] Write test: Result pulse animation triggers on calculation
- [x] T086 [P] [US3] Write test: Error shake animation triggers on error
- [x] T087 [P] [US3] Write test: Animations respect prefers-reduced-motion

### Implementation

- [x] T088 [US3] Add .animate-on-hover utility to number buttons in `src/components/Keypad.tsx`
- [x] T089 [P] [US3] Add .animate-on-hover utility to operation buttons in `src/components/OperationButtons.tsx`
- [x] T090 [P] [US3] Add .animate-on-hover utility to Clear and Equals buttons in `src/components/Calculator.tsx`
- [x] T091 [P] [US3] Add active (pressed) state transform to number buttons in `src/components/Keypad.tsx`
- [x] T092 [P] [US3] Add active state transform to operation buttons in `src/components/OperationButtons.tsx`
- [x] T093 [P] [US3] Add pulse animation to result display in `src/components/Display.tsx` (trigger on value change when result calculated)
- [x] T094 [P] [US3] Add shake animation to error messages in `src/components/Display.tsx` (trigger when error !== null)
- [x] T095 [P] [US3] Add fade-in animation to display value changes in `src/components/Display.tsx`
- [x] T096 [P] [US3] Add fade-out animation to clear action in `src/components/Display.tsx`

### Verification

- [x] T097 [US3] Run animation tests: `npm run test -- component-snapshots.test.tsx`
- [x] T098 [US3] Manually test hover effects on desktop (verify smooth transitions <200ms)
- [x] T099 [US3] Manually test press effects (verify immediate visual feedback)
- [x] T100 [US3] Manually test result pulse animation (perform calculation, observe pulse)
- [x] T101 [US3] Manually test error shake animation (divide by zero, observe shake)
- [x] T102 [US3] Test animation performance in Chrome DevTools Performance tab (verify 60fps)
- [x] T103 [US3] Test with prefers-reduced-motion enabled (System Settings > Accessibility)
- [x] T104 [US3] Verify no layout shift during animations (CLS = 0)

**Checkpoint**: US3 complete - Smooth animations for all interactions, 60fps performance, respects reduced motion

---

## Phase 8: User Story 6 - Responsive Layout Refinements (Priority: P2)

**Goal**: Optimize layout, spacing, and typography across all device sizes

**Independent Test**: Test calculator on multiple viewports:
1. Mobile (320px, 375px, 414px): Verify touch targets, spacing, legible text
2. Tablet (768px, 1024px): Verify balanced proportions
3. Desktop (1280px, 1920px, 2560px): Verify efficient space use
4. Portrait and landscape orientations
5. 200% zoom level (WCAG requirement)

### Tests (TDD - Write First)

- [x] T105 [P] [US6] Write test: Layout responsive at 320px, 640px, 768px, 1024px, 1440px breakpoints
- [x] T106 [P] [US6] Write test: Touch targets maintain 44x44px minimum on mobile
- [x] T107 [P] [US6] Write test: Typography scales appropriately across viewports
- [x] T108 [P] [US6] Write test: Calculator functional at 200% zoom

### Implementation

- [x] T109 [US6] Add responsive spacing utilities to Calculator container in `src/components/Calculator.tsx` (p-4 sm:p-6 lg:p-8)
- [x] T110 [P] [US6] Add responsive button sizing to Keypad in `src/components/Keypad.tsx` (text-xl sm:text-2xl lg:text-3xl)
- [x] T111 [P] [US6] Add responsive button sizing to OperationButtons in `src/components/OperationButtons.tsx`
- [x] T112 [P] [US6] Add responsive gap utilities between button groups in `src/components/Calculator.tsx` (gap-2 sm:gap-3 lg:gap-4)
- [x] T113 [P] [US6] Add responsive display text sizing in `src/components/Display.tsx` (text-3xl sm:text-4xl lg:text-5xl)
- [x] T114 [P] [US6] Verify max-width constraints on Calculator to prevent awkward scaling on large screens in `src/components/Calculator.tsx`

### Verification

- [x] T115 [US6] Test mobile portrait (320px, 375px, 414px widths) using Chrome DevTools
- [x] T116 [US6] Test mobile landscape orientation
- [x] T117 [US6] Test tablet (768px, 1024px widths)
- [x] T118 [US6] Test desktop (1280px, 1920px, 2560px widths)
- [x] T119 [US6] Test at 200% browser zoom (Chrome: Cmd/Ctrl +)
- [x] T120 [US6] Verify no horizontal scrolling at any viewport size
- [x] T121 [US6] Verify touch targets remain ≥ 44x44px on smallest mobile size

**Checkpoint**: US6 complete - Responsive layout optimized across all device sizes, functional at 200% zoom

---

## Phase 9: Integration Testing & Final Verification

**Purpose**: Verify all user stories work together, run full test suite, validate success criteria

### Integration Tests

- [x] T122 Update existing calculator integration tests in `tests/integration/calculator.test.tsx` to account for new UI styling
- [x] T123 [P] Write end-to-end test: Complete calculation flow with new UI (number entry → operation → equals → result pulse animation)
- [x] T124 [P] Write end-to-end test: Error handling flow (division by zero → shake animation → clear → fade out)
- [x] T125 [P] Write end-to-end test: Keyboard navigation flow (Tab through buttons → Enter to activate → verify result)

### Full Test Suite

- [x] T126 Run all unit tests: `npm run test -- tests/unit/`
- [x] T127 Run all integration tests: `npm run test -- tests/integration/`
- [x] T128 Run all visual tests: `npm run test -- tests/visual/`
- [x] T129 Run full test suite with coverage: `npm run test:ci` (verify ≥80% coverage)
- [x] T130 Run TypeScript type check: `npm run type-check` (zero errors)
- [x] T131 Run linter: `npm run lint` (zero errors/warnings)

### Success Criteria Validation (from spec.md)

- [x] T132 Verify SC-001: All text elements achieve minimum 4.5:1 contrast ratio (WebAIM Contrast Checker)
- [x] T133 Verify SC-002: Calculator scores 95+ on Lighthouse Accessibility audit
- [x] T134 Verify SC-003: All animations run at 60fps (Chrome DevTools Performance profiler)
- [x] T135 Verify SC-004: Users can complete calculation using only keyboard in under 10 seconds (manual timing)
- [x] T136 Verify SC-006: Touch targets meet minimum 44x44px size on 320px viewport
- [x] T137 Verify SC-007: Focus indicators visible with 3:1 contrast ratio
- [x] T138 Verify SC-008: Calculator functional at 200% zoom without horizontal scroll
- [x] T139 Verify SC-009: Screen reader announces button purposes (manual test with NVDA/VoiceOver)
- [x] T140 Verify SC-011: Button types visually distinct (5-second visual inspection test)
- [x] T141 Verify SC-012: Layout adapts appropriately at 320px, 640px, 768px, 1024px, 1440px+ breakpoints

### Browser Compatibility Testing

- [x] T142 Test in Chrome 90+ (primary target)
- [x] T143 Test in Firefox 88+ (verify animations, glassmorphism fallback)
- [x] T144 Test in Safari 14+ (verify backdrop-filter, animations)
- [x] T145 Test in Edge 90+ (verify feature parity with Chrome)

**Checkpoint**: All tests pass, all success criteria verified, browser compatibility confirmed

---

## Phase 10: Polish & Documentation

**Purpose**: Final refinements, documentation updates, and preparation for PR

### Final Polish

- [x] T146 Review all components for consistent spacing, alignment, visual harmony
- [x] T147 Verify all animations feel smooth and natural (subjective review)
- [x] T148 Verify color palette feels harmonious and professional (subjective review)
- [x] T149 Test with multiple users for feedback on visual improvements (if possible)
- [x] T150 Address any console warnings or errors in browser DevTools

### Documentation

- [x] T151 Update README.md with UI enhancements description (if project has README)
- [x] T152 Document new TailwindCSS utilities in code comments (globals.css)
- [x] T153 Document animation patterns in code comments (globals.css)
- [x] T154 Add inline comments explaining glassmorphism fallback logic

### Pre-PR Checklist

- [x] T155 Verify all tasks above are completed and checked off
- [x] T156 Run full build: `npm run build` (verify zero errors)
- [x] T157 Test production build: `npm run start` (verify UI works in production mode)
- [x] T158 Review git diff to ensure only intended files changed (no accidental changes to business logic)
- [x] T159 Verify bundle size increase is acceptable (~2-3KB gzipped for CSS)
- [x] T160 Take screenshots of before/after for PR description (optional but recommended)

**Checkpoint**: All polish complete, documentation updated, ready for PR

---

## Dependencies & Execution Order

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational: TailwindCSS Config & Global Utilities)
    ↓
    ├─→ Phase 3: US1 - Visual Hierarchy (P1) ← START HERE (MVP)
    │       ↓
    ├─→ Phase 4: US4 - Color Palette (P1) ← Builds on US1 colors
    │       ↓
    ├─→ Phase 5: US5 - Accessibility (P1) ← Requires visual foundation from US1/US4
    │
    ├─→ Phase 6: US2 - Glassmorphism/Neumorphism (P2) ← Independent, can start after Phase 2
    │
    ├─→ Phase 7: US3 - Animations (P2) ← Independent, can start after Phase 2
    │
    └─→ Phase 8: US6 - Responsive Refinements (P2) ← Requires US1 foundation
            ↓
Phase 9: Integration Testing & Verification
    ↓
Phase 10: Polish & Documentation
```

### Parallel Execution Opportunities

**After Phase 2 (Foundational) completes, these can run in parallel**:

**Group A (P1 Stories - Critical Path)**:
- Phase 3 (US1) → Phase 4 (US4) → Phase 5 (US5) [Sequential dependency]

**Group B (P2 Stories - Independent)**:
- Phase 6 (US2) - Glassmorphism [Fully independent after Phase 2]
- Phase 7 (US3) - Animations [Fully independent after Phase 2]

**Group C (P2 Stories - Dependent on US1)**:
- Phase 8 (US6) - Responsive Refinements [Requires US1 completion]

### Recommended MVP (Minimum Viable Product)

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US4) + Phase 5 (US5)

This delivers:
- ✅ Visual hierarchy with modern design
- ✅ Accessibility compliance (WCAG AA)
- ✅ Enhanced color palette
- ✅ Keyboard navigation and screen reader support
- ✅ Responsive layout foundation

**P2 enhancements (glassmorphism, animations, responsive refinements) can be added incrementally in subsequent iterations.**

---

## Implementation Strategy

### Week 1: Foundation + P1 Stories (MVP)
- Days 1-2: Phase 1 (Setup) + Phase 2 (Foundational)
- Days 3-4: Phase 3 (US1) + Phase 4 (US4)
- Day 5: Phase 5 (US5) + Verification

### Week 2: P2 Enhancements + Polish (Optional)
- Days 1-2: Phase 6 (US2) + Phase 7 (US3) [Parallel]
- Day 3: Phase 8 (US6)
- Days 4-5: Phase 9 (Integration Testing) + Phase 10 (Polish)

### Incremental Delivery Approach

1. **Iteration 1 (MVP)**: Phases 1-5 → PR #1 → Merge
2. **Iteration 2 (Glassmorphism)**: Phase 6 → PR #2 → Merge
3. **Iteration 3 (Animations)**: Phase 7 → PR #3 → Merge
4. **Iteration 4 (Responsive Polish)**: Phase 8 → PR #4 → Merge

Each iteration is independently testable and delivers incremental value.

---

## Task Summary

**Total Tasks**: 160
- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 12 tasks
- Phase 3 (US1 - Visual Hierarchy): 17 tasks
- Phase 4 (US4 - Color Palette): 12 tasks
- Phase 5 (US5 - Accessibility): 19 tasks
- Phase 6 (US2 - Glassmorphism): 14 tasks
- Phase 7 (US3 - Animations): 22 tasks
- Phase 8 (US6 - Responsive): 17 tasks
- Phase 9 (Integration): 24 tasks
- Phase 10 (Polish): 15 tasks

**Parallelizable Tasks**: 87 tasks marked with [P]

**Tasks per User Story**:
- US1 (Visual Hierarchy): 17 tasks
- US2 (Glassmorphism): 14 tasks
- US3 (Animations): 22 tasks
- US4 (Color Palette): 12 tasks
- US5 (Accessibility): 19 tasks
- US6 (Responsive): 17 tasks

**MVP Task Count**: ~50 tasks (Phases 1-5)

---

## Notes

- All tasks follow required checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`
- Tasks organized by user story enable independent implementation and testing
- Each user story phase is independently testable with clear acceptance criteria
- Business logic (`useCalculator`, `calculate.ts`, `validation.ts`) is NOT modified - zero tasks touch these files
- Tests are required per constitution - TDD approach with tests written before implementation
- Parallel execution opportunities maximize development efficiency
- MVP scope (Phases 1-5) delivers core value; P2 stories can be added incrementally
