// Motion design dos anúncios: formas vetoriais animadas + legenda dinâmica + trilha + efeitos.
// Uso: motion <config.json>
// config: {"k":1,"w":1080,"h":1920,"narration":"...m4a","music":"...mp3","sfx":"dir","text":"...","out":"...mp4",
//          "keywords":["coragem",...],"endTitle":"Descubra por onde começar"}
import AVFoundation
import AppKit
import CoreText

struct Cfg: Codable { let k: Int; let w: Int; let h: Int; let narration: String; let music: String; let sfx: String
    let text: String; let out: String; let keywords: [String]; let endTitle: String }
let cfg = try! JSONDecoder().decode(Cfg.self, from: Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1])))
let W = CGFloat(cfg.w), H = CGFloat(cfg.h), SQ = cfg.h == cfg.w, U = W / 1080
func rgb(_ h: UInt32, _ a: CGFloat = 1) -> CGColor { CGColor(srgbRed: CGFloat(h >> 16 & 255) / 255, green: CGFloat(h >> 8 & 255) / 255, blue: CGFloat(h & 255) / 255, alpha: a) }
let BG = rgb(0xF6EDE8), PLUM = rgb(0x6E1F45), ROSE = rgb(0xD99BA8), GOLD = rgb(0xC9A27E), INK = rgb(0x3B2430), WHITE = rgb(0xFFFFFF)
let FAN: [UInt32] = [0xD99BA8, 0xC77D92, 0xA24E6F, 0x86325A, 0x6E1F45]

// ---------- easing ----------
func clamp(_ x: CGFloat) -> CGFloat { max(0, min(1, x)) }
func outBack(_ x: CGFloat) -> CGFloat { let c1: CGFloat = 1.9, c3 = c1 + 1, t = clamp(x) - 1; return 1 + c3 * t * t * t + c1 * t * t }
func outCubic(_ x: CGFloat) -> CGFloat { let t = 1 - clamp(x); return 1 - t * t * t }
func inOut(_ x: CGFloat) -> CGFloat { let t = clamp(x); return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2 }

// ---------- narração: trechos com voz (detecção de silêncio) ----------
let OFFSET = 0.55
func voiced(_ path: String) -> (dur: Double, spans: [(Double, Double)]) {
    let f = try! AVAudioFile(forReading: URL(fileURLWithPath: path))
    let fmt = f.processingFormat, n = AVAudioFrameCount(f.length)
    let buf = AVAudioPCMBuffer(pcmFormat: fmt, frameCapacity: n)!; try! f.read(into: buf)
    let ch = buf.floatChannelData![0], sr = fmt.sampleRate, win = Int(sr * 0.02)
    var rms: [Float] = []; var i = 0
    while i + win < Int(buf.frameLength) { var s: Float = 0; for j in i..<(i + win) { s += ch[j] * ch[j] }; rms.append(sqrt(s / Float(win))); i += win }
    let thr = (rms.max() ?? 1) * 0.06
    var spans: [(Double, Double)] = []; var start: Int? = nil; var quiet = 0
    for (idx, v) in rms.enumerated() {
        if v > thr { if start == nil { start = idx }; quiet = 0 }
        else if let s = start { quiet += 1; if quiet > 8 { spans.append((Double(s) * 0.02, Double(idx - quiet + 1) * 0.02)); start = nil; quiet = 0 } }
    }
    if let s = start { spans.append((Double(s) * 0.02, Double(rms.count) * 0.02)) }
    return (Double(f.length) / sr, spans.filter { $0.1 - $0.0 > 0.08 })
}
let (narrDur, spans) = voiced(cfg.narration)
let TOTAL = OFFSET + narrDur + 3.0
let END = OFFSET + narrDur + 0.25

