import { useAtomValue, useSetAtom } from 'jotai'
import { gameStateAtom, generateWorldAtom } from '../state'
import { useEffect } from 'react'

const GenerateWorld = () => {
  const state = useAtomValue(gameStateAtom)
  const generateWorld = useSetAtom(generateWorldAtom)

  useEffect(() => {
    if (state !== 'RUNNING') return
    generateWorld()
  }, [state])

  return null
}

export default GenerateWorld
