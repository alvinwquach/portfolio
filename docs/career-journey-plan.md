# Career Journey — Animation Choreography Plan

Three spatial phases pinned to scroll, connected by a single SVG path
that draws progressively as the user scrolls through.

Design principle: **every transition is physical** — clip, translate, scale,
stroke-draw. No opacity fades. The journey should feel like walking through
rooms, not watching slides dissolve.

---

## Architecture

```
<section.career-journey>                    ← one continuous section
  <svg.connecting-path>                     ← position:absolute, spans full height
    <path pathLength="1" />                 ← stroke-dashoffset animated 1→0
  </svg>
  <div.phase phase-1>                       ← pinned individually
  <div.phase phase-2>
  <div.phase phase-3>
</section>
```

- The outer `<section>` is **not** pinned — each `.phase` div pins itself.
- The SVG sits behind all phases (`z-0`) and draws as the user scrolls
  through the combined height of all three pinned regions.
- A scoped CSS custom property `--phase-accent` on the `<section>` is
  animated by GSAP to shift the accent color as each phase enters.

---

## Color System

| Phase | Name    | Token              | HSL value              |
|-------|---------|--------------------|------------------------|
| 1     | SYSTEMS | `--ds-info`        | `188 95% 43%` (cyan)   |
| 2     | PEOPLE  | `--ds-accent-warm` | `43 96% 56%` (amber)   |
| 3     | CODE    | `--ds-accent`      | `262 52% 66%` (violet) |

**Technique:** `gsap.to(sectionRef, { '--phase-accent': 'hsl(...)' })`
scoped to the journey section. Every element using
`color: var(--phase-accent)` updates simultaneously — phase numbers,
the connecting path stroke, the active border on role cards.

**Transition timing:** Each color shift begins when the new phase's
ScrollTrigger `start` fires and completes over `0.4s` with `power2.inOut`.
This is independent of the scrub — it's a discrete toggle, not a
continuously scrubbed value, because mid-blend colors (cyan↔amber) produce
muddy greens that look broken.

---

## Connecting SVG Path

**Shape:** A flowing S-curve that runs the full height of the journey section.
On desktop it meanders left→right→left between phases; on mobile it is a
gentle vertical wave (amplitude reduced to ~20px).

**Drawing technique:**
```
<path
  d="M ... (computed at mount based on phase element positions)"
  pathLength="1"
  stroke="var(--phase-accent)"
  stroke-width="2"
  stroke-dasharray="1"
  stroke-dashoffset="1"              ← fully hidden initially
  fill="none"
/>
```

- `pathLength="1"` normalizes the math: offset `1` = fully hidden, `0` = fully drawn.
- A single ScrollTrigger on the outer section (not pinned, just tracking)
  scrubs `stroke-dashoffset` from `1 → 0` across the entire journey scroll range.
- `scrub: 0.5` — tighter than the 1s used in ProjectGallery because the
  path drawing should feel directly coupled to scroll position.

**Per-phase behavior:**
- Phase 1 entry (0–33% progress): path draws first third, stroke is cyan.
- Phase 2 entry (33–66%): path draws middle third, stroke shifts to amber.
- Phase 3 entry (66–100%): path draws final third, stroke shifts to violet.

The stroke color changes are handled by the `--phase-accent` CSS property
animation (see Color System above), not by changing the SVG `stroke`
attribute directly — one animation, one source of truth.

---

## Phase 1 — SYSTEMS

> Manufacturing → systems thinking, QA discipline

### Layout

```
Desktop (≥768px):                    Mobile (<768px):
┌─────────────────────────────┐     ┌───────────────────┐
│ [01]  phase number (8xl)    │     │ [01]              │
│                             │     │ SYSTEMS           │
│  SYSTEMS     ┌────────────┐ │     │ Manufacturing...  │
│  Mfg → ...   │ Role Card  │ │     │                   │
│              │ Role Card  │ │     │ ┌───────────────┐ │
│              │ Role Card  │ │     │ │ Role Card     │ │
│              └────────────┘ │     │ │ Role Card     │ │
└─────────────────────────────┘     │ │ Role Card     │ │
                                    └───────────────────┘
```

- Desktop: 2-column grid. Left: phase number + title + subtitle. Right: role cards stacked vertically.
- Mobile: single column, phase number above title, cards below.

### Pin Duration

- Desktop: `end: '+=120%'` — enough scroll runway for the phase number scale-back + card staggers to complete without rushing.
- Mobile: **no pin** — vertical stack scrolls naturally. Pinning multiple phases on mobile creates scroll-jail.

### Animation Sequence (desktop)

