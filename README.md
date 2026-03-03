# STELLA - Clothing E-Commerce Frontend Assessment

Frontend assessment project built with Next.js (App Router), TypeScript, Tailwind CSS, React Query, Zustand, and `nuqs`.

## Setup Instructions

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Install

```bash
pnpm install
```

### Run Dev Server

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

## Tech Stack

- Next.js App Router
- TypeScript (strict mode)
- Tailwind CSS
- React Query (`@tanstack/react-query`) for async server-state patterns
- Zustand (with `persist`) for auth/cart/wishlist client state
- `nuqs` for URL-synced query state
- React Hook Form + Zod for auth form validation

## Implemented Features

### 1) Auth Flow

- Login page with validation:
  - Email format (Zod)
  - Password min length (6)
- Auth persisted in localStorage via Zustand `persist`
- Protected behaviors:
  - Cart page redirects unauthenticated users to login
  - Add-to-cart from product detail prompts login, then resumes user intent after authentication
- Logout clears auth state and routes to login

### 2) Product Listing

- Header includes logo, debounced search, cart badge, account menu, wishlist menu
- Hero/banner section
- Desktop sidebar filters + mobile drawer filters
- URL-synced filters and search via `nuqs`
- Skeleton loading states
- Empty state for no matching products
- User-facing error handling and retry actions for product/filter fetch failures
- Optimistic cart add from product cards with rollback message on simulated sync failure

### 3) Product Detail (Dedicated Page)

- Implemented as a dedicated page at `/products/[id]`
- Multi-image gallery
- Size selector + quantity selector
- Add-to-cart validation (size required, stock checks)
- Loading/error-resilient commerce details (query + fallbacks)

### 4) Cart

- Persisted cart via Zustand localStorage persistence
- Add/remove/update quantity
- Per-user cart separation keyed by authenticated email, plus guest cart
- Cart summary with subtotal

## Architecture Decisions and Tradeoffs

### Why dedicated product page (instead of modal)

- Better deep linking and shareability (`/products/[id]`)
- Cleaner SEO metadata per product
- Easier to scale richer product content and recommendation modules
- Tradeoff: users leave listing context compared to in-place quick-view modal

### Why URL-synced state (`nuqs`)

- Filters/search/view/sort survive refresh and are shareable
- Enables predictable browser history behavior
- Tradeoff: extra parsing/normalization complexity for query values

### Why Zustand + React Query split

- Zustand: client-owned local state (auth/cart/wishlist/view mode)
- React Query: async fetching, retries, loading/error state, cache staleness
- Tradeoff: two mental models/state layers to maintain

### Why cart is Zustand-first (instead of fully synced backend cart)

- Assessment scope is frontend-only with no real backend, so cart is designed as a resilient local-first experience
- Zustand `persist` guarantees cart continuity across refreshes and supports guest + logged-in flows in one place
- A simulated sync layer (`cart-service`) is used to exercise optimistic updates and rollback behavior without requiring server infrastructure
- Tradeoff: local cart state is not yet canonical across devices/sessions because there is no source-of-truth backend cart

### How I would improve cart sync next

- Introduce a real cart API with server-generated line item IDs and versioning/ETags for conflict detection
- Keep optimistic UI, but move to mutation patterns with explicit rollback snapshots and retry/backoff policies
- On login, merge guest cart into account cart with deterministic rules (dedupe by product+size, sum quantities, respect stock caps)
- Add background reconciliation on app focus/network reconnect and surface non-blocking sync status in UI
- Add tests for conflict resolution, offline retries, and eventual consistency between local and server carts

### Why optimistic cart updates

- Immediate UI feedback on add/remove/update actions
- Simulated backend sync failures demonstrate rollback strategy
- Tradeoff: must keep rollback logic correct to avoid UI/data drift

### Data Layer

- Product and cart operations go through service modules in `lib/services`
- Mock data is isolated in `lib/data/mock-products.ts`
- Async behavior is simulated with delay and controlled random failures for resilience testing

## Requirement Mapping Notes

- Product modal or page: **implemented as page** (justification above)
- Pagination or infinite scroll:
  - **Not implemented yet**
  - Current listing renders all filtered results

## Assumptions

- Mock data is source-of-truth for products, inventory, and filter options
- Authentication is frontend-only and intentionally lightweight for assessment scope
- Cart sync failures are intentionally simulated to validate optimistic rollback UX
- Locale and theming controls are present in UI, but i18n backend/content pipeline is out of scope

## What I Would Improve With More Time

- Add either:
  - pagination for predictable performance and easier QA, or
  - infinite scroll with an intersection observer hook and URL cursor state
- Add route-level protection middleware strategy for broader auth coverage
- Add automated tests (unit + integration + e2e) for:
  - filter/query-state synchronization
  - auth redirect/intent resume flow
  - optimistic cart rollback
- Add stronger accessibility passes (keyboard focus flows, SR announcements for cart updates)
- Reduce duplicated hydration logic across persisted stores via shared utility patterns
- Introduce telemetry hooks to measure failed requests and retry outcomes

## Evaluation-Oriented Highlights

- Separation of concerns:
  - components for view
  - hooks for business logic/state composition
  - services for data retrieval/simulation
  - stores for persistent local client state
- Type-safe modeling via central product/cart/auth types
- User-facing loading, empty, and failure states across key journeys

## Known Gaps

- No automated tests yet
- No pagination/infinite scroll yet
- Route protection is implemented at flow/page level rather than centralized middleware
