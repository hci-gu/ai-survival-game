import { useAtomValue, useSetAtom } from 'jotai'
import React, { useRef, useEffect, useMemo } from 'react'
import {
  gameStateAtom,
  generateWorldAtom,
  playerMovementAtom,
  settingsAtom,
  worldAtom,
} from './state'
import CanvasHelper from './utils/CanvasHelper'
import { DevTools } from 'jotai-devtools'
import styled from '@emotion/styled'
import GameInfo from './components/GameInfo'
import Movement from './effects/Movement'
import IntroductionModal from './components/IntroductionModal'
import GenerateWorld from './effects/GenerateWorld'
import GameOver from './effects/GameOver'
import GameOverModal from './components/GameOverModal'
import StandStillPenalty from './effects/StandStillPenalty'

const Canvas = () => {
  const canvasRef = useRef()
  const canvasHelper = useMemo(
    () => (canvasRef.current ? new CanvasHelper(canvasRef) : null),
    [canvasRef.current]
  )
  const { state } = useAtomValue(gameStateAtom)
  const cells = useAtomValue(worldAtom)
  const settings = useAtomValue(settingsAtom)
  const player = useAtomValue(playerMovementAtom)

  useEffect(() => {
    if (state !== 'RUNNING') return
    canvasHelper?.draw(cells, player, settings)
  }, [canvasHelper, cells, player, settings])

  return (
    <canvas
      ref={canvasRef}
      width={settings.canvasSize}
      height={settings.canvasSize}
    />
  )
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  > canvas {
    margin-top: 16px;
  }
`

const Game = () => {
  return (
    <>
      <Container>
        <div></div>
        <Canvas />
        <GameInfo />
      </Container>
      <IntroductionModal />
      <GameOverModal />
      <DevTools />
      {/* Effects */}
      <Movement />
      <GenerateWorld />
      <GameOver />
      <StandStillPenalty />
    </>
  )
}

export default Game
