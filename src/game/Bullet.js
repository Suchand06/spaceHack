export default class Bullet {
  constructor(x, y, vy, owner = 'player', damage = 1) {
    this.x = x
    this.y = y
    this.vy = vy
    this.owner = owner // 'player' | 'enemy'
    this.damage = damage
    this.width = owner === 'player' ? 4 : 5
    this.height = owner === 'player' ? 14 : 12
    this.active = true
  }

  update(dt) {
    this.y += this.vy * dt
  }

  draw(ctx) {
    ctx.save()
    if (this.owner === 'player') {
      ctx.fillStyle = '#67e8f9'
      ctx.shadowColor = '#22d3ee'
      ctx.shadowBlur = 12
      ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height)
    } else {
      ctx.fillStyle = '#fb7185'
      ctx.shadowColor = '#f43f5e'
      ctx.shadowBlur = 10
      ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height)
    }
    ctx.restore()
  }

  getBounds() {
    return { x: this.x - this.width / 2, y: this.y, width: this.width, height: this.height }
  }
}