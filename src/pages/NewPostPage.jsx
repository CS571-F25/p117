import { Container } from 'react-bootstrap'
import PostForm from '../components/PostForm'

function NewPostPage({ onCreatePost }) {
  const handleSubmit = (formData) => {
    if (onCreatePost) {
      onCreatePost(formData)
    } else {
      // Fallback: just log it
      console.log('New post created:', formData)
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <h1 className="mb-4">Create New Post</h1>
      <p className="text-muted mb-4">
        Share your leftover food with the community! Fill out the form below to create a new post.
      </p>
      <PostForm onSubmit={handleSubmit} />
    </Container>
  )
}

export default NewPostPage
