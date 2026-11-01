/* LCXL3 CC feedback and Stop-hold gesture. ES5. Clear is delegated to the guarded action module. */
autowatch=1;inlets=1;outlets=7;
var config={version:2,port:"",input:"",holdMs:1500,run:false,assignments:[]};
var latest=null,received=0,rows=[],groups={},items=[],page=0,pageSize=4;
var types=[],channels=[],typeChoice=null,channelChoice=null,portOptions=[];
var portName="",channelName="",pendingType=null,pendingChannel=null;
var lastTypeRequest=0,lastChannelRequest=0;
var manualChannel=15;
var active=false,timer=null,runtime={},pendingTest=null,uiCache={},notice="Choose the LCXL3 MIDI In output; enter CC and enable each row.";
function textArgs(args){return arrayfromargs(args).join(" ");}
function integer(n,min,max){return typeof n==="number"&&isFinite(n)&&Math.floor(n)===n&&n>=min&&n<=max;}
function allowedPort(s){return typeof s==="string"&&/^LCXL3 \d+ \(MIDI In\)$/i.test(s);}
function channelNumber(s){var m=/^(?:(?:Ch\.?|Channel)\s*)?(\d{1,2})$/i.exec(String(s));return m&&integer(Number(m[1]),1,16)?Number(m[1]):0;}
function outputChannel(){
    if(!config.run)return manualChannel;
    var channel=0;
    for(var i=0;i<config.assignments.length;i++){
        var a=config.assignments[i];if(!(a.enabled&&complete(a))&&!(a.stop&&a.stop.enabled&&stopComplete(a)))continue;
        if(channel&&channel!==a.channel)return 0;
        channel=a.channel;
    }return channel||15;
}
function channelIndex(n){for(var i=0;i<channels.length;i++)if(channelNumber(channels[i])===n)return i;return -1;}
function key(s){return "$"+s;}
function assignment(track){for(var i=0;i<config.assignments.length;i++)if(config.assignments[i].track===track)return config.assignments[i];return null;}
function stopDefaults(track){var m=/^Looper ([ABC])$/.exec(track);return {cc:m?45+m[1].charCodeAt(0)-65:-1,on:127,off:0,enabled:false,clear:false};}
function defaults(track){return {track:track,channel:15,cc:-1,on:127,off:0,enabled:false,stop:stopDefaults(track)};}
function target(a,role){if(role!=="stop")return a;return {track:a.track,channel:a.channel,cc:a.stop.cc,on:a.stop.on,off:a.stop.off,enabled:a.stop.enabled,role:"stop"};}
function stopComplete(a){return a&&a.stop&&complete(target(a,"stop"));}
function bufferState(row){
    if(!row||!row.available||row.active===0||typeof row.loop_length!=="number"||!isFinite(row.loop_length)||row.loop_length<0)return "unknown";
    if(row.loop_length>0)return "recorded";
    if(row.state==="STOP")return "empty";
    return row.state==="RECORD"?"recording":"unknown";
}
function complete(a){return a&&integer(a.channel,1,16)&&integer(a.cc,0,127)&&integer(a.on,0,127)&&integer(a.off,0,127);}
function collision(a,role){
    var t=role==="stop"?target(a,"stop"):a;if(!complete(t))return false;
    var roleName=role||a.role||"play";
    for(var i=0;i<config.assignments.length;i++){
        var b=config.assignments[i];
        for(var j=0;j<2;j++){
            var r=j?"stop":"play",other=target(b,r);
            if(b.track===t.track&&r===roleName)continue;
            if(other.enabled&&complete(other)&&t.channel===other.channel&&t.cc===other.cc)return true;
        }
    }return false;
}
function ready(){var n=outputChannel();return active&&allowedPort(config.port)&&portName===config.port&&n>0&&channelNumber(channelName)===n;}
function fresh(){return latest&&Date.now()-received<=1500;}
function validRow(row){return row&&row.available&&row.active!==0&&/^(STOP|PLAY|RECORD|OVERDUB)$/.test(row.state);}
function claim(){if(!active){active=true;outlet(3,1);}}
function release(){if(active){active=false;outlet(3,0);}}
function send(a,bit,force){
    if(!ready()||!complete(a)||a.channel!==channelNumber(channelName))return;
    var k=key(a.track)+"/"+(a.role||"play"),r=runtime[k]||(runtime[k]={state:null,start:0,bit:null,sent:0,target:null});
    var now=Date.now(),value=bit?a.on:a.off;
    if(!force&&r.bit===bit&&r.value===value&&now-r.sent<100)return;
    outlet(0,[175+a.channel,a.cc,value]);r.bit=bit;r.value=value;r.sent=now;
    r.target={channel:a.channel,cc:a.cc,off:a.off};
}
function clearAll(){
    if(ready())for(var k in runtime)if(Object.prototype.hasOwnProperty.call(runtime,k)){
        var t=runtime[k].target;if(t&&t.channel===channelNumber(channelName))outlet(0,[175+t.channel,t.cc,t.off]);
    }
    runtime={};pendingTest=null;cancelHolds();
}
function start(){if(!timer){timer=new Task(tick,this);timer.interval=25;timer.repeat();}}
function stop(){if(timer){timer.cancel();timer.freepeer();timer=null;}}
function changed(){if(typeof notifyclients==="function")notifyclients();}
function suspend(){clearAll();config.run=false;stop();release();notice="LED SETUP stopped; manual tests remain available.";changed();render();}
function run(n){
    var next=Number(n)===1;
    if(!next){suspend();return;}
    if(!config.run)clearAll();pendingTest=null;config.run=true;claim();reconcileRoute();start();notice="";changed();tick();
}
function resolve(choice,names){return typeof choice==="number"?(integer(choice,0,names.length-1)?String(names[choice]):""):typeof choice==="string"?choice:"";}
function routingtypes(){
    types=arrayfromargs(arguments);portOptions=[];
    delete uiCache["setupPort/set"];
    ui("setupPort","clear");
    ui("setupPort","append","Select LCXL3 MIDI In");
    for(var i=0;i<types.length;i++)if(allowedPort(types[i])){portOptions.push({name:String(types[i]),index:i});ui("setupPort","append",String(types[i]));}
    // clear/append must not be cached: each metadata update rebuilds the menu.
    refreshRoute();reconcileRoute();tick();
}
function routingchannels(){channels=arrayfromargs(arguments);refreshRoute();reconcileRoute();tick();}
function routingtype(){typeChoice=selection(arguments);refreshRoute();reconcileRoute();tick();}
function routingchannel(){channelChoice=selection(arguments);refreshRoute();reconcileRoute();tick();}
function selection(args){var a=arrayfromargs(args);return a.length===1&&typeof a[0]==="number"?a[0]:a.join(" ");}
function refreshRoute(){portName=resolve(typeChoice,types);channelName=resolve(channelChoice,channels);}
function reconcileRoute(){
    if(!active||!allowedPort(config.port))return;
    var i;
    if(portName!==config.port){
        for(i=0;i<types.length;i++)if(types[i]===config.port){
            if(pendingType!==i||Date.now()-lastTypeRequest>=1000){pendingType=i;lastTypeRequest=Date.now();outlet(2,"type",i);}return;
        }return;
    }
    var desired=outputChannel();
    if(desired>0&&channelNumber(channelName)!==desired){
        i=channelIndex(desired);
        if(i>=0&&(pendingChannel!==i||Date.now()-lastChannelRequest>=1000)){pendingChannel=i;lastChannelRequest=Date.now();outlet(2,"channel",i);}
    }
}
function choose_port(n){
    n=Number(n);if(!integer(n,0,portOptions.length))return;
    clearAll();config.port=n?portOptions[n-1].name:"";pendingType=null;pendingChannel=null;
    claim();reconcileRoute();notice="";changed();tick();
}
function snapshot(){
    try{var s=JSON.parse(textArgs(arguments));if(!s||!Array.isArray(s.rows))throw new Error("rows");
        latest=s;received=Date.now();rows=s.rows;rebuild();
    }catch(e){latest=null;received=0;rows=[];rebuild();}
    tick();
}
function rebuild(){
    groups={};items=[];var seen={};
    for(var i=0;i<rows.length;i++){
        var r=rows[i];if(!r||typeof r.track!=="string"||!r.track.length)continue;
        var k=key(r.track);if(!groups[k])groups[k]=[];groups[k].push(r);
        if(!seen[k]){items.push(r.track);seen[k]=true;}
    }
    for(i=0;i<config.assignments.length;i++){
        var name=config.assignments[i].track;if(!seen[key(name)]){items.push(name);seen[key(name)]=true;}
    }
    page=Math.max(0,Math.min(page,Math.max(0,Math.ceil(items.length/pageSize)-1)));
}
function rowStatus(track){
    var a=assignment(track),g=groups[key(track)]||[];
    if(g.length>1)return "AMBIGUOUS: multiple Loopers / track";
    if(!g.length)return "MISSING: assignment retained";
    if(!complete(a))return "UNASSIGNED: enter CC (0-127)";
    if(collision(a))return "CONFLICT: duplicate channel / CC";
    if(!a.enabled)return "DISABLED";
    if(!fresh()||!validRow(g[0]))return "UNAVAILABLE: Off colour";
    return g[0].state+(a.on===a.off?" / On = Off":"");
}
function rowedit(slot,field,value){
    slot=Number(slot);value=Number(value);
    if(!integer(slot,0,pageSize-1))return;
    var track=items[page*pageSize+slot];if(track===undefined)return;
    var limits={channel:[1,16],cc:[-1,127],on:[0,127],off:[0,127],enabled:[0,1]};
    if(!Object.prototype.hasOwnProperty.call(limits,field)||!integer(value,limits[field][0],limits[field][1]))return;
    var a=assignment(track);
    if(!a&&config.assignments.length>=2000){notice="Assignment limit (2000) reached; clear unused settings first.";render();return;}
    clearAll();if(!a){a=defaults(track);config.assignments.push(a);}
    a[field]=field==="enabled"?value===1:value;notice="";changed();tick();
}
function forget(slot){
    slot=Number(slot);if(!integer(slot,0,pageSize-1))return;
    var track=items[page*pageSize+slot];if(track===undefined)return;
    clearAll();config.assignments=config.assignments.filter(function(a){return a.track!==track;});
    notice="Assignment cleared; detected Loopers stay in the list.";rebuild();changed();tick();
}
function test(slot,bit,role){
    slot=Number(slot);bit=Number(bit);if(!integer(slot,0,pageSize-1)||!integer(bit,0,1))return;
    var track=items[page*pageSize+slot],base=assignment(track),a=base?target(base,role):null,g=groups[key(track)]||[];
    if(config.run){notice="Turn SYNC off before manual tests.";render();return;}
    if(!complete(a)||g.length!==1||collision(a)){notice="TEST blocked: assign a unique CC to an available, unambiguous Looper row.";render();return;}
    if(manualChannel!==a.channel){clearAll();manualChannel=a.channel;pendingChannel=null;}
    pendingTest={track:track,bit:bit,role:role==="stop"?"stop":"play"};notice="";claim();reconcileRoute();tick();
}
function turnpage(delta){var p=page;page=Math.max(0,Math.min(page+Number(delta),Math.max(0,Math.ceil(items.length/pageSize)-1)));if(!integer(page,0,100000))page=p;render();}
function tick(){
    if(active){reconcileRoute();reconcileInput();}
    if(pendingTest&&ready()&&!config.run){
        var t=pendingTest,base=assignment(t.track),ta=base?target(base,t.role):null,tg=groups[key(t.track)]||[];pendingTest=null;
        if(complete(ta)&&tg.length===1&&!collision(ta)){
            send(ta,t.bit,true);notice="TEST "+(t.bit?"ON":"OFF")+": "+t.track+" / ch"+ta.channel+" CC"+ta.cc+" = "+(t.bit?ta.on:ta.off)+".";
        }else notice="TEST cancelled: target is missing, ambiguous or conflicting.";
    }
    if(config.run&&ready()){
        var now=Date.now();
        for(var i=0;i<config.assignments.length;i++){
            var a=config.assignments[i],g=groups[key(a.track)]||[];
            if(a.stop&&a.stop.enabled&&stopComplete(a)&&!collision(a,"stop")){
                var bs=fresh()&&g.length===1?bufferState(g[0]):"unknown";
                send(target(a,"stop"),bs==="empty"?1:0,false);
            }
            if(!a.enabled||!complete(a)||collision(a))continue;
            var rk=key(a.track)+"/play",r=runtime[rk]||(runtime[rk]={state:null,start:0,bit:null,sent:0,target:null});
            var state=fresh()&&g.length===1&&validRow(g[0])?g[0].state:null;
            if(r.state!==state){r.state=state;r.start=now;r.bit=null;}
            var half=state==="RECORD"?500:state==="OVERDUB"?125:0;
            var bit=state!==null&&state!=="STOP"&&(!half||Math.floor(Math.max(0,now-r.start)/half)%2===0)?1:0;
            send(a,bit,false);
        }
    }checkHolds();render();
}
function ui(name,command){
    var args=arrayfromargs(arguments).slice(2),k=name+"/"+command,s=JSON.stringify(args);
    if(command!=="append"&&command!=="clear"&&uiCache[k]===s)return;
    uiCache[k]=s;outlet(1,["script","sendbox",name,command].concat(args));
}
function render(){
    renderInputStatus();
    var portIndex=0;for(var i=0;i<portOptions.length;i++)if(portOptions[i].name===config.port)portIndex=i+1;
    ui("setupPort","set",portIndex);ui("holdSeconds","set",config.holdMs/1000);ui("setupRun","set",config.run?1:0);
    ui("setupPage","set",(items.length?page+1:0)+" / "+Math.ceil(items.length/pageSize)+"   ("+items.length+" tracks)");
    var status=notice||((!config.run&&!pendingTest)?"SYNC OFF. Settings are saved with the Live Set.":!ready()?routeStatus():"SYNC ON / channel "+outputChannel()+": STOP Off / PLAY On / RECORD slow / OVERDUB fast.");
    ui("setupStatus","set",status);
    for(i=0;i<pageSize;i++){
        var track=items[page*pageSize+i],prefix="row"+i+"_",exists=track!==undefined;
        var fields=["label","channel","cc","on","off","enabled","teston","testoff","forget","status","stoplabel","stopcc","stopon","stopoff","stopenabled","stopclear","stopteston","stoptestoff","stopstatus"];
        for(var j=0;j<fields.length;j++)ui(prefix+fields[j],"hidden",exists?0:1);
        if(!exists)continue;
        var a=assignment(track)||defaults(track),g=groups[key(track)]||[];
        ui(prefix+"label","set",track+" / "+(g.length===1?String(g[0].name||"Looper"):g.length?g.length+" Loopers":"not detected"));
        ui(prefix+"status","set",rowStatus(track));
        ui(prefix+"stopstatus","set",stopStatus(track));
        ui(prefix+"stopcc","set",a.stop.cc);ui(prefix+"stopon","set",a.stop.on);ui(prefix+"stopoff","set",a.stop.off);
        ui(prefix+"stopenabled","set",a.stop.enabled?1:0);ui(prefix+"stopclear","set",a.stop.clear?1:0);
        for(j=0;j<5;j++){var field=["channel","cc","on","off","enabled"][j];ui(prefix+field,"set",field==="enabled"?(a.enabled?1:0):a[field]);}
    }
}
function routeStatus(){
    var n=outputChannel();
    if(!n)return "BLOCKED: enabled rows use different MIDI channels. SYNC requires one common output channel.";
    if(!allowedPort(config.port)||portName!==config.port)return "WAITING: output "+(config.port||"select LCXL3 MIDI In")+"; current="+(portName||"unresolved")+".";
    if(channels.length&&channelIndex(n)<0)return "BLOCKED: output does not offer MIDI channel "+n+". Current="+(channelName||"unresolved")+".";
    return (pendingTest?"TEST waiting":"WAITING")+": MIDI channel "+n+"; current="+(channelName||"unresolved")+". Selecting the explicit channel used by the buttons.";
}
function getvalueof(){return "mldled1:"+encodeURIComponent(JSON.stringify(config));}
function setvalueof(v){
    try{
        if(typeof v!=="string"||v.indexOf("mldled1:")!==0)throw new Error("format");
        var c=JSON.parse(decodeURIComponent(v.slice(8)));
        if(!c||(c.version!==1&&c.version!==2)||typeof c.run!=="boolean"||!(c.port===""||allowedPort(c.port))||!Array.isArray(c.assignments)||c.assignments.length>2000)throw new Error("config");
        if(c.version===2&&(!(c.input===""||allowedInput(c.input))||!integer(c.holdMs,500,5000)))throw new Error("input / hold");
        var clean={version:2,port:c.port,input:c.version===2?c.input:"",holdMs:c.version===2?c.holdMs:1500,run:c.run,assignments:[]},seen={};
        for(var i=0;i<c.assignments.length;i++){
            var a=c.assignments[i];
            if(!a||typeof a.track!=="string"||!a.track.length||a.track.length>1024||seen[key(a.track)]||!integer(a.channel,1,16)||!integer(a.cc,-1,127)||!integer(a.on,0,127)||!integer(a.off,0,127)||typeof a.enabled!=="boolean")throw new Error("assignment");
            var st=c.version===1?stopDefaults(a.track):a.stop;
            if(!st||!integer(st.cc,-1,127)||!integer(st.on,0,127)||!integer(st.off,0,127)||typeof st.enabled!=="boolean"||typeof st.clear!=="boolean")throw new Error("stop assignment");
            seen[key(a.track)]=true;clean.assignments.push({track:a.track,channel:a.channel,cc:a.cc,on:a.on,off:a.off,enabled:a.enabled,stop:{cc:st.cc,on:st.on,off:st.off,enabled:st.enabled,clear:st.clear}});
        }
        clearAll();stop();release();config=clean;pendingType=null;pendingChannel=null;inputPendingType=null;inputPendingChannel=null;rebuild();notice="";
        if(config.run){claim();reconcileRoute();start();}tick();
    }catch(e){notice="Stored LED settings rejected; current configuration kept.";render();}
}
function loadbang(){uiCache={};renderInputMenu();render();}
function legacy(){outlet(2,"legacy");}
function notifydeleted(){clearAll();stop();release();}

