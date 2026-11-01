"""Build unfrozen Audio Effect AMXD; scripts are adjacent dependencies.
Chunk layout verified against Ableton/maxdevtools/maxdiff/amxd_textconv.py.
"""
import json
import struct
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def patch(rect,presentation=0):
    return {"fileversion":1,"appversion":{"major":8,"minor":6,"revision":5,"architecture":"x64","modernui":1},
            "classnamespace":"box","rect":rect,"openinpresentation":presentation,
            "default_fontname":"Arial","default_fontsize":13.0,"boxes":[],"lines":[]}

def box(p,ident,cls,rect,text=None,**kw):
    b={"id":ident,"maxclass":cls,"patching_rect":rect}
    if text is not None:b["text"]=text
    b.update(kw);p["boxes"].append({"box":b})

def wire(p,src,out,dst,inlet=0):p["lines"].append({"patchline":{"source":[src,out],"destination":[dst,inlet]}})

def build_led_setup():
    p=patch([160,100,1080,640],1)
    box(p,"in","inlet",[10,700,25,25])
    box(p,"commands","newobj",[50,700,90,22],"route front")
    box(p,"frontmsg","message",[160,700,180,22],"front, topmost 1, presentation 1")
    box(p,"window","newobj",[360,700,85,22],"thispatcher")
    box(p,"out","outlet",[470,700,25,25])
    wire(p,"in",0,"commands");wire(p,"commands",0,"frontmsg");wire(p,"frontmsg",0,"window");wire(p,"commands",1,"window")
    box(p,"title","comment",[12,12,1040,26],"LED SETUP / LCXL3 CUSTOM MODE / CC FEEDBACK",presentation=1,presentation_rect=[12,12,1040,26],fontsize=18.0)
    box(p,"setupPort","umenu",[12,46,330,24],items=["Select LCXL3 MIDI In"],varname="setupPort",parameter_enable=0,presentation=1,presentation_rect=[12,46,330,24])
    box(p,"portmsg","newobj",[12,750,150,22],"prepend choose_port");wire(p,"setupPort",0,"portmsg");wire(p,"portmsg",0,"out")
    for ident,label,x,w,command,mode in [("setupRun","SYNC",360,130,"run",1),("prev","PREV",510,60,"turnpage -1",0),("next","NEXT",580,60,"turnpage 1",0),("legacy","LED TEST",920,148,"legacy",0)]:
        box(p,ident,"textbutton",[x,46,w,26],text=label,texton=label+" ON" if mode else label,mode=mode,parameter_enable=0,varname=ident,numoutlets=3,outlettype=["int" if mode else "bang","","int"],presentation=1,presentation_rect=[x,46,w,26])
        box(p,ident+"msg","newobj" if mode else "message",[x,790,w,22],"prepend "+command if mode else command)
        wire(p,ident,0,ident+"msg");wire(p,ident+"msg",0,"out")
    box(p,"setupPage","comment",[650,48,260,22],"0 / 0",varname="setupPage",presentation=1,presentation_rect=[650,48,260,22])
    box(p,"setupStatus","comment",[12,80,1056,28],"SYNC OFF. Settings are saved with the Live Set.",varname="setupStatus",fontsize=12.0,presentation=1,presentation_rect=[12,80,1056,28])
    for label,x,w in [("TRACK / LOOPER",12,260),("CH",278,48),("CC",338,48),("ON",398,48),("OFF",458,48),("ENABLE",520,64),("STATUS",814,250)]:
        box(p,"heading"+str(x),"comment",[x,110,w,20],label,fontsize=11.0,presentation=1,presentation_rect=[x,110,w,20])
    for i in range(8):
        prefix="row"+str(i)+"_";y=136+i*54
        for field,x,w in [("label",12,260),("status",814,250)]:
            box(p,prefix+field,"comment",[x,y,w,42],"",varname=prefix+field,fontsize=12.0,presentation=1,presentation_rect=[x,y,w,42])
        for field,x,minimum,maximum in [("channel",278,1,16),("cc",338,-1,127),("on",398,0,127),("off",458,0,127)]:
            ident=prefix+field
            box(p,ident,"number",[x,y,48,26],varname=ident,minimum=minimum,maximum=maximum,parameter_enable=0,numoutlets=2,outlettype=["int","bang"],presentation=1,presentation_rect=[x,y,48,26])
            box(p,ident+"msg","newobj",[x,850+i*60,200,22],"prepend rowedit "+str(i)+" "+field)
            wire(p,ident,0,ident+"msg");wire(p,ident+"msg",0,"out")
        for field,label,x,w,mode,command in [("enabled","ON",520,64,1,"rowedit "+str(i)+" enabled"),("teston","TEST ON",596,64,0,"test "+str(i)+" 1"),("testoff","OFF",666,64,0,"test "+str(i)+" 0"),("forget","CLEAR",738,64,0,"forget "+str(i))]:
            ident=prefix+field
            box(p,ident,"textbutton",[x,y,w,26],text="OFF" if mode else label,texton="ON" if mode else label,mode=mode,varname=ident,parameter_enable=0,numoutlets=3,outlettype=["int" if mode else "bang","","int"],presentation=1,presentation_rect=[x,y,w,26])
            box(p,ident+"msg","newobj" if mode else "message",[x,880+i*60,200,22],"prepend "+command if mode else command)
            wire(p,ident,0,ident+"msg");wire(p,ident+"msg",0,"out")
    box(p,"help","comment",[12,580,1056,48],"CC -1 = unassigned. Use the channel, CC and On/Off values from Components. Test with SYNC off. STOP = Off, PLAY = On, RECORD = slow blink, OVERDUB = fast blink. SYNC requires one common MIDI channel for all enabled rows (15 for this setup). Missing assignments stay listed; CLEAR removes their settings.",fontsize=12.0,presentation=1,presentation_rect=[12,580,1056,48])
    return p

