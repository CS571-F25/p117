import { Container } from 'react-bootstrap'
import { useParams } from 'react-router'
import PostDetails from '../components/PostDetails'

function PostDetailsPage({ posts, onDeletePost, onToggleTaken, currentUserId }) {
  const { id } = useParams()
  const post = posts?.find(p => p.id === parseInt(id))

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <h1 className="visually-hidden">Post Details</h1>
      <PostDetails post={post} onDeletePost={onDeletePost} onToggleTaken={onToggleTaken} currentUserId={currentUserId} />
    </Container>
  )
}

export default PostDetailsPage

