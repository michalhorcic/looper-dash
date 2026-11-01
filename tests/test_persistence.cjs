const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'mld2_led_setup.js'),'utf8');
const patch=JSON.parse(fs.readFileSync(path.join(root,'source/MultiLooperDashboard.maxpat'),'utf8')).patcher;
const key='ledwindow::setupstate';
function resolve(root,key){let p=root,b;for(const id of key.split('::')){b=p.boxes.find(x=>x.box.id===id)?.box;assert.ok(b,'unresolved parameter path '+key);p=b.patcher;}return b;}
function host(saved={}){
 // Host-boundary simulation follows the generated parameter registry, not getvalueof() on save.
 const param=resolve(patch,key);assert.ok(patch.parameters[key]);assert.equal(param.saved_object_attributes.thru,2);
 const atoms=structuredClone(saved[key]??param.restore),events=[],bank={[key]:atoms};let writes=0;
 class Task{constructor(fn){this.fn=fn;}repeat(){}cancel(){}freepeer(){}}
 class Clock extends Date{static now(){return 10000;}}
 const c=vm.createContext({Task,Date:Clock,notifyclients(){},arrayfromargs:x=>Array.from(x),outlet(...x){
  events.push(JSON.parse(JSON.stringify(x)));
  if(x[0]===7){assert.equal(x[1],'list');assert.equal(x.length,3);bank[key]=[x[2]];writes++; /* thru 2: no inlet echo */}
 }});vm.runInContext(source,c);
 return {c,events,bank,get writes(){return writes;},init(){c.loadbang();c.restore_state(...bank[key]);},bang(){c.restore_state(...bank[key]);},save(){return JSON.stringify(bank);}};
}
function rows(){return {rows:[{id:1,generation:1,track:'Looper A',state:'STOP',available:true,active:1,loop_length:8,clear_available:true,stop_available:true},{id:2,generation:1,track:'Looper B',state:'PLAY',available:true,active:1,loop_length:8,clear_available:true,stop_available:true}]};}
function configure(c){
 c.snapshot(JSON.stringify(rows()));c.routingtypes('<none>','LCXL3 1 (MIDI In)');c.choose_port(1);
 c.inputtypes('<none>','LCXL3 1 (MIDI Out)');c.choose_input(1);
 c.rowedit(0,'cc',37);c.rowedit(0,'enabled',1);c.rowedit(1,'cc',38);c.rowedit(1,'enabled',1);
 c.stopedit(0,'enabled',1);c.stopedit(0,'clear',1);c.stopedit(0,'inputOn',127);c.stopedit(0,'inputOff',0);
 c.stopedit(1,'on',126);c.stopedit(1,'off',1);c.holdseconds(2);c.run(1);
}
let passed=0;function test(name,fn){fn();passed++;console.log('PASS '+name);}
test('all parameter-enabled objects are registered by stable hierarchy path with native persistence attributes',()=>{
 const found={};function walk(p,prefix=''){for(const x of p.boxes){const b=x.box;
  if(b.saved_object_attributes?.parameter_enable||b.parameter_enable){const attr=b.saved_attribute_attributes?.valueof;if(attr)found[prefix+b.id]=[attr.parameter_longname,attr.parameter_shortname,attr.parameter_order??0];}
  if(b.patcher)walk(b.patcher,prefix+b.id+'::');}}
 walk(patch);assert.deepEqual(patch.parameters,found);assert.deepEqual(Object.keys(found),[key]);
 const p=resolve(patch,key);assert.equal(p.saved_attribute_attributes.valueof.parameter_type,3);assert.equal(p.saved_attribute_attributes.valueof.parameter_invisible,1);assert.equal(p.saved_attribute_attributes.valueof.parameter_initial_enable,0);
});
test('editing pushes complete configuration into the host parameter without a save-time JS callback',()=>{
 const h=host();h.init();assert.equal(h.writes,0,'startup must not replace the host value');configure(h.c);
 assert.ok(h.writes>5);assert.equal(h.bank[key][0],h.c.getvalueof());
 const saved=h.save();h.c.getvalueof=()=>{throw Error('Live save must use its parameter value, not call JS');};assert.equal(h.save(),saved);
});
test('save, dispose, fresh JS instance and Live restore recover all settings before port metadata/discovery',()=>{
 const h=host();h.init();configure(h.c);const expected=h.c.getvalueof(),saved=h.save();h.c.notifydeleted();assert.equal(h.bank[key][0],expected,'shutdown must not overwrite SYNC');
 const restored=host(JSON.parse(saved));assert.notEqual(restored.c.getvalueof(),expected);restored.c.loadbang();restored.c.snapshot(JSON.stringify({rows:[]}));assert.equal(restored.writes,0);
 restored.bang();assert.equal(restored.c.getvalueof(),expected);assert.equal(restored.c.config.assignments.length,2);assert.equal(restored.c.config.holdMs,2000);assert.equal(restored.c.config.run,true);assert.equal(restored.c.config.assignments[1].stop.on,126);assert.equal(restored.c.config.assignments[1].stop.inputOn,127);
 assert.equal(restored.events.filter(x=>x[0]===0||x[0]===6).length,0,'no physical MIDI/actions on an unresolved restored route');
 restored.c.snapshot(JSON.stringify(rows()));assert.equal(restored.c.getvalueof(),expected);
});
test('late initialization bang is idempotent and parameter recall does not echo a write or reset held state',()=>{
 const h=host();h.init();configure(h.c);const restored=host(JSON.parse(h.save()));restored.init();const writes=restored.writes;
 restored.c.held['$Looper A']={fired:false,start:10000};restored.bang();assert.ok(restored.c.held['$Looper A']);assert.equal(restored.writes,writes);
 const other=JSON.parse(decodeURIComponent(restored.c.getvalueof().slice(8)));other.holdMs=1500;
 const blob='mldled1:'+encodeURIComponent(JSON.stringify(other));restored.bank[key]=[blob];restored.bang();assert.equal(restored.c.config.holdMs,1500);assert.equal(restored.writes,writes,'Live recall must not feed back into the same parameter');
});
test('native atom/list envelopes are accepted, invalid restore is atomic and older schemas normalize once',()=>{
 const h=host();h.init();configure(h.c);const expected=h.c.getvalueof(),writes=h.writes;
 h.c.restore_state(['invalid']);assert.equal(h.c.getvalueof(),expected);assert.equal(h.writes,writes);
 h.c.restore_state('symbol',expected);h.c.restore_state('list',expected);h.c.restore_state([expected]);assert.equal(h.writes,writes);
 const old={version:1,port:'LCXL3 1 (MIDI In)',run:false,assignments:[{track:'Looper A',channel:15,cc:37,on:127,off:0,enabled:true}]};
 h.c.restore_state('mldled1:'+encodeURIComponent(JSON.stringify(old)));assert.equal(h.writes,writes+1);assert.equal(h.c.config.version,5);assert.equal(h.c.config.assignments[0].on,126);h.bang();assert.equal(h.writes,writes+1);
});
test('two devices persist independent blobs and routine monitor/input events never dirty the parameter',()=>{
 const a=host(),b=host();a.init();b.init();configure(a.c);configure(b.c);b.c.holdseconds(3);
 assert.notEqual(a.bank[key][0],b.bank[key][0]);const count=a.writes;
 for(let i=0;i<5;i++){a.c.snapshot(JSON.stringify(rows()));a.c.tick();a.c.midi_byte(248);}
 assert.equal(a.writes,count);assert.equal(host(JSON.parse(a.save())).bank[key][0],a.bank[key][0]);
});
test('GUIDE CTRL persists ON/OFF through the actual host parameter without restoring presses or sending startup actions',()=>{
 const h=host();h.init();assert.equal(h.c.config.guideControl,false);configure(h.c);
 const before=h.writes;h.c.guidecontrol(1);assert.equal(h.writes,before+1);assert.equal(h.bank[key][0],h.c.getvalueof());
 h.c.guidePressed['$Looper A']=true;h.c.guideReleased['$Looper A']=true;
 const saved=h.save();assert.ok(!saved.includes('guidePressed')&&!saved.includes('guideReleased'));
 const r=host(JSON.parse(saved));r.init();assert.equal(r.c.config.guideControl,true);
 assert.equal(Object.keys(r.c.guidePressed).length,0);assert.equal(Object.keys(r.c.guideReleased).length,0);
 assert.equal(r.events.filter(x=>x[0]===6).length,0);assert.ok(r.events.some(x=>x[0]===1&&JSON.stringify(x[1])===JSON.stringify(['script','sendbox','guideControl','set',1])));
 r.c.snapshot(JSON.stringify({...rows(),transport:{playing:1,grid_valid:true}}));
 // Restore routing metadata asynchronously: enablement alone cannot generate a command.
 r.c.routingtypes('<none>','LCXL3 1 (MIDI In)');r.c.routingchannels('15');r.c.routingtype(1);r.c.routingchannel(0);
 r.c.inputtypes('<none>','LCXL3 1 (MIDI Out)');r.c.inputchannels('15');r.c.inputtype(1);r.c.inputchannel(0);
 function cc(v){for(const byte of [190,37,v])r.c.midi_byte(byte);}
 cc(127);cc(127);assert.equal(r.events.filter(x=>x[0]===6).length,0,'held startup button is not restored or accepted');
 cc(0);cc(127);assert.equal(r.events.filter(x=>x[0]===6).length,1,'new release/press works after confirmed routes');
 const n=r.writes;r.bang();assert.equal(r.writes,n);assert.equal(r.c.guidePressed['$Looper A'],true,'idempotent late recall must not reset a live press');
 r.c.guidecontrol(0);assert.equal(r.writes,n+1);const off=host(JSON.parse(r.save()));off.init();assert.equal(off.c.config.guideControl,false);
});
test('older configuration migrates with GUIDE CTRL off, malformed new flag is rejected atomically',()=>{
 const h=host();h.init();configure(h.c);h.c.guidecontrol(1);const expected=h.c.getvalueof(),count=h.writes;
 const bad=JSON.parse(decodeURIComponent(expected.slice(8)));bad.guideControl='true';h.c.restore_state('mldled1:'+encodeURIComponent(JSON.stringify(bad)));
 assert.equal(h.c.getvalueof(),expected);assert.equal(h.writes,count);
 const old={...bad,version:3};delete old.guideControl;
 h.c.restore_state('mldled1:'+encodeURIComponent(JSON.stringify(old)));assert.equal(h.c.config.version,5);assert.equal(h.c.config.guideControl,false);
 assert.equal(h.c.config.assignments.length,2);assert.equal(h.c.config.assignments[0].cc,37);assert.equal(h.writes,count+1);
});
console.log(passed+' parameter persistence/lifecycle tests passed; native Live Set reopen remains a hardware-host check.');
