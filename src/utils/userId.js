// Utility to get or create a unique user ID stored in localStorage
export function getUserId() {
  let userId = localStorage.getItem('grabgrub_userId')
  if (!userId) {
    // Generate a simple unique ID (timestamp + random)
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('grabgrub_userId', userId)
  }
  return userId
}

