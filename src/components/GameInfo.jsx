import { useAtomValue } from 'jotai'
import React from 'react'
import { playerAtom, settingsAtom } from '../state'
import ProgressBar from './ProgressBar'
import styled from '@emotion/styled'

const Container = styled.div`
  display: flex;
  flex-direction: column;

  padding: 1rem;

  span {
    font-size: 18px;
  }
`

const GameInfo = () => {
  const { stats } = useAtomValue(playerAtom)
  const settings = useAtomValue(settingsAtom)

  return (
    <Container>
      <ProgressBar
        label="Hunger"
        value={stats.hunger}
        maxValue={settings.maxHunger}
        color="#4caf50"
      />
      <ProgressBar
        label="Thirst"
        value={stats.thirst}
        maxValue={settings.maxThirst}
        color="#2196f3"
      />
      <span>Age: {stats.age}</span>
    </Container>
  )
}

export default GameInfo
