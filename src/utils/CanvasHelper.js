class CanvasHelper {
  constructor(canvasRef) {
    this.canvasRef = canvasRef
    this.context = canvasRef.current.getContext('2d')
  }

  draw(cells, player, settings) {
    if (!cells.length || !cells[0].length) return
    const canvasSize = Math.min(window.innerHeight, window.innerWidth) - 32
    this.cellSize = Math.round(canvasSize / settings.size)
    this.context.clearRect(
      0,
      0,
      settings.size * this.cellSize,
      settings.size * this.cellSize
    )
    this.drawWorld(cells, player.pos, settings)
    this.drawPlayerCompass(player, cells, settings, 'food', '#4caf50')
    this.drawPlayerCompass(player, cells, settings, 'water', '#2196f3')
    this.drawPlayer(player)
  }

  drawWorld(cells, playerPos, { size, playerViewDistance }) {
    const cellSize = this.cellSize
    const ctx = this.context
    const viewStartX = Math.max(0, playerPos.x - playerViewDistance)
    const viewEndX = Math.min(size, playerPos.x + playerViewDistance + 1)
    const viewStartY = Math.max(0, playerPos.y - playerViewDistance)
    const viewEndY = Math.min(size, playerPos.y + playerViewDistance + 1)

    // make the whole field of off white
    ctx.fillStyle = '#F5F5F5'
    ctx.fillRect(
      viewStartX * cellSize,
      viewStartY * cellSize,
      (viewEndX - viewStartX) * cellSize,
      (viewEndY - viewStartY) * cellSize
    )

    for (let y = viewStartY; y < viewEndY; y++) {
      for (let x = viewStartX; x < viewEndX; x++) {
        if (cells[y][x].type === 'wall') {
          ctx.fillStyle = '#040F16'
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        } else {
          const item = cells[y][x].item
          if (item === 'food') {
            // draw food as slightly smaller than the cell size with borderRadius
            ctx.fillStyle = '#4caf50'
            ctx.beginPath()
            ctx.roundRect(
              x * cellSize + 1,
              y * cellSize + 1,
              cellSize - 2,
              cellSize - 2,
              4
            )
            ctx.fill()
          } else if (item === 'water') {
            ctx.fillStyle = '#2196f3'
            ctx.beginPath()
            ctx.roundRect(
              x * cellSize + 1,
              y * cellSize + 1,
              cellSize - 2,
              cellSize - 2,
              4
            )
            ctx.fill()
          }
        }
      }
    }
  }

  drawPlayer({ pos, direction }) {
    const cellSize = this.cellSize
    // translate player position to canvas coordinates
    const x = pos.x * cellSize
    const y = pos.y * cellSize
    const ctx = this.context

    ctx.beginPath()
    ctx.strokeStyle = '#B80C09'
    switch (direction) {
      case 'UP':
        ctx.beginPath()
        ctx.moveTo(x + cellSize / 2, y + cellSize + cellSize / 4)
        ctx.lineTo(x + cellSize / 2, y + cellSize)
        ctx.strokeStyle = '#B80C09'
        ctx.lineWidth = 4
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x + cellSize / 2, y)
        ctx.lineTo(x, y + cellSize)
        ctx.lineTo(x + cellSize, y + cellSize)
        ctx.closePath()
        ctx.fillStyle = '#B80C09'
        break
      case 'RIGHT':
        ctx.beginPath()
        ctx.moveTo(x, y + cellSize / 2)
        ctx.lineTo(x - cellSize / 4, y + cellSize / 2)
        ctx.strokeStyle = '#B80C09'
        ctx.lineWidth = 4
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x + cellSize, y + cellSize / 2)
        ctx.lineTo(x, y)
        ctx.lineTo(x, y + cellSize)
        ctx.closePath()
        ctx.fillStyle = '#B80C09'
        break
      case 'DOWN':
        ctx.beginPath()
        ctx.moveTo(x + cellSize / 2, y)
        ctx.lineTo(x + cellSize / 2, y - cellSize / 4)
        ctx.strokeStyle = '#B80C09'
        ctx.lineWidth = 4
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x + cellSize / 2, y + cellSize)
        ctx.lineTo(x, y)
        ctx.lineTo(x + cellSize, y)
        ctx.closePath()
        ctx.fillStyle = '#B80C09'
        break
      case 'LEFT':
        ctx.beginPath()
        ctx.moveTo(x + cellSize, y + cellSize / 2)
        ctx.lineTo(x + cellSize + cellSize / 4, y + cellSize / 2)
        ctx.strokeStyle = '#B80C09'
        ctx.lineWidth = 4
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x, y + cellSize / 2)
        ctx.lineTo(x + cellSize, y)
        ctx.lineTo(x + cellSize, y + cellSize)
        ctx.closePath()
        ctx.fillStyle = '#B80C09'
        break
      default:
        break
    }

    ctx.closePath()
    ctx.fillStyle = '#B80C09'
    ctx.fill()
  }

  drawPlayerCompass(player, cells, { size }, type, color) {
    const cellSize = this.cellSize
    const cellsWithFood = []

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const cell = cells[y][x]
        if (cell.item === type) {
          const distance = Math.sqrt(
            (player.pos.x - x) * (player.pos.x - x) +
              (player.pos.y - y) * (player.pos.y - y)
          )
          const direction = {
            x: x - player.pos.x,
            y: y - player.pos.y,
          }
          const length = Math.sqrt(
            direction.x * direction.x + direction.y * direction.y
          )
          const normalizedDirection = {
            x: direction.x / length,
            y: direction.y / length,
          }

          cellsWithFood.push({
            x,
            y,
            normalizedDirection,
            distance,
            intensity: 1 / (distance * distance),
          })
        }
      }
    }

    // calculate average direction with distance weighting
    let weightedAverageDirection = { x: 0, y: 0 }
    for (let i = 0; i < cellsWithFood.length; i++) {
      const weight = cellsWithFood[i].intensity
      weightedAverageDirection.x +=
        cellsWithFood[i].normalizedDirection.x * weight
      weightedAverageDirection.y +=
        cellsWithFood[i].normalizedDirection.y * weight
    }

    // normalize the weighted average direction
    const length = Math.sqrt(
      weightedAverageDirection.x * weightedAverageDirection.x +
        weightedAverageDirection.y * weightedAverageDirection.y
    )
    weightedAverageDirection.x /= length
    weightedAverageDirection.y /= length

    const ctx = this.context
    const x = player.pos.x * cellSize + cellSize / 2
    const y = player.pos.y * cellSize + cellSize / 2

    ctx.fillStyle = color
    ctx.strokeStyle = color
    // set opacity based on total intensity
    // ctx.globalAlpha = Math.min(1, totalIntensity / 2)
    this.canvas_arrow(
      player.pos.x * cellSize + cellSize / 2,
      player.pos.y * cellSize + cellSize / 2,
      x + weightedAverageDirection.x * cellSize * 2,
      y + weightedAverageDirection.y * cellSize * 2
    )
    // ctx.globalAlpha = 1
    // ctx.scale(1 / arrowScale, 1 / arrowScale)
  }

  canvas_arrow(fromx, fromy, tox, toy, r = 8) {
    var context = this.context
    var x_center = tox
    var y_center = toy

    var angle
    var x
    var y

    context.beginPath()
    context.moveTo(fromx, fromy)
    context.lineTo(tox, toy)
    context.lineWidth = 3
    context.stroke()
    context.closePath()

    context.beginPath()

    angle = Math.atan2(toy - fromy, tox - fromx)
    x = r * Math.cos(angle) + x_center
    y = r * Math.sin(angle) + y_center

    context.moveTo(x, y)

    angle += Math.PI / 1.5
    x = r * Math.cos(angle) + x_center
    y = r * Math.sin(angle) + y_center

    context.lineTo(x, y)

    angle += Math.PI / 1.5
    x = r * Math.cos(angle) + x_center
    y = r * Math.sin(angle) + y_center

    context.lineTo(x, y)
    context.closePath()
    context.lineWidth = 3
    context.stroke()
    context.fill()
  }
}

export default CanvasHelper
