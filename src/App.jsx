import { useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import AppNavbar from './components/AppNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import NewPostPage from './pages/NewPostPage'
import PostDetailsPage from './pages/PostDetailsPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { getUserId } from './utils/userId'

// Sample initial data
const initialPosts = [
  {
    id: 1,
    title: 'Fresh Pizza Slices',
    location: 'Gordon Commons, Room 205',
    pickupWindow: 'Today 2pm - 5pm',
    note: 'Half a large pepperoni pizza, still warm! Perfect for a quick lunch. Please come pick it up.'
  },
  {
    id: 2,
    title: 'Leftover Chinese Food',
    location: 'Lakeshore Dorms, Building A',
    pickupWindow: 'Tomorrow 10am - 12pm',
    note: 'Kung Pao chicken and fried rice. Too much food for one person. Still good!'
  },
  {
    id: 3,
    title: 'Sandwiches & Wraps',
    location: 'Student Union, 2nd Floor',
    pickupWindow: 'Today 4pm - 6pm',
    note: 'Assorted sandwiches from a catering event. All wrapped and fresh. Vegetarian options available.'
  },
  {
    id: 4,
    title: 'Fresh Baked Cookies',
    location: 'Engineering Building, Room 301',
    pickupWindow: 'Today 1pm - 3pm',
    note: 'Homemade chocolate chip cookies. Made too many! Come grab some while they last.'
  },
  {
    id: 5,
    title: 'Pasta & Salad',
    location: 'Gordon Commons, Main Dining',
    pickupWindow: 'Today 6pm - 8pm',
    note: 'Leftover pasta with marinara sauce and a fresh garden salad. Great for dinner!'
  },
  {
    id: 6,
    title: 'Bagels & Cream Cheese',
    location: 'Library, Ground Floor',
    pickupWindow: 'Tomorrow 8am - 10am',
    note: 'Assorted bagels with cream cheese packets. Perfect for breakfast!'
  }
]

function App() {
  const [posts, setPosts] = useState(initialPosts)
  const [nextId, setNextId] = useState(7)
  const currentUserId = getUserId()

  const handleCreatePost = (formData) => {
    const newPost = {
      id: nextId,
      ...formData,
      creatorId: currentUserId
    }
    setPosts(prevPosts => [newPost, ...prevPosts])
    setNextId(prev => prev + 1)
  }

  const handleDeletePost = (postId) => {
    const post = posts.find(p => p.id === postId)
    if (post && post.creatorId === currentUserId) {
      if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
      }
    } else {
      alert('You can only delete posts that you created.')
    }
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <HashRouter>
          <AppNavbar />
          <Routes>
          <Route 
            path="/" 
            element={<HomePage posts={posts} onDeletePost={handleDeletePost} currentUserId={currentUserId} />} 
          />
          <Route 
            path="/about" 
            element={<AboutPage />} 
          />
          <Route 
            path="/login" 
            element={<LoginPage />} 
          />
          <Route 
            path="/signup" 
            element={<SignupPage />} 
          />
          <Route 
            path="/new" 
            element={
              <ProtectedRoute>
                <NewPostPage onCreatePost={handleCreatePost} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/post/:id" 
            element={<PostDetailsPage posts={posts} onDeletePost={handleDeletePost} currentUserId={currentUserId} />} 
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
