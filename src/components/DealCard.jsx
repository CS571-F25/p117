import { Card, Button, ButtonGroup } from 'react-bootstrap'
import { Link } from 'react-router'

function DealCard({ deal, onDeleteDeal, currentUserId }) {
  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDeleteDeal) {
      onDeleteDeal(deal.id)
    }
  }

  // Only show delete button if user is logged in AND they created the deal
  const canDelete = currentUserId && deal.creatorId && deal.creatorId === currentUserId

  // Get first image or single image for card display
  const displayImage = deal.images && deal.images.length > 0 
    ? deal.images[0] 
    : (deal.image || null)

  return (
    <Card className="h-100 shadow-sm d-flex flex-column">
      {displayImage ? (
        <Card.Img 
          variant="top" 
          src={displayImage} 
          alt={deal.title}
          style={{ height: '200px', objectFit: 'cover', width: '100%' }}
        />
      ) : (
        <div style={{ height: '200px', backgroundColor: '#f8f9fa', width: '100%' }} />
      )}
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-2" style={{ minHeight: '48px' }}>{deal.title}</Card.Title>
        {deal.store && (
          <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
            <strong>Store:</strong> {deal.store}
          </Card.Text>
        )}
        <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
          <strong>Location:</strong> {deal.location}
        </Card.Text>
        {deal.expirationDate && (
          <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
            <strong>Expires:</strong> {deal.expirationDate}
          </Card.Text>
        )}
        <Card.Text className="mb-3 flex-grow-1" style={{ fontSize: '0.9rem', minHeight: '60px' }}>
          {deal.description.length > 100 ? `${deal.description.substring(0, 100)}...` : deal.description}
        </Card.Text>
        <ButtonGroup className="w-100 mt-auto">
          <Button as={Link} to={`/deal/${deal.id}`} variant="primary" className="flex-grow-1">
            View Details
          </Button>
          {canDelete && onDeleteDeal && (
            <Button variant="danger" onClick={handleDelete} title="Delete Deal" aria-label="Delete Deal" style={{ width: '50px' }}>
              <span aria-hidden="true">🗑️</span>
            </Button>
          )}
        </ButtonGroup>
      </Card.Body>
    </Card>
  )
}

export default DealCard

