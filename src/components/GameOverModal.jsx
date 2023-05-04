import { Button, Modal } from '@mantine/core'
import { useAtomValue, useSetAtom } from 'jotai'
import React from 'react'
import { gameStateAtom, updateGameStateAtom } from '../state'

const GameOverModal = () => {
  const { state } = useAtomValue(gameStateAtom)
  const setGameState = useSetAtom(updateGameStateAtom)

  return (
    <Modal opened={state === 'GAME_OVER'} title="Game over">
      Hellos
      <Button onClick={() => setGameState('RUNNING')}>Restart</Button>
    </Modal>
  )
}

export default GameOverModal
