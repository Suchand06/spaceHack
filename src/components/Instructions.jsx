import { X, Keyboard, Smartphone } from 'lucide-react'

export default function Instructions({ open, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="glass relative w-full max-w-lg rounded-2xl p-6 text-slate-100">
        <button onClick={onClose} className="absolute right-3 top-3 rounded p-1 hover:bg-white/10" aria-label="Close">
          <X size={20} />
        </button>
        <h2 className="mb-4 text-2xl font-bold text-cyan-300 neon-text">How to Play</h2>
        <div className="space-y-4 text-sm text-slate-200">
          <div className="flex gap-3">
            <Keyboard className="mt-0.5 text-cyan-400" size={20} />
            <div>
              <p className="font-semibold text-cyan-200">Desktop Controls</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li><b>Left/Right Arrow</b> or <b>A/D</b>: Move spaceship</li>
                <li><b>Spacebar</b>: Shoot</li>
                <li><b>P</b> or <b>Esc</b>: Pause</li>
                <li><b>Mouse</b>: Move ship by hovering over the game</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <Smartphone className="mt-0.5 text-purple-400" size={20} />
            <div>
              <p className="font-semibold text-purple-200">Mobile Controls</p>
              <p>Use the on-screen left/right buttons to move and the fire button to shoot.</p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-cyan-200">Objective</p>
            <p>Destroy enemies, collect power-ups (Rapid fire, Shield, Health), survive boss fights every 5 levels, and chase the high score!</p>
          </div>
        </div>
        <div className="mt-6 text-right">
          <button onClick={onClose} className="btn-glow rounded-lg bg-cyan-500/20 px-4 py-2 font-semibold text-cyan-200 hover:bg-cyan-500/30">Got it</button>
        </div>
      </div>
    </div>
  )
}