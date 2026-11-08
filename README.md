# Hull & Havoc — phone build (PWA)

Built Nov 8, 2026 from the v1.100 (Detroit remodel) artifact export
(slug `starship-manufacturing-game`). The master export is kept verbatim at
`~/workspace/games/hull-and-havoc/master.html`; this folder is generated from
it by `~/workspace/games/hull-and-havoc/build_phone.py`. Same setup as the
Argus Zero phone build.

## Files
- `index.html` — the full game (v1.100) as a standalone page, plus a small
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
The game's own version system is untouched: `GAME_VERSION` still displays
v1.100 and blueprint versions still bump by thousandths.

## One fix the phone copy carries (game code otherwise identical)
In the exported v1.100 script, the top-level boot
(`newGame(); wireDesigner(); render();`) runs *before* two data tables that
live in the feature-systems section below it — `RIVAL_MODELS` (used inside
`newGame`) and `LOAN_OFFERS` (used inside `render`). Run strictly, the page
throws on the undefined tables and never starts. `build_phone.py`
relocates those two assignments — byte-identical pure data literals — to
just above the boot call, in this copy only. **The artifact should get the
same fix via `artifact.edit`** so future exports are clean; after that,
rebuild here and this section can come out.

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

## Hosting — remaining step (not yet done)
Mirror the Argus Zero setup: create the repo
**github.com/torrencekelley/hull-and-havoc**, push the contents of this
`phone/` folder to it, and enable GitHub Pages on the repo, giving
**https://torrencekelley.github.io/hull-and-havoc/**. That URL is the link
to install from and to share with Brent. As of this build, `gh` is not
logged in on the build VM, so the repo creation/push is still outstanding.

## Test-drive without hosting
Open `index.html` directly in the phone's browser. It plays fully;
localStorage saves work in most browsers, but the hosted install is the
reliable form (a loose file can be treated as temporary by the browser).
Note: the page loads its display fonts (Orbitron/Rajdhani) from Google
Fonts when online; offline it falls back to system fonts and the game is
otherwise fully playable from the service-worker cache.

## Versioning (Torrence, Nov 2026)
In-game versions follow his scheme: this build is v1.100 (the Detroit
remodel earned the tenth-step); tweaks tick the thousandths place
(v1.101, v1.102 …); ship designs use the same system per design line.
The service-worker `HH_CACHE` bumps independently per phone release
(v1, v2, v3…) and is not the game version.
