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

def build_led_panel():
    p=patch([140,120,580,300],1)
    box(p,"in","inlet",[20,950,25,25])
    box(p,"commands","newobj",[70,950,95,22],"route front init")
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
    box(p,"led","newobj",[20,830,150,22],"js mld2_led.js",numinlets=1,numoutlets=6,outlettype=["","","","","",""])
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
    wire(p,"commands",2,"led");wire(p,"led",0,"ledbytes");wire(p,"ledbytes",0,"ledout");wire(p,"led",1,"ledstatus")
    wire(p,"led",2,"ledport");wire(p,"led",3,"ledchannel");wire(p,"led",4,"ledrouting")
    for item in p["boxes"]:
        b=item["box"]
        if "presentation_rect" in b:b["presentation_rect"][1]-=154
    box(p,"hint","comment",[20,1000,550,44],"Custom CC: MIDI In / channel 15 / CC37. Match On/Off values to Components; colours come from the Custom Mode. Keep FOLLOW off. Palette/RGB use channel 1 and the colour buttons above.",fontsize=11.0,presentation=1,presentation_rect=[12,242,556,48])
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
    return p

def build():
    p=patch([100,100,940,650],1)
    p.update({"devicewidth":580.0,"amxdtype":1633771873,"description":"Read-only Live monitoring with optional experimental LCXL3 LED feedback."})
    box(p,"title","comment",[20,10,650,25],"MULTI LOOPER  /  AUTO DASHBOARD  /  0.10 beta",fontsize=18.0,presentation=1,presentation_rect=[12,8,560,24])
    box(p,"note","comment",[20,45,800,35],"Automatically finds all Loopers.",presentation=1,presentation_rect=[12,36,560,36])
    for ident,label,x,w in [("open","OPEN DASHBOARD",12,160),("scan","RESCAN",184,90),("report","EXPORT REPORT",286,150),("ledopen","LED TEST",448,120)]:
        box(p,ident,"textbutton",[x,100,w,30],numinlets=1,numoutlets=3,outlettype=["","int",""],text=label,texton=label,
            mode=0,parameter_enable=0,presentation=1,presentation_rect=[x,80,w,32])
    box(p,"warning","comment",[20,150,800,38],"Transport reference. Live API read only. Optional LED test.",presentation=1,presentation_rect=[12,122,560,40])
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
    wire(p,"init",0,"ledwindow");wire(p,"js",0,"ledwindow")
    wire(p,"this",0,"init");wire(p,"init",0,"defer")
    wire(p,"open",0,"trig");wire(p,"trig",1,"openmsg");wire(p,"openmsg",0,"pc");wire(p,"pc",0,"window");wire(p,"trig",0,"front");wire(p,"front",0,"window")
    wire(p,"scan",0,"scanmsg");wire(p,"scanmsg",0,"defer")
    wire(p,"report",0,"dlg");wire(p,"dlg",0,"export");wire(p,"export",0,"defer")
    wire(p,"defer",0,"js");wire(p,"js",0,"window");wire(p,"window",0,"ui_route");wire(p,"ui_route",0,"dlg");wire(p,"ui_route",1,"defer")
    wire(p,"audioin",0,"audioout",0);wire(p,"audioin",1,"audioout",1)
    p["dependency_cache"]=[{"name":"mld2_core.js","type":"TEXT","implicit":1},{"name":"mld2_ui.js","type":"TEXT","implicit":1},{"name":"mld2_led.js","type":"TEXT","implicit":1}]
    return {"patcher":p}

def chunk(tag,data):return tag+struct.pack("<I",len(data))+data

if __name__=="__main__":
    source=build();raw=(json.dumps(source,ensure_ascii=False,indent=2)+"\n").encode("utf-8")
    (ROOT/"source"/"MultiLooperDashboard.maxpat").write_bytes(raw)
    device=chunk(b"ampf",b"aaaa")+chunk(b"meta",b"\x00"*4)+chunk(b"ptch",raw+b"\x00")
    (ROOT/"MultiLooperDashboard.amxd").write_bytes(device)
    print("Built Audio Effect AMXD:",len(device),"bytes; adjacent JS dependencies")
