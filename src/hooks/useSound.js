import { useCallback, useEffect, useRef } from 'react'

export function useSound(enabled) {
  const ctxRef = useRef(null)
  const enabledRef = useRef(enabled)
  const bgRef = useRef(null)

  useEffect(() => {
    enabledRef.current = enabled
    if (!enabled) stopBg()
  }, [enabled])

  const ensure = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) ctxRef.current = new AC()
    }
    if (ctxRef.current?.state === 'suspended') ctxRef.current.resume().catch(() => {})
    return ctxRef.current
  }, [])

  const beep = useCallback((freq = 440, duration = 0.08, type = 'square', gain = 0.05) => {
    if (!enabledRef.current) return
    const ctx = ensure()
    if (!ctx) return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type
    o.frequency.value = freq
    g.gain.value = gain
    o.connect(g)
    g.connect(ctx.destination)
    const t = ctx.currentTime
    g.gain.setValueAtTime(gain, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    o.start(t)
    o.stop(t + duration)
  }, [ensure])

  const shoot = useCallback(() => beep(880, 0.05, 'square', 0.03), [beep])
  const explosion = useCallback(() => {
    if (!enabledRef.current) return
    const ctx = ensure()
    if (!ctx) return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(180, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2)
    g.gain.setValueAtTime(0.06, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2)
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.2)
  }, [ensure])
  const hit = useCallback(() => beep(120, 0.15, 'sawtooth', 0.06), [beep])
  const powerUp = useCallback(() => {
    beep(523, 0.08, 'sine', 0.05)
    setTimeout(() => beep(784, 0.1, 'sine', 0.05), 80)
  }, [beep])
  const click = useCallback(() => beep(660, 0.04, 'triangle', 0.03), [beep])

  const startBg = useCallback(() => {
    if (!enabledRef.current) return
    const ctx = ensure()
    if (!ctx || bgRef.current) return
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    const lfo = ctx.createOscillator()
    const lfoG = ctx.createGain()
    o.type = 'triangle'
    o.frequency.value = 55
    g.gain.value = 0.015
    lfo.type = 'sine'
    lfo.frequency.value = 0.2
    lfoG.gain.value = 0.008
    lfo.connect(lfoG)
    lfoG.connect(g.gain)
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    lfo.start()
    bgRef.current = { o, g, lfo }
  }, [ensure])

  const stopBg = useCallback(() => {
    const bg = bgRef.current
    if (bg) {
      try { bg.o.stop(); bg.lfo.stop() } catch {}
      bgRef.current = null
    }
  }, [])

  useEffect(() => () => stopBg(), [stopBg])

  return { shoot, explosion, hit, powerUp, click, startBg, stopBg, ensure }
}