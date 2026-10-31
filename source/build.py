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

def build():
    p=patch([100,100,940,650],1)
    p.update({"devicewidth":580.0,"amxdtype":1633771873,"description":"Automatic read-only dashboard for every built-in Looper in the Live Set."})
    box(p,"title","comment",[20,10,650,25],"MULTI LOOPER  /  AUTO DASHBOARD  /  0.3 beta",fontsize=18.0,presentation=1,presentation_rect=[12,8,560,24])
    box(p,"note","comment",[20,45,800,35],"Automatically finds all Loopers.",presentation=1,presentation_rect=[12,36,560,36])
    for ident,label,x,w in [("open","OPEN DASHBOARD",12,160),("scan","RESCAN",184,90),("report","EXPORT REPORT",286,150)]:
        box(p,ident,"textbutton",[x,100,w,30],numinlets=1,numoutlets=3,outlettype=["","int",""],text=label,texton=label,
            mode=0,parameter_enable=0,presentation=1,presentation_rect=[x,80,w,32])
    box(p,"warning","comment",[20,150,800,38],"Estimated timing follows transport. Read only.",presentation=1,presentation_rect=[12,122,560,40])
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
    wire(p,"this",0,"init");wire(p,"init",0,"defer")
    wire(p,"open",0,"trig");wire(p,"trig",1,"openmsg");wire(p,"openmsg",0,"pc");wire(p,"pc",0,"window");wire(p,"trig",0,"front");wire(p,"front",0,"window")
    wire(p,"scan",0,"scanmsg");wire(p,"scanmsg",0,"defer")
    wire(p,"report",0,"dlg");wire(p,"dlg",0,"export");wire(p,"export",0,"defer")
    wire(p,"defer",0,"js");wire(p,"js",0,"window");wire(p,"window",0,"ui_route");wire(p,"ui_route",0,"dlg");wire(p,"ui_route",1,"defer")
    wire(p,"audioin",0,"audioout",0);wire(p,"audioin",1,"audioout",1)
    p["dependency_cache"]=[{"name":"mld2_core.js","type":"TEXT","implicit":1},{"name":"mld2_ui.js","type":"TEXT","implicit":1}]
    return {"patcher":p}

def chunk(tag,data):return tag+struct.pack("<I",len(data))+data

if __name__=="__main__":
    source=build();raw=(json.dumps(source,ensure_ascii=False,indent=2)+"\n").encode("utf-8")
    (ROOT/"source"/"MultiLooperDashboard.maxpat").write_bytes(raw)
    device=chunk(b"ampf",b"aaaa")+chunk(b"meta",b"\x00"*4)+chunk(b"ptch",raw+b"\x00")
    (ROOT/"MultiLooperDashboard.amxd").write_bytes(device)
    print("Built Audio Effect AMXD:",len(device),"bytes; adjacent JS dependencies")
