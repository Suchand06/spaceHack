import Player from './Player'
import Enemy from './Enemy'
import Particle from './Particle'
import PowerUp from './PowerUp'
import { rectsIntersect } from './Collision'

export default class GameEngine {
  constructor(canvas, callbacks = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.callbacks = callbacks

    this.width = 800
    this.height = 600
    this.dpr = window.devicePixelRatio || 1

    this.state = 'menu' // menu, playing, paused, gameover
    this.lastTime = 0
    this.rafId = null
    this.running = false

    this.input = { left: false, right: false, shoot: false, pointerActive: false, pointerX: null }

    this.stars = []
    this.reset()

    this.loop = this.loop.bind(this)
    this.handleResize = this.handleResize.bind(this)
  }

  reset() {
    this.width = this.canvas.clientWidth || 800
    this.height = this.canvas.clientHeight || 600
    this.player = new Player(this.width / 2, this.height - 60)
    this.bullets = []
    this.enemies = []
    this.enemyBullets = []
    this.particles = []
    this.powerUps = []
    this.score = 0
    this.level = 1
    this.enemiesDestroyed = 0
    this.spawnTimer = 0
    this.spawnInterval = 1.2
    this.levelKills = 0
    this.killsToNextLevel = 10
    this.bossActive = false
    this.bossPending = false
    this.shakeTime = 0
    this.shakeMag = 0
    this.time = 0
    this.initStars()
  }

