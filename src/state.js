import { atom } from 'jotai'
import Alea from 'alea'
import { focusAtom } from 'jotai-optics'
import { cellInfoForPos } from './utils'

const canvasSize = window.innerHeight - 32
const gridSize = 64

export const settingsAtom = atom({
  canvasSize,
  size: gridSize,
  cellSize: Math.round(canvasSize / gridSize),
  playerViewDistance: 100,
  foodCount: 30,
  waterCount: 30,
  wallCount: 288,
  maxAge: 500,
  maxHunger: 500,
  maxThirst: 500,
  reward: 25,
  penalty: 10,
})

export const gameStateAtom = atom({
  state: 'INIT',
  start: 0,
  sessions: 0,
})
export const updateGameStateAtom = atom(null, (get, set, state) => {
  const gameState = get(gameStateAtom)
  switch (state) {
    case 'INIT':
      set(gameStateAtom, { state })
      break
    case 'RUNNING':
      const session = gameState.sessions + 1
      set(randomAtom, session)
      set(playerAtom, defaultPlayerState())
      set(gameStateAtom, {
        state,
        start: Date.now(),
        sessions: session,
      })
      break
    case 'GAME_OVER':
      set(gameStateAtom, { state })
      break
  }
})

export const randomAtom = atom(
  () => new Alea(1),
  (_get, set, seed) => new Alea(seed)
)

const defaultPlayerState = () => ({
  pos: {
    x: Math.floor(gridSize / 2),
    y: Math.floor(gridSize / 2),
  },
  direction: 'RIGHT',
  stats: {
    age: 0,
    hunger: 150,
    thirst: 150,
  },
})
export const playerAtom = atom(defaultPlayerState())

export const worldAtom = atom([[]])

export const generateWorldAtom = atom(null, (get, set, _) => {
  const prng = get(randomAtom)
  const settings = get(settingsAtom)
  const cells = Array.from({ length: settings.size }, () =>
    Array.from({ length: settings.size }, () => ({ type: 'empty' }))
  )

  for (let i = 0; i < settings.wallCount; i++) {
    const wallLength = Math.floor(prng() * 3) + 3
    const startX = Math.floor(prng() * settings.size)
    const startY = Math.floor(prng() * settings.size)
    const isHorizontal = prng() < 0.5

    for (let j = 0; j < wallLength; j++) {
      let x, y

      if (isHorizontal) {
        x = (startX + j) % settings.size
        y = startY
      } else {
        x = startX
        y = (startY + j) % settings.size
      }

      cells[y][x] = { type: 'wall' }
    }
  }

  // "punch a hole in the middle"
  const holeSize = 3

  for (let i = 0; i < holeSize; i++) {
    for (let j = 0; j < holeSize; j++) {
      const x = Math.floor(settings.size / 2) - Math.floor(holeSize / 2) + i
      const y = Math.floor(settings.size / 2) - Math.floor(holeSize / 2) + j
      cells[y][x] = { type: 'empty' }
    }
  }

  // place food and water
  for (let i = 0; i < settings.foodCount; i++) {
    let x, y
    do {
      x = Math.floor(prng() * settings.size)
      y = Math.floor(prng() * settings.size)
    } while (!cellInfoForPos(cells, { x, y }, settings.size)[0])

    cells[y][x] = { item: 'food', type: 'empty' }
  }

  for (let i = 0; i < settings.waterCount; i++) {
    let x, y
    do {
      x = Math.floor(prng() * settings.size)
      y = Math.floor(prng() * settings.size)
    } while (!cellInfoForPos(cells, { x, y }, settings.size)[0])

    cells[y][x] = { item: 'water', type: 'empty' }
  }

  set(worldAtom, cells)
})

export const foodAndWaterAtom = atom(
  (get) => {
    const cells = get(worldAtom)

    const food = []
    const water = []

    cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.item === 'food') {
          food.push({ x, y })
        } else if (cell.item === 'water') {
          water.push({ x, y })
        }
      })
    })

    return { food, water }
  },
  (get, set, { pos, type }) => {
    const prng = get(randomAtom)
    const cells = get(worldAtom)
    const settings = get(settingsAtom)

    // remove food or water from cell
    cells[pos.y][pos.x] = { type: 'empty' }

    // add food or water to random cell
    let x, y
    do {
      x = Math.floor(prng() * settings.size)
      y = Math.floor(prng() * settings.size)
    } while (!cellInfoForPos(cells, { x, y }, settings.size)[0])

    cells[y][x] = { item: type, type: 'empty' }

    set(worldAtom, [...cells])
  }
)

export const playerMovementAtom = atom(
  (get) => {
    return {
      pos: get(playerAtom).pos,
      direction: get(playerAtom).direction,
    }
  },
  (get, set, key) => {
    const { state } = get(gameStateAtom)
    if (state !== 'RUNNING') return

    const player = get(playerAtom)
    const cells = get(worldAtom)
    const settings = get(settingsAtom)

    const updateObj = {
      stats: {
        ...player.stats,
        age: player.stats.age + 1,
        hunger: player.stats.hunger - 1,
        thirst: player.stats.thirst - 1,
      },
    }

    switch (key) {
      case 'ArrowUp':
        // move player forward
        let newPos
        switch (player.direction) {
          case 'UP':
            newPos = { ...player.pos, y: player.pos.y - 1 }
            break
          case 'RIGHT':
            newPos = { ...player.pos, x: player.pos.x + 1 }
            break
          case 'DOWN':
            newPos = { ...player.pos, y: player.pos.y + 1 }
            break
          case 'LEFT':
            newPos = { ...player.pos, x: player.pos.x - 1 }
            break
        }
        const [isEmpty, item] = cellInfoForPos(cells, newPos, settings.size)
        if (isEmpty) {
          updateObj.pos = newPos
          if (item) {
            if (item === 'food') {
              updateObj.stats.hunger = Math.min(
                player.stats.hunger + settings.reward,
                settings.maxHunger
              )
            } else if (item === 'water') {
              updateObj.stats.thirst = Math.min(
                player.stats.thirst + settings.reward,
                settings.maxThirst
              )
            }
            set(foodAndWaterAtom, { pos: newPos, type: item })
          }
        } else {
          updateObj.stats.hunger = Math.max(
            player.stats.hunger - settings.penalty,
            0
          )
          updateObj.stats.thirst = Math.max(
            player.stats.thirst - settings.penalty,
            0
          )
        }
        break
      case 'ArrowLeft':
        switch (player.direction) {
          case 'UP':
            updateObj.direction = 'LEFT'
            break
          case 'RIGHT':
            updateObj.direction = 'UP'
            break
          case 'DOWN':
            updateObj.direction = 'LEFT'
            break
          case 'LEFT':
            updateObj.direction = 'DOWN'
            break
          default:
        }
        break
      case 'ArrowRight':
        switch (player.direction) {
          case 'UP':
            updateObj.direction = 'RIGHT'
            break
          case 'RIGHT':
            updateObj.direction = 'DOWN'
            break
          case 'DOWN':
            updateObj.direction = 'RIGHT'
            break
          case 'LEFT':
            updateObj.direction = 'UP'
            break
          default:
        }
      default:
        break
    }

    updateObj.age = player.age + 1

    set(playerAtom, { ...player, ...updateObj })
  }
)
