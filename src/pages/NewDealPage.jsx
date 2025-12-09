import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import DealForm from '../components/DealForm'

function NewDealPage({ onCreateDeal }) {
  const navigate = useNavigate()

  const handleSubmit = (formData) => {
    if (onCreateDeal) {
      onCreateDeal(formData)
      // Navigate to deals page to see the new deal in listings
      navigate('/deals')
    } else {
      console.log('New deal created:', formData)
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <h1 className="mb-4">Share a Deal</h1>
      <p className="text-muted mb-4">
        Know about a great food deal or discount? Share it with the community! Fill out the form below to create a new deal post.
      </p>
      <DealForm onSubmit={handleSubmit} />
    </Container>
  )
}

export default NewDealPage

