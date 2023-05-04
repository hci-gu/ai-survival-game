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
      Hej
      <Divider m={16} />
      <Group position="center">
        <Checkbox value={accepted} onChange={() => setAccepted(!accepted)} />I
        agree
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
