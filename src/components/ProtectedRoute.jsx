import { Navigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { isLoggedIn, isGuest } = useAuth()

  if (isGuest || !isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

