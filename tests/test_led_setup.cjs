const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'mld2_led_setup.js'),'utf8');
let c,out,now,tasks,notifications;
function setup(){out=[];now=10000;tasks=[];notifications=0;
 class Task{constructor(fn){this.fn=fn;tasks.push(this);}repeat(){}cancel(){this.cancelled=true;}freepeer(){this.freed=true;}}
 class Clock extends Date{static now(){return now;}}
 c=vm.createContext({Task,Date:Clock,outlet(...v){out.push(JSON.parse(JSON.stringify(v)));},notifyclients(){notifications++;},arrayfromargs:v=>Array.from(v)});vm.runInContext(source,c);
}
function midi(){return out.filter(x=>x[0]===0).map(x=>x[1]);}
function row(track,state='PLAY',id=1){return {id,generation:1,track,name:'Looper',available:true,active:1,state,loop_length:8,clear_available:true,stop_available:true};}
function snapshot(rows=[row('Looper A')]){c.snapshot(JSON.stringify({rows}));}
function route(channel=15){c.routingtypes('<none>','LCXL3 1 (DAW In)','LCXL3 1 (MIDI In)','LCXL3 1 (To DIN Out)');c.routingchannels('All Channels',...Array.from({length:16},(_,i)=>'Ch. '+(i+1)));c.routingtype(2);c.routingchannel(channel);c.choose_port(1);}
function assign(slot,cc,channel=15){c.rowedit(slot,'channel',channel);c.rowedit(slot,'cc',cc);c.rowedit(slot,'on',127);c.rowedit(slot,'off',0);c.rowedit(slot,'enabled',1);}
function saved(){return JSON.parse(decodeURIComponent(c.getvalueof().slice(8)));}
function restore(config){c.setvalueof('mldled1:'+encodeURIComponent(JSON.stringify(config)));}
let passed=0;function test(name,fn){setup();fn();passed++;console.log('PASS '+name);}
test('new discoveries remain disabled/unassigned; routing is manual and no automatic MIDI is emitted',()=>{
 snapshot([row('A'),row('B')]);assert.equal(c.items.length,2);assert.match(c.rowStatus('A'),/UNASSIGNED/);assert.deepEqual(saved().assignments,[]);assert.deepEqual(midi(),[]);
 c.run(1);now+=100;c.tick();assert.deepEqual(midi(),[]);assert.equal(saved().port,'');
 assert.ok(!out.some(x=>x[0]===2),'no auto destination without a saved/user selection');
});
test('all detected tracks paginate; missing assignments survive and RESET removes only their settings',()=>{
 snapshot(Array.from({length:11},(_,i)=>row('Track '+i,'PLAY',i+1)));assert.equal(c.items.length,11);
 c.turnpage(2);assign(2,47);assert.equal(saved().assignments[0].track,'Track 10');
 c.turnpage(20);assert.equal(c.page,2);c.turnpage(-20);assert.equal(c.page,0);
 snapshot([row('Track 0')]);assert.equal(c.items.length,2);assert.match(c.rowStatus('Track 10'),/MISSING/);
 c.forget(1);assert.equal(c.items.length,1);assert.equal(saved().assignments.length,0);
 assign(0,37);c.forget(0);assert.equal(c.items.length,1);assert.match(c.rowStatus('Track 0'),/UNASSIGNED/);
});
test('multiple Loopers follow independently on a confirmed common channel with configured colours',()=>{
 route();snapshot([row('A','PLAY'),row('B','STOP',2),row('C','RECORD',3),row('D','OVERDUB',4)]);
 assign(0,37,15);assign(1,38);assign(2,39);assign(3,40);c.rowedit(1,'off',5);c.rowedit(2,'on',90);out=[];c.run(1);
 assert.deepEqual(midi(),[[190,37,127],[190,38,5],[190,39,90],[190,40,127]]);
 assert.equal(tasks.at(-1).interval,25);out=[];now+=100;tasks.at(-1).fn();assert.equal(midi().length,4,'steady state refreshes at 100ms');
 now+=25;snapshot([row('A','PLAY'),row('B','STOP',2),row('C','RECORD',3),row('D','OVERDUB',4)]);assert.deepEqual(midi().at(-1),[190,40,0]);
 now+=375;snapshot([row('A','PLAY'),row('B','STOP',2),row('C','RECORD',3),row('D','OVERDUB',4)]);assert.ok(midi().some(p=>p[0]===190&&p[1]===39&&p[2]===0));
 assert.ok(midi().every(p=>p.length===3&&p[0]>=176&&p[0]<=191&&p.slice(1).every(v=>Number.isInteger(v)&&v>=0&&v<=127)));
});
test('repeated snapshots preserve blink phase; every state transition starts immediately',()=>{
 route();snapshot([row('A','RECORD')]);assign(0,37);c.run(1);out=[];
 now+=499;snapshot([row('A','RECORD')]);assert.deepEqual(midi().at(-1),[190,37,127]);
 now++;c.tick();assert.deepEqual(midi().at(-1),[190,37,0]);
 now+=500;snapshot([row('A','RECORD')]);assert.deepEqual(midi().at(-1),[190,37,127]);
 snapshot([row('A','OVERDUB')]);assert.deepEqual(midi().at(-1),[190,37,127]);
 now+=125;c.tick();assert.deepEqual(midi().at(-1),[190,37,0]);
 snapshot([row('A','PLAY')]);assert.deepEqual(midi().at(-1),[190,37,127]);snapshot([row('A','STOP')]);assert.deepEqual(midi().at(-1),[190,37,0]);
});
test('duplicate enabled channel/CC pairs are blocked and previous LED is cleared',()=>{
 route();snapshot([row('A'),row('B','PLAY',2)]);assign(0,37);c.run(1);c.rowedit(1,'cc',37);out=[];c.rowedit(1,'enabled',1);
 assert.match(c.rowStatus('A'),/CONFLICT/);assert.match(c.rowStatus('B'),/CONFLICT/);assert.ok(midi().every(p=>p[2]===0),'no On while collision is being introduced');
 out=[];now+=100;c.tick();assert.deepEqual(midi(),[],'both conflicting rows blocked');
 c.rowedit(1,'enabled',0);assert.deepEqual(midi().at(-1),[190,37,127]);
 c.run(0);out=[];c.test(1,1);assert.deepEqual(midi(),[],'manual test cannot target another enabled assignment');
});
test('duplicate track names/Loopers, unknown state, stale and missing data fail to Off',()=>{
 route();snapshot();assign(0,37);c.rowedit(0,'off',7);c.run(1);
 snapshot([row('Looper A'),row('Looper A','PLAY',2)]);assert.match(c.rowStatus('Looper A'),/AMBIGUOUS/);assert.deepEqual(midi().at(-1),[190,37,7]);
 for(const patch of [{state:'UNKNOWN'},{active:0},{available:false}]){snapshot([{...row('Looper A'),...patch}]);assert.deepEqual(midi().at(-1),[190,37,7]);}
 snapshot();assert.deepEqual(midi().at(-1),[190,37,127]);now+=1501;c.tick();assert.deepEqual(midi().at(-1),[190,37,7]);
 snapshot([]);assert.match(c.rowStatus('Looper A'),/MISSING/);assert.deepEqual(midi().at(-1),[190,37,7]);
 snapshot();assert.deepEqual(midi().at(-1),[190,37,127]);c.snapshot('invalid');assert.deepEqual(midi().at(-1),[190,37,7]);
});
test('renaming/reordering and runtime ID changes never silently reassign saved feedback',()=>{
 route();snapshot([row('A'),row('B','STOP',2)]);assign(0,37);assign(1,38);c.run(1);
 snapshot([row('B','PLAY',55),row('A','STOP',88)]);assert.deepEqual(midi().slice(-2),[[190,37,0],[190,38,127]]);
 snapshot([row('Renamed','PLAY',88),row('B','PLAY',55)]);assert.match(c.rowStatus('A'),/MISSING/);assert.match(c.rowStatus('Renamed'),/UNASSIGNED/);assert.deepEqual(midi().at(-1),[190,37,0]);
 const data=JSON.stringify(saved());assert.ok(!data.includes('"id"'));assert.ok(!data.includes('Renamed'));
});
test('parameter blob roundtrip restores names, values, output and sync state per instance',()=>{
 route();snapshot([row('A "quoted", č; /','OVERDUB')]);assign(0,127,16);c.rowedit(0,'on',80);c.rowedit(0,'off',12);c.run(1);
 assert.ok(notifications>0);const blob=c.getvalueof(),config=saved();assert.ok(!/\s/.test(blob));
 setup();c.setvalueof(blob);assert.deepEqual(saved(),config);assert.deepEqual(midi(),[],'restored config cannot emit before route confirmation');
 snapshot([row('A "quoted", č; /','OVERDUB',999)]);route(16);assert.deepEqual(midi().at(-1),[191,127,80]);
 assert.ok(out.some(x=>x[0]===2&&x[1]==='type'&&x[2]===2),'saved output resolved by name');
});
test('malformed saved state is rejected atomically; field ranges cannot emit invalid MIDI',()=>{
 route();snapshot();assign(0,37);const before=c.getvalueof();
 for(const v of ['bad','mldled1:%ZZ','mldled1:null']){c.setvalueof(v);assert.equal(c.getvalueof(),before);}
 const good=saved();for(const patch of [{channel:0},{channel:17},{cc:128},{cc:-2},{on:128},{off:-1},{enabled:'yes'}]){restore({...good,assignments:[{...good.assignments[0],...patch}]});assert.equal(c.getvalueof(),before);}
 restore({...good,port:'LCXL3 1 (DAW In)'});assert.equal(c.getvalueof(),before);
 restore({...good,assignments:[good.assignments[0],good.assignments[0]]});assert.equal(c.getvalueof(),before);
 for(const [field,value] of [['cc',128],['channel',0],['on',1.5],['enabled',7],['bogus',1]])c.rowedit(0,field,value);
 assert.equal(c.getvalueof(),before);assert.deepEqual(midi(),[]);
});
test('manual tests work with SYNC off and are excluded during follow; stop and deletion clean up',()=>{
 route();snapshot();assign(0,37);c.test(0,1);assert.deepEqual(midi().at(-1),[190,37,127]);
 out=[];now+=100;c.tick();snapshot();assert.deepEqual(midi(),[],'manual colour is not refreshed');
 c.test(0,0);assert.deepEqual(midi().at(-1),[190,37,0]);c.run(1);out=[];c.test(0,0);assert.deepEqual(midi(),[]);
 c.run(0);assert.deepEqual(midi().at(-1),[190,37,0]);assert.ok(tasks.at(-1).cancelled&&tasks.at(-1).freed);
 out=[];now+=100;c.tick();snapshot();assert.deepEqual(midi(),[]);
 c.run(1);c.notifydeleted();assert.deepEqual(midi().at(-1),[190,37,0]);assert.equal(c.active,false);assert.ok(tasks.at(-1).freed);
});
test('routing selects the explicit common channel and rejects All Channels, DAW and DIN',()=>{
 c.routingtypes('LCXL3 1 (DAW In)','Other','LCXL3 1 (MIDI In)','LCXL3 1 (To DIN Out)');
 assert.equal(c.portOptions.length,1);c.routingchannels('All Channels','Ch. 15');c.routingtype(0);c.routingchannel(0);snapshot();assign(0,37);c.choose_port(1);c.run(1);assert.deepEqual(midi(),[]);
 assert.ok(out.some(x=>x[0]===2&&x[1]==='type'&&x[2]===2));c.routingtype(2);assert.ok(out.some(x=>x[0]===2&&x[1]==='channel'&&x[2]===1));
 assert.deepEqual(midi(),[]);c.routingchannel(1);assert.deepEqual(midi().at(-1),[190,37,127]);
 out=[];c.routingchannel(0);snapshot();c.tick();assert.deepEqual(midi(),[],'All Channels does not establish a safe output route');
 c.routingtype(3);c.tick();assert.deepEqual(midi(),[]);
});
test('manual test waits for asynchronous explicit channel confirmation before sending',()=>{
 c.routingtypes('<none>','LCXL3 1 (MIDI In)');c.routingchannels('All Channels','Ch. 15');c.routingtype(0);c.routingchannel(0);snapshot();assign(0,37);c.choose_port(1);c.test(0,1);assert.deepEqual(midi(),[]);
 c.routingtype(1);assert.deepEqual(midi(),[]);c.routingchannel(1);assert.deepEqual(midi(),[[190,37,127]]);
});
test('rejected routing callbacks are throttled and retried after reconnect without a feedback loop',()=>{
 c.routingtypes('<none>','LCXL3 1 (MIDI In)');c.routingchannels('All Channels','Ch. 15');c.routingtype(0);c.routingchannel(0);snapshot();assign(0,37);c.choose_port(1);c.run(1);
 out=[];for(let i=0;i<5;i++){c.routingtype(0);c.tick();}assert.ok(!out.some(x=>x[0]===2),'no immediate retry loop on rejected type');
 now+=1000;c.tick();assert.ok(out.some(x=>x[0]===2&&x[1]==='type'&&x[2]===1));
 c.routingtype(1);out=[];for(let i=0;i<5;i++){c.routingchannel(0);c.tick();}assert.ok(!out.some(x=>x[0]===2),'no immediate retry loop on rejected channel');
 now+=1000;snapshot();assert.ok(out.some(x=>x[0]===2&&x[1]==='channel'&&x[2]===1));c.routingchannel(1);assert.deepEqual(midi().at(-1),[190,37,127]);
});
test('output with only numbered channels reproduces the user failure and now sends test and sync',()=>{
 c.routingtypes('LCXL3 1 (MIDI In)');c.routingchannels(...Array.from({length:16},(_,i)=>String(i+1)));c.routingtype(0);c.routingchannel(0);
 snapshot([row('A'),row('B','PLAY',2)]);assign(0,37);assign(1,38);c.choose_port(1);c.test(0,1);
 assert.deepEqual(midi(),[]);assert.ok(out.some(x=>x[0]===2&&x[1]==='channel'&&x[2]===14),'selects channel 15 without requiring an All Channels item');
 c.routingchannel(14);assert.deepEqual(midi(),[[190,37,127]]);c.test(0,0);assert.deepEqual(midi().at(-1),[190,37,0]);
 c.run(1);assert.deepEqual(midi().slice(-2),[[190,37,127],[190,38,127]]);
});
test('mixed enabled channels are blocked clearly, and disabling the mismatched row resumes sync',()=>{
 route();snapshot([row('A'),row('B','PLAY',2)]);assign(0,37);assign(1,38,2);c.run(1);assert.deepEqual(midi(),[]);assert.match(c.routeStatus(),/different MIDI channels/);
 c.rowedit(1,'enabled',0);assert.deepEqual(midi().at(-1),[190,37,127]);
 c.run(0);c.test(1,1);assert.match(c.routeStatus(),/channel 2/);const n=midi().length;c.routingchannel(2);assert.deepEqual(midi().slice(n),[[177,38,127]],'manual tests select their row channel explicitly');
});
test('missing explicit channel is reported as blocked rather than waiting indefinitely',()=>{
 c.routingtypes('LCXL3 1 (MIDI In)');c.routingchannels('1','2');c.routingtype(0);c.routingchannel(0);snapshot();assign(0,37);c.choose_port(1);c.run(1);
 assert.match(c.routeStatus(),/BLOCKED.*channel 15/);assert.deepEqual(midi(),[]);
});
test('native setup graph edits and tests the visible row; parameter blob is bound and stored',()=>{
 const patch=JSON.parse(fs.readFileSync(path.join(root,'source/MultiLooperDashboard.maxpat'),'utf8')).patcher;
 const led=patch.boxes.find(x=>x.box.id==='ledwindow').box.patcher,boxes=Object.fromEntries(led.boxes.map(x=>[x.box.id,x.box]));
 const panel=boxes.setupwindow.patcher,panelBoxes=Object.fromEntries(panel.boxes.map(x=>[x.box.id,x.box]));
 assert.match(boxes.setupstate.text,/@parameter_enable 1 @thru 2/);assert.ok(!boxes.setupstate.text.includes('@bindto'));assert.ok(patch.parameters['ledwindow::setupstate']);assert.equal(boxes.setupstate.saved_attribute_attributes.valueof.parameter_type,3);assert.equal(boxes.setupstate.saved_attribute_attributes.valueof.parameter_invisible,1);
 function click(id,value){const e=panel.lines.find(x=>x.patchline.source[0]===id).patchline;assert.equal(e.source[1],0);const box=panelBoxes[e.destination[0]],args=box.text.replace(/^prepend /,'').split(' ');const command=args.shift();c[command](...args.map(x=>isNaN(Number(x))?x:Number(x)),...(box.maxclass==='newobj'?[value]:[]));}
 route();snapshot([row('A'),row('B','PLAY',2)]);click('row1_cc',41);click('row1_channel',16);click('row1_enabled',1);click('row1_teston');c.routingchannel(16);assert.deepEqual(midi().at(-1),[191,41,127]);
 click('setupRun',1);assert.equal(c.config.run,true);click('setupRun',0);assert.equal(c.config.run,false);
 for(const b of Object.values(panelBoxes))if(b.presentation){const [x,y,w,h]=b.presentation_rect;assert.ok(x>=0&&y>=0&&x+w<=1080&&y+h<=720);}
});
test('shared MIDI arbiter requires matching explicit channel and stops setup on legacy takeover',()=>{
 const hw=[],oldOut=[],old=vm.createContext({Task:c.Task,Date:c.Date,arrayfromargs:v=>Array.from(v),outlet(...v){oldOut.push(v);if(v[0]===0)hw.push(JSON.parse(JSON.stringify(v[1])));if(v[0]===6)c.suspend();}});
 vm.runInContext(fs.readFileSync(path.join(root,'mld2_led.js'),'utf8'),old);
 c.outlet=(...v)=>{out.push(JSON.parse(JSON.stringify(v)));if(v[0]===0)old.setup_midi(...v[1]);if(v[0]===3)old.setup_claim(v[1]);};
 old.routingtype('LCXL3 1 (MIDI In)');old.routingchannel('15');
 route();snapshot([row('A'),row('B','PLAY',2)]);assign(0,37);assign(1,38);c.run(1);
 assert.deepEqual(hw,[[190,37,127],[190,38,127]]);assert.equal(old.armed,false);assert.ok(oldOut.some(v=>v[0]===7&&v[1]==='set'&&v[2]===0));
 old.arm(1);assert.equal(c.config.run,false);assert.equal(c.active,false);assert.equal(old.setupOwned,false);assert.deepEqual(hw.slice(-2),[[190,37,0],[190,38,0]]);
 const count=hw.length;old.setup_midi(190,37,127);assert.equal(hw.length,count,'released setup owner cannot transmit');
 old.arm(0);old.setup_claim(1);old.routingchannel('1');old.setup_midi(190,37,127);assert.equal(hw.length,count,'mismatched explicit channel blocked');
 old.routingchannel('All Channels');old.routingtype('LCXL3 1 (DAW In)');old.setup_midi(190,37,127);assert.equal(hw.length,count,'DAW output blocked');
 old.routingtype('LCXL3 1 (MIDI In)');old.routingchannel('15');for(const p of [[175,37,1],[192,37,1],[190,128,1],[190,37,-1],[190,37,1.5]])old.setup_midi(...p);assert.equal(hw.length,count,'only valid CC bytes pass');
 old.routingchannel('All Channels');old.setup_midi(191,127,127);assert.equal(hw.length,count,'All Channels remains blocked');old.routingchannel('Channel 16');old.setup_midi(191,127,127);assert.deepEqual(hw.at(-1),[191,127,127]);
});

