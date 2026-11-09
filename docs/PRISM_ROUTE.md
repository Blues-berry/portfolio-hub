# PRISM ROUTE

## Positioning and rules

PRISM ROUTE is a small, deterministic mirror-routing puzzle. It is intended for a 5–15 minute session with eight authored experiments. Rotate the cyan mirrors until the amber emitter on the left connects to the circular receiver on the right. Dark blocks stop the beam. A blocked, looping, or escaped beam is feedback, not permanent failure: there is no timer, move limit, or irreversible loss.

Each mirror has two orientations. A click/tap rotates it by 90 degrees and updates the beam immediately. Undo reverses the last rotation; reset restores the authored starting arrangement. The move counter rewards efficient solutions without preventing experimentation. A solver-derived minimum move count is shown. A hint highlights one mirror that moves toward a nearest solution; it never rotates a mirror automatically.

The first experiment has two mirrors and gives a guided first-action message. Later levels retain some correctly aligned mirrors, so blindly toggling every mirror does not solve the puzzles. All eight levels are deterministic, with minimum moves of **2, 3, 2, 3, 4, 5, 4, 5**.

## Language, controls, and saves

- Default English; `?lang=zh` selects Chinese. The language button updates the full UI and accessible mirror names without resetting the board or moves.
- Touch and mouse: tap/click a mirror. Keyboard: Tab to a mirror, Enter/Space to rotate; R to reset, Ctrl/Command+Z to undo.
- Each mirror is a real button with row, column, and current orientation in its accessible name. Status changes use a live region. Reduced motion is supported.
- Progress uses the independent `prism-route-progress-v1` key. It stores unlocked levels and best move counts. Invalid saves are clamped, and unavailable storage does not block playing.
- Covers and game visuals are original inline vector/CSS artwork. There are no remote fonts, images, SDKs, or runtime dependencies.

## Files

- `public/project-demos/prism-route/index.html`: semantic UI.
- `engine.js`: authored levels and pure beam tracing.
- `app.js`: controls, bilingual UI, progression, undo/reset/hints.
- `style.css`: responsive visual design.
- `cover.svg`: game directory cover.

## Verification on 2026-11-09

The level engine was loaded in an isolated Node VM. All **932 possible mirror configurations** across the eight authored levels were enumerated. Every level has a solution, every starting arrangement is unsolved, every beam trace terminates within its bounded step count, and the declared par matches exhaustive minimum Hamming distance from the starting arrangement to a winning configuration. The runtime controller passed JavaScript syntax validation.

Golden `(initial mask → one shortest solution)` pairs:

| Level | Mirrors | Initial | Solution | Minimum rotations |
| --- | --- | --- | --- | --- |
| 1 | 2 | 3 | 0 | 2 |
| 2 | 4 | 14 | 3 | 3 |
| 3 | 4 | 6 | 12 | 2 |
| 4 | 6 | 14 | 43 | 3 |
| 5 | 6 | 34 | 20 | 4 |
| 6 | 8 | 121 | 212 | 5 |
| 7 | 8 | 142 | 212 | 4 |
| 8 | 8 | 70 | 43 | 5 |

Mirror index is its order in `PrismRoute.levels[level].points`; bit 0 is the first mirror. To exercise a shortest route using actual UI buttons, click exactly the indices set in `initial XOR solution`. Browser and deployment checks are handled by the parent task. No external player playtest has been performed.
