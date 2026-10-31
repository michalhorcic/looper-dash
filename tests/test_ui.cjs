const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');let texts=[],out=[],shapes=[],point=[],size=14,color='',boldFont=false;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
function bounds(x,y,w,h){assert.ok([x,y,w,h].every(Number.isFinite));assert.ok(x>=0&&x+w<=1040&&y>=0&&y+h<=780);}
const g={init(){},redraw(){},save(){},restore(){},scale(){},select_font_face(name,bold){boldFont=!!bold;},
 set_source_rgba(r,g,b){color=`rgb(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)})`;},
 rectangle(x,y,w,h){bounds(x,y,w,h);shapes.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`);},
 rectangle_rounded(x,y,w,h,ow,oh){bounds(x,y,w,h);assert.ok(ow>=0&&oh>=0);shapes.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${ow/2}" ry="${oh/2}" fill="${color}"/>`);},fill(){},
 text_measure(s){return [Array.from(String(s)).reduce((w,ch)=>w+(/[MW]/.test(ch)?.9:.58)*size,0),size];},
 set_font_size(s){size=s;},move_to(x,y){point=[x,y];},show_text(s){assert.ok(point[1]<=780);texts.push({text:s,size,x:point[0],y:point[1],color,svg:`<text x="${point[0]}" y="${point[1]}" font-size="${size}" font-weight="${boldFont?700:400}" fill="${color}">${esc(s)}</text>`});}};
