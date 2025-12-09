/**
 * Utility functions for user-related operations
 */

/**
 * Get user information by user ID
 * @param {string} userId - User ID
 * @returns {Object|null} User object or null if not found
 */
export function getUserById(userId) {
  if (!userId) return null
  
  try {
    const users = JSON.parse(localStorage.getItem('grabgrub_users') || '[]')
    return users.find(u => u.id === userId) || null
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

/**
 * Get user email by user ID
 * @param {string} userId - User ID
 * @returns {string|null} User email or null if not found
 */
export function getUserEmail(userId) {
  const user = getUserById(userId)
  return user ? user.email : null
}