  initStars() {
    const count = 120
    this.stars = Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      s: Math.random() * 2 + 0.5,
      v: Math.random() * 30 + 10,
      a: Math.random() * 0.6 + 0.2,
    }))
  }

  setCallbacks(cb) {
    this.callbacks = { ...this.callbacks, ...cb }
  }

  start() {
    this.reset()
    this.state = 'playing'
    this.running = true
    this.lastTime = performance.now()
    this.emitStats()
    if (!this.rafId) this.rafId = requestAnimationFrame(this.loop)
  }

  pause() {
    if (this.state === 'playing') {
      this.state = 'paused'
      this.callbacks.onStateChange?.(this.state)
    }
  }

  resume() {
    if (this.state === 'paused') {
      this.state = 'playing'
      this.lastTime = performance.now()
      this.callbacks.onStateChange?.(this.state)
    }
  }

  gameOver() {
    this.state = 'gameover'
    this.callbacks.onStateChange?.(this.state)
    this.callbacks.onGameOver?.({
      score: this.score,
      enemiesDestroyed: this.enemiesDestroyed,
      level: this.level,
    })
  }

  destroy() {
    this.running = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = null
  }

  handleResize(w, h) {
    this.width = w
    this.height = h
    this.initStars()
    if (this.player) this.player.y = this.height - 60
  }

  emitStats() {
    this.callbacks.onStats?.({
      score: this.score,
      health: this.player?.health ?? 0,
      maxHealth: this.player?.maxHealth ?? 100,
      lives: this.player?.lives ?? 0,
      level: this.level,
    })
  }

  spawnEnemy() {
    if (this.bossActive || this.bossPending) return
    const margin = 30
    const x = margin + Math.random() * (this.width - margin * 2)
    const roll = Math.random()
    let type = 'normal'
    const fastChance = Math.min(0.15 + this.level * 0.03, 0.45)
    if (roll < fastChance) type = 'fast'
    this.enemies.push(new Enemy(x, -30, type, this.level))
  }

  spawnBoss() {
    this.bossActive = true
    this.bossPending = false
    const boss = new Enemy(this.width / 2, -60, 'boss', this.level)
    this.enemies.push(boss)
  }

  addExplosion(x, y, color, count = 18) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color, 260, 0.6, 3))
    }
  }

  maybeDropPowerUp(x, y) {
    if (Math.random() < 0.12) {
      const types = ['rapid', 'shield', 'health']
      const type = types[Math.floor(Math.random() * types.length)]
      this.powerUps.push(new PowerUp(x, y, type))
    }
  }

  nextLevel() {
    this.level += 1
    this.levelKills = 0
    this.killsToNextLevel = 8 + this.level * 2
    this.spawnInterval = Math.max(0.35, 1.2 - this.level * 0.08)
    if (this.level % 5 === 0) {
      this.bossPending = true
    }
    this.callbacks.onLevelUp?.(this.level)
  }

  update(dt) {
    if (this.state !== 'playing') return
    this.time += dt

    // stars
    for (const s of this.stars) {
      s.y += s.v * dt * (1 + this.level * 0.05)
      if (s.y > this.height) {
        s.y = -2
        s.x = Math.random() * this.width
      }
    }

    // player
    this.player.update(dt, this.width, this.height, this.input)
    if (this.input.shoot) {
      const b = this.player.tryShoot()
      if (b) {
        this.bullets.push(b)
        this.callbacks.onShoot?.()
      }
    }

    // spawn
    this.spawnTimer -= dt
    if (!this.bossActive && !this.bossPending && this.spawnTimer <= 0) {
      this.spawnEnemy()
      this.spawnTimer = this.spawnInterval * (0.7 + Math.random() * 0.6)
    }
    if (this.bossPending && !this.bossActive && this.enemies.length === 0) {
      this.spawnBoss()
    }

    // enemies
    for (const e of this.enemies) {
      e.update(dt, this.width)
      if (e.canShoot() && e.y > 0) {
        this.enemyBullets.push(e.shoot())
      }
      if (e.type !== 'boss' && e.y > this.height + 40) e.active = false
    }

    // bullets
    for (const b of this.bullets) b.update(dt)
    for (const b of this.enemyBullets) b.update(dt)

    // powerups
    for (const p of this.powerUps) {
      p.update(dt)
      if (p.y > this.height + 30) p.active = false
    }

    // particles
    for (const p of this.particles) p.update(dt)

    // collisions: player bullets -> enemies
    for (const b of this.bullets) {
      if (!b.active) continue
      for (const e of this.enemies) {
        if (!e.active) continue
        if (rectsIntersect(b.getBounds(), e.getBounds())) {
          b.active = false
          e.takeDamage(b.damage)
          this.addExplosion(b.x, b.y, '#67e8f9', 5)
          if (!e.active) {
            this.score += e.score
            this.enemiesDestroyed += 1
            this.levelKills += 1
            this.addExplosion(e.x, e.y, e.type === 'boss' ? '#a855f7' : e.type === 'fast' ? '#fb923c' : '#f43f5e', e.type === 'boss' ? 50 : 20)
            this.callbacks.onExplosion?.()
            this.maybeDropPowerUp(e.x, e.y)
            if (e.type === 'boss') {
              this.bossActive = false
              this.nextLevel()
            } else if (!this.bossActive && this.levelKills >= this.killsToNextLevel) {
              this.nextLevel()
            }
          }
          break
        }
      }
      if (b.y < -20) b.active = false
    }

    // collisions: enemy bullets -> player
    const pb = this.player.getBounds()
    for (const b of this.enemyBullets) {
      if (!b.active) continue
      if (rectsIntersect(b.getBounds(), pb)) {
        b.active = false
        const damaged = this.player.takeDamage(15)
        if (damaged) {
          this.shakeTime = 0.25
          this.shakeMag = 6
          this.addExplosion(this.player.x, this.player.y, '#38bdf8', 10)
          this.callbacks.onHit?.()
        }
      }
      if (b.y > this.height + 20) b.active = false
    }

    // collisions: enemies -> player
    for (const e of this.enemies) {
      if (!e.active) continue
      if (rectsIntersect(e.getBounds(), pb)) {
        e.active = false
        this.addExplosion(e.x, e.y, '#f43f5e', 15)
        const damaged = this.player.takeDamage(e.type === 'boss' ? 40 : 25)
        if (damaged) {
          this.shakeTime = 0.3
          this.shakeMag = 8
          this.callbacks.onHit?.()
        }
        if (e.type === 'boss') {
          this.bossActive = false
          this.nextLevel()
        }
      }
    }

    // collisions: powerups -> player
    for (const p of this.powerUps) {
      if (!p.active) continue
      if (rectsIntersect(p.getBounds(), pb)) {
        p.active = false
        this.player.applyPowerUp(p.type)
        this.callbacks.onPowerUp?.(p.type)
      }
    }

    // cleanup
    this.bullets = this.bullets.filter((b) => b.active)
    this.enemyBullets = this.enemyBullets.filter((b) => b.active)
    this.enemies = this.enemies.filter((e) => e.active)
    this.particles = this.particles.filter((p) => p.active)
    this.powerUps = this.powerUps.filter((p) => p.active)

    // shake
    if (this.shakeTime > 0) this.shakeTime -= dt

    if (!this.player.active) {
      this.gameOver()
    }

    this.emitStats()
  }

  draw() {
    const ctx = this.ctx
    const w = this.width
    const h = this.height
    ctx.clearRect(0, 0, w, h)

    // background
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, '#020617')
    grad.addColorStop(0.5, '#0b1026')
    grad.addColorStop(1, '#020617')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // stars
    ctx.save()
    for (const s of this.stars) {
      ctx.globalAlpha = s.a
      ctx.fillStyle = '#e0f2fe'
      ctx.fillRect(s.x, s.y, s.s, s.s)
    }
    ctx.restore()

    // shake
    ctx.save()
    if (this.shakeTime > 0) {
      const dx = (Math.random() - 0.5) * this.shakeMag
      const dy = (Math.random() - 0.5) * this.shakeMag
      ctx.translate(dx, dy)
    }

    // entities
    for (const p of this.powerUps) p.draw(ctx)
    for (const b of this.bullets) b.draw(ctx)
    for (const b of this.enemyBullets) b.draw(ctx)
    for (const e of this.enemies) e.draw(ctx)
    if (this.player) this.player.draw(ctx)
    for (const p of this.particles) p.draw(ctx)

    ctx.restore()
  }

  loop(now) {
    if (!this.running) return
    const dt = Math.min((now - this.lastTime) / 1000, 0.05)
    this.lastTime = now
    if (this.state === 'playing') {
      this.update(dt)
    }
    this.draw()
    this.rafId = requestAnimationFrame(this.loop)
  }
}