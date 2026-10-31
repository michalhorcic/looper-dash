autowatch=1;inlets=1;outlets=1;
mgraphics.init();mgraphics.relative_coords=0;mgraphics.autofill=0;
var model={rows:[],status:"Loading Live API",count:0}, page=0, performanceMode=true, performanceCards=4, lastReceived=0;
var beatColors={STOP:[.55,.62,.7],PLAY:[.24,.84,.62],RECORD:[1,.31,.37],OVERDUB:[1,.66,.22]};
var windowScale=1, windowScales=[.5,1,2,3];
function windowscale(value){
    value=Number(value);if(windowScales.indexOf(value)<0)return;
    var previous=box.rect.slice(0),wind=null,oldSize=null;
    try{
        wind=this.patcher.wind;oldSize=wind.size;
        box.message("size",1040*value,780*value);
        wind.size=[1040*value,780*value];
        windowScale=value;mgraphics.redraw();
    }catch(e){
        try{box.message("size",previous[2]-previous[0],previous[3]-previous[1]);if(wind&&oldSize)wind.size=oldSize;}catch(ignored){}
        post("MLD window resize: ",e,"\n");
    }
}
function pageSize(){return performanceMode?performanceCards:6;}
function pageCount(){return Math.max(1,Math.ceil(model.rows.length/pageSize()));}
function snapshot(){try{model=JSON.parse(arrayfromargs(arguments).join(" "));lastReceived=Date.now();page=Math.min(page,pageCount()-1);mgraphics.redraw();}catch(e){post("MLD UI: ",e,"\n");}}
function rgba(c){mgraphics.set_source_rgba(c[0],c[1],c[2],c.length>3?c[3]:1);}
function rect(x,y,w,h,c){rgba(c);mgraphics.rectangle(x,y,w,h);mgraphics.fill();}
function txt(x,y,s,size,c){rgba(c||[.85,.9,.95]);mgraphics.select_font_face("Arial");mgraphics.set_font_size(size||14);mgraphics.move_to(x,y);mgraphics.show_text(String(s));}
function trim(s,n){s=String(s);return s.length>n?s.substr(0,n-3)+"...":s;}
function button(x,y,w,s,selected){rect(x,y,w,30,selected?[.2,.32,.38]:[.12,.17,.22]);txt(x+10,y+21,s,13);}
function trackColor(value){
    if(typeof value!=="number"||!isFinite(value)||value<0||value>0xffffff||Math.floor(value)!==value)return [.36,.44,.5];
    return [((value>>16)&255)/255,((value>>8)&255)/255,(value&255)/255];
}
function cardLayout(i){
    var rows=pageSize()/2,step=546/rows,height=step-14;
    return {x:22+(i%2)*510,y:120+Math.floor(i/2)*step,h:height,progressY:height-(rows===3?68:86)};
}
function changeLayout(mode,count){
    var firstVisible=page*pageSize();performanceMode=mode;performanceCards=count;
    page=Math.min(Math.floor(firstVisible/pageSize()),pageCount()-1);mgraphics.redraw();
}
function progress(x,y,bars,frac,valid,col){
    var compact=pageSize()===6,height=compact?16:22;
    var width=456,segment=width/bars,current=valid?Math.min(bars-1,Math.floor(frac*bars)):-1;
    for(var b=0;b<bars;b++)rect(x+b*segment,y,segment,height,b===current?[.17,.23,.28]:(b%2?[.11,.15,.19]:[.085,.125,.16]));
    if(valid&&frac>0)rect(x,y,width*frac,height,[col[0]*.68,col[1]*.68,col[2]*.68]);
    // Full-height bar boundaries, plus a moving transport-reference line.
    for(b=0;b<=bars;b++)rect(x+Math.min(width-2,b*segment),y-4,2,30,[.36,.44,.5]);
    if(valid)rect(x+Math.min(width-2,width*frac),y-4,2,30,col);
    for(b=0;b<bars;b++)txt(x+b*segment+8,y+(compact?32:44),b+1,14,b===current?col:[.44,.53,.6]);
}
function drawSends(x,y,sends,stale){
    for(var i=0;i<2;i++){
        var send=sends&&sends[i],valid=send&&send.available&&!stale,sx=x+i*234;
        txt(sx,y,(i===0?"A":"B")+": "+trim(send&&send.name?send.name:"—",17),12,[.62,.7,.76]);
        txt(sx+148,y,valid?trim(send.display||"—",10):"—",12,valid?[.85,.9,.95]:[.44,.53,.6]);
        rect(sx,y+4,220,3,[.12,.17,.22]);
        if(valid&&typeof send.position==="number"&&isFinite(send.position))rect(sx,y+4,220*Math.max(0,Math.min(1,send.position)),3,[.42,.61,.69]);
    }
}
function paint(){
    var w=box.rect[2]-box.rect[0],h=box.rect[3]-box.rect[1];mgraphics.save();mgraphics.scale(w/1040,h/780);
    rect(0,0,1040,780,[.025,.04,.055]);txt(22,32,"MULTI LOOPER",24);
    button(240,10,130,performanceMode?"LIVE VIEW":"CLASSIC",performanceMode);
    var counts=[2,4,6];for(var n=0;n<counts.length;n++)button(390+n*48,10,38,String(counts[n]),performanceMode&&performanceCards===counts[n]);
    button(675,10,90,"RESCAN");button(777,10,100,"REPORT");button(889,10,128,"MARK");
    var t=model.transport,stale=lastReceived&&Date.now()-lastReceived>2000;
    if(t){txt(22,76,(t.playing?"RUNNING":"STOPPED")+"   "+(t.bpm!==null?Number(t.bpm).toFixed(1):"?")+" BPM   "+t.numerator+"/"+t.denominator,21);
        txt(470,76,t.grid_valid?"Bar "+t.bar+"  /  Beat "+t.beat+"     Next bar: "+t.next_bar.toFixed(2):"Timing unavailable",18);}
    else txt(22,76,"Connecting to Live…",21);
    if(!model.rows.length)txt(80,245,"Add a Looper to get started.",27);
    var start=page*pageSize();
    for(var i=0;i<Math.min(pageSize(),model.rows.length-start);i++){
        var row=model.rows[start+i],layout=cardLayout(i),x=layout.x,y=layout.y,col=beatColors[row.state]||[.53,.7,.85],track=trackColor(row.track_color);
        rect(x,y,488,layout.h,[.065,.09,.115]);
        rect(x,y,488,54,[.065+track[0]*.12,.09+track[1]*.12,.115+track[2]*.12]);
        rect(x,y,5,54,track);
        txt(x+16,y+29,trim(row.track,performanceMode?26:29),performanceMode?23:20);
        txt(x+395,y+27,row.grid_bars+" BARS",12,[.65,.75,.82]);
        // Distinguish Loopers sharing a track or track name.
        var duplicates=0;for(var r=0;r<model.rows.length;r++)if(model.rows[r].track===row.track)duplicates++;
        if(duplicates>1||row.name!=="Looper")txt(x+16,y+48,trim(row.name+(duplicates>1?"  #"+(start+i+1):"")+(row.trail.length?" / "+row.trail.join(" > "):""),63),11,[.62,.7,.76]);
        var label=stale?"STALE DATA":row.state;
        var font=performanceMode?(pageSize()===2?84:pageSize()===4?60:34):30;
        font=Math.min(font,440/(Math.max(1,String(label).length)*.72));
        var baseline=performanceMode&&pageSize()!==6?54+(layout.progressY-54)/2+font*.32:84;
        txt(x+16,y+baseline,trim(label,25),font,col);
        if(row.active===0)txt(x+421,y+layout.progressY-12,"OFF",12,[1,.65,.3]);
        var valid=t&&t.grid_valid&&!stale,frac=valid?(row.grid_bars===8?t.grid8:t.grid4):0;
        progress(x+16,y+layout.progressY,row.grid_bars,frac,valid,col);
        drawSends(x+16,y+layout.h-14,row.sends,stale);
    }
    txt(22,705,model.count+" LOOPERS  /  Page "+(page+1)+" of "+pageCount(),16);button(735,684,130,"< PREVIOUS");button(877,684,140,"NEXT >");
    txt(340,705,"SIZE",12,[.62,.7,.76]);
    for(var z=0;z<windowScales.length;z++)button(390+z*70,684,62,windowScales[z]+"x",windowScale===windowScales[z]);
    if(/error|failed|not ready/i.test(model.status||""))txt(22,738,trim(model.status,130),12,[1,.65,.3]);
    txt(22,762,"Transport reference only  ·  Click a bar to switch 4 / 8  ·  API state may include a requested action",12,[.48,.57,.65]);
    mgraphics.restore();
}
function onclick(x,y){
    x=x*1040/(box.rect[2]-box.rect[0]);y=y*780/(box.rect[3]-box.rect[1]);
    if(y>=10&&y<=40){
        if(x>=240&&x<370)changeLayout(!performanceMode,performanceCards);
        else if(x>=390&&x<524){var n=Math.floor((x-390)/48);if(x<390+n*48+38)changeLayout(true,[2,4,6][n]);}
        else if(x>=675&&x<765)outlet(0,"scan");else if(x>=777&&x<877)outlet(0,"report");else if(x>=889&&x<=1017)outlet(0,"mark","USER_MARK");return;
    }
    if(y>=684&&y<=714){
        if(x>=390&&x<662){var z=Math.floor((x-390)/70);if(x<390+z*70+62)windowscale(windowScales[z]);}
        else if(x>=735&&x<865)page=Math.max(0,page-1);else if(x>=877&&x<=1017)page=Math.min(pageCount()-1,page+1);mgraphics.redraw();return;
    }
    for(var i=0;i<Math.min(pageSize(),model.rows.length-page*pageSize());i++){
        var layout=cardLayout(i),bx=layout.x,by=layout.y+layout.progressY;
        if(x>=bx+16&&x<=bx+472&&y>=by&&y<=by+44){var row=model.rows[page*pageSize()+i];outlet(0,"gridlength",row.id,row.grid_bars===4?8:4);return;}
    }
}
function onresize(){mgraphics.redraw();}
