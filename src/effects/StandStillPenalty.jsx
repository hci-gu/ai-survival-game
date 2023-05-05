import { useAtom, useAtomValue } from 'jotai'
import React, { useEffect } from 'react'
import { gameStateAtom, playerAtom } from '../state'

const StandStillPenalty = () => {
  const { state } = useAtomValue(gameStateAtom)
  const [{ pos }, set] = useAtom(playerAtom)

  useEffect(() => {
    if (state !== 'RUNNING') return

    let interval = setInterval(() => {
      set((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          hunger: prev.stats.hunger - 1,
          thirst: prev.stats.thirst - 1,
          age: prev.stats.age + 1,
        },
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [state, pos])
}

export default StandStillPenalty