| Order | Element        | Property                            | From → To             | Duration | Delay    | Ease          | Trigger                                        |
|-------|----------------|-------------------------------------|-----------------------|----------|----------|---------------|-------------------------------------------------|
| 1     | Phase number   | `scale`                             | `2 → 1`              | `0.8s`   | `0`      | `power3.out`  | ScrollTrigger `start: 'top top'`, `toggleActions: 'play none none none'` |
| 1     | Phase number   | `transformOrigin`                   | `center center` (set) | —        | —        | —             | `gsap.set()` before tween                       |
| 2     | Section title  | AnimatedText `words-up`             | `y:30 → 0`           | `0.75s`  | `0.3s`   | `power3.out`  | Same ScrollTrigger (delay offsets it)            |
| 3     | Subtitle       | AnimatedText `lines-clip`           | `clipPath inset`      | `0.7s`   | `0.5s`   | `power2.inOut` | Same ScrollTrigger                              |
| 4     | Role cards     | `y` + `clipPath`                    | `y:40, inset(0 0 100% 0) → y:0, inset(0)` | `0.6s` | `0.7s` base + `0.1s` stagger | `power2.out` | Same ScrollTrigger |
| 5     | Color shift    | `--phase-accent`                    | previous → `hsl(188 95% 43%)` | `0.4s` | `0`     | `power2.inOut` | Phase 1 is the initial state — no animation needed |

### Animation Sequence (mobile)

No pin. Each element uses its own ScrollTrigger at `start: 'top 85%'`:

| Element      | Animation                          | Stagger |
|--------------|------------------------------------|---------|
| Phase number | `scale(2) → 1`                    | —       |
| Title        | AnimatedText `words-up`            | `0.06`  |
| Subtitle     | AnimatedText `lines-clip`          | `0.12`  |
| Role cards   | `y:40` + `clipPath inset` per card | `0.1`   |

### Timing Values Reference

```
Phase number scale:  duration 0.8s, ease power3.out
Title words-up:      duration 0.75s, stagger 0.06s, ease power3.out
Subtitle lines-clip: duration 0.7s, stagger 0.12s, ease power2.inOut
Role cards:          duration 0.6s, stagger 0.1s, ease power2.out
Color shift:         duration 0.4s, ease power2.inOut
```

---

## Phase 2 — PEOPLE

> Community management → user empathy, listening

### Layout

Same 2-column grid as Phase 1, mirrored:
- Desktop: role cards on the **left**, text on the **right** — alternating sides between phases creates visual rhythm and prevents the eye from glazing.
- Mobile: identical single-column stack (no mirror needed).

### Pin Duration

- Desktop: `end: '+=120%'` — same cadence as Phase 1 for consistent rhythm.
- Mobile: no pin.

### Animation Sequence (desktop)

Identical structure to Phase 1 with these differences:

| Difference     | Value                                        |
|----------------|----------------------------------------------|
| Color shift    | `--phase-accent` animates to `hsl(43 96% 56%)` (amber) |
| Color trigger  | Fires at Phase 2 ScrollTrigger `start: 'top top'`, `duration: 0.4s` |
| Mirror layout  | Cards column is `order-first` on desktop     |

All other timings, staggers, and eases are identical to Phase 1.
Consistency between phases is intentional — the rhythm should feel like
a heartbeat, not a jazz solo.

### Animation Sequence (mobile)

Identical to Phase 1 mobile. Color shift happens via the same
ScrollTrigger that triggers the phase number animation.

---

## Phase 3 — CODE

> Engineering → combining both into shipped products

### Layout

Same grid as Phase 1 (cards on right), but with an additional element:
a "convergence moment" at the bottom that visually merges the SYSTEMS
and PEOPLE threads into CODE.