def build_led_panel():
    p=patch([140,120,580,300],1)
    box(p,"in","inlet",[20,950,25,25])
    box(p,"commands","newobj",[70,950,95,22],"route front init setupfront")
    box(p,"frontmsg","message",[190,950,170,22],"front, topmost 1, presentation 1")
    box(p,"window","newobj",[390,950,85,22],"thispatcher")
    wire(p,"in",0,"commands");wire(p,"commands",0,"frontmsg");wire(p,"frontmsg",0,"window")
    # Optional MIDI output bus: selected manually through Live's own routing UI.
    box(p,"ledtitle","comment",[20,650,550,22],"LCXL3 / LOOPER A / CUSTOM MODE 2 / LED EXPERIMENT",presentation=1,presentation_rect=[12,166,550,22],fontsize=12.0)
    box(p,"ledport","umenu",[20,680,340,22],items=["Select LCXL3 output"],parameter_enable=0,presentation=1,presentation_rect=[12,192,340,22])
    box(p,"ledchannel","umenu",[370,680,190,22],items=["Select protocol channel"],parameter_enable=0,presentation=1,presentation_rect=[364,192,204,22])
    for ident,label,x,w,mode in [("ledarm","LED OUTPUT",12,112,1),("ledfollow","FOLLOW A",130,96,1),("white","WHITE",238,72,0),("green","GREEN",316,72,0),("red","RED",394,72,0),("orange","ORANGE",472,96,0)]:
        box(p,ident,"textbutton",[x,720,w,26],text=label,texton=label+" ON" if mode else label,mode=mode,parameter_enable=0,
            numoutlets=3,outlettype=["int" if mode else "bang","","int"],presentation=1,presentation_rect=[x,224,w,26])
    box(p,"ledstatus","comment",[20,760,550,50],"LED output OFF. Select the DAW output and channel 1; enable LED OUTPUT to test.",fontsize=11.0,presentation=1,presentation_rect=[12,260,556,50])
    box(p,"led","newobj",[20,830,150,22],"js mld2_led.js",varname="ledTestEngine",numinlets=1,numoutlets=8,outlettype=[""]*8)
    box(p,"ledbytes","newobj",[20,870,40,22],"iter")
    box(p,"ledout","newobj",[20,910,65,22],"midiout")
    box(p,"ledrouting","newobj",[650,720,90,22],"live.routing",numinlets=1,numoutlets=5)
    box(p,"ledroutinginit","message",[650,650,145,22],"port midi_outputs")
    box(p,"ledroutingdefer","newobj",[650,680,65,22],"deferlow")
    for ident,command in [("ledport","choose_type"),("ledchannel","choose_channel"),("ledarm","arm"),("ledfollow","follow")]:
        box(p,ident+"msg","newobj",[220,830,170,22],"prepend "+command)
        wire(p,ident,0,ident+"msg");wire(p,ident+"msg",0,"led")
    for ident in ("white","green","red","orange"):
        box(p,ident+"msg","message",[400,830,140,22],"testcolour "+ident.upper())
        wire(p,ident,0,ident+"msg");wire(p,ident+"msg",0,"led")
    for outlet,command in [(0,"routingtype"),(1,"routingchannel"),(2,"routingtypes"),(3,"routingchannels")]:
        ident="ledrouting"+str(outlet)
        box(p,ident,"newobj",[650,760+outlet*30,180,22],"prepend "+command)
        wire(p,"ledrouting",outlet,ident);wire(p,ident,0,"led")
    wire(p,"commands",1,"ledroutinginit");wire(p,"ledroutinginit",0,"ledroutingdefer");wire(p,"ledroutingdefer",0,"ledrouting")
    wire(p,"commands",3,"led");wire(p,"led",0,"ledbytes");wire(p,"ledbytes",0,"ledout");wire(p,"led",1,"ledstatus")
    wire(p,"led",2,"ledport");wire(p,"led",3,"ledchannel");wire(p,"led",4,"ledrouting")
    for item in p["boxes"]:
        b=item["box"]
        if "presentation_rect" in b:b["presentation_rect"][1]-=154
    box(p,"hint","comment",[20,1000,550,44],"Custom CC: MIDI In / channel 15 / CC37. Match On/Off values to Components; colours come from the Custom Mode. FOLLOW: STOP Off, PLAY On, RECORD slow blink, OVERDUB fast blink. Palette/RGB use channel 1 and the colour buttons above.",fontsize=11.0,presentation=1,presentation_rect=[12,242,556,48])
    box(p,"ledprotocol","umenu",[20,1040,300,22],items=["Palette CC - DAW only",",","RGB SysEx - manual test",",","Custom CC15/37 - ON/OFF"],parameter_enable=0,presentation=1,presentation_rect=[12,164,300,22])
    box(p,"ledprotocolmsg","newobj",[340,1040,125,22],"prepend protocol")
    wire(p,"ledprotocol",0,"ledprotocolmsg");wire(p,"ledprotocolmsg",0,"led");wire(p,"led",5,"ledprotocol")
    box(p,"protocolhint","comment",[20,1080,556,22],"Change protocol with LED OUTPUT off.",fontsize=11.0,presentation=1,presentation_rect=[324,164,244,22])
    for ident,label,x in [("customon","TEST ON",12),("customoff","TEST OFF",112)]:
        box(p,ident,"textbutton",[x,1120,90,26],text=label,texton=label,mode=0,parameter_enable=0,numoutlets=3,outlettype=["bang","","int"],presentation=1,presentation_rect=[x,202,90,26])
        box(p,ident+"msg","message",[x,1160,100,22],"testvalue "+("ON" if ident=="customon" else "OFF"))
        wire(p,ident,0,ident+"msg");wire(p,ident+"msg",0,"led")
    for ident,label,x,initial in [("onvalue","On value",218,127),("offvalue","Off value",394,0)]:
        box(p,ident+"label","comment",[x,1200,78,22],label,fontsize=11.0,presentation=1,presentation_rect=[x,204,78,22])
        box(p,ident,"number",[x,1240,70,22],minimum=0,maximum=127,parameter_enable=0,numoutlets=2,outlettype=["int","bang"],presentation=1,presentation_rect=[x+80,204,70,22])
        box(p,ident+"init","newobj",[x,1280,100,22],"loadmess "+str(initial))
        box(p,ident+"msg","newobj",[x,1320,120,22],"prepend "+ident)
        wire(p,ident+"init",0,ident);wire(p,ident,0,ident+"msg");wire(p,ident+"msg",0,"led")
    box(p,"setup","newobj",[860,650,180,22],"js mld2_led_setup.js",varname="ledSetupEngine",numinlets=1,numoutlets=4,outlettype=[""]*4)
    box(p,"setupstate","newobj",[860,690,400,22],"pattr ledConfiguration @bindto ledSetupEngine @parameter_enable 1",varname="ledConfiguration",parameter_enable=1,parameter_mappable=0,
        saved_attribute_attributes={"valueof":{"parameter_longname":"LED Configuration","parameter_shortname":"LED Config","parameter_type":3,"parameter_invisible":1}})
    box(p,"setupwindow","newobj",[860,730,130,22],"p LED_Setup",patcher=build_led_setup(),numinlets=1,numoutlets=1,outlettype=[""])
    box(p,"setupmidimsg","newobj",[860,770,150,22],"prepend setup_midi")
    box(p,"setupclaimmsg","newobj",[860,810,150,22],"prepend setup_claim")
    box(p,"setuproute","newobj",[1050,770,100,22],"route legacy")
    box(p,"setuptrig","newobj",[860,850,55,22],"t b b")
    box(p,"setupopen","message",[860,890,45,22],"open")
    box(p,"setupfront","message",[940,890,45,22],"front")
    box(p,"setuppc","newobj",[860,930,65,22],"pcontrol")
    wire(p,"commands",2,"setuptrig");wire(p,"setuptrig",1,"setupopen");wire(p,"setupopen",0,"setuppc");wire(p,"setuppc",0,"setupwindow")
    wire(p,"setuptrig",0,"setupfront");wire(p,"setupfront",0,"setupwindow")
    wire(p,"commands",3,"setup");wire(p,"setupwindow",0,"setup")
    wire(p,"setup",0,"setupmidimsg");wire(p,"setupmidimsg",0,"led")
    wire(p,"setup",1,"setupwindow");wire(p,"setup",2,"setuproute");wire(p,"setuproute",1,"ledrouting")
    wire(p,"setuproute",0,"frontmsg")
    wire(p,"setup",3,"setupclaimmsg");wire(p,"setupclaimmsg",0,"led")
    wire(p,"led",6,"setup");wire(p,"led",7,"ledarm")
    for outlet in range(4):
        source="ledrouting"+str(outlet)
        for edge in p["lines"]:
            if edge["patchline"]["source"]==[source,0]:edge["patchline"]["order"]=0
        wire(p,source,0,"setup");p["lines"][-1]["patchline"]["order"]=1
    return p

