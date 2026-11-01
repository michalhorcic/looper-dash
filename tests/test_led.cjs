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
console.log(passed+' LED isolation/protocol tests passed; Custom Mode 2 hardware behavior remains unverified.');
