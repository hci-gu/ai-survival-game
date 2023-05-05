import { useAtomValue, useSetAtom } from 'jotai'
import { playerAtom, updateGameStateAtom } from '../state'
import { useEffect } from 'react'

const GameOver = () => {
  const { stats } = useAtomValue(playerAtom)
  const setGameState = useSetAtom(updateGameStateAtom)

  useEffect(() => {
    if (stats.hunger <= 0 || stats.thirst <= 0 || stats.age >= 500) {
      setGameState('GAME_OVER')
    }
  }, [stats])

  return null
}

export default GameOver
