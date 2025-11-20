import { useState } from 'react'
import { Container, Form, Button, Alert, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, continueAsGuest } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const result = login(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Invalid email or password')
    }
  }

  const handleGuestMode = () => {
    continueAsGuest()
    navigate('/')
  }

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <Card className="shadow">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Login to GrabGrub</h2>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" size="lg">
              Login
            </Button>
          </Form>

          <div className="text-center mb-3">
            <hr />
            <p className="text-muted">Don't have an account?</p>
            <Button as={Link} to="/signup" variant="outline-primary" className="w-100">
              Sign Up
            </Button>
          </div>

          <div className="text-center">
            <hr />
            <p className="text-muted mb-2">Just want to browse?</p>
            <Button variant="outline-secondary" className="w-100" onClick={handleGuestMode}>
              Continue as Guest
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default LoginPage

