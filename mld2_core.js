/* MLD 0.15.0 beta. ES5 for stock Max js. All Live interaction is read-only. */
autowatch=0; inlets=1; outlets=1;
var song=null, timer=null, refs=[], slots=[], queue=[], events=[], scans=0;
var ready=false, epoch=0, dirty=false, scanAt=0, lastFallback=0, lastContext=0;
var message="Loading Live API", dropped=0, transportData=null, inventory=[];
var referenceBars={}, MAX_EVENTS=6000, MAX_QUEUE=4096;
function a(v){return v instanceof Array?v:[v];}
function first(v){return a(v)[0];}
function get(o,p,def){try{var v=o.get(p);return v===undefined||v===null?def:v;}catch(e){return def;}}
function str(o,p){return a(get(o,p,[])).join(" ");}
function number(o,p,def){var v=first(get(o,p,[def]));return v===null||v===undefined||!isFinite(Number(v))?def:Number(v);}
function obj(p){return new LiveAPI(null,p);}
function id(o){return Number(o.id);}
function info(o){try{return String(o.info);}catch(e){return "";}}
function has(o,kind,p){return new RegExp("(?:^|\\s)"+kind+"\\s+"+p+"(?:\\s|$)").test(info(o));}
function log(e){e.wall_ms=e.wall_ms||Date.now();if(events.length>=MAX_EVENTS){events.shift();dropped++;}events.push(e);}
function observe(o,prop,kind,target,key){
    var gen=epoch, baseline=kind==="topology"?JSON.stringify(get(o,prop,[])):null;
    var w=new LiveAPI(function(args){
        if(gen!==epoch)return;
        var v=a(args);if(String(v[0])!==prop)return;
        if(kind==="topology"){var encoded=JSON.stringify(v.slice(1));if(encoded!==baseline){baseline=encoded;dirty=true;}return;}
        if(queue.length>=MAX_QUEUE){queue.shift();dropped++;}
        queue.push({target:target,key:key,property:prop,value:v.slice(1),wall_ms:Date.now()});
    },"id "+id(o));
    refs.push(w);w.property=prop;
}
function detach(){epoch++;for(var i=0;i<refs.length;i++){try{refs[i].property="";refs[i].id=0;}catch(e){}}refs=[];queue=[];}
function shutdown(){if(timer){timer.cancel();timer.freepeer();timer=null;}detach();ready=false;}
function notifydeleted(){shutdown();}
function init(){
    shutdown();
    try{song=obj("live_set");if(!id(song))throw new Error("No live_set");ready=true;rescan();
        timer=new Task(tick,this);timer.interval=50;timer.repeat();}
    catch(e){ready=false;message="API not ready: "+e;publish();}
}
function bang(){init();}
function display(p){try{p.display=a(obj("id "+p.id).call("str_for_value",p.value)).join(" ");}catch(e){p.display="";}}
function statusLabel(p){
    if(!p)return "UNKNOWN";
    // Decode only explicit text returned by Live. Never assume an enum order.
    var v=String(p.display).toLowerCase().replace(/^\s+|\s+$/g,"");
    if(/^(stopped|stop)$/.test(v))return "STOP";
    if(/^(play|playing|playback)$/.test(v))return "PLAY";
    if(/^(record|recording|rec)$/.test(v))return "RECORD";
    if(/^(overdub|overdubbing|ovr)$/.test(v))return "OVERDUB";
    return "API: "+(p.display||p.value);
}
function candidate(s){
    var matches=[];for(var i=0;i<s.parameters.length;i++){
        var p=s.parameters[i];if(/^(state|looper state)$/i.test(p.name)||/^(state|looper state)$/i.test(p.original_name))matches.push(p);
    }return matches.length===1?matches[0]:null;
}
function readSends(track,returns,bind){
    var sends=[],mixer=obj(track.path+" mixer_device"),count=0;
    if(id(mixer)&&has(mixer,"children","sends")){
        count=mixer.getcount("sends");if(bind)observe(mixer,"sends","topology");
    }
    for(var i=0;i<2;i++){
        var target=returns[i],s={letter:i===0?"A":"B",return_id:target?target.id:null,
            name:target?target.name:"",id:null,available:false,value:null,min:null,max:null,display:"",track_id:track.id};
        if(target&&i<count){
            var p=obj(track.path+" mixer_device sends "+i);
            s.id=id(p);s.value=number(p,"value",null);s.min=number(p,"min",null);s.max=number(p,"max",null);
            s.available=!!s.id&&s.value!==null;display(s);
            if(bind&&s.id)observe(p,"value","parameter",s,"value");
        }
        sends.push(s);
    }
    return sends;
}
function safeProperty(d,p){return has(d,"property",p)?get(d,p,[]):[];}
function readLooper(d,track,trail,path,old){
    var key=String(id(d)), s={id:id(d),path:path,track_id:track.id,track:track.name,track_color:track.color,
        sends:track.sends,
        name:str(d,"name"),trail:trail,active:number(d,"is_active",null),properties:{},parameters:[],info:info(d),
        class_name:str(d,"class_name"),class_display_name:str(d,"class_display_name"),available:true};
    s.loop_length=has(d,"property","loop_length")?number(d,"loop_length",null):null;
    s.clear_available=has(d,"function","clear");
    s.stop_available=has(d,"function","stop");
    if(has(d,"property","loop_length"))observe(d,"loop_length","device",s,"loop_length");
    s.guide_record_index=first(safeProperty(d,"record_length_index"));
    s.guide_record_list=safeProperty(d,"record_length_list");
    if(has(d,"property","record_length_index"))observe(d,"record_length_index","device",s,"guide_record_index");
    if(referenceBars[key]===undefined)referenceBars[key]=old?old.grid_bars:4;
    var props=["loop_length","record_length_index","record_length_list","overdub_after_record","tempo"];
    for(var k=0;k<props.length;k++)if(has(d,"property",props[k]))s.properties[props[k]]=get(d,props[k],[null]);
    // Get values with stable id paths; track ordering is allowed to change.
    var n=d.getcount("parameters");
    for(var j=0;j<n;j++){
        var pa=obj(path+" parameters "+j),p={id:id(pa),index:j,name:str(pa,"name"),original_name:str(pa,"original_name"),
            value:first(get(pa,"value",[null])),min:number(pa,"min",null),max:number(pa,"max",null),
            is_quantized:number(pa,"is_quantized",0),display:"",slot_id:s.id};
        p.value_items=p.is_quantized?get(pa,"value_items",[]):[];display(p);s.parameters.push(p);
        observe(pa,"value","parameter",p,"value");
    }
    observe(d,"is_active","device",s,"active");
    observe(d,"name","topology");
    observe(d,"parameters","topology");
    return s;
}
function discover(bind){
    var result=[], visits=0, old={},returns=[];
    for(var r=0;r<Math.min(2,song.getcount("return_tracks"));r++){
        var rt=obj("live_set return_tracks "+r);returns.push({id:id(rt),name:str(rt,"name")});
    }
    for(var i=0;i<slots.length;i++)old[String(slots[i].id)]=slots[i];
    function walk(base,track,trail,depth){
        if(depth>24)throw new Error("Rack nesting limit (24)");
        var owner=obj(base);
        if(bind)observe(owner,"devices","topology");
        var n=owner.getcount("devices");
        for(var j=0;j<n;j++){
            if(++visits>10000)throw new Error("Device scan limit (10000)");
            var path=base+" devices "+j,d=obj(path),cn=str(d,"class_name"),dn=str(d,"class_display_name");
            if(cn==="Looper"||dn==="Looper"){
                if(!track.sends)track.sends=readSends(track,returns,bind);
                result.push(bind?readLooper(d,track,trail,path,old[String(id(d))]):{id:id(d),track_id:track.id,track:track.name,track_color:track.color,sends:track.sends,name:str(d,"name"),path:path,trail:trail});
            }
            if(number(d,"can_have_chains",0)){
                if(bind)observe(d,"name","topology");
                var children=["chains","return_chains"];
                for(var c=0;c<children.length;c++)if(has(d,"children",children[c])){
                    if(bind)observe(d,children[c],"topology");
                    var count=d.getcount(children[c]);
                    for(var h=0;h<count;h++){
                        var cp=path+" "+children[c]+" "+h,ch=obj(cp);
                        if(bind)observe(ch,"name","topology");
                        walk(cp,track,trail.concat([str(d,"name")+" / "+(str(ch,"name")||children[c]+" "+(h+1))]),depth+1);
                    }
                }
            }
        }
    }
    if(bind){observe(song,"tracks","topology");observe(song,"return_tracks","topology");}
    var kinds=["tracks","return_tracks"];
    for(var k=0;k<kinds.length;k++){
        var count=song.getcount(kinds[k]);
        for(var t=0;t<count;t++){
            var tp="live_set "+kinds[k]+" "+t,tr=obj(tp),track={id:id(tr),path:tp,name:str(tr,"name"),color:number(tr,"color",null)};
            if(bind){observe(tr,"name","topology");if(has(tr,"property","color"))observe(tr,"color","topology");}walk(tp,track,[],0);
        }
    }
    var master=obj("live_set master_track");
    if(id(master)){if(bind){observe(master,"name","topology");if(has(master,"property","color"))observe(master,"color","topology");}walk("live_set master_track",{id:id(master),path:"live_set master_track",name:str(master,"name")||"Master",color:number(master,"color",null)},[],0);}
    return result;
}
function fingerprint(ss){var out=[];for(var i=0;i<ss.length;i++)out.push([ss[i].id,ss[i].track_id,ss[i].track,ss[i].track_color,ss[i].name,ss[i].path,ss[i].trail,ss[i].sends.map(function(s){return [s.id,s.return_id,s.name];})]);return JSON.stringify(out);}
function rescan(){
    if(!ready)return;
    var old=slots;detach();
    try{slots=discover(true);inventory=JSON.parse(JSON.stringify(slots));scans++;
        message=slots.length?"Automatic discovery active":"No built-in Loopers found — add a Looper anywhere in this Set";
        scanAt=lastFallback=Date.now();dirty=false;
        log({kind:"discovery",count:slots.length,ids:slots.map(function(s){return s.id;})});
        // New object IDs do not inherit another Looper's local reference length.
        var keep={};for(var i=0;i<slots.length;i++)keep[String(slots[i].id)]=referenceBars[String(slots[i].id)];referenceBars=keep;
    }catch(e){detach();slots=[];dirty=true;scanAt=Date.now();message="Scan failed: "+e;log({kind:"error",message:message});}
    publish();
}
function scan(){if(!ready)init();else rescan();}
function mod(q,n){return ((q%n)+n)%n;}
function readTransport(){
    var t=transportData?JSON.parse(JSON.stringify(transportData)):{},now=Date.now();
    t.q=number(song,"current_song_time",null);t.playing=number(song,"is_playing",0);t.wall_ms=now;
    if(now-lastContext>=500||!transportData){
        t.bpm=number(song,"tempo",null);t.numerator=number(song,"signature_numerator",null);t.denominator=number(song,"signature_denominator",null);
        t.global_quantization=number(song,"clip_trigger_quantization",null);lastContext=now;
    }
    t.grid_valid=t.q!==null&&t.q>=0&&t.numerator===4&&t.denominator===4;
    if(t.grid_valid){t.bar=Math.floor(t.q/4)+1;t.beat=Math.floor(mod(t.q,4))+1;t.next_bar=4-mod(t.q,4);t.grid4=mod(t.q,16)/16;t.grid8=mod(t.q,32)/32;}
    transportData=t;return t;
}
function tick(){
    if(!ready)return;
    try{
        var now=Date.now();
        if(dirty&&now-scanAt>=250){rescan();return;}
        if(now-lastFallback>=5000){lastFallback=now;var current=discover(false);if(fingerprint(current)!==fingerprint(slots)){dirty=true;rescan();return;}}
        var t=readTransport(),batch=queue;queue=[];
        for(var i=0;i<batch.length;i++){
            var e=batch[i];e.target[e.key]=first(e.value);if(e.key==="value")display(e.target);
            log({kind:e.key==="value"?"parameter":"device",id:e.target.id,slot_id:e.target.slot_id||e.target.id,
                property:e.property,value:e.value,display:e.target.display||null,wall_ms:e.wall_ms,
                sampled_q:t.q,sampled_wall_ms:t.wall_ms});
        }
        publish();
    }catch(e){message="Read error: "+e;dirty=true;for(var j=0;j<slots.length;j++)slots[j].available=false;publish();}
}
function publish(){
    var rows=[];
    for(var i=0;i<slots.length;i++){
        var s=slots[i],p=candidate(s);
        var sends=s.sends.map(function(send){
            var valid=send.available&&s.available&&!dirty&&typeof send.value==="number"&&isFinite(send.value);
            return {letter:send.letter,name:send.name,available:valid,display:valid?send.display:"",
                position:valid&&send.max>send.min?Math.max(0,Math.min(1,(send.value-send.min)/(send.max-send.min))):null};
        });
        rows.push({id:s.id,track:s.track,track_color:s.track_color,name:s.name,trail:s.trail,active:s.active,
            generation:epoch,loop_length:typeof s.loop_length==="number"&&isFinite(s.loop_length)&&s.loop_length>=0?s.loop_length:null,clear_available:s.clear_available,stop_available:s.stop_available,
            sends:sends,
            available:s.available&&!dirty,state:s.available&&!dirty?statusLabel(p):"RECONNECTING",
            raw:p?{name:p.name,value:p.value,display:p.display}:null,grid_bars:referenceBars[String(s.id)]||4,
            timing_supported:timingSupported(s),record_bars:recordBars(s),parameter_count:s.parameters.length});
    }
    reconcileGuideMemory(rows);
    var guide=guideView(rows,transportData);
    for(var n=0;n<rows.length;n++){var known=guideLengths[String(rows[n].id)];rows[n].loop_bars=known&&known.buffer===rows[n].loop_length?known.bars:null;}
    var packet={version:"0.15.0 beta",status:message,rows:rows,transport:transportData,
        guide:guide,count:rows.length,scans:scans,dropped:dropped,wall_ms:Date.now(),pending:"unknown",phase:"unavailable"};
    if(guideMemoryReady)packet.guide_memory=guideMemoryExport();
    outlet(0,"snapshot",JSON.stringify(packet));
}
function gridlength(deviceId,bars){bars=Number(bars);if(bars!==4&&bars!==8)return;for(var i=0;i<slots.length;i++)if(slots[i].id===Number(deviceId)){referenceBars[String(deviceId)]=bars;publish();return;}}
function mark(){log({kind:"marker",label:arrayfromargs(arguments).join(" ")||"User marker",transport:transportData});}
function export_report(){
    var path=arrayfromargs(arguments).join(" ");if(!path)return;
    var r={schema:"mld-diagnostic-2",version:"0.15.0 beta",created_at:new Date().toISOString(),
        status:message,transport:transportData,loopers:slots,initial_inventory:inventory,events:events,dropped_events:dropped,
        timing:"Observer wall times; transport sampled later in a low-priority Task. Not sample accurate.",
        state_semantics:"Native parameter text, not validated as active versus requested state.",
        phase:"Not measured. Per-card 4/8-bar strips are independent transport reference grids.",
        pending:"Unknown. This monitor is read-only; optional routed button Stop / hold Clear actions use separate modules."};
    var f=new File(path,"write","TEXT");if(!f.isopen){message="Export failed: cannot open destination";publish();return;}
    try{f.position=0;f.eof=0;var json=JSON.stringify(r,null,2).replace(/[\u007f-\uffff]/g,function(c){return "\\u"+("0000"+c.charCodeAt(0).toString(16)).slice(-4);});
        var lines=json.split("\n");for(var i=0;i<lines.length;i++)f.writeline(lines[i]);f.close();message="Diagnostic report saved";publish();
    }catch(e){f.close();message="Export error: "+e;publish();}
}

