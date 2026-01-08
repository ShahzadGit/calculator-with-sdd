---
name: code-review-and-improve
description: "Systematically review and improve React, Next.js, and Tailwind CSS code with focus on readability, correctness, framework best practices, accessibility, and catching silent problems. Use when the user asks to: (1) Review code, (2) Improve or optimize code, (3) Check code for issues, (4) Fix code problems, or (5) Analyze component quality. Applies to Next.js, React, Tailwind, JSX/TSX components of any size for personal projects, client work, code reviews, learning, and refactoring."
---

# Code Review and Improvement

Review and improve code systematically while preserving existing behavior and structure.

## Review Process

Follow this systematic approach:

### 1. Readability Review

- **Variable naming**: Check for unclear or misleading names
- **Component structure**: Identify overly complex nesting or logic
- **Code organization**: Look for opportunities to extract repeated patterns
- **Tailwind classes**: Simplify overly complex class strings

### 2. Correctness Review

- **Logic errors**: Verify conditional logic and edge cases
- **State management**: Check for stale closures, missing dependencies
- **Event handlers**: Ensure proper binding and cleanup
- **Type safety**: Verify TypeScript types are accurate

### 3. Framework Best Practices

**React:**

- Proper hook usage and dependencies
- Avoid unnecessary re-renders
- Correct key props in lists
- Proper conditional rendering

**Next.js:**

- Correct use of `next/link` vs `<a>`
- Proper `next/image` usage with alt text
- Client/server component boundaries
- Metadata and SEO considerations

**Tailwind:**

- Use utility classes over inline styles
- Leverage responsive prefixes correctly (`md:`, `lg:`)
- Use spacing scale consistently (prefer `gap-4` over `gap-[16px]`)
- Group related utilities: positioning, display, sizing, spacing, colors
- Extract to component classes only for exact repetition (3+ times)

### 4. Accessibility Check

- **ARIA labels**: Missing or incorrect labels
- **Keyboard navigation**: Ensure interactive elements are keyboard-accessible
- **Semantic HTML**: Use appropriate tags (`<button>` not `<div onClick>`)
- **Color contrast**: Flag potentially low contrast combinations
- **Focus management**: Proper focus indicators and order

### 5. Silent Problems

Look for issues that don't cause obvious errors:

- **Unused imports**: Remove clutter
- **JSX safety**: Potential XSS via `dangerouslySetInnerHTML`
- **Missing error boundaries**: Components that should handle errors
- **Console errors**: Suppress expected warnings, fix unexpected ones
- **Memory leaks**: Missing cleanup in `useEffect`
- **Missing `loading.tsx`**: Routes without loading states
- **Metadata mistakes**: Forgotten `generateMetadata` for dynamic routes
- **Font optimization**: Using external fonts without `next/font`
- **Route handlers**: Missing proper error responses or validation

### 6. Performance Check

**React:**

- Unnecessary `useMemo`/`useCallback` (premature optimization)
- Large components that should be code-split
- Expensive operations in render

**Next.js:**

- Missing `loading.tsx` or `error.tsx` for route segments
- Client components that should be server components
- Improper `dynamic` import usage

### 7. Next.js Anti-patterns

- Using `useEffect` for data fetching (should use async server components)
- Client-side environment variables starting with `NEXT_PUBLIC_` unnecessarily
- Fetching data in multiple components instead of at layout/page level
- Not using `searchParams` prop for URL query parameters

## Improvement Guidelines

### Make Minimal Changes

- Only fix what's broken or clearly problematic
- Don't redesign unless explicitly requested
- Preserve existing code style and patterns
- Don't refactor working code without good reason

### Preserve Behavior

- Keep the same functionality
- Maintain existing API/props interface
- Don't change component structure unless necessary
- Respect the original architecture

### Respect Conventions

- Follow the codebase's existing patterns
- Use the same naming conventions
- Match the formatting style
- Keep similar complexity levels

### TypeScript Review

- Avoid `any` types (use `unknown` or proper types)
- Prefer `interface` for component props, `type` for unions
- Use proper event types (`React.MouseEvent<HTMLButtonElement>`)
- Leverage type inference instead of explicit typing

## Output Format

### 1. Quick Summary

Start with a 1-2 sentence summary of findings:

```
Found 3 issues: missing ARIA label on button, unused import, and complex Tailwind class that can be simplified.
```

### 2. Changes Made

List changes concisely:

```
- Added aria-label to close button
- Removed unused useState import
- Simplified `flex flex-col items-center justify-center w-full h-full` to `flex-col-center` (if defined) or keep as-is with note
```

### 3. Improved Code

Provide the corrected code without additional commentary.

## What NOT to Do

- Don't add extensive comments unless the logic is truly complex
- Don't refactor for "cleanliness" without clear benefit
- Don't add error handling for impossible edge cases
- Don't suggest major architectural changes unless critical
- Don't add TypeScript types to already typed code
- Don't lecture about best practices—just apply them

## When User Provides Code Without Specific Request

If the user shares code without saying "review this," ask what they want:

- "Would you like me to review this for issues?"
- "Should I suggest improvements, or did you have a specific question?"

Don't assume they want a full review—they may just want an explanation or specific help.