// palavras → tempos proporcionais ao tamanho, só dentro dos trechos com voz
let words = cfg.text.replacingOccurrences(of: "…", with: "... ").split(separator: " ").map(String.init).filter { !$0.isEmpty }
let weights = words.map { Double($0.count) + 1.5 }
let voicedTotal = spans.reduce(0) { $0 + $1.1 - $1.0 }
func mapVoiced(_ x: Double) -> Double { var acc = 0.0; for s in spans { let l = s.1 - s.0; if acc + l >= x { return s.0 + (x - acc) }; acc += l }; return spans.last?.1 ?? 0 }
var wStart: [Double] = []; var cum = 0.0; let wSum = weights.reduce(0, +)
for w in weights { wStart.append(OFFSET + mapVoiced(cum / wSum * voicedTotal)); cum += w }
// blocos de legenda (até 3 palavras, quebra em pontuação)
struct Chunk { var words: [Int]; var t0: Double; var t1: Double; var sceneStart: Bool; var key: Bool }
var chunks: [Chunk] = []; var cur: [Int] = []; var newScene = true
func norm(_ s: String) -> String { s.lowercased().folding(options: .diacriticInsensitive, locale: nil).trimmingCharacters(in: .punctuationCharacters) }
let keys = Set(cfg.keywords.map(norm))
for (i, w) in words.enumerated() {
    cur.append(i)
    let endP = w.hasSuffix(".") || w.hasSuffix("!") || w.hasSuffix("?") || w.hasSuffix("...") || w.hasSuffix(":")
    if cur.count == 3 || endP || w.hasSuffix(",") || i == words.count - 1 {
        chunks.append(Chunk(words: cur, t0: wStart[cur[0]], t1: 0, sceneStart: newScene, key: cur.contains { keys.contains(norm(words[$0])) }))
        newScene = endP; cur = []
    }
}
for i in 0..<chunks.count { chunks[i].t1 = i + 1 < chunks.count ? chunks[i + 1].t0 : END }
let sceneTimes = chunks.filter { $0.sceneStart }.map { $0.t0 }
let keyTimes = chunks.filter { $0.key }.map { $0.t0 }

// ---------- desenho ----------
var ctx: CGContext!
func svg(_ x: CGFloat, _ y: CGFloat, _ s: CGFloat, _ rot: CGFloat = 0, _ body: () -> Void) {
    ctx.saveGState(); ctx.translateBy(x: x, y: H - y); ctx.scaleBy(x: s, y: -s); ctx.rotate(by: -rot * .pi / 180); body(); ctx.restoreGState()
}
func nail(_ fill: CGColor?, stroke: CGColor? = nil) {
    let p = CGMutablePath(); p.move(to: CGPoint(x: -22, y: 10))
    p.addCurve(to: CGPoint(x: 22, y: 10), control1: CGPoint(x: -22, y: -40), control2: CGPoint(x: 22, y: -40))
    p.addLine(to: CGPoint(x: 22, y: 34)); p.addCurve(to: CGPoint(x: -22, y: 34), control1: CGPoint(x: 22, y: 44), control2: CGPoint(x: -22, y: 44)); p.closeSubpath()
    if let f = fill { ctx.addPath(p); ctx.setFillColor(f); ctx.fillPath() }
    if let s = stroke { ctx.addPath(p); ctx.setStrokeColor(s); ctx.setLineWidth(3); ctx.strokePath() }
    let g = CGMutablePath(); g.move(to: CGPoint(x: -12, y: -14)); g.addCurve(to: CGPoint(x: 10, y: -20), control1: CGPoint(x: -8, y: -24), control2: CGPoint(x: 6, y: -26))
    ctx.addPath(g); ctx.setStrokeColor(rgb(0xFFFFFF, 0.55)); ctx.setLineWidth(3); ctx.setLineCap(.round); ctx.strokePath()
}
func sparkle(_ x: CGFloat, _ y: CGFloat, _ r: CGFloat, _ c: CGColor) {
    let p = CGMutablePath(); let Y = H - y
    p.move(to: CGPoint(x: x, y: Y + r)); p.addQuadCurve(to: CGPoint(x: x + r, y: Y), control: CGPoint(x: x, y: Y))
    p.addQuadCurve(to: CGPoint(x: x, y: Y - r), control: CGPoint(x: x, y: Y)); p.addQuadCurve(to: CGPoint(x: x - r, y: Y), control: CGPoint(x: x, y: Y))
    p.addQuadCurve(to: CGPoint(x: x, y: Y + r), control: CGPoint(x: x, y: Y)); ctx.addPath(p); ctx.setFillColor(c); ctx.fillPath()
}
func circle(_ x: CGFloat, _ y: CGFloat, _ r: CGFloat, _ c: CGColor) { ctx.setFillColor(c); ctx.fillEllipse(in: CGRect(x: x - r, y: H - y - r, width: 2 * r, height: 2 * r)) }