// Musical guide: predicted from acknowledged commands, never a native playhead.
var guideLengths={},guideSession=null,guideAnchors={},guideLastQ=null,guideLastWall=0,guideDone=null;
function timingSupported(s){
    for(var i=0;i<s.parameters.length;i++){var p=s.parameters[i],name=String(p.original_name||p.name).toLowerCase();if((name==="speed"||name==="reverse")&&Number(p.value)!==0)return false;}return true;
}
function recordBars(s){
    var index=Number(s.guide_record_index),list=s.guide_record_list;
    if(!Array.isArray(list)||!isFinite(index)||index<0||Math.floor(index)!==index||index>=list.length)return null;
    var match=/^\s*(\d+(?:\.\d+)?)\s*bars?\s*$/i.exec(String(list[index]));
    return match&&Number(match[1])>0?Number(match[1]):null;
}
function guide_event(){
    try{
        var e=JSON.parse(arrayfromargs(arguments).join(" "));
        if(!e||typeof e.id!=="number"||typeof e.q!=="number"||!isFinite(e.q)||e.q<0||typeof e.at!=="number"||Math.abs(Date.now()-e.at)>500)return;
        var found=null;for(var i=0;i<slots.length;i++)if(slots[i].id===e.id&&e.generation===epoch)found=slots[i];
        if(!found)return;
        if(e.action==="stop"||e.action==="clear"){
            guideDone=null;
            delete guideAnchors[String(e.id)];if(e.action==="clear"){delete guideLengths[String(e.id)];forgetGuideMemory(found);}if(guideSession&&guideSession.id===e.id)guideSession=null;return;
        }
        if(!/^(record|play|overdub)$/.test(e.action))return;
        var begin=(Math.floor(e.q/4)+1)*4;
        if(e.action==="record"){delete guideAnchors[String(e.id)];delete guideLengths[String(e.id)];forgetGuideMemory(found);}
        var saved=guideLengths[String(e.id)],restart=null;
        if(e.action==="play"&&e.from_stopped===true){
            delete guideAnchors[String(e.id)];
            if(saved&&saved.generation===epoch&&saved.buffer>0&&saved.buffer===e.buffer_length)restart={bars:saved.bars,buffer:saved.buffer};
        }
        guideDone=null;guideLastQ=e.q;guideLastWall=e.at;
        guideSession={id:e.id,generation:epoch,action:e.action,command_q:e.q,track:found.track,from_stopped:e.from_stopped===true,restart:restart,start:begin,bars:e.action==="record"?recordBars(found):restart?restart.bars:(guideAnchors[String(e.id)]||{}).bars||null,at:e.at,confirmed:false};
        // Wait for tick/readTransport; cached transport may predate this command.
    }catch(e){}
}
function guideView(rows,t){
    var idle={mode:"idle",basis:"command estimate",reason:"Guide CTRL: opt-in in LED SETUP",q:t?t.q:null};
    if(!t||!t.playing||!t.grid_valid){guideSession=null;guideDone=null;guideAnchors={};guideLastQ=null;return {mode:"unavailable",reason:"Start Live transport in 4/4"};}
    var now=Date.now(),q=t.q;
    // Reentrant/manual publishes can still carry the last pre-command sample.
    // Do not classify that older sample as a backward seek or process stale State.
    if(guideSession&&typeof t.wall_ms==="number"&&t.wall_ms<=guideSession.at&&q<guideSession.command_q&&now-guideSession.at<=500){
        return {mode:"pending",id:guideSession.id,track:guideSession.track,action:guideSession.action,
            remaining:guideSession.start-guideSession.command_q,bars:guideSession.bars,basis:"planned next bar; waiting for fresh transport"};
    }
    // Transport jumps, stalls and discovery boundaries invalidate inferred phase.
    if(guideLastQ!==null&&(q<guideLastQ-0.001||q-guideLastQ>Math.max(1,(now-guideLastWall)/1000*(t.bpm||120)/60+0.5)||now-guideLastWall>1000)){guideSession=null;guideDone=null;guideAnchors={};}
    guideLastQ=q;guideLastWall=now;
    var candidates=[],row=null;
    for(var i=0;i<rows.length;i++){
        var r=rows[i];if(r.available&&r.active!==0&&/^(RECORD|OVERDUB)$/.test(r.state))candidates.push(r);
        if(guideSession&&r.id===guideSession.id)row=r;
        var known=guideLengths[String(r.id)];
        if(known&&(known.generation!==r.generation||!r.available||r.active===0||r.timing_supported===false||r.loop_length!==known.buffer))delete guideLengths[String(r.id)];
        var anchor=guideAnchors[String(r.id)];
        if(anchor&&r.loop_length>0){if(anchor.buffer===undefined)anchor.buffer=r.loop_length;else if(anchor.buffer!==r.loop_length)delete guideAnchors[String(r.id)];}
        if(r.timing_supported===false||!r.available||r.active===0||r.state==="STOP"||r.loop_length===0&&r.state!=="RECORD")delete guideAnchors[String(r.id)];
    }
    if(candidates.length>1){guideSession=null;guideAnchors={};return {mode:"conflict",reason:"Multiple recording Loopers: guide paused"};}
    if(guideSession&&row&&row.timing_supported===false){guideSession=null;guideAnchors={};return {mode:"unavailable",reason:"Normal speed / forward playback required"};}
    if(guideSession&&(!row||!row.available||row.active===0||row.generation!==guideSession.generation)){guideSession=null;guideAnchors={};}
    if(!guideSession){
        if(guideDone&&now-guideDone.at<900)return {mode:"done",track:guideDone.track,restarted:guideDone.restarted===true,reason:"PLAY"};
        if(candidates.length)return {mode:"unknown",id:candidates[0].id,track:candidates[0].track,state:candidates[0].state,reason:"Position unknown: no captured start"};
        return idle;
    }
    var g=guideSession;
    if(q<g.start)return {mode:"pending",id:row.id,track:row.track,action:g.action,remaining:g.start-q,bars:g.bars,basis:"planned next bar"};
    var elapsed=q-g.start,expected=g.action==="record"?"RECORD":g.action==="overdub"?"OVERDUB":"PLAY";
    if(row.state===expected)g.confirmed=true;
    if(g.action==="play"){
        if(row.state==="PLAY"){
            // User verified native Stop -> Play restarts at the beginning.
            // Re-anchor only a known completed, unchanged buffer after the launch boundary.
            if(g.restart&&row.loop_length===g.restart.buffer)guideAnchors[String(row.id)]={q:g.start,bars:g.restart.bars,buffer:g.restart.buffer,generation:g.generation};
            guideDone={at:now,track:row.track,restarted:g.from_stopped};guideSession=null;return {mode:"done",track:row.track,restarted:g.from_stopped,reason:"PLAY"};}
        if(elapsed>4){guideSession=null;return {mode:"unknown",track:row.track,reason:"Play not confirmed"};}
        return {mode:"waiting",track:row.track,reason:"Waiting for PLAY confirmation"};
    }
    if(row.state==="STOP"&&(g.confirmed||elapsed>4)){guideSession=null;delete guideAnchors[String(row.id)];return idle;}
    if(g.action==="record"){
        if(row.state==="RECORD"&&g.bars!==null)guideAnchors[String(row.id)]=guideAnchors[String(row.id)]||{q:g.start,bars:g.bars,generation:g.generation};
        if(row.state==="PLAY"&&g.confirmed){
            if(g.bars!==null&&elapsed>=g.bars*4&&row.loop_length>0){guideLengths[String(row.id)]={bars:g.bars,buffer:row.loop_length,generation:g.generation};rememberGuideMemory(row,g.bars,rows);}
            guideDone={at:now,track:row.track};guideSession=null;return {mode:"done",track:row.track,reason:"PLAY"};}
        if(!g.confirmed){if(elapsed>4)guideSession=null;return {mode:"waiting",track:row.track,reason:"Waiting for RECORD confirmation"};}
        if(g.bars===null)return {mode:"unknown",track:row.track,state:row.state,reason:"Fixed record length unavailable"};
        var total=g.bars*4;
        if(elapsed>=total)return {mode:"waiting",track:row.track,reason:"Expected end reached; waiting for PLAY"};
        return {mode:"record",track:row.track,elapsed:elapsed,total:total,bars:g.bars,bar:Math.floor(elapsed/4)+1,beat:Math.floor(mod(elapsed,4))+1,remaining:total-elapsed,position:elapsed/total,basis:"estimated from command"};
    }
    if(row.state==="PLAY"&&g.confirmed){guideDone={at:now,track:row.track};guideSession=null;return {mode:"done",track:row.track,reason:"PLAY"};}
    if(!g.confirmed)return {mode:"waiting",track:row.track,reason:"Waiting for OVERDUB confirmation"};
    var anchor=guideAnchors[String(row.id)];
    if(!anchor||anchor.generation!==row.generation)return {mode:"unknown",track:row.track,state:row.state,reason:"Loop phase unknown: start was not captured"};
    var length=anchor.bars*4,phase=mod(q-anchor.q,length);
    return {mode:"overdub",track:row.track,bars:anchor.bars,bar:Math.floor(phase/4)+1,beat:Math.floor(mod(phase,4))+1,remaining:length-phase,position:phase/length,pass:Math.floor((q-anchor.q)/length)-Math.floor((g.start-anchor.q)/length)+1,basis:"estimated loop phase"};
}