// Routed MIDI input is separate from the LED output bus. Clear gestures are opt-in per row.
var inputTypes=[],inputChannels=[],inputOptions=[],inputTypeChoice=null,inputChannelChoice=null;
var inputName="",inputChannelName="",inputPendingType=null,inputPendingChannel=null,inputTypeAt=0,inputChannelAt=0;
var held={},releaseReady={},gestureSerial=0,gestureResult="",lastInput="No CC received",inputCount=0;
var midiStatus=0,midiData=[],inSysex=false;
function allowedInput(s){return typeof s==="string"&&/^LCXL3 \d+ \(MIDI Out\)$/i.test(s);}
function inputReady(){var n=outputChannel();return config.run&&ready()&&allowedInput(config.input)&&inputTypes.indexOf(config.input)>=0&&inputName===config.input&&n>0&&channelNumber(inputChannelName)===n;}
function cancelHolds(){held={};releaseReady={};midiStatus=0;midiData=[];inSysex=false;outlet(5,"cancel");}
function inputtypes(){inputTypes=arrayfromargs(arguments);renderInputMenu();refreshInput();reconcileInput();render();}
function inputchannels(){inputChannels=arrayfromargs(arguments);refreshInput();reconcileInput();render();}
function inputtype(){inputTypeChoice=selection(arguments);refreshInput();reconcileInput();render();}
function inputchannel(){inputChannelChoice=selection(arguments);refreshInput();reconcileInput();render();}
function refreshInput(){
    var old=inputName+"/"+inputChannelName;
    inputName=resolve(inputTypeChoice,inputTypes);inputChannelName=resolve(inputChannelChoice,inputChannels);
    if(old!==inputName+"/"+inputChannelName)cancelHolds();
}
function renderInputMenu(){
    inputOptions=[];delete uiCache["setupInput/set"];ui("setupInput","clear");ui("setupInput","append","Select LCXL3 MIDI Out input");
    for(var i=0;i<inputTypes.length;i++)if(allowedInput(inputTypes[i])){inputOptions.push(String(inputTypes[i]));ui("setupInput","append",String(inputTypes[i]));}
}
function choose_input(n){
    n=Number(n);if(!integer(n,0,inputOptions.length))return;
    cancelHolds();config.input=n?inputOptions[n-1]:"";inputPendingType=null;inputPendingChannel=null;
    changed();reconcileInput();render();
}
function reconcileInput(){
    if(!config.run||!allowedInput(config.input))return;
    var i;
    if(inputName!==config.input){
        for(i=0;i<inputTypes.length;i++)if(inputTypes[i]===config.input){
            if(inputPendingType!==i||Date.now()-inputTypeAt>=1000){inputPendingType=i;inputTypeAt=Date.now();outlet(4,"type",i);}return;
        }return;
    }
    var n=outputChannel();
    if(n>0&&channelNumber(inputChannelName)!==n)for(i=0;i<inputChannels.length;i++)if(channelNumber(inputChannels[i])===n){
        if(inputPendingChannel!==i||Date.now()-inputChannelAt>=1000){inputPendingChannel=i;inputChannelAt=Date.now();outlet(4,"channel",i);}return;
    }
}
function renderInputStatus(){
    var index=0;for(var i=0;i<inputOptions.length;i++)if(inputOptions[i]===config.input)index=i+1;
    ui("setupInput","set",index);
    ui("inputStatus","set",(inputReady()?"INPUT READY ch"+outputChannel():"INPUT NOT ARMED: "+(inputName||"select input")+" / "+(inputChannelName||"unresolved"))+" | "+inputCount+" CC | "+lastInput+(gestureResult?" | "+gestureResult:""));
}
function holdseconds(n){
    n=Number(n);var ms=Math.round(n*1000);if(!integer(ms,500,5000))return;
    cancelHolds();config.holdMs=ms;changed();render();
}
function stopedit(slot,field,value){
    slot=Number(slot);value=Number(value);if(!integer(slot,0,pageSize-1))return;
    var track=items[page*pageSize+slot];if(track===undefined)return;
    var limits={cc:[-1,127],on:[0,127],off:[0,127],enabled:[0,1],clear:[0,1]};
    if(!Object.prototype.hasOwnProperty.call(limits,field)||!integer(value,limits[field][0],limits[field][1]))return;
    var a=assignment(track);if(!a&&config.assignments.length>=2000)return;
    clearAll();if(!a){a=defaults(track);config.assignments.push(a);}
    a.stop[field]=(field==="enabled"||field==="clear")?value===1:value;
    notice="";gestureResult="";changed();tick();
}
function stopStatus(track){
    var a=assignment(track),g=groups[key(track)]||[];
    if(!a||!stopComplete(a))return "STOP CC unassigned";
    if(collision(a,"stop"))return "CONFLICT: Stop CC in use";
    if(!a.stop.enabled)return "Stop LED / Hold disabled";
    if(g.length!==1)return g.length?"AMBIGUOUS":"MISSING";
    var bs=fresh()?bufferState(g[0]):"unknown";
    var s=bs==="empty"?"EMPTY: On colour":bs==="recorded"?"RECORDED: Off colour":bs==="recording"?"RECORDING: Off colour":"BUFFER UNKNOWN: Off colour";
    if(!a.stop.clear)return s+" / Hold off";
    if(a.stop.on===a.stop.off)return s+" / HOLD BLOCKED: On=Off";
    if(!g[0].clear_available)return s+" / Clear API unavailable";
    var h=held[key(track)];
    return s+(h&&!h.fired?" / HOLD "+Math.min(config.holdMs,Date.now()-h.start)+"ms":!inputReady()?" / input not armed":!releaseReady[key(track)]?" / release Stop to arm":" / Hold ready");
}
function midi_byte(v){
    v=Number(v);if(!integer(v,0,255))return;
    if(!inputReady()){midiStatus=0;midiData=[];inSysex=false;return;}
    if(v>=248)return; // MIDI clock / real-time bytes may occur inside another message.
    if(v===240){inSysex=true;midiStatus=0;midiData=[];return;}
    if(v===247){inSysex=false;midiStatus=0;midiData=[];return;}
    if(inSysex)return;
    if(v>=128){midiStatus=v<240?v:0;midiData=[];return;}
    if(!midiStatus)return;
    midiData.push(v);
    var kind=midiStatus&240,needed=kind===192||kind===208?1:2;
    if(midiData.length===needed){
        if(kind===176)inputCC((midiStatus&15)+1,midiData[0],midiData[1]);
        midiData=[];
    }
}
function inputCC(rawChannel,cc,value){
    if(!inputReady())return;
    // Live may normalize input bytes to channel 1. The confirmed DeviceIO input filter is authoritative.
    if(rawChannel!==1&&rawChannel!==channelNumber(inputChannelName))return;
    inputCount++;lastInput="CC"+cc+"="+value;
    for(var i=0;i<config.assignments.length;i++){
        var a=config.assignments[i],st=a.stop;if(!st.enabled||!st.clear||!stopComplete(a)||collision(a,"stop")||st.on===st.off||a.channel!==outputChannel()||st.cc!==cc)continue;
        var k=key(a.track);
        if(value===st.off){delete held[k];releaseReady[k]=true;continue;}
        if(value!==st.on||held[k])continue;
        if(!releaseReady[k]){gestureResult="Release Stop before starting a hold";continue;}
        releaseReady[k]=false;
        var g=groups[k]||[];
        if(!fresh()||g.length!==1||!validRow(g[0])||!g[0].clear_available){gestureResult="Hold blocked: Looper unavailable / Clear API missing";continue;}
        held[k]={start:Date.now(),fired:false,id:g[0].id,generation:g[0].generation,track:a.track,cc:cc,channel:a.channel};
        gestureResult="Holding Stop: "+a.track;
    }render();
}
function checkHolds(){
    for(var k in held)if(Object.prototype.hasOwnProperty.call(held,k)){
        var h=held[k];if(h.fired)continue;
        var a=assignment(h.track),g=groups[k]||[];
        if(!inputReady()||!fresh()||Date.now()-received>500||!a||!a.stop.enabled||!a.stop.clear||collision(a,"stop")||g.length!==1||g[0].id!==h.id||g[0].generation!==h.generation){h.fired=true;gestureResult="Hold cancelled: input / target changed";continue;}
        if(Date.now()-h.start<config.holdMs)continue;
        h.fired=true; // Exactly one attempt at threshold; never retrigger while the button remains down.
        if(g[0].state!=="STOP"||!g[0].available||g[0].active===0||!g[0].clear_available){gestureResult="Clear skipped: Looper must already be stopped";continue;}
        h.token="hold-"+(++gestureSerial)+"-"+Date.now();gestureResult="Clear requested: "+h.track;
        var request=JSON.stringify({token:h.token,id:h.id,generation:h.generation,track:h.track,at:Date.now()});
        outlet(5,"authorize",request);outlet(6,"request",request);
    }
}
function clear_result(){
    try{var r=JSON.parse(textArgs(arguments));for(var k in held)if(held[k].token===r.token){gestureResult=String(r.message);render();return;}}catch(e){}
}
