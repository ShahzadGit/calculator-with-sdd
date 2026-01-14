# Contracts: Calculator UI Enhancements

**Feature**: 002-ui-enhancements
**Date**: 2026-01-12

---

## Overview

This feature does not introduce new APIs, endpoints, or external contracts. All changes are client-side CSS/React enhancements to the existing calculator interface.

The "contract" for this feature is the **visual and accessibility standards** that components must adhere to.

---

## Visual Design Contract

### Color Contrast Standards (WCAG AA)

All text/background combinations must meet these minimum contrast ratios:

| Context | Minimum Ratio | Example |
|---------|---------------|---------|
| Normal text (< 18pt) | 4.5:1 | Display text on background |
| Large text (≥ 18pt) | 3:1 | Button labels |
| Focus indicators | 3:1 | Focus ring on background |
| UI components | 3:1 | Button borders |

**Verification**: Use WebAIM Contrast Checker or automated axe-core testing.

---

## Animation Performance Contract

### Frame Rate Requirements

| Animation Type | Target FPS | Max Duration |
|----------------|------------|--------------|
| Hover transitions | 60fps | 200ms |
| Button press | 60fps | 150ms |
| Result emphasis | 60fps | 300ms |
| Error shake | 60fps | 400ms |

**Verification**: Chrome DevTools Performance profiler (no frames below 16.6ms)

### Reduced Motion Contract

When `prefers-reduced-motion: reduce` is set:
- All animation durations reduced to 0.01ms
- Transforms still applied (instant, no motion)
- Visual states still change (no animation)

---

## Accessibility Contract

### Keyboard Navigation Requirements

| Element Type | Tab Order | Keyboard Actions |
|--------------|-----------|------------------|
| Number buttons | Sequential (7,8,9,4,5,6,1,2,3,0) | Enter/Space activates |
| Operation buttons | After numbers | Enter/Space activates |
| Clear button | After operations | Enter/Space activates |
| Equals button | Last | Enter/Space activates |

**Verification**: Manual keyboard-only testing, automated tabindex checks.

### Screen Reader Contract

| Element | ARIA Attributes | Announced Text |
|---------|----------------|----------------|
| Display | `role="output"`, `aria-live="polite"` | Current value or error |
| Number buttons | `aria-label="Number {N}"` | "Number 5", "Number 0", etc. |
| Operation buttons | `aria-label="{Operation}"`, `aria-pressed` | "Add", "Multiply", etc. + "pressed" |
| Clear button | `aria-label="Clear calculator"` | "Clear calculator" |
| Equals button | `aria-label="Calculate result"` | "Calculate result" |

**Verification**: Manual testing with NVDA/JAWS/VoiceOver, automated axe-core testing.

### Touch Target Contract

| Device Type | Minimum Size | Spacing |
|-------------|--------------|---------|
| Mobile (< 640px) | 44x44px | 8px gap |
| Tablet (640px-1024px) | 48x48px | 12px gap |
| Desktop (> 1024px) | 44x44px | 16px gap |

**Verification**: Visual inspection + automated size checks in tests.

---

## Browser Compatibility Contract

### Required Features

| Feature | Minimum Browser Version |
|---------|------------------------|
| CSS Grid | Chrome 57+, Safari 10.1+, Firefox 52+, Edge 16+ |
| CSS Custom Properties | Chrome 49+, Safari 9.1+, Firefox 31+, Edge 15+ |
| Flexbox | Chrome 29+, Safari 9+, Firefox 28+, Edge 12+ |
| backdrop-filter | Chrome 76+, Safari 9+, Firefox 103+, Edge 79+ (with fallback) |

### Fallback Behavior

| Feature | Fallback |
|---------|----------|
| backdrop-filter unsupported | Solid background (rgba(31, 41, 55, 0.95)) |
| CSS Grid unsupported | ERROR (base calculator already requires Grid) |
| prefers-reduced-motion unsupported | Animations play normally |

---

## Testing Contract

### Test Coverage Requirements

| Test Category | Minimum Coverage | Tools |
|---------------|------------------|-------|
| Accessibility | 100% of new ARIA attributes | jest-axe, manual screen reader testing |
| Animations | 100% of animation behaviors | @testing-library/react, manual FPS checks |
| Visual regression | All 5 components | Jest snapshots |
| Color contrast | 100% of text/background combos | WebAIM Contrast Checker |
| Touch targets | 100% of interactive elements | Manual measurement |

### Success Criteria (from spec.md)

- **SC-001**: All text elements achieve minimum 4.5:1 contrast ratio ✅
- **SC-002**: Calculator scores 95+ on Lighthouse Accessibility audit ✅
- **SC-003**: All animations run at 60fps ✅
- **SC-004**: Users can complete calculation using only keyboard in under 10 seconds ✅
- **SC-007**: Focus indicators visible with 3:1 contrast ratio ✅
- **SC-008**: Calculator functional at 200% zoom ✅
- **SC-011**: Users can distinguish button types without reading labels ✅

---

## Component API Contract (Unchanged)

No changes to component props or interfaces. All enhancements are internal styling:

```typescript
// Components maintain existing APIs
<Calculator />
<Display value={string} error={string|null} operation={Operation|null} />
<Keypad onNumberClick={fn} onDecimalClick={fn} onNegativeClick={fn} />
<OperationButtons onOperationClick={fn} selectedOperation={Operation|null} />
```

---

## Summary

The "contracts" for this feature are primarily **visual and accessibility standards** rather than API contracts. All components maintain their existing interfaces while meeting enhanced UX requirements:

1. **Visual Standards**: WCAG AA contrast, consistent styling patterns
2. **Animation Standards**: 60fps performance, respects reduced motion
3. **Accessibility Standards**: Keyboard navigation, screen reader support, touch targets
4. **Browser Compatibility**: Modern browsers with graceful degradation
5. **Testing Standards**: 100% coverage of accessibility features, automated audits

No external APIs, no new data contracts, no breaking changes to existing component interfaces.
