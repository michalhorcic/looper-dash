autowatch=0;inlets=1;outlets=1;
mgraphics.init();mgraphics.relative_coords=0;mgraphics.autofill=0;
var model={rows:[],status:"Loading Live API",count:0}, page=0, performanceCards=4, lastReceived=0;
var beatColors={STOP:[.55,.62,.7],PLAY:[.24,.84,.62],RECORD:[1,.31,.37],OVERDUB:[1,.66,.22]};
var windowScale=1, windowScales=[.5,1,2], cardCounts=[2,3,4,6];
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
function pageSize(){return performanceCards;}
function pageCount(){return Math.max(1,Math.ceil(model.rows.length/pageSize()));}
function snapshot(){try{model=JSON.parse(arrayfromargs(arguments).join(" "));lastReceived=Date.now();page=Math.min(page,pageCount()-1);mgraphics.redraw();}catch(e){post("MLD UI: ",e,"\n");}}
function rgba(c){mgraphics.set_source_rgba(c[0],c[1],c[2],c.length>3?c[3]:1);}
function rect(x,y,w,h,c){rgba(c);mgraphics.rectangle(x,y,w,h);mgraphics.fill();}
function rounded(x,y,w,h,r,c){rgba(c);mgraphics.rectangle_rounded(x,y,w,h,r*2,r*2);mgraphics.fill();}
function font(size,bold){mgraphics.select_font_face("Arial",bold?1:0,0);mgraphics.set_font_size(size);}
function textWidth(s,size,bold){font(size,bold);return mgraphics.text_measure(String(s))[0];}
function txt(x,y,s,size,c,bold){rgba(c||[.85,.9,.95]);font(size||14,bold);mgraphics.move_to(x,y);mgraphics.show_text(String(s));}
function trim(s,n){s=String(s);return s.length>n?s.substr(0,n-3)+"...":s;}
function fit(s,width,size,bold){s=String(s);if(textWidth(s,size,bold)<=width)return s;while(s.length&&textWidth(s+"...",size,bold)>width)s=s.substr(0,s.length-1);return s+"...";}
function button(x,y,w,s){rounded(x,y,w,30,6,[.105,.14,.175]);txt(x+(w-textWidth(s,12))/2,y+20,s,12,[.7,.77,.82]);}
function segments(x,y,values,selected,cellWidth){
    rounded(x,y,values.length*cellWidth,34,8,[.065,.09,.115]);
    for(var i=0;i<values.length;i++){
        var active=selected===values[i],label=String(values[i])+(values===windowScales?"x":"");
        if(active)rounded(x+i*cellWidth+2,y+2,cellWidth-4,30,6,[.19,.29,.34]);
        txt(x+i*cellWidth+(cellWidth-textWidth(label,13,active))/2,y+22,label,13,active?[.92,.96,.98]:[.5,.6,.67],active);
    }
}
function trackColor(value){
    if(typeof value!=="number"||!isFinite(value)||value<0||value>0xffffff||Math.floor(value)!==value)return [.36,.44,.5];
    return [((value>>16)&255)/255,((value>>8)&255)/255,(value&255)/255];
}
function cardLayout(i){
    var wide=pageSize()===3,rows=wide?3:pageSize()/2,step=546/rows,height=step-14;
    var x=wide?22:22+(i%2)*510,y=120+(wide?i:Math.floor(i/2))*step;
    return {x:x,y:y,w:wide?996:488,h:height,wide:wide,compact:rows===3,
        progressX:wide?360:20,progressY:wide?76:height-(rows===3?68:86),progressWidth:wide?616:448};
}
function changeLayout(count){
    if(cardCounts.indexOf(count)<0)return;
    var firstVisible=page*pageSize();performanceCards=count;
    page=Math.min(Math.floor(firstVisible/pageSize()),pageCount()-1);mgraphics.redraw();
}
function progress(x,y,bars,frac,valid,col,width,compact){
    var height=compact?12:16,segment=width/bars,current=valid?Math.min(bars-1,Math.floor(frac*bars)):-1;
    rounded(x,y,width,height,4,[.085,.12,.15]);
    for(var b=0;b<bars;b++)if(b===current)rounded(x+b*segment+2,y+1,segment-4,height-2,3,[.14,.19,.23]);
    if(valid&&frac>0)rounded(x,y,width*frac,height,Math.min(4,width*frac/2),[col[0]*.5,col[1]*.5,col[2]*.5]);
    for(b=0;b<=bars;b++)rect(x+Math.min(width-2,b*segment),y-3,2,height+6,[.48,.58,.65]);
    if(valid)rounded(x+Math.min(width-3,width*frac),y-4,3,height+8,1.5,col);
    var labelSize=compact?14:16,labelY=y+(compact?32:38);
    for(b=0;b<bars;b++){
        var center=x+(b+.5)*segment;
        if(b===current)rounded(center-13,labelY-labelSize-2,26,labelSize+6,5,[.085+col[0]*.13,.12+col[1]*.13,.15+col[2]*.13]);
        txt(center-textWidth(b+1,labelSize,true)/2,labelY,b+1,labelSize,b===current?col:[.7,.77,.82],true);
    }
}
function drawSends(x,y,sends,stale,width){
    width=width||448;var cell=(width-20)/2;
    for(var i=0;i<2;i++){
        var send=sends&&sends[i],valid=send&&send.available&&!stale,sx=x+i*(cell+20);
        var value=valid?fit(send.display||"—",72,12):"—",valueWidth=textWidth(value,12);
        txt(sx,y,(i===0?"A":"B")+": "+fit(send&&send.name?send.name:"—",cell-96,12),12,[.5,.6,.67]);
        txt(sx+cell-valueWidth,y,value,12,valid?[.8,.87,.91]:[.4,.49,.55]);
        rounded(sx,y+5,cell,3,1.5,[.12,.17,.21]);
        if(valid&&typeof send.position==="number"&&isFinite(send.position)&&send.position>0){
            var fill=cell*Math.max(0,Math.min(1,send.position));rounded(sx,y+5,fill,3,Math.min(1.5,fill/2),[.36,.53,.61]);
        }
    }
}
function paint(){
    var w=box.rect[2]-box.rect[0],h=box.rect[3]-box.rect[1];mgraphics.save();mgraphics.scale(w/1040,h/780);
    rect(0,0,1040,780,[.025,.04,.055]);txt(22,32,"MULTI LOOPER",22,null,true);
    txt(330,31,"CARDS",12,[.62,.7,.76]);
    segments(390,8,cardCounts,performanceCards,40);
    button(675,10,90,"RESCAN");button(777,10,100,"REPORT");button(889,10,128,"MARK");
    var t=model.transport,stale=lastReceived&&Date.now()-lastReceived>2000;
    if(t){txt(22,76,(t.playing?"RUNNING":"STOPPED")+"   "+(t.bpm!==null?Number(t.bpm).toFixed(1):"?")+" BPM   "+t.numerator+"/"+t.denominator,18);
        txt(470,76,t.grid_valid?"Bar "+t.bar+"  /  Beat "+t.beat+"     Next bar: "+t.next_bar.toFixed(2):"Timing unavailable",16,[.64,.73,.79]);}
    else txt(22,76,"Connecting to Live…",21);
    if(!model.rows.length)txt(80,245,"Add a Looper to get started.",27);
    var start=page*pageSize();
    for(var i=0;i<Math.min(pageSize(),model.rows.length-start);i++){
        var row=model.rows[start+i],layout=cardLayout(i),x=layout.x,y=layout.y,col=beatColors[row.state]||[.53,.7,.85],track=trackColor(row.track_color);
        rounded(x,y,layout.w,layout.h,8,[.12,.17,.2]);
        rounded(x+1,y+1,layout.w-2,layout.h-2,7,[.06,.085,.105]);
        rounded(x+1,y+1,layout.w-2,53,7,[.065+track[0]*.035,.09+track[1]*.035,.11+track[2]*.035]);
        rounded(x+14,y+14,4,28,2,track);
        txt(x+28,y+31,fit(row.track,layout.w-150,22,true),22,[.87,.92,.95],true);
        txt(x+layout.w-88,y+29,row.grid_bars+" BARS",11,[.49,.59,.66]);
        // Distinguish Loopers sharing a track or track name.
        var duplicates=0;for(var r=0;r<model.rows.length;r++)if(model.rows[r].track===row.track)duplicates++;
        if(duplicates>1||row.name!=="Looper")txt(x+28,y+48,fit(row.name+(duplicates>1?"  #"+(start+i+1):"")+(row.trail.length?" / "+row.trail.join(" > "):""),layout.w-56,11),11,[.48,.58,.65]);
        var label=stale?"STALE DATA":row.state;
        var fontSize=layout.wide?54:pageSize()===2?84:pageSize()===4?60:34;
        var stateWidth=layout.wide?312:layout.w-40;
        fontSize=Math.min(fontSize,fontSize*stateWidth/Math.max(1,textWidth(label,fontSize)));
        var baseline=layout.wide?114:layout.compact?84:54+(layout.progressY-54)/2+fontSize*.32;
        txt(x+20,y+baseline,label,fontSize,col);
        if(row.active===0)txt(x+(layout.wide?300:layout.w-54),y+(layout.wide?132:layout.progressY-12),"OFF",11,[1,.65,.3]);
        var valid=t&&t.grid_valid&&!stale,frac=valid?(row.grid_bars===8?t.grid8:t.grid4):0;
        progress(x+layout.progressX,y+layout.progressY,row.grid_bars,frac,valid,col,layout.progressWidth,layout.compact);
        drawSends(x+layout.progressX,y+layout.h-17,row.sends,stale,layout.progressWidth);
    }
    txt(22,705,model.count+" LOOPERS  /  Page "+(page+1)+" of "+pageCount(),14,[.58,.68,.75]);button(735,684,130,"< PREVIOUS");button(877,684,140,"NEXT >");
    txt(340,705,"SIZE",12,[.62,.7,.76]);
    segments(390,682,windowScales,windowScale,70);
    if(/error|failed|not ready/i.test(model.status||""))txt(22,738,trim(model.status,130),12,[1,.65,.3]);
    txt(22,762,"Transport reference only  ·  Click a bar to switch 4 / 8  ·  API state may include a requested action",12,[.48,.57,.65]);
    mgraphics.restore();
}
function onclick(x,y){
    x=x*1040/(box.rect[2]-box.rect[0]);y=y*780/(box.rect[3]-box.rect[1]);
    if(y>=8&&y<=42){
        if(x>=390&&x<550){var n=Math.floor((x-390)/40);changeLayout(cardCounts[n]);}
        else if(x>=675&&x<765)outlet(0,"scan");else if(x>=777&&x<877)outlet(0,"report");else if(x>=889&&x<=1017)outlet(0,"mark","USER_MARK");return;
    }
    if(y>=682&&y<=716){
        if(x>=390&&x<390+windowScales.length*70){var z=Math.floor((x-390)/70);windowscale(windowScales[z]);}
        else if(x>=735&&x<865)page=Math.max(0,page-1);else if(x>=877&&x<=1017)page=Math.min(pageCount()-1,page+1);mgraphics.redraw();return;
    }
    for(var i=0;i<Math.min(pageSize(),model.rows.length-page*pageSize());i++){
        var layout=cardLayout(i),bx=layout.x+layout.progressX,by=layout.y+layout.progressY;
        if(x>=bx&&x<=bx+layout.progressWidth&&y>=by-4&&y<=by+(layout.compact?32:40)){var row=model.rows[page*pageSize()+i];outlet(0,"gridlength",row.id,row.grid_bars===4?8:4);return;}
    }
}
function onresize(){mgraphics.redraw();}