const c=vm.createContext({mgraphics:g,box:{rect:[0,0,1040,780]},post(){},outlet(...v){out.push(v);},arrayfromargs:x=>Array.from(x)});
vm.runInContext(fs.readFileSync(path.join(root,'mld2_ui.js'),'utf8'),c);c.paint();assert.ok(texts.some(t=>t.text.includes('Add a Looper')));
const m={count:8,status:'Automatic discovery active',rows:Array.from({length:8},(_,i)=>({id:100+i,track:['TEO-5','Guitar','MicroFreak','Piano','Bass','Return A','Master','Extra'][i],name:'Looper',sends:[{letter:'A',name:'Reverb',available:true,display:'-inf dB',position:0},{letter:'B',name:'Delay',available:true,display:'-12.0 dB',position:.8}],track_color:[0xff8844,0x66aaff,0x8844ff,0x44bb88][i%4],trail:[],active:1,available:true,state:['PLAY','RECORD','OVERDUB','STOP'][i%4],grid_bars:i%2?8:4,raw:{name:'State',value:i%4,display:'Native label'}})),transport:{playing:1,bpm:120,numerator:4,denominator:4,grid_valid:true,bar:12,beat:4,next_bar:.75,grid4:.953125,grid8:.4765625}};
c.snapshot(JSON.stringify(m));texts=[];shapes=[];c.paint();assert.ok(texts.some(t=>t.text==='PLAY'));assert.ok(texts.some(t=>t.text==='RECORD'));assert.ok(texts.some(t=>t.text==='OVERDUB'));assert.ok(texts.some(t=>t.text==='STOP'));
assert.equal(c.pageSize(),4);
assert.ok(texts.find(t=>t.text==='RECORD').size>30);
assert.ok(!texts.some(t=>t.text==='LIVE VIEW'||t.text==='CLASSIC'));
assert.ok(texts.some(t=>t.text==='CARDS'));
assert.equal(shapes.filter(s=>s.includes('width="2" height="22"')).length,28,'visible 4/8-bar boundaries on four cards');
assert.ok(!texts.some(t=>String(t.text).includes('Raw:')||String(t.text).includes('Loop position:')),'technical details removed from cards');
assert.ok(texts.some(t=>t.text==='8')&&texts.some(t=>t.text==='4'),'individual bars have numeric labels');
function render(suffix){if(process.argv[2])fs.writeFileSync(process.argv[2]+suffix+'.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="1040" viewBox="0 0 1040 1040" font-family="Arial">${shapes.join('')}${texts.map(t=>t.svg).join('')}</svg>`);}
render('-4');
assert.equal(texts.filter(t=>t.text==='A: Reverb').length,4);assert.equal(texts.filter(t=>t.text==='B: Delay').length,4);
assert.ok(texts.some(t=>t.text==='-inf dB'));assert.ok(texts.some(t=>t.text==='-12.0 dB'));
let sendOut=out.length;let layoutSend=c.cardLayout(0);c.onclick(layoutSend.x+30,layoutSend.y+layoutSend.h-14);assert.equal(out.length,sendOut,'send display is read only');
c.onclick(950,700);assert.equal(c.page,1);texts=[];c.paint();assert.ok(texts.some(t=>t.text==='Bass'));assert.ok(!texts.some(t=>t.text==='TEO-5'));
let layout=c.cardLayout(0);c.onclick(100,layout.y+layout.progressY+10);assert.deepEqual(out.at(-1),[0,'gridlength',104,8]);
c.onclick(800,700);assert.equal(c.page,0);c.onclick(700,25);assert.deepEqual(out.at(-1),[0,'scan']);c.onclick(820,25);assert.deepEqual(out.at(-1),[0,'report']);
// Switching page size keeps the first visible Looper on the selected page.
c.onclick(950,700);assert.equal(c.page,1);let before=out.length;
c.onclick(405,25);assert.equal(c.pageSize(),2);assert.equal(c.page,2);
texts=[];shapes=[];c.paint();render('-2');assert.equal(texts.filter(t=>['PLAY','RECORD','OVERDUB','STOP'].includes(t.text)).length,2);
assert.ok(texts.find(t=>t.text==='PLAY').size>60);
layout=c.cardLayout(1);c.onclick(layout.x+25,layout.y+layout.progressY+10);assert.deepEqual(out.at(-1),[0,'gridlength',105,4]);
c.onclick(450,25);assert.equal(c.pageSize(),3);assert.equal(c.page,1);
texts=[];shapes=[];c.paint();render('-3');assert.equal(texts.filter(t=>t.text==='A: Reverb').length,3);
assert.ok([0,1,2].every(i=>c.cardLayout(i).w===996&&c.cardLayout(i).x===22));
layout=c.cardLayout(2);c.onclick(layout.x+layout.progressX+layout.progressWidth-10,layout.y+layout.progressY+8);assert.deepEqual(out.at(-1),[0,'gridlength',105,4]);
c.onclick(530,25);assert.equal(c.pageSize(),6);assert.equal(c.page,0);
texts=[];shapes=[];c.paint();render('-6');assert.equal(shapes.filter(s=>s.includes('width="2" height="18"')).length,42);
c.onclick(300,25);assert.equal(c.pageSize(),6,'removed view toggle has no action');
c.onclick(490,25);assert.equal(c.pageSize(),4);
assert.equal(out.length,before+2,'layout changes send no messages to Live or core');
// Colors are decoded as RGB; black is a real color, missing/invalid values use neutral.
assert.deepEqual(Array.from(c.trackColor(0xff8040)),[1,128/255,64/255]);
assert.deepEqual(Array.from(c.trackColor(0)),[0,0,0]);
for(const v of [null,undefined,-1,0x1000000,NaN,'red',1.5])assert.deepEqual(Array.from(c.trackColor(v)),[.36,.44,.5]);
texts=[];shapes=[];c.paint();assert.ok(shapes.some(s=>s.includes('width="4" height="28"')&&s.includes('fill="rgb(255,136,68)"')));
assert.equal(texts.find(t=>t.text==='PLAY').color,'rgb(61,214,158)','state color independent of track color');
// Hit testing follows window scaling.
c.box.rect=[0,0,520,390];layout=c.cardLayout(0);c.onclick(50,(layout.y+layout.progressY+10)/2);assert.deepEqual(out.at(-1),[0,'gridlength',100,8]);c.box.rect=[0,0,1040,780];
// Presets resize the jsui (patching and presentation) and its own window together.
const resizeCalls=[],windowSizes=[];let nativeSize=[1040,780],failResize=false;
c.box.message=function(message,w,h){assert.equal(message,'size');resizeCalls.push([w,h]);this.rect=[0,0,w,h];this.presentation_rect=[0,0,w,h];};
c.patcher={wind:{get size(){return nativeSize;},set size(value){if(failResize){failResize=false;throw Error('Window resize failed');}nativeSize=Array.from(value);windowSizes.push(nativeSize);}}};
let resizeOut=out.length;c.page=1;const chosenLayout=c.performanceCards;
for(const factor of [.5,1,2]){
 const oldFactor=c.windowScale;c.onclick((390+[.5,1,2].indexOf(factor)*70+15)*oldFactor,700*oldFactor);
 assert.deepEqual(Array.from(c.box.rect),[0,0,1040*factor,780*factor]);
 assert.deepEqual(Array.from(c.box.presentation_rect),[0,0,1040*factor,780*factor]);assert.deepEqual(nativeSize,[1040*factor,780*factor]);
 assert.equal(c.windowScale,factor);assert.equal(c.page,1);assert.equal(c.performanceCards,chosenLayout);
 texts=[];shapes=[];c.paint();for(const label of ['0.5x','1x','2x'])assert.ok(texts.some(t=>t.text===label));
 assert.ok(!texts.some(t=>t.text==='3x'),'3x preset removed');
 const l=c.cardLayout(0);c.onclick((l.x+30)*factor,(l.y+l.progressY+10)*factor);assert.deepEqual(out.at(-1),[0,'gridlength',104,8]);
 const previousPage=c.page;c.onclick(950*factor,700*factor);assert.equal(c.page,previousPage);c.onclick(800*factor,700*factor);assert.equal(c.page,0);c.onclick(950*factor,700*factor);assert.equal(c.page,1);
}
assert.equal(out.length,resizeOut+3,'only reference-strip clicks emit messages; resizing stays local');
assert.equal(resizeCalls.length,3);assert.equal(windowSizes.length,3);
c.onclick(620*2,700*2);assert.equal(resizeCalls.length,3,'former 3x button area is inert');
for(const bad of [0,-1,.75,3,4,NaN,Infinity,'invalid'])c.windowscale(bad);assert.equal(resizeCalls.length,3);
failResize=true;c.windowscale(.5);assert.equal(c.windowScale,2);assert.deepEqual(nativeSize,[2080,1560]);assert.deepEqual(Array.from(c.box.rect),[0,0,2080,1560]);
c.windowscale(1);c.page=0;
// Three-card wide rows hit the reference strip across its full width at every scale.
c.changeLayout(3);c.page=1;
for(const factor of [.5,1,2]){
 c.box.rect=[0,0,1040*factor,780*factor];
 for(let i=0;i<3;i++){
  const l=c.cardLayout(i),id=103+i;c.onclick((l.x+l.progressX+l.progressWidth-8)*factor,(l.y+l.progressY+8)*factor);
  assert.deepEqual(out.at(-1),[0,'gridlength',id,id%2?4:8]);
  const n=out.length;c.onclick((l.x+l.progressX+10)*factor,(l.y+l.h-17)*factor);assert.equal(out.length,n,'wide send row remains noninteractive');
 }
}
c.box.rect=[0,0,1040,780];c.page=0;c.changeLayout(4);
texts=[];shapes=[];c.paint();assert.ok(shapes.some(s=>s.includes('rx="8"')),'rounded card corners');
assert.equal(shapes.filter(s=>s.includes('width="3" height="24"')).length,4,'distinct reference cursor on every card');
const oldCount=c.pageSize();for(const bad of [0,1,5,8,NaN])c.changeLayout(bad);assert.equal(c.pageSize(),oldCount);
assert.ok(c.textWidth(c.fit('WWWWWWWWWWWWWWWWWWWWWW',100,22,true),22,true)<=100,'names fit their allocated width');
// Missing, unavailable and stale send values never appear as active settings.
texts=[];shapes=[];c.drawSends(30,200,null,false);assert.equal(texts.filter(t=>t.text==='—').length,2);
for(const stale of [false,true]){
 texts=[];shapes=[];c.drawSends(30,200,[{name:'Unavailable',available:false,display:'-3.0 dB',position:1},m.rows[0].sends[1]],stale);
 assert.ok(!texts.some(t=>t.text==='-3.0 dB'));if(stale)assert.ok(!texts.some(t=>t.text==='-12.0 dB'));
}
// Unknown labels, duplicate names and inactive Loopers render in every density.
m.rows[0].state='API: Unrecognized state';m.rows[0].name='Custom Looper';m.rows[0].active=0;m.rows[1].track=m.rows[0].track;
for(const count of [2,3,4,6]){c.changeLayout(count);c.snapshot(JSON.stringify(m));texts=[];shapes=[];c.paint();assert.equal(texts.filter(t=>t.text==='A: Reverb').length,count);assert.ok(texts.some(t=>t.text==='OFF'));assert.ok(texts.some(t=>String(t.text).includes('Custom Looper')));}
c.changeLayout(4);
m.rows=m.rows.slice(0,1);m.count=1;c.page=1;c.snapshot(JSON.stringify(m));assert.equal(c.page,0);
console.log('PASS UI: live view 2/3/4/6, colors, A/B sends (read-only/missing/stale), pagination, window size presets/rollback/scaled hit testing, local-only layout controls, unknown states and page clamping');
