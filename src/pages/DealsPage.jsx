import { useState } from 'react'
import { Container, Form, InputGroup, Button } from 'react-bootstrap'
import { Link } from 'react-router'
import { useAuth } from '../contexts/AuthContext'
import DealList from '../components/DealList'

function DealsPage({ deals = [], onDeleteDeal, currentUserId }) {
  const { isLoggedIn } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (deal.store && deal.store.toLowerCase().includes(searchTerm.toLowerCase())) ||
    deal.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Container className="py-4" fluid="lg">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Deals & Discounts</h1>
        {isLoggedIn && (
          <Button 
            as={Link} 
            to="/deals/new" 
            variant="success" 
            className="d-flex align-items-center justify-content-center"
            style={{ 
              borderRadius: '50%', 
              width: '56px', 
              height: '56px',
              fontSize: '28px',
              fontWeight: 'bold',
              padding: 0,
              lineHeight: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              border: 'none'
            }}
            title="Share a New Deal"
          >
            +
          </Button>
        )}
      </div>
      <p className="text-muted mb-4">
        Discover great food deals and discounts shared by the community!
      </p>
      
      <InputGroup className="mb-4">
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by title, store, location, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <DealList deals={filteredDeals} onDeleteDeal={onDeleteDeal} currentUserId={currentUserId} />
    </Container>
  )
}

export default DealsPage

