import { Card, Badge, Button, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'

function DealDetails({ deal, onDeleteDeal, currentUserId }) {
  const navigate = useNavigate()

  const handleDelete = () => {
    if (onDeleteDeal && deal) {
      onDeleteDeal(deal.id)
      navigate('/deals')
    }
  }

  // Only allow delete if user is logged in AND they created the deal
  const canDelete = currentUserId && deal && deal.creatorId && deal.creatorId === currentUserId

  if (!deal) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Deal not found</p>
        <Button as={Link} to="/deals" variant="primary">
          Back to Deals
        </Button>
      </div>
    )
  }

  // Get images array or single image
  const images = deal.images && deal.images.length > 0 
    ? deal.images 
    : (deal.image ? [deal.image] : [])

  return (
    <Card className="shadow">
      {images.length > 0 && (
        <div className="p-3">
          {images.length === 1 ? (
            <img 
              src={images[0]} 
              alt={deal.title}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
            />
          ) : (
            <Row className="g-3">
              {images.map((img, index) => (
                <Col key={index} xs={12} sm={6} md={4}>
                  <img 
                    src={img} 
                    alt={`${deal.title} - ${index + 1}`}
                    style={{ 
                      width: '100%', 
                      height: '250px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
      <Card.Body>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Button as={Link} to="/deals" variant="outline-secondary" size="sm">
            ← Back to Deals
          </Button>
          {canDelete && onDeleteDeal && (
            <Button variant="danger" onClick={handleDelete} size="sm">
              🗑️ Delete Deal
            </Button>
          )}
        </div>
        
        <Card.Title className="mb-3">{deal.title}</Card.Title>
        
        {deal.store && (
          <div className="mb-3">
            <Badge bg="primary" className="me-2">Store</Badge>
            <p className="d-inline">{deal.store}</p>
          </div>
        )}
        
        <div className="mb-3">
          <Badge bg="info" className="me-2">Location</Badge>
          <p className="d-inline">{deal.location}</p>
        </div>
        
        {deal.discount && (
          <div className="mb-3">
            <Badge bg="success" className="me-2">Discount</Badge>
            <p className="d-inline">{deal.discount}</p>
          </div>
        )}
        
        {deal.expirationDate && (
          <div className="mb-3">
            <Badge bg="warning" className="me-2">Expires</Badge>
            <p className="d-inline">{deal.expirationDate}</p>
          </div>
        )}
        
        <div className="mb-3">
          <Badge bg="secondary" className="me-2">Details</Badge>
          <p className="mt-2">{deal.description}</p>
        </div>
      </Card.Body>
    </Card>
  )
}

export default DealDetails

