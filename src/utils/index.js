export const cellInfoForPos = (cells, pos, size) => {
  if (pos.x < 0 || pos.y < 0 || pos.x >= size || pos.y >= size) {
    return [false, false]
  }
  const cell = cells[pos.y][pos.x]
  return [cell.type === 'empty', cell.item]
}
