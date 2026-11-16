import Bullet from './Bullet'

export default class Enemy {
  constructor(x, y, type, level = 1) {
    this.type = type // 'normal' | 'fast' | 'boss'
    this.x = x
    this.y = y
    this.level = level
    this.active = true
    this.time = 0
    this.shootCooldown = 0

    if (type === 'boss') {
      this.width = 120
      this.height = 70
      this.hp = 30 + level * 5
      this.maxHp = this.hp
      this.vy = 30
      this.vx = 60
      this.score = 100
      this.fireRate = 1.2
    } else if (type === 'fast') {
      this.width = 34
      this.height = 28
      this.hp = 1
      this.maxHp = 1
      this.vy = 140 + level * 10
      this.vx = (Math.random() - 0.5) * 80
      this.score = 20
      this.fireRate = 0
    } else {
      this.width = 40
      this.height = 32
      this.hp = 2
      this.maxHp = 2
      this.vy = 70 + level * 6
      this.vx = (Math.random() - 0.5) * 30
      this.score = 10
      this.fireRate = 2.5
    }
  }

  update(dt, width) {
    this.time += dt
    this.y += this.vy * dt
    this.x += this.vx * dt
    if (this.type === 'boss') {
      if (this.y > 80) this.y = 80
      if (this.x < this.width / 2 || this.x > width - this.width / 2) this.vx *= -1
    } else {
      if (this.x < this.width / 2 || this.x > width - this.width / 2) this.vx *= -1
    }
    if (this.shootCooldown > 0) this.shootCooldown -= dt
  }

  canShoot() {
    if (this.fireRate <= 0) return false
    if (this.shootCooldown <= 0) {
      this.shootCooldown = this.fireRate * (0.7 + Math.random() * 0.6)
      return true
    }
    return false
  }

  shoot() {
    return new Bullet(this.x, this.y + this.height / 2, 220 + this.level * 10, 'enemy', 1)
  }

  takeDamage(dmg) {
    this.hp -= dmg
    if (this.hp <= 0) this.active = false
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    if (this.type === 'boss') {
      ctx.shadowColor = '#a855f7'
      ctx.shadowBlur = 20
      ctx.fillStyle = '#7c3aed'
      ctx.beginPath()
      ctx.moveTo(0, -this.height / 2)
      ctx.lineTo(this.width / 2, 0)
      ctx.lineTo(this.width / 3, this.height / 2)
      ctx.lineTo(-this.width / 3, this.height / 2)
      ctx.lineTo(-this.width / 2, 0)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#e9d5ff'
      ctx.beginPath()
      ctx.arc(0, 0, 10, 0, Math.PI * 2)
      ctx.fill()
      // HP bar
      ctx.restore()
      ctx.save()
      const barW = this.width
      const pct = Math.max(0, this.hp / this.maxHp)
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      ctx.fillRect(this.x - barW / 2, this.y - this.height / 2 - 12, barW, 6)
      ctx.fillStyle = '#f43f5e'
      ctx.fillRect(this.x - barW / 2, this.y - this.height / 2 - 12, barW * pct, 6)
      ctx.restore()
      return
    }

    if (this.type === 'fast') {
      ctx.shadowColor = '#fb923c'
      ctx.shadowBlur = 14
      ctx.fillStyle = '#f97316'
      ctx.beginPath()
      ctx.moveTo(0, this.height / 2)
      ctx.lineTo(this.width / 2, -this.height / 2)
      ctx.lineTo(0, -this.height / 4)
      ctx.lineTo(-this.width / 2, -this.height / 2)
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.shadowColor = '#f43f5e'
      ctx.shadowBlur = 14
      ctx.fillStyle = '#e11d48'
      ctx.beginPath()
      ctx.moveTo(0, this.height / 2)
      ctx.lineTo(this.width / 2, -this.height / 4)
      ctx.lineTo(this.width / 4, -this.height / 2)
      ctx.lineTo(-this.width / 4, -this.height / 2)
      ctx.lineTo(-this.width / 2, -this.height / 4)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#fecdd3'
      ctx.fillRect(-4, -4, 8, 8)
    }
    ctx.restore()
  }

  getBounds() {
    return { x: this.x - this.width / 2, y: this.y - this.height / 2, width: this.width, height: this.height }
  }
}