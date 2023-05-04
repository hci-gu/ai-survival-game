import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const Root = () => {
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
