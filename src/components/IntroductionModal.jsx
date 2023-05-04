import { Button, Checkbox, Divider, Group, Modal, Space } from '@mantine/core'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useState } from 'react'
import { gameStateAtom, updateGameStateAtom } from '../state'

const IntroductionModal = () => {
  const { state } = useAtomValue(gameStateAtom)
  const setGameState = useSetAtom(updateGameStateAtom)
  const [accepted, setAccepted] = useState(false)

  return (
    <Modal opened={state === 'INIT'} onClose={() => {}} title="Introduction">
      Welcome to this game, this is an experiment to see how well human
      performance can stack up to AI.
      <br></br>
      <br></br>
      The game is a simple survival game where your goal is to survive as long
      as possible. Whenever you move you spend hunger and thirst, if you run out
      you die.
      <br></br>
      <br></br>
      To survive you need to find food and water, if you walk over food (green)
      or water(blue) you will pick it up and your hunger/thirst will fill up.
      <br></br>
      <br></br>
      Good luck!
      <Divider m={16} />
      <Group position="center">
        This game will record your actions the performance of all players. The
        following is recorded:
        <ul>
          <li>- Your movements in the game</li>
          <li>- If you managed to survive the full period</li>
          <li>- The length of your game session</li>
        </ul>
        Check the box if you agree with this.
        <br></br>
        Nothing outside of actions in this game is recorded.
        <br></br>
        <Group>
          <Checkbox value={accepted} onChange={() => setAccepted(!accepted)} />I
          agree
        </Group>
      </Group>
      <Space h={16} />
      <Group position="center">
        <Button disabled={!accepted} onClick={() => setGameState('RUNNING')}>
          Start
        </Button>
      </Group>
    </Modal>
  )
}

export default IntroductionModal
