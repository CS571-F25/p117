import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('grabgrub_auth')
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth)
        if (authData.user && authData.isLoggedIn) {
          setCurrentUser(authData.user)
          setIsLoggedIn(true)
          setIsGuest(false)
        } else if (authData.isGuest) {
          setIsGuest(true)
          setIsLoggedIn(false)
          setCurrentUser(null)
        }
      } catch (error) {
        console.error('Error loading auth state:', error)
      }
    }
    setLoading(false)
  }, [])

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      const authData = {
        user: currentUser,
        isLoggedIn,
        isGuest
      }
      localStorage.setItem('grabgrub_auth', JSON.stringify(authData))
    }
  }, [currentUser, isLoggedIn, isGuest, loading])

  const signup = (name, email, password) => {
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('grabgrub_users') || '[]')
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' }
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      password, // In production, this would be hashed
      createdAt: new Date().toISOString()
    }

    // Save to localStorage
    users.push(newUser)
    localStorage.setItem('grabgrub_users', JSON.stringify(users))

    // Set auth state
    setCurrentUser(newUser)
    setIsLoggedIn(true)
    setIsGuest(false)

    return { success: true, user: newUser }
  }

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('grabgrub_users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      setCurrentUser(user)
      setIsLoggedIn(true)
      setIsGuest(false)
      return { success: true, user }
    }

    return { success: false, error: 'Invalid email or password' }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    setIsGuest(false)
  }

  const continueAsGuest = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    setIsGuest(true)
  }

  const value = {
    currentUser,
    isLoggedIn,
    isGuest,
    loading,
    signup,
    login,
    logout,
    continueAsGuest
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

