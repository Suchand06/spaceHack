import { Play, RotateCcw, Home } from 'lucide-react'

export default function PauseMenu({ onResume, onRestart, onMenu }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-4">
      <div className="glass w-full max-w-sm rounded-2xl p-6 text-center">
        <h2 className="neon-text mb-6 text-3xl font-bold text-cyan-300">Paused</h2>
        <div className="flex flex-col gap-3">
          <button onClick={onResume} className="btn-glow flex items-center justify-center gap-2 rounded-lg bg-cyan-500/30 py-3 font-semibold text-white hover:bg-cyan-500/40">
            <Play size={18} /> Resume
          </button>
          <button onClick={onRestart} className="flex items-center justify-center gap-2 rounded-lg border border-purple-400/40 bg-purple-500/10 py-3 font-semibold text-purple-100 hover:bg-purple-500/20">
            <RotateCcw size={18} /> Restart
          </button>
          <button onClick={onMenu} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-3 font-semibold text-slate-200 hover:bg-white/10">
            <Home size={18} /> Main Menu
          </button>
        </div>
      </div>
    </div>
  )
}