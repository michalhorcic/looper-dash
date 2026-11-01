# Build notes — 0.8 beta

Unfrozen Audio Effect AMXD: little-endian chunks `ampf` (payload `aaaa`), `meta` (four zero bytes), `ptch` (UTF-8 patcher JSON + null byte). Adjacent JS dependencies resolve relative to the device directory. No code signing, Node for Max, native externals or manual Max editing is required by this package.

The generated container was decoded with the original `parse`/`handle_ptch` implementation from Ableton's `amxd_textconv.py`, SHA `5ebdfe7d7a8ad90edc0a0f3ba3f59449a7149331`. Its printer imports were stubbed to retain and compare the decoded JSON. This checks the container and payload, not whether stock Max can instantiate the patch or whether Live exposes the expected Looper fields. Runtime verification is still required.

Primary references:

- https://github.com/Ableton/maxdevtools/blob/main/maxdiff/amxd_textconv.py
- https://github.com/Ableton/maxdevtools/blob/main/patch-code-standard/patch-code-standard.md
- https://docs.cycling74.com/apiref/lom/device/
- https://docs.cycling74.com/apiref/lom/deviceparameter/
- https://docs.cycling74.com/apiref/lom/looperdevice/
- https://docs.cycling74.com/apiref/lom/song/
- https://docs.cycling74.com/apiref/js/liveapi/

State labels are parsed only from explicit API display strings; no numeric enum assumptions. All parameter values are observed for diagnostic export. Topology observers ignore their initial notification by comparing it with the initial property value. Changes trigger a debounced rediscovery; a five-second full topology comparison is the fallback. Runtime IDs are never persisted across Live sessions. Performance mode defaults to four cards, with two/three/four/six-card layouts. Layout changes preserve the first previously visible device on the selected page. View preferences remain local to the current JS UI instance.

The 4/8-bar strips remain transport-origin references, not measured or inferred buffer playheads. Pending recording is not inferred. `DeviceParameter.state` is not read as Looper transport state. The build never invokes Looper functions or Live setters. The optional 0.8 LED panel adds a manually selected MIDI output bus via live.routing; audio routing and all MIDI input/mappings remain unchanged.

Rebuild/test from the package directory:

```sh
python3 source/build.py
node --check mld2_core.js
node --check mld2_ui.js
node --check mld2_led.js
node tests/test_core.cjs
node tests/test_ui.cjs
node tests/test_led.cjs
python3 tests/validate_build.py
```

0.4 adds performance layouts and track colors. `Track.color` is read as `0x00rrggbb` and observed once per track (including returns and Master). A color change uses the existing debounced discovery path; the five-second topology fingerprint also includes color. Nested Loopers inherit the host track color. Missing or invalid colors render neutrally. State colors remain independent. No Live setters or MIDI objects were added.

Track color reference: https://docs.cycling74.com/apiref/lom/track/#color

Core/UI tests cover dynamic colors, nested/return/master tracks, absent colors, layout switching, pagination, scaled click coordinates and the read-only contract. `node tests/test_ui.cjs /tmp/mld-preview` optionally writes simulated SVG previews for all layouts (square export canvas for Quick Look compatibility); these are not native Max screenshots.

The user confirmed 0.3 works in Live 12 Suite. Version 0.8 still needs native Live verification.

0.5 adds read-only A/B send monitoring for each Looper's host track. Only the first two `mixer_device sends` parameters are read/observed, shared once per host track. Return names/IDs and send parameter IDs participate in topology comparison, while send value changes use existing parameter observers without rescanning. No send C parameter is accessed. Missing returns, missing mixers and unavailable values have a neutral display.

Text values come from `DeviceParameter.str_for_value`; bars show normalized parameter position, not audio level. Sends are not interactive. No meters, MIDI objects, routing changes or Live writes were added. The UI reserves a footer for sends in 2/3/4/6-card layouts, with compact reference strips in six-card views.

Reference: https://docs.cycling74.com/apiref/lom/mixerdevice/#sends

Tests additionally cover native send labels, zero settings, A/B-only subscriptions, missing returns/parameters, return renaming/reordering/removal, fallback discovery, shared observers for nested Loopers and stale/unavailable UI values.

0.6 adds local window-size presets 0.5/1/2 (default 1). The jsui sends its own box the `size` message (both patching and presentation dimensions), then assigns its containing `Patcher.wind.size`. Painting and hit testing continue to use the actual box rectangle. Only the dashboard subpatcher window is resized; the parent Live device strip is untouched. A failed resize restores the previous dimensions and leaves the selected preset unchanged. OS window-size limits require native testing, especially at 2x.

