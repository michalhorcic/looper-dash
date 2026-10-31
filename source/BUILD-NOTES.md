# Build notes — 0.3 beta

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

State labels are parsed only from explicit API display strings; no numeric enum assumptions. All parameter values are observed for diagnostic export. Topology observers ignore their initial notification by comparing it with the initial property value. Changes trigger a debounced rediscovery; a five-second full topology comparison is the fallback. Runtime IDs are never persisted across Live sessions. Six cards per page allow any practical Looper count without requiring unique track names.

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

0.3 changes only UI rendering, compact device-strip wording and version labels. Core discovery/timing logic unchanged from user-tested 0.2. Per-bar ticks and numeric labels added; raw API fields remain in REPORT.
