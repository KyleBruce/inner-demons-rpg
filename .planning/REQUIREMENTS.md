# Requirements — Inner Demons RPG

**Version:** v1 Prototype
**Updated:** 2026-03-22

---

## v1 Requirements

### CORE-CAPTURE

- [ ] **CORE-01**: Player encounters wild demons in The Maze
- [ ] **CORE-02**: Player enters turn-based battle with demon (1 min max)
- [ ] **CORE-03**: Player survives demon's attack patterns
- [ ] **CORE-04**: Player names demon correctly to capture
- [ ] **CORE-05**: Misidentification causes demon to flee or attack harder
- [ ] **CORE-06**: Captured demon joins player's collection
- [ ] **CORE-07**: Player fields captured demons in subsequent battles

### CORE-STANCE

- [ ] **STANCE-01**: Each demon has 2+ stance options (demon-dependent)
- [ ] **STANCE-02**: Player encounters same demon types with random stances
- [ ] **STANCE-03**: Stance changes available abilities and stat modifiers
- [ ] **STANCE-04**: Stance switch costs a turn (if during battle)

### CORE-ABILITIES

- [ ] **ABIL-01**: Demons have activated abilities (player chooses when to trigger)
- [ ] **ABIL-02**: Abilities have tradeoffs (benefit + cost)
- [ ] **ABIL-03**: Tradeoffs are context-dependent (Anxiety good for speed, bad for endurance)
- [ ] **ABIL-04**: Player unlocks new abilities through leveling

### CORE-AVOIDANCE

- [ ] **AVOID-01**: Player can choose to skip/avoid battles
- [ ] **AVOID-02**: Avoided demons return later as bosses
- [ ] **AVOID-03**: Returned bosses are stronger than original encounter
- [ ] **AVOID-04**: Game tracks avoidance patterns for profiling

### DEMON-ANXIETY

- [ ] **ANX-01**: Anxiety demon grants speed boost when active
- [ ] **ANX-02**: Anxiety drains player health over time (passive)
- [ ] **ANX-03**: Anxiety has stances: Panicked (fast/drain) / Managed (slower/stable)
- [ ] **ANX-04**: Anxiety's "Overthink" ability: double turn speed, lose 10% health

### DEMON-PROCRASTINATION

- [ ] **PROC-01**: Procrastination builds power over time (delayed action)
- [ ] **PROC-02**: Procrastination has stances: Avoiding (buildup) / Confronting (immediate, weaker)
- [ ] **PROC-03**: Procrastination's "One More Turn" ability: skip turn, major power boost next turn
- [ ] **PROC-04**: Procrastination risk: might not act in time if battle ends

### DEMON-CONFIDENCE

- [ ] **CONF-01**: Confidence buffs other demons' attack/defense
- [ ] **CONF-02**: Confidence is fragile — shatters on "Public Failure" attack type
- [ ] **CONF-03**: Shattered Confidence becomes Numbness temporarily
- [ ] **CONF-04**: Confidence's "Speak Up" ability: major buff, become vulnerable to criticism

### DEMON-NUMBNESS

- [ ] **NUMB-01**: Numbness absorbs damage (tank role)
- [ ] **NUMB-02**: Numbness has low offensive capability
- [ ] **NUMB-03**: Numbness has stances: Numb (tank) / Feeling (balanced)
- [ ] **NUMB-04**: Numbness's "Dissociate" ability: nullify next 2 hits, lose ability to act

### DEMON-MANIA

- [ ] **MANIA-01**: Mania has unpredictable effects (wildcard)
- [ ] **MANIA-02**: Mania's effects range from very positive to very negative
- [ ] **MANIA-03**: Mania's "Hypomanic" ability: random buff to random stat, random duration
- [ ] **MANIA-04**: High variance makes Mania risky but potentially game-changing

### DEMON-HOPE

- [ ] **HOPE-01**: Hope provides support effects (stabilizes other demons)
- [ ] **HOPE-02**: Hope has stances: Cautious (small stable buffs) / Reckless (big buffs, fragile)
- [ ] **HOPE-03**: Hope's "Hold On" ability: prevent one demon from being defeated
- [ ] **HOPE-04**: Hope is weak offensively but enables other demons

### BOSS-THEMASK

