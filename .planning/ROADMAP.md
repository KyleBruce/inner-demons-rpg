# Roadmap — Inner Demons RPG

**Version:** v1 Prototype
**Created:** 2026-03-22

---

## Overview

**6 Phases** | **67 Requirements** | All v1 requirements covered ✓

This roadmap builds a playable prototype in layers: foundation → combat → capture → content → intelligence → polish.

---

## Phase 1: Foundation

**Goal:** Get a Phaser 3 game running with basic game loop and placeholder assets.

**Requirements:** TECH-01, TECH-02, TECH-03, TECH-04, TECH-05, UI-01, UI-02, UI-03, UI-05

**Plans:**
1. Set up Phaser 3 project with TypeScript
2. Create mobile-responsive canvas (portrait, touch-first)
3. Implement basic scene structure (Title → Battle → Results)
4. Add placeholder pixel art sprites
5. Set up LocalStorage infrastructure

**Success Criteria:**
- [ ] Game loads on mobile browser in portrait mode
- [ ] Can tap through Title → Battle → Results scenes
- [ ] No hover states, touch-only interactions
- [ ] Project deployable as static site

---

## Phase 2: Battle System

**Goal:** Build the core JRPG combat with stance mechanics and abilities.

**Requirements:** CORE-02, STANCE-01, STANCE-02, STANCE-03, STANCE-04, ABIL-01, ABIL-02, ABIL-03, ABIL-04, UI-04

**Plans:**
1. Implement turn-based combat loop (player turn, enemy turn, resolution)
2. Create stance system (each demon has 2+ stances)
3. Build ability activation (choose when to trigger, pay costs)
4. Add 1-minute battle timer
5. Implement context-dependent tradeoffs

**Success Criteria:**
- [ ] Can fight a placeholder demon with stance choices
- [ ] Abilities have visible tradeoffs (benefit + cost)
- [ ] Battle ends (win/lose/timeout) within 1 minute
- [ ] Stance changes are meaningful tactical choices

---

## Phase 3: Capture & Collection

**Goal:** Implement recognition capture and demon collection mechanics.

**Requirements:** CORE-01, CORE-03, CORE-04, CORE-05, CORE-06, CORE-07, PROG-01, PROG-02, PROG-03, PROG-04

**Plans:**
1. Build encounter system (wild demons appear in The Maze)
2. Create recognition capture (survive patterns, name correctly)
3. Handle misidentification (flee or attack harder)
4. Build demon collection/inventory
5. Implement fielding (choose which demons to battle with)
6. Add leveling system (XP, unlock abilities)

**Success Criteria:**
- [ ] Can encounter wild demon in The Maze
- [ ] Can recognize and capture demon by naming
- [ ] Can field captured demons in next battle
- [ ] Misidentification has consequences
- [ ] Demons level up from battles

---

## Phase 4: Core Content

**Goal:** Add all 6 core demons, The Maze area, and The Mask boss.

**Requirements:** ANX-01 through ANX-04, PROC-01 through PROC-04, CONF-01 through CONF-04, NUMB-01 through NUMB-04, MANIA-01 through MANIA-04, HOPE-01 through HOPE-04, MASK-01 through MASK-05, WORLD-01, WORLD-02, WORLD-03, AVOID-01, AVOID-02, AVOID-03

**Plans:**
1. Implement Anxiety demon (speed/drain, stances, ability)
2. Implement Procrastination demon (delayed power, stances, ability)
3. Implement Confidence demon (buff, fragile, ability)
4. Implement Numbness demon (tank, low offense, ability)
5. Implement Mania demon (wildcard, unpredictable, ability)
6. Implement Hope demon (support, stabilizer, ability)
7. Build The Maze area (looping paths, confusing navigation)
8. Create The Mask boss (copies abilities, multiple phases)
9. Implement avoidance → boss escalation

**Success Criteria:**
- [ ] All 6 core demons playable with unique mechanics
- [ ] Can navigate The Maze and encounter demons
- [ ] Can fight and defeat The Mask (first boss)
- [ ] Avoided demons return as stronger bosses
- [ ] Each demon feels mechanically and thematically distinct

---

## Phase 5: Profiling & Narration

**Goal:** Add behavior tracking, therapist narrator, and multiple endings.

**Requirements:** PROF-01 through PROF-08, NARR-01 through NARR-05, END-01 through END-06, AVOID-04

**Plans:**
1. Build profiling system (track battle style, demon preferences, stance choices, avoidance)
2. Implement LocalStorage persistence
3. Create therapist narrator system (cynical commentary based on patterns)
4. Write therapist dialogue for key moments
5. Implement ending calculator (weight behaviors, select ending)
6. Write 5-6 ending variants

**Success Criteria:**
- [ ] Game tracks player behavior across sessions
- [ ] Therapist comments on patterns ("You've been avoiding...")
- [ ] Ending reflects actual playstyle, not just final choice
- [ ] At least 3 distinct endings achievable

---

## Phase 6: Polish & Testing

**Goal:** Refine UI, balance combat, fix bugs, validate prototype.

**Requirements:** WORLD-04 (partial), remaining polish items

**Plans:**
1. UI polish (animations, feedback, clarity)
2. Combat balance (tuning numbers, ability costs, stance effects)
3. Playtesting (internal + external)
4. Bug fixes and edge cases
5. Performance optimization (mobile web)
6. Deployment setup (static hosting)

**Success Criteria:**
- [ ] Game feels good to play on mobile
- [ ] Combat is balanced (no dominant strategy)
- [ ] All core features work without major bugs
- [ ] Deployable to itch.io or similar
- [ ] External playtesters can complete prototype

---

## Phase Order Rationale

1. **Foundation first** — Can't build without Phaser running
2. **Battle second** — Core mechanic, proves the combat loop
3. **Capture third** — Builds on battle, adds collection layer
4. **Content fourth** — Fill in demons and boss, make it a game
5. **Profiling fifth** — Adds intelligence and personality
6. **Polish sixth** — Final pass before release

Dependencies:
- Phase 3 requires Phase 2 (can't capture without battles)
- Phase 4 requires Phase 3 (can't add content without collection)
- Phase 5 requires Phase 4 (can't profile without content)
- Phase 6 requires all previous

---

## Milestone Markers

| Milestone | Trigger | Meaning |
|-----------|---------|---------|
| First Battle | Phase 2 complete | Core loop works |
| First Capture | Phase 3 complete | Full loop works |
| The Mask Defeated | Phase 4 complete | Game is playable |
| First Ending | Phase 5 complete | Vision realized |
| Prototype Ship | Phase 6 complete | Ready for players |

---

*Roadmap locked for prototype. Phases may be refined during planning.*
