# Build notes — 0.13.2 beta

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
node --check mld2_led_setup.js
node --check mld2_actions.js
node tests/test_core.cjs
node tests/test_ui.cjs
node tests/test_led.cjs
node tests/test_led_setup.cjs
node tests/test_actions.cjs
python3 tests/validate_build.py
```

0.4 adds performance layouts and track colors. `Track.color` is read as `0x00rrggbb` and observed once per track (including returns and Master). A color change uses the existing debounced discovery path; the five-second topology fingerprint also includes color. Nested Loopers inherit the host track color. Missing or invalid colors render neutrally. State colors remain independent. No Live setters or MIDI objects were added.

Track color reference: https://docs.cycling74.com/apiref/lom/track/#color

Core/UI tests cover dynamic colors, nested/return/master tracks, absent colors, layout switching, pagination, scaled click coordinates and the read-only contract. `node tests/test_ui.cjs /tmp/mld-preview` optionally writes simulated SVG previews for all layouts (square export canvas for Quick Look compatibility); these are not native Max screenshots.

The user confirmed 0.3 works in Live 12 Suite. Version 0.9 still needs native Live verification.

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

0.8.1 fixes two Max integration defects in the initial LED experiment. Native toggle-mode textbutton emits numeric state on outlet 0 and label text on outlet 1; LED OUTPUT and FOLLOW A now use outlet 0. live.routing reports current selections as zero-based indices, so the LED module now resolves them against the available type/channel lists and supports either metadata arrival order. Selector display is synchronized using non-outputting `set` messages. Named callbacks remain tolerated. Unresolved/invalid indices remain blocked.

Three regression tests cover native numeric routing and ordering plus simulated toggle clicks dispatched through the generated patch's actual wiring. Static graph validation also checks the numeric outlet. The previous user test showed an unchanged OFF status; it cannot establish whether LCXL3 DAW colour commands work in Custom Mode 2, since output was never armed correctly.

0.9 adds a separate, explicit manual RGB SysEx protocol selector. Its only frame is `F0 00 20 29 02 15 01 53 25 R G B F7` (hex), where 0x25 is LED 37. Test RGB values: white 32/32/32, green 0/127/0, red 127/0/0, orange 127/40/0, off 0/0/0. All data bytes are 7-bit. The existing single module output/iter/midiout path carries either fixed palette CC or this complete fixed-purpose frame.

Protocol may change only with LED OUTPUT off; attempted changes while armed restore the visible selector. RGB is manual-only; FOLLOW and watchdog never emit RGB automatically. The exact `LCXL3 1 (MIDI In)` destination is additionally accepted ONLY for RGB, never for palette CC. Channel selector 1 remains required for consistent routing, although SysEx itself has no MIDI channel. DIN/other devices remain blocked. No generic SysEx sender, CC15/37, device-mode commands, configuration writes or template uploads are exposed. Disable/deletion may submit a matching RGB off frame.

User hardware result with 0.8.1: DAW palette CC successfully changes LED in DAW mode, and has no visible effect in Custom Mode 2. The user subsequently reported no visible LED change with the RGB experiment in Custom Mode. This tests whether the RGB command is treated differently; documentation does not guarantee it. Launchpad X is no longer available to the user and is not a target.

Three additional tests validate complete SysEx framing, RGB values, MIDI-port isolation, manual-only behavior, channel restrictions and native protocol selector reset. Total LED tests: 13.


0.10 adds a third protocol, `Custom CC15/37 - ON/OFF`, based on TomFocusrite's first-hand XL3 support replies: https://www.reddit.com/r/Novation/comments/1lz4kez/launchcontrol_xl3_customization/ . Incoming feedback must match the control assignment AND channel on the first USB MIDI port, using the configured On value for the On colour. This uses Custom Mode colours, not DAW palette indices. Native firmware behavior is still unverified in this configuration.

The new protocol permits only exact `LCXL3 1 (MIDI In)` / channel 15. Its fixed packet is `190 37 value`, where value is the configured On or Off value (defaults 127/0). Two native 7-bit number boxes initialize via loadmess and modify only local JS settings; editing them sends no MIDI. Manual TEST ON/OFF requires armed output and FOLLOW off. Palette colour buttons, snapshot updates and watchdog output are blocked in this protocol. Disabling/deleting after a test submits the configured Off value if the selected route is still valid. Off may be a colour, not darkness.

Protocol changes still require output off. Existing palette and RGB routes remain isolated. No MIDI input, assignment edits, automatic output selection, mode/configuration commands or LiveAPI writes are added. LED panel height grows from 250 to 300; the parent device remains 169px. Version metadata advances to 0.10 beta; core monitoring/UI behavior is unchanged. Three additional mock tests cover custom packets, default/configured values, cleanup, native routing indices, blocked routes/channels, manual-only behavior and invalid value rejection. Build validation checks native control wiring and defaults. Total LED tests: 16. Physical button release may overwrite feedback; this test deliberately does not add automatic refresh or blinking.


0.11 enables Custom CC FOLLOW A using the already hardware-confirmed channel 15 / CC37 feedback path. User verified 0.10 TEST ON/OFF selects the Components colours; physical momentary button release restores Off. STOP sends configured Off, PLAY configured On, RECORD alternates 500 ms On/500 ms Off (1 Hz), OVERDUB 125 ms On/125 ms Off (4 Hz). Each state change starts its On phase immediately; repeated snapshots do not restart phase. This is wall-clock feedback, not tempo-synced or audio-thread timing.

The Custom watchdog checks every 25 ms and refreshes unchanged output at 100 ms intervals to recover from local button redraw without reading MIDI input. Scheduler load and MIDI delivery can add latency. State/freshness/route checks run before every output. Missing, ambiguous, inactive, unknown or stale (>1500 ms) target falls to configured Off and resets blink phase. Recovery starts a fresh phase. FOLLOW off submits Off and stops automatic output; armed manual tests remain available. Output off/deletion submits Off when route is valid and frees the timer. Route loss blocks output. RGB remains manual-only and palette timing stays 500 ms.

Test window, controls and route restrictions are preserved, and both switches remain off on load. No long/double-press logic, MIDI input, mapping changes or Live writes are added. New clock-driven mock coverage checks exact blink boundaries, repeated snapshots, distinct state transitions, 100 ms refresh, custom values, manual/follow exclusion, stale/invalid data recovery, route loss, follow off, disable and deletion. Total LED tests: 20. Automatic feedback needs hardware validation; only the manual colour feedback path is user-verified.


0.12 adds `mld2_led_setup.js` and a native 1080x640 LED SETUP window with eight reusable rows plus pagination. One Looper per uniquely named host track is required; multiple detected rows sharing a track name are explicitly ambiguous. Each assignment has channel 1–16, CC (-1 unset, otherwise 0–127), 7-bit On/Off values and enabled flag. All discoveries start unset/disabled. The union of discovered names and stored assignments preserves missing rows; CLEAR removes settings. Reordering and new runtime IDs do not affect bindings. Renames deliberately create a new unset row plus the old missing row; no automatic transfer by name similarity or stale runtime ID.

The shared destination is an explicitly selected `LCXL3 <number> (MIDI In)` name, restored by exact name instead of an index. Only these main USB ports appear in the new menu; All Channels must be confirmed by live.routing before packets are allowed, so each packet's status byte can select its assignment's channel. No route is chosen for a fresh, unconfigured device. A saved enabled SYNC resumes only after restoring the chosen route, with missing/stale targets going to configured Off. Native All Channels delivery requires hardware validation.

The setup engine emits only channel CC On/Off packets. They pass through `setup_midi` in the existing LED module, which independently requires setup ownership, the main LCXL3 USB destination, All Channels, and three valid CC bytes. The existing module remains the sole source of raw bytes reaching iter/midiout. Protocol tests and setup take exclusive ownership: claiming setup clears/disarms legacy LED OUTPUT and synchronizes its toggle; legacy output arming suspends setup, clears its previously sent addresses and stops its timer. Routing metadata fanout has explicit order: legacy arbiter first, setup second, so a manual test cannot be dropped because the final gate has stale metadata. Existing audio and read-only API wiring remain unchanged. No MIDI input/Learn, Looper commands, mapping edits or long/double-press handling.

Per-assignment blink state reuses the 0.11 semantics (1/4 Hz; 100ms refresh; 25ms low-priority Task). Duplicate enabled channel/CC addresses are blocked for both assignments. Manual tests require SYNC off and cannot target another enabled assignment's address; they work before enabling their own row. Target edits/disable/clear first submit Off for previously emitted assignments, then recompute follow output. Missing/unavailable/ambiguous/unknown or >1500ms stale data produces Off. Manual tests wait for confirmed routing; no bytes go to an unresolved bus.

Persistence uses `getvalueof`/`setvalueof` and `notifyclients` bound to `pattr ledConfiguration @bindto ledSetupEngine @parameter_enable 1`, with Stored Only Blob parameter type 3 and mapping disabled. A versioned URI-encoded JSON symbol stores only exact destination name, SYNC and validated assignment data, never runtime IDs, blink phases or manual tests. Restore validates the whole blob atomically; malformed data keeps current settings. This is Live parameter state, not js save/embedmessage (which only saves a patcher). Native Set close/reopen behavior still requires a user test.

Primary references: https://docs.cycling74.com/userguide/pattr/ , https://docs.cycling74.com/reference/pattr/ , https://docs.cycling74.com/apiref/js/jsthis/ and https://docs.cycling74.com/reference/live.routing . The Blob attribute layout follows bundled Max's `M4L.PitchScale.bpatch.maxpat`.

Four adjacent JS dependencies are now required. Fifteen new setup tests cover pagination, more than eight Loopers, independent channels/blinks, stale/invalid data, name/ID changes, conflicting addresses, saved-state roundtrip and validation, manual/follow exclusion, asynchronous routing, native graph command dispatch and both engines' shared output arbitration and throttled routing retries after rejected callbacks/reconnection. Route retries are limited to once per second to avoid feedback loops. Native UI, parameter persistence and multichannel routing cannot be proven by these mocks. Build validation adds parameter binding, window bounds, metadata ordering and arbiter wiring checks.


0.12.1 corrects a routing assumption in 0.12. User reported no LED change in SETUP, even with manual tests, while the original single-LED test still works. The global setup status was WAITING (no MIDI submitted), and the user confirmed all Looper buttons use channel 15. Requiring an All Channels output option was unsupported: output metadata can contain only numbered channels. A regression fixture reproduces the failure using numbered channels 1–16 without an All item.

Setup now resolves the actual numbered routing channel by display name (15, Ch. 15 or Channel 15), then waits for its confirmation, matching the known working single-LED route. SYNC requires one common channel across all complete enabled assignments; mixed channels are explicitly blocked instead of pretending raw status-byte channels survive the Live bus. Manual tests can individually select their row's channel while SYNC is off. The final MIDI gate independently requires the status-byte channel to match the explicitly confirmed bus channel; All Channels is not accepted. No additional MIDI ports or routing APIs are introduced. Existing version-1 assignment blobs remain compatible. Output route retries remain throttled to once per second.

Global status distinguishes unresolved port, pending explicit channel, unavailable numbered channel and mixed-channel configuration. The per-row Looper state remains a monitor, not proof of MIDI delivery. Three additional setup regressions cover numbered-only channels, mixed-channel refusal/recovery and missing numbered channel diagnostics. Total: 18 setup tests plus 20 legacy LED and 15 core tests. The user-confirmed single-channel hardware path is reused; native 0.12.1 setup delivery still needs a hardware retest.


0.13 adds opt-in Stop-hold Clear. The original MIDI Stop mapping is retained and no Stop command is emitted by this device. Each assignment gains a Stop CC/On/Off, LED enabled and Hold Clear enabled flag, using the same channel. Exact Looper A/B/C track names prefill CC45/46/47, with both flags off on migration/new assignment. Global hold defaults to 1500ms (500–5000ms configurable), firing once at threshold while down. Native setup now uses four two-row assignments per page in 1080x720. The mapping-removal button is renamed RESET, distinct from audio Clear.

Core adds read-only observation of supported loop_length and publishes validated nonnegative length, Clear API capability and current discovery generation with each row. Buffer 0 means empty only with STOP. Positive length means recorded; first recording at zero or unavailable length is not declared empty. Stop LED uses On for confirmed empty, Off for recorded/recording/unknown. Existing Rec/Play/Overdub feedback is unchanged. Runtime output keys include role, and collisions span both roles across all assignments.

A dedicated live.routing on midi_inputs and single midiin supply raw bytes to the setup engine; input selection is explicitly made in the setup UI, limited to LCXL3 main USB MIDI Out aliases. Output routing remains independently on midi_outputs. Both use a confirmed common numbered channel. The input filter establishes source/channel; raw bytes may retain that channel or be normalized by Live to channel 1. Running status and real-time interleaving are handled; notes, other messages and SysEx are ignored. No received MIDI is forwarded. Input CC count/last value and hold state are visible for native troubleshooting, particularly whether Live forwards CCs consumed by existing Remote mappings.

Gestures require Stop enabled, Hold enabled, SYNC, valid input/output routing, a unique available Looper with Clear capability and a prior Off/release message since arming. Repeated On is ignored. Each hold captures live ID and discovery generation. State must be STOP at threshold; otherwise the attempt is consumed and will not fire later. Stale data (>500ms), input/identity/config changes, SYNC off and legacy takeover cancel held state. Restored configurations never restore held presses. Clear edits and route loss also revoke queued action permits.

New mld2_actions.js isolates the single write (device.call clear) from the read-only core. Threshold detection sends a synchronous permit and a deferred request; cancellation revokes permits before deferred execution. The handler validates matching permit, one-shot token, fresh request (<250ms), fresh snapshot (<500ms), unique matching target ID/generation and native Looper class, active status, Clear capability and a newly read explicit stopped State display. It emits a result to the setup status and never retries a held action or writes parameters. Audio/MIDI mapping/transport remain unchanged. Action requests do not infer global transport or send remote MIDI back into Live.

Persistence migrates v1 blobs to v2, retaining prior play assignments/port/SYNC and defaulting input unset and Stop/Hold off. v2 stores input name, global hold milliseconds and per-assignment Stop fields. Five adjacent JS dependencies are now required. Primary API reference: https://docs.cycling74.com/apiref/lom/looperdevice/ . Native MIDI delivery alongside Remote mappings, simultaneous input/output DeviceIO routing, loop_length/clear capability and actual Clear timing require user testing. User confirmed 0.12.1 setup feedback works.

Validation: 16 core tests, 25 setup/hold tests, 20 legacy LED tests, 6 action tests plus UI and container/graph checks. New coverage includes buffer observation/absence, empty vs stopped LED, exact threshold/release, duplicate CCs across roles, raw parsing, cancellation/identity/staleness, schema migration, guarded action readback and cancelled deferred actions. No physical Clear actions were run during automated tests.


0.13.1 follows user-confirmed native findings. Mapped Stop CCs do not arrive, while an unmapped control increments the CC counter; the user approved removing only native Stop CC45/46/47 mappings and delegating Stop/Clear to the dashboard. The reference manual documents that Remote mappings consume messages before the MIDI track input: https://www.ableton.com/en/manual/routing-and-i-o/ . This changes the earlier assumption that native Stop mapping could remain in parallel with a raw press/release detector.

Stop enabled now means both its LED and direct input control. Every new On edge sends one guarded Stop, including the first press after arming and with Hold off. Repeated On while down does not repeat Stop. Hold Clear remains opt-in, release-primed, one-shot at threshold and requires confirmed STOP. Stop does not assume a numeric State enum; the action module calls documented stop after matching target/native capability and the same cancellable fresh permit. Clear retains native stopped-State readback. Play/Overdub are never emitted by this module. Core publishes stop_available, while staying read-only.

Input diagnostics count raw bytes and complete CC packets before routing/channel/gesture gates. INPUT ROUTED distinguishes confirmed metadata from actual data reception. Three additional setup regressions cover pre-gate diagnostics, press-edge Stop and zero action requests from LED feedback; two action tests cover direct Stop and invalid action/capability rejection. Total: 16 core, 28 setup, 20 legacy LED and 8 action tests, plus UI/build graph.

UNRESOLVED native Looper A feedback fault: user verified deleting device or disabling SYNC restores Play/Overdub; disabling only Stop LED does not help, disabling only A's main LED does. One instance and disabled legacy LED OUTPUT were confirmed. User also reports loop erasure on another Play press. No Stop input messages were received in the failing scenario, so the guarded Clear handler had no gesture request. This isolates the problem to the main A feedback path but does not prove firmware state coupling versus returned MIDI reaching the native multipurpose mapping. Leave A main feedback disabled until native raw-input capture with Remote temporarily off can establish the actual message flow. No hard-coded per-track suppression or unsupported protocol substitution is introduced; the existing per-row ENABLE provides the verified workaround. Stop/Clear and native Remote interactions need hardware retesting.


0.13.2 records an actual native MIDI experiment, not only mocked behavior. A read-only CoreMIDI subscriber on macOS observed the LCXL3 main hardware source before Live filtering. With A feedback 127/0, the captured CC37 stream contained repeated 127 messages without intervening release 0 and, in a later sample, isolated 0 messages without preceding 127. B CC38 press/release messages remained paired. Disabling only A main feedback restored operation. Output Remote off alone did not cure it. A feedback 127/1 stopped erasure but did not restore Overdub. A feedback 126/1 restored both functionality and LED state according to the user; the subsequent direct trace showed repeated clean 127/0 press/release pairs on CC37. This demonstrates the working per-control fix but does not identify the underlying A/B configuration or firmware difference. No universal claim is made that every LCXL3 button fails with 127/0. Output Remote was initially off; the user subsequently restored it to On and confirmed Overdub remains functional with LED 126/1.

Schema v3 separates Stop LED values (on/off) from physical inputOn/inputOff. Native UI LED+/LED- are feedback only; IN+/IN- are Stop press/release values, default 127/0. Stop feedback can therefore use 126/1 without changing gesture decoding. Defaults and saved B/C feedback remain 127/0. Only the exact known older assignment (Looper A, ch15, CC37) migrates default endpoints 127/0 to 126/1; custom values and all other assignments remain unchanged. New Looper A defaults use the demonstrated 126/1. Older v1/v2 Stop input values inherit their former paired On/Off values; v3 validates/persists them independently. No Rec/Play mapping change is required.

The optional source/midi_observe.swift diagnostic uses CoreMIDI read-only input ports, filters the LCXL3 main source, records raw hex bytes/timestamps and disposes its client after a bounded invocation. It never creates an output port or sends packets. Native source listing and timed captures were performed with the user's controller; the source version compiles with the system Swift toolchain. It is not an AMXD dependency.

Additional regression tests verify migration limited to the known A mapping while preserving B/C, v3 roundtrip, and physical 127/0 Stop/Clear detection with LED feedback 126/1. Total: 16 core, 30 setup/hold, 20 legacy LED and 8 guarded action tests. Five runtime JS dependencies remain unchanged. User additionally confirmed Stop/Clear on B works natively.
