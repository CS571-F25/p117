import { Card, Badge, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import TimeRemaining from './TimeRemaining'
import { getUserEmail } from '../utils/userUtils'

function PostDetails({ post, onDeletePost, onToggleTaken, currentUserId }) {
  const navigate = useNavigate()

  const handleDelete = () => {
    if (onDeletePost && post) {
      onDeletePost(post.id)
      navigate('/')
    }
  }

  // Only allow delete if user is logged in AND they created the post
  const canDelete = currentUserId && post && post.creatorId && post.creatorId === currentUserId
  
  // Only show countdown timer if user is NOT the creator (viewers only)
  // If user is not logged in (guest) or different user, they are a viewer
  const isCreator = currentUserId && post && post.creatorId && post.creatorId === currentUserId
  const isViewer = !isCreator // Anyone who is not the creator is a viewer

  const handleContact = () => {
    const creatorEmail = getUserEmail(post.creatorId)
    if (creatorEmail) {
      window.location.href = `mailto:${creatorEmail}?subject=Re: ${post.title} on GrabGrub`
    } else {
      alert('Creator contact information not available.')
    }
  }

  const handleRemindMe = () => {
    if (!post.endDateTime) {
      alert('This post does not have an expiration time.')
      return
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      const endTime = new Date(post.endDateTime)
      const now = new Date()
      const minutesUntilEnd = Math.floor((endTime - now) / 60000)
      const reminderMinutes = Math.max(15, Math.floor(minutesUntilEnd * 0.1)) // 10% of time remaining, min 15 min
      
      setTimeout(() => {
        new Notification(`Reminder: ${post.title}`, {
          body: `This food listing expires soon! Pickup window: ${post.pickupWindow}`,
          icon: '/vite.svg'
        })
      }, reminderMinutes * 60000)

      alert(`Reminder set! You'll be notified ${reminderMinutes} minutes before the pickup window ends.`)
    } else {
      alert('Please enable browser notifications to use this feature.')
    }
  }

  if (!post) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Post not found</p>
        <Button as={Link} to="/" variant="primary">
          Back to Home
        </Button>
      </div>
    )
  }

  // Get images array or single image
  const images = post.images && post.images.length > 0 
    ? post.images 
    : (post.image ? [post.image] : [])

  return (
    <Card className="shadow">
      {images.length > 0 && (
        <div className="p-3">
          {images.length === 1 ? (
            <img 
              src={images[0]} 
              alt={post.title}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
            />
          ) : (
            <Row className="g-3">
              {images.map((img, index) => (
                <Col key={index} xs={12} sm={6} md={4}>
                  <img 
                    src={img} 
                    alt={`${post.title} - ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '250px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
      <Card.Body>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Button as={Link} to="/" variant="outline-secondary" size="sm">
            ← Back to Home
          </Button>
          <div className="d-flex gap-2">
            {canDelete && onDeletePost && (
              <Button variant="danger" onClick={handleDelete} size="sm">
                🗑️ Delete Post
              </Button>
            )}
            {isCreator && onToggleTaken && (
              <Button 
                variant={post.isTaken ? 'warning' : 'success'} 
                onClick={() => onToggleTaken(post.id)}
                size="sm"
              >
                {post.isTaken ? 'Mark as Available' : 'Mark as Taken'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">{post.title}</Card.Title>
          {post.isTaken && (
            <Badge bg="secondary">Taken</Badge>
          )}
        </div>
        
        <div className="mb-3">
          <Badge bg="info" className="me-2">Location</Badge>
          <p className="d-inline">{post.location}</p>
        </div>
        
        <div className="mb-3">
          <Badge bg="warning" className="me-2">Pickup Window</Badge>
          <p className="d-inline">{post.pickupWindow}</p>
        </div>
        {post.endDateTime && isViewer && (
          <div className="mb-3">
            <Badge bg="info" className="me-2">Time Left</Badge>
            <TimeRemaining endDateTime={post.endDateTime} />
          </div>
        )}
        {!post.endDateTime && isViewer && (
          <div className="mb-3">
            <Badge bg="secondary" className="me-2">Time Left</Badge>
            <span className="text-muted" style={{ fontStyle: 'italic' }}>No expiration time set</span>
          </div>
        )}
        
        <div className="mb-3">
          <Badge bg="secondary" className="me-2">Details</Badge>
          <p className="mt-2">{post.note}</p>
        </div>

        {!isCreator && !post.isTaken && (
          <div className="mt-4">
            <Button 
              onClick={handleContact}
              className="w-100 mb-2"
              style={{ backgroundColor: '#20c997', borderColor: '#20c997', color: '#FFFFFF' }}
            >
              📧 Contact Creator
            </Button>
            {post.endDateTime && (
              <Button 
                onClick={handleRemindMe}
                className="w-100"
                style={{ backgroundColor: '#FF8C00', borderColor: '#FF8C00', color: '#FFFFFF' }}
              >
                ⏰ Set Reminder
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default PostDetails
