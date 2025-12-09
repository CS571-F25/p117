import { useState, useMemo } from 'react'
import { Container, Form, InputGroup, Button, Dropdown, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import PostList from '../components/PostList'
import { expiresWithinHour, expiresToday } from '../utils/timeUtils'

function HomePage({ posts = [], onDeletePost, onToggleTaken, currentUserId }) {
  const { isLoggedIn } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [timeFilter, setTimeFilter] = useState('all') // 'all', 'expiring-soon', 'today'
  const [locationFilter, setLocationFilter] = useState('all')

  // Extract unique locations from posts
  const locations = useMemo(() => {
    const locs = [...new Set(posts.map(post => {
      // Extract area/location name (first part before comma or whole string)
      const parts = post.location.split(',')
      return parts[0].trim()
    }))]
    return locs.sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    let filtered = posts.filter(post => {
      // Search filter
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.note.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (!matchesSearch) return false

      // Time filter
      if (timeFilter === 'expiring-soon') {
        if (!post.endDateTime) return false
        return expiresWithinHour(post.endDateTime)
      } else if (timeFilter === 'today') {
        if (!post.endDateTime) return false
        return expiresToday(post.endDateTime)
      }

      // Location filter
      if (locationFilter !== 'all') {
        const postLocation = post.location.split(',')[0].trim()
        return postLocation === locationFilter
      }

      return true
    })

    return filtered
  }, [posts, searchTerm, timeFilter, locationFilter])

  return (
    <Container className="py-4" fluid="lg">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Food Listings near you !</h1>
        {isLoggedIn && (
          <Button 
            as={Link} 
            to="/new" 
            variant="success" 
            className="d-flex align-items-center justify-content-center"
            style={{ 
              borderRadius: '50%', 
              width: '56px', 
              height: '56px',
              fontSize: '28px',
              fontWeight: 'bold',
              padding: 0,
              lineHeight: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              border: 'none'
            }}
            title="Create New Post"
          >
            +
          </Button>
        )}
      </div>
      
      <Row className="mb-4 g-3">
        {/* Search Bar */}
        <Col xs={12} md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by title, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>

        {/* Filters */}
        <Col xs={12} md={6}>
          <div className="d-flex gap-2 flex-wrap">
            {/* Time Filter Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center">
                <span className="me-1">⏰</span>
                {timeFilter === 'all' ? 'All Time' : timeFilter === 'expiring-soon' ? 'Expiring Soon' : 'Today'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item 
                  active={timeFilter === 'all'}
                  onClick={() => setTimeFilter('all')}
                >
                  All Time
                </Dropdown.Item>
                <Dropdown.Item 
                  active={timeFilter === 'expiring-soon'}
                  onClick={() => setTimeFilter('expiring-soon')}
                >
                  Expiring Soon (&lt; 1 hour)
                </Dropdown.Item>
                <Dropdown.Item 
                  active={timeFilter === 'today'}
                  onClick={() => setTimeFilter('today')}
                >
                  Today
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Location Filter Dropdown */}
            {locations.length > 0 && (
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center">
                  <span className="me-1">📍</span>
                  {locationFilter === 'all' ? 'All Locations' : locationFilter}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item 
                    active={locationFilter === 'all'}
                    onClick={() => setLocationFilter('all')}
                  >
                    All Locations
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  {locations.map(loc => (
                    <Dropdown.Item 
                      key={loc}
                      active={locationFilter === loc}
                      onClick={() => setLocationFilter(loc)}
                    >
                      {loc}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* Clear Filters Button */}
            {(timeFilter !== 'all' || locationFilter !== 'all') && (
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  setTimeFilter('all')
                  setLocationFilter('all')
                }}
                className="ms-auto"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Col>
      </Row>

      <PostList posts={filteredPosts} onDeletePost={onDeletePost} onToggleTaken={onToggleTaken} currentUserId={currentUserId} />
    </Container>
  )
}

export default HomePage
