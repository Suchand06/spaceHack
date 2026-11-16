import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Crosshair } from 'lucide-react'

export default function GameCanvas({ canvasRef, setInput, gameState }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') setInput({ left: true })
      if (e.code === 'ArrowRight' || e.code === 'KeyD') setInput({ right: true })
      if (e.code === 'Space') { e.preventDefault(); setInput({ shoot: true }) }
    }
    const onKeyUp = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') setInput({ left: false })
      if (e.code === 'ArrowRight' || e.code === 'KeyD') setInput({ right: false })
      if (e.code === 'Space') setInput({ shoot: false })
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [setInput])

  const handlePointer = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setInput({ pointerActive: true, pointerX: clientX - rect.left })
  }

  const playing = gameState === 'playing'

  return (
    <div ref={containerRef} className="relative h-full w-full select-none overflow-hidden bg-slate-950"
      onMouseMove={(e) => playing && handlePointer(e.clientX)}
      onMouseLeave={() => setInput({ pointerActive: false, pointerX: null })}
      onTouchMove={(e) => { if (playing && e.touches[0]) handlePointer(e.touches[0].clientX) }}
      onTouchEnd={() => setInput({ pointerActive: false, pointerX: null })}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      {/* Mobile controls */}
      {playing && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-3 sm:hidden">
          <div className="pointer-events-auto flex gap-2">
            <button
              className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/20 text-cyan-100 active:bg-cyan-500/40"
              onTouchStart={(e) => { e.preventDefault(); setInput({ left: true }) }}
              onTouchEnd={(e) => { e.preventDefault(); setInput({ left: false }) }}
              onMouseDown={() => setInput({ left: true })}
              onMouseUp={() => setInput({ left: false })}
              onMouseLeave={() => setInput({ left: false })}
              aria-label="Move left"
            ><ChevronLeft /></button>
            <button
              className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/20 text-cyan-100 active:bg-cyan-500/40"
              onTouchStart={(e) => { e.preventDefault(); setInput({ right: true }) }}
              onTouchEnd={(e) => { e.preventDefault(); setInput({ right: false }) }}
              onMouseDown={() => setInput({ right: true })}
              onMouseUp={() => setInput({ right: false })}
              onMouseLeave={() => setInput({ right: false })}
              aria-label="Move right"
            ><ChevronRight /></button>
          </div>
          <button
            className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border border-rose-400/50 bg-rose-500/30 text-rose-100 active:bg-rose-500/50"
            onTouchStart={(e) => { e.preventDefault(); setInput({ shoot: true }) }}
            onTouchEnd={(e) => { e.preventDefault(); setInput({ shoot: false }) }}
            onMouseDown={() => setInput({ shoot: true })}
            onMouseUp={() => setInput({ shoot: false })}
            onMouseLeave={() => setInput({ shoot: false })}
            aria-label="Shoot"
          ><Crosshair /></button>
        </div>
      )}
    </div>
  )
}