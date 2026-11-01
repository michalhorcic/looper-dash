const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const dir=require('node:path').join(__dirname,'..');let now=10000;
class Clock extends Date{static now(){return now;}}
const c=vm.createContext({Date:Clock,arrayfromargs:v=>Array.from(v),outlet(){},post(){}});
vm.runInContext(fs.readFileSync(dir+'/mld2_core.js','utf8'),c);c.publish=()=>{};c.epoch=1;
const slot={id:1,guide_record_index:1,guide_record_list:['x bars','4 Bars','8 Bars']};c.slots=[slot];
let row={id:1,generation:1,track:'Loop A',state:'STOP',available:true,active:1,loop_length:0};
function view(q,patch={}){now+=Math.max(50,c.guideLastQ===null?50:(q-c.guideLastQ)*500);Object.assign(row,patch);return c.guideView([row],{q,playing:1,grid_valid:true,bpm:120});}
function event(action,q){c.guide_event(JSON.stringify({id:1,generation:1,action,q,at:now}));}
assert.equal(c.recordBars(slot),4);assert.equal(c.recordBars({...slot,guide_record_index:0}),null);assert.equal(c.recordBars({...slot,guide_record_index:99}),null);
event('record',2);assert.equal(view(2).remaining,2);assert.equal(view(3.5).mode,'pending');
assert.equal(view(4).mode,'waiting','do not treat expected start as native confirmation');
let g=view(4.1,{state:'RECORD'});assert.equal(g.mode,'record');assert.equal(g.bar,1);assert.equal(g.total,16);
for(let q=4.5;q<=16;q+=.5)view(q);
g=view(16.5);assert.equal(g.bar,4);assert.equal(g.remaining,3.5);
for(let q=17;q<=20;q+=.5)view(q);
assert.equal(view(20).mode,'waiting','do not claim Play before native state');
assert.equal(view(20.1,{state:'PLAY',loop_length:16}).mode,'done');assert.equal(view(20.2).mode,'done','completion remains briefly visible');
for(let q=20.5;q<=24;q+=.5)view(q);
event('overdub',24);assert.equal(view(25).mode,'pending');
for(let q=25.5;q<28;q+=.5)view(q);
g=view(28,{state:'OVERDUB'});assert.equal(g.mode,'overdub');assert.equal(g.bar,3,'Overdub retains original loop origin rather than restarting at bar 1');
assert.equal(g.remaining,8);assert.equal(g.bars,4);
view(28.5,{loop_length:8});assert.equal(view(29).mode,'unknown','buffer resize invalidates phase');
event('stop',0);assert.equal(view(29.5,{state:'STOP'}).mode,'idle');
event('play',29.5);for(let q=30;q<=32;q+=.5)view(q);assert.equal(view(32.1,{state:'PLAY'}).mode,'done');
event('overdub',32.1);for(let q=32.5;q<36;q+=.5)view(q);assert.equal(view(36,{state:'OVERDUB'}).mode,'unknown','restart does not invent a phase');
assert.equal(view(2).mode,'unknown','transport seek discards phase');
const other={...row,id:2,track:'B'};assert.equal(c.guideView([row,other],{q:2.1,playing:1,grid_valid:true,bpm:120}).mode,'conflict');
assert.equal(c.guideView([row],{q:2.1,playing:0,grid_valid:true}).mode,'unavailable');
event('record',2);now+=1500;assert.notEqual(view(4,{state:'RECORD'}).mode,'record','stale transport invalidates timeline');
console.log('PASS guide: fixed-length metadata, queued start, confirmed states, final bar, persistent Done, original Overdub phase, resize/Stop/seek/stale/unknown/conflict');
// Guarded command integration: real action handler, simulated native API.
let out=[],writes=[],nativeState='Stopped',buffer=0,quant='1 Bar',playing=1;
class API{
 constructor(cb,p){this.path=p;this.id=p==='live_set'?99:Number(p.slice(3));}
 get info(){return 'function clear\nfunction stop\nfunction record\nfunction play\nfunction overdub';}
 get(p){if(this.path==='live_set')return [{current_song_time:2,is_playing:playing,signature_numerator:4,signature_denominator:4}[p]];
 if(this.id===1)return p==='parameters'?['id',10,'id',11]:[{class_name:'Looper',is_active:1,loop_length:buffer}[p]];
 return [{name:this.id===10?'State':'Quantization',original_name:this.id===10?'State':'Quantization',value:0}[p]];}
 call(name){if(name==='str_for_value')return [this.id===10?nativeState:quant];writes.push(name);}
}
const a=vm.createContext({Date:Clock,LiveAPI:API,arrayfromargs:v=>Array.from(v),outlet(...v){out.push(v);}});vm.runInContext(fs.readFileSync(dir+'/mld2_actions.js','utf8'),a);
let serial=0;function command(authorized=true){a.snapshot(JSON.stringify({rows:[{id:1,generation:1,track:'A',available:true,active:1,state:'STOP',loop_length:0}]}));const q=JSON.stringify({action:'multi',id:1,generation:1,track:'A',at:now,token:'t'+serial++});if(authorized)a.authorize(q);a.request(q);}
command(false);assert.equal(writes.length,0);command();assert.deepEqual(writes,['record']);assert.ok(out.some(v=>v[0]===1&&JSON.parse(v[2]).q===2));assert.equal(JSON.parse(out.filter(v=>v[0]===1).at(-1)[2]).from_stopped,true);
nativeState='Playing';buffer=16;command();assert.equal(writes.at(-1),'overdub');assert.equal(JSON.parse(out.filter(v=>v[0]===1).at(-1)[2]).from_stopped,false);nativeState='Overdubbing';command();assert.equal(writes.at(-1),'play');
nativeState='Stopped';command();assert.equal(writes.at(-1),'play','native buffer read overrides stale empty snapshot');
let n=writes.length;quant='None';command();assert.equal(writes.length,n);quant='1 Bar';playing=0;command();assert.equal(writes.length,n);playing=1;nativeState='Mystery';command();assert.equal(writes.length,n);
console.log('PASS guarded guide control: opt-in permit, native state/buffer, command event, fixed quantization, running transport and unknown-state rejection');
// Host-boundary regression: action samples a newer clock than the cached UI snapshot.
{
 let packets=[];const h=vm.createContext({Date:Clock,arrayfromargs:v=>Array.from(v),outlet(...v){packets.push(v);},post(){}});
 vm.runInContext(fs.readFileSync(dir+'/mld2_core.js','utf8'),h);h.epoch=1;
 h.slots=[{id:1,track:'A',sends:[],parameters:[{name:'State',display:'STOP'}],available:true,active:1,loop_length:0,guide_record_index:0,guide_record_list:['4 Bars']}];
 h.transportData={q:10,playing:1,grid_valid:true,bpm:120,wall_ms:now};h.publish();
 now+=40;h.guide_event(JSON.stringify({id:1,generation:1,action:'record',q:10.08,at:now}));
 assert.ok(h.guideSession,'acknowledged command must survive cached pre-command transport');
 h.publish();assert.ok(h.guideSession,'even another publish of old cached transport must not look like a seek');
 h.transportData={q:10.1,playing:1,grid_valid:true,bpm:120,wall_ms:now+10};now+=10;h.publish();
 let p=JSON.parse(packets.at(-1)[2]);assert.equal(p.guide.mode,'pending');assert.ok(Math.abs(p.guide.remaining-1.9)<.001);
 for(let q=10.5;q<=12;q+=.5){now+=250;h.transportData={q,playing:1,grid_valid:true,bpm:120,wall_ms:now};h.slots[0].parameters[0].display=q>=12?'RECORD':'STOP';h.publish();}
 p=JSON.parse(packets.at(-1)[2]);assert.equal(p.guide.mode,'record');assert.equal(p.guide.bars,4);
 console.log('PASS actual core publish integration: newer action clock never becomes a false backward seek on cached snapshots');
}
{
 const h=vm.createContext({Date:Clock,arrayfromargs:v=>Array.from(v),outlet(){},post(){}});
 vm.runInContext(fs.readFileSync(dir+'/mld2_core.js','utf8'),h);h.publish=()=>{};h.epoch=1;h.slots=[slot];
 h.guide_event(JSON.stringify({id:1,generation:1,action:'record',q:10,at:now}));now+=50;
 h.guideView([row],{q:8,playing:1,grid_valid:true,bpm:120,wall_ms:now});assert.equal(h.guideSession,null,'genuinely new backward sample still invalidates session');
 console.log('PASS fresh real seek remains distinct from pre-command cached transport');
}
// The user's complete flow: record -> overdub -> stop -> restart -> overdub.
{
 const h=vm.createContext({Date:Clock,arrayfromargs:v=>Array.from(v),outlet(){},post(){}});
 vm.runInContext(fs.readFileSync(dir+'/mld2_core.js','utf8'),h);h.publish=()=>{};h.epoch=1;h.slots=[slot];
 let r={id:1,generation:1,track:'A',state:'STOP',available:true,active:1,loop_length:0};
 function command(action,q,extra={}){h.guide_event(JSON.stringify({id:1,generation:1,action,q,at:now,...extra}));}
 function advance(q,state,buffer){now+=250;if(state)r.state=state;if(buffer!==undefined)r.loop_length=buffer;return h.guideView([r],{q,wall_ms:now,playing:1,grid_valid:true,bpm:120});}
 command('record',2);for(let q=2.5;q<4;q+=.5)advance(q);
 for(let q=4;q<20;q+=.5)advance(q,'RECORD');advance(20,'PLAY',16);
 assert.equal(h.guideLengths['1'].bars,4,'remember completed length, not current Record Length setting');
 command('overdub',20);for(let q=20.5;q<24;q+=.5)advance(q);assert.equal(advance(24,'OVERDUB').bar,2);
 command('stop',0);advance(24.5,'STOP');assert.ok(h.guideLengths['1']);assert.equal(h.guideAnchors['1'],undefined);
 // Keep the stopped buffer across many native snapshots; new first bar is q=28.
 advance(25);advance(25.5);command('play',25.5,{from_stopped:true,buffer_length:16});
 for(let q=26;q<28;q+=.5)assert.equal(advance(q).mode,'pending');
 assert.equal(advance(28,'PLAY').restarted,true);assert.equal(h.guideAnchors['1'].q,28);
 // Change future Record Length to 8; existing loop is still four bars.
 h.slots[0].guide_record_index=2;
 for(let q=28.5;q<=29;q+=.5)advance(q);
 command('overdub',29);for(let q=29.5;q<32;q+=.5)advance(q);
 let v=advance(32,'OVERDUB');assert.equal(v.mode,'overdub');assert.equal(v.bar,2);assert.equal(v.bars,4);assert.equal(v.remaining,12);
 // Exiting overdub is not a restart and must retain q=28.
 command('play',32,{from_stopped:false,buffer_length:16});for(let q=32.5;q<36;q+=.5)advance(q);advance(36,'PLAY');assert.equal(h.guideAnchors['1'].q,28);
 // Repeat stop/restart at a different position, then verify another overdub.
 command('stop',0);advance(36.5,'STOP');command('play',36.5,{from_stopped:true,buffer_length:16});for(let q=37;q<40;q+=.5)advance(q);advance(40,'PLAY');
 command('overdub',40);for(let q=40.5;q<44;q+=.5)advance(q);assert.equal(advance(44,'OVERDUB').bar,2);
 command('clear',0);advance(44.5,'STOP',0);assert.equal(h.guideLengths['1'],undefined);assert.equal(h.guideAnchors['1'],undefined);
 console.log('PASS full restart/Overdub flow twice: stored buffer length, confirmed restart origin, no re-anchor on exit, Clear invalidation');
}

