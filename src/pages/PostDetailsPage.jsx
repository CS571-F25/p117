import { Container } from 'react-bootstrap'
import { useParams } from 'react-router'
import PostDetails from '../components/PostDetails'

function PostDetailsPage({ posts, onDeletePost, currentUserId }) {
  const { id } = useParams()
  const post = posts?.find(p => p.id === parseInt(id))

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <PostDetails post={post} onDeletePost={onDeletePost} currentUserId={currentUserId} />
    </Container>
  )
}

export default PostDetailsPage

