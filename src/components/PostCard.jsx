import { Card, Button, ButtonGroup, Badge } from 'react-bootstrap'
import { Link } from 'react-router'
import TimeRemaining from './TimeRemaining'
import { getUserEmail } from '../utils/userUtils'

function PostCard({ post, onDeletePost, onToggleTaken, currentUserId }) {
  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDeletePost) {
      onDeletePost(post.id)
    }
  }

  // Only show delete button if user is logged in AND they created the post
  const canDelete = currentUserId && post.creatorId && post.creatorId === currentUserId
  
  // Only show countdown timer if user is NOT the creator (viewers only)
  // If user is not logged in (guest) or different user, they are a viewer
  const isCreator = currentUserId && post.creatorId && post.creatorId === currentUserId
  const isViewer = !isCreator // Anyone who is not the creator is a viewer

  const handleContact = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const creatorEmail = getUserEmail(post.creatorId)
    if (creatorEmail) {
      window.location.href = `mailto:${creatorEmail}?subject=Re: ${post.title} on GrabGrub`
    } else {
      alert('Creator contact information not available.')
    }
  }

  const handleRemindMe = (e) => {
    e.preventDefault()
    e.stopPropagation()
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

  // Get first image or single image for card display
  const displayImage = post.images && post.images.length > 0 
    ? post.images[0] 
    : (post.image || null)

  return (
    <Card className="h-100 shadow-sm d-flex flex-column">
      {displayImage ? (
        <Card.Img 
          variant="top" 
          src={displayImage} 
          alt={post.title}
          style={{ height: '200px', objectFit: 'cover', width: '100%' }}
        />
      ) : (
        <div style={{ height: '200px', backgroundColor: '#f8f9fa', width: '100%' }} />
      )}
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title style={{ minHeight: '48px', flex: 1, fontSize: '1.1rem' }}>{post.title}</Card.Title>
          {post.isTaken && (
            <Badge bg="secondary" className="ms-2" style={{ flexShrink: 0 }}>Taken</Badge>
          )}
        </div>
        <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
          <strong>Location:</strong> <span style={{ wordBreak: 'break-word' }}>{post.location}</span>
        </Card.Text>
        <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
          <strong>Pickup Window:</strong> <span style={{ wordBreak: 'break-word' }}>{post.pickupWindow}</span>
        </Card.Text>
        {isViewer && (
          <Card.Text className="mb-2" style={{ fontSize: '0.9rem' }}>
            {post.endDateTime ? (
              <>
                <strong>Time Left: </strong>
                <TimeRemaining endDateTime={post.endDateTime} />
              </>
            ) : (
              <span className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                No expiration time set
              </span>
            )}
          </Card.Text>
        )}
        <Card.Text className="mb-3 flex-grow-1" style={{ fontSize: '0.9rem', minHeight: '60px' }}>
          {post.note.length > 100 ? `${post.note.substring(0, 100)}...` : post.note}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex gap-2 mb-2">
            <Button 
              as={Link} 
              to={`/post/${post.id}`} 
              variant="primary" 
              className="flex-grow-1"
              size="sm"
            >
              View Details
            </Button>
            {canDelete && onDeletePost && (
              <Button 
                variant="danger" 
                onClick={handleDelete} 
                title="Delete Post"
                aria-label="Delete Post"
                size="sm"
                style={{ minWidth: '40px' }}
              >
                <span aria-hidden="true">🗑️</span>
              </Button>
            )}
          </div>
          {isCreator && onToggleTaken && (
            <Button 
              variant={post.isTaken ? 'warning' : 'success'} 
              className="w-100" 
              size="sm"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (onToggleTaken) {
                  onToggleTaken(post.id)
                }
              }}
            >
              {post.isTaken ? '✓ Taken' : 'Mark as Taken'}
            </Button>
          )}
          {!isCreator && !post.isTaken && (
            <div>
              <Button 
                className="w-100 mb-2" 
                size="sm"
                onClick={handleContact}
                title="Contact creator"
                aria-label="Contact creator"
                style={{ backgroundColor: '#0e7490', borderColor: '#0e7490', color: '#FFFFFF' }}
              >
                <span aria-hidden="true">📧</span> Contact
              </Button>
              {post.endDateTime && (
                <Button 
                  className="w-100" 
                  size="sm"
                  onClick={handleRemindMe}
                  title="Set reminder"
                  aria-label="Set reminder"
                  style={{ backgroundColor: '#c2410c', borderColor: '#c2410c', color: '#FFFFFF' }}
                >
                  <span aria-hidden="true">⏰</span> Set Reminder
                </Button>
              )}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default PostCard

