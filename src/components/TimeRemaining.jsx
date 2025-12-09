import { useState, useEffect } from 'react'
import { Badge } from 'react-bootstrap'
import { getTimeRemaining, formatTimeRemaining, isInFinalMinutes } from '../utils/timeUtils'

/**
 * Component that displays time remaining until post expires
 * Shows green badge until 10 minutes before, then red
 */
function TimeRemaining({ endDateTime }) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(endDateTime))
  const [isFinalMinutes, setIsFinalMinutes] = useState(isInFinalMinutes(endDateTime))

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(endDateTime)
      setTimeRemaining(remaining)
      setIsFinalMinutes(isInFinalMinutes(endDateTime))
    }, 1000)

    return () => clearInterval(interval)
  }, [endDateTime])

  if (timeRemaining.isExpired) {
    return null // Don't show anything if expired (post should be filtered out)
  }

  const badgeColor = isFinalMinutes ? 'danger' : 'success'
  const formattedTime = formatTimeRemaining(timeRemaining)

  return (
    <Badge bg={badgeColor} style={{ fontSize: '0.95rem', padding: '0.4em 0.8em', fontWeight: '600' }}>
      {formattedTime} left
    </Badge>
  )
}

export default TimeRemaining