References: https://docs.cycling74.com/legacy/max8/vignettes/jswindobj and https://docs.cycling74.com/reference/jsui/#size

UI tests cover every preset, canvas/window dimensions, preserved pagination/layout, scaled reference-strip and pagination clicks, invalid preset rejection and resize failure rollback. Core monitoring and the patch graph are unchanged.

0.6.1 removes the 3x preset. Only 0.5x/1x/2x are accepted; the former 3x hit area is inactive. Tests cover both invalid 3x requests and the removed button.

0.6.2 removes Classic mode and the LIVE VIEW toggle. Performance view is now the only rendering path, with a static CARDS label and the existing 2/3/4/6 selectors. No monitoring or MIDI behavior changed.

0.7 refreshes rendering with 8px rounded cards, 6px rounded action buttons, segmented CARDS/SIZE controls, quieter track-tinted headers, consistent secondary typography and thinner transport-reference boundaries with a contrasting position cursor. Text uses `mgraphics.text_measure` for fitting and alignment. Core monitoring behavior is unchanged.

The new three-card layout uses three full-width rows: state on the left, reference and A/B sends on the right. Geometry, rendering and hit testing share `cardLayout`; pagination preserves the previously visible device when switching 2/3/4/6. Tests exercise three-card pagination and full-width strip clicks at 0.5x/1x/2x, missing/stale sends, unknown states, long names, rounded geometry and invalid layouts.

Drawing API reference: https://docs.cycling74.com/apiref/js/mgraphics/

0.7.1 improves reference-bar legibility: brighter 2px boundaries, bold 14px numbers in compact layouts / 16px in larger cards, and a subtle state-tinted badge under the current reference bar number. Timing semantics and interaction remain unchanged.

0.8 adds an isolated experimental `mld2_led.js` module inside the same audio-effect AMXD. The core snapshot outlet feeds both the dashboard and LED subpatcher. No independent discovery, LiveAPI setters, MIDI input, controller-mode switching or Custom Mode editing are used. The device strip stays within its previous height; LED TEST opens a dedicated presentation subwindow.

A single `midiout` receives only the module's fixed three-byte packet `176 37 colour`. Channel 1 / CC37 here addresses the physical LED through DAW In, not the user's channel 15 / CC37 Custom Mode input. Colour indices: STOP/WHITE=1, PLAY/GREEN=21, RECORD/RED=5, OVERDUB/ORANGE=9; off/unavailable=0. A live.routing MIDI output selector follows the bundled Cycling '74 `live.routing Midi-Out Example.maxsnip`. Destination and channel are chosen manually; only the documented/user-supplied LCXL3 1 DAW output aliases and channel 1 pass the module gate. MIDI In, DIN and other devices remain blocked. No automatic destination selection occurs.

LED OUTPUT and FOLLOW A are off on load. Manual tests require LED OUTPUT on and FOLLOW A off. Follow requires exactly one available, active Looper on track named `Looper A`, and only known dashboard state labels. Missing/ambiguous/unknown data produce off. Snapshots older than 1500 ms produce off; a 500 ms watchdog catches stalled core delivery. State changes send immediately; repeated output is limited to 500 ms refresh intervals to recover from button-release/local LED redraws. Disable/deletion clears the single LED when the selected route is still valid and frees the watchdog.

Hardware uncertainty: Novation documents colour commands in DAW mode. Whether they remain visible while Custom Mode 2 is selected, or are overwritten by Live's existing control-surface script, has NOT been verified. This build deliberately sends no DAW-mode enable/disable or surface-mode selection commands. A failed physical colour test is a protocol/mode compatibility result, not grounds to remap the user's input.

References:
- https://userguides.novationmusic.com/hc/en-gb/articles/27840466544402-Launch-Control-XL-3-programmer-s-DAW-mode
- https://docs.cycling74.com/reference/live.routing
- https://www.ableton.com/de/release-notes/live-11/ (MIDI routing to/from Max audio effects)
- Bundled Max snippet: C74/snippets/m4l/live.routing Midi-Out Example.maxsnip

Validation adds seven LED isolation/protocol mock tests and graph checks for the sole LED-to-MIDI path plus unchanged stereo passthrough. Neither the mock tests nor the AMXD parser prove native hardware behavior.
