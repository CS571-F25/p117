import { useState, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import AppNavbar from './components/AppNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import NewPostPage from './pages/NewPostPage'
import PostDetailsPage from './pages/PostDetailsPage'
import DealsPage from './pages/DealsPage'
import NewDealPage from './pages/NewDealPage'
import DealDetailsPage from './pages/DealDetailsPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

// Sample initial data - only first post as example
const initialPosts = [
  {
    id: 1,
    title: 'Fresh Pizza Slices',
    location: 'Gordon Commons, Room 205',
    pickupWindow: 'Today 2pm - 5pm',
    note: 'Half a large pepperoni pizza, still warm! Perfect for a quick lunch. Please come pick it up.'
  }
]

// No initial deals - users will create their own
const initialDeals = []

function AppContent() {
  const { currentUser, isLoggedIn } = useAuth()
  
  // Load posts from localStorage or use initial posts
  const loadPosts = () => {
    try {
      const savedPosts = localStorage.getItem('grabgrub_posts')
      if (savedPosts) {
        const parsed = JSON.parse(savedPosts)
        if (parsed.length > 0) {
          return parsed
        }
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    }
    return initialPosts
  }

  // Load deals from localStorage or use initial deals
  const loadDeals = () => {
    try {
      const savedDeals = localStorage.getItem('grabgrub_deals')
      if (savedDeals) {
        const parsed = JSON.parse(savedDeals)
        if (parsed.length > 0) {
          return parsed
        }
      }
    } catch (error) {
      console.error('Error loading deals:', error)
    }
    return initialDeals
  }

  const loadedPosts = loadPosts()
  const loadedDeals = loadDeals()
  
  const [posts, setPosts] = useState(loadedPosts)
  const [deals, setDeals] = useState(loadedDeals)
  
  const [nextPostId, setNextPostId] = useState(() => {
    // Get the highest ID from loaded posts to set nextId
    if (loadedPosts.length > 0) {
      return Math.max(...loadedPosts.map(p => p.id)) + 1
    }
    return 2
  })

  const [nextDealId, setNextDealId] = useState(() => {
    // Get the highest ID from loaded deals to set nextId
    if (loadedDeals.length > 0) {
      return Math.max(...loadedDeals.map(d => d.id)) + 1
    }
    return 1
  })

  // Save posts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('grabgrub_posts', JSON.stringify(posts))
    } catch (error) {
      console.error('Error saving posts:', error)
    }
  }, [posts])

  // Save deals to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('grabgrub_deals', JSON.stringify(deals))
    } catch (error) {
      console.error('Error saving deals:', error)
    }
  }, [deals])

  const handleCreatePost = (formData) => {
    // Use logged-in user's ID, not persistent userId
    const creatorId = isLoggedIn && currentUser ? currentUser.id : null
    
    if (!creatorId) {
      alert('You must be logged in to create a post.')
      return
    }

    const newPost = {
      id: nextPostId,
      ...formData,
      creatorId: creatorId
    }
    setPosts(prevPosts => [newPost, ...prevPosts])
    setNextPostId(prev => prev + 1)
    
    // Return success to indicate post was created
    return true
  }

  const handleDeletePost = (postId) => {
    // Only allow deletion if user is logged in
    if (!isLoggedIn || !currentUser) {
      alert('You must be logged in to delete posts.')
      return
    }

    const post = posts.find(p => p.id === postId)
    if (post && post.creatorId === currentUser.id) {
      if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
      }
    } else {
      alert('You can only delete posts that you created.')
    }
  }

  const handleCreateDeal = (formData) => {
    // Use logged-in user's ID, not persistent userId
    const creatorId = isLoggedIn && currentUser ? currentUser.id : null
    
    if (!creatorId) {
      alert('You must be logged in to create a deal.')
      return
    }

    const newDeal = {
      id: nextDealId,
      ...formData,
      creatorId: creatorId
    }
    setDeals(prevDeals => [newDeal, ...prevDeals])
    setNextDealId(prev => prev + 1)
  }

  const handleDeleteDeal = (dealId) => {
    // Only allow deletion if user is logged in
    if (!isLoggedIn || !currentUser) {
      alert('You must be logged in to delete deals.')
      return
    }

    const deal = deals.find(d => d.id === dealId)
    if (deal && deal.creatorId === currentUser.id) {
      if (window.confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
        setDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealId))
      }
    } else {
      alert('You can only delete deals that you created.')
    }
  }

  // Get current user ID for checking ownership (only if logged in)
  const currentUserId = isLoggedIn && currentUser ? currentUser.id : null

  return (
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
        <Route 
          path="/deals" 
          element={<DealsPage deals={deals} onDeleteDeal={handleDeleteDeal} currentUserId={currentUserId} />} 
        />
        <Route 
          path="/deals/new" 
          element={
            <ProtectedRoute>
              <NewDealPage onCreateDeal={handleCreateDeal} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/deal/:id" 
          element={<DealDetailsPage deals={deals} onDeleteDeal={handleDeleteDeal} currentUserId={currentUserId} />} 
        />
      </Routes>
    </HashRouter>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
