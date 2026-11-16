import { useMemo } from 'react'
import { Play, HelpCircle, Trophy, Volume2, VolumeX } from 'lucide-react'
import { getHighScores } from '../utils/storage'

function StarfieldBg() {
  const stars = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 4,
    dur: 3 + Math.random() * 4,
  })), [])
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span key={s.id} className="absolute rounded-full bg-white/80" style={{
          left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size,
          animation: `pulse-glow ${s.dur}s ease-in-out ${s.delay}s infinite`,
          opacity: 0.6,
        }} />
      ))}
      <div className="absolute -left-20 top-20 h-48 w-48 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
    </div>
  )
}

export default function MainMenu({ onPlay, onHowTo, soundOn, onToggleSound }) {
  const scores = getHighScores()
  return (
    <div className="starfield relative flex h-full w-full items-center justify-center overflow-hidden p-4">
      <StarfieldBg />
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-6 text-center">
        <div className="animate-float">
          <h1 className="neon-text text-5xl font-black tracking-[0.2em] text-transparent sm:text-7xl" style={{ WebkitTextStroke: '1px rgba(34,211,238,0.6)', backgroundImage: 'linear-gradient(90deg,#67e8f9,#a78bfa,#22d3ee)', backgroundClip: 'text' }}>
            SPACE STRIKE
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.4em] text-cyan-200/80">Arcade Shooter</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={onPlay} className="btn-glow animate-pulse-glow flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 text-lg font-bold text-white hover:from-cyan-400 hover:to-blue-500">
            <Play size={20} /> Play Game
          </button>
          <button onClick={onHowTo} className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-white/5 px-6 py-3 font-semibold text-cyan-100 hover:bg-white/10">
            <HelpCircle size={20} /> How to Play
          </button>
        </div>

        <div className="glass w-full max-w-md rounded-2xl p-4 text-left">
          <div className="mb-2 flex items-center gap-2 text-cyan-300">
            <Trophy size={18} />
            <h2 className="font-bold uppercase tracking-wider">High Scores</h2>
          </div>
          {scores.length === 0 ? (
            <p className="text-sm text-slate-400">No scores yet. Be the first pilot!</p>
          ) : (
            <ol className="space-y-1 text-sm">
              {scores.map((s, i) => (
                <li key={i} className="flex justify-between rounded bg-white/5 px-3 py-1.5">
                  <span className="text-slate-300">#{i + 1}</span>
                  <span className="font-semibold text-cyan-100">{s.toLocaleString()}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <button onClick={onToggleSound} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">
          {soundOn ? <Volume2 size={16} className="text-cyan-300" /> : <VolumeX size={16} className="text-slate-400" />}
          Sound: <span className={soundOn ? 'text-cyan-300' : 'text-slate-400'}>{soundOn ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  )
}