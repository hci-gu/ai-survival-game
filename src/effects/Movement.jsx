import { useSetAtom } from 'jotai'
import { playerMovementAtom } from '../state'
import { useKey } from 'react-use'

const Movement = () => {
  const movePlayer = useSetAtom(playerMovementAtom)
  useKey('ArrowUp', () => movePlayer('ArrowUp'))
  useKey('ArrowLeft', () => movePlayer('ArrowLeft'))
  useKey('ArrowRight', () => movePlayer('ArrowRight'))

  return null
}

export default Movement
