# Inner Demons RPG

**A mobile web game where you capture and battle manifestations of internal struggles.**

---

## Core Value

**Recognition as gameplay.** The core loop isn't fighting — it's understanding. You survive a demon's attack patterns, identify what it really is, and by naming it correctly, you capture it. The mechanic is the metaphor.

---

## What This Is

A single-player, self-reflective JRPG for mobile web where psychological states become demons with real tradeoffs:

- **Anxiety** gives faster turns but drains health over time
- **Confidence** buffs your party but shatters if hit by "Public Failure"
- **Procrastination** builds power the longer you wait, but you might not act in time

The game learns about the player through their actions. Battle style, avoidance patterns, demon preferences — all tracked and reflected back through:

- Cynical therapist narrator ("You've been avoiding a lot of battles. I noticed.")
- Demon behavior that responds to playstyle
- Multiple endings based on how you actually played, not what you said

**Tone:** Dark comedy, self-deprecating, brutally honest. The humor comes from recognition — "Oh no, this is me."

---

## The Experience

**Setting:** A dreamscape you can't escape. No waking up. You're trapped until you survive.

**Player:** Blank slate. The game learns who you are through actions, not backstory.

**Guide:** An exhausted professional therapist. Jaded, dark humor, has seen a thousand players. Not mean — just tired.

**Goal:** Survival. Not escape, not mastery — just making it through the night.

**Areas:** The dreamscape shifts based on emotional state. Prototype focuses on **The Maze** (overthinking, paths loop back, confusing navigation). Future: The Fog (anxiety), The Void (depression), The Stage (impostor syndrome), The Fire (burnout).

---

## Core Loop

1. **Encounter** — Wild demon appears in the dreamscape
2. **Battle** — Turn-based JRPG combat, 1 minute max, demon-dependent stances
3. **Recognize** — Survive the attack pattern, name the demon correctly
4. **Capture** — Named demon joins your collection
5. **Progress** — Level up demons, unlock abilities
6. **Boss** — Face The Mask (Impostor Syndrome) as first boss
7. **Repeat** — Avoided demons return later as bosses, stronger

---

## Key Mechanics

### Recognition Capture

You don't beat demons down and catch them. You:
1. Survive their attack patterns
2. Recognize what they really are
3. Name them correctly
4. They join you

Misidentify them? They flee or attack harder. The game tests your emotional literacy.

### Demon-Dependent Stances

Each demon has unique stance options:
- **Anxiety:** Panicked (fast, drain) / Managed (slower, stable)
- **Procrastination:** Avoiding (power buildup) / Confronting (attack now, weaker)

Player encounters demons of the same type with random stances. Variety in enemies, depth in strategy.

### Activated Abilities with Context-Dependent Tradeoffs

Abilities are optional. You choose when to trigger:
- **Anxiety's "Overthink"** — Double turn speed, but lose 10% health
- **Confidence's "Speak Up"** — Buff party attack, but become vulnerable to criticism

Context matters — Anxiety is good for speed battles, bad for endurance.

### Avoidance Has Consequences

You can choose not to fight. But:
- Avoided demons become bosses later
- They return stronger
- The game remembers

This is the core metaphor: avoidance makes things worse.

---

## Demon Roster (Prototype)

**Core Demons:**
- **Anxiety** — Speed boost, health drain. Stances: Panicked / Managed
- **Procrastination** — Delayed power, action risk. Stances: Avoiding / Confronting
- **Confidence** — Buffs others, fragile. Shatters on "Public Failure"
- **Numbness** — Tank, absorbs damage, low offense. Stances: Numb / Feeling
- **Mania** — Wildcard, unpredictable effects. High variance
- **Hope** — Support, stabilizes others. Stances: Cautious / Reckless

**Bosses:**
- **The Mask (Impostor Syndrome)** — First boss. Copies your abilities, appears as you
- **The Spiral (Panic Attack)** — Escalating speed and damage
- **The Void (Depression)** — Drains your demons' will to fight
- **The Critic (Inner Critic)** — Attacks your captured demons' weaknesses

Avoided demons return as bosses with enhanced abilities.

---

## The Profiling System

The game tracks player behavior:
- **Battle style:** Aggressive vs defensive vs avoidance
- **Demon preferences:** Which ones fielded, which neglected
- **Stance choices:** Lean into anxiety or manage it?
- **Avoidance patterns:** What do you skip? What comes back stronger?
- **Boss performance:** How do you handle The Mask, The Spiral, etc.

This manifests through:
- Therapist commentary on patterns
- Demon behavior responding to playstyle
- **Multiple endings** based on actual behavior

### Possible Endings

- **The Avoider** — "You ran from everything. The demons are still there. But at least you're fast now."
- **The Grinder** — "You fought every battle. You're exhausted. But you're strong."
- **The Balancer** — "You picked your battles. Some things you faced, some you deferred. That's called living."
- **The Self-Destroyer** — "You used Anxiety and Burnout on everything. You won, but at what cost?"
- **The Integrated** — "You accepted every demon. They're not enemies anymore. They're just... you."

---

## Visual & Audio

**Art Style:** Pixel art, retro aesthetic, accessible indie vibe

**Orientation:** Portrait mode for mobile

**Session Length:** 1-minute battles, 10-15 minute sessions

**Platform:** Mobile web app (touch-first)

---

## Tech Stack

- **Engine:** Phaser 3
- **Language:** TypeScript
- **Bundler:** Vite (Vercel-friendly output)
- **Art:** Pixel sprites (Aseprite or similar)
- **Audio:** TBD (8-bit style fits theme)
- **Storage:** LocalStorage for profiling persistence
- **Deployment:** Vercel (static hosting with CDN)

---

## Prototype Scope

**Must have:**
- [ ] Encounter wild demon in The Maze
- [ ] Turn-based battle (stance system, 1 min max)
- [ ] Recognition capture (survive + name)
- [ ] Field captured demons in next battle
- [ ] Level up demons, unlock abilities
- [ ] First boss: The Mask
- [ ] Basic profiling (20-30 tracked behaviors)
- [ ] Exhausted therapist narrator (text)
- [ ] Pixel art sprites for core demons

**Nice to have:**
- [ ] Sound effects
- [ ] Multiple endings prototype
- [ ] Second area (The Fog)

**Not in prototype:**
- Full demon roster (6 core + 1 boss is enough)
- All areas (just The Maze)
- Complex audio/music
- Multiplayer

---

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Recognition over combat capture | Mechanic IS the metaphor | Pending |
| Demon-dependent stances | Variety in enemies, depth in strategy | Pending |
| Avoidance = boss later | Core metaphor: avoidance makes things worse | Pending |
| Single area for prototype | Constraint enables completion | Pending |
| Phaser 3 over Canvas | Faster prototyping, good docs | Pending |
| Portrait mobile web | Accessibility, touch-first | Pending |

---

## Success Criteria

The prototype succeeds when:
1. A player can encounter, battle, and capture a demon in under 2 minutes
2. The stance system creates meaningful tactical choices
3. The recognition moment feels like an "aha" — "Oh, this is Anxiety"
4. The therapist's voice establishes the tone in first encounter
5. The Mask boss fight teaches boss mechanics
6. Profiling changes *something* about the ending

---

## Out of Scope (v1)

- Multiplayer
- Full demon roster (15+)
- All dreamscape areas
- Complex audio engine
- Native mobile apps
- Monetization
- Social features
- Accessibility beyond basic mobile touch

---

*Last updated: 2026-03-22 after initialization*
