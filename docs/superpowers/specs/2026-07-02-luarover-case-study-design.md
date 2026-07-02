# LuaRover case study + generic case-study components

## Goal

Add a `/lua-rover` case-study page mirroring the structure of the existing
`/restaurant-ordering-system` (ROS) page, and extract ROS's bespoke section
"widgets" into a generic, reusable component library so both pages (and any
future showcase) share one implementation.

## Source material

- LuaRover thesis (LaTeX): `C:\Users\Andrei\Desktop\masterDegreePaper` —
  intro, motivation, architecture and technologies chapters describe the
  three components (`lua_native`, `lua_rover`, `LuaRoverBackend`), the
  design rationale, and give exact figures (770 automated tests, 96.8%
  `lua_native` coverage on native+web, 100% `lua_bridge` coverage).
- Thesis diagrams: `masterDegreePaper\diag\*.png` (component/class/sequence
  diagrams, drawio-exported, several thousand px on the long edge).
- App screenshots: 11 JPEGs supplied by the user (desktop + mobile), showing
  the main menu, the code editor with step debugger, the sensors panel, the
  settings screen and a light-themed in-app reference page.

No public repo, demo video, or existing showcase thumbnail exists for
LuaRover yet — the page is built entirely from the above.

## Part A — Generic component library

New directory: `src/components/case-study/`.

| Component | Responsibility | Extracted from (ROS CSS class) |
|---|---|---|
| `CaseStudyHero` | Eyebrow + title + lead + CTA row, optional hero image on the right (desktop) | `.ros-hero` (image slot existed in CSS but was unused by ROS) |
| `BulletList` | Dot-bullet list of short strings, `tone: 'subtle' \| 'plain'` for background | `.ros-pillars` / `.ros-strengths` |
| `Section` | Section wrapper with `SectionHeader` (eyebrow/title/lead) and `muted` boolean variant | `.ros-section` / `.ros-section--muted` / `.ros-section__header` |
| `CardGrid` | Grid of `{ title, description, icon? }` cards | `.ros-feature-grid` / `.ros-components__list` / `.ros-entities__text` |
| `StatsRow` | Grid of `{ value, label }` stat cards | `.ros-stats` |
| `SplitMediaSection` | Text content (children) + a media slot, `layout: 'split' \| 'stack'`, `reverse?` to put media on the left | `.ros-card--split` (architecture blocks, plugin block, entities block) |
| `MediaFigure` | Single `<img>` + caption, the typical content for `SplitMediaSection`'s media slot | image + `.ros-caption` |
| `MediaCollage` | One main image plus rows of secondary images (ROS's server-diagram layout: main + row of 2 + centered row of 1) | `.ros-components__media` |

Styling: one shared `src/components/case-study/CaseStudy.css` with generic
`cs-*` class names, replacing the `ros-*` names. Page-specific look-and-feel
(e.g. hero gradient color) stays as a small page-level CSS override applied
via a wrapper class, not by forking the shared CSS.

Data: ROS's inline content arrays (`requirements`, `featureCards`,
`strengths`, `projectStats`, `architectureSections`, `components`,
`entities`) move to `src/data/restaurantOrderingSystem.ts`, matching the
existing `src/data/*.ts` convention. `RestaurantOrderingSystem.tsx` becomes a
thin composition of the new components fed by that data, with the same
visual output as today. `RestaurantOrderingSystem.css` shrinks to whatever
page-specific override remains (likely just the hero gradient).

## Part B — LuaRover page

New files: `src/pages/LuaRover.tsx`, `src/pages/LuaRover.css` (accent
override only), `src/data/luaRover.ts`. Route added in `App.tsx` at
`/lua-rover`.

Section order (mirrors ROS):

1. **Hero** — eyebrow "LuaRover"; title/lead framed around bridging
   block-based and real-syntax coding for 10–14 year-olds via sandboxed,
   offline-first Lua execution. Hero image: the space-themed main-menu
   screenshot. CTA row: primary anchor-scrolls to Highlights, ghost "Back to
   projects" (no external links, per thesis/repo not being public).
