import { Container, Card, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router'

function AboutPage() {
  return (
    <Container className="py-5" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">🍽️ GrabGrub</h1>
        <p className="lead text-muted">Connecting Communities Through Food Sharing</p>
      </div>

      <Card className="shadow-sm mb-4">
        <Card.Body className="p-4">
          <h2 className="mb-3">What is GrabGrub?</h2>
          <p className="fs-5">
            GrabGrub is a community-driven platform designed to reduce food waste by connecting people 
            who have leftover food with those who need it. Whether you've ordered too much, cooked extra, 
            or have food from an event, GrabGrub makes it easy to share with your community.
          </p>
        </Card.Body>
      </Card>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="h-100 shadow-sm border-primary">
            <Card.Body>
              <div className="text-center mb-3" style={{ fontSize: '3rem' }}>📤</div>
              <h4 className="text-center mb-3">Share Your Food</h4>
              <p className="text-center text-muted">
                Have leftovers? Create a post with photos, location, and pickup details. 
                Help reduce waste while helping others!
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm border-success">
            <Card.Body>
              <div className="text-center mb-3" style={{ fontSize: '3rem' }}>📥</div>
              <h4 className="text-center mb-3">Grab Fresh Food</h4>
              <p className="text-center text-muted">
                Browse available food listings near you. Search by location, 
                filter by type, and find free food in your area!
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mb-4">
        <Card.Body className="p-4">
          <h3 className="mb-3">✨ Key Features</h3>
          <Row>
            <Col md={6}>
              <ul className="list-unstyled">
                <li className="mb-2">✅ <strong>Easy Posting</strong> - Share food with photos and details</li>
                <li className="mb-2">✅ <strong>Smart Search</strong> - Find food by location or keywords</li>
                <li className="mb-2">✅ <strong>Time Windows</strong> - Set pickup availability</li>
                <li className="mb-2">✅ <strong>Multiple Photos</strong> - Show off your food with multiple images</li>
              </ul>
            </Col>
            <Col md={6}>
              <ul className="list-unstyled">
                <li className="mb-2">✅ <strong>Creator Control</strong> - Manage your own posts</li>
                <li className="mb-2">✅ <strong>Real-time Updates</strong> - See new posts as they're created</li>
                <li className="mb-2">✅ <strong>Community Focus</strong> - Built for local communities</li>
                <li className="mb-2">✅ <strong>Waste Reduction</strong> - Help fight food waste together</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-info">
        <Card.Body className="p-4">
          <h3 className="mb-3">🌱 Our Mission</h3>
          <p className="mb-0 fs-5">
            GrabGrub was created to address the growing problem of food waste while building stronger 
            communities. By making it easy to share leftover food, we're helping reduce waste, save money, 
            and connect neighbors. Every shared meal is a step toward a more sustainable and connected world.
          </p>
        </Card.Body>
      </Card>

      <div className="text-center mt-5">
        <Link to="/" className="btn btn-primary btn-lg me-3">
          Browse Food Listings
        </Link>
        <Link to="/new" className="btn btn-outline-primary btn-lg">
          Create Your First Post
        </Link>
      </div>
    </Container>
  )
}

export default AboutPage