// símbolo de cada conceito, com entrada animada (a = 0→1) e pulso (p)
func symbol(_ k: Int, _ cx: CGFloat, _ cy: CGFloat, _ s: CGFloat, _ a: CGFloat, _ t: Double, light: Bool = false) {
    switch k {
    case 1:
        let base = cy + 40 * s
        ctx.setStrokeColor(GOLD); ctx.setLineWidth(3 * s); ctx.setLineCap(.round)
        let lw = 150 * s * outCubic(a * 1.4)
        ctx.move(to: CGPoint(x: cx - lw, y: H - base)); ctx.addLine(to: CGPoint(x: cx + lw, y: H - base)); ctx.strokePath()
        for (i, ang) in [-64, -32, 0, 32, 64].enumerated() {
            let e = outBack(a * 1.6 - CGFloat(i) * 0.12)
            if e <= 0.001 { continue }
            let rad = CGFloat(ang) * e * .pi / 180, d = 95 * s * e
            let x = cx + sin(rad) * d, y = base - cos(rad) * d
            svg(x, y, s * e, CGFloat(ang) * e) { nail(light ? rgb(FAN[i] | 0x202020) : rgb(FAN[i])) }
        }
    case 2:
        let m = outCubic(a * 1.3), mx = cx - 95 * s - (1 - m) * 300 * s
        ctx.saveGState(); ctx.addRect(CGRect(x: 0, y: 0, width: W, height: H))
        ctx.addEllipse(in: CGRect(x: mx + 25 * s - 50 * s, y: H - (cy - 95 * s) - 50 * s, width: 100 * s, height: 100 * s)); ctx.clip(using: .evenOdd)
        circle(mx, cy - 80 * s, 52 * s, GOLD); ctx.restoreGState()
        let glow = 120 * s * (1 + 0.08 * CGFloat(sin(t * 3)))
        for r in stride(from: glow, to: 0, by: -glow / 12) { circle(cx + 40 * s, cy + 20 * s, r, rgb(0xC9A27E, 0.05)) }
        let e = outBack(a * 1.5 - 0.2); if e > 0 { svg(cx + 40 * s, cy + 20 * s, 1.6 * s * e) { nail(light ? ROSE : PLUM) } }
        let tw = CGFloat(0.6 + 0.4 * sin(t * 5)); sparkle(cx + 130 * s, cy - 90 * s, 12 * s * tw * m, GOLD); sparkle(cx - 150 * s, cy + 40 * s, 8 * s * m, ROSE)
    case 3:
        let e = outBack(a * 1.4)
        ctx.setStrokeColor(ROSE); ctx.setLineWidth(2 * s); ctx.setLineDash(phase: CGFloat(t) * 20, lengths: [2 * s, 10 * s])
        ctx.addEllipse(in: CGRect(x: cx - 150 * s * e, y: H - cy - 150 * s * e, width: 300 * s * e, height: 300 * s * e)); ctx.strokePath(); ctx.setLineDash(phase: 0, lengths: [])
        if e > 0 { svg(cx, cy, 2.4 * s * e) { nail(light ? ROSE : PLUM) } }
        let tw = CGFloat(0.7 + 0.3 * sin(t * 6)); sparkle(cx + 70 * s, cy - 80 * s, 22 * s * tw * clamp(a * 2 - 0.6), GOLD); sparkle(cx + 100 * s, cy - 30 * s, 9 * s * clamp(a * 2 - 0.8), GOLD)
    default:
        for (i, dx) in [-110, 0, 110].enumerated() {
            let e = outBack(a * 1.6 - CGFloat(i) * 0.15); if e <= 0 { continue }
            let drop = (1 - e) * -200 * s
            if i == 1 { svg(cx, cy + drop, 1.9 * s) { nail(light ? ROSE : PLUM) } }
            else { svg(cx + CGFloat(dx) * s, cy + 10 * s + drop, 1.5 * s) { nail(nil, stroke: light ? WHITE : ROSE) } }
        }
        let c = clamp(a * 1.6 - 0.7)
        if c > 0 {
            let p = CGMutablePath(); p.move(to: CGPoint(x: cx - 20 * s, y: H - (cy - 120 * s)))
            p.addLine(to: CGPoint(x: cx - 6 * s, y: H - (cy - 106 * s))); p.addLine(to: CGPoint(x: cx + 22 * s, y: H - (cy - 136 * s)))
            ctx.saveGState(); ctx.addPath(p); ctx.setLineWidth(7 * s); ctx.setLineCap(.round); ctx.setLineJoin(.round)
            ctx.replacePathWithStrokedPath(); ctx.clip(to: CGRect(x: cx - 30 * s, y: 0, width: 60 * s * c, height: H)); ctx.addPath(p.copy(strokingWithWidth: 7 * s, lineCap: .round, lineJoin: .round, miterLimit: 1))
            ctx.setFillColor(GOLD); ctx.fillPath(); ctx.restoreGState()
        }
    }
}

