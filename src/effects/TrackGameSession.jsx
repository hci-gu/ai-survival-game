import { useAtom, useAtomValue } from 'jotai'
import { useEffect } from 'react'
import {
  gameStateAtom,
  playerActionsAtom,
  playerAtom,
  playerIdAtom,
  sessionNumberAtom,
  settingsAtom,
} from '../state'
import * as analytics from '../utils/analytics'

const TrackGameSession = () => {
  const state = useAtomValue(gameStateAtom)
  const sessionNumber = useAtomValue(sessionNumberAtom)
  const { stats } = useAtomValue(playerAtom)
  const settings = useAtomValue(settingsAtom)
  const [_, setPlayerActions] = useAtom(playerActionsAtom)
  const playerId = useAtomValue(playerIdAtom)

  useEffect(() => {
    if (state === 'GAME_OVER') {
      setPlayerActions((actions) => {
        analytics.trackSession({
          playerId,
          timestamp: Date.now(),
          playerActions: actions,
          settings,
          sessionNumber,
          stats,
        })
        return []
      })
    }
  }, [state, settings, playerId])

  return null
}

export default TrackGameSession
