---
name: nextjs-api-generator
description: Generate production-ready Next.js API routes and server actions with proper error handling, validation, type safety, security patterns, rate limiting, and monitoring. Use when creating, building, or refactoring API endpoints, form handlers, data mutations, webhooks, file uploads, or server-side logic. Outputs code that handles edge cases, validates input, returns consistent responses, and follows Next.js 14+ conventions.
---

# Next.js API Route & Server Action Generator

Generate secure, type-safe, production-grade API routes and server actions that handle errors gracefully, validate input properly, and include monitoring and rate limiting.

## Core Requirements

### 1. Route Handler Patterns (App Router)

**Structure:**

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    logger.info("Fetching posts");

    const posts = await prisma.post.findMany();

    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch (error) {
    logger.error("Failed to fetch posts", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate body
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const post = await prisma.post.create({ data: body });

    logger.info("Post created", { postId: post.id });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    logger.error("Failed to create post", error as Error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
```

**Required patterns:**

- Export HTTP method functions: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Use `NextRequest` and `NextResponse` types
- Always wrap in try-catch blocks
- Return proper HTTP status codes
- Use consistent response format
- Include structured logging for all operations

### 2. Server Actions

**Structure:**

```tsx
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";

export async function createPost(formData: FormData) {
  // Validate input
  const title = formData.get("title");
  if (!title || typeof title !== "string") {
    return { error: "Title is required" };
  }

  try {
    logger.info("Creating post via server action", { title });

    const post = await prisma.post.create({ data: { title } });

    logger.info("Post created via server action", { postId: post.id });

    revalidatePath("/posts");
    return { success: true, data: post };
  } catch (error) {
    logger.error("Failed to create post via server action", error as Error);
    return { error: "Failed to create post" };
  }
}
```

**Required patterns:**

- Mark with `'use server'` directive
- Accept `FormData` or typed parameters
- Validate all inputs before processing
- Return `{ success: true, data }` or `{ error: 'message' }` objects
- Use `revalidatePath()` after mutations
- Never throw errors (return error objects instead)
- Log all operations for debugging and monitoring

### 3. Type Safety Best Practices

**Define request/response types:**

```tsx
// types/api.ts
export interface CreatePostRequest {
  title: string;
  content: string;
  tags?: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// Pagination types
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Use in route handlers:**

```tsx
import type { CreatePostRequest, Post, ApiResult } from "@/types/api";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResult<Post>>> {
  try {
    const body: CreatePostRequest = await request.json();

    // Validate
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({ data: body });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 4. Input Validation

**Basic validation:**

```tsx
// Required field validation
if (!title || typeof title !== "string" || title.trim() === "") {
  return NextResponse.json({ error: "Title is required" }, { status: 400 });
}

// Type validation
if (typeof age !== "number" || age < 0) {
  return NextResponse.json({ error: "Invalid age" }, { status: 400 });
}

// Format validation (email, URL, etc.)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
}
```

**Async validation (checking database):**

```tsx
export async function POST(request: NextRequest) {
  const { email } = await request.json();

  // Validate format
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already taken" }, { status: 409 });
  }

  // Continue with user creation...
}
```

**For complex validation, use Zod:**

```tsx
import { z } from "zod";

const PostSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  published: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = PostSchema.parse(body);

    // Use validated data (TypeScript knows the exact type now)
    const post = await prisma.post.create({ data: validated });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 5. Error Handling

**Response format:**

```tsx
// Success response
return NextResponse.json(
  {
    success: true,
    data: result,
  },
  { status: 200 }
);

// Error response
return NextResponse.json(
  {
    error: "User-friendly message",
    details: {}, // Optional, for validation errors
  },
  { status: 400 | 401 | 403 | 404 | 409 | 429 | 500 }
);
```

**Status code guide:**

- `200` - Success (GET, PATCH, PUT)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (validation failure)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (logged in but no permission)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

**Never expose:**

- Database error messages
- Stack traces in production
- Internal system details
- Sensitive configuration
- API keys or tokens

### 6. Authentication & Authorization

**Check authentication:**

```tsx
import { auth } from "@/lib/auth"; // Or your auth solution

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Continue with authenticated user
  const userId = session.user.id;

  logger.info("Authenticated request", { userId });
}
```

**Check authorization (resource ownership):**

```tsx
// Check if user owns resource
const post = await prisma.post.findUnique({ where: { id } });

if (!post) {
  return NextResponse.json({ error: "Post not found" }, { status: 404 });
}

if (post.authorId !== session.user.id) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

### 7. Rate Limiting & Security

**Protect endpoints from abuse:**

```tsx
import { ratelimit } from "@/lib/redis"; // Or use Upstash, Vercel KV

export async function POST(request: NextRequest) {
  const ip =
    request.ip ?? request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  try {
    const { success, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "Retry-After": "60",
          },
        }
      );
    }

    // Continue with request
    logger.info("Rate limit check passed", { ip, remaining });
  } catch (error) {
    // If rate limiting fails, log but don't block request
    logger.error("Rate limit check failed", error as Error, { ip });
  }
}
```

**Simple in-memory rate limiting (for development):**

```tsx
// lib/rate-limit.ts
const requests = new Map<string, number[]>();

