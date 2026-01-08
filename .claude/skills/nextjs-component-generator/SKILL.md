---
name: nextjs-component-generator
description: Generate production-ready, drop-in Next.js components with App Router compatibility, proper framework usage (next/link, next/image), Tailwind CSS styling, TypeScript support, and accessibility standards. Use this skill when creating, generating, building, or refactoring components, sections, pages, or layouts for Next.js applications. Outputs code that compiles without errors, requires minimal follow-up fixes, and can be immediately pasted into real projects.
---

# Next.js Component Generator

Generate production-ready Next.js components that work immediately in real projects with zero framework errors and minimal follow-up fixes.

## Core Requirements

### 1. Framework Correctness

**Required Next.js patterns:**

- Use Next.js App Router compatible code
- Use `<Link>` from `next/link` for all internal navigation (never `<a>` tags for internal routes)
- Use `<Image>` from `next/image` for images, or clearly comment where it should be used
- Mark client components with `'use client'` directive only when needed (interactivity, hooks, browser APIs)
- Mark server components with `'use server'` only for server actions
- Avoid browser-only APIs (window, document, localStorage) unless component is explicitly client-side

**Example:**

```tsx
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Image src="/logo.png" alt="Logo" width={100} height={50} />
    </nav>
  );
}
```

**Component Type Decision Tree:**

- Default to Server Components (no directive needed)
- Add `'use client'` ONLY when component uses:
  - React hooks (useState, useEffect, useContext, etc.)
  - Browser APIs (window, document, localStorage, etc.)
  - Event handlers (onClick, onChange, onSubmit, etc.)
  - Third-party libraries that require client-side
- Add `'use server'` ONLY for server actions (form actions, data mutations)

**Anti-pattern to avoid:**

```tsx
// ❌ Don't do this
'use client'
export default function StaticCard() {
  return No interactivity here
}

// ✅ Do this (no directive = server component)
export default function StaticCard() {
  return No interactivity here
}
```

**Image usage:**

- Use `<Image>` from `next/image` with required props: `src`, `alt`, `width`, `height`
- For dynamic sizing, use `fill` prop with parent `position: relative`:

```tsx
<div className="relative w-full h-64">
  <Image src="/hero.jpg" alt="Hero" fill className="object-cover" />
</div>
```

- For external images, configure domains in `next.config.js` (mention in comment if needed)
- Use `priority` prop for above-the-fold images

### 2. JSX Safety & Lint Cleanliness

**Critical rules:**

- Escape apostrophes in JSX text using `&apos;`, `&#39;`, or extract to variables
  - Wrong: `<p>Don't do this</p>`
  - Right: `<p>Don&apos;t do this</p>` or `<p>{text}</p>`
- Close all JSX tags properly (self-closing for void elements: `<input />`, `<img />`)
- No invalid HTML nesting (e.g., `<p>` inside `<p>`, block elements inside inline elements)
- Avoid hydration-unsafe patterns (mismatched server/client rendering)
- Use fragments (`<>...</>`) when returning multiple elements

### 3. Styling Rules

**Tailwind CSS only:**

- Use Tailwind utility classes exclusively
- No inline styles unless explicitly requested or required for dynamic values
- No `<style>` tags or external CSS imports
- Keep class lists readable (group related utilities: layout → spacing → colors → typography)

**Example class organization:**

```tsx
<div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
```

**Tailwind class organization (left to right):**

1. Layout (flex, grid, block)
2. Positioning (relative, absolute, fixed)
3. Size (w-_, h-_)
4. Spacing (p-_, m-_, gap-\*)
5. Typography (text-_, font-_)
6. Colors (bg-_, text-_, border-\*)
7. Effects (shadow-_, rounded-_, hover:_, focus:_)

**Example:**

```tsx
<div className="flex flex-col items-center relative w-full max-w-4xl mx-auto p-6 text-lg font-medium text-gray-900 bg-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
```

### 4. TypeScript & Structure

**Code standards:**

- Use React functional components (no class components)
- Prefer TypeScript `.tsx` syntax
- Define prop interfaces when components accept props
- Clean, minimal imports (remove unused imports)
- No unused variables or placeholder logic (no `// TODO` or `console.log` unless requested)
- Use descriptive component and variable names

