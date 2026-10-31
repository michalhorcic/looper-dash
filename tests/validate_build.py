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
  if b['maxclass']=='newobj':assert b['text'].split()[0] not in {'midiin','midiout','ctlin','ctlout','live.remote~'}
  if b['maxclass']=='jsui':assert (root/b['filename']).is_file()
graph(p['patcher'])
for dep in p['patcher']['dependency_cache']:assert (root/dep['name']).is_file()
core=(root/'mld2_core.js').read_text()
assert not re.search(r'\.set\s*\(',core)
assert re.findall(r'\.call\s*\(\s*"([^"]+)"',core)==['str_for_value']
print(f'PASS AMXD chunks, Audio Effect type, exact source roundtrip, {objects} objects, graph/dependencies, read-only API contract')
