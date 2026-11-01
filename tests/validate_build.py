import json,re,struct
from pathlib import Path
root=Path(__file__).resolve().parents[1]
raw=(root/'MultiLooperDashboard.amxd').read_bytes();pos=0;chunks=[]
while pos<len(raw):
 assert pos+8<=len(raw)
 tag=raw[pos:pos+4];n=struct.unpack('<I',raw[pos+4:pos+8])[0];pos+=8
 assert pos+n<=len(raw);chunks.append((tag,raw[pos:pos+n]));pos+=n
assert [t for t,_ in chunks]==[b'ampf',b'meta',b'ptch']
assert chunks[0][1]==b'aaaa'
p=json.loads(chunks[2][1].rstrip(b'\0'))
assert p==json.loads((root/'source/MultiLooperDashboard.maxpat').read_text())
objects=0
def graph(p):
 global objects
 boxes={x['box']['id']:x['box'] for x in p['boxes']};objects+=len(boxes)
 assert len(boxes)==len(p['boxes'])
 for l in p['lines']:
  edge=l['patchline']
  for key in ('source','destination'):assert edge[key][0] in boxes
 for b in boxes.values():
  if 'patcher' in b:graph(b['patcher'])
  if b['maxclass']=='newobj':assert b['text'].split()[0] not in {'midiin','ctlin','ctlout','live.remote~'}
  if b['maxclass']=='newobj' and b['text'].split()[0]=='midiout':assert b['id']=='ledout' and b['text']=='midiout'
  if b['maxclass']=='jsui':assert (root/b['filename']).is_file()
graph(p['patcher'])
for dep in p['patcher']['dependency_cache']:assert (root/dep['name']).is_file()
core=(root/'mld2_core.js').read_text()
assert not re.search(r'\.set\s*\(',core)
assert re.findall(r'\.call\s*\(\s*"([^"]+)"',core)==['str_for_value']
print(f'PASS AMXD chunks, Audio Effect type, exact source roundtrip, {objects} objects, graph/dependencies, read-only API contract')

# Only the LED module may reach the MIDI output; conventional stereo passthrough is intact.
boxes={b['box']['id']:b['box'] for b in p['patcher']['boxes']}
rootedges=[(tuple(l['patchline']['source']),tuple(l['patchline']['destination'])) for l in p['patcher']['lines']]
ledpanel=boxes['ledwindow']['patcher']
ledboxes={b['box']['id']:b['box'] for b in ledpanel['boxes']}
edges=[(tuple(l['patchline']['source']),tuple(l['patchline']['destination'])) for l in ledpanel['lines']]
assert [src for src,dst in edges if dst[0]=='ledout']==[('ledbytes',0)]
assert [src for src,dst in edges if dst[0]=='ledbytes']==[('led',0)]
assert ledboxes['led']['text']=='js mld2_led.js' and ledboxes['ledrouting']['text']=='live.routing'
assert (('js',0),('ledwindow',0)) in rootedges
assert (('commands',3),('led',0)) in edges
assert (('led',4),('ledrouting',0)) in edges
assert (('audioin',0),('audioout',0)) in rootedges and (('audioin',1),('audioout',1)) in rootedges
assert all(src[0]=='audioin' for src,dst in rootedges if dst[0]=='audioout')
led=(root/'mld2_led.js').read_text()
assert 'LiveAPI' not in re.sub(r'/\*.*?\*/','',led,flags=re.S)
assert 'packet=[176,37,colour]' in led
assert 'packet=[190,37,colour===1?onValue:offValue]' in led
assert 'packet=[240,0,32,41,2,21,1,83,37,rgb[0],rgb[1],rgb[2],247]' in led
assert len(re.findall(r'outlet\(0,',led))==1
assert 'mld2_led.js' in [d['name'] for d in p['patcher']['dependency_cache']]
print('PASS isolated optional LED MIDI path, palette / RGB / manual Custom CC15/37, unchanged stereo path')

for b in boxes.values():
 if b.get('presentation'):
  x,y,w,h=b['presentation_rect'];assert x>=0 and y>=0 and x+w<=580 and y+h<=169
for b in ledboxes.values():
 if b.get('presentation'):
  x,y,w,h=b['presentation_rect'];assert x>=0 and y>=0 and x+w<=580 and y+h<=300