```
Desktop:
┌─────────────────────────────┐
│ [03]                        │
│                             │
│  CODE        ┌────────────┐ │
│  Combining   │ Role Card  │ │
│  both into   │ Role Card  │ │
│  shipped     └────────────┘ │
│  products                   │
│                             │
│  ┌─────────────────────────┐│
│  │ CONVERGENCE STRIP       ││
│  │ "Systems + People = 🚀" ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

The convergence strip is a full-width bar at the bottom of Phase 3
showing the three skill categories merging: systems thinking, user empathy,
and engineering. It uses the violet accent and `AnimatedText scale-in`.

### Pin Duration

- Desktop: `end: '+=150%'` — **longer** than Phase 1/2. The extra 30%
  gives the convergence strip time to animate after the role cards land.
  The journey's climax deserves more breathing room.
- Mobile: no pin. Convergence strip enters with its own ScrollTrigger.

### Animation Sequence (desktop)

| Order | Element            | Property                          | From → To             | Duration | Delay    | Ease          |
|-------|--------------------|-----------------------------------|-----------------------|----------|----------|---------------|
| 1     | Phase number       | `scale`                           | `2 → 1`              | `0.8s`   | `0`      | `power3.out`  |
| 2     | Section title      | AnimatedText `words-up`           | `y:30 → 0`           | `0.75s`  | `0.3s`   | `power3.out`  |
| 3     | Subtitle           | AnimatedText `lines-clip`         | `clipPath inset`      | `0.7s`   | `0.5s`   | `power2.inOut` |
| 4     | Role cards         | `y:40` + `clipPath`               | hidden → visible      | `0.6s`   | `0.7s+stagger` | `power2.out` |
| 5     | Color shift        | `--phase-accent`                  | amber → `hsl(262 52% 66%)` | `0.4s` | `0`   | `power2.inOut` |
| 6     | Convergence strip  | AnimatedText `scale-in`           | `scaleY:0 → 1`       | `0.55s`  | `1.2s`   | `power2.out`  |
| 6     | Convergence skills | `y:20` + `clipPath inset`         | hidden → visible      | `0.5s`   | `1.4s+0.08s stagger` | `power2.out` |

### Animation Sequence (mobile)

Same as Phase 1/2 mobile, plus:
- Convergence strip: own ScrollTrigger at `start: 'top 85%'`.

---

## Responsive Breakpoints

| Breakpoint   | Layout                  | Pin  | SVG path              |
|--------------|-------------------------|------|-----------------------|
| ≥1024px (lg) | 2-col grid, alternating | Yes  | Full S-curve          |
| 768–1023 (md)| 2-col grid, narrower    | Yes  | Reduced amplitude     |
| <768px (sm)  | 1-col stack             | No   | Vertical wave (±20px) |

### Mobile-specific decisions

1. **No pin** — multiple consecutive pinned sections on mobile create
   "scroll jail" where the user feels trapped. Vertical scroll is the
   native mobile idiom; respect it.
2. **Each element gets its own `ScrollTrigger`** at `start: 'top 85%'`
   with `toggleActions: 'play none none none'` — fire once on entry.
3. **SVG path amplitude** reduced from ~80px desktop to ~20px mobile
   to prevent it from overflowing the narrow viewport.
4. **Phase layout does not mirror** on mobile — cards always appear
   below text. The alternating pattern is a desktop spatial cue that
   doesn't translate to a single-column stack.

---

## SVG Path — Responsive Shape

Desktop path (conceptual control points):
```
M  centerX, phase1Top
C  centerX+80, phase1Mid,  centerX-80, phase2Top,  centerX, phase2Mid
C  centerX+80, phase2Bot,  centerX-80, phase3Top,  centerX, phase3Bot
```

Mobile path:
```
M  centerX, phase1Top
C  centerX+20, phase1Mid,  centerX-20, phase2Top,  centerX, phase2Mid
C  centerX+20, phase2Bot,  centerX-20, phase3Top,  centerX, phase3Bot
```

Actual `d` values are computed at mount time by reading the DOM positions
of each phase container, then constructing cubic bezier control points
that flow through their vertical centers.

`ResizeObserver` recalculates the path on layout changes.

---

## Timing Reference (all phases)

```
GLOBAL
  SVG path scrub:             scrub: 0.5, start: 'top top', end: 'bottom bottom'
  Color shift per phase:      duration: 0.4s, ease: power2.inOut

PER PHASE (identical cadence)
  Phase number scale:         scale 2→1, duration: 0.8s, ease: power3.out
  Title (AnimatedText):       words-up, duration: 0.75s, stagger: 0.06, delay: 0.3s
  Subtitle (AnimatedText):    lines-clip, duration: 0.7s, stagger: 0.12, delay: 0.5s
  Role cards:                 y:40 + clipPath inset, duration: 0.6s, stagger: 0.1, delay: 0.7s
  Convergence (Phase 3 only): scale-in + skill badges, delay: 1.2s

MOBILE (no pin, own ScrollTriggers at top 85%)
  Same durations/eases, delay: 0 (each element triggers independently)
```

---

## Implementation Checklist

- [ ] Scoped `--phase-accent` CSS custom property on section element
- [ ] SVG `<path>` with `pathLength="1"`, stroke-dasharray/dashoffset
- [ ] Per-phase ScrollTrigger with `pin: true` (desktop only via matchMedia)
- [ ] Phase number: `gsap.from(el, { scale: 2 })` with `transformOrigin: 'center center'`
- [ ] Role cards: `gsap.from(el, { y: 40, clipPath: 'inset(0 0 100% 0)' })`
- [ ] Color shift: `gsap.to(section, { '--phase-accent': '...' })` on each phase entry
- [ ] AnimatedText for title (`words-up`), subtitle (`lines-clip`), convergence (`scale-in`)
- [ ] `gsap.matchMedia()` branching: desktop (pin + alternating grid) vs mobile (stack + individual triggers)
- [ ] Cleanup: `mm.revert()` + `gsap.context().revert()` on unmount