- [ ] **MASK-01**: The Mask (Impostor Syndrome) is first boss
- [ ] **MASK-02**: The Mask copies player's abilities and demons
- [ ] **MASK-03**: The Mask appears visually similar to player
- [ ] **MASK-04**: The Mask has multiple phases
- [ ] **MASK-05**: Defeating The Mask teaches boss battle mechanics

### WORLD-DREAMSCAPE

- [ ] **WORLD-01**: Game takes place in dreamscape (no escape)
- [ ] **WORLD-02**: Prototype features The Maze area (overthinking theme)
- [ ] **WORLD-03**: The Maze has looping paths and confusing navigation
- [ ] **WORLD-04**: Dreamscape shifts based on player state (future expansion)

### PROFILING-SYSTEM

- [ ] **PROF-01**: Game tracks battle style (aggressive/defensive/avoidance)
- [ ] **PROF-02**: Game tracks demon preferences (which fielded, which neglected)
- [ ] **PROF-03**: Game tracks stance choices (lean into anxiety or manage?)
- [ ] **PROF-04**: Game tracks avoidance patterns (what skipped, what returned)
- [ ] **PROF-05**: Game tracks boss performance (how handled each boss)
- [ ] **PROF-06**: Profile persists across sessions (LocalStorage)
- [ ] **PROF-07**: Profiling affects therapist commentary
- [ ] **PROF-08**: Profiling determines ending variant

### NARRATOR-THERAPIST

- [ ] **NARR-01**: Exhausted professional therapist narrates the game
- [ ] **NARR-02**: Therapist has cynical, dark humor voice
- [ ] **NARR-03**: Therapist comments on player patterns based on profiling
- [ ] **NARR-04**: Therapist establishes tone in first encounter
- [ ] **NARR-05**: Therapist is jaded but not cruel

### ENDINGS-MULTIPLE

- [ ] **END-01**: Game has multiple endings based on player behavior
- [ ] **END-02**: The Avoider ending (skipped everything, demons still there, but fast)
- [ ] **END-03**: The Grinder ending (fought everything, exhausted but strong)
- [ ] **END-04**: The Balancer ending (picked battles, healthy approach)
- [ ] **END-05**: The Self-Destroyer ending (used Anxiety/Burnout on everything, won at cost)
- [ ] **END-06**: The Integrated ending (accepted every demon, they're just you now)

### PROGRESSION-LEVEL

- [ ] **PROG-01**: Demons gain XP from battles
- [ ] **PROG-02**: Demons level up and unlock new abilities
- [ ] **PROG-03**: Player can field stronger demons in later battles
- [ ] **PROG-04**: Progression feels meaningful within prototype scope

### UI-TOUCH

- [ ] **UI-01**: Game runs in mobile web browser
- [ ] **UI-02**: Touch-first controls (tap to select, swipe for actions)
- [ ] **UI-03**: Portrait orientation layout
- [ ] **UI-04**: Battle UI optimized for 1-minute sessions
- [ ] **UI-05**: No hover states (touch-only)

### TECH-PHASER

- [ ] **TECH-01**: Game built with Phaser 3
- [ ] **TECH-02**: Pixel art sprites for demons and environments
- [ ] **TECH-03**: JavaScript/TypeScript codebase
- [ ] **TECH-04**: Deployable as static web app
- [ ] **TECH-05**: LocalStorage for save data and profiling

---

## v2 Requirements (Deferred)

- Additional demons beyond core 6
- Second dreamscape area (The Fog)
- Third dreamscape area (The Void)
- Additional bosses (The Spiral, The Void, The Critic)
- Full audio/soundtrack
- Visual effects and polish
- Demon evolution/transformation
- Party synergies and combos
- Daily challenge mode
- Achievements

---

## Out of Scope

- Multiplayer or social features — Single-player self-reflection game
- Native mobile apps — Web-only for prototype
- Monetization — Free prototype
- VR/AR — Standard 2D
- Voice acting — Text-only for prototype
- Complex animations — Pixel art, simple sprites
- Procedural generation — Hand-crafted encounters for prototype
- Real-time combat — Turn-based only
- DLC/expansions — Core game only

---

## Traceability

*Will be filled by roadmap — each requirement maps to specific phase(s)*

| Requirement | Phase | Status |
|-------------|-------|--------|
| (all) | TBD | — |

---

*Requirements locked for prototype scope. Expand in v2.*
