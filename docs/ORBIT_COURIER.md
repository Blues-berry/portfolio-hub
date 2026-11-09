# ORBIT COURIER

## Positioning and rules

A short, original single-button arcade game about orbital deliveries. The courier circles automatically; the player switches between inner and outer lanes. Be in the same lane as mint diamond parcels at encounter time to collect them, and the opposite lane from coral cross-marked debris to avoid damage.

Each route lasts approximately 19–33 seconds. Reach its parcel target and remain alive until the route ends. Three debris collisions end the attempt. Missing parcels does not damage the hull, but failing the delivery target at the end loses the route. A result screen explains which condition failed.

| Route | Target | Available parcels | Duration | Hazards |
| --- | ---: | ---: | ---: | --- |
| Training Ring | 4 | 6 | 19.2 s | None |
| Debris Watch | 5 | 7 | 28.6 s | Debris |
| Coral Express | 6 | 8 | 31.6 s | Debris |
| Night Shift | 7 | 9 | 31.6 s | Debris |
| Homebound | 8 | 10 | 33.2 s | Debris |

The first route is nonlethal practice. Every route requires one practice switch before Start becomes available. Encounter spacing is at least two seconds, a text panel identifies the next object's lane and time, and the orbit shows approaching objects up to 4.4 seconds ahead. No two encounters happen simultaneously. Lane changes are immediate and have no cooldown, so the authored routes have a valid safe solution.

## Controls and accessibility

- Space, the large Switch Lane button, or tapping the orbital playfield switches lanes.
- P / Escape pauses; R resets the current attempt. Page hiding or window blur also pauses.
- Keyboard Space is intercepted for switching even when a Start or Retry button has focus, avoiding unintended activation. Enter and pointer activation still operate those buttons.
- The result dialog supports keyboard focus, and Escape returns to a fresh route.
- Visual roles use distinct shapes as well as color: diamond parcels, crossed debris, a white courier. Decorative scenery is static, lane changes have no animated travel or shake, and only the orbit motion required by the game runs.
- Full English and Chinese UI via `?lang=en` or `?lang=zh`; language switching preserves the current attempt and updates the URL.
- Route unlocks use isolated local storage key `orbit-courier-v1`. Corrupt or unavailable storage falls back safely, and saving failure is explained without preventing play.

## Files

- `public/project-demos/orbit-courier/index.html`: self-contained interface and canvas rendering.
- `public/project-demos/orbit-courier/rules.js`: deterministic campaign rules, also importable with Node for verification.
- `public/project-demos/orbit-courier/cover.svg`: original vector cover.

No downloaded images, fonts, analytics, network services, paid features, or external runtime dependencies are required.

## Verification (2026-11-09)

Node assertions passed:

- A legal perfect strategy wins each of the five routes, with all parcels delivered and three hull points remaining.
- Missing all parcels fails each route.
- Three debris collisions end the run and further stepping cannot alter the completed result.
- Paused state does not advance time or accept lane switching.
- Invalid or negative elapsed time is ignored.
- All encounter intervals are at least two seconds and each route offers enough parcels to meet its target.
- Inline JavaScript parses with `vm.Script`.

The authoring agent did not open the shared browser. Primary-agent browser checks are required before publication; Node simulations establish rule consistency, not real-player usability or perceived difficulty.
