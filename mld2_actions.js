/* Explicit button Stop and hold Clear only. No MIDI, routing, parameter setters or global transport. */
autowatch=0;inlets=1;outlets=2;
var latest=null,received=0,handled={},permits={};
function authorize(){try{var q=JSON.parse(arrayfromargs(arguments).join(" "));if(typeof q.token==="string"&&q.token.length<=120)permits["$"+q.token]=JSON.stringify(q);}catch(e){}}
function cancel(){permits={};}
function snapshot(){try{latest=JSON.parse(arrayfromargs(arguments).join(" "));received=Date.now();}catch(e){latest=null;received=0;}}
function first(v){return Array.isArray(v)?v[0]:v;}
function nativeValue(o,p){return first(o.get(p));}
function result(token,ok,message){outlet(0,"clear_result",JSON.stringify({token:token,ok:ok,message:message}));}
function request(){
    var q,token="";
    try{
        q=JSON.parse(arrayfromargs(arguments).join(" "));token=String(q.token||"");
        var action=q.action===undefined?"clear":q.action;
        if(action!=="clear"&&action!=="stop"&&action!=="multi")throw new Error("unsupported action");
        if(!token||token.length>120||handled["$"+token])return;
        // A token is consumed even when validation fails; a held button never retries a clear.
        handled["$"+token]=true;
        var keys=Object.keys(handled);if(keys.length>512)delete handled[keys[0]];
        var permit=permits["$"+token];delete permits["$"+token];
        if(permit!==JSON.stringify(q))throw new Error("clear gesture cancelled / unauthorized");
        if(!latest||Date.now()-received>500||typeof q.at!=="number"||Date.now()-q.at>250||q.at>Date.now())throw new Error("stale clear request / dashboard");
        if(typeof q.id!=="number"||q.id<=0||typeof q.track!=="string"||typeof q.generation!=="number")throw new Error("invalid target");
        var rows=latest.rows||[],matches=[];
        for(var i=0;i<rows.length;i++)if(rows[i].track===q.track)matches.push(rows[i]);
        if(matches.length!==1)throw new Error("missing or ambiguous Looper");
        var row=matches[0];
        if(row.id!==q.id||row.generation!==q.generation||!row.available||row.active===0)throw new Error("target changed or unavailable");
        if(action==="clear"&&(row.state!=="STOP"||row.clear_available!==true))throw new Error("target not stopped or Clear API unavailable");
        if(action==="stop"&&row.stop_available!==true)throw new Error("Stop API unavailable");
        var device=new LiveAPI(null,"id "+q.id);
        var nativeAction=action==="multi"?"play":action;
        if(Number(device.id)!==q.id||String(nativeValue(device,"class_name"))!=="Looper"||Number(nativeValue(device,"is_active"))!==1||!(new RegExp("(?:^|\\s)function\\s+"+nativeAction+"(?:\\s|$)")).test(String(device.info)))throw new Error("native Looper / action capability not confirmed");
        if(action==="multi"){
            if(!/^(STOP|PLAY|RECORD|OVERDUB)$/.test(row.state))throw new Error("unknown transport state");
            // The native State is reread below before selecting the multipurpose operation.
        }
        if(action==="stop"){device.call("stop");outlet(1,"guide_event",JSON.stringify({id:row.id,generation:row.generation,action:"stop",q:0,at:Date.now()}));result(token,true,"Stop sent: "+q.track);return;}
        // Re-read the current native State display immediately before the one allowed write.
        var states=[],guideParameters={},parameters=device.get("parameters");
        if(!Array.isArray(parameters)||parameters.length>8192||parameters.length%2!==0)throw new Error("native parameter IDs unavailable");
        for(i=0;i<parameters.length;i+=2){
            var pid=Number(parameters[i+1]);
            if(parameters[i]!=="id"||!isFinite(pid)||pid<=0||Math.floor(pid)!==pid)throw new Error("invalid native parameter ID");
            var p=new LiveAPI(null,"id "+pid);
            if(Number(p.id)!==pid)throw new Error("native parameter changed");
            if(action==="multi")guideParameters[String(nativeValue(p,"name")).toLowerCase()]={value:Number(nativeValue(p,"value")),text:String(p.call("str_for_value",nativeValue(p,"value")))};
            if(/^(state|looper state)$/i.test(String(nativeValue(p,"name")))||/^(state|looper state)$/i.test(String(nativeValue(p,"original_name"))))states.push(p);
        }
        if(states.length!==1)throw new Error("native State is ambiguous");
        var display=states[0].call("str_for_value",nativeValue(states[0],"value"));
        var state=Array.isArray(display)?display.join(" "):String(display);
        if(action==="multi"){
            var quant=guideParameters["quantization"],speed=guideParameters["speed"],reverse=guideParameters["reverse"];
            if(!quant||!/^\s*1\s*bar\s*$/i.test(quant.text))throw new Error("Guide requires confirmed 1 Bar quantization");
            if(speed&&speed.value!==0||reverse&&reverse.value!==0)throw new Error("Guide requires normal speed / forward playback");
            var buffer=Number(nativeValue(device,"loop_length"));
            var label=state.toLowerCase().replace(/^\s+|\s+$/g,"");
            var chosen=/^(play|playing|playback)$/.test(label)?"overdub":/^(record|recording|rec|overdub|overdubbing|ovr)$/.test(label)?"play":/^(stop|stopped)$/.test(label)?(buffer===0?"record":isFinite(buffer)&&buffer>0?"play":null):null;
            if(!chosen)throw new Error("unknown native State / buffer");
            if(!(new RegExp("(?:^|\\s)function\\s+"+chosen+"(?:\\s|$)")).test(String(device.info)))throw new Error("action API unavailable");
            var song=new LiveAPI(null,"live_set"),beat=Number(nativeValue(song,"current_song_time"));
            if(Number(nativeValue(song,"is_playing"))!==1||!isFinite(beat)||beat<0||Number(nativeValue(song,"signature_numerator"))!==4||Number(nativeValue(song,"signature_denominator"))!==4)throw new Error("Guide requires running 4/4 transport");
            device.call(chosen);
            outlet(1,"guide_event",JSON.stringify({id:row.id,generation:row.generation,action:chosen,from_stopped:/^(stop|stopped)$/.test(label),buffer_length:buffer,q:beat,at:Date.now(),record_bars:row.record_bars}));
            result(token,true,"Guide "+chosen+": "+q.track);return;
        }
        if(!/^\s*(stop|stopped)\s*$/i.test(state))throw new Error("native Looper is not stopped");
        device.call("clear");outlet(1,"guide_event",JSON.stringify({id:row.id,generation:row.generation,action:"clear",q:0,at:Date.now()}));result(token,true,"Clear sent: "+q.track);
    }catch(e){result(token,false,(action==="multi"?"Guide skipped: ":action==="stop"?"Stop skipped: ":"Clear skipped: ")+String(e.message||e));}
}
function notifydeleted(){latest=null;handled={};permits={};}
