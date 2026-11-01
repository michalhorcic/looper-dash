const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../mld2_actions.js'),'utf8');
let c,now,out,calls,native,latest;
function row(){return {id:12,generation:3,track:'Looper A',available:true,active:1,state:'STOP',clear_available:true,stop_available:true};}
function setup(){now=10000;out=[];calls=[];native={id:12,className:'Looper',active:1,canClear:true,canStop:true,state:'Stopped',states:1,throwClear:false};latest={rows:[row()]};
 class Clock extends Date{static now(){return now;}}
 class API{constructor(cb,p){const pid=Number(p.slice(3));this.parameter=pid>=1000;this.index=this.parameter?pid-1000:null;this.id=this.parameter?pid:native.id;}
  get info(){return 'property is_active bool'+(native.canClear?'\nfunction clear':'')+(native.canStop?'\nfunction stop':'');}
  get(p){if(this.parameter){if(p==='name'||p==='original_name')return [this.index<native.states?'State':'Feedback'];if(p==='value')return [0];}else{if(p==='parameters')return ['id',1000,'id',1001];if(p==='class_name')return [native.className];if(p==='is_active')return [native.active];}throw Error('unexpected get '+p);}
  getcount(p){assert.equal(p,'parameters');return 2;}
  call(name,...args){calls.push({name,args});if(name==='str_for_value')return [native.state];assert.ok(['clear','stop'].includes(name),'only authorized Stop/Clear writes');if(native.throwClear&&name==='clear')throw Error('native failure');return [];}
  set(){throw Error('parameter writes forbidden');}
 }
 c=vm.createContext({LiveAPI:API,Date:Clock,outlet(...v){out.push(JSON.parse(JSON.stringify(v)));},arrayfromargs:v=>Array.from(v)});vm.runInContext(source,c);c.snapshot(JSON.stringify(latest));
}
function request(patch={},authorize=true){const q={token:'hold-1',id:12,generation:3,track:'Looper A',at:now,...patch},s=JSON.stringify(q);if(authorize)c.authorize(s);c.request(s);return q;}
function writes(){return calls.filter(x=>x.name==='clear');}
let passed=0;function test(name,fn){setup();fn();passed++;console.log('PASS '+name);}
test('one authorized current stopped Looper clear; no other writes and duplicate tokens cannot repeat',()=>{
 const q=request();assert.equal(writes().length,1);assert.equal(out.at(-1)[1],'clear_result');assert.equal(JSON.parse(out.at(-1)[2]).ok,true);
 c.authorize(JSON.stringify(q));c.request(JSON.stringify(q));assert.equal(writes().length,1);
 assert.ok(calls.every(x=>['str_for_value','clear'].includes(x.name)));
});
test('cancelled, missing or modified permit blocks a deferred clear',()=>{
 request({},false);assert.equal(writes().length,0);
 const q={token:'hold-2',id:12,generation:3,track:'Looper A',at:now};c.authorize(JSON.stringify(q));c.cancel();c.request(JSON.stringify(q));assert.equal(writes().length,0);
 c.authorize(JSON.stringify({...q,token:'hold-3'}));c.request(JSON.stringify({...q,token:'hold-3',id:13}));assert.equal(writes().length,0);
});
test('stale dashboard, expired or future request is rejected before Live access',()=>{
 now+=501;request();assert.equal(calls.length,0);
 c.snapshot(JSON.stringify(latest));request({token:'hold-2',at:now-251});request({token:'hold-3',at:now+1});assert.equal(calls.length,0);
});
test('changed identity, topology generation, unavailable and ambiguous Looper are rejected',()=>{
 for(const patch of [{id:13},{generation:4},{active:0},{available:false},{state:'PLAY'},{clear_available:false}]){
  setup();latest.rows=[{...row(),...patch}];c.snapshot(JSON.stringify(latest));request();assert.equal(writes().length,0);
 }
 setup();latest.rows=[row(),{...row(),id:13}];c.snapshot(JSON.stringify(latest));request();assert.equal(calls.length,0);
 setup();latest.rows=[];c.snapshot(JSON.stringify(latest));request();assert.equal(calls.length,0);
});
test('native device identity, capability and stopped State are re-read immediately before Clear',()=>{
 for(const patch of [{id:13},{className:'OtherDevice'},{active:0},{canClear:false},{state:'Playing'},{state:'Recording'},{states:0},{states:2}]){
  setup();Object.assign(native,patch);request();assert.equal(writes().length,0,JSON.stringify(patch));assert.equal(JSON.parse(out.at(-1)[2]).ok,false);
 }
});
test('native errors return failure once without retry or another action',()=>{
 native.throwClear=true;const q=request();assert.equal(writes().length,1);assert.equal(JSON.parse(out.at(-1)[2]).ok,false);
 c.request(JSON.stringify(q));assert.equal(writes().length,1);
});
test('explicit Stop works from playback or unknown State without clearing or guessing enum values',()=>{
 latest.rows[0].state='PLAY';c.snapshot(JSON.stringify(latest));native.state='Playing';request({action:'stop'});
 assert.equal(calls.filter(x=>x.name==='stop').length,1);assert.equal(writes().length,0);assert.match(JSON.parse(out.at(-1)[2]).message,/Stop sent/);
 setup();latest.rows[0].state='UNKNOWN';c.snapshot(JSON.stringify(latest));request({action:'stop'});assert.equal(calls.filter(x=>x.name==='stop').length,1);assert.equal(writes().length,0);
});
test('Stop also requires a valid permit, matching identity and native capability; unknown actions never execute',()=>{
 request({action:'stop'},false);assert.equal(calls.length,0);
 setup();native.canStop=false;request({action:'stop'});assert.equal(calls.length,0);
 setup();latest.rows[0].stop_available=false;c.snapshot(JSON.stringify(latest));request({action:'stop'});assert.equal(calls.length,0);
 setup();request({action:'play'});assert.equal(calls.length,0);
});
console.log(passed+' guarded Clear action tests passed; no hardware actions executed.');
