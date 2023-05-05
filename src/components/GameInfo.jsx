import { useAtomValue } from 'jotai'
import React from 'react'
import { playerAtom, settingsAtom } from '../state'
import ProgressBar from './ProgressBar'
import styled from '@emotion/styled'
import { Group, Space } from '@mantine/core'
import { IconApple } from '@tabler/icons-react'
import { IconBottle } from '@tabler/icons-react'

const Container = styled.div`
  display: flex;
  flex-direction: column;

  padding: 1rem;

  span {
    font-size: 18px;
  }

  > div {
    display: flex;
    align-items: center;

    > div {
      width: 100%;
    }
  }
`

const GameInfo = () => {
  const { stats } = useAtomValue(playerAtom)
  const settings = useAtomValue(settingsAtom)

  return (
    <Container>
      <div>
        <IconApple size={48} color="#4caf50" />
        <ProgressBar
          value={stats.hunger}
          maxValue={settings.maxHunger}
          color="#4caf50"
        />
      </div>
      <Space h={16} />
      <div>
        <IconBottle size={48} color="#2196f3" />
        <ProgressBar
          value={stats.thirst}
          maxValue={settings.maxThirst}
          color="#2196f3"
        />
      </div>
      <ProgressBar
        label={`Age: ${stats.age} ( reach 500 to win )`}
        value={stats.age}
        maxValue={settings.maxThirst}
        color="#FFC857"
      />
    </Container>
  )
}

export default GameInfo
