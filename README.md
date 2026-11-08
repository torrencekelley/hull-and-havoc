# Hull & Havoc — phone build (PWA)

Built Nov 8, 2026 from the v1.200 artifact export (slug
`starship-manufacturing-game`; v1.100 was the Detroit remodel, v1.101 the
numbering-law tick). The master
export is kept verbatim at `~/workspace/games/hull-and-havoc/master.html`;
this folder is generated from it by
`~/workspace/games/hull-and-havoc/build_phone.py`. Same setup as the Argus
Zero phone build.

**Release 4 — Nov 8, 2026:** rebuilt from the game v1.200 export — a
feature wave (`GAME_VERSION` 1101 → 1200; all version displays read
v1.200 and newly saved ship designs are born at v1.200; existing design
versions are untouched). New in v1.200: **decision events** — choices with
ledger consequences instead of pure weather; **sector relationships &
tastes** — buyers remember deliveries and misses and their tastes shift
over time; a **Boardroom trophy cabinet** with eight scenario ambitions
to chase; a **self-explaining Weekly Report** whose "why" section gives
variance analysis from the week's real numbers; **named staff** — a Chief
Engineer plus a named foreman at every yard, with skill, salary, and
morale, and rivals who may try to poach them; and **upgraded ship art** —
richer SVG renders (gradients, decals, canopy, per-part silhouettes) so a
ship's parts read at a glance. The Release 2 feedback strips are
included. `HH_CACHE` bumped to `hull-and-havoc-v4`. The previous master
is kept at `../master-v1101.html`.

**Release 3 — Nov 8, 2026:** rebuilt from the game version-bump export.
The in-game version counter moved **v1.100 → v1.101** (`GAME_VERSION`
1100 → 1101) per Torrence's numbering law — fixes tick the last place —
so all version displays read v1.101 and newly saved ship designs are born
at v1.101; existing design versions are untouched. No gameplay, balance,
or content changes; the Release 2 feedback strips are included.
`HH_CACHE` bumped to `hull-and-havoc-v3`. The previous master is kept at
`../master-v1100-feedbackfix.html`.

**Release 2 — Nov 8, 2026:** rebuilt from the feedback-fix export (in-game
version still v1.100; no balance/content changes). Action results and
refusals (`flash()` messages) now also appear in a `.flash-local` strip
inside the active department panel, not only at the top of the page — so a
build refusal is visible beside the Lay Keel button that produced it.
`HH_CACHE` bumped to `hull-and-havoc-v2`. The previous master is kept at
`../master-v1100-prefeedbackfix.html`.

## Files
- `index.html` — the full game (v1.200) as a standalone page, plus a small
  persistence controller the builder appends. Saves via `localStorage`
  (key `hull-and-havoc-save-v1`, save field `ver:1`).
- `manifest.webmanifest` — install metadata (name "Hull & Havoc", dark
  `#070b14` theme/background matching the game's space UI, standalone).
- `sw.js` — service worker; network-first with cache fallback so the game
  works offline. **Bump `HH_CACHE` (e.g. `hull-and-havoc-v2`) on every
  release** so phones drop the old build.
- `icon-192.png`, `icon-512.png` — home-screen icons (original art: amber
  wedge hull + teal engine glow on a starfield, "H&H" wordmark).

## How saving works
The game keeps its state in the globals `S` / `ui` / `uidCounter` and
repaints through `render()`. The appended controller:
- wraps `render()` so every repaint also writes
  `{ver:1, S, uid, ui}` to `localStorage`, and also saves on page-hide;
- on boot, restores a valid save over the fresh `newGame()` the page starts
  with (re-syncing the visible department and re-opening the game-over
  panel if the saved game was finished), then re-renders;
- ignores a corrupt, foreign-version, or shape-invalid save and starts
  fresh instead of crashing;
- the in-game **Restart** button (`newGame()` + `render()`) overwrites the
  stored save with the new company, exactly as expected.
The game's own version system is untouched by the phone build:
`GAME_VERSION` displays v1.200 and blueprint versions still bump by
thousandths.

## Boot order (resolved — no phone-only game-code fix anymore)
In the originally exported v1.100 script, the top-level boot
(`newGame(); wireDesigner(); render();`) ran *before* two data tables in
the feature-systems section below it — `RIVAL_MODELS` (used inside
`newGame`) and `LOAN_OFFERS` (used inside `render`) — and a strict run
threw on the undefined tables. The first phone build relocated them. The
artifact source has since been fixed: current exports define both tables
immediately above the boot call, so the phone copy's game code is now
byte-identical to the master. `build_phone.py` keeps the relocation only
as a guard — it fires solely if a table is ever found after the boot call
again, and reports when it does.

## Rebuild after a new game export
1. Re-export the artifact and replace `../master.html` with the new export.
2. Run `python3 ~/workspace/games/hull-and-havoc/build_phone.py`.
3. Bump `HH_CACHE` in `sw.js`.
4. Re-zip this folder into `../hull-and-havoc-phone.zip`.
5. Push the updated folder contents to the hosting repo (below).

## Install (once hosted over HTTPS)
1. Put this whole folder on any static HTTPS host (GitHub Pages, Netlify,
   etc.) under Torrence's own account.
2. Open the URL in Chrome on the phone → menu → "Install app" / "Add to
   Home screen". Works the same for Brent — **one link serves everyone,
   and each phone keeps its own separate save** (saves live in the phone's
   own localStorage; nothing is shared or synced).
3. iPhone: open in Safari → Share → "Add to Home Screen".

## Hosting
Live since Nov 8, 2026, mirroring the Argus Zero setup: repo
**github.com/torrencekelley/hull-and-havoc** with GitHub Pages enabled,
serving **https://torrencekelley.github.io/hull-and-havoc/** — the link to
install from and to share with Brent. To ship an update, push the changed
files from this `phone/` folder to the repo root (for the feedback-fix
release: `index.html` and `sw.js`) and bump `HH_CACHE` so installed phones
drop the old build.

## Test-drive without hosting
Open `index.html` directly in the phone's browser. It plays fully;
localStorage saves work in most browsers, but the hosted install is the
reliable form (a loose file can be treated as temporary by the browser).
Note: the page loads its display fonts (Orbitron/Rajdhani) from Google
Fonts when online; offline it falls back to system fonts and the game is
otherwise fully playable from the service-worker cache.

## Versioning (Torrence, Nov 2026)
In-game versions follow his scheme: this build is v1.101 (the Detroit
remodel earned the tenth-step to v1.100; the feedback fix ticked the
thousandths place to v1.101); further tweaks tick on (v1.102 …); ship
designs use the same system per design line.
The service-worker `HH_CACHE` bumps independently per phone release
(v1, v2, v3…) and is not the game version.