function inputroute(){c.inputtypes('<none>','LCXL3 1 (MIDI Out)','LCXL3 1 (DAW Out)');c.inputchannels(...Array.from({length:16},(_,i)=>String(i+1)));c.inputtype(1);c.inputchannel(14);c.choose_input(1);}
function cc(number,value,channel=15){for(const v of [175+channel,number,value])c.midi_byte(v);}
function clearRequests(){return out.filter(x=>x[0]===6&&x[1]==='request').map(x=>JSON.parse(x[2])).filter(q=>q.action!=='stop');}
function stopSetup(){route();snapshot([row('Looper A','STOP')]);assign(0,37);c.stopedit(0,'enabled',1);c.stopedit(0,'clear',1);inputroute();c.run(1);cc(45,0);out=[];}
function stopped(){snapshot([row('Looper A','STOP')]);}
function waitHold(ms){while(ms>0){const step=Math.min(ms,250);now+=step;stopped();ms-=step;}}
test('Stop LED distinguishes empty, recorded and unknown buffers without changing the Play LED',()=>{
 route();snapshot([row('Looper A','STOP')]);assign(0,37);c.stopedit(0,'enabled',1);c.run(1);
 assert.ok(midi().some(p=>p[1]===45&&p[2]===0));
 snapshot([{...row('Looper A','STOP'),loop_length:0}]);assert.deepEqual(midi().filter(p=>p[1]===45).at(-1),[190,45,127]);
 assert.equal(c.bufferState({...row('Looper A','RECORD'),loop_length:0}),'recording');
 now+=100;snapshot([{...row('Looper A','PLAY'),loop_length:null}]);assert.ok(midi().some(p=>p[1]===45&&p[2]===0));assert.match(c.stopStatus('Looper A'),/UNKNOWN/);
 c.run(0);out=[];c.test(0,1,'stop');assert.deepEqual(midi(),[[190,45,127]]);assert.deepEqual(clearRequests(),[]);
});
test('momentary Stop hold fires once at 1500 ms while down; short tap never clears',()=>{
 stopSetup();cc(45,127);waitHold(1000);cc(45,0);waitHold(1000);assert.deepEqual(clearRequests(),[]);
 cc(45,127);waitHold(1499);assert.deepEqual(clearRequests(),[]);waitHold(1);assert.equal(clearRequests().length,1);
 assert.equal(clearRequests()[0].id,1);assert.equal(clearRequests()[0].track,'Looper A');
 cc(45,127);waitHold(2000);assert.equal(clearRequests().length,1,'repeated On and continued hold cannot retrigger');
 cc(45,0);cc(45,127);waitHold(1500);assert.equal(clearRequests().length,2);
 assert.equal(out.filter(x=>x[0]===5&&x[1]==='authorize'&&JSON.parse(x[2]).action==='clear').length,2);
});
test('Clear requires release priming, matching input/CC, unique target and STOP at threshold',()=>{
 stopSetup();c.cancelHolds();cc(45,127);waitHold(1500);assert.deepEqual(clearRequests(),[],'reconnect/arming must see release before a new hold');
 cc(45,0);cc(44,127);cc(45,127,2);waitHold(1500);assert.deepEqual(clearRequests(),[]);
 cc(45,127);now+=1500;snapshot([row('Looper A','PLAY')]);assert.deepEqual(clearRequests(),[]);stopped();assert.deepEqual(clearRequests(),[],'no delayed clear if quantized Stop arrives after the threshold');
 cc(45,0);cc(45,127);waitHold(1500);assert.equal(clearRequests().length,1);
});
test('hold is cancelled by route loss, stale data, topology change, config edit, SYNC off and legacy takeover',()=>{
 for(const cancel of [()=>c.inputtype(0),()=>{now+=600;c.tick();},()=>snapshot([{...row('Looper A','STOP'),generation:2}]),()=>c.stopedit(0,'cc',46),()=>c.run(0),()=>c.suspend()]){
  setup();stopSetup();cc(45,127);now+=500;stopped();cancel();now+=1600;c.tick();assert.deepEqual(clearRequests(),[]);
 }
});
test('raw MIDI parsing handles running status and realtime, ignores notes/SysEx and normalized channel 1',()=>{
 stopSetup();for(const v of [240,190,45,127,247,144,45,127,128,45,0])c.midi_byte(v);waitHold(1500);assert.deepEqual(clearRequests(),[]);
 cc(45,0,1);for(const v of [176,45,248,127])c.midi_byte(v);waitHold(1500);assert.equal(clearRequests().length,1);
 for(const v of [45,0,45,127])c.midi_byte(v);waitHold(1500);assert.equal(clearRequests().length,2,'running-status messages decode correctly');
});
test('Stop address conflicts with any enabled Play or Stop address are blocked',()=>{
 route();snapshot([row('Looper A','STOP'),row('Looper B','STOP',2)]);assign(0,37);assign(1,45);c.stopedit(0,'enabled',1);c.stopedit(0,'clear',1);inputroute();c.run(1);
 assert.match(c.stopStatus('Looper A'),/CONFLICT/);cc(45,0);cc(45,127);waitHold(1500);assert.deepEqual(clearRequests(),[]);
});
test('v1 saved settings migrate without arming Clear; v2 persists input, hold and Stop mapping',()=>{
 c.setvalueof('mldled1:'+encodeURIComponent(JSON.stringify({version:1,port:'LCXL3 1 (MIDI In)',run:false,assignments:[{track:'Looper A',channel:15,cc:37,on:127,off:0,enabled:true}]})));
 assert.equal(c.config.version,3);assert.equal(c.config.assignments[0].stop.cc,45);assert.equal(c.config.assignments[0].stop.clear,false);assert.equal(c.config.assignments[0].stop.enabled,false);assert.equal(c.config.holdMs,1500);
 snapshot([row('Looper A')]);c.stopedit(0,'enabled',1);c.stopedit(0,'clear',1);c.stopedit(0,'cc',50);c.holdseconds(2);inputroute();const blob=c.getvalueof();setup();c.setvalueof(blob);
 assert.equal(c.config.input,'LCXL3 1 (MIDI Out)');assert.equal(c.config.holdMs,2000);assert.equal(c.config.assignments[0].stop.cc,50);assert.equal(c.config.assignments[0].stop.clear,true);assert.equal(Object.keys(c.held).length,0);
});
test('input diagnostics count raw delivery before routing/channel gates without permitting actions',()=>{
 for(const v of [190,45,127,190,45,0])c.midi_byte(v);
 assert.equal(c.inputBytes,6);assert.equal(c.rawCCCount,2);assert.equal(c.inputCount,0);assert.match(c.lastRawCC,/ch15 CC45=0/);assert.deepEqual(clearRequests(),[]);
 stopSetup();const before=c.rawCCCount,accepted=c.inputCount;cc(45,127,2);
 assert.equal(c.rawCCCount,before+1);assert.equal(c.inputCount,accepted);assert.match(c.lastRawCC,/ch2 CC45=127/);assert.deepEqual(clearRequests(),[]);
});
test('Stop is requested once per press, including first press, with Hold off and without clearing',()=>{
 stopSetup();c.stopedit(0,'clear',0);out=[];cc(45,127);cc(45,127);now+=100;stopped();
 const stops=()=>out.filter(x=>x[0]===6&&x[1]==='request').map(x=>JSON.parse(x[2])).filter(q=>q.action==='stop');
 assert.equal(stops().length,1);assert.equal(stops()[0].id,1);assert.equal(stops()[0].track,'Looper A');assert.deepEqual(clearRequests(),[]);
 cc(45,0);cc(45,127);assert.equal(stops().length,2);waitHold(2000);assert.deepEqual(clearRequests(),[]);
 c.clear_result(JSON.stringify({token:stops()[1].token,ok:true,message:'Stop sent: Looper A'}));assert.equal(c.gestureResult,'Stop sent: Looper A');
});
test('LED feedback alone never requests Stop or Clear, including repeated Looper A playback',()=>{
 stopSetup();out=[];
 for(const state of ['RECORD','PLAY','OVERDUB','PLAY','STOP','PLAY']){now+=100;snapshot([row('Looper A',state)]);c.tick();}
 assert.ok(midi().some(p=>p[1]===37));assert.ok(midi().some(p=>p[1]===45));assert.equal(out.filter(x=>x[0]===6).length,0);
});
test('A feedback migration changes only proven CC37 case; B/C and Stop input values remain intact',()=>{
 const assignments=['Looper A','Looper B','Looper C'].map((track,i)=>({track,channel:15,cc:37+i,on:127,off:0,enabled:true,stop:{cc:45+i,on:127,off:0,enabled:true,clear:true}}));
 c.setvalueof('mldled1:'+encodeURIComponent(JSON.stringify({version:2,port:'LCXL3 1 (MIDI In)',input:'LCXL3 1 (MIDI Out)',holdMs:1500,run:false,assignments})));
 const a=saved().assignments;assert.deepEqual(a.map(x=>[x.on,x.off]),[[126,1],[127,0],[127,0]]);assert.ok(a.every(x=>x.stop.inputOn===127&&x.stop.inputOff===0));
 assert.deepEqual([c.defaults('Looper A').on,c.defaults('Looper A').off],[126,1]);assert.deepEqual([c.defaults('Looper B').on,c.defaults('Looper B').off],[127,0]);
 const blob=c.getvalueof();setup();c.setvalueof(blob);assert.equal(c.config.version,3);assert.equal(c.config.assignments[0].on,126);
});
test('Stop input edges remain physical 127/0 when LED feedback is 126/1',()=>{
 stopSetup();c.stopedit(0,'on',126);c.stopedit(0,'off',1);cc(45,0);out=[];
 cc(45,127);waitHold(1500);assert.equal(clearRequests().length,1);
 assert.ok(midi().filter(p=>p[1]===45).every(p=>[1,126].includes(p[2])));assert.equal(c.config.assignments[0].stop.inputOn,127);assert.equal(c.config.assignments[0].stop.inputOff,0);
});
console.log(passed+' multi-Looper LED setup / Stop-hold tests passed; native input and Clear still need verification.');
