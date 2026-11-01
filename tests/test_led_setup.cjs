const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'mld2_led_setup.js'),'utf8');
let c,out,now,tasks,notifications;
function setup(){out=[];now=10000;tasks=[];notifications=0;
 class Task{constructor(fn){this.fn=fn;tasks.push(this);}repeat(){}cancel(){this.cancelled=true;}freepeer(){this.freed=true;}}
 class Clock extends Date{static now(){return now;}}
 c=vm.createContext({Task,Date:Clock,outlet(...v){out.push(JSON.parse(JSON.stringify(v)));},notifyclients(){notifications++;},arrayfromargs:v=>Array.from(v)});vm.runInContext(source,c);
}
function midi(){return out.filter(x=>x[0]===0).map(x=>x[1]);}
function row(track,state='PLAY',id=1){return {id,track,name:'Looper',available:true,active:1,state};}
function snapshot(rows=[row('Looper A')]){c.snapshot(JSON.stringify({rows}));}
function route(){c.routingtypes('<none>','LCXL3 1 (DAW In)','LCXL3 1 (MIDI In)','LCXL3 1 (To DIN Out)');c.routingchannels('All Channels',...Array.from({length:16},(_,i)=>'Ch. '+(i+1)));c.routingtype(2);c.routingchannel(0);c.choose_port(1);}
function assign(slot,cc,channel=15){c.rowedit(slot,'channel',channel);c.rowedit(slot,'cc',cc);c.rowedit(slot,'enabled',1);}
function saved(){return JSON.parse(decodeURIComponent(c.getvalueof().slice(8)));}
function restore(config){c.setvalueof('mldled1:'+encodeURIComponent(JSON.stringify(config)));}
let passed=0;function test(name,fn){setup();fn();passed++;console.log('PASS '+name);}
test('new discoveries remain disabled/unassigned; routing is manual and no automatic MIDI is emitted',()=>{
 snapshot([row('A'),row('B')]);assert.equal(c.items.length,2);assert.match(c.rowStatus('A'),/UNASSIGNED/);assert.deepEqual(saved().assignments,[]);assert.deepEqual(midi(),[]);
 c.run(1);now+=100;c.tick();assert.deepEqual(midi(),[]);assert.equal(saved().port,'');
 assert.ok(!out.some(x=>x[0]===2),'no auto destination without a saved/user selection');
});
test('all detected tracks paginate; missing assignments survive and CLEAR removes only their settings',()=>{
 snapshot(Array.from({length:11},(_,i)=>row('Track '+i,'PLAY',i+1)));assert.equal(c.items.length,11);
 c.turnpage(1);assign(2,47);assert.equal(saved().assignments[0].track,'Track 10');
 c.turnpage(20);assert.equal(c.page,1);c.turnpage(-20);assert.equal(c.page,0);
 snapshot([row('Track 0')]);assert.equal(c.items.length,2);assert.match(c.rowStatus('Track 10'),/MISSING/);
 c.forget(1);assert.equal(c.items.length,1);assert.equal(saved().assignments.length,0);
 assign(0,37);c.forget(0);assert.equal(c.items.length,1);assert.match(c.rowStatus('Track 0'),/UNASSIGNED/);
});
test('multiple Loopers follow independently on different CCs and channels with configured colours',()=>{
 route();snapshot([row('A','PLAY'),row('B','STOP',2),row('C','RECORD',3),row('D','OVERDUB',4)]);
 assign(0,37,15);assign(1,38,1);assign(2,39,16);assign(3,40,2);c.rowedit(1,'off',5);c.rowedit(2,'on',90);out=[];c.run(1);
 assert.deepEqual(midi(),[[190,37,127],[176,38,5],[191,39,90],[177,40,127]]);
 assert.equal(tasks.at(-1).interval,25);out=[];now+=100;tasks.at(-1).fn();assert.equal(midi().length,4,'steady state refreshes at 100ms');
 now+=25;snapshot([row('A','PLAY'),row('B','STOP',2),row('C','RECORD',3),row('D','OVERDUB',4)]);assert.deepEqual(midi().at(-1),[177,40,0]);
 now+=375;snapshot([row('A','PLAY'),row('B','STOP',2),row('C','RECORD',3),row('D','OVERDUB',4)]);assert.ok(midi().some(p=>p[0]===191&&p[1]===39&&p[2]===0));
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
 snapshot([row('A "quoted", č; /','OVERDUB',999)]);route();assert.deepEqual(midi().at(-1),[191,127,80]);
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
test('routing filters ports, requests All Channels and never emits on DAW, DIN or a forced channel',()=>{
 c.routingtypes('LCXL3 1 (DAW In)','Other','LCXL3 1 (MIDI In)','LCXL3 1 (To DIN Out)');
 assert.equal(c.portOptions.length,1);c.routingchannels('All Channels','Ch. 15');c.routingtype(0);c.routingchannel(1);snapshot();assign(0,37);c.choose_port(1);c.run(1);assert.deepEqual(midi(),[]);
 assert.ok(out.some(x=>x[0]===2&&x[1]==='type'&&x[2]===2));c.routingtype(2);assert.ok(out.some(x=>x[0]===2&&x[1]==='channel'&&x[2]===0));
 assert.deepEqual(midi(),[]);c.routingchannel(0);assert.deepEqual(midi().at(-1),[190,37,127]);
 out=[];c.routingchannel(1);snapshot();c.tick();assert.deepEqual(midi(),[]);
 c.routingtype(3);c.tick();assert.deepEqual(midi(),[]);
});
test('manual test waits for asynchronous routing instead of sending to an unconfirmed bus',()=>{
 c.routingtypes('<none>','LCXL3 1 (MIDI In)');c.routingchannels('All Channels','Ch. 15');c.routingtype(0);c.routingchannel(1);snapshot();assign(0,37);c.choose_port(1);c.test(0,1);assert.deepEqual(midi(),[]);
 c.routingtype(1);assert.deepEqual(midi(),[]);c.routingchannel(0);assert.deepEqual(midi(),[[190,37,127]]);
});
test('rejected routing callbacks are throttled and retried after reconnect without a feedback loop',()=>{
 c.routingtypes('<none>','LCXL3 1 (MIDI In)');c.routingchannels('All Channels','Ch. 15');c.routingtype(0);c.routingchannel(1);snapshot();assign(0,37);c.choose_port(1);c.run(1);
 out=[];for(let i=0;i<5;i++){c.routingtype(0);c.tick();}assert.ok(!out.some(x=>x[0]===2),'no immediate retry loop on rejected type');
 now+=1000;c.tick();assert.ok(out.some(x=>x[0]===2&&x[1]==='type'&&x[2]===1));
 c.routingtype(1);out=[];for(let i=0;i<5;i++){c.routingchannel(1);c.tick();}assert.ok(!out.some(x=>x[0]===2),'no immediate retry loop on rejected channel');
 now+=1000;snapshot();assert.ok(out.some(x=>x[0]===2&&x[1]==='channel'&&x[2]===0));c.routingchannel(0);assert.deepEqual(midi().at(-1),[190,37,127]);
});
test('native setup graph edits and tests the visible row; parameter blob is bound and stored',()=>{
 const patch=JSON.parse(fs.readFileSync(path.join(root,'source/MultiLooperDashboard.maxpat'),'utf8')).patcher;
 const led=patch.boxes.find(x=>x.box.id==='ledwindow').box.patcher,boxes=Object.fromEntries(led.boxes.map(x=>[x.box.id,x.box]));
 const panel=boxes.setupwindow.patcher,panelBoxes=Object.fromEntries(panel.boxes.map(x=>[x.box.id,x.box]));
 assert.match(boxes.setupstate.text,/@bindto ledSetupEngine @parameter_enable 1/);assert.equal(boxes.setupstate.saved_attribute_attributes.valueof.parameter_type,3);assert.equal(boxes.setupstate.saved_attribute_attributes.valueof.parameter_invisible,1);
 function click(id,value){const e=panel.lines.find(x=>x.patchline.source[0]===id).patchline;assert.equal(e.source[1],0);const box=panelBoxes[e.destination[0]],args=box.text.replace(/^prepend /,'').split(' ');const command=args.shift();c[command](...args.map(x=>isNaN(Number(x))?x:Number(x)),...(box.maxclass==='newobj'?[value]:[]));}
 route();snapshot([row('A'),row('B','PLAY',2)]);click('row1_cc',41);click('row1_channel',16);click('row1_enabled',1);click('row1_teston');assert.deepEqual(midi().at(-1),[191,41,127]);
 click('setupRun',1);assert.equal(c.config.run,true);click('setupRun',0);assert.equal(c.config.run,false);
 for(const b of Object.values(panelBoxes))if(b.presentation){const [x,y,w,h]=b.presentation_rect;assert.ok(x>=0&&y>=0&&x+w<=1080&&y+h<=640);}
});
test('shared MIDI arbiter forwards configured CC only on All Channels and stops setup on legacy takeover',()=>{
 const hw=[],oldOut=[],old=vm.createContext({Task:c.Task,Date:c.Date,arrayfromargs:v=>Array.from(v),outlet(...v){oldOut.push(v);if(v[0]===0)hw.push(JSON.parse(JSON.stringify(v[1])));if(v[0]===6)c.suspend();}});
 vm.runInContext(fs.readFileSync(path.join(root,'mld2_led.js'),'utf8'),old);
 c.outlet=(...v)=>{out.push(JSON.parse(JSON.stringify(v)));if(v[0]===0)old.setup_midi(...v[1]);if(v[0]===3)old.setup_claim(v[1]);};
 old.routingtype('LCXL3 1 (MIDI In)');old.routingchannel('All Channels');
 route();snapshot([row('A'),row('B','PLAY',2)]);assign(0,37);assign(1,38,2);c.run(1);
 assert.deepEqual(hw,[[190,37,127],[177,38,127]]);assert.equal(old.armed,false);assert.ok(oldOut.some(v=>v[0]===7&&v[1]==='set'&&v[2]===0));
 old.arm(1);assert.equal(c.config.run,false);assert.equal(c.active,false);assert.equal(old.setupOwned,false);assert.deepEqual(hw.slice(-2),[[190,37,0],[177,38,0]]);
 const count=hw.length;old.setup_midi(190,37,127);assert.equal(hw.length,count,'released setup owner cannot transmit');
 old.arm(0);old.setup_claim(1);old.routingchannel('15');old.setup_midi(190,37,127);assert.equal(hw.length,count,'forced channel blocked');
 old.routingchannel('All Channels');old.routingtype('LCXL3 1 (DAW In)');old.setup_midi(190,37,127);assert.equal(hw.length,count,'DAW output blocked');
 old.routingtype('LCXL3 1 (MIDI In)');for(const p of [[175,37,1],[192,37,1],[190,128,1],[190,37,-1],[190,37,1.5]])old.setup_midi(...p);assert.equal(hw.length,count,'only valid CC bytes pass');
 old.setup_midi(191,127,127);assert.deepEqual(hw.at(-1),[191,127,127]);
});
console.log(passed+' multi-Looper LED setup tests passed; native Live persistence/routing still needs verification.');
