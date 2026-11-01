// Optional macOS read-only diagnostic: subscribes to LCXL3 input; never sends MIDI.
import Foundation
import CoreMIDI
func name(_ endpoint: MIDIObjectRef)->String {
    var ref: Unmanaged<CFString>?
    if MIDIObjectGetStringProperty(endpoint,kMIDIPropertyDisplayName,&ref)==noErr,let value=ref{return value.takeRetainedValue() as String}
    return "unknown"
}
let requested=Double(CommandLine.arguments.dropFirst().first ?? "0") ?? 0
let duration=requested.isFinite ? min(max(requested,0),120) : 0
let sources=(0..<MIDIGetNumberOfSources()).map{MIDIGetSource($0)}
for source in sources { print("SOURCE: \(name(source))") }
if duration>0 {
    var client=MIDIClientRef(), port=MIDIPortRef()
    let created=MIDIClientCreate("MLD passive diagnostics" as CFString,nil,nil,&client)
    guard created==noErr else { print("MIDI client failed: \(created)");exit(1) }
    let input=MIDIInputPortCreateWithBlock(client,"MLD read only" as CFString,&port){list,_ in
        do {
            guard let offset=MemoryLayout<MIDIPacketList>.offset(of: \.packet) else {return}
            var packet=UnsafeRawPointer(list).advanced(by:offset).assumingMemoryBound(to:MIDIPacket.self)
            for _ in 0..<list.pointee.numPackets {
                let data=withUnsafeBytes(of:packet.pointee.data){Array($0.prefix(Int(packet.pointee.length)))}
                print(String(format:"%.3f",Date().timeIntervalSince1970)+" RX "+data.map{String(format:"%02X",$0)}.joined(separator:" "))
                fflush(stdout)
                packet=UnsafePointer(MIDIPacketNext(packet))
            }
        }
    }
    guard input==noErr else {print("MIDI input failed: \(input)");exit(1)}
    var count=0
    for source in sources {
        let label=name(source),lower=label.lowercased()
        if lower.contains("lcxl3") && lower.contains("midi out") && !lower.contains("daw") && !lower.contains("din") {
            let status=MIDIPortConnectSource(port,source,nil)
            print("LISTEN: \(label), status \(status)");if status==noErr {count+=1}
        }
    }
    print("Read-only listeners: \(count), seconds: \(duration)");fflush(stdout)
    RunLoop.current.run(until:Date(timeIntervalSinceNow:duration))
    MIDIPortDispose(port);MIDIClientDispose(client)
}
