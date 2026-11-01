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
vm.runInContext(fs.readFileSync(path.join(root,'mld2_ui.js'),'utf8'),c);
const model={count:4,rows:['PLAY','RECORD','OVERDUB','STOP'].map((state,i)=>({id:i+1,track:['Kytara / Looper A','MicroFreak / Looper B','TEO-5 / Looper C','SW synthy / Looper D'][i],name:'Looper',trail:[],active:1,available:true,state,loop_length:i?16:0,record_bars:[4,8,2,4][i],track_color:0x66aaff,sends:[{name:'Reverb',available:true,display:'-12 dB',position:.4},{name:'Delay',available:true,display:'-inf dB',position:0}]})),transport:{playing:1,bpm:120,numerator:4,denominator:4,grid_valid:true,bar:12,beat:3,next_bar:1.5}};
function paint(guide,suffix=''){model.guide=guide;c.snapshot(JSON.stringify(model));texts=[];shapes=[];c.paint();if(process.argv[2]&&suffix)fs.writeFileSync(process.argv[2]+suffix+'.svg',`<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="780" font-family="Arial">${shapes.join('')}${texts.map(t=>t.svg).join('')}</svg>`);}
for(const cards of [2,3,4,6]){c.changeLayout(cards);paint({mode:'idle'});assert.equal(texts.filter(t=>t.text==='Reverb').length,cards===6?0:Math.min(cards,4));assert.ok(!texts.some(t=>t.text==='4 BARS'),'no individual reference playheads');}
c.changeLayout(4);
const guides=[{mode:'pending',track:'MicroFreak / Looper B',remaining:2.4,action:'record',bars:8,basis:'planned next bar'},{mode:'record',track:'MicroFreak / Looper B',bar:8,bars:8,beat:3,remaining:1.5,position:.95,basis:'estimated from command'},{mode:'overdub',track:'TEO-5 / Looper C',bar:2,bars:4,beat:3,remaining:9.5,position:.4,basis:'estimated loop phase'},{mode:'unknown',track:'Looper A',state:'OVERDUB',reason:'Loop phase unknown: start was not captured'},{mode:'done',track:'Loop B'},{mode:'unavailable',reason:'Start Live transport in 4/4'}];
guides.forEach((g,i)=>paint(g,'-'+i));paint(guides[1]);assert.ok(texts.some(t=>t.text.includes('LAST BAR')));assert.ok(texts.some(t=>t.text==='EST.'));assert.equal(shapes.filter(t=>t.includes('width="1" height="24"')).length,7,'one eight-bar guide only');
for(const factor of [.5,1,2]){c.box.rect=[0,0,1040*factor,780*factor];paint(guides[0]);let n=out.length;c.onclick(100*factor,470*factor);assert.equal(out.length,n,'cards do not control Live');c.onclick(700*factor,25*factor);assert.deepEqual(out.at(-1),[0,'scan']);}
c.box.rect=[0,0,1040,780];model.count=8;model.rows[0].state='STOP';model.rows[0].loop_length=0;model.rows[1].loop_bars=8;model.rows=model.rows.concat(model.rows.map(r=>({...r,id:r.id+4,track:'More '+r.track})));paint(guides[2]);c.onclick(950,700);assert.equal(c.page,1);c.onclick(405,25);assert.equal(c.pageSize(),2);assert.equal(c.page,2);
const sizeCalls=[];c.box.message=function(_,w,h){sizeCalls.push([w,h]);this.rect=[0,0,w,h];};c.patcher={wind:{size:[1040,780]}};
for(const factor of [.5,1,2]){c.windowscale(factor);assert.equal(c.windowScale,factor);paint(guides[1]);}
assert.equal(sizeCalls.length,3);c.windowscale(1);c.page=0;c.changeLayout(4);paint(guides[1],'-final');c.changeLayout(6);paint(guides[0],'-six');c.changeLayout(3);paint(guides[2],'-three');
// No numeric send values or stale filled meters; proportions remain normalized.
texts=[];shapes=[];c.drawSends(20,50,[{name:'Reverb',available:true,display:'-12 dB',position:.5},{name:'Delay',available:true,display:'-inf dB',position:0}],false,448,false);
assert.ok(!texts.some(t=>String(t.text).includes('dB')));
assert.ok(shapes.some(t=>t.includes('width="107" height="9"')),'half send produces half-width fill');
texts=[];shapes=[];c.drawSends(20,50,[{available:true,position:1},{available:false,position:1}],true,448,true);
assert.ok(!shapes.some(t=>t.includes('rgb(102,196,240)')||t.includes('rgb(184,156,245)')),'stale sends have no coloured fill');
c.changeLayout(4);paint(guides[1]);assert.ok(texts.some(t=>t.text==='LOOP'));assert.ok(texts.some(t=>t.text==='EMPTY'));
assert.ok(!texts.some(t=>String(t.text).includes('recorded')||String(t.text).includes('PLANNED')||String(t.text).includes('estimated from')));
assert.ok(!texts.some(t=>String(t.text).includes('dB')));
console.log('PASS UI: one guide, compact 2/3/4/6 cards, A/B sends, pending/record/overdub/unknown/done, bounds, zoom, pagination and read-only cards');
