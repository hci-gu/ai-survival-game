import React from 'react'
import './ProgressBar.css'

const ProgressBar = ({ label, value, maxValue, color }) => {
  const percentage = (value / maxValue) * 100

  return (
    <div className="progress-bar-container">
      {label && <span className="progress-bar-label">{label}</span>}
      <div className="progress-bar-background">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
