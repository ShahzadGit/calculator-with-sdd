---
name: nextjs-layout-builder
description: Generate production-ready Next.js layouts and page structures including app shells, dashboards, landing pages, authentication layouts, and blog layouts. Use when creating new pages, setting up navigation, building landing pages, or structuring applications. Outputs layouts with proper Next.js App Router patterns, metadata configuration, responsive design, and semantic HTML that are immediately usable in real projects.
---

# Next.js Layout Builder

Generate complete, production-ready page layouts and structures for Next.js 14+ applications.

## Core Principles

**Generated Layouts:**
- ✅ Next.js App Router compatible (`layout.tsx`, `page.tsx`)
- ✅ Proper metadata configuration (SEO-ready)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Semantic HTML structure
- ✅ Tailwind CSS styling
- ✅ TypeScript types
- ✅ Accessible navigation
- ✅ Server components by default

## Layout Types

### 1. App Shell Layout (Header + Content + Footer)
**Use for:** Marketing sites, blogs, documentation

```tsx
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'My App', template: '%s | My App' },
  description: 'App description',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 bg-white border-b">
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">Logo</a>
            <div className="hidden md:flex gap-6">
              <a href="/features" className="hover:text-gray-900">Features</a>
              <a href="/pricing" className="hover:text-gray-900">Pricing</a>
              <a href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</a>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center">&copy; 2026 My App. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
```

### 2. Dashboard Layout (Sidebar + Content)
**Use for:** Admin panels, SaaS apps, user dashboards

```tsx
// app/dashboard/layout.tsx
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
            <span>📊</span> Overview
          </Link>
          <Link href="/dashboard/users" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
            <span>👥</span> Users
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100">
            <span>⚙️</span> Settings
          </Link>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4">
          <h2 className="text-2xl font-semibold">Page Title</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
```

### 3. Landing Page Structure
**Use for:** Product launches, marketing pages

```tsx
// app/page.tsx
export default function LandingPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Build Something Amazing</h1>
          <p className="text-xl mb-8">The fastest way to ship your project</p>
          <a href="/signup" className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold">
            Get Started Free
          </a>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Fast', desc: 'Lightning fast' },
              { icon: '🔒', title: 'Secure', desc: 'Enterprise-grade' },
              { icon: '📱', title: 'Responsive', desc: 'All devices' },
            ].map((f) => (
              <div key={f.title} className="text-center p-6">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
```

### 4. Auth Layout (Centered Card)
**Use for:** Login, signup, password reset

```tsx
// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Logo</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">{children}</div>
      </div>
    </div>
  )
}
```

### 5. Blog Layout (Sidebar + Content)
**Use for:** Blogs, documentation

```tsx
// app/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 grid lg:grid-cols-4 gap-8">
      <main className="lg:col-span-3">{children}</main>
      <aside>
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2">
            <li><a href="/blog/tech" className="hover:text-gray-900">Technology</a></li>
            <li><a href="/blog/design" className="hover:text-gray-900">Design</a></li>
          </ul>
        </div>
      </aside>
    </div>
  )
}
```

## Metadata Configuration

```tsx
// Static metadata
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description for SEO',
  openGraph: { title: 'Page Title', description: 'Description', images: ['/og.jpg'] },
}

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, images: [post.image] },
  }
}
```

## Common Patterns

### Responsive Navigation
```tsx
'use client'
import { useState } from 'react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 flex justify-between h-16 items-center">
        <a href="/" className="font-bold">Logo</a>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">Menu</button>
        <div className={`${isOpen ? 'block' : 'hidden'} md:flex gap-4`}>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
        </div>
      </div>
    </nav>
  )
}
```

### Loading & Error States
```tsx
// loading.tsx
export default function Loading() {
  return <div className="flex justify-center p-8">Loading...</div>
}

// error.tsx
'use client'
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="text-center p-8">
      <h2>Something went wrong!</h2>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Try again
      </button>
    </div>
  )
}
```

## Best Practices

### Layout Guidelines

**✅ Do:**
- Use semantic HTML (`header`, `nav`, `main`, `aside`, `footer`)
- Make layouts responsive (mobile-first)
- Use `Link` from `next/link` for internal navigation
- Add proper metadata to all pages
- Use server components by default
- Include loading and error states
- Make navigation keyboard accessible

**❌ Don't:**
- Use `<a>` tags for internal Next.js routes
- Forget mobile responsiveness
- Skip accessibility attributes
- Omit metadata configuration
- Make everything a client component
- Forget loading/error states

### SEO Checklist

- ✅ Set unique `title` for each page
- ✅ Write descriptive `description` (150-160 chars)
- ✅ Add Open Graph tags for social sharing
- ✅ Include Twitter Card metadata
- ✅ Use semantic HTML structure
- ✅ Add `alt` text to images
- ✅ Create `robots.txt` and `sitemap.xml`

## Quick Reference

### When to Use Each Layout

| Layout Type | Use Case | Complexity |
|------------|----------|------------|
| App Shell | Marketing sites, blogs | Low |
| Dashboard | Admin panels, SaaS apps | Medium |
| Landing Page | Product launches, portfolios | Low |
| Auth Layout | Login, signup, password reset | Low |
| Blog Layout | Blogs, documentation | Medium |

### File Structure

```
app/
├── layout.tsx           # Root layout (header + footer)
├── page.tsx            # Home page
├── loading.tsx         # Loading state
├── error.tsx           # Error boundary
├── not-found.tsx       # 404 page
├── (auth)/
│   ├── layout.tsx      # Auth layout (centered)
│   ├── login/page.tsx
│   └── signup/page.tsx
├── dashboard/
│   ├── layout.tsx      # Dashboard layout (sidebar)
│   ├── page.tsx
│   └── settings/page.tsx
└── blog/
    ├── layout.tsx      # Blog layout (sidebar)
    ├── page.tsx
    └── [slug]/page.tsx
```

## Success Criteria

A successful layout:
- ✅ Uses Next.js App Router patterns correctly
- ✅ Includes proper metadata configuration
- ✅ Is responsive on all devices
- ✅ Has semantic HTML structure
- ✅ Uses server components by default
- ✅ Includes loading and error states
- ✅ Is keyboard accessible
- ✅ Works without JavaScript (where appropriate)

## Assumptions

Unless stated otherwise, assume:
- Next.js 14+ with App Router
- TypeScript enabled
- Tailwind CSS configured
- Server components by default
- Client components marked with `'use client'`
