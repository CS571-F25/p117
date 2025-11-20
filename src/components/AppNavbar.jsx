import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

function AppNavbar() {
  const { isLoggedIn, isGuest, currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/about" style={{ cursor: 'pointer' }}>GrabGrub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isLoggedIn && (
              <Nav.Link as={Link} to="/new">New Post</Nav.Link>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <Navbar.Text className="me-3 text-light">
                  Welcome, {currentUser?.name}!
                </Navbar.Text>
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                {isGuest && (
                  <Navbar.Text className="me-3 text-light">
                    Guest Mode
                  </Navbar.Text>
                )}
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
