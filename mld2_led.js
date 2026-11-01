/* Experimental LCXL3 LED feedback. ES5. No LiveAPI, MIDI input, mode switching or mapping writes. */
autowatch=1;inlets=1;outlets=8;
var armed=false,following=false,portName="",channelName="",latest=null,received=0;
var lastColour=null,lastSent=0,watchdog=null,lastStatus="";
var typeNames=[],channelNames=[],typeChoice=null,channelChoice=null;
var colours={STOP:1,PLAY:21,RECORD:5,OVERDUB:9};
var ledProtocol=0, rgbColours={0:[0,0,0],1:[32,32,32],21:[0,127,0],5:[127,0,0],9:[127,40,0]};
var onValue=127,offValue=0;
var followState=null,phaseStarted=0;
var setupOwned=false;
function argsText(args){return arrayfromargs(args).join(" ");}
function status(s){if(s!==lastStatus){lastStatus=s;outlet(1,"set",s);}}
function dawPort(){
    // These are the DAW output aliases in the user's Live MIDI settings.
    return /^LCXL3 1 \(DAW In\)$/i.test(portName)||/^Launch_Control_XL_3 Output \(LCXL3 1(?: \(DAW In\))?\)$/i.test(portName);
}
function midiPort(){return /^LCXL3 1 \(MIDI In\)$/i.test(portName);}
function validPort(){return ledProtocol===2?midiPort():dawPort()||(ledProtocol===1&&midiPort());}
function protocol(n){
    n=Number(n);if(n!==0&&n!==1&&n!==2)return;
    if(armed){outlet(5,"set",ledProtocol);status("Disable LED OUTPUT before changing protocol.");return;}
    ledProtocol=n;reset();outlet(5,"set",ledProtocol);show();
}
function validChannel(){return (ledProtocol===2?/^(?:15|Ch\.?\s*15|Channel\s+15)$/i:/^(?:1|Ch\.?\s*1|Channel\s+1)$/i).test(channelName);}
function onvalue(n){n=Number(n);if(isFinite(n)&&Math.floor(n)===n&&n>=0&&n<=127){onValue=n;if(ledProtocol===2)show();}}
function offvalue(n){n=Number(n);if(isFinite(n)&&Math.floor(n)===n&&n>=0&&n<=127){offValue=n;if(ledProtocol===2)show();}}
function ready(){return validPort()&&validChannel();}
function sendColour(colour,force){
    if(!ready())return false;
    var now=Date.now();if(!force&&colour===lastColour&&now-lastSent<(ledProtocol===2?100:500))return true;
    // DAW LED address 37 is upper fader-button row, first from left.
    // Custom feedback uses the existing assignment and its Components On/Off values.
    // It does not use DAW palette indices. Follow sends only the same On/Off values.
    var packet;
    if(ledProtocol===2){
        if(colour!==0&&colour!==1)return false;
        packet=[190,37,colour===1?onValue:offValue];
    }else if(ledProtocol===1){
        var rgb=rgbColours[colour];if(!rgb)return false;
        // Novation RGB LED command only: no mode/template/configuration writes.
        packet=[240,0,32,41,2,21,1,83,37,rgb[0],rgb[1],rgb[2],247];
    }else packet=[176,37,colour];
    emitPacket(packet);lastColour=colour;lastSent=now;return true;
}
function emitPacket(packet){outlet(0,packet);}
function setup_claim(n){
    if(Number(n)===1){arm(0);outlet(7,"set",0);setupOwned=true;}
    else setupOwned=false;
}
function setup_midi(statusByte,cc,value){
    if(!setupOwned||!/^LCXL3 \d+ \(MIDI In\)$/i.test(portName))return;
    var p=[statusByte,cc,value];
    for(var i=0;i<3;i++)if(typeof p[i]!=="number"||!isFinite(p[i])||Math.floor(p[i])!==p[i])return;
    if(statusByte<176||statusByte>191||cc<0||cc>127||value<0||value>127)return;
    var channel=/^(?:(?:Ch\.?|Channel)\s*)?(\d{1,2})$/i.exec(channelName);
    if(!channel||Number(channel[1])!==statusByte-175)return;
    emitPacket(p);
}
function reset(){lastColour=null;lastSent=0;followState=null;phaseStarted=0;}
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
    if(ledProtocol===2){
        if(!armed){status("LED output OFF. Custom CC: select LCXL3 MIDI In / channel 15. ON="+onValue+" OFF="+offValue+".");return;}
        if(!ready()){status("BLOCKED: Custom CC requires LCXL3 1 (MIDI In) / channel 15. Output="+(portName||"unresolved")+", channel="+(channelName||"unresolved")+".");return;}
        if(following){update();return;}
        status("ARMED CUSTOM CC: TEST ON / TEST OFF, or enable FOLLOW A. Values "+onValue+" / "+offValue+" from Components.");return;
    }
    if(!armed){status("LED output OFF. "+(ledProtocol===1?"RGB SysEx: select LCXL3 DAW In or MIDI In; keep FOLLOW off.":"Palette CC: select LCXL3 DAW In and channel 1."));return;}
    if(!ready()){status("BLOCKED: output="+(portName||"unresolved")+", channel="+(channelName||"unresolved")+". "+(ledProtocol===1?"RGB allows LCXL3 DAW In or MIDI In / channel 1.":"Palette requires LCXL3 DAW In / channel 1."));return;}
    if(ledProtocol===1){
        status(following?"RGB TEST BLOCKED: turn FOLLOW A off. RGB is manual-only until hardware is validated.":"ARMED RGB: manual colour test on "+portName+". Remain in Custom Mode 2.");return;
    }
    if(!following){status("ARMED: test WHITE / GREEN / RED / ORANGE. Then enable FOLLOW A. Custom Mode 2 is experimental.");return;}
    update();
}
function startWatchdog(){if(!watchdog){watchdog=new Task(check,this);watchdog.interval=ledProtocol===2?25:500;watchdog.repeat();}}
function arm(n){
    var next=Number(n)===1;
    if(next&&setupOwned)outlet(6,"suspend");
    if(!next&&armed&&lastColour!==null)sendColour(0,true);
    armed=next;reset();if(armed)startWatchdog();else if(watchdog){watchdog.cancel();watchdog.freepeer();watchdog=null;}
    show();
}
function follow(n){
    var next=Number(n)===1;
    if(ledProtocol===2&&following&&!next&&armed&&ready())sendColour(0,true);
    if(ledProtocol===0||next!==following){followState=null;phaseStarted=0;if(next){lastColour=null;lastSent=0;}}
    following=next;show();
}
function testcolour(name){
    name=String(name).toUpperCase();var palette={WHITE:1,GREEN:21,RED:5,ORANGE:9};
    if(!armed||!ready()){show();return;}
    if(ledProtocol===2){status("Custom CC uses TEST ON / TEST OFF and the colours configured in Components.");return;}
    if(following){status("Disable FOLLOW A before testing a colour.");return;}
    if(palette[name]===undefined)return;
    sendColour(palette[name],true);
    status(ledProtocol===1?"TEST RGB "+name+" submitted to "+portName+" / LED 37 (13 SysEx bytes). Check the physical LED.":"TEST "+name+" sent to DAW LED 37. Check the physical button in Custom Mode 2.");
}
function testvalue(name){
    name=String(name).toUpperCase();
    if(ledProtocol!==2){status("Select Custom CC15/37 - ON/OFF with LED OUTPUT off first.");return;}
    if(!armed||!ready()){show();return;}
    if(following){status("Disable FOLLOW A before testing Custom CC.");return;}
    if(name!=="ON"&&name!=="OFF")return;
    var isOn=name==="ON";
    sendColour(isOn?1:0,true);
    status("TEST CUSTOM "+name+": CC37 = "+(isOn?onValue:offValue)+" submitted to "+portName+" / channel 15. Check the physical LED.");
}
function snapshot(){
    try{latest=JSON.parse(argsText(arguments));received=Date.now();if(armed&&following)update();}
    catch(e){latest=null;received=0;if(armed&&following)update();}
}
function update(){
    if(!armed||!following||!ready()||ledProtocol===1)return;
    if(!latest||Date.now()-received>1500){unavailable("dashboard data unavailable / stale");return;}
    var matches=[],rows=latest.rows||[];
    for(var i=0;i<rows.length;i++)if(rows[i].track==="Looper A")matches.push(rows[i]);
    if(matches.length!==1){unavailable("expected exactly one Looper on track Looper A; found "+matches.length);return;}
    var row=matches[0],colour=colours[row.state];
    if(!row.available||row.active===0||colour===undefined){unavailable("Looper A unavailable / off / unknown state");return;}
    if(ledProtocol===2){
        var now=Date.now();
        if(followState!==row.state){followState=row.state;phaseStarted=now;lastColour=null;}
        var halfPeriod=row.state==="RECORD"?500:row.state==="OVERDUB"?125:0;
        var on=row.state!=="STOP"&&(!halfPeriod||Math.floor(Math.max(0,now-phaseStarted)/halfPeriod)%2===0);
        sendColour(on?1:0,false);
        status("FOLLOW CUSTOM Looper A: "+row.state+" / "+(halfPeriod?(row.state==="RECORD"?"slow blink 1 Hz":"fast blink 4 Hz"):(on?"On colour":"Off colour"))+" / MIDI In ch15 CC37.");return;
    }
    sendColour(colour,false);status("FOLLOW Looper A: "+row.state+" -> LED 37. Hardware / Custom Mode 2 not yet validated.");
}
function unavailable(reason){followState=null;phaseStarted=0;sendColour(0,false);status("FOLLOW: "+reason+". "+(ledProtocol===2?"Components Off colour.":"LED off."));}
function check(){if(armed&&following)update();}
function notifydeleted(){
    if(armed&&lastColour!==null)sendColour(0,true);
    armed=false;if(watchdog){watchdog.cancel();watchdog.freepeer();watchdog=null;}
}
