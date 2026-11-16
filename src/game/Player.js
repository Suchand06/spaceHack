import Bullet from './Bullet'

export default class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.width = 44
    this.height = 36
    this.speed = 380
    this.health = 100
    this.maxHealth = 100
    this.lives = 3
    this.active = true
    this.shootCooldown = 0
    this.baseFireRate = 0.28
    this.fireRate = this.baseFireRate
    this.rapidTimer = 0
    this.shieldTimer = 0
    this.invulnTimer = 0
  }

  update(dt, width, height, input) {
    let dx = 0
    if (input.left) dx -= 1
    if (input.right) dx += 1
    this.x += dx * this.speed * dt

    // mouse/touch target
    if (input.pointerActive && input.pointerX != null) {
      const diff = input.pointerX - this.x
      this.x += diff * Math.min(1, dt * 12)
    }

    const half = this.width / 2
    if (this.x < half) this.x = half
    if (this.x > width - half) this.x = width - half
    this.y = height - 60

    if (this.shootCooldown > 0) this.shootCooldown -= dt
    if (this.rapidTimer > 0) {
      this.rapidTimer -= dt
      if (this.rapidTimer <= 0) this.fireRate = this.baseFireRate
    }
    if (this.shieldTimer > 0) this.shieldTimer -= dt
    if (this.invulnTimer > 0) this.invulnTimer -= dt
  }

  tryShoot() {
    if (this.shootCooldown <= 0) {
      this.shootCooldown = this.fireRate
      return new Bullet(this.x, this.y - this.height / 2, -520, 'player', 1)
    }
    return null
  }

  takeDamage(amount) {
    if (this.shieldTimer > 0 || this.invulnTimer > 0) return false
    this.health -= amount
    this.invulnTimer = 1.0
    if (this.health <= 0) {
      this.lives -= 1
      if (this.lives > 0) {
        this.health = this.maxHealth
      } else {
        this.active = false
      }
    }
    return true
  }

  applyPowerUp(type) {
    if (type === 'rapid') {
      this.rapidTimer = 8
      this.fireRate = 0.12
    } else if (type === 'shield') {
      this.shieldTimer = 8
    } else if (type === 'health') {
      this.health = Math.min(this.maxHealth, this.health + 35)
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    if (this.invulnTimer > 0 && Math.floor(this.invulnTimer * 10) % 2 === 0) {
      ctx.globalAlpha = 0.4
    }
    // ship body
    ctx.shadowColor = '#22d3ee'
    ctx.shadowBlur = 18
    ctx.fillStyle = '#0ea5e9'
    ctx.beginPath()
    ctx.moveTo(0, -this.height / 2)
    ctx.lineTo(this.width / 2, this.height / 2)
    ctx.lineTo(0, this.height / 4)
    ctx.lineTo(-this.width / 2, this.height / 2)
    ctx.closePath()
    ctx.fill()
    // cockpit
    ctx.shadowBlur = 0
    ctx.fillStyle = '#e0f2fe'
    ctx.beginPath()
    ctx.ellipse(0, -2, 6, 10, 0, 0, Math.PI * 2)
    ctx.fill()
    // shield
    if (this.shieldTimer > 0) {
      ctx.strokeStyle = 'rgba(56,189,248,0.8)'
      ctx.lineWidth = 3
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(0, 2, this.width * 0.75, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.restore()
  }

  getBounds() {
    return { x: this.x - this.width / 2, y: this.y - this.height / 2, width: this.width, height: this.height }
  }
}