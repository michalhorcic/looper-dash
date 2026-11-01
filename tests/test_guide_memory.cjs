const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');const patch=JSON.parse(fs.readFileSync(path.join(root,'source/MultiLooperDashboard.maxpat'),'utf8')).patcher;
const panel=patch.boxes.find(x=>x.box.id==='ledwindow').box.patcher;
const state=panel.boxes.find(x=>x.box.id==='setupstate').box;
assert.ok(patch.parameters['ledwindow::setupstate']);
let now=10000;
class Clock extends Date{static now(){return now;}}
class Task{repeat(){}cancel(){}freepeer(){}}
function instance(saved){
 let core,setup,packet,writes=0,bank=saved||state.restore[0];
 const env={Date:Clock,Task,arrayfromargs:v=>Array.from(v),post(){},notifyclients(){}};
 core=vm.createContext({...env,outlet(index,selector,payload){assert.equal(index,0);if(selector==='snapshot'){packet=JSON.parse(payload);setup.snapshot(payload);}}});
 setup=vm.createContext({...env,outlet(index,selector,payload){if(index===7){assert.equal(selector,'list');bank=payload;writes++;}else if(index===8){assert.equal(selector,'guide_memory_restore');core.guide_memory_restore(payload);}}});
 vm.runInContext(fs.readFileSync(path.join(root,'mld2_core.js'),'utf8'),core);
 vm.runInContext(fs.readFileSync(path.join(root,'mld2_led_setup.js'),'utf8'),setup);
 core.epoch=1;core.slots=[];
 return {core,setup,get packet(){return packet;},get writes(){return writes;},get bank(){return bank;},restore(){setup.loadbang();setup.restore_state(bank);},save(){return bank;},advance(q,slots){now+=250;if(slots)core.slots=slots;core.transportData={q,playing:1,grid_valid:true,bpm:120,wall_ms:now};core.publish();},command(action,q,extra={}){core.guide_event(JSON.stringify({id:core.slots[0].id,generation:core.epoch,action,q,at:now,...extra}));}};
}
function slot(id=1,track='Looper A'){return {id,track,name:'Looper',trail:[],sends:[],parameters:[{id:20,name:'State',display:'STOP'}],available:true,active:1,loop_length:0,guide_record_index:0,guide_record_list:['4 Bars','8 Bars']};}
function native(s,label,buffer){s.parameters[0].display=label;if(buffer!==undefined)s.loop_length=buffer;return s;}
let a=instance();a.restore();let s=slot();a.advance(2,[s]);a.command('record',2);
for(let q=2.5;q<4;q+=.5)a.advance(q);
for(let q=4;q<20;q+=.5)a.advance(q,[native(s,'RECORD')]);
a.advance(20,[native(s,'PLAY',8)]);let stored=JSON.parse(decodeURIComponent(a.bank.slice(8)));
assert.equal(stored.guideMemory.length,1);assert.deepEqual(stored.guideMemory[0],{track:'Looper A',name:'Looper',trail:[],bars:4,buffer:8});
assert.ok(!('id' in stored.guideMemory[0])&&!('q' in stored.guideMemory[0])&&!('generation' in stored.guideMemory[0]));
const saved=a.save(),count=a.writes;for(let q=20.5;q<=23;q+=.5)a.advance(q);assert.equal(a.writes,count,'normal snapshots do not repeatedly dirty host state');
// Fresh process identity and pre-/post-restore empty discovery cannot erase host memory.
let b=instance(saved);b.advance(0,[]);assert.equal(b.bank,saved);assert.equal(b.writes,0);b.restore();b.advance(.5,[]);assert.equal(b.bank,saved);
let loaded=slot(101);b.core.epoch=9;loaded.guide_record_index=1;
b.advance(1,[loaded]);assert.equal(b.packet.guide_memory.length,1,'initial zero buffer can precede audio restore');
b.advance(1.5,[native(loaded,'STOP',8)]);assert.equal(b.core.guideLengths['101'].bars,4);assert.equal(b.packet.rows[0].loop_bars,4);assert.equal(Object.keys(b.core.guideAnchors).length,0,'no phase restored');
b.command('play',1.5,{from_stopped:true,buffer_length:8});for(let q=2;q<4;q+=.5)b.advance(q);b.advance(4,[native(loaded,'PLAY')]);
assert.equal(b.core.guideAnchors['101'].q,4);
b.advance(4.5);b.command('overdub',4.5);for(let q=5;q<8;q+=.5)b.advance(q);b.advance(8,[native(loaded,'OVERDUB')]);
assert.equal(b.packet.guide.mode,'overdub');assert.equal(b.packet.guide.bar,2);assert.equal(b.packet.guide.bars,4,'future Record Length does not replace saved audio length');
b.command('clear',0);b.advance(8.5,[native(loaded,'STOP',0)]);assert.deepEqual(JSON.parse(decodeURIComponent(b.bank.slice(8))).guideMemory,[],'Clear reaches host storage');
console.log('PASS actual core -> setup -> host bank -> fresh modules -> new runtime IDs -> Play -> Overdub; startup order, no saved phase, no repeated writes, Clear');
for(const variation of ['duplicate','rename','device','trail','buffer','replacement']){
 const h=instance(saved);h.restore();let r=slot(200);native(r,'STOP',8);
 if(variation==='duplicate')h.advance(0,[r,native(slot(201),'STOP',8)]);
 else if(variation==='rename'){r.track='Renamed';h.advance(0,[r]);}
 else if(variation==='device'){r.name='Other Looper';h.advance(0,[r]);}
 else if(variation==='trail'){r.trail=['Other Rack'];h.advance(0,[r]);}
 else if(variation==='buffer'){r.loop_length=16;h.advance(0,[r]);}
 else {h.advance(0,[r]);r=slot(201);native(r,'STOP',8);h.advance(.5,[r]);}
 assert.equal(h.core.guideLengths[String(r.id)],undefined,variation+' must not inherit a known duration');
}
console.log('PASS duplicate/renamed/device/rack/changed-buffer and same-session replacement guards');
// Validate the host boundary and handshake independently of runtime snapshots.
const h=instance(saved);h.restore();const before=h.bank;
const malformed=JSON.parse(decodeURIComponent(before.slice(8)));malformed.guideMemory[0].bars=-1;
h.setup.restore_state('mldled1:'+encodeURIComponent(JSON.stringify(malformed)));assert.equal(h.bank,before);
const old={...stored,version:4,guideControl:true};delete old.guideMemory;
h.setup.restore_state('mldled1:'+encodeURIComponent(JSON.stringify(old)));assert.equal(h.setup.config.guideControl,true);assert.equal(h.setup.config.version,5);assert.equal(h.setup.config.guideMemory.length,0);
console.log('PASS schema validation is atomic; v4 control settings migrate with empty audio metadata');
