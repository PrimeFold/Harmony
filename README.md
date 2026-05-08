# ◉ Harmony

**Less interface. More signal.**

A monochrome collaborative workspace focused on clarity, hierarchy, and intentional motion.

`release 0.7` · `learning project`

---

![stack](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![stack](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=react-query&logoColor=white)
![stack](https://img.shields.io/badge/Neon-00E599?style=flat-square&logo=postgresql&logoColor=black)
![stack](https://img.shields.io/badge/Tailwind_v4-000000?style=flat-square&logo=tailwindcss&logoColor=white)
![stack](https://img.shields.io/badge/Framer_Motion-000000?style=flat-square&logo=framer&logoColor=white)
![stack](https://img.shields.io/badge/GSAP-000000?style=flat-square&logo=greensock&logoColor=88CE02)

---

## `// 00` — overview

**Harmony** is a collaborative task-management interface built as a study in reduction.

Hairline borders.  
Monospaced hierarchy.  
Dot-grid surfaces.  
One red signal accent reserved only for meaningful interaction.

The project exists primarily as a learning sandbox for exploring how modern React architecture feels when the interface stops competing for attention.

The current focus is:

- UI systems
- component architecture
- motion choreography
- state modelling
- scalable route structure

The backend/data layer is intentionally incomplete for now.

---

## `// 01` — features

| Surface | Description |
|---|---|
| **Authentication** | Sign in · Sign up · Forgot password  |
| **Dashboard** | Project listing with filtering, sorting, and search |
| **Projects** | Dynamic project routes with Kanban task boards |
| **Tasks** | Inline task creation, status transitions, contextual actions |
| **Context menus** | Right-click interactions for task management |
| **User dock** | Floating system menu with animated signal pulse |
| **Settings** | Profile · Account · Security sections |
| **Theme system** | Persistent monochrome dark/light themes |
| **Motion system** | Framer Motion + GSAP choreography |
| **Responsive layout** | Optimized for desktop-first workflows |

---

## `// 02` — stack

```txt
┌─────────────────────────────────────────────────────────────┐
│  next.js          ── app router, layouts, server rendering │
│  tanstack query   ── async state + optimistic mutations    │
│  neon postgres    ── serverless relational database        │
│  tailwind v4      ── utility-first styling + tokens        │
│  framer motion    ── component-level transitions           │
│  gsap             ── hero choreography + timeline motion   │
└─────────────────────────────────────────────────────────────┘
```

### Why Next.js App Router?

- Nested layouts
- Route-level loading/error boundaries
- Better server/client composition
- Cleaner filesystem routing
- Scales better than client-only route trees

### Why TanStack Query?

Server state becomes difficult surprisingly fast.

TanStack Query solves:

- optimistic updates
- stale cache invalidation
- background synchronization
- retry handling
- mutation lifecycle management

without turning async state into spaghetti.

### Why Neon?

Serverless Postgres with branching and instant provisioning.

Perfect for experimentation without infrastructure overhead.

---

## `// 03` — design language

Harmony intentionally avoids decorative UI noise.

### Core principles

- zero-radius geometry
- monochrome-first surfaces
- restrained motion
- aggressive hierarchy
- intentional negative space

### Tokens

| token | role |
|---|---|
| `--color-background` | primary surface |
| `--color-ink` | foreground |
| `--color-ink-mute` | muted foreground |
| `--color-border` | hairline separators |
| `--color-signal` | red interaction accent |
| `--color-signal-glow` | signal bloom |
| `--dot-pattern` | matrix texture |

### Typography

| Role | Typeface |
|---|---|
| Display / mono | JetBrains Mono |
| Body | Inter |

### Motion philosophy

Motion exists only to:

- guide attention
- reinforce hierarchy
- communicate state

Not to decorate emptiness.

---

## `// 04` — routes

```txt
/                           landing
/auth/signIn                    authentication
/auth/signUp                    authentication
/auth/forgotPassword            authentication

/dashboard                  projects overview

/projects/[projectId]       project workspace

/settings                   account settings
```

---

## `// 05` — project structure

```txt
app/
├── dashboard/
├── projects/
│   └── [projectId]/
├── settings/
├── sign-in/
├── sign-up/
├── forgot-password/
│
├── components/
│   ├── nothing/
│   │   ├── Shell.tsx
│   │   ├── Modal.tsx
│   │   ├── ContextMenu.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── UserDock.tsx
│   │
│   └── tasks/
│
├── lib/
│   └── utils.ts
│
├── styles.css
│
└── 
```
---

## `// 06` — local setup

```bash
# install dependencies
bun install

# start development server
bun run dev
```

Then open:

```txt
http://localhost:3000
```

---

## `// 07` — current status

```txt
[■■■■■■■■■■]  ui system
[■■■■■■■■··]  interaction layer
[■■■■■·····]  component architecture
[■■········]  backend integration
[··········]  authentication logic
```

---

## `// 08` — roadmap

- Neon integration
- Task persistence
- Optimistic mutations
- Real authentication
- Activity timelines
- Drag-and-drop task ordering
- Mobile interaction refinement

---

## `// architecture notes` — authentication strategy

### Middleware vs AuthGuard

One of the earliest architectural questions was:

> "If Middleware already protects routes, why introduce an additional AuthGuard layer?"

The answer came down to runtime responsibilities.

Middleware is extremely fast and ideal for:

- redirecting unauthenticated users
- protecting route segments
- checking cookies
- gating access before rendering

Example:

```ts
pathname.startsWith("/dashboard")
pathname.startsWith("/settings")
```

This avoids hardcoding every protected route individually.

However, Middleware is intentionally lightweight and not ideal for:

- database verification
- token rotation
- user hydration
- session recovery logic

To solve this, Harmony uses a second verification layer:

```txt
Middleware  →  route gate
AuthGuard   →  session verification
```

---

### Authentication vs Authorization

Another key realization:

A valid JWT payload only proves:

```txt
"This token was signed correctly."
```

It does not prove:

- the user still exists
- the account is active
- the session is still trusted

Because of this, the AuthGuard performs an additional database lookup after decoding the token.

This prevents scenarios like:

```txt
deleted user + valid token = ghost session
```

The database remains the final source of truth.

---

### Why httpOnly cookies instead of localStorage?

Initially, token storage in `localStorage` seemed simpler.

However, Harmony uses `httpOnly` cookies because they:

- are inaccessible to client-side JavaScript
- reduce XSS attack exposure
- are automatically attached to requests
- remove manual frontend token management

This also simplifies the frontend architecture significantly.

---

### Session persistence

A common concern during implementation was:

> "Will users be logged out after closing the browser?"

The solution was persistent refresh-token cookies using `maxAge`.

Because the browser stores these cookies on disk, sessions survive browser restarts and can automatically restore themselves through silent token rotation.

---

### Layout-level protection

Instead of wrapping the entire application with authentication logic, Harmony protects only the relevant route groups.

The authentication layer is attached to the protected layout:

```txt
/dashboard
/projects/[projectId]
/settings
```

This keeps public surfaces like:

```txt
/
/signIn
/signUp
```

fully accessible while allowing protected sections to inherit authentication automatically.

---

### Relationship with TanStack Query

Authentication and server-state management solve different problems.

The AuthGuard handles:

- entry validation
- session verification
- token refresh logic

TanStack Query handles:

- task fetching
- project mutations
- optimistic updates
- cache synchronization

The separation keeps authentication infrastructure independent from application data flow.



---

### Final architecture

Harmony uses a hybrid authentication strategy:

```txt
Middleware      → fast route protection
AuthGuard       → database verification
httpOnly cookie → secure session transport
Refresh tokens  → silent session recovery
```

The result is a secure authentication flow with minimal client-side complexity and close to zero visual flicker during protected navigation.



`signal level: ◉`

**Harmony** — clarity over noise.