**Example:**

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({
  label,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded font-medium";
  const variantClasses =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {label}
    </button>
  );
}
```

### 5. Accessibility Baseline

**Required accessibility features:**

- Use semantic HTML (`nav`, `section`, `header`, `main`, `footer`, `article`, `aside`)
- Provide `aria-label` for interactive elements without visible text
- Include `alt` text for all images (descriptive, not redundant)
- Ensure keyboard navigability (proper tab order, interactive elements are focusable)
- Provide visible focus states using Tailwind utilities (`focus:ring`, `focus:outline`)
- Use proper heading hierarchy (h1 → h2 → h3, don't skip levels)

**Example:**

```tsx
<button
  aria-label="Close menu"
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <svg>...</svg>
</button>
```

### 6. Data Patterns

**Server Components (default for data fetching):**

```tsx
// Fetch directly in server component
export default async function PostsPage() {
  const posts = await fetch("https://api.example.com/posts").then((r) =>
    r.json()
  );

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
}
```

**Client Components (only when needed):**

```tsx
"use client";
import { useState, useEffect } from "react";

export default function LiveUpdates() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Client-side fetching only when server fetch isn't suitable
  }, []);
}
```

**Avoid:** Using `useEffect` for initial data that could be fetched server-side

### 7. Form Component with Server Action

```tsx
export default function ContactForm() {
  async function handleSubmit(formData: FormData) {
    "use server";
    const name = formData.get("name");
    // Process form data
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        required
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
```

## Constraints

**Do NOT:**

- Redesign existing UI unless explicitly asked
- Change unrelated parts of previously working code
- Introduce global styles or modify `globals.css`
- Add animations, transitions, or micro-interactions unless requested
- Replace Next.js components with plain HTML equivalents
- Add comments explaining basic React/Next.js concepts (assume competence)
- Include mock data unless requested (use props instead)

## Assumptions

Unless stated otherwise, assume:

- Project uses Next.js 13+ with App Router
- Tailwind CSS is configured and available
- TypeScript is enabled
- Generated code will be copied into a real project (not just for demonstration)

**If assumptions are incorrect or unclear:** Ask ONE clarifying question before generating code.(e.g., 'Should this be a client or server component?' or 'Will this receive data as props or fetch it?')

## Success Criteria

A successful component:

- ✅ Compiles without errors in a real Next.js project
- ✅ Does not cause full-page refreshes on navigation
- ✅ Passes basic ESLint and JSX validation
- ✅ Can be pasted and used immediately with zero or one minor edit (like updating import paths)
- ✅ Follows all framework conventions (no anti-patterns)
- ✅ No hydration warnings in browser console
- ✅ Proper TypeScript types (no `any` types)
- ✅ Responsive on mobile, tablet, and desktop

## Example Workflows

**Request:** "Create a responsive navigation bar"

**Output:**

- TypeScript functional component
- Uses `next/link` for navigation
- Styled with Tailwind (responsive with mobile menu)
- Includes accessibility (aria-labels, semantic HTML)
- Client component marker if interactive (mobile menu toggle)

**Request:** "Build a hero section with a call-to-action"

**Output:**

- Server component (no interactivity)
- Semantic HTML (`<section>`, `<h1>`)
- Tailwind styling (responsive, centered layout)
- `next/link` for CTA button
- Clean prop interface if customizable

## Common Patterns

### Page Component

```tsx
export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-gray-600">...</p>
    </main>
  );
}
```

### Client Component with State

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount(count + 1)}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Count: {count}
    </button>
  );
}
```

### Layout Component

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>...</header>
      <main className="flex-1">{children}</main>
      <footer>...</footer>
    </div>
  );
}
```

## Common Pitfalls to Avoid

### Hydration Mismatches

```tsx
// ❌ Wrong: Server renders differently than client
export default function TimeStamp() {
  return <p>Current time: {new Date().toISOString()}</p>;
}

// ✅ Right: Use client component for dynamic content
("use client");
import { useState, useEffect } from "react";

export default function TimeStamp() {
  const [time, setTime] = useState("");
  useEffect(() => setTime(new Date().toISOString()), []);
  return <p>Current time: {time}</p>;
}
```

### Missing Keys in Lists

```tsx
// ❌ Wrong
{
  items.map((item) => <div>{item.name}</div>);
}

// ✅ Right
{
  items.map((item) => <div key={item.id}>{item.name}</div>);
}
```

### Incorrect Link Usage

```tsx
// ❌ Wrong: External link with next/link
<Link href="https://google.com">Google</Link>

// ✅ Right: Use anchor for external
<a href="https://google.com" target="_blank" rel="noopener noreferrer">
  Google
</a>
```

## Edge Cases

**When generating components, handle:**

- Empty states (no data)
- Loading states (if client-side data fetching)
- Error boundaries (for critical sections)
- Long text overflow (truncate-_, line-clamp-_)

**Example:**

```tsx
{
  items.length === 0 ? (
    <p className="text-gray-500">No items found</p>
  ) : (
    items.map((item) => <ItemCard key={item.id} {...item} />)
  );
}
```
