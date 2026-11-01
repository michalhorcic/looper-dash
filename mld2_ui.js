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
    var wide=pageSize()===3,rows=wide?3:pageSize()/2,step=258/rows;
    return {x:wide?22:22+(i%2)*510,y:410+(wide?i:Math.floor(i/2))*step,w:wide?996:488,h:step-10,wide:wide,compact:rows===3};
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
function drawSends(x,y,sends,stale,width,compact){
    width=width||448;var gap=20,cell=(width-gap)/2;
    for(var i=0;i<2;i++){
        var send=sends&&sends[i],valid=send&&send.available&&!stale,sx=x+i*(cell+gap);
        var color=i===0?[.40,.77,.94]:[.72,.61,.96];
        txt(sx,y,i===0?"A":"B",11,valid?color:[.35,.42,.48],true);
        if(!compact)txt(sx+19,y,fit(send&&send.name?send.name:"—",cell-23,12),12,[.62,.72,.78]);
        var bx=compact?sx+21:sx,by=compact?y-8:y+9,bw=compact?cell-21:cell;
        rounded(bx,by,bw,9,4.5,[.12,.17,.20]);
        if(valid&&typeof send.position==="number"&&isFinite(send.position)&&send.position>0){
            var fill=bw*Math.max(0,Math.min(1,send.position));rounded(bx,by,fill,9,Math.min(4.5,fill/2),color);
        }
        if(!valid)txt(bx+bw-10,compact?y:y+1,"—",11,[.4,.48,.54]);
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
        txt(470,76,t.grid_valid?t.bar+"."+t.beat:"—",16,[.64,.73,.79]);}
    else txt(22,76,"Connecting to Live…",21);
    if(!model.rows.length)txt(80,245,"No Loopers",27);
    drawGuide(model.guide,t,stale);
    var start=page*pageSize();
    for(var i=0;i<Math.min(pageSize(),model.rows.length-start);i++){
        var row=model.rows[start+i],layout=cardLayout(i),x=layout.x,y=layout.y,col=beatColors[row.state]||[.53,.7,.85],track=trackColor(row.track_color);
        var recorded=!stale&&row.available!==false&&row.loop_length>0;
        rounded(x,y,layout.w,layout.h,10,recorded?[.065,.12,.125]:[.045,.065,.08]);
        rounded(x+10,y+12,recorded?5:3,layout.h-24,2,recorded?track:[.21,.28,.32]);
        var nameWidth=layout.wide?280:layout.w-210;
        txt(x+24,y+26,fit(row.track,nameWidth,18,true),18,[.87,.92,.95],true);
        txt(x+(layout.wide?320:layout.w-168),y+29,fit(stale?"STALE":row.state,layout.wide?210:150,24,true),24,col,true);
        var empty=!stale&&row.available!==false&&row.loop_length===0&&row.state==="STOP";
        var badge=recorded?"LOOP":empty?"EMPTY":"—",smallBadge=layout.compact&&!layout.wide;
        rounded(x+24,y+36,recorded?72:64,smallBadge?16:20,5,recorded?[.12,.32,.26]:[.09,.12,.15]);
        if(recorded){
            for(var mark=0;mark<3;mark++)rounded(x+32+mark*4,y+(smallBadge?40:42),2,8,1,[.46,.91,.72]);
        }
        txt(x+(recorded?50:33),y+(smallBadge?48:50),badge,11,recorded?[.64,1,.82]:[.43,.52,.58],true);
        var length=row.loop_bars?row.loop_bars+" bars":!recorded&&row.record_bars?row.record_bars+" bars next":"";
        if(length)txt(x+108,y+(smallBadge?48:50),length,12,[.57,.69,.74]);
        if(row.active===0)txt(x+layout.w-50,y+50,"OFF",11,[1,.65,.3]);
        var compactSends=layout.compact&&!layout.wide;
        drawSends(x+(layout.wide?560:24),y+layout.h-(compactSends?12:38),row.sends,stale,layout.wide?410:layout.w-48,compactSends);

    }
    txt(22,705,model.count+" loops  ·  "+(page+1)+" / "+pageCount(),14,[.58,.68,.75]);button(735,684,130,"<");button(877,684,140,">");
    txt(340,705,"SIZE",12,[.62,.7,.76]);
    segments(390,682,windowScales,windowScale,70);
    if(/error|failed|not ready/i.test(model.status||""))txt(22,738,trim(model.status,130),12,[1,.65,.3]);
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

}
function onresize(){mgraphics.redraw();}

function drawGuide(g,t,stale){
    g=g||{mode:"idle"};
    if(stale)g={mode:"unavailable",reason:"Dashboard data stale"};
    var color=g.mode==="record"?[1,.31,.37]:g.mode==="overdub"?[1,.66,.22]:[.24,.84,.62];
    rounded(22,112,996,278,10,[.055,.08,.10]);
    txt(46,145,g.track?fit(g.track,900,22,true):"READY",22,[.87,.92,.95],true);
    var title="READY",sub="Next bar",fraction=null,bars=null;
    if(g.mode==="pending"){title="START IN "+Number(g.remaining).toFixed(1);sub=String(g.action).toUpperCase()+(g.bars?" · "+g.bars+" bars":"");fraction=1-g.remaining/4;}
    else if(g.mode==="record"||g.mode==="overdub"){
        title=(g.mode==="record"?"REC":"OVERDUB")+"  "+g.bar+" / "+g.bars;
        sub=(g.remaining<=4?"LAST BAR · ":"")+Number(g.remaining).toFixed(1)+" beats left"+(g.mode==="overdub"&&g.pass?" · pass "+g.pass:"");
        fraction=g.position;bars=g.bars;
    }else if(g.mode==="done"){title=g.restarted?"PLAY · FROM START":"DONE · PLAY";sub="";}
    else if(g.mode==="waiting"){title="WAITING";sub="";}
    else if(g.mode==="unknown"){title=g.state||"POSITION UNKNOWN";sub="Position unknown";}
    else if(g.mode==="conflict"||g.mode==="unavailable"){title=g.mode==="conflict"?"MULTIPLE RECORDINGS":"UNAVAILABLE";sub="";}
    else {sub="";if(t&&t.grid_valid&&t.playing){title="NEXT BAR  "+Number(t.next_bar).toFixed(1);fraction=1-t.next_bar/4;}}
    txt(46,208,fit(title,945,42,true),42,color,true);
    txt(46,240,fit(sub||"",935,18),18,[.73,.8,.84]);
    rounded(46,265,948,20,5,[.1,.14,.17]);
    if(fraction!==null&&isFinite(fraction)){
        var width=948*Math.max(0,Math.min(1,fraction));if(width>0)rounded(46,265,width,20,Math.min(5,width/2),color);
    }
    if(bars&&bars<=32)for(var i=1;i<bars;i++)rect(46+948*i/bars,263,1,24,[.48,.58,.65]);
    for(var beat=0;beat<4;beat++){
        var on=t&&t.playing&&t.beat===beat+1;
        rounded(46+beat*50,308,36,30,5,on?color:[.1,.14,.17]);txt(57+beat*50,330,beat+1,18,on?[.025,.04,.055]:[.6,.7,.75],true);
    }
    if(g.basis)txt(909,369,"EST.",11,[.4,.51,.57]);
}