export function rateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  const timestamps = requests.get(identifier) || [];

  // Remove old timestamps outside the window
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= limit) {
    return { success: false, remaining: 0 };
  }

  validTimestamps.push(now);
  requests.set(identifier, validTimestamps);

  return { success: true, remaining: limit - validTimestamps.length };
}
```

**CORS for public APIs:**

```tsx
export async function GET(request: NextRequest) {
  const data = await fetchData();

  const response = NextResponse.json({ success: true, data });

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

### 8. Middleware Pattern for Reusable Logic

**Create auth middleware:**

```tsx
// lib/middleware/auth.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  const session = await auth();

  if (!session) {
    logger.info("Unauthorized request attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info("Authenticated request", { userId: session.user.id });

  return handler(request, session.user.id);
}
```

**Create rate limiting middleware:**

```tsx
// lib/middleware/rate-limit.ts
import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "@/lib/redis";

export async function withRateLimit(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  limit: number = 10
) {
  const ip = request.ip ?? "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return handler(request);
}
```

**Compose middleware:**

```tsx
// lib/middleware/compose.ts
import { NextRequest, NextResponse } from "next/server";

type Middleware = (
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
) => Promise<NextResponse>;

export function compose(...middlewares: Middleware[]) {
  return async (
    request: NextRequest,
    handler: (req: NextRequest) => Promise<NextResponse>
  ) => {
    let composedHandler = handler;

    for (let i = middlewares.length - 1; i >= 0; i--) {
      const currentHandler = composedHandler;
      const middleware = middlewares[i];
      composedHandler = (req) => middleware(req, currentHandler);
    }

    return composedHandler(request);
  };
}
```

**Use in routes:**

```tsx
import { withAuth } from "@/lib/middleware/auth";
import { withRateLimit } from "@/lib/middleware/rate-limit";
import { compose } from "@/lib/middleware/compose";

export async function POST(request: NextRequest) {
  return compose(withRateLimit, withAuth)(request, async (req, userId) => {
    // You're guaranteed to have userId here and rate limit passed
    const body = await req.json();

    const post = await prisma.post.create({
      data: { ...body, authorId: userId },
    });

    return NextResponse.json({ success: true, data: post });
  });
}
```

### 9. Logging & Monitoring

**Structured logging:**

```tsx
// lib/logger.ts
type LogLevel = "info" | "warn" | "error";

interface LogMeta {
  [key: string]: any;
}

class Logger {
  private log(level: LogLevel, message: string, meta?: LogMeta) {
    const logEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...meta,
    };

    if (level === "error") {
      console.error(JSON.stringify(logEntry));
    } else {
      console.log(JSON.stringify(logEntry));
    }

    // In production, send to monitoring service (Datadog, Sentry, etc.)
    // if (process.env.NODE_ENV === 'production') {
    //   monitoringService.log(logEntry)
    // }
  }

  info(message: string, meta?: LogMeta) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: LogMeta) {
    this.log("warn", message, meta);
  }

  error(message: string, error: Error, meta?: LogMeta) {
    this.log("error", message, {
      error: error.message,
      stack: error.stack,
      ...meta,
    });
  }
}

export const logger = new Logger();
```

**Use in routes:**

```tsx
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const session = await auth();

  logger.info("Creating post", {
    userId: session?.user.id,
    timestamp: Date.now(),
  });

  try {
    const body = await request.json();
    const post = await prisma.post.create({ data: body });

    logger.info("Post created successfully", {
      postId: post.id,
      userId: session?.user.id,
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    logger.error("Failed to create post", error as Error, {
      userId: session?.user.id,
      requestBody: await request.json().catch(() => ({})),
    });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 10. Database Operations

**Use Prisma pattern (if applicable):**

```tsx
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    logger.error("Database query failed", error as Error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
```

**Handle unique constraint violations:**

```tsx
import { Prisma } from "@prisma/client";

try {
  await prisma.user.create({ data: { email } });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
  }
  throw error;
}
```

**Database transactions:**

```tsx
export async function POST(request: NextRequest) {
  const { userData, profileData } = await request.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({ data: userData });

      // Create profile
      const profile = await tx.profile.create({
        data: { userId: user.id, ...profileData },
      });

      // Send welcome notification
      await tx.notification.create({
        data: { userId: user.id, message: "Welcome!" },
      });

      return { user, profile };
    });

    logger.info("User created with profile", { userId: result.user.id });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    // All operations rolled back automatically
    logger.error("Transaction failed", error as Error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
```

### 11. Environment Variable Validation

**Validate required env vars at startup:**

```tsx
// lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  REDIS_URL: z.string().url().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = envSchema.parse(process.env);

// Usage: import { env } from '@/lib/env'
// TypeScript now knows these exist and are valid
```

**Use in routes:**

```tsx
import { env } from "@/lib/env";

// Now TypeScript knows these exist and are validated
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
```

## Common Patterns

### Paginated GET Endpoint

```tsx
import type { PaginatedResponse, Post } from "@/types/api";

export async function GET(
  request: NextRequest
): Promise<NextResponse<PaginatedResponse<Post>>> {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "10"));

  const skip = (page - 1) * limit;

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.post.count(),
    ]);

    logger.info("Posts fetched", { page, limit, total });

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error("Failed to fetch posts", error as Error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
```

### Dynamic Route Handler

```tsx
// app/api/posts/[id]/route.ts
interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: true, comments: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    logger.info("Post fetched", { postId: id });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    logger.error("Failed to fetch post", error as Error, { postId: id });
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return withAuth(request, async (req, userId) => {
    const { id } = params;

    try {
      const post = await prisma.post.findUnique({ where: { id } });

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      if (post.authorId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      await prisma.post.delete({ where: { id } });

      logger.info("Post deleted", { postId: id, userId });

      return NextResponse.json({ success: true }, { status: 204 });
    } catch (error) {
      logger.error("Failed to delete post", error as Error, { postId: id });
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }
  });
}
```

### Form Server Action

```tsx
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logger } from "@/lib/logger";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

