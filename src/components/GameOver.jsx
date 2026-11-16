import { RotateCcw, Home, Trophy } from 'lucide-react'

export default function GameOver({ result, highScore, onRestart, onMenu }) {
  if (!result) return null
  const isNewHigh = result.score >= highScore && result.score > 0
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
      <div className="glass w-full max-w-md rounded-2xl p-6 text-center">
        <h2 className="mb-1 text-4xl font-black text-rose-400" style={{ textShadow: '0 0 20px rgba(244,63,94,0.6)' }}>GAME OVER</h2>
        {isNewHigh && <p className="mb-4 font-semibold text-amber-300">New High Score!</p>}
        {!isNewHigh && <div className="mb-4" />}
        <div className="mb-6 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg bg-white/5 p-3">
            <div className="text-slate-400">Final Score</div>
            <div className="text-xl font-bold text-cyan-300">{result.score.toLocaleString()}</div>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center justify-center gap-1 text-slate-400"><Trophy size={12}/> Best</div>
            <div className="text-xl font-bold text-purple-300">{highScore.toLocaleString()}</div>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <div className="text-slate-400">Destroyed</div>
            <div className="text-xl font-bold text-amber-300">{result.enemiesDestroyed}</div>
          </div>
        </div>
        <p className="mb-4 text-sm text-slate-400">Reached Level {result.level}</p>
        <div className="flex flex-col gap-3">
          <button onClick={onRestart} className="btn-glow flex items-center justify-center gap-2 rounded-lg bg-cyan-500/30 py-3 font-semibold text-white hover:bg-cyan-500/40">
            <RotateCcw size={18} /> Play Again
          </button>
          <button onClick={onMenu} className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-3 font-semibold text-slate-200 hover:bg-white/10">
            <Home size={18} /> Main Menu
          </button>
        </div>
      </div>
    </div>
  )
}