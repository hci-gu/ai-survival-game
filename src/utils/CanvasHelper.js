class CanvasHelper {
  constructor(canvasRef) {
    this.canvasRef = canvasRef
    this.context = canvasRef.current.getContext('2d')
  }

  draw(cells, player, settings) {
    if (!cells.length || !cells[0].length) return
    this.context.clearRect(
      0,
      0,
      settings.size * settings.cellSize,
      settings.size * settings.cellSize
    )
    this.drawWorld(cells, player.pos, settings)
    this.drawPlayer(player, settings)
  }

  drawWorld(cells, playerPos, { cellSize, size, playerViewDistance }) {
    const ctx = this.context
    const viewStartX = Math.max(0, playerPos.x - playerViewDistance)
    const viewEndX = Math.min(size, playerPos.x + playerViewDistance + 1)
    const viewStartY = Math.max(0, playerPos.y - playerViewDistance)
    const viewEndY = Math.min(size, playerPos.y + playerViewDistance + 1)

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

  drawPlayer({ pos, direction }, { cellSize }) {
    // translate player position to canvas coordinates
    const x = pos.x * cellSize
    const y = pos.y * cellSize
    const ctx = this.context

    ctx.beginPath()
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

  drawPlayerCompass(player, cells, { cellSize, size }) {
    // cells with food
    const foodCells = cells
  }
}

export default CanvasHelper
