import { useSetAtom } from 'jotai'
import { playerMovementAtom } from '../state'
import { useKey } from 'react-use'

const Movement = () => {
  const movePlayer = useSetAtom(playerMovementAtom)
  useKey('ArrowUp', () => movePlayer('UP'))
  useKey('ArrowLeft', () => movePlayer('LEFT'))
  useKey('ArrowRight', () => movePlayer('RIGHT'))
  useKey('ArrowDown', () => movePlayer('DOWN'))

  return null
}

export default Movement
