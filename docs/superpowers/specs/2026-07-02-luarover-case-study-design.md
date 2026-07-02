# LuaRover case study + generic case-study components

## Goal

Add a `/lua-rover` case-study page mirroring the structure of the existing
`/restaurant-ordering-system` (ROS) page, and extract ROS's bespoke section
"widgets" into a generic, reusable component library so both pages (and any
future showcase) share one implementation.

## Source material

- LuaRover thesis (LaTeX): `C:\Users\Andrei\Desktop\masterDegreePaper`: intro, motivation, architecture and technologies chapters describe the
  three components (`lua_native`, `lua_rover`, `LuaRoverBackend`), the
  design rationale, and give exact figures (770 automated tests, 96.8%
  `lua_native` coverage on native+web, 100% `lua_bridge` coverage).
- Thesis diagrams: `masterDegreePaper\diag\*.png` (component/class/sequence
  diagrams, drawio-exported, several thousand px on the long edge).
- App screenshots: 11 JPEGs supplied by the user (desktop + mobile), showing
  the main menu, the code editor with step debugger, the sensors panel, the
  settings screen and a light-themed in-app reference page.

No public repo, demo video, or existing showcase thumbnail exists for
LuaRover yet. The page is built entirely from the above.

## Tone and voice

The ROS page reads as a features list. LuaRover's page should read closer
to how the thesis itself explains things: matter-of-fact, willing to spend
a paragraph on a mechanism instead of a one-line bullet, no superlatives
("seamless", "powerful", "cutting-edge"), no em dashes anywhere in the
copy (use commas, periods, or parentheses instead). Where a section covers
a genuinely tricky piece of engineering (the C/Dart callback bridge, the
panic-isolation chain, the frame-recording game engine), the copy explains
the constraint, the mechanism chosen, and why it matters, the same way a
developer would explain it to another developer, not why a reader should
be impressed by it.

## Part A: Generic component library

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
| `CodeBlock` | Monospace code panel with an optional filename/label, for showing a real source snippet | new; ROS has no equivalent, LuaRover needs it to show actual Lua |

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

## Part B: LuaRover page

New files: `src/pages/LuaRover.tsx`, `src/pages/LuaRover.css` (accent
override only), `src/data/luaRover.ts`. Route added in `App.tsx` at
`/lua-rover`.

Section order is deliberately not a 1:1 reskin of ROS. It borrows the same
component library but follows its own narrative shape: motivate the
problem, show the product, then go deep on the one component that is
genuinely hard to build, before covering the other two more briefly.

1. **Hero**: eyebrow "LuaRover"; title/lead framed around bridging
   block-based and real-syntax coding for 10-14 year-olds via sandboxed,
   offline-first Lua execution. Hero image: the space-themed main-menu
   screenshot. CTA row: primary anchor-scrolls to "See it in action", ghost
   "Back to projects" (no external links, since neither repo is public).
2. **Objectives** (`BulletList`, subtle, 2 longer items instead of ROS's 4
   short ones): the two strategic goals the thesis derives from its
   Enterprise Design Thinking pass: an execution environment that works
   offline on old or borrowed hardware, and a learning loop where every
   line of code has an immediate, visible effect instead of a console
   line. Each bullet is a sentence or two, not a fragment.
3. **Why the existing options fall short** (`Section`, prose + a compact
   `BulletList`, no ROS equivalent): the actual dichotomy from the
   thesis's market analysis: block-based tools (Scratch, Blockly) never
   expose real syntax, syntax-first mobile apps (SoloLearn, Mimo) reduce
   feedback to console text and need a permanent connection because
   evaluation happens server-side, and Hour-of-Code-style hybrids don't
   work on a touchscreen or offline. On the technical side, the closest
   existing Dart package (`lua_dardo`) reimplements the Lua VM in Dart
   instead of binding the official C engine, which is why it drifts from
   real Lua behavior, is stuck on Lua 5.3, has no debug hooks, and hasn't
   been maintained in years, that gap is the direct reason `lua_native`
   exists as its own package.
4. **See it in action** (`SplitMediaSection`, stacked, anchor target): the code editor + grid + step debugger screenshot, explaining what's
   on screen: the rover moves on a grid as each instruction executes, and
   the debug view lets a student scrub back and forth through a run
   instead of only seeing the final state.
5. **Bridging Dart and Lua** (`Section`, the deep-dive; two or three
   `SplitMediaSection`/prose blocks that read as one continuous
   explanation, not separate cards): this is where the case study
   explains the actual hard problem: the official Lua engine is a C
   library with no notion of Dart, so every function crossing that
   boundary has to survive two mismatches. First, error handling: Lua's
   default reaction to a fatal error is to call `abort()`, which would
   kill the whole app, so the C adapter wraps every exported call in a
   `setjmp`/`longjmp` guard that catches the panic and hands a normal
   error back to Dart instead of crashing. Second, callbacks: Dart's FFI
   can only hand the Lua VM a single static function pointer, but the
   app needs to register many different Dart callbacks, so instead of one
   pointer per callback, a single C "trampoline" and a single Dart
   dispatcher are shared by all of them, and a small integer id (stored
   as a Lua closure upvalue) is what tells the dispatcher which
   registered Dart function to actually call. The same C header then
   feeds two independent codegen paths, `ffigen`/libclang for the native
   FFI bindings and a small custom parser for the WebAssembly bindings,
   so the layer above never has to know which platform it's running on.
6. **Reading a mission** (`CodeBlock` + short prose, new section type): an actual snippet from one of the in-app lessons (the wall-detection
   script from the "Check Before Moving" activity), used to point out why
   Lua specifically: no mandatory semicolons, `do`/`end` instead of
   braces, 1-indexed tables, a syntax chosen to lower the cognitive load
   for a 10-14 year old reading it for the first time.
7. **The client's game engine** (`SplitMediaSection`, media-left,
   game-engine diagram + `MediaCollage` of the mobile screenshots): shorter than section 5: the client runs a minimal CQRS-style engine
   that records every frame of a run atomically, which is what makes the
   step debugger in section 4 possible without re-running the script, and
   state is exposed to the UI through Cubit rather than raw Bloc streams
   to keep the call sites simple.
8. **The backend** (`SplitMediaSection`, media-right, server class diagram
   plus the auth-flow diagram folded into the same block via
   `MediaCollage`): also shorter: Clean Architecture layering, JWT
   access tokens paired with SHA-256-hashed refresh tokens so a stolen
   database dump doesn't hand out live sessions, and asynchronous
   generation of the multilingual lesson packages the client downloads
   for offline use.
9. **Numbers** (`StatsRow`, one short framing sentence above it): 770
   automated tests, 96.8% coverage on `lua_native` across both the native
   and web targets, 100% coverage on `lua_bridge`. Framed briefly on why
   this mattered here specifically: a script a child wrote has to behave
   identically whether it runs through FFI or WASM, so the two
   implementations of every capability are tested against the same
   suites.

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
- No GitHub/demo links for LuaRover (not public yet): can be added later
  by editing `featuredProjects.ts` / the hero CTA row.
- No changes to unrelated pages/sections of the portfolio.
