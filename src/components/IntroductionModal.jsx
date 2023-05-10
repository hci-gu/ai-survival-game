import { Button, Checkbox, Divider, Group, Modal, Space } from '@mantine/core'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useState } from 'react'
import {
  gameStateAtom,
  playerIdAtom,
  sessionNumberAtom,
  updateGameStateAtom,
} from '../state'
import { v4 as uuidv4 } from 'uuid'
import { IconSettings } from '@tabler/icons-react'
import SettingsModal from './SettingsModal'

const FirstTimeContent = ({ callback }) => {
  const [accepted, setAccepted] = useState(false)

  return (
    <>
      Welcome to this survival game! Our goal is to test the performance of
      humans versus AI. The objective is simple: survive as long as possible.
      However, you need to keep track of your hunger and thirst levels. If
      either one runs out, you die.
      <br></br>
      <br></br>
      To stay alive, you must search for food and water. Once you step on green
      food or blue water, your hunger and thirst levels will increase
      respectively.
      <br></br>
      <br></br>
      Please note that we will be recording
      <ul>
        <li>your movements</li>
        <li>length of your game session</li>
        <li>and if you survived the full period.</li>
      </ul>
      We only record your actions in the game, and nothing outside of it.
      <br></br>
      <br></br>
      If you agree with these terms, let's get started! Good luck surviving!
      <Group position="center">
        <Group>
          <Checkbox value={accepted} onChange={() => setAccepted(!accepted)} />I
          agree
        </Group>
      </Group>
      <Space h={16} />
      <Group position="center">
        <Button disabled={!accepted} onClick={() => callback(true)}>
          Start
        </Button>
      </Group>
    </>
  )
}

const ReturningPlayerContent = ({ callback }) => {
  return (
    <>
      Welcome back! Is it still the same person playing or do you want to
      restart as a new player?
      <Space h={16} />
      <Group>
        <Button onClick={() => callback(false)}>Still the same person</Button>
        <Button color="red" onClick={() => callback(true)}>
          No, start as a new player
        </Button>
      </Group>
    </>
  )
}

const IntroductionModal = () => {
  const [settingsVisible, setSettingsVisible] = useState(false)
  const state = useAtomValue(gameStateAtom)
  const [playerId, setPlayerId] = useAtom(playerIdAtom)
  const setSessionNumber = useSetAtom(sessionNumberAtom)
  const setGameState = useSetAtom(updateGameStateAtom)

  const handleStart = (reset = false) => {
    if (reset) {
      setSessionNumber(0)
      setPlayerId(uuidv4())
    }
    setGameState('RUNNING')
  }

  return (
    <>
      <Modal.Root
        opened={state === 'INIT'}
        onClose={() => {}}
        title="Introduction"
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Introduction</Modal.Title>
            <Button variant="subtle" onClick={() => setSettingsVisible(true)}>
              <IconSettings />
            </Button>
          </Modal.Header>
          <Modal.Body>
            {playerId != null ? (
              <FirstTimeContent callback={handleStart} />
            ) : (
              <ReturningPlayerContent callback={handleStart} />
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <SettingsModal
        opened={settingsVisible}
        close={() => setSettingsVisible(false)}
      />
    </>
  )
}

export default IntroductionModal
