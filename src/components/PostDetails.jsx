import { Card, Badge, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'

function PostDetails({ post, onDeletePost, currentUserId }) {
  const navigate = useNavigate()

  const handleDelete = () => {
    if (onDeletePost && post) {
      onDeletePost(post.id)
      navigate('/')
    }
  }

  const canDelete = currentUserId && post && post.creatorId === currentUserId

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
          {canDelete && onDeletePost && (
            <Button variant="danger" onClick={handleDelete} size="sm">
              🗑️ Delete Post
            </Button>
          )}
        </div>
        
        <Card.Title className="mb-3">{post.title}</Card.Title>
        
        <div className="mb-3">
          <Badge bg="info" className="me-2">Location</Badge>
          <p className="d-inline">{post.location}</p>
        </div>
        
        <div className="mb-3">
          <Badge bg="warning" className="me-2">Pickup Window</Badge>
          <p className="d-inline">{post.pickupWindow}</p>
        </div>
        
        <div className="mb-3">
          <Badge bg="secondary" className="me-2">Details</Badge>
          <p className="mt-2">{post.note}</p>
        </div>
      </Card.Body>
    </Card>
  )
}

export default PostDetails