// texto
func font(_ name: String, _ size: CGFloat) -> CTFont { CTFontCreateWithName(name as CFString, size, nil) }
func line(_ s: String, _ f: CTFont, _ c: CGColor) -> CTLine {
    CTLineCreateWithAttributedString(NSAttributedString(string: s, attributes: [.init(kCTFontAttributeName as String): f, .init(kCTForegroundColorAttributeName as String): c]))
}
func width(_ l: CTLine) -> CGFloat { CGFloat(CTLineGetTypographicBounds(l, nil, nil, nil)) }
func drawLine(_ l: CTLine, _ x: CGFloat, _ yTop: CGFloat, _ size: CGFloat) { ctx.textPosition = CGPoint(x: x, y: H - yTop - size * 0.8); CTLineDraw(l, ctx) }

// ---------- quadro ----------
let BEAT = 0.5
func frame(_ t: Double) {
    ctx.setFillColor(BG); ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
    let bp = CGFloat(exp(-(t.truncatingRemainder(dividingBy: BEAT)) / 0.11))
    // manchas suaves que respiram com a batida
    for (i, c) in [rgb(0xD99BA8, 0.22), rgb(0xC9A27E, 0.16), rgb(0x6E1F45, 0.07)].enumerated() {
        let ph = Double(i) * 2.1
        let x = W * (0.5 + 0.35 * CGFloat(sin(t * 0.35 + ph))), y = H * (0.45 + 0.3 * CGFloat(cos(t * 0.28 + ph)))
        let r = W * (0.55 + 0.04 * bp)
        for k in 0..<10 { circle(x, y, r * CGFloat(10 - k) / 10, c.copy(alpha: c.alpha / 6)!) }
    }
    // cena atual
    let sIdx = max(0, (sceneTimes.lastIndex { $0 <= t }) ?? 0), sT = sceneTimes.isEmpty ? 0 : sceneTimes[sIdx]
    let since = t - sT
    let dark = sIdx % 3 == 1 && t > OFFSET && t < END
    if dark {
        ctx.setFillColor(PLUM); ctx.fill(CGRect(x: 0, y: 0, width: W, height: H))
        for k in 0..<12 { circle(W * 0.5, H * 0.38, W * 0.9 * CGFloat(12 - k) / 12, rgb(0xA24E6F, 0.05)) }
    }
    // partículas subindo
    for p in 0..<26 {
        let seed = Double(p) * 12.9898, rx = CGFloat((sin(seed) * 43758.5453).truncatingRemainder(dividingBy: 1)).magnitude
        let speed = 40 + 60 * rx, yy = (Double(H) + 100 - (t * Double(speed * U) + Double(rx) * Double(H) * 3).truncatingRemainder(dividingBy: Double(H) + 200))
        let xx = W * CGFloat((rx * 7.31).truncatingRemainder(dividingBy: 1)) + CGFloat(sin(t + seed)) * 20 * U
        if p % 3 == 0 { sparkle(xx, CGFloat(yy), (6 + 8 * rx) * U, dark ? rgb(0xF6EDE8, 0.5) : rgb(0xC9A27E, 0.55)) }
        else { circle(xx, CGFloat(yy), (2 + 4 * rx) * U, dark ? rgb(0xF6EDE8, 0.25) : rgb(0xD99BA8, 0.4)) }
    }
    // palavra de impacto gigante ao fundo
    if let kc = chunks.last(where: { $0.key && $0.t0 <= t }), t - kc.t0 < 1.4, t < END {
        let kw = kc.words.map { words[$0] }.first { keys.contains(norm($0)) } ?? ""
        let e = CGFloat((t - kc.t0) / 1.4), big = (SQ ? 200 : 250) * U * (0.9 + 0.25 * outCubic(e))
        let l = line(norm(kw).uppercased(), font("Georgia-BoldItalic", big), dark ? rgb(0xF6EDE8, 0.16 * (1 - e)) : rgb(0x6E1F45, 0.13 * (1 - e)))
        let wd = width(l), sc = min(1, W * 0.95 / wd)
        ctx.saveGState(); ctx.translateBy(x: W / 2, y: H - H * 0.44); ctx.scaleBy(x: sc, y: sc); ctx.translateBy(x: -W / 2, y: -(H - H * 0.44))
        drawLine(l, (W - wd) / 2, H * 0.44 - big * 0.5, big); ctx.restoreGState()
    }
    let punch = 1 + 0.18 * CGFloat(exp(-since / 0.09)) * (t > OFFSET ? 1 : 0)
    let lastKey = keyTimes.last { $0 <= t } ?? -9, sinceKey = t - lastKey
    let shake = sinceKey < 0.3 ? CGFloat(sin(t * 90)) * 14 * U * CGFloat(1 - sinceKey / 0.3) : 0
    ctx.saveGState(); ctx.translateBy(x: shake, y: shake * 0.6)
    // símbolo: layout muda a cada cena
    let a = CGFloat(min(t / 1.0, 1)) // entrada inicial
    let layouts: [(CGFloat, CGFloat, CGFloat)] = SQ ? [(0.5, 0.30, 1.15), (0.5, 0.28, 1.35), (0.5, 0.31, 1.0)] : [(0.5, 0.31, 1.55), (0.5, 0.29, 1.85), (0.5, 0.32, 1.3)]
    let L = layouts[sIdx % 3]
    let re = sIdx == 0 ? a : outBack(CGFloat(since) / 0.5) // re-entrada a cada cena
    let float = CGFloat(sin(t * 1.7)) * 14 * U
    let kScale: CGFloat = cfg.k == 1 ? 1.45 : 1
    if t < END { symbol(cfg.k, W * L.0, H * L.1 + float, L.2 * kScale * U * punch * (1 + 0.05 * bp), re, t, light: dark) }
    ctx.restoreGState()
    // legenda dinâmica
    if t >= OFFSET && t < END, let ci = chunks.lastIndex(where: { $0.t0 <= t }) {
        let c = chunks[ci], age = CGFloat(t - c.t0)
        let base: CGFloat = (SQ ? 78 : 96) * U
        var size = base
        let txt = c.words.map { words[$0].uppercased() }
        var f = font("AvenirNext-Heavy", size)
        var parts = txt.map { line($0, f, INK) }; var space = width(line(" ", f, INK))
        var total = parts.map(width).reduce(0, +) + space * CGFloat(parts.count - 1)
        if total > W * 0.86 { size *= W * 0.86 / total; f = font("AvenirNext-Heavy", size); parts = txt.map { line($0, f, INK) }; space = width(line(" ", f, INK)); total = parts.map(width).reduce(0, +) + space * CGFloat(parts.count - 1) }
        let pop = outBack(age / 0.16), yTop = H * (SQ ? 0.60 : 0.585)
        ctx.saveGState()
        ctx.translateBy(x: W / 2, y: H - yTop - size / 2); ctx.scaleBy(x: pop, y: pop); ctx.translateBy(x: -W / 2, y: -(H - yTop - size / 2))
        var x = (W - total) / 2
        for (j, wi) in c.words.enumerated() {
            let active = wStart[wi] <= t && (j == c.words.count - 1 || wStart[c.words[j + 1]] > t)
            let isKey = keys.contains(norm(words[wi]))
            let wpx = width(parts[j])
            if active {
                let pad = 14 * U
                let r = CGRect(x: x - pad, y: H - yTop - size * 1.05, width: wpx + 2 * pad, height: size * 1.25)
                ctx.addPath(CGPath(roundedRect: r, cornerWidth: 18 * U, cornerHeight: 18 * U, transform: nil)); ctx.setFillColor(isKey || dark ? GOLD : PLUM); ctx.fillPath()
                drawLine(line(txt[j], f, dark ? PLUM : WHITE), x, yTop, size)
            } else { drawLine(line(txt[j], f, dark ? (isKey ? GOLD : WHITE) : (isKey ? PLUM : INK)), x, yTop, size) }
            x += wpx + space
        }
        ctx.restoreGState()
    }
    // transição: círculo que abre na troca de cena
    if since < 0.35 && t > OFFSET + 0.2 && t < END {
        let p = CGFloat(since / 0.35); circle(W / 2, H * 0.45, max(W, H) * 0.9 * inOut(p), rgb(0x6E1F45, 0.22 * (1 - p)))
    }
    // flash branco nas palavras de impacto e no início
    let flash = max(sinceKey < 0.18 ? 1 - sinceKey / 0.18 : 0, t < 0.25 ? 1 - t / 0.25 : 0)
    if flash > 0 { ctx.setFillColor(rgb(0xFFFFFF, CGFloat(flash) * 0.75)); ctx.fill(CGRect(x: 0, y: 0, width: W, height: H)) }
    // barra de progresso
    ctx.setFillColor(PLUM); ctx.fill(CGRect(x: 0, y: H - 10 * U, width: W * CGFloat(min(t / END, 1)), height: 10 * U))
    // cartão final
    if t >= END - 0.35 {
        let p = inOut(CGFloat((t - END + 0.35) / 0.55))
        circle(W / 2, H * 0.5, max(W, H) * 1.2 * p, PLUM)
        let e = CGFloat(t - END)
        if e > 0 {
            symbol(1, W / 2, H * (SQ ? 0.30 : 0.33), (SQ ? 1.0 : 1.35) * U, min(e / 0.9, 1), t, light: true)
            let ts = (SQ ? 66 : 80) * U, f = font("Georgia", ts)
            let lines = cfg.endTitle.count > 18 ? [String(cfg.endTitle.prefix(while: { $0 != " " })) ] : [cfg.endTitle]
            _ = lines
            let words2 = cfg.endTitle.split(separator: " ").map(String.init)
            let half = (words2.count + 1) / 2
            let l1 = words2[0..<half].joined(separator: " "), l2 = words2[half...].joined(separator: " ")
            let ap = outCubic((e - 0.25) / 0.5), dy = (1 - ap) * 40 * U
            for (i, s) in [l1, l2].enumerated() where !s.isEmpty {
                let l = line(s, f, rgb(0xFFFFFF, ap)); drawLine(l, (W - width(l)) / 2, H * (SQ ? 0.52 : 0.52) + CGFloat(i) * ts * 1.2 + dy, ts)
            }
            let b = outBack((e - 0.7) / 0.4)
            if b > 0 {
                let cf = font("AvenirNext-Heavy", 40 * U), cl = line("CURSOSDEUNHAS.COM.BR", cf, PLUM)
                let bw = width(cl) + 80 * U, bh = 96 * U, by = H * (SQ ? 0.78 : 0.74)
                ctx.saveGState(); ctx.translateBy(x: W / 2, y: H - by - bh / 2); let pulse = 1 + 0.05 * bp; ctx.scaleBy(x: b * pulse, y: b * pulse); ctx.translateBy(x: -W / 2, y: -(H - by - bh / 2))
                ctx.addPath(CGPath(roundedRect: CGRect(x: (W - bw) / 2, y: H - by - bh, width: bw, height: bh), cornerWidth: bh / 2, cornerHeight: bh / 2, transform: nil)); ctx.setFillColor(GOLD); ctx.fillPath()
                drawLine(cl, (W - width(cl)) / 2, by + (bh - 40 * U) / 2 - 2 * U, 40 * U); ctx.restoreGState()
                let sf = font("AvenirNext-DemiBold", 34 * U), sl = line("toque em Saiba mais ↓", sf, rgb(0xFFFFFF, clamp(b)))
                drawLine(sl, (W - width(sl)) / 2, by + bh + 40 * U, 34 * U)
            }
        }
    }
}

