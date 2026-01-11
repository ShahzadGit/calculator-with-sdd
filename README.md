# Arithmetic Calculator

This poject is mainly focused on Arithmentic Calculator **_BUT_** it was followed to Test the Skills that were made for Panaversity's Assignment.

## 📖 About SKILLs Collection

These skills were created and refined through hands-on Next.js development with Claude on the web. Each skill emerged from real project needs, capturing best practices, common patterns, and solutions to recurring challenges. They represent distilled wisdom from building actual applications—not theoretical exercises.

**The Philosophy:** Every skill is battle-tested, production-ready, and designed to eliminate repetitive work while ensuring quality, security, and accessibility are never compromised.

## 🎯 Skills Overview

### 1. **nextjs-component-generator** ⭐⭐⭐⭐⭐

**Generate production-ready UI components with framework-perfect patterns**

**Description:**
Creates Next.js components that work immediately in real projects with zero framework errors. Handles App Router compatibility, proper use of `next/link` and `next/image`, client/server component boundaries, TypeScript types, and Tailwind styling.

### 2. **nextjs-api-generator** ⭐⭐⭐⭐⭐

**Build secure, type-safe API routes and server actions with production patterns**

**Description:**
Generates complete API endpoints and server actions with validation, error handling, authentication, rate limiting, logging, and security best practices. Handles everything from simple CRUD to complex webhooks and file uploads.

### 3. **nextjs-form-builder** ⭐⭐⭐⭐⭐

**Create accessible, validated forms with excellent UX**

**Description:**
Generates complete form solutions with Zod validation, React Hook Form integration, server actions, accessibility (WCAG 2.1 AA), loading states, and progressive enhancement. Covers simple forms to complex multi-step wizards.

### 4. **nextjs-layout-builder** ⭐⭐⭐⭐⭐

**Rapid page structure creation with SEO and responsive design**

**Description:**
Generates production-ready layouts and page structures including app shells, dashboards, landing pages, authentication layouts, and blog layouts. All layouts include proper metadata, responsive design, and semantic HTML.

### 5. **code-review-and-improve** ⭐⭐⭐⭐⭐

**Systematic quality assurance for Next.js code**

**Description:**
Reviews and improves Next.js code with focus on readability, correctness, framework best practices, accessibility, and catching silent problems. Makes minimal changes while preserving existing behavior.

## Features of the Project and Skill Usage

- **Six Arithmetic Operations**: +, −, ×, ÷, ^, %
- **Dual Input Methods**: On-screen buttons and keyboard input
- **Comprehensive Error Handling**: Division by zero, invalid inputs, edge cases
- **Responsive Design**: Works on mobile (320px) to desktop (2560px+)
- **Clean UI**: Dark theme with TailwindCSS

## Tech Stack

- **Framework**: Next.js 15.3.6 with App Router
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: TailwindCSS 3.4+
- **Validation**: Zod
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint, Prettier

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:ci
```

### Type Checking

```bash
npm run type-check
```

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Business logic (operations, validation, formatting)
├── hooks/                  # Custom React hooks
tests/
├── unit/                   # Unit tests for pure functions
├── integration/            # Integration tests for components
└── contract/               # Contract tests for types
```

## Documentation

- **Spec**: [specs/001-arithmetic-calculator/spec.md](./specs/001-arithmetic-calculator/spec.md)
- **Plan**: [specs/001-arithmetic-calculator/plan.md](./specs/001-arithmetic-calculator/plan.md)
- **Tasks**: [specs/001-arithmetic-calculator/tasks.md](./specs/001-arithmetic-calculator/tasks.md)

## Development Status

**Completed Phases:**

- ✅ Phase 1: Project Setup (T001-T010)
- ✅ Phase 2: Foundational Types (T011-T019)
- ✅ Phase 3: User Story 1 - Basic Operations (T020-T040)
- ✅ Phase 4: User Story 2 - Advanced Operations (T041-T048)
- ✅ Phase 5: User Story 3 - Error Prevention and Handling (T049-T067)
- ✅ Phase 6: User Story 4 - Input Flexibility (T068-T078)
- ✅ Phase 7: User Story 5 - Result Management (T079-T087)
- ✅ Phase 8: Polish & Cross-Cutting Concerns (T088-T105)

**Test Coverage:**

- 154 tests passing (66 unit + 86 integration + 2 contract)
- 91.07% code coverage (exceeds 80% requirement)
- All 6 arithmetic operations fully implemented and tested
- Comprehensive error handling for division by zero, invalid inputs, and edge cases
- Full keyboard input support with all operations mapped to keyboard keys
- Clear/reset functionality via button click and Escape key

## Skills Used

This project was built using specialized Claude Code skills for Next.js development:

- **code-review-and-improve**: Systematic code review focusing on accessibility, React/Next.js best practices, and code quality improvements

**Improvements from code review (Phase 8 - Polish):**

- **Semantic HTML**: Replaced `<input>` with `<output>` element in Display component for proper semantic markup
- **Accessibility**: Added `role="region"` and `aria-label` to main calculator container for better screen reader navigation
- **Performance**: Moved constant arrays and strings outside components to avoid unnecessary re-creation on every render
  - Extracted `operations` array in OperationButtons component
  - Extracted `numbers` and `buttonClasses` constants in Keypad component
- **Earlier improvements**: Comprehensive aria-labels, aria-live regions, aria-pressed states, and semantic HTML throughout all components

- **nextjs-component-generator**: Generate production-ready, drop-in Next.js components with App Router compatibility, proper framework usage

- **nextjs-layout-builder**: Generate production-ready Next.js layouts and page structures including app shells, dashboards, landing pages

## License

Private project
