/* Explicit button Stop and hold Clear only. No MIDI, routing, parameter setters or global transport. */
autowatch=0;inlets=1;outlets=1;
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
        if(action!=="clear"&&action!=="stop")throw new Error("unsupported action");
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
        if(Number(device.id)!==q.id||String(nativeValue(device,"class_name"))!=="Looper"||Number(nativeValue(device,"is_active"))!==1||!(new RegExp("(?:^|\\s)function\\s+"+action+"(?:\\s|$)")).test(String(device.info)))throw new Error("native Looper / action capability not confirmed");
        if(action==="stop"){device.call("stop");result(token,true,"Stop sent: "+q.track);return;}
        // Re-read the current native State display immediately before the one allowed write.
        var states=[],parameters=device.get("parameters");
        if(!Array.isArray(parameters)||parameters.length>8192||parameters.length%2!==0)throw new Error("native parameter IDs unavailable");
        for(i=0;i<parameters.length;i+=2){
            var pid=Number(parameters[i+1]);
            if(parameters[i]!=="id"||!isFinite(pid)||pid<=0||Math.floor(pid)!==pid)throw new Error("invalid native parameter ID");
            var p=new LiveAPI(null,"id "+pid);
            if(Number(p.id)!==pid)throw new Error("native parameter changed");
            if(/^(state|looper state)$/i.test(String(nativeValue(p,"name")))||/^(state|looper state)$/i.test(String(nativeValue(p,"original_name"))))states.push(p);
        }
        if(states.length!==1)throw new Error("native State is ambiguous");
        var display=states[0].call("str_for_value",nativeValue(states[0],"value"));
        var state=Array.isArray(display)?display.join(" "):String(display);
        if(!/^\s*(stop|stopped)\s*$/i.test(state))throw new Error("native Looper is not stopped");
        device.call("clear");result(token,true,"Clear sent: "+q.track);
    }catch(e){result(token,false,(action==="stop"?"Stop skipped: ":"Clear skipped: ")+String(e.message||e));}
}
function notifydeleted(){latest=null;handled={};permits={};}
