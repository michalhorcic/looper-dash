/* MLD 0.13.2 beta. ES5 for stock Max js. All Live interaction is read-only. */
autowatch=1; inlets=1; outlets=1;
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
function readLooper(d,track,trail,path,old){
    var key=String(id(d)), s={id:id(d),path:path,track_id:track.id,track:track.name,track_color:track.color,
        sends:track.sends,
        name:str(d,"name"),trail:trail,active:number(d,"is_active",null),properties:{},parameters:[],info:info(d),
        class_name:str(d,"class_name"),class_display_name:str(d,"class_display_name"),available:true};
    s.loop_length=has(d,"property","loop_length")?number(d,"loop_length",null):null;
    s.clear_available=has(d,"function","clear");
    s.stop_available=has(d,"function","stop");
    if(has(d,"property","loop_length"))observe(d,"loop_length","device",s,"loop_length");
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
            parameter_count:s.parameters.length});
    }
    outlet(0,"snapshot",JSON.stringify({version:"0.13.2 beta",status:message,rows:rows,transport:transportData,
        count:rows.length,scans:scans,dropped:dropped,wall_ms:Date.now(),pending:"unknown",phase:"unavailable"}));
}
function gridlength(deviceId,bars){bars=Number(bars);if(bars!==4&&bars!==8)return;for(var i=0;i<slots.length;i++)if(slots[i].id===Number(deviceId)){referenceBars[String(deviceId)]=bars;publish();return;}}
function mark(){log({kind:"marker",label:arrayfromargs(arguments).join(" ")||"User marker",transport:transportData});}
function export_report(){
    var path=arrayfromargs(arguments).join(" ");if(!path)return;
    var r={schema:"mld-diagnostic-2",version:"0.13.2 beta",created_at:new Date().toISOString(),
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
