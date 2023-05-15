export const cellInfoForPos = (cells, pos, size, playerPos) => {
  if (!pos || pos.x < 0 || pos.y < 0 || pos.x >= size || pos.y >= size) {
    return [false, false]
  }
  const cell = cells[pos.y][pos.x]
  const playerCell = playerPos && playerPos.x === pos.x && playerPos.y === pos.y
  return [!playerCell && cell.type === 'empty', cell.item]
}
