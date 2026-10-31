const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');let texts=[],out=[],shapes=[],point=[],size=14,color='';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const g={init(){},redraw(){},save(){},restore(){},scale(){},select_font_face(){},
 set_source_rgba(r,g,b){color=`rgb(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)})`;},
 rectangle(x,y,w,h){assert.ok([x,y,w,h].every(Number.isFinite));assert.ok(x>=0&&x+w<=1040&&y>=0&&y+h<=780);shapes.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`);},fill(){},
 set_font_size(s){size=s;},move_to(x,y){point=[x,y];},show_text(s){assert.ok(point[1]<=780);texts.push({text:s,svg:`<text x="${point[0]}" y="${point[1]}" font-size="${size}" fill="${color}">${esc(s)}</text>`});}};
const c=vm.createContext({mgraphics:g,box:{rect:[0,0,1040,780]},post(){},outlet(...v){out.push(v);},arrayfromargs:x=>Array.from(x)});
vm.runInContext(fs.readFileSync(path.join(root,'mld2_ui.js'),'utf8'),c);c.paint();assert.ok(texts.some(t=>t.text.includes('Add a Looper')));
const m={count:8,status:'Automatic discovery active',rows:Array.from({length:8},(_,i)=>({id:100+i,track:['TEO-5','Guitar','MicroFreak','Piano','Bass','Return A','Master','Extra'][i],name:'Looper',trail:[],active:1,available:true,state:['PLAY','RECORD','OVERDUB','STOP'][i%4],grid_bars:i%2?8:4,raw:{name:'State',value:i%4,display:'Native label'}})),transport:{playing:1,bpm:120,numerator:4,denominator:4,grid_valid:true,bar:12,beat:4,next_bar:.75,grid4:.953125,grid8:.4765625}};
c.snapshot(JSON.stringify(m));texts=[];shapes=[];c.paint();assert.ok(texts.some(t=>t.text==='PLAY'));assert.ok(texts.some(t=>t.text==='RECORD'));assert.ok(texts.some(t=>t.text==='OVERDUB'));assert.ok(texts.some(t=>t.text==='STOP'));
assert.equal(shapes.filter(s=>s.includes('width="2" height="30"')).length,48,'4/8-bar boundaries and cursor on each of six cards');
assert.ok(!texts.some(t=>String(t.text).includes('Raw:')||String(t.text).includes('Loop position:')),'technical details removed from cards');
assert.ok(texts.some(t=>t.text==='8')&&texts.some(t=>t.text==='4'),'individual bars have numeric labels');
if(process.argv[2])fs.writeFileSync(process.argv[2],`<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="780">${shapes.join('')}${texts.map(t=>t.svg).join('')}</svg>`);
c.onclick(950,700);assert.equal(c.page,1);texts=[];c.paint();assert.ok(texts.some(t=>t.text==='Master'));assert.ok(!texts.some(t=>t.text==='TEO-5'));
c.onclick(100,265);assert.deepEqual(out.at(-1),[0,'gridlength',106,8]);
c.onclick(800,700);assert.equal(c.page,0);c.onclick(700,25);assert.deepEqual(out.at(-1),[0,'scan']);c.onclick(820,25);assert.deepEqual(out.at(-1),[0,'report']);
m.rows=m.rows.slice(0,1);m.count=1;c.page=1;c.snapshot(JSON.stringify(m));assert.equal(c.page,0);
console.log('PASS UI: empty state, 4 labels, 6-card pagination, page-specific length selection, rescan/report buttons, page clamping');