// An unknown or edited buffer must not inherit the planned Record Length.
{
 const h=vm.createContext({Date:Clock,arrayfromargs:v=>Array.from(v),outlet(){},post(){}});
 vm.runInContext(fs.readFileSync(dir+'/mld2_core.js','utf8'),h);h.publish=()=>{};h.epoch=1;h.slots=[slot];
 const r={id:1,generation:1,track:'A',state:'STOP',available:true,active:1,loop_length:8};
 function event(q){h.guide_event(JSON.stringify({id:1,generation:1,action:'play',q,at:now,from_stopped:true,buffer_length:8}));}
 function view(q,state){now+=250;r.state=state;return h.guideView([r],{q,wall_ms:now,playing:1,grid_valid:true,bpm:120});}
 event(1);for(let q=1.5;q<4;q+=.5)view(q,'STOP');view(4,'PLAY');assert.equal(h.guideAnchors['1'],undefined,'no known length after fresh load');
 h.guideLengths['1']={bars:4,buffer:16,generation:1};event(4);for(let q=4.5;q<8;q+=.5)view(q,'STOP');view(8,'PLAY');assert.equal(h.guideAnchors['1'],undefined,'changed buffer cannot reuse recorded length');
 assert.equal(h.guideLengths['1'],undefined);
 console.log('PASS restart refuses unknown/changed buffer; fixed Record Length is not substituted for existing audio length');
}
