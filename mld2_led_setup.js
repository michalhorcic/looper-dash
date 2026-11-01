/* LCXL3 Custom Mode CC setup. ES5. No LiveAPI or MIDI input. */
autowatch=1;inlets=1;outlets=4;
var config={version:1,port:"",run:false,assignments:[]};
var latest=null,received=0,rows=[],groups={},items=[],page=0,pageSize=8;
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
        var a=config.assignments[i];if(!a.enabled||!complete(a))continue;
        if(channel&&channel!==a.channel)return 0;
        channel=a.channel;
    }return channel||15;
}
function channelIndex(n){for(var i=0;i<channels.length;i++)if(channelNumber(channels[i])===n)return i;return -1;}
function key(s){return "$"+s;}
function assignment(track){for(var i=0;i<config.assignments.length;i++)if(config.assignments[i].track===track)return config.assignments[i];return null;}
function defaults(track){return {track:track,channel:15,cc:-1,on:127,off:0,enabled:false};}
function complete(a){return a&&integer(a.channel,1,16)&&integer(a.cc,0,127)&&integer(a.on,0,127)&&integer(a.off,0,127);}
function collision(a){
    if(!complete(a))return false;
    for(var i=0;i<config.assignments.length;i++){
        var b=config.assignments[i];if(b.track!==a.track&&b.enabled&&complete(b)&&a.channel===b.channel&&a.cc===b.cc)return true;
    }return false;
}
function ready(){var n=outputChannel();return active&&allowedPort(config.port)&&portName===config.port&&n>0&&channelNumber(channelName)===n;}
function fresh(){return latest&&Date.now()-received<=1500;}
function validRow(row){return row&&row.available&&row.active!==0&&/^(STOP|PLAY|RECORD|OVERDUB)$/.test(row.state);}
function claim(){if(!active){active=true;outlet(3,1);}}
function release(){if(active){active=false;outlet(3,0);}}
function send(a,bit,force){
    if(!ready()||!complete(a)||a.channel!==channelNumber(channelName))return;
    var k=key(a.track),r=runtime[k]||(runtime[k]={state:null,start:0,bit:null,sent:0,target:null});
    var now=Date.now(),value=bit?a.on:a.off;
    if(!force&&r.bit===bit&&r.value===value&&now-r.sent<100)return;
    outlet(0,[175+a.channel,a.cc,value]);r.bit=bit;r.value=value;r.sent=now;
    r.target={channel:a.channel,cc:a.cc,off:a.off};
}
function clearAll(){
    if(ready())for(var k in runtime)if(Object.prototype.hasOwnProperty.call(runtime,k)){
        var t=runtime[k].target;if(t&&t.channel===channelNumber(channelName))outlet(0,[175+t.channel,t.cc,t.off]);
    }
    runtime={};pendingTest=null;
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
function test(slot,bit){
    slot=Number(slot);bit=Number(bit);if(!integer(slot,0,pageSize-1)||!integer(bit,0,1))return;
    var track=items[page*pageSize+slot],a=assignment(track),g=groups[key(track)]||[];
    if(config.run){notice="Turn SYNC off before manual tests.";render();return;}
    if(!complete(a)||g.length!==1||collision(a)){notice="TEST blocked: assign a unique CC to an available, unambiguous Looper row.";render();return;}
    if(manualChannel!==a.channel){clearAll();manualChannel=a.channel;pendingChannel=null;}
    pendingTest={track:track,bit:bit};notice="";claim();reconcileRoute();tick();
}
function turnpage(delta){var p=page;page=Math.max(0,Math.min(page+Number(delta),Math.max(0,Math.ceil(items.length/pageSize)-1)));if(!integer(page,0,100000))page=p;render();}
function tick(){
    if(active)reconcileRoute();
    if(pendingTest&&ready()&&!config.run){
        var t=pendingTest,ta=assignment(t.track),tg=groups[key(t.track)]||[];pendingTest=null;
        if(complete(ta)&&tg.length===1&&!collision(ta)){
            send(ta,t.bit,true);notice="TEST "+(t.bit?"ON":"OFF")+": "+t.track+" / ch"+ta.channel+" CC"+ta.cc+" = "+(t.bit?ta.on:ta.off)+".";
        }else notice="TEST cancelled: target is missing, ambiguous or conflicting.";
    }
    if(config.run&&ready()){
        var now=Date.now();
        for(var i=0;i<config.assignments.length;i++){
            var a=config.assignments[i];if(!a.enabled||!complete(a)||collision(a))continue;
            var g=groups[key(a.track)]||[],r=runtime[key(a.track)]||(runtime[key(a.track)]={state:null,start:0,bit:null,sent:0,target:null});
            var state=fresh()&&g.length===1&&validRow(g[0])?g[0].state:null;
            if(r.state!==state){r.state=state;r.start=now;r.bit=null;}
            var half=state==="RECORD"?500:state==="OVERDUB"?125:0;
            var bit=state!==null&&state!=="STOP"&&(!half||Math.floor(Math.max(0,now-r.start)/half)%2===0)?1:0;
            send(a,bit,false);
        }
    }render();
}
function ui(name,command){
    var args=arrayfromargs(arguments).slice(2),k=name+"/"+command,s=JSON.stringify(args);
    if(command!=="append"&&command!=="clear"&&uiCache[k]===s)return;
    uiCache[k]=s;outlet(1,["script","sendbox",name,command].concat(args));
}
function render(){
    var portIndex=0;for(var i=0;i<portOptions.length;i++)if(portOptions[i].name===config.port)portIndex=i+1;
    ui("setupPort","set",portIndex);ui("setupRun","set",config.run?1:0);
    ui("setupPage","set",(items.length?page+1:0)+" / "+Math.ceil(items.length/pageSize)+"   ("+items.length+" tracks)");
    var status=notice||((!config.run&&!pendingTest)?"SYNC OFF. Settings are saved with the Live Set.":!ready()?routeStatus():"SYNC ON / channel "+outputChannel()+": STOP Off / PLAY On / RECORD slow / OVERDUB fast.");
    ui("setupStatus","set",status);
    for(i=0;i<pageSize;i++){
        var track=items[page*pageSize+i],prefix="row"+i+"_",exists=track!==undefined;
        var fields=["label","channel","cc","on","off","enabled","teston","testoff","forget","status"];
        for(var j=0;j<fields.length;j++)ui(prefix+fields[j],"hidden",exists?0:1);
        if(!exists)continue;
        var a=assignment(track)||defaults(track),g=groups[key(track)]||[];
        ui(prefix+"label","set",track+" / "+(g.length===1?String(g[0].name||"Looper"):g.length?g.length+" Loopers":"not detected"));
        ui(prefix+"status","set",rowStatus(track));
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
        if(!c||c.version!==1||typeof c.run!=="boolean"||!(c.port===""||allowedPort(c.port))||!Array.isArray(c.assignments)||c.assignments.length>2000)throw new Error("config");
        var clean={version:1,port:c.port,run:c.run,assignments:[]},seen={};
        for(var i=0;i<c.assignments.length;i++){
            var a=c.assignments[i];
            if(!a||typeof a.track!=="string"||!a.track.length||a.track.length>1024||seen[key(a.track)]||!integer(a.channel,1,16)||!integer(a.cc,-1,127)||!integer(a.on,0,127)||!integer(a.off,0,127)||typeof a.enabled!=="boolean")throw new Error("assignment");
            seen[key(a.track)]=true;clean.assignments.push({track:a.track,channel:a.channel,cc:a.cc,on:a.on,off:a.off,enabled:a.enabled});
        }
        clearAll();stop();release();config=clean;pendingType=null;pendingChannel=null;rebuild();notice="";
        if(config.run){claim();reconcileRoute();start();}tick();
    }catch(e){notice="Stored LED settings rejected; current configuration kept.";render();}
}
function loadbang(){uiCache={};render();}
function legacy(){outlet(2,"legacy");}
function notifydeleted(){clearAll();stop();release();}
