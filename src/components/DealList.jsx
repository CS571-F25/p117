import { Row, Col } from 'react-bootstrap'
import DealCard from './DealCard'

function DealList({ deals, onDeleteDeal, currentUserId }) {
  if (!deals || deals.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No deals available. Be the first to share a deal!</p>
      </div>
    )
  }

  return (
    <Row className="g-4">
      {deals.map((deal) => (
        <Col key={deal.id} xs={12} sm={6} md={4} lg={3}>
          <DealCard deal={deal} onDeleteDeal={onDeleteDeal} currentUserId={currentUserId} />
        </Col>
      ))}
    </Row>
  )
}

export default DealList

