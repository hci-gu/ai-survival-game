import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useEffect } from 'react'
import { gameStateAtom, playerAtom, playerMovementAtom } from '../state'

const StandStillPenalty = () => {
  const { state } = useAtomValue(gameStateAtom)
  const movePlayer = useSetAtom(playerMovementAtom)
  const [{ pos }, set] = useAtom(playerAtom)

  useEffect(() => {
    if (state !== 'RUNNING') return

    let interval = setInterval(() => movePlayer('STILL'), 1000)

    return () => clearInterval(interval)
  }, [state, pos])
}

export default StandStillPenalty
