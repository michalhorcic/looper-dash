/* Experimental LCXL3 LED feedback. ES5. No LiveAPI, MIDI input, mode switching or mapping writes. */
autowatch=1;inlets=1;outlets=5;
var armed=false,following=false,portName="",channelName="",latest=null,received=0;
var lastColour=null,lastSent=0,watchdog=null,lastStatus="";
var typeNames=[],channelNames=[],typeChoice=null,channelChoice=null;
var colours={STOP:1,PLAY:21,RECORD:5,OVERDUB:9};
function argsText(args){return arrayfromargs(args).join(" ");}
function status(s){if(s!==lastStatus){lastStatus=s;outlet(1,"set",s);}}
function validPort(){
    // These are the DAW output aliases in the user's Live MIDI settings.
    return /^LCXL3 1 \(DAW In\)$/i.test(portName)||/^Launch_Control_XL_3 Output \(LCXL3 1(?: \(DAW In\))?\)$/i.test(portName);
}
function validChannel(){return /^(?:1|Ch\.?\s*1|Channel\s+1)$/i.test(channelName);}
function ready(){return validPort()&&validChannel();}
function sendColour(colour,force){
    if(!ready())return false;
    var now=Date.now();if(!force&&colour===lastColour&&now-lastSent<500)return true;
    // DAW LED address 37 is upper fader-button row, first from left.
    // This is channel 1 on DAW In, NEVER the Custom Mode's channel 15.
    outlet(0,[176,37,colour]);lastColour=colour;lastSent=now;return true;
}
function reset(){lastColour=null;lastSent=0;}
// live.routing reports current selections as zero-based indices; tolerate names too.
function selection(args){var values=arrayfromargs(args);return values.length===1&&typeof values[0]==="number"?values[0]:values.join(" ");}
function selectionName(choice,names){
    if(typeof choice==="number")return isFinite(choice)&&choice>=0&&Math.floor(choice)===choice&&choice<names.length?String(names[choice]):"";
    return typeof choice==="string"?choice:"";
}
function refreshNames(){portName=selectionName(typeChoice,typeNames);channelName=selectionName(channelChoice,channelNames);}
function routingtypes(){
    typeNames=arrayfromargs(arguments);outlet(2,"clear");
    for(var i=0;i<typeNames.length;i++)outlet(2,"append",typeNames[i]);
    if(typeof typeChoice==="number"&&typeChoice>=0&&typeChoice<typeNames.length)outlet(2,"set",typeChoice);
    refreshNames();reset();show();
}
function routingchannels(){
    channelNames=arrayfromargs(arguments);outlet(3,"clear");
    for(var i=0;i<channelNames.length;i++)outlet(3,"append",channelNames[i]);
    if(typeof channelChoice==="number"&&channelChoice>=0&&channelChoice<channelNames.length)outlet(3,"set",channelChoice);
    refreshNames();reset();show();
}
function routingtype(){typeChoice=selection(arguments);refreshNames();reset();if(typeof typeChoice==="number")outlet(2,"set",typeChoice);show();}
function routingchannel(){channelChoice=selection(arguments);refreshNames();reset();if(typeof channelChoice==="number")outlet(3,"set",channelChoice);show();}
function choose_type(n){typeChoice=null;channelChoice=null;portName="";channelName="";channelNames=[];reset();outlet(4,"type",Number(n));show();}
function choose_channel(n){channelChoice=null;channelName="";reset();outlet(4,"channel",Number(n));show();}
function show(){
    if(!armed){status("LED output OFF. Select the LCXL3 DAW In output and channel 1.");return;}
    if(!ready()){status("BLOCKED: output="+(portName||"unresolved")+", channel="+(channelName||"unresolved")+". Choose LCXL3 DAW In / channel 1.");return;}
    if(!following){status("ARMED: test WHITE / GREEN / RED / ORANGE. Then enable FOLLOW A. Custom Mode 2 is experimental.");return;}
    update();
}
function startWatchdog(){if(!watchdog){watchdog=new Task(check,this);watchdog.interval=500;watchdog.repeat();}}
function arm(n){
    var next=Number(n)===1;
    if(!next&&armed&&lastColour!==null)sendColour(0,true);
    armed=next;reset();if(armed)startWatchdog();else if(watchdog){watchdog.cancel();watchdog.freepeer();watchdog=null;}
    show();
}
function follow(n){following=Number(n)===1;reset();show();}
function testcolour(name){
    name=String(name).toUpperCase();var palette={WHITE:1,GREEN:21,RED:5,ORANGE:9};
    if(!armed||!ready()){show();return;}
    if(following){status("Disable FOLLOW A before testing a colour.");return;}
    if(palette[name]===undefined)return;
    sendColour(palette[name],true);status("TEST "+name+" sent to DAW LED 37. Check the physical button in Custom Mode 2.");
}
function snapshot(){
    try{latest=JSON.parse(argsText(arguments));received=Date.now();if(armed&&following)update();}
    catch(e){latest=null;received=0;if(armed&&following)update();}
}
function update(){
    if(!armed||!following||!ready())return;
    if(!latest||Date.now()-received>1500){sendColour(0,false);status("FOLLOW: dashboard data unavailable / stale; LED off.");return;}
    var matches=[],rows=latest.rows||[];
    for(var i=0;i<rows.length;i++)if(rows[i].track==="Looper A")matches.push(rows[i]);
    if(matches.length!==1){sendColour(0,false);status("FOLLOW: expected exactly one Looper on track Looper A; found "+matches.length+". LED off.");return;}
    var row=matches[0],colour=colours[row.state];
    if(!row.available||row.active===0||colour===undefined){sendColour(0,false);status("FOLLOW: Looper A unavailable / off / unknown state. LED off.");return;}
    sendColour(colour,false);status("FOLLOW Looper A: "+row.state+" -> LED 37. Hardware / Custom Mode 2 not yet validated.");
}
function check(){if(armed&&following)update();}
function notifydeleted(){
    if(armed&&lastColour!==null)sendColour(0,true);
    armed=false;if(watchdog){watchdog.cancel();watchdog.freepeer();watchdog=null;}
}
