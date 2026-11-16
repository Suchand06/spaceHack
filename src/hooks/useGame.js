import { useCallback, useEffect, useRef, useState } from 'react'
import GameEngine from '../game/GameEngine'

export function useGame({ onShoot, onExplosion, onHit, onPowerUp, onGameOver, onLevelUp }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const pendingStartRef = useRef(false)
  const [gameState, setGameState] = useState('menu') // menu, playing, paused, gameover
  const [stats, setStats] = useState({ score: 0, health: 100, maxHealth: 100, lives: 3, level: 1 })
  const [lastResult, setLastResult] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = new GameEngine(canvas, {
      onStats: (s) => setStats(s),
      onStateChange: (s) => setGameState(s),
      onGameOver: (r) => { setLastResult(r); onGameOver?.(r) },
      onShoot,
      onExplosion,
      onHit,
      onPowerUp,
      onLevelUp,
    })
    engineRef.current = engine

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      engine.handleResize(rect.width, rect.height)
    }
    resize()
    window.addEventListener('resize', resize)

    // draw initial frame
    engine.draw()
    if (pendingStartRef.current) {
      pendingStartRef.current = false
      engine.start()
    }

    return () => {
      window.removeEventListener('resize', resize)
      engine.destroy()
      engineRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // update callbacks when they change
  useEffect(() => {
    engineRef.current?.setCallbacks({ onShoot, onExplosion, onHit, onPowerUp, onGameOver, onLevelUp })
  }, [onShoot, onExplosion, onHit, onPowerUp, onGameOver, onLevelUp])

  const startGame = useCallback(() => {
    setGameState('playing')
    if (engineRef.current) {
      engineRef.current.start()
    } else {
      pendingStartRef.current = true
    }
  }, [])

  const pauseGame = useCallback(() => engineRef.current?.pause(), [])
  const resumeGame = useCallback(() => engineRef.current?.resume(), [])
  const restartGame = useCallback(() => {
    setGameState('playing')
    if (engineRef.current) {
      engineRef.current.start()
    } else {
      pendingStartRef.current = true
    }
  }, [])
  const toMenu = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.state = 'menu'
      engineRef.current.reset()
      engineRef.current.draw()
    }
    setGameState('menu')
  }, [])

  const setInput = useCallback((patch) => {
    if (engineRef.current) Object.assign(engineRef.current.input, patch)
  }, [])

  return { canvasRef, gameState, stats, lastResult, startGame, pauseGame, resumeGame, restartGame, toMenu, setInput, setGameState }
}