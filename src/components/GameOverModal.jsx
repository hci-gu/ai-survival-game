import { Button, Group, Modal, Space } from '@mantine/core'
import { useAtomValue, useSetAtom } from 'jotai'
import React from 'react'
import { gameStateAtom, updateGameStateAtom } from '../state'

const GameOverModal = () => {
  const { state } = useAtomValue(gameStateAtom)
  const setGameState = useSetAtom(updateGameStateAtom)

  return (
    <Modal opened={state === 'GAME_OVER'} title="Game over">
      You lost! Press the button below to restart the game.
      <Space h={16} />
      <Group position="center">
        <Button onClick={() => setGameState('RUNNING')}>Restart</Button>
      </Group>
    </Modal>
  )
}

export default GameOverModal
