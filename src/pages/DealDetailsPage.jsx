import { Container } from 'react-bootstrap'
import { useParams } from 'react-router'
import DealDetails from '../components/DealDetails'

function DealDetailsPage({ deals, onDeleteDeal, currentUserId }) {
  const { id } = useParams()
  const deal = deals.find(d => d.id === parseInt(id))

  return (
    <Container className="py-4" style={{ maxWidth: '900px' }}>
      <h1 className="visually-hidden">Deal Details</h1>
      <DealDetails deal={deal} onDeleteDeal={onDeleteDeal} currentUserId={currentUserId} />
    </Container>
  )
}

export default DealDetailsPage