// ---------- vídeo ----------
let tmpV = URL(fileURLWithPath: cfg.out + ".v.mov"), tmpA = URL(fileURLWithPath: cfg.out + ".a.m4a")
for u in [tmpV, tmpA] { try? FileManager.default.removeItem(at: u) }
let wr = try! AVAssetWriter(outputURL: tmpV, fileType: .mov)
let vin = AVAssetWriterInput(mediaType: .video, outputSettings: [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: cfg.w, AVVideoHeightKey: cfg.h,
    AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 7_000_000, AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel]])
let ad = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: vin, sourcePixelBufferAttributes: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB, kCVPixelBufferWidthKey as String: cfg.w, kCVPixelBufferHeightKey as String: cfg.h])
wr.add(vin); wr.startWriting(); wr.startSession(atSourceTime: .zero)
let FPS = 30, N = Int(TOTAL * Double(FPS))
for i in 0..<N {
    while !vin.isReadyForMoreMediaData { usleep(500) }
    var pb: CVPixelBuffer?; CVPixelBufferPoolCreatePixelBuffer(nil, ad.pixelBufferPool!, &pb); CVPixelBufferLockBaseAddress(pb!, [])
    ctx = CGContext(data: CVPixelBufferGetBaseAddress(pb!), width: cfg.w, height: cfg.h, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pb!), space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
    ctx.setShouldAntialias(true); ctx.interpolationQuality = .high
    frame(Double(i) / Double(FPS))
    CVPixelBufferUnlockBaseAddress(pb!, []); ad.append(pb!, withPresentationTime: CMTime(value: CMTimeValue(i), timescale: CMTimeScale(FPS)))
}
vin.markAsFinished(); let sem = DispatchSemaphore(value: 0); wr.finishWriting { sem.signal() }; sem.wait()

