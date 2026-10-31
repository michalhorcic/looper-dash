const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');let c,nodes,nextId,watchers,initial,outputs,clock,content;
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
 nodes=new Map();nextId=1;watchers=[];initial=[];outputs=[];clock=10000;content='';
 const master=track('Master'), song=node('Song',{current_song_time:3.5,is_playing:1,tempo:120,signature_numerator:4,signature_denominator:4,clip_trigger_quantization:4},{tracks:[],return_tracks:[],master_track:master});
 function resolve(p){if(p.startsWith('id '))return nodes.get(Number(p.slice(3)));let ss=p.split(' '),o=song;assert.equal(ss.shift(),'live_set');while(ss.length){let key=ss.shift(),v=o.children[key];o=Array.isArray(v)?v[Number(ss.shift())]:v;if(!o)return null;}return o;}
 class API{
  constructor(cb,p){this.cb=cb;this.o=resolve(p);this._id=this.o?.id||0;}
  get id(){return this._id;}set id(v){this._id=v;}
  get info(){return Object.keys(this.o.props).map(k=>'property '+k+' float').concat(Object.keys(this.o.children).map(k=>'children '+k+' Device')).join('\n');}
  get(p){return inside(raw(this.o,p));}
  getcount(p){assert.ok(p in this.o.children,p);return this.o.children[p].length;}
  call(f,value){assert.equal(f,'str_for_value','read only');return inside([this.o.props.name==='State'?this.o.props.value_items[value]:String(value)]);}
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
test('deletion cleans all subscriptions and Task',()=>{setup();c.init();flush();const timer=c.timer;c.notifydeleted();assert.ok(timer.cancelled&&timer.freed);assert.equal(c.refs.length,0);});
console.log(passed+' dynamic discovery/read-only mock tests passed; native Live validation still required.');
