# Build notes — 0.5 beta

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

State labels are parsed only from explicit API display strings; no numeric enum assumptions. All parameter values are observed for diagnostic export. Topology observers ignore their initial notification by comparing it with the initial property value. Changes trigger a debounced rediscovery; a five-second full topology comparison is the fallback. Runtime IDs are never persisted across Live sessions. Performance mode defaults to four cards, with two/four/six-card layouts and a classic six-card view. Layout changes preserve the first previously visible device on the selected page. View preferences remain local to the current JS UI instance.

The 4/8-bar strips remain transport-origin references, not measured or inferred buffer playheads. Pending recording is not inferred. `DeviceParameter.state` is not read as Looper transport state. The build never invokes Looper functions, Live setters, or MIDI routing.

Rebuild/test from the package directory:

```sh
python3 source/build.py
node --check mld2_core.js
node --check mld2_ui.js
node tests/test_core.cjs
node tests/test_ui.cjs
python3 tests/validate_build.py
```

0.4 adds performance layouts and track colors. `Track.color` is read as `0x00rrggbb` and observed once per track (including returns and Master). A color change uses the existing debounced discovery path; the five-second topology fingerprint also includes color. Nested Loopers inherit the host track color. Missing or invalid colors render neutrally. State colors remain independent. No Live setters or MIDI objects were added.

Track color reference: https://docs.cycling74.com/apiref/lom/track/#color

Core/UI tests cover dynamic colors, nested/return/master tracks, absent colors, layout switching, pagination, scaled click coordinates and the read-only contract. `node tests/test_ui.cjs /tmp/mld-preview` optionally writes simulated SVG previews for all layouts (square export canvas for Quick Look compatibility); these are not native Max screenshots.

The user confirmed 0.3 works in Live 12 Suite. Version 0.5 still needs native Live verification.

0.5 adds read-only A/B send monitoring for each Looper's host track. Only the first two `mixer_device sends` parameters are read/observed, shared once per host track. Return names/IDs and send parameter IDs participate in topology comparison, while send value changes use existing parameter observers without rescanning. No send C parameter is accessed. Missing returns, missing mixers and unavailable values have a neutral display.

Text values come from `DeviceParameter.str_for_value`; bars show normalized parameter position, not audio level. Sends are not interactive. No meters, MIDI objects, routing changes or Live writes were added. The UI reserves a footer for sends in 2/4/6-card and classic layouts, with compact reference strips in six-card views.

Reference: https://docs.cycling74.com/apiref/lom/mixerdevice/#sends

Tests additionally cover native send labels, zero settings, A/B-only subscriptions, missing returns/parameters, return renaming/reordering/removal, fallback discovery, shared observers for nested Loopers and stale/unavailable UI values.
