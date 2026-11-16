export default class Particle {
  constructor(x, y, color, speed = 200, life = 0.6, size = 3) {
    const angle = Math.random() * Math.PI * 2
    const sp = speed * (0.3 + Math.random() * 0.7)
    this.x = x
    this.y = y
    this.vx = Math.cos(angle) * sp
    this.vy = Math.sin(angle) * sp
    this.life = life
    this.maxLife = life
    this.size = size * (0.5 + Math.random())
    this.color = color
    this.active = true
  }

  update(dt) {
    this.x += this.vx * dt
    this.y += this.vy * dt
    this.vx *= 0.98
    this.vy *= 0.98
    this.life -= dt
    if (this.life <= 0) this.active = false
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife)
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = this.color
    ctx.shadowColor = this.color
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}