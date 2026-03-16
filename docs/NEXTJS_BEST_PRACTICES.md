# Next.js Best Practices & Optimization Advice

Recommendations after reviewing the Bettery frontend (Next.js 16, App Router).

---

## 1. Move logic to the backend (API)

### 1.1 "My bets" filtering on the server

**Current:** In `app/app/fetchEvents.ts`, when `tab === "my-bets"` you fetch all events from the API and then filter in the client with `list.filter(ev => ev.bets?.some(b => b.creator === address))`. That loads more data than needed and does filtering in the browser.

**Recommendation:** Support an optional `address` (or `creator`) query param in `app/api/events/route.ts` and filter in Prisma, e.g.:

```ts
// In GET handler, add:
const address = searchParams.get("address") ?? undefined;
// In where clause, when address is set:
// where: { ...existing, bets: { some: { creator: address } } }
```

Then in `fetchEventsList`, when `tab === "my-bets"` and `address` is set, call `/api/events?address=${address}&...` and use the returned list as-is. No client-side filter.

---

## 2. Use Server Components where it fits

**Current:** `app/event/[id]/page.tsx` and `app/app/page.tsx` are full client components (`"use client"`). Initial data is loaded in `useEffect` with `fetch()`, so the first paint is loading state and data comes after hydration.

**Recommendation:**

- **Event detail page:** Make the default export a **Server Component** that fetches the event in the page (e.g. `const event = await fetch(...) or getEvent(id)`), then pass `event` to a client component that handles wallet, participation, refund, etc. You get faster first paint and better SEO for the event title/description.
- **Events list (app):** Consider a Server Component for the initial list (first page) and pass it as `initialData` into a client component that handles filters, “load more”, and mutations. Alternatively keep it client but use `useQuery` (see below) for caching and loading states.

---

## 3. Data fetching and caching

**Current:** Events are fetched with raw `fetch()` in `useEffect` and state is stored in `useState`. No caching or request deduplication; refetch on mount every time.

**Recommendation:** You already have `@tanstack/react-query`. Use it for:

- **Event by id:** `useQuery({ queryKey: ['event', id], queryFn: () => fetch(...).then(r => r.json()) })` in the client event page (or in a child of the RSC event page). You get caching, refetch on focus, and a single place for loading/error.
- **Events list:** `useQuery` (or `useInfiniteQuery` for “load more”) for `fetchEventsList`. Same benefits; with `useInfiniteQuery` you get clean “load more” and cache per page.

This also gives a clear place to invalidate after mutations (e.g. after `txParticipateEvent` or `txIncreasePart`).

---

## 4. Loading and error UX (Next.js conventions)

**Current:** No `loading.tsx` or `error.tsx` in route segments.

**Recommendation:**

- Add `app/event/[id]/loading.tsx` (e.g. a skeleton or spinner). Next.js will show it while the event segment is loading.
- Add `app/event/[id]/error.tsx` with an error boundary that shows a message and a retry. Same for `app/app/` if you want a global loading/error state for that section.

---

## 5. Typing and consistency

**Current:** `app/app/fetchEvents.ts` and `app/app/EventsListSection.tsx` use `any[]` for events. Event page defines a detailed `EventFromApi` interface.

**Recommendation:** Introduce a shared type (e.g. in `types/events.ts`) for the event and bet shape returned by the API, and use it in:

- `fetchEvents.ts` (return type and filter callbacks),
- `EventsListSection` props,
- Event page (reuse or extend the same type).

This keeps API and UI in sync and avoids silent bugs when the API shape changes.

---

## 6. Small cleanups

- **Logging:** Remove or guard `console.log` in production (e.g. in `fetchEvents.ts`: `console.log("data", data)`). Prefer a small logger that no-ops in production.
- **API pagination:** Your events API uses 1-based `page`; `fetchEventsList` uses 0-based for the first page but passes it as query param and the API does `Math.max(1, parseInt(...))`, so behavior is correct. Just document or align naming (e.g. “page” is 1-based in the API) to avoid future mistakes.
- **BigInt serialization:** You already use a replacer in API routes for `bigint`. Consider a shared helper (e.g. in `lib/` or `app/api/`) so every route doesn’t repeat the same `JSON.stringify(..., (_, v) => typeof v === 'bigint' ? v.toString() : v)`.
- **Fonts:** Layout loads several Google fonts. If some are unused, remove them to improve LCP and avoid layout shift.

---

## 7. Security and env

- **RPC URL:** Using `NEXT_PUBLIC_RPC_URL` for client-side wallet/RPC is fine; balance and chain logic that already run in API routes keep sensitive work on the server.
- **Balance API:** Ensure `address` is validated (e.g. format/length) before calling the chain to avoid abuse or malformed requests.

---

## 8. Summary table

| Area            | Current                   | Recommendation                                     |
| --------------- | ------------------------- | -------------------------------------------------- |
| My-bets filter  | Client-side filter        | Backend filter via `?address=...` in `/api/events` |
| Event page data | Client fetch in useEffect | Prefer RSC fetch or at least `useQuery`            |
| Events list     | Client fetch + useState   | `useQuery` / `useInfiniteQuery`                    |
| Loading/error   | In-component only         | Add `loading.tsx` and `error.tsx`                  |
| Types           | `any` in events list      | Shared event/bet types from API                    |
| Logging         | `console.log` in fetch    | Remove or use prod-safe logger                     |

Implementing the backend and data-fetching items first will give the biggest gain in performance and maintainability; then add loading/error and typing for a more robust and predictable app.
