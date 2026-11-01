const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../mld2_led.js'),'utf8');
let c,out,now,tasks;
function setup(){out=[];now=10000;tasks=[];class Task{constructor(fn){this.fn=fn;tasks.push(this);}repeat(){}cancel(){this.cancelled=true;}freepeer(){this.freed=true;}}
 class Clock extends Date{static now(){return now;}}
 c=vm.createContext({Task,Date:Clock,outlet(...v){out.push(JSON.parse(JSON.stringify(v)));},arrayfromargs:v=>Array.from(v)});vm.runInContext(source,c);}
function midi(){return out.filter(x=>x[0]===0).map(x=>x[1]);}
function route(name='LCXL3 1 (DAW In)',channel='1'){c.routingtype(name);c.routingchannel(channel);}
function snapshot(state='PLAY',extra={}){c.snapshot(JSON.stringify({rows:[{track:'Looper A',available:true,active:1,state,...extra}]}));}
let passed=0;function test(name,fn){setup();fn();passed++;console.log('PASS '+name);}
test('startup, disabled module and rejected ports emit no MIDI',()=>{
 snapshot();c.testcolour('RED');assert.deepEqual(midi(),[]);
 for(const port of ['LCXL3 1 (MIDI In)','LCXL3 1 (To DIN Out)','LCXL3 1 (To DIN Out 2)','Launchpad X','LCXL3 2 (DAW In)','Computer Keyboard']){
  route(port);c.arm(1);c.follow(1);snapshot('RECORD');c.check();assert.deepEqual(midi(),[]);c.arm(0);
 }
});
test('DAW alias and channel 1 are required; route selection invalidates previous destination',()=>{
 route('Launch_Control_XL_3 Output (LCXL3 1)');c.arm(1);c.testcolour('GREEN');assert.deepEqual(midi().at(-1),[176,37,21]);
 out=[];route('LCXL3 1 (DAW In)','15');c.testcolour('RED');assert.deepEqual(midi(),[]);
 c.routingchannel('Ch. 1');c.testcolour('RED');assert.deepEqual(midi().at(-1),[176,37,5]);
 out=[];c.choose_type(2);c.testcolour('GREEN');assert.deepEqual(midi(),[]);assert.ok(out.some(x=>x[0]===4&&x[1]==='type'&&x[2]===2));
 c.routingtype('LCXL3 1 (DAW In)');c.testcolour('GREEN');assert.deepEqual(midi(),[]);c.routingchannel('1');c.testcolour('GREEN');assert.equal(midi().length,1);
 out=[];c.choose_channel(0);c.testcolour('RED');assert.deepEqual(midi(),[]);
});
test('manual palette tests affect one LED only and cannot compete with follow mode',()=>{
 route();c.arm(1);for(const [colour,index] of [['WHITE',1],['GREEN',21],['RED',5],['ORANGE',9]]){c.testcolour(colour);assert.deepEqual(midi().at(-1),[176,37,index]);}
 const count=midi().length;c.testcolour('INVALID');assert.equal(midi().length,count);
 snapshot();c.follow(1);const n=midi().length;c.testcolour('RED');assert.equal(midi().length,n);
});
test('follow decodes dashboard labels, refreshes after button release and preserves input mapping',()=>{
 route();c.arm(1);c.follow(1);out=[];
 for(const [state,index] of [['STOP',1],['PLAY',21],['RECORD',5],['OVERDUB',9]]){snapshot(state);assert.deepEqual(midi().at(-1),[176,37,index]);}
 let count=midi().length;now+=100;snapshot('OVERDUB');assert.equal(midi().length,count);now+=500;snapshot('OVERDUB');assert.equal(midi().length,count+1);
 assert.ok(midi().every(m=>m.length===3&&m[0]===176&&m[1]===37&&[0,1,5,9,21].includes(m[2])),'no custom channel 15, SysEx, mode, transport or other LED messages');
});
test('missing, duplicate, unknown, inactive and unavailable target turn LED off',()=>{
 route();c.arm(1);c.follow(1);snapshot();
 for(const extra of [{track:'Different'},{available:false},{active:0},{state:'API: Mystery'}]){snapshot('PLAY',extra);assert.deepEqual(midi().at(-1),[176,37,0]);snapshot();}
 const row={track:'Looper A',state:'PLAY',available:true,active:1};c.snapshot(JSON.stringify({rows:[row,row]}));assert.deepEqual(midi().at(-1),[176,37,0]);
 c.snapshot(JSON.stringify({rows:[{...row,track:'Other'},row]}));assert.deepEqual(midi().at(-1),[176,37,21]);
 c.snapshot('invalid JSON');assert.deepEqual(midi().at(-1),[176,37,0]);
});
test('stale data, disable and deletion clear only the addressed LED and free the timer',()=>{
 route();c.arm(1);c.follow(1);snapshot();now+=1600;c.check();assert.deepEqual(midi().at(-1),[176,37,0]);
 snapshot();const task=tasks.at(-1);c.arm(0);assert.deepEqual(midi().at(-1),[176,37,0]);assert.ok(task.cancelled&&task.freed);
 out=[];snapshot('RECORD');c.check();c.testcolour('RED');assert.deepEqual(midi(),[]);
 c.arm(1);snapshot();c.notifydeleted();assert.deepEqual(midi().at(-1),[176,37,0]);assert.ok(tasks.at(-1).cancelled&&tasks.at(-1).freed);
});
test('routing lists populate selectors without sending MIDI or selecting a destination',()=>{
 c.routingtypes('<none>','LCXL3 1 (DAW In)');c.routingchannels('1','2');
 assert.ok(out.some(x=>x[0]===2&&x[1]==='append'&&x[2]==='LCXL3 1 (DAW In)'));assert.ok(!out.some(x=>x[0]===4));assert.deepEqual(midi(),[]);
});
test('native routing indices resolve through their lists rather than being mistaken for names',()=>{
 c.routingtypes('<none>','LCXL3 1 (MIDI In)','LCXL3 1 (DAW In)');c.routingchannels('All Channels','Ch. 1','Ch. 2');
 c.routingtype(2);c.routingchannel(1);assert.equal(c.portName,'LCXL3 1 (DAW In)');assert.equal(c.channelName,'Ch. 1');
 c.arm(1);c.testcolour('RED');assert.deepEqual(midi().at(-1),[176,37,5]);
 out=[];c.routingtype(1);c.testcolour('RED');assert.deepEqual(midi(),[],'index 1 is the MIDI port, not DAW');
 c.routingtype(2);c.routingchannel(0);c.testcolour('RED');assert.deepEqual(midi(),[],'index 0 is All Channels, not channel 1');
 c.routingchannel(2);c.testcolour('RED');assert.deepEqual(midi(),[]);c.routingchannel(1);c.testcolour('GREEN');assert.deepEqual(midi().at(-1),[176,37,21]);
});
test('routing selection may arrive before its list and resolves only once metadata is available',()=>{
 c.arm(1);c.routingtype(2);c.routingchannel(0);c.testcolour('GREEN');assert.deepEqual(midi(),[]);
 c.routingtypes('<none>','LCXL3 1 (MIDI In)','LCXL3 1 (DAW In)');c.testcolour('GREEN');assert.deepEqual(midi(),[]);
 c.routingchannels('1','2');c.testcolour('GREEN');assert.deepEqual(midi().at(-1),[176,37,21]);
 assert.ok(out.some(x=>x[0]===2&&x[1]==='set'&&x[2]===2));assert.ok(out.some(x=>x[0]===3&&x[1]==='set'&&x[2]===0));
 out=[];c.routingtype(99);c.testcolour('RED');assert.deepEqual(midi(),[]);c.routingtype(-1);c.testcolour('RED');assert.deepEqual(midi(),[]);
});
test('built patch connects numeric textbutton output to arm/follow and updates status',()=>{
 const root=JSON.parse(fs.readFileSync(path.join(__dirname,'../source/MultiLooperDashboard.maxpat'),'utf8')).patcher;
 const panel=root.boxes.find(x=>x.box.id==='ledwindow').box.patcher;
 const boxes=Object.fromEntries(panel.boxes.map(x=>[x.box.id,x.box]));
 function clickToggle(id,value){
  const button=boxes[id];assert.equal(button.mode,1);
  // Native textbutton: numeric 0/1 on outlet 0; label on outlet 1.
  for(const l of panel.lines){const e=l.patchline;if(e.source[0]!==id)continue;
   const msg=boxes[e.destination[0]].text,command=msg.replace('prepend ','');
   c[command](e.source[1]===0?value:(value?button.texton:button.text));
  }
 }
 route();out=[];clickToggle('ledarm',1);assert.equal(c.armed,true);assert.ok(out.some(x=>x[0]===1&&x[2].startsWith('ARMED:')));
 snapshot();clickToggle('ledfollow',1);assert.equal(c.following,true);assert.deepEqual(midi().at(-1),[176,37,21]);
 clickToggle('ledarm',0);assert.equal(c.armed,false);assert.deepEqual(midi().at(-1),[176,37,0]);
});
test('RGB SysEx on DAW output encodes only the documented single LED command',()=>{
 route();c.protocol(1);assert.deepEqual(midi(),[],'choosing RGB does not send');c.arm(1);
 for(const [name,rgb] of [['WHITE',[32,32,32]],['GREEN',[0,127,0]],['RED',[127,0,0]],['ORANGE',[127,40,0]]]){
  c.testcolour(name);assert.deepEqual(midi().at(-1),[240,0,32,41,2,21,1,83,37,...rgb,247]);
 }
 c.arm(0);assert.deepEqual(midi().at(-1),[240,0,32,41,2,21,1,83,37,0,0,0,247]);
 assert.ok(midi().every(p=>p.length===13&&p[0]===240&&p.at(-1)===247&&p.slice(1,-1).every(v=>Number.isInteger(v)&&v>=0&&v<=127)));
});
test('MIDI In permits manual RGB only, never palette CC, follow or repeated snapshot output',()=>{
 route('LCXL3 1 (MIDI In)');c.arm(1);c.testcolour('RED');assert.deepEqual(midi(),[]);
 c.arm(0);c.protocol(1);c.arm(1);c.testcolour('RED');assert.equal(midi().length,1);assert.equal(midi()[0][0],240);
 c.follow(1);const n=midi().length;for(let i=0;i<5;i++){now+=600;snapshot('RECORD');c.check();}assert.equal(midi().length,n);
 c.testcolour('GREEN');assert.equal(midi().length,n,'manual RGB blocked while FOLLOW is on');
 c.follow(0);c.testcolour('GREEN');assert.equal(midi().length,n+1);c.notifydeleted();assert.equal(midi().at(-1)[0],240);
 c.protocol(0);c.arm(1);c.testcolour('GREEN');assert.equal(midi().at(-1)[0],240,'switching back to palette cannot send CC on MIDI In');
});
test('RGB transport rejects other devices, channel 15, invalid protocols and changes while armed',()=>{
 c.protocol(1);
 for(const port of ['LCXL3 1 (To DIN Out)','LCXL3 2 (MIDI In)','Unrelated device']){route(port);c.arm(1);c.testcolour('RED');assert.deepEqual(midi(),[]);c.arm(0);}
 route('LCXL3 1 (MIDI In)','15');c.arm(1);c.testcolour('RED');assert.deepEqual(midi(),[]);c.arm(0);
 c.protocol(7);assert.equal(c.ledProtocol,1);route();c.arm(1);c.protocol(0);assert.equal(c.ledProtocol,1);assert.ok(out.some(x=>x[0]===5&&x[1]==='set'&&x[2]===1));
 c.testcolour('RED');assert.equal(midi().at(-1)[0],240);c.arm(0);c.protocol(0);assert.equal(c.ledProtocol,0);
});
console.log(passed+' LED isolation/protocol tests passed; Custom Mode 2 hardware behavior remains unverified.');
