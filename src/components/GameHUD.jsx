import { Pause, Volume2, VolumeX, Heart, Shield } from 'lucide-react'

export default function GameHUD({ stats, highScore, soundOn, onToggleSound, onPause }) {
  const hpPct = Math.max(0, Math.min(100, (stats.health / (stats.maxHealth || 100)) * 100))
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 p-2 sm:p-3">
      <div className="mx-auto flex max-w-5xl items-start justify-between gap-2 text-xs sm:text-sm">
        <div className="glass pointer-events-auto rounded-xl p-2 sm:p-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Score</div>
              <div className="text-lg font-bold text-cyan-300">{stats.score.toLocaleString()}</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">High</div>
              <div className="font-semibold text-purple-300">{highScore.toLocaleString()}</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Level</div>
              <div className="font-semibold text-amber-300">{stats.level}</div>
            </div>
          </div>
        </div>

        <div className="glass pointer-events-auto flex items-center gap-2 rounded-xl p-2 sm:p-3">
          <div className="w-28 sm:w-40">
            <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400">
              <span className="flex items-center gap-1"><Heart size={12} className="text-rose-400" /> Health</span>
              <span className="flex items-center gap-1">x{stats.lives}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-emerald-400 transition-all" style={{ width: `${hpPct}%` }} />
            </div>
          </div>
          <button onClick={onToggleSound} className="rounded-lg p-2 hover:bg-white/10" aria-label="Toggle sound">
            {soundOn ? <Volume2 size={18} className="text-cyan-300" /> : <VolumeX size={18} className="text-slate-400" />}
          </button>
          <button onClick={onPause} className="rounded-lg bg-cyan-500/20 p-2 text-cyan-200 hover:bg-cyan-500/30" aria-label="Pause">
            <Pause size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}