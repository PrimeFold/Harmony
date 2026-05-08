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
/sign-in                    authentication
/sign-up                    authentication
/forgot-password            authentication

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
npm install

# start development server
npm run dev
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


`signal level: ◉`

**Harmony** — clarity over noise.


