import React from 'react'
import styled from '@emotion/styled'
import * as analytics from './utils/analytics'
import { Grid, Group, Paper, SimpleGrid, Text } from '@mantine/core'

const Container = styled.div`
  margin: 1rem auto;
  width: 80%;
  height: 100%;
`

const Stat = ({ title, value, asPercent }) => {
  return (
    <Paper withBorder p="md" radius="md" key={title}>
      <Group position="apart">
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
            {title}
          </Text>
          <Text fw={700} fz="xl">
            {asPercent ? `${(value * 100).toFixed(1)}%` : `${value}`}
          </Text>
        </div>
      </Group>
    </Paper>
  )
}

const Stats = ({ title, sessions }) => {
  const averageSessionAge =
    sessions.reduce((acc, session) => acc + session.stats.age, 0) /
    sessions.length
  const averageSuccessRate =
    sessions.reduce(
      (acc, session) => acc + (session.stats.age >= 500 ? 1 : 0),
      0
    ) / sessions.length
  const sessionsWithActions = sessions.filter(
    (session) => session.playerActions.length > 0
  )
  const averageSessionTime =
    sessionsWithActions.reduce((acc, session) => {
      const firstAction = session.playerActions[0]
      const lastAction = session.playerActions[session.playerActions.length - 1]
      const sessionTime = lastAction.timestamp - firstAction.timestamp
      return acc + sessionTime
    }, 0) /
    sessionsWithActions.length /
    1000

  return (
    <>
      <Text fw={700} fz="xl" mt="lg">
        {title}
      </Text>
      <SimpleGrid cols={4}>
        <Stat title="Sessions" value={sessions.length} />
        <Stat
          title="Average session age"
          value={averageSessionAge.toFixed(1)}
        />
        <Stat
          title="Average session time ( seconds )"
          value={averageSessionTime.toFixed(1)}
        />
        <Stat
          title="Average success rate"
          value={averageSuccessRate}
          asPercent
        />
      </SimpleGrid>
    </>
  )
}

const difficultyKey = (session) =>
  `${session.settings.foodCount}/${session.settings.waterCount}`

const Analytics = () => {
  const sessions = analytics.useSessions()
  const sessionsWith30Food = sessions.filter(
    (session) => session.settings.foodCount >= 30
  )
  const sessionsWith20Food = sessions.filter(
    (session) => session.settings.foodCount === 20
  )
  const sessionsWith15Food = sessions.filter(
    (session) => session.settings.foodCount === 15
  )

  const players = sessions.reduce((acc, session) => {
    if (!acc[session.playerId]) {
      acc[session.playerId] = {
        [difficultyKey(session)]: [session],
      }
    } else {
      if (!acc[session.playerId][difficultyKey(session)]) {
        acc[session.playerId][difficultyKey(session)] = [session]
      } else {
        acc[session.playerId][difficultyKey(session)].push(session)
      }
    }
    return acc
  }, {})

  console.log(players)

  return (
    <Container>
      <h1>Analytics</h1>

      <Stats title="All sessions" sessions={sessions} />

      <Stats title="30 food/water" sessions={sessionsWith30Food} />
      <Stats title="20 food/water" sessions={sessionsWith20Food} />
      <Stats title="15 food/water" sessions={sessionsWith15Food} />

      <h1>Players - {Object.keys(players).length}</h1>
      {Object.keys(players).map((playerId) => {
        const playerDifficulties = players[playerId]

        return Object.keys(playerDifficulties).map((difficulty) => {
          const sessions = playerDifficulties[difficulty]
          return (
            <Stats title={`${playerId} - ${difficulty}`} sessions={sessions} />
          )
        })
      })}
    </Container>
  )
}

export default Analytics
