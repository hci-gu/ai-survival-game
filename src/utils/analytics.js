import axios from 'axios'
import { useEffect, useState } from 'react'

const VITE_API_URL = import.meta.env.VITE_API_URL
const VITE_API_KEY = import.meta.env.VITE_API_KEY
const DB_NAME = import.meta.env.VITE_DB_NAME

export const trackSession = async (data) => {
  const response = await axios.post(
    `${VITE_API_URL}/${DB_NAME}/sessions/data`,
    data,
    {
      headers: {
        'x-api-key': VITE_API_KEY,
      },
    }
  )
  return response.data
}

export const getSessions = async () => {
  const response = await axios.get(`${VITE_API_URL}/${DB_NAME}/sessions/data`, {
    headers: {
      'x-api-key': VITE_API_KEY,
    },
  })
  return response.data
}

export const useSessions = () => {
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    getSessions().then((sessions) =>
      setSessions(
        sessions
          .filter((session) => session.playerActions.length > 0)
          .map((session) => {
            const firstAction = session.playerActions[0]
            const lastAction =
              session.playerActions[session.playerActions.length - 1]
            return {
              ...session,
              duration: (lastAction.timestamp - firstAction.timestamp) / 1000,
            }
          })
          .filter((session) => session.duration < 2000)
      )
    )
  }, [])

  return sessions
}
