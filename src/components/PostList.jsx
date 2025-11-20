import { Row, Col } from 'react-bootstrap'
import PostCard from './PostCard'

function PostList({ posts, onDeletePost, currentUserId }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No posts available. Be the first to share!</p>
      </div>
    )
  }

  return (
    <Row className="g-4">
      {posts.map((post) => (
        <Col key={post.id} xs={12} sm={6} md={4} lg={3}>
          <PostCard post={post} onDeletePost={onDeletePost} currentUserId={currentUserId} />
        </Col>
      ))}
    </Row>
  )
}

export default PostList

