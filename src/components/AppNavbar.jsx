import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

function AppNavbar() {
  const { isLoggedIn, isGuest, currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/home')
  }

  return (
    <Navbar expand="lg" className="mb-4" style={{ backgroundColor: '#228B22' }}>
      <Container>
        <Navbar.Brand as={Link} to="/about" style={{ cursor: 'pointer', color: '#FFFFFF', fontWeight: 'bold' }}>GrabGrub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle navigation" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home" style={{ color: '#FFFFFF' }}>Home</Nav.Link>
            <Nav.Link as={Link} to="/deals" style={{ color: '#FFFFFF' }}>Deals</Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <Navbar.Text className="me-3" style={{ color: '#FFFFFF' }}>
                  Welcome, {currentUser?.name}!
                </Navbar.Text>
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer', color: '#FFFFFF' }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                {isGuest && (
                  <Navbar.Text className="me-3" style={{ color: '#FFFFFF' }}>
                    Guest Mode
                  </Navbar.Text>
                )}
                <Nav.Link as={Link} to="/login" style={{ color: '#FFFFFF' }}>Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" style={{ color: '#FFFFFF' }}>Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
