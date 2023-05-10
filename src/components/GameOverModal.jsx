import { Button, Group, Modal, Space } from '@mantine/core'
import { useAtomValue, useSetAtom } from 'jotai'
import React from 'react'
import { gameStateAtom, playerAtom, updateGameStateAtom } from '../state'
import ConfettiExplosion from 'react-confetti-explosion'

const GameOverModal = () => {
  const state = useAtomValue(gameStateAtom)
  const { stats } = useAtomValue(playerAtom)
  const setGameState = useSetAtom(updateGameStateAtom)

  const playerWon = stats.age >= 500
  const message = playerWon
    ? 'You won! Press the button below to restart the game.'
    : 'You lost! Press the button below to restart the game.'

  return (
    <>
      <Modal opened={state === 'GAME_OVER'} title="Game over">
        {message}
        <Space h={16} />
        <Group position="center">
          <Button onClick={() => setGameState('RUNNING')}>Restart</Button>
          {playerWon && <ConfettiExplosion />}
        </Group>
      </Modal>
    </>
  )
}

export default GameOverModal