export async function createPost(prevState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    logger.warn("Validation failed for createPost", {
      errors: validatedFields.error.flatten().fieldErrors,
    });

    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const post = await prisma.post.create({
      data: validatedFields.data,
    });

    logger.info("Post created via server action", { postId: post.id });

    revalidatePath("/posts");
    return { success: true, data: post };
  } catch (error) {
    logger.error("Failed to create post", error as Error);
    return { error: "Failed to create post" };
  }
}
```

### Webhook Handler Pattern

```tsx
import { headers } from "next/headers";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  // Get raw body for signature verification
  const body = await request.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    logger.warn("Webhook received without signature");
    return NextResponse.json({ error: "No signature" }, { status: 401 });
  }

  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    logger.info("Webhook received", { type: event.type, id: event.id });

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object);
        break;

      case "payment_intent.failed":
        await handlePaymentFailure(event.data.object);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;

      default:
        logger.info("Unhandled webhook event type", { type: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Webhook processing failed", error as Error);

    if (error instanceof Error && error.message.includes("signature")) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  logger.info("Processing payment success", {
    paymentIntentId: paymentIntent.id,
  });

  await prisma.payment.create({
    data: {
      stripeId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: "succeeded",
    },
  });
}

async function handlePaymentFailure(paymentIntent: any) {
  logger.warn("Payment failed", {
    paymentIntentId: paymentIntent.id,
    failureReason: paymentIntent.last_payment_error?.message,
  });

  // Handle failure logic
}
```

### File Upload Handler

```tsx
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, userId) => {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        logger.warn("Invalid file type uploaded", {
          type: file.type,
          userId,
        });

        return NextResponse.json(
          { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        logger.warn("File too large", {
          size: file.size,
          userId,
        });

        return NextResponse.json(
          { error: "File too large. Maximum size: 5MB" },
          { status: 400 }
        );
      }

      // Upload to storage
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${userId}-${Date.now()}-${file.name}`;

      // Upload to S3, Cloudinary, etc.
      const url = await uploadToStorage(buffer, filename, file.type);

      // Save to database
      const upload = await prisma.upload.create({
        data: {
          filename,
          url,
          size: file.size,
          mimeType: file.type,
          userId,
        },
      });

      logger.info("File uploaded successfully", {
        uploadId: upload.id,
        userId,
        size: file.size,
      });

      return NextResponse.json(
        { success: true, data: upload },
        { status: 201 }
      );
    } catch (error) {
      logger.error("File upload failed", error as Error, { userId });
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  });
}

// Helper function (implement based on your storage)
async function uploadToStorage(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  // Example with S3
  // const command = new PutObjectCommand({
  //   Bucket: env.S3_BUCKET,
  //   Key: filename,
  //   Body: buffer,
  //   ContentType: mimeType,
  // })
  // await s3Client.send(command)
  // return `https://${env.S3_BUCKET}.s3.amazonaws.com/${filename}`

  throw new Error("Implement storage upload");
}
```

## When to Use Each Pattern

### Use API Routes (`app/api/*/route.ts`) when:

- ✅ Building REST API for mobile app or external clients
- ✅ Receiving webhooks from third-party services (Stripe, GitHub, etc.)
- ✅ Need custom headers (CORS, caching, rate limiting)
- ✅ Implementing OAuth flows or complex authentication
- ✅ Streaming responses or Server-Sent Events
- ✅ Need to set cookies with specific options
- ✅ Handling file uploads
- ✅ Public API that doesn't require Next.js frontend
- ❌ Simple form submission from your own UI (use Server Actions)

### Use Server Actions (`'use server'`) when:

- ✅ Handling form submissions in your app
- ✅ Mutations triggered by UI interactions (like, delete, update)
- ✅ Need automatic revalidation of cached data
- ✅ Want progressive enhancement (works without JS)
- ✅ Need optimistic UI updates
- ✅ Simple CRUD operations from your own components
- ❌ Building public API (use API Routes)
- ❌ Receiving webhooks (use API Routes)
- ❌ Need custom HTTP headers or status codes (use API Routes)
- ❌ File uploads (use API Routes for better control)

## Constraints

**Do NOT:**

- Return raw database errors to client
- Skip input validation
- Use `any` types for request/response
- Perform expensive operations without timeout
- Store sensitive data in cookies without encryption
- Use GET for mutations
- Forget to revalidate cache after mutations
- Log sensitive information (passwords, tokens, API keys)
- Expose stack traces in production
- Skip rate limiting on public endpoints

## Success Criteria

A successful API route or server action:

- ✅ Validates all inputs before processing
- ✅ Returns consistent response format
- ✅ Handles all error cases gracefully
- ✅ Uses proper HTTP status codes
- ✅ Includes authentication/authorization checks if needed
- ✅ Type-safe (no `any` types)
- ✅ Revalidates cache when data changes
- ✅ Logs important operations for debugging
- ✅ Protected by rate limiting (public endpoints)
- ✅ Never exposes sensitive information
- ✅ Uses transactions for multi-step operations
- ✅ Handles file uploads securely (if applicable)

## Testing Suggestions

**API Route testing:**

```bash
# Test with curl
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Post","content":"This is a test"}'

# Test authentication
curl -X GET http://localhost:3000/api/posts/123 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test file upload
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/image.jpg"

# Test pagination
curl -X GET "http://localhost:3000/api/posts?page=2&limit=10"
```

**Server Action testing:**

```tsx
// In your component
import { createPost } from "@/app/actions";

// Test in browser console or component
const formData = new FormData();
formData.append("title", "Test");
formData.append("content", "Test content");

const result = await createPost(null, formData);
console.log(result);
```

## Assumptions

Unless stated otherwise, assume:

- Next.js 14+ with App Router
- TypeScript enabled
- Prisma for database (mention if using different ORM)
- Project has basic auth setup (NextAuth, Clerk, Supabase Auth, etc.)
- Redis or similar for rate limiting (provide fallback if not available)
- Environment variables are validated at startup

## Production Checklist

Before deploying API routes, ensure:

- [ ] All environment variables are validated
- [ ] Rate limiting is configured
- [ ] Authentication is properly implemented
- [ ] Authorization checks are in place
- [ ] All inputs are validated
- [ ] Error messages don't expose sensitive info
- [ ] Logging is configured (sent to monitoring service)
- [ ] Database indexes are optimized
- [ ] CORS is configured for public APIs
- [ ] Webhooks verify signatures
- [ ] File uploads have size/type limits
- [ ] Transactions are used for multi-step operations
