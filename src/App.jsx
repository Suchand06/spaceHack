import { useCallback, useEffect, useState } from 'react'
import MainMenu from './components/MainMenu'
import GameCanvas from './components/GameCanvas'
import GameHUD from './components/GameHUD'
import PauseMenu from './components/PauseMenu'
import GameOver from './components/GameOver'
import Instructions from './components/Instructions'
import { useGame } from './hooks/useGame'
import { useSound } from './hooks/useSound'
import { getHighScores, saveHighScore, getSettings, saveSettings } from './utils/storage'

export default function App() {
  const [settings, setSettings] = useState(getSettings)
  const [highScore, setHighScore] = useState(() => getHighScores()[0] || 0)
  const [showInstructions, setShowInstructions] = useState(false)

  const sound = useSound(settings.soundOn)

  const handleGameOver = useCallback((result) => {
    const top = saveHighScore(result.score)
    setHighScore(top[0] || 0)
    sound.stopBg()
  }, [sound])

  const { canvasRef, gameState, stats, lastResult, startGame, pauseGame, resumeGame, restartGame, toMenu, setInput } = useGame({
    onShoot: sound.shoot,
    onExplosion: sound.explosion,
    onHit: sound.hit,
    onPowerUp: sound.powerUp,
    onGameOver: handleGameOver,
  })

  const toggleSound = useCallback(() => {
    setSettings((prev) => {
      const next = { ...prev, soundOn: !prev.soundOn }
      saveSettings(next)
      return next
    })
  }, [])

  // start/stop bg music based on state and sound
  useEffect(() => {
    if (gameState === 'playing' && settings.soundOn) sound.startBg()
    else sound.stopBg()
  }, [gameState, settings.soundOn, sound])

  // global pause hotkeys
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (gameState === 'playing') pauseGame()
        else if (gameState === 'paused') resumeGame()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gameState, pauseGame, resumeGame])

  const handlePlay = () => { sound.ensure(); sound.click(); startGame() }
  const handleHowTo = () => { sound.click(); setShowInstructions(true) }
  const handlePause = () => { sound.click(); pauseGame() }
  const handleResume = () => { sound.click(); resumeGame() }
  const handleRestart = () => { sound.click(); restartGame() }
  const handleMenu = () => { sound.click(); toMenu() }

  return (
    <div className="relative h-full w-full bg-slate-950 text-slate-100">
      <div className={`absolute inset-0 ${gameState === 'menu' ? 'invisible' : 'visible'}`}>
        <GameCanvas canvasRef={canvasRef} setInput={setInput} gameState={gameState} />
        {gameState !== 'menu' && <GameHUD stats={stats} highScore={highScore} soundOn={settings.soundOn} onToggleSound={() => { sound.click(); toggleSound() }} onPause={handlePause} />}
        {gameState === 'paused' && <PauseMenu onResume={handleResume} onRestart={handleRestart} onMenu={handleMenu} />}
        {gameState === 'gameover' && <GameOver result={lastResult} highScore={highScore} onRestart={handleRestart} onMenu={handleMenu} />}
      </div>
      {gameState === 'menu' && (
        <div className="absolute inset-0 z-10">
          <MainMenu onPlay={handlePlay} onHowTo={handleHowTo} soundOn={settings.soundOn} onToggleSound={() => { sound.click(); toggleSound() }} />
        </div>
      )}
      <Instructions open={showInstructions} onClose={() => setShowInstructions(false)} />
    </div>
  )
}