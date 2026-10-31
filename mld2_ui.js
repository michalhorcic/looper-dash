autowatch=1;inlets=1;outlets=1;
mgraphics.init();mgraphics.relative_coords=0;mgraphics.autofill=0;
var model={rows:[],status:"Loading Live API",count:0}, page=0, PER_PAGE=6, lastReceived=0;
var beatColors={STOP:[.55,.62,.7],PLAY:[.24,.84,.62],RECORD:[1,.31,.37],OVERDUB:[1,.66,.22]};
function snapshot(){try{model=JSON.parse(arrayfromargs(arguments).join(" "));lastReceived=Date.now();page=Math.min(page,Math.max(0,Math.ceil(model.rows.length/PER_PAGE)-1));mgraphics.redraw();}catch(e){post("MLD UI: ",e,"\n");}}
function rgba(c){mgraphics.set_source_rgba(c[0],c[1],c[2],c.length>3?c[3]:1);}
function rect(x,y,w,h,c){rgba(c);mgraphics.rectangle(x,y,w,h);mgraphics.fill();}
function txt(x,y,s,size,c){rgba(c||[.85,.9,.95]);mgraphics.select_font_face("Arial");mgraphics.set_font_size(size||14);mgraphics.move_to(x,y);mgraphics.show_text(String(s));}
function trim(s,n){s=String(s);return s.length>n?s.substr(0,n-3)+"...":s;}
function button(x,y,w,s){rect(x,y,w,30,[.12,.17,.22]);txt(x+10,y+21,s,13);}
function progress(x,y,bars,frac,valid,col){
    var width=456,segment=width/bars,current=valid?Math.min(bars-1,Math.floor(frac*bars)):-1;
    for(var b=0;b<bars;b++)rect(x+b*segment,y,segment,22,b===current?[.17,.23,.28]:(b%2?[.11,.15,.19]:[.085,.125,.16]));
    if(valid&&frac>0)rect(x,y,width*frac,22,[col[0]*.68,col[1]*.68,col[2]*.68]);
    // Full-height bar boundaries, plus a moving playhead-style reference line.
    for(b=0;b<=bars;b++)rect(x+Math.min(width-2,b*segment),y-4,2,30,[.36,.44,.5]);
    if(valid)rect(x+Math.min(width-2,width*frac),y-4,2,30,col);
    for(b=0;b<bars;b++)txt(x+b*segment+8,y+44,b+1,14,b===current?col:[.44,.53,.6]);
}
function paint(){
    var w=box.rect[2]-box.rect[0],h=box.rect[3]-box.rect[1];mgraphics.save();mgraphics.scale(w/1040,h/780);
    rect(0,0,1040,780,[.025,.04,.055]);txt(22,32,"MULTI LOOPER",24);txt(250,31,"0.3",12,[.48,.68,.78]);
    button(675,10,90,"RESCAN");button(777,10,100,"REPORT");button(889,10,128,"MARK");
    var t=model.transport,stale=lastReceived&&Date.now()-lastReceived>2000;
    if(t){txt(22,76,(t.playing?"RUNNING":"STOPPED")+"   "+(t.bpm!==null?Number(t.bpm).toFixed(1):"?")+" BPM   "+t.numerator+"/"+t.denominator,21);
        txt(470,76,t.grid_valid?"Bar "+t.bar+"  /  Beat "+t.beat+"     Next bar: "+t.next_bar.toFixed(2):"Timing unavailable",18);}
    else txt(22,76,"Connecting to Live…",21);
    if(!model.rows.length){txt(80,245,"Add a Looper to get started.",27);}
    var start=page*PER_PAGE;
    for(var i=0;i<Math.min(PER_PAGE,model.rows.length-start);i++){
        var row=model.rows[start+i],x=22+(i%2)*510,y=120+Math.floor(i/2)*182,col=beatColors[row.state]||[.53,.7,.85];
        rect(x,y,488,168,[.065,.09,.115]);rect(x,y,4,168,col);
        txt(x+16,y+28,trim(row.track,29),20);
        txt(x+395,y+27,row.grid_bars+" BARS",12,[.53,.66,.75]);
        // Only repeat device/rack names when needed to distinguish multiple Loopers.
        var duplicates=0;for(var r=0;r<model.rows.length;r++)if(model.rows[r].track===row.track)duplicates++;
        if(duplicates>1||row.name!=="Looper")txt(x+16,y+48,trim(row.name+(duplicates>1?"  #"+(start+i+1):"")+(row.trail.length?" / "+row.trail.join(" > "):""),63),11,[.46,.57,.65]);
        var label=stale?"STALE DATA":row.state;
        txt(x+16,y+83,trim(label,25),30,col);
        if(row.active===0)txt(x+385,y+81,"OFF",12,[1,.65,.3]);
        var valid=t&&t.grid_valid&&!stale,frac=valid?(row.grid_bars===8?t.grid8:t.grid4):0;
        progress(x+16,y+106,row.grid_bars,frac,valid,col);
    }
    var pages=Math.max(1,Math.ceil(model.rows.length/PER_PAGE));
    txt(22,705,model.count+" LOOPERS  /  Page "+(page+1)+" of "+pages,16);button(735,684,130,"< PREVIOUS");button(877,684,140,"NEXT >");
    if(/error|failed|not ready/i.test(model.status||""))txt(22,738,trim(model.status,130),12,[1,.65,.3]);
    txt(22,762,"Estimated timing follows transport  ·  Click a bar to switch 4 / 8  ·  API state may include a requested action",12,[.48,.57,.65]);
    mgraphics.restore();
}
function onclick(x,y){
    x=x*1040/(box.rect[2]-box.rect[0]);y=y*780/(box.rect[3]-box.rect[1]);
    if(y>=10&&y<=40){if(x>=675&&x<765)outlet(0,"scan");else if(x>=777&&x<877)outlet(0,"report");else if(x>=889&&x<=1017)outlet(0,"mark","USER_MARK");return;}
    var pages=Math.max(1,Math.ceil(model.rows.length/PER_PAGE));
    if(y>=684&&y<=714){if(x>=735&&x<865)page=Math.max(0,page-1);else if(x>=877&&x<=1017)page=Math.min(pages-1,page+1);mgraphics.redraw();return;}
    for(var i=0;i<Math.min(PER_PAGE,model.rows.length-page*PER_PAGE);i++){
        var bx=22+(i%2)*510,by=120+Math.floor(i/2)*182;
        if(x>=bx+16&&x<=bx+472&&y>=by+106&&y<=by+148){var row=model.rows[page*PER_PAGE+i];outlet(0,"gridlength",row.id,row.grid_bars===4?8:4);return;}
    }
}
function onresize(){mgraphics.redraw();}
