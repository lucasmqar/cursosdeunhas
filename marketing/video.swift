// Gera vídeo MP4 (zoom lento) a partir de uma arte PNG + narração MP3.
// Uso: swift marketing/video.swift <arte.png> <narracao.mp3> <saida.mp4>
import AVFoundation
import AppKit

let a = CommandLine.arguments
let img = NSImage(contentsOfFile: a[1])!.cgImage(forProposedRect: nil, context: nil, hints: nil)!
let W = img.width, H = img.height
let audio = AVURLAsset(url: URL(fileURLWithPath: a[2]))
let dur = CMTimeGetSeconds(audio.duration) + 1.0
let tmp = URL(fileURLWithPath: a[3] + ".tmp.mov")
try? FileManager.default.removeItem(at: tmp)
let w = try! AVAssetWriter(outputURL: tmp, fileType: .mov)
let inp = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: W, AVVideoHeightKey: H,
    AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 2_500_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel]])
let ad = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: inp, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
    kCVPixelBufferWidthKey as String: W, kCVPixelBufferHeightKey as String: H])
w.add(inp); w.startWriting(); w.startSession(atSourceTime: .zero)
let fps = 30, n = Int(dur * Double(fps))
for i in 0..<n {
    while !inp.isReadyForMoreMediaData { usleep(1000) }
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, ad.pixelBufferPool!, &pb)
    CVPixelBufferLockBaseAddress(pb!, [])
    let ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb!), width: W, height: H, bitsPerComponent: 8,
                        bytesPerRow: CVPixelBufferGetBytesPerRow(pb!), space: CGColorSpaceCreateDeviceRGB(),
                        bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
    let z = 1.0 + 0.07 * Double(i) / Double(n)
    let dw = Double(W) * z, dh = Double(H) * z
    ctx.draw(img, in: CGRect(x: (Double(W) - dw) / 2, y: (Double(H) - dh) / 2, width: dw, height: dh))
    CVPixelBufferUnlockBaseAddress(pb!, [])
    ad.append(pb!, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: CMTimeScale(fps)))
}
inp.markAsFinished()
let sem = DispatchSemaphore(value: 0)
w.finishWriting { sem.signal() }; sem.wait()

let comp = AVMutableComposition()
let v = AVURLAsset(url: tmp)
let vt = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
try! vt.insertTimeRange(CMTimeRange(start: .zero, duration: v.duration), of: v.tracks(withMediaType: .video)[0], at: .zero)
let at = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
try! at.insertTimeRange(CMTimeRange(start: .zero, duration: audio.duration), of: audio.tracks(withMediaType: .audio)[0],
                        at: CMTime(value: 4, timescale: 10))
let out = URL(fileURLWithPath: a[3])
try? FileManager.default.removeItem(at: out)
let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetPassthrough)!
ex.outputURL = out; ex.outputFileType = .mp4
ex.exportAsynchronously { sem.signal() }; sem.wait()
try? FileManager.default.removeItem(at: tmp)
print(ex.status == .completed ? "ok \(a[3]) \(Int(dur))s" : "erro \(String(describing: ex.error))")