def build():
    p=patch([100,100,940,650],1)
    p.update({"devicewidth":580.0,"amxdtype":1633771873,"description":"Read-only Live monitoring with optional experimental LCXL3 LED feedback."})
    box(p,"title","comment",[20,10,650,25],"MULTI LOOPER  /  AUTO DASHBOARD  /  0.12.1 beta",fontsize=18.0,presentation=1,presentation_rect=[12,8,560,24])
    box(p,"note","comment",[20,45,800,35],"Automatically finds all Loopers.",presentation=1,presentation_rect=[12,36,560,36])
    for ident,label,x,w in [("open","OPEN DASHBOARD",12,160),("scan","RESCAN",184,90),("report","EXPORT REPORT",286,150),("ledopen","LED TEST",448,120)]:
        box(p,ident,"textbutton",[x,100,w,30],numinlets=1,numoutlets=3,outlettype=["","int",""],text=label,texton=label,
            mode=0,parameter_enable=0,presentation=1,presentation_rect=[x,80,w,32])
    box(p,"warning","comment",[20,150,800,38],"Transport reference. Live API read only. Optional LED test.",presentation=1,presentation_rect=[12,122,420,40])
    box(p,"setupopen","textbutton",[448,150,120,26],text="LED SETUP",texton="LED SETUP",mode=0,parameter_enable=0,numoutlets=3,outlettype=["bang","","int"],presentation=1,presentation_rect=[448,122,120,26])
    box(p,"setupopenmsg","message",[150,650,90,22],"setupfront")
    box(p,"this","newobj",[20,220,100,22],"live.thisdevice",numinlets=1,numoutlets=3,outlettype=["bang","int","int"])
    box(p,"init","message",[20,260,40,22],"init")
    box(p,"trig","newobj",[20,300,55,22],"t b b")
    box(p,"openmsg","message",[20,340,45,22],"open")
    box(p,"front","message",[100,340,45,22],"front")
    box(p,"pc","newobj",[20,380,65,22],"pcontrol")
    box(p,"scanmsg","message",[230,220,45,22],"scan")
    box(p,"dlg","newobj",[620,220,90,22],"savedialog")
    box(p,"export","newobj",[620,260,165,22],"prepend export_report")
    box(p,"defer","newobj",[280,340,70,22],"deferlow")
    box(p,"js","newobj",[280,385,160,22],"js mld2_core.js",numinlets=1,numoutlets=1,outlettype=[""])
    box(p,"ui_route","newobj",[520,445,100,22],"route report")
    box(p,"audioin","newobj",[20,530,70,22],"plugin~",numinlets=1,numoutlets=2,outlettype=["signal","signal"])
    box(p,"audioout","newobj",[20,580,70,22],"plugout~",numinlets=2,numoutlets=0)
    sub=patch([110,90,1040,780],1)
    box(sub,"in","inlet",[20,820,25,25])
    box(sub,"route","newobj",[60,820,90,22],"route front")
    box(sub,"frontmsg","message",[170,820,220,22],"front, topmost 1, presentation 1")
    box(sub,"tp","newobj",[410,820,85,22],"thispatcher")
    box(sub,"ui","jsui",[0,0,1040,780],filename="mld2_ui.js",numinlets=1,numoutlets=1,outlettype=[""],
        presentation=1,presentation_rect=[0,0,1040,780],parameter_enable=0)
    box(sub,"out","outlet",[530,820,25,25])
    wire(sub,"in",0,"route");wire(sub,"route",0,"frontmsg");wire(sub,"frontmsg",0,"tp");wire(sub,"route",1,"ui");wire(sub,"ui",0,"out")
    box(p,"window","newobj",[280,445,130,22],"p Dashboard",patcher=sub,numinlets=1,numoutlets=1,outlettype=[""])
    box(p,"ledwindow","newobj",[20,650,150,22],"p LED_Feedback",patcher=build_led_panel(),numinlets=1,numoutlets=0)
    box(p,"ledtrig","newobj",[20,690,55,22],"t b b")
    box(p,"ledopenmsg","message",[20,730,45,22],"open")
    box(p,"ledfrontmsg","message",[100,730,45,22],"front")
    box(p,"ledpc","newobj",[20,770,65,22],"pcontrol")
    wire(p,"ledopen",0,"ledtrig");wire(p,"ledtrig",1,"ledopenmsg");wire(p,"ledopenmsg",0,"ledpc");wire(p,"ledpc",0,"ledwindow")
    wire(p,"ledtrig",0,"ledfrontmsg");wire(p,"ledfrontmsg",0,"ledwindow")
    wire(p,"setupopen",0,"setupopenmsg");wire(p,"setupopenmsg",0,"ledwindow")
    wire(p,"init",0,"ledwindow");wire(p,"js",0,"ledwindow")
    wire(p,"this",0,"init");wire(p,"init",0,"defer")
    wire(p,"open",0,"trig");wire(p,"trig",1,"openmsg");wire(p,"openmsg",0,"pc");wire(p,"pc",0,"window");wire(p,"trig",0,"front");wire(p,"front",0,"window")
    wire(p,"scan",0,"scanmsg");wire(p,"scanmsg",0,"defer")
    wire(p,"report",0,"dlg");wire(p,"dlg",0,"export");wire(p,"export",0,"defer")
    wire(p,"defer",0,"js");wire(p,"js",0,"window");wire(p,"window",0,"ui_route");wire(p,"ui_route",0,"dlg");wire(p,"ui_route",1,"defer")
    wire(p,"audioin",0,"audioout",0);wire(p,"audioin",1,"audioout",1)
    p["dependency_cache"]=[{"name":"mld2_core.js","type":"TEXT","implicit":1},{"name":"mld2_ui.js","type":"TEXT","implicit":1},{"name":"mld2_led.js","type":"TEXT","implicit":1},{"name":"mld2_led_setup.js","type":"TEXT","implicit":1}]
    return {"patcher":p}

def chunk(tag,data):return tag+struct.pack("<I",len(data))+data

if __name__=="__main__":
    source=build();raw=(json.dumps(source,ensure_ascii=False,indent=2)+"\n").encode("utf-8")
    (ROOT/"source"/"MultiLooperDashboard.maxpat").write_bytes(raw)
    device=chunk(b"ampf",b"aaaa")+chunk(b"meta",b"\x00"*4)+chunk(b"ptch",raw+b"\x00")
    (ROOT/"MultiLooperDashboard.amxd").write_bytes(device)
    print("Built Audio Effect AMXD:",len(device),"bytes; adjacent JS dependencies")
