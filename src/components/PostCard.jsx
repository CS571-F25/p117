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

  const canDelete = currentUserId && post.creatorId === currentUserId

  // Get first image or single image for card display
  const displayImage = post.images && post.images.length > 0 
    ? post.images[0] 
    : (post.image || null)

  return (
    <Card className="h-100 shadow-sm">
      {displayImage && (
        <Card.Img 
          variant="top" 
          src={displayImage} 
          alt={post.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
      )}
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text className="text-muted mb-2">
          <strong>Location:</strong> {post.location}
        </Card.Text>
        <Card.Text className="text-muted mb-2">
          <strong>Pickup Window:</strong> {post.pickupWindow}
        </Card.Text>
        <Card.Text className="mb-3">
          {post.note.length > 100 ? `${post.note.substring(0, 100)}...` : post.note}
        </Card.Text>
        <ButtonGroup className="w-100">
          <Button as={Link} to={`/post/${post.id}`} variant="primary" className="flex-grow-1">
            View Details
          </Button>
          {canDelete && onDeletePost && (
            <Button variant="danger" onClick={handleDelete} title="Delete Post">
              🗑️
            </Button>
          )}
        </ButtonGroup>
      </Card.Body>
    </Card>
  )
}

export default PostCard