2. **Pillars** (`BulletList`, subtle) — zero-setup/offline-first execution,
   bridges visual blocks and real syntax, every code line drives a visible
   rover on a grid, offline-first progress sync.
3. **Highlights** (`Section` + `CardGrid`, icon-less, anchor target) — one
   card per component: `lua_native` (official Lua 5.5 via FFI native +
   WASM web, not a reimplementation), `lua_rover` client (Flutter, CQRS
   game engine with atomic frame recording for step replay),
   `LuaRoverBackend` (Clean Architecture, JWT auth, multilingual content
   generation).
4. **"See it in action"** (`SplitMediaSection`, stacked) — code editor +
   grid + step debugger screenshot, standing in for ROS's video embed
   (no demo video exists for LuaRover).
5. **Operational strength** (`Section`, muted, `BulletList`) — setjmp/
   longjmp panic-isolation chain, single C trampoline + Dart dispatcher
   multiplexing all callbacks, 770 automated tests, sandboxed Lua library
   profiles (`safe`/`none`/`all`), frame-by-frame replay without
   re-execution, offline package caching.
6. **Architecture** (`Section`, three `SplitMediaSection` blocks) — one per
   component:
   - `lua_native`: component diagram + `MediaCollage` (save-point-chain and
     callback-dispatch sequence diagrams as secondary row).
   - `lua_rover` client: game-engine diagram + `MediaCollage` of the mobile
     screenshots (menu/code/sensors/map tabs).
   - `LuaRoverBackend`: server class diagram.
7. **Stats row** — 770+ automated tests, 96.8% `lua_native` coverage
   (native & web), 100% `lua_bridge` coverage.
8. **Codegen pipeline** (`SplitMediaSection`, stacked) — the `ffigen`
   dual-path pipeline diagram (C header → native `@Native` bindings via
   `ffigen`/libclang, and → generated web bindings), playing the role ROS's
   "plugin architecture" section played as the standout engineering story.
9. **Content & sync** (`Section`, muted, `SplitMediaSection` reversed) — JWT
   auth-flow diagram + `CardGrid` of content-model entities (courses &
   activities, multilingual language packs, progress sync, SHA-256-hashed
   refresh tokens), LuaRover's analog to ROS's ER-diagram entities section.

## Asset pipeline

Source → destination, all resized/compressed for web (source diagrams run
up to ~4000px on the long edge; screenshots are already web-sized):

- `masterDegreePaper\diag\componente_lua_native.png`,
  `game_engine.png`, `diagrame_clase_server.png`, `ffigen_pipeline.png`,
  `lant_puncte_salvare.png`, `apel_callback_din_c_in_lua.png`,
  `auth_initial_login.png` → `public/images/lua-rover/*.png`, resized to a
  reasonable max width (~1600–2000px) and re-compressed.
- Selected screenshots (main menu, code editor + debugger, 4 mobile shots)
  → `public/images/lua-rover/*.jpg`, cropped where needed to remove
  irrelevant chrome and compressed.
- Cropped/optimized main-menu screenshot → `public/images/showcase/lua-rover.png`
  for the homepage card thumbnail.

## Homepage integration

New entry in `src/data/featuredProjects.ts` for LuaRover: name, a short
description drawn from the thesis abstract, tags (`Flutter`, `Dart`, `FFI`,
`WebAssembly`, `ASP.NET Core`), the new showcase thumbnail, and a single
link `{ label: 'See Case Study', href: '#/lua-rover' }` (no GitHub/demo
links, since neither is public).

## Verification

- `npm run build` (or the project's existing lint/typecheck script) must
  pass after the refactor and the new page.
- Run the dev server and visually check both `/restaurant-ordering-system`
  (no regression from the refactor) and `/lua-rover` (new page renders,
  responsive at mobile width, images load) in a browser.

## Out of scope

- No third showcase page is built now; genericity is proven by ROS + the
  new LuaRover page sharing the same components.
- No GitHub/demo links for LuaRover (not public yet) — can be added later
  by editing `featuredProjects.ts` / the hero CTA row.
- No changes to unrelated pages/sections of the portfolio.
