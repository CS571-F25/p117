/**
 * Utility functions for time-based post expiration
 */

/**
 * Calculate the end datetime from pickup date and end time
 * @param {string} pickupDate - Date string in YYYY-MM-DD format
 * @param {string} endTime - Time string in HH:MM format
 * @returns {Date} End datetime object
 */
export function calculateEndDateTime(pickupDate, endTime) {
  if (!pickupDate || !endTime) return null
  
  // Combine date and time
  const [hours, minutes] = endTime.split(':')
  const endDateTime = new Date(pickupDate + 'T' + endTime + ':00')
  
  return endDateTime
}

/**
 * Check if a post has expired (current time is past end time)
 * @param {Date|string|number} endDateTime - End datetime (Date object, ISO string, or timestamp)
 * @returns {boolean} True if expired
 */
export function isPostExpired(endDateTime) {
  if (!endDateTime) return false
  
  const end = typeof endDateTime === 'string' || typeof endDateTime === 'number'
    ? new Date(endDateTime)
    : endDateTime
  
  return new Date() > end
}

/**
 * Calculate time remaining until post expires
 * @param {Date|string|number} endDateTime - End datetime
 * @returns {Object} Object with { hours, minutes, seconds, totalSeconds, isExpired }
 */
export function getTimeRemaining(endDateTime) {
  if (!endDateTime) {
    return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true }
  }
  
  const end = typeof endDateTime === 'string' || typeof endDateTime === 'number'
    ? new Date(endDateTime)
    : endDateTime
  
  const now = new Date()
  const diff = end - now
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true }
  }
  
  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  
  return { hours, minutes, seconds, totalSeconds, isExpired: false }
}

/**
 * Format time remaining as a human-readable string
 * @param {Object} timeRemaining - Object from getTimeRemaining()
 * @returns {string} Formatted string like "2h 30m" or "15m 30s" or "Expired"
 */
export function formatTimeRemaining(timeRemaining) {
  if (timeRemaining.isExpired) {
    return 'Expired'
  }
  
  const { hours, minutes, seconds } = timeRemaining
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

/**
 * Check if post is in the final 10 minutes (should show warning color)
 * @param {Date|string|number} endDateTime - End datetime
 * @returns {boolean} True if less than 10 minutes remaining
 */
export function isInFinalMinutes(endDateTime) {
  if (!endDateTime) return false
  
  const timeRemaining = getTimeRemaining(endDateTime)
  return !timeRemaining.isExpired && timeRemaining.totalSeconds < 600 // 10 minutes = 600 seconds
}

/**
 * Check if post expires within the next hour
 * @param {Date|string|number} endDateTime - End datetime
 * @returns {boolean} True if expires within 1 hour
 */
export function expiresWithinHour(endDateTime) {
  if (!endDateTime) return false
  
  const timeRemaining = getTimeRemaining(endDateTime)
  return !timeRemaining.isExpired && timeRemaining.totalSeconds <= 3600 // 1 hour = 3600 seconds
}

/**
 * Check if post expires today
 * @param {Date|string|number} endDateTime - End datetime
 * @returns {boolean} True if expires today
 */
export function expiresToday(endDateTime) {
  if (!endDateTime) return false
  
  const end = typeof endDateTime === 'string' || typeof endDateTime === 'number'
    ? new Date(endDateTime)
    : endDateTime
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endDate = new Date(end)
  endDate.setHours(0, 0, 0, 0)
  
  return endDate.getTime() === today.getTime()
}

