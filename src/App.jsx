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
import { isPostExpired } from './utils/timeUtils'

// No initial data - users will create their own posts and deals
const initialPosts = []
const initialDeals = []

function AppContent() {
  const { currentUser, isLoggedIn } = useAuth()
  
  // Load posts from localStorage (no placeholder posts)
  // Filter out posts without images to remove placeholder data
  const loadPosts = () => {
    try {
      const savedPosts = localStorage.getItem('grabgrub_posts')
      if (savedPosts) {
        const parsed = JSON.parse(savedPosts)
        // Only keep posts that have images (filter out placeholder posts without images)
        const postsWithImages = parsed.filter(post => {
          const hasImages = post.images && post.images.length > 0
          const hasImage = post.image && post.image.trim() !== ''
          return hasImages || hasImage
        })
        // Save the filtered list back to localStorage
        if (postsWithImages.length !== parsed.length) {
          localStorage.setItem('grabgrub_posts', JSON.stringify(postsWithImages))
        }
        return postsWithImages
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    }
    return [] // Return empty array if no saved posts
  }

  // Load deals from localStorage (no placeholder deals)
  // Filter out deals without images to remove placeholder data
  const loadDeals = () => {
    try {
      const savedDeals = localStorage.getItem('grabgrub_deals')
      if (savedDeals) {
        const parsed = JSON.parse(savedDeals)
        // Only keep deals that have images (filter out placeholder deals without images)
        const dealsWithImages = parsed.filter(deal => {
          const hasImages = deal.images && deal.images.length > 0
          const hasImage = deal.image && deal.image.trim() !== ''
          return hasImages || hasImage
        })
        // Save the filtered list back to localStorage
        if (dealsWithImages.length !== parsed.length) {
          localStorage.setItem('grabgrub_deals', JSON.stringify(dealsWithImages))
        }
        return dealsWithImages
      }
    } catch (error) {
      console.error('Error loading deals:', error)
    }
    return [] // Return empty array if no saved deals
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
    return 1 // Start at 1 for first post
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

  // Auto-remove expired posts every minute
  useEffect(() => {
    const removeExpiredPosts = () => {
      setPosts(prevPosts => {
        const activePosts = prevPosts.filter(post => {
          if (!post.endDateTime) return true // Keep posts without endDateTime (backward compatibility)
          return !isPostExpired(post.endDateTime)
        })
        
        // Only update if there are changes
        if (activePosts.length !== prevPosts.length) {
          return activePosts
        }
        return prevPosts
      })
    }

    // Run immediately
    removeExpiredPosts()

    // Then run every minute
    const interval = setInterval(removeExpiredPosts, 60000) // 60000ms = 1 minute

    return () => clearInterval(interval)
  }, [])

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

  const handleToggleTaken = (postId) => {
    if (!isLoggedIn || !currentUser) {
      alert('You must be logged in to mark posts as taken.')
      return
    }

    const post = posts.find(p => p.id === postId)
    if (post && post.creatorId === currentUser.id) {
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p.id === postId 
            ? { ...p, isTaken: !p.isTaken }
            : p
        )
      )
    } else {
      alert('You can only mark your own posts as taken.')
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

  // Filter out expired posts and taken posts for display
  const activePosts = posts.filter(post => {
    // Filter out expired posts
    if (post.endDateTime && isPostExpired(post.endDateTime)) {
      return false
    }
    // Filter out taken posts (unless user is the creator)
    if (post.isTaken && (!currentUserId || post.creatorId !== currentUserId)) {
      return false
    }
    return true
  })

  return (
    <HashRouter>
      <AppNavbar />
      <Routes>
        <Route 
          path="/" 
          element={<HomePage posts={activePosts} onDeletePost={handleDeletePost} onToggleTaken={handleToggleTaken} currentUserId={currentUserId} />} 
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
          element={<PostDetailsPage posts={activePosts} onDeletePost={handleDeletePost} onToggleTaken={handleToggleTaken} currentUserId={currentUserId} />} 
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
