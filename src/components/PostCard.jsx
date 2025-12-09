import { Card, Button, ButtonGroup } from 'react-bootstrap'
import { Link } from 'react-router'

function PostCard({ post, onDeletePost, currentUserId }) {
  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDeletePost) {
      onDeletePost(post.id)
    }
  }

  // Only show delete button if user is logged in AND they created the post
  const canDelete = currentUserId && post.creatorId && post.creatorId === currentUserId

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
        <Card.Title className="mb-2" style={{ minHeight: '48px' }}>{post.title}</Card.Title>
        <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
          <strong>Location:</strong> {post.location}
        </Card.Text>
        <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
          <strong>Pickup Window:</strong> {post.pickupWindow}
        </Card.Text>
        <Card.Text className="mb-3 flex-grow-1" style={{ fontSize: '0.9rem', minHeight: '60px' }}>
          {post.note.length > 100 ? `${post.note.substring(0, 100)}...` : post.note}
        </Card.Text>
        <ButtonGroup className="w-100 mt-auto">
          <Button as={Link} to={`/post/${post.id}`} variant="primary" className="flex-grow-1">
            View Details
          </Button>
          {canDelete && onDeletePost && (
            <Button variant="danger" onClick={handleDelete} title="Delete Post" style={{ width: '50px' }}>
              🗑️
            </Button>
          )}
        </ButtonGroup>
      </Card.Body>
    </Card>
  )
}

export default PostCard