// ---------- áudio: narração + trilha (abaixa sob a voz) + efeitos ----------
let comp = AVMutableComposition(); var params: [AVMutableAudioMixInputParameters] = []
func cm(_ s: Double) -> CMTime { CMTime(seconds: s, preferredTimescale: 600) }
func add(_ path: String, at: Double, vol: Float, maxDur: Double? = nil, ramp: ((AVMutableAudioMixInputParameters) -> Void)? = nil) {
    guard FileManager.default.fileExists(atPath: path) else { return }
    let asset = AVURLAsset(url: URL(fileURLWithPath: path)); guard let src = asset.tracks(withMediaType: .audio).first else { return }
    let d = min(CMTimeGetSeconds(asset.duration), maxDur ?? 1e9, TOTAL - at); if d <= 0 { return }
    let tr = comp.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
    try? tr.insertTimeRange(CMTimeRange(start: .zero, duration: cm(d)), of: src, at: cm(at))
    let p = AVMutableAudioMixInputParameters(track: tr); p.setVolume(vol, at: .zero); ramp?(p); params.append(p)
}
add(cfg.narration, at: OFFSET, vol: 1.0)
add(cfg.music, at: 0, vol: 0.55, maxDur: TOTAL) { p in
    p.setVolumeRamp(fromStartVolume: 0.55, toEndVolume: 0.16, timeRange: CMTimeRange(start: cm(OFFSET - 0.1), duration: cm(0.5)))
    p.setVolumeRamp(fromStartVolume: 0.16, toEndVolume: 0.6, timeRange: CMTimeRange(start: cm(END - 0.2), duration: cm(0.4)))
    p.setVolumeRamp(fromStartVolume: 0.6, toEndVolume: 0, timeRange: CMTimeRange(start: cm(TOTAL - 1.0), duration: cm(1.0)))
}
let S = cfg.sfx
add(S + "/impact.mp3", at: 0, vol: 0.9)
for (i, st) in sceneTimes.enumerated() where i > 0 { add(S + "/whoosh.mp3", at: max(0, st - 0.12), vol: 0.45, maxDur: 0.9) }
for kt in keyTimes { add(S + "/sparkle.mp3", at: kt, vol: 0.5, maxDur: 1.2) }
for (i, c) in chunks.enumerated() where i % 2 == 1 && !c.sceneStart { add(S + "/pop.mp3", at: c.t0, vol: 0.18, maxDur: 0.4) }
add(S + "/riser.mp3", at: max(0, END - 2.0), vol: 0.45, maxDur: 2.0)
add(S + "/impact.mp3", at: END, vol: 0.85)
let mix = AVMutableAudioMix(); mix.inputParameters = params
let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPresetAppleM4A)!
ex.outputURL = tmpA; ex.outputFileType = .m4a; ex.audioMix = mix; ex.timeRange = CMTimeRange(start: .zero, duration: cm(TOTAL))
ex.exportAsynchronously { sem.signal() }; sem.wait()
if ex.status != .completed { print("erro audio", ex.error as Any); exit(1) }

// ---------- junta vídeo + áudio ----------
let fin = AVMutableComposition(), va = AVURLAsset(url: tmpV), aa = AVURLAsset(url: tmpA)
let vt = fin.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
try! vt.insertTimeRange(CMTimeRange(start: .zero, duration: va.duration), of: va.tracks(withMediaType: .video)[0], at: .zero)
let at = fin.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)!
try! at.insertTimeRange(CMTimeRange(start: .zero, duration: min(aa.duration, va.duration)), of: aa.tracks(withMediaType: .audio)[0], at: .zero)
let out = URL(fileURLWithPath: cfg.out); try? FileManager.default.removeItem(at: out)
let ex2 = AVAssetExportSession(asset: fin, presetName: AVAssetExportPresetPassthrough)!
ex2.outputURL = out; ex2.outputFileType = .mp4; ex2.exportAsynchronously { sem.signal() }; sem.wait()
for u in [tmpV, tmpA] { try? FileManager.default.removeItem(at: u) }
print(ex2.status == .completed ? "ok \(cfg.out) \(String(format: "%.1f", TOTAL))s cenas=\(sceneTimes.count) blocos=\(chunks.count) impacto=\(keyTimes.count)" : "erro \(String(describing: ex2.error))")
