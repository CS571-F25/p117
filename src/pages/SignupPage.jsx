import { useState } from 'react'
import { Container, Form, Button, Alert, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const result = signup(name, email, password)
    if (result.success) {
      navigate('/home')
    } else {
      setError(result.error || 'Signup failed. Please try again.')
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <Card className="shadow">
        <Card.Body className="p-4">
          <h1 className="text-center mb-4">Sign Up for GrabGrub</h1>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </Form.Group>

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
                placeholder="At least 6 characters"
                minLength={6}
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" size="lg">
              Sign Up
            </Button>
          </Form>

          <div className="text-center">
            <p className="text-muted">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default SignupPage