assert ledboxes['ledarm']['mode']==1 and ledboxes['ledfollow']['mode']==1
assert ledboxes['ledarm']['parameter_enable']==0 and ledboxes['ledfollow']['parameter_enable']==0
print('PASS LED setup fits its own window; Live device strip stays within 169px')

for control,command in [('ledarm','arm'),('ledfollow','follow')]:
 assert ledboxes[control+'msg']['text']=='prepend '+command
 assert ((control,0),(control+'msg',0)) in edges
 assert not any(src==(control,1) for src,dst in edges)
 assert ledboxes[control]['outlettype'][0]=='int'
print('PASS LED toggles use numeric textbutton outlet 0, not text outlet 1')

assert ledboxes['led']['numoutlets']==8
assert (('ledprotocol',0),('ledprotocolmsg',0)) in edges
assert ledboxes['ledprotocolmsg']['text']=='prepend protocol'
assert (('led',5),('ledprotocol',0)) in edges
print('PASS native protocol selector uses numeric outlet and non-outputting display updates')

assert ledboxes['ledprotocol']['items'][-1]=='Custom CC15/37 - ON/OFF'
for ident,command in [('customon','ON'),('customoff','OFF')]:
 assert ((ident,0),(ident+'msg',0)) in edges
 assert ((ident+'msg',0),('led',0)) in edges
 assert ledboxes[ident+'msg']['text']=='testvalue '+command
for ident,initial in [('onvalue',127),('offvalue',0)]:
 assert ledboxes[ident]['minimum']==0 and ledboxes[ident]['maximum']==127
 assert ledboxes[ident+'init']['text']=='loadmess '+str(initial)
 assert ledboxes[ident+'msg']['text']=='prepend '+ident
 assert ((ident+'init',0),(ident,0)) in edges
 assert ((ident,0),(ident+'msg',0)) in edges
 assert ((ident+'msg',0),('led',0)) in edges
print('PASS native Custom ON/OFF test controls, 7-bit values and initialization')

# Multiple configured channels reach the existing sole midiout via a gated arbiter.
assert ledboxes['setup']['text']=='js mld2_led_setup.js'
assert ledboxes['setup']['varname']=='ledSetupEngine'
assert ledboxes['setupstate']['parameter_enable']==1
assert ledboxes['setupstate']['parameter_mappable']==0
assert '@bindto ledSetupEngine' in ledboxes['setupstate']['text']
assert ledboxes['setupstate']['saved_attribute_attributes']['valueof']['parameter_type']==3
assert ledboxes['setupstate']['saved_attribute_attributes']['valueof']['parameter_invisible']==1
for pair in [(('commands',3),('setup',0)),(('setup',0),('setupmidimsg',0)),(('setupmidimsg',0),('led',0)),(('setup',1),('setupwindow',0)),(('setupwindow',0),('setup',0)),(('setup',3),('setupclaimmsg',0)),(('setupclaimmsg',0),('led',0)),(('led',6),('setup',0)),(('led',7),('ledarm',0))]:assert pair in edges
assert ledboxes['setupmidimsg']['text']=='prepend setup_midi'
assert ledboxes['setupclaimmsg']['text']=='prepend setup_claim'
for outlet in range(4):
 fanout=[l['patchline'] for l in ledpanel['lines'] if l['patchline']['source']==['ledrouting'+str(outlet),0]]
 assert {e['destination'][0]:e['order'] for e in fanout}=={'led':0,'setup':1}
setupboxes={b['box']['id']:b['box'] for b in ledboxes['setupwindow']['patcher']['boxes']}
for b in setupboxes.values():
 if b.get('presentation'):
  x,y,w,h=b['presentation_rect'];assert x>=0 and y>=0 and x+w<=1080 and y+h<=640
assert 'mld2_led_setup.js' in [d['name'] for d in p['patcher']['dependency_cache']]
setupsource=(root/'mld2_led_setup.js').read_text()
assert 'LiveAPI' not in re.sub(r'/\*.*?\*/','',setupsource,flags=re.S)
assert 'getvalueof' in setupsource and 'setvalueof' in setupsource and 'notifyclients()' in setupsource
print('PASS multi-Looper setup window, blob persistence, metadata ordering and shared MIDI arbiter')
