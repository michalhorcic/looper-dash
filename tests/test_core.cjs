const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');let c,nodes,nextId,watchers,initial,outputs,clock,content,reads;
function inside(v){return vm.runInContext('JSON.parse('+JSON.stringify(JSON.stringify(v))+')',c);}
function node(type,props={},children={}){const o={id:nextId++,type,props,children};nodes.set(o.id,o);return o;}
function track(name){return node('Track',{name},{devices:[]});}
function looper(name='Looper'){
 const params=['Device On','State','Feedback'].map((name,i)=>node('DeviceParameter',{name,original_name:name,value:0,min:0,max:3,is_quantized:i===1?1:0,value_items:['Stop','Record','Play','Overdub']}));
 return node('Device',{name,class_name:'Looper',class_display_name:'Looper',is_active:1,can_have_chains:0},{parameters:params});
}
function raw(o,p){if(p in o.children){const v=o.children[p];return (Array.isArray(v)?v:[v]).flatMap(x=>['id',x.id]);}if(!(p in o.props))throw Error('unsupported '+p);return Array.isArray(o.props[p])?o.props[p]:[o.props[p]];}
function changed(o,p){for(const w of watchers)if(w.o===o&&w.prop===p)w.cb(inside([p,...raw(o,p)]));}
function setup(){
 nodes=new Map();nextId=1;watchers=[];initial=[];outputs=[];clock=10000;content='';reads=[];
 const master=track('Master'), song=node('Song',{current_song_time:3.5,is_playing:1,tempo:120,signature_numerator:4,signature_denominator:4,clip_trigger_quantization:4},{tracks:[],return_tracks:[],master_track:master});
 function resolve(p){if(p.startsWith('id '))return nodes.get(Number(p.slice(3)));let ss=p.split(' '),o=song;assert.equal(ss.shift(),'live_set');while(ss.length){let key=ss.shift(),v=o.children[key];o=Array.isArray(v)?v[Number(ss.shift())]:v;if(!o)return null;}return o;}
 class API{
  constructor(cb,p){this.cb=cb;this.o=resolve(p);this._id=this.o?.id||0;}
  get id(){return this._id;}set id(v){this._id=v;}
  get info(){return Object.keys(this.o.props).map(k=>'property '+k+' float').concat(Object.keys(this.o.children).map(k=>'children '+k+' Device'),(this.o.functions||[]).map(k=>'function '+k)).join('\n');}
  get(p){reads.push({id:this.o.id,property:p});return inside(raw(this.o,p));}
  getcount(p){assert.ok(p in this.o.children,p);return this.o.children[p].length;}
  call(f,value){assert.equal(f,'str_for_value','read only');return inside([this.o.props.name==='State'?this.o.props.value_items[value]:/^Send /.test(this.o.props.name)?(value===0?'-inf dB':(-60+value*60).toFixed(1)+' dB'):String(value)]);}
  set(){throw Error('forbidden Live mutation');}
  set property(p){this.prop=p;if(p&&this.cb){watchers.push(this);initial.push(()=>{if(this.prop===p)this.cb(inside([p,...raw(this.o,p)]));});}}
 }
 class Task{constructor(fn){this.fn=fn;}repeat(){}cancel(){this.cancelled=true;}freepeer(){this.freed=true;}}
 class File{constructor(){this.isopen=true;}writeline(s){content+=s+'\n';}close(){}}
 class TestDate extends Date{static now(){return clock;}}
 c=vm.createContext({LiveAPI:API,Task,File,Date:TestDate,post(){},outlet(...x){outputs.push(x);},arrayfromargs:x=>Array.from(x)});
 vm.runInContext(fs.readFileSync(path.join(root,'mld2_core.js'),'utf8'),c);return {song,master};
}
function flush(){let todo=initial;initial=[];todo.forEach(f=>f());}
let passed=0;function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('zero loopers; delayed initial topology notifications do not cause a rescan loop',()=>{setup();c.init();flush();assert.equal(c.slots.length,0);assert.equal(c.dirty,false);clock+=300;c.tick();assert.equal(c.scans,1);});
test('automatic discovery finds 11 loopers, arbitrary/duplicate track names and multiple devices per track',()=>{
 const {song}=setup();for(let i=0;i<4;i++){const t=track('Guitar');for(let j=0;j<(i===0?5:2);j++)t.children.devices.push(looper('My loop'));song.children.tracks.push(t);}c.init();flush();assert.equal(c.slots.length,11);assert.equal(new Set(c.slots.map(s=>s.id)).size,11);
});
test('return, master and nested rack chains are included',()=>{
 const {song,master}=setup();const t=track('Piano'),chain=node('Chain',{name:'Wet'},{devices:[looper()]}),rack=node('Rack',{name:'FX',class_name:'AudioEffectGroupDevice',class_display_name:'Audio Effect Rack',can_have_chains:1},{chains:[chain]});
 t.children.devices.push(rack);song.children.tracks.push(t);const r=track('Return A');r.children.devices.push(looper());song.children.return_tracks.push(r);master.children.devices.push(looper());c.init();flush();assert.equal(c.slots.length,3);assert.match(c.slots[0].trail[0],/Wet/);
});
test('add/remove/name changes trigger debounce and rediscovery without a button',()=>{
 const {song}=setup(),t=track('Synth');song.children.tracks.push(t);c.init();flush();const l=looper();t.children.devices.push(l);changed(t,'devices');assert.equal(c.dirty,true);clock+=300;c.tick();flush();assert.equal(c.slots.length,1);assert.equal(c.dirty,false);
 t.props.name='TEO-5';changed(t,'name');clock+=300;c.tick();flush();assert.equal(c.slots[0].track,'TEO-5');t.children.devices=[];changed(t,'devices');clock+=300;c.tick();flush();assert.equal(c.slots.length,0);
});
test('5-second fallback catches topology updates even without a callback',()=>{
 const {song}=setup(),t=track('Bass');song.children.tracks.push(t);c.init();flush();t.children.devices.push(looper());clock+=5100;c.tick();flush();assert.equal(c.slots.length,1);
});
test('track colors include nested, return and master loopers and follow live color changes',()=>{
 const {song,master}=setup(),t=track('Synth'),r=track('Return A');
 t.props.color=0xff8040;r.props.color=0x0088ff;master.props.color=0;
 const chain=node('Chain',{name:'Nested'},{devices:[looper()]});
 t.children.devices=[looper(),node('Rack',{name:'FX',can_have_chains:1},{chains:[chain]})];
 r.children.devices=[looper()];master.children.devices=[looper()];song.children.tracks=[t];song.children.return_tracks=[r];
 c.init();flush();assert.equal(c.dirty,false);c.tick();
 assert.deepEqual(JSON.parse(outputs.at(-1)[2]).rows.map(s=>s.track_color),[0xff8040,0xff8040,0x0088ff,0]);
 c.gridlength(c.slots[0].id,8);t.props.color=0x12ab34;changed(t,'color');clock+=300;c.tick();flush();
 assert.equal(c.slots[0].track_color,0x12ab34);assert.equal(c.slots[1].track_color,0x12ab34);assert.equal(c.referenceBars[c.slots[0].id],8);
 t.props.color=0x334455;clock+=5100;c.tick();flush();assert.equal(c.slots[0].track_color,0x334455);
});
test('missing track color remains available with a neutral color fallback',()=>{
 const {song}=setup(),t=track('No color');t.children.devices=[looper()];song.children.tracks=[t];c.init();flush();c.tick();
 const row=JSON.parse(outputs.at(-1)[2]).rows[0];assert.equal(row.track_color,null);assert.equal(row.available,true);
});
test('state derives from explicit API text and local 8-bar reference never changes device',()=>{
 const {song}=setup(),t=track('Mic'),l=looper();t.children.devices.push(l);song.children.tracks.push(t);c.init();flush();c.tick();const p=l.children.parameters[1];p.props.value=1;changed(p,'value');clock+=50;c.tick();
 const view=JSON.parse(outputs.at(-1)[2]);assert.equal(view.rows[0].state,'RECORD');assert.equal(view.pending,'unknown');assert.equal(view.phase,'unavailable');c.gridlength(l.id,8);assert.equal(c.referenceBars[l.id],8);assert.equal(p.props.value,1);
 const found=c.slots[0].parameters[1];found.display='Mystery';assert.equal(c.statusLabel(found),'API: Mystery');
});
test('stable device id preserves local reference on reorder; old callback generation ignored',()=>{
 const {song}=setup(),t=track('Loop');t.children.devices=[looper(),looper()];song.children.tracks.push(t);c.init();flush();const target=t.children.devices[1],old=watchers.slice();c.gridlength(target.id,8);t.children.devices.reverse();changed(t,'devices');clock+=300;c.tick();flush();assert.equal(c.slots[0].id,target.id);assert.equal(c.referenceBars[target.id],8);assert.ok(old.every(w=>w.prop===''));
});
test('transport reference, unsupported meter and JSON export with current inventory',()=>{
 const {song}=setup(),t=track('Loop');t.children.devices.push(looper());song.children.tracks.push(t);c.init();flush();c.tick();assert.equal(c.transportData.next_bar,.5);song.props.current_song_time=16;clock+=50;c.tick();assert.equal(c.transportData.grid4,0);assert.equal(c.transportData.grid8,.5);
 c.mark('Observed Record');const mark=c.events[c.events.length-1];song.props.current_song_time=17;clock+=50;c.tick();assert.equal(mark.transport.q,16,'marker must keep its own transport snapshot');song.props.signature_numerator=3;clock+=600;c.tick();assert.equal(c.transportData.grid_valid,false);c.export_report('/tmp/result.json');const r=JSON.parse(content);assert.equal(r.loopers.length,1);assert.equal(r.schema,'mld-diagnostic-2');
});
function mixerSends(t,values=[0,.5,1]){
 const sends=values.map((value,i)=>node('DeviceParameter',{name:'Send '+String.fromCharCode(65+i),value,min:0,max:1}));
 const mixer=node('MixerDevice',{}, {sends});t.children.mixer_device=mixer;return {mixer,sends};
}
test('A/B sends use host track IDs, native display and live values; C is never read or observed',()=>{
 const {song}=setup(),t=track('Same name'),other=track('Same name');t.children.devices=[looper()];other.children.devices=[looper()];
 const a=mixerSends(t),b=mixerSends(other,[1,.25,.8]);song.children.tracks=[t,other];song.children.return_tracks=[track('Reverb'),track('Delay'),track('Audio routing')];
 c.init();flush();c.tick();let rows=JSON.parse(outputs.at(-1)[2]).rows;
 assert.deepEqual(rows[0].sends.map(s=>[s.letter,s.name,s.display,s.position,s.available]),[['A','Reverb','-inf dB',0,true],['B','Delay','-30.0 dB',.5,true]]);
 assert.equal(rows[1].sends[0].position,1);assert.equal(rows[1].sends[1].position,.25);
 const scans=c.scans;a.sends[0].props.value=.75;changed(a.sends[0],'value');clock+=50;c.tick();rows=JSON.parse(outputs.at(-1)[2]).rows;
 assert.equal(rows[0].sends[0].display,'-15.0 dB');assert.equal(rows[0].sends[0].position,.75);assert.equal(c.scans,scans);
 for(const p of [a.sends[2],b.sends[2]]){assert.ok(!reads.some(r=>r.id===p.id));assert.ok(!watchers.some(w=>w.o===p));}
 assert.equal(a.sends[2].props.value,1);c.export_report('/tmp/sends.json');assert.equal(JSON.parse(content).loopers[0].sends.length,2);
 song.children.tracks.reverse();changed(song,'tracks');clock+=300;c.tick();flush();c.tick();rows=JSON.parse(outputs.at(-1)[2]).rows;
 assert.equal(rows[0].id,other.children.devices[0].id);assert.equal(rows[0].sends[0].position,1);assert.equal(rows[1].sends[0].position,.75);
});
test('missing A/B returns or send parameters remain unavailable without breaking Looper state',()=>{
 const {song}=setup(),t=track('Input');t.children.devices=[looper()];mixerSends(t);song.children.tracks=[t];
 c.init();flush();c.tick();let row=JSON.parse(outputs.at(-1)[2]).rows[0];assert.ok(row.sends.every(s=>!s.available));assert.equal(row.state,'STOP');
 song.children.return_tracks=[track('Reverb')];changed(song,'return_tracks');clock+=300;c.tick();flush();c.tick();row=JSON.parse(outputs.at(-1)[2]).rows[0];
 assert.equal(row.sends[0].available,true);assert.equal(row.sends[1].available,false);
 t.children.mixer_device.children.sends=[];changed(t.children.mixer_device,'sends');clock+=300;c.tick();flush();c.tick();row=JSON.parse(outputs.at(-1)[2]).rows[0];assert.ok(row.sends.every(s=>!s.available));assert.equal(row.available,true);
});
test('return rename, reorder and removal rebind A/B, including fallback without callbacks',()=>{
 const {song}=setup(),t=track('Loop');t.children.devices=[looper()];const {mixer,sends}=mixerSends(t);song.children.tracks=[t];
 const reverb=track('Reverb'),delay=track('Delay');song.children.return_tracks=[reverb,delay];c.init();flush();c.tick();
 reverb.props.name='Hall';changed(reverb,'name');clock+=300;c.tick();flush();assert.equal(c.slots[0].sends[0].name,'Hall');
 song.children.return_tracks.reverse();mixer.children.sends=[sends[1],sends[0],sends[2]];changed(song,'return_tracks');clock+=300;c.tick();flush();
 assert.equal(c.slots[0].sends[0].name,'Delay');assert.equal(c.slots[0].sends[0].id,sends[1].id);
 delay.props.name='Echo';clock+=5100;c.tick();flush();assert.equal(c.slots[0].sends[0].name,'Echo');
 song.children.return_tracks=[];changed(song,'return_tracks');clock+=300;c.tick();flush();c.tick();assert.ok(JSON.parse(outputs.at(-1)[2]).rows[0].sends.every(s=>!s.available));
 assert.ok(watchers.filter(w=>sends.includes(w.o)).every(w=>w.prop===''));
});
test('nested Loopers share only one pair of host send observers; dirty snapshots hide values',()=>{
 const {song}=setup(),t=track('Rack');const {sends}=mixerSends(t);const chain=node('Chain',{name:'Chain'},{devices:[looper()]});
 t.children.devices=[looper(),node('Rack',{name:'Rack',can_have_chains:1},{chains:[chain]})];song.children.tracks=[t];song.children.return_tracks=[track('A'),track('B')];
 c.init();flush();c.tick();assert.equal(watchers.filter(w=>sends.includes(w.o)&&w.prop==='value').length,2);
 sends[1].props.value=.9;changed(sends[1],'value');clock+=50;c.tick();assert.ok(JSON.parse(outputs.at(-1)[2]).rows.every(r=>r.sends[1].position===.9));
 c.dirty=true;c.publish();assert.ok(JSON.parse(outputs.at(-1)[2]).rows.every(r=>r.sends.every(s=>!s.available&&s.position===null&&s.display==='')));
});
test('deletion cleans all subscriptions and Task',()=>{setup();c.init();flush();const timer=c.timer;c.notifydeleted();assert.ok(timer.cancelled&&timer.freed);assert.equal(c.refs.length,0);});
test('buffer length is observed independently of State, exported live and absent API stays unknown',()=>{
 const {song}=setup(),t=track('Looper A'),l=looper();l.props.loop_length=0;l.functions=['clear'];t.children.devices=[l];song.children.tracks=[t];c.init();flush();c.tick();
 assert.equal(JSON.parse(outputs.at(-1)[2]).rows[0].loop_length,0);assert.equal(JSON.parse(outputs.at(-1)[2]).rows[0].clear_available,true);
 l.props.loop_length=16;changed(l,'loop_length');c.tick();assert.equal(JSON.parse(outputs.at(-1)[2]).rows[0].loop_length,16);
 l.props.loop_length=0;changed(l,'loop_length');c.tick();assert.equal(JSON.parse(outputs.at(-1)[2]).rows[0].loop_length,0);
 delete l.props.loop_length;delete l.functions;c.rescan();flush();c.tick();assert.equal(JSON.parse(outputs.at(-1)[2]).rows[0].loop_length,null);
 assert.equal(JSON.parse(outputs.at(-1)[2]).rows[0].clear_available,false);
});
console.log(passed+' dynamic discovery/read-only mock tests passed; native Live validation still required.');