// Durable facts only: no IDs, generation numbers, transport origin or held actions.
var guideMemoryReady=false,guideMemoryRecords=[],guideMemoryBindings={};
function guideMemoryKey(r){return JSON.stringify([r.track,r.name,r.trail]);}
function validGuideMemory(records){
    if(!Array.isArray(records)||records.length>2000)return false;
    var seen={};
    for(var i=0;i<records.length;i++){
        var r=records[i];
        if(!r||typeof r.track!=="string"||!r.track.length||r.track.length>1024||typeof r.name!=="string"||!r.name.length||r.name.length>1024||!Array.isArray(r.trail)||r.trail.length>24||typeof r.bars!=="number"||!isFinite(r.bars)||r.bars<=0||r.bars>4096||typeof r.buffer!=="number"||!isFinite(r.buffer)||r.buffer<=0)return false;
        for(var j=0;j<r.trail.length;j++)if(typeof r.trail[j]!=="string"||r.trail[j].length>2048)return false;
        var k=guideMemoryKey(r);if(seen[k])return false;seen[k]=true;
    }return true;
}
function guideMemoryExport(){
    return guideMemoryRecords.map(function(r){return {track:r.track,name:r.name,trail:r.trail.slice(),bars:r.bars,buffer:r.buffer};});
}
function guide_memory_restore(){
    try{
        var records=JSON.parse(arrayfromargs(arguments).join(" "));if(!validGuideMemory(records))return;
        guideMemoryRecords=records.map(function(r){return {track:r.track,name:r.name,trail:r.trail.slice(),bars:r.bars,buffer:r.buffer};});
        guideMemoryBindings={};guideMemoryReady=true;guideLengths={};guideAnchors={};guideSession=null;guideDone=null;
        // Restore may precede topology and clock metadata; wait for regular publish.
    }catch(e){}
}
function forgetGuideMemory(row){
    var keep=[];for(var i=0;i<guideMemoryRecords.length;i++){
        var r=guideMemoryRecords[i];if(r.track===row.track){delete guideMemoryBindings[guideMemoryKey(r)];}else keep.push(r);
    }guideMemoryRecords=keep;
}
function rememberGuideMemory(row,bars,rows){
    if(typeof row.name!=="string"||!Array.isArray(row.trail))return;
    var matches=0;for(var i=0;i<rows.length;i++)if(rows[i].track===row.track)matches++;
    if(matches!==1)return;
    var entry={track:row.track,name:row.name,trail:row.trail.slice(),bars:bars,buffer:row.loop_length};
    if(!validGuideMemory([entry]))return;
    forgetGuideMemory(row);guideMemoryRecords.push(entry);guideMemoryRecords.sort(function(a,b){var x=guideMemoryKey(a),y=guideMemoryKey(b);return x<y?-1:x>y?1:0;});
    guideMemoryBindings[guideMemoryKey(entry)]={id:row.id};
}
function reconcileGuideMemory(rows){
    var keep=[];
    for(var i=0;i<guideMemoryRecords.length;i++){
        var entry=guideMemoryRecords[i],k=guideMemoryKey(entry),binding=guideMemoryBindings[k],matches=[];
        for(var j=0;j<rows.length;j++)if(rows[j].track===entry.track)matches.push(rows[j]);
        var row=matches.length===1?matches[0]:null,drop=false;
        if(matches.length>1)drop=true;
        else if(!row)drop=!!binding;
        else if(row.available){
            if(guideMemoryKey(row)!==k||binding&&binding.id!==row.id)drop=true;
            else if(typeof row.loop_length==="number"&&row.loop_length>0&&row.loop_length!==entry.buffer)drop=true;
            else if(binding&&row.loop_length===0)drop=true;
            else if(row.active!==0&&row.timing_supported!==false&&row.loop_length===entry.buffer){
                guideLengths[String(row.id)]={bars:entry.bars,buffer:entry.buffer,generation:row.generation};
                guideMemoryBindings[k]={id:row.id};
            }
        }
        if(drop){if(binding){delete guideLengths[String(binding.id)];delete guideAnchors[String(binding.id)];}delete guideMemoryBindings[k];}
        else keep.push(entry);
    }guideMemoryRecords=keep;
}
