export default class PowerUp {
  constructor(x, y, type) {
    this.x = x
    this.y = y
    this.type = type // 'rapid' | 'shield' | 'health'
    this.width = 26
    this.height = 26
    this.vy = 90
    this.active = true
    this.time = 0
  }

  update(dt) {
    this.y += this.vy * dt
    this.time += dt
  }

  draw(ctx) {
    const pulse = 1 + Math.sin(this.time * 6) * 0.1
    const size = this.width * pulse
    const colors = {
      rapid: { fill: '#facc15', glow: '#fde047', label: 'R' },
      shield: { fill: '#38bdf8', glow: '#7dd3fc', label: 'S' },
      health: { fill: '#4ade80', glow: '#86efac', label: '+' },
    }
    const c = colors[this.type] || colors.rapid
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.shadowColor = c.glow
    ctx.shadowBlur = 18
    ctx.fillStyle = c.fill
    ctx.beginPath()
    ctx.roundRect(-size / 2, -size / 2, size, size, 6)
    ctx.fill()
    ctx.fillStyle = '#020617'
    ctx.shadowBlur = 0
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(c.label, 0, 1)
    ctx.restore()
  }

  getBounds() {
    return { x: this.x - this.width / 2, y: this.y - this.height / 2, width: this.width, height: this.height }
  }
}