import { useState } from 'react'
import { Container, Form, InputGroup } from 'react-bootstrap'
import PostList from '../components/PostList'

function HomePage({ posts = [], onDeletePost, currentUserId }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.note.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Container className="py-4">
      <h1 className="mb-4">Food Listings near you !</h1>
      
      <InputGroup className="mb-4">
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by title, location, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <PostList posts={filteredPosts} onDeletePost={onDeletePost} currentUserId={currentUserId} />
    </Container>
  )
}

export default HomePage
