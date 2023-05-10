import axios from 'axios'

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
