import { useState } from 'react'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'

function DealForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    store: '',
    location: '',
    description: '',
    discount: '',
    expirationDate: '',
    images: []
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    
    if (files.length === 0) return

    // Validate all files
    const validFiles = []
    const invalidFiles = []
    
    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} is not an image file`)
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} is too large (max 5MB)`)
        return
      }
      
      validFiles.push(file)
    })

    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: invalidFiles.join(', ')
      }))
    }

    if (validFiles.length > 0) {
      // Read all valid files
      const readers = validFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readers).then(results => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...results]
        }))
        setImagePreviews(prev => [...prev, ...results])
        
        // Clear errors
        if (errors.images) {
          setErrors(prev => ({
            ...prev,
            images: ''
          }))
        }
      })
    }

    // Reset file input to allow selecting the same file again
    e.target.value = ''
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatExpirationDate = () => {
    if (!formData.expirationDate) return ''
    
    const date = new Date(formData.expirationDate + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      const submissionData = {
        ...formData,
        expirationDate: formData.expirationDate ? formatExpirationDate() : ''
      }
      onSubmit(submissionData)
      setShowSuccess(true)
      setFormData({
        title: '',
        store: '',
        location: '',
        description: '',
        discount: '',
        expirationDate: '',
        images: []
      })
      setImagePreviews([])
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      {showSuccess && (
        <Alert variant="success" dismissible onClose={() => setShowSuccess(false)}>
          Deal created successfully!
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Deal Title *</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          isInvalid={!!errors.title}
          placeholder="e.g., 50% Off Pizza"
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Store/Business Name (Optional)</Form.Label>
        <Form.Control
          type="text"
          name="store"
          value={formData.store}
          onChange={handleChange}
          placeholder="e.g., Domino's Pizza"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Location *</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          isInvalid={!!errors.location}
          placeholder="e.g., State Street, Madison, WI"
        />
        <Form.Control.Feedback type="invalid">
          {errors.location}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Discount/Offer Details (Optional)</Form.Label>
        <Form.Control
          type="text"
          name="discount"
          value={formData.discount}
          onChange={handleChange}
          placeholder="e.g., 50% off, Buy 1 Get 1 Free, $5 off orders over $20"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Expiration Date (Optional)</Form.Label>
        <Form.Control
          type="date"
          name="expirationDate"
          value={formData.expirationDate}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
        <Form.Text className="text-muted">
          When does this deal expire?
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description *</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          isInvalid={!!errors.description}
          placeholder="Provide details about the deal, terms and conditions, how to redeem, etc."
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Deal Photos (Optional)</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          isInvalid={!!errors.images}
        />
        <Form.Text className="text-muted">
          Upload photos of the deal, flyer, or store (max 5MB each, JPG/PNG/GIF). You can select multiple images.
        </Form.Text>
        <Form.Control.Feedback type="invalid">
          {errors.images}
        </Form.Control.Feedback>
        {imagePreviews.length > 0 && (
          <div className="mt-3">
            <Row className="g-3">
              {imagePreviews.map((preview, index) => (
                <Col key={index} xs={12} sm={6} md={4}>
                  <div className="position-relative">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                      }}
                    />
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleRemoveImage(index)}
                      className="mt-2 w-100"
                    >
                      Remove Image
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Form.Group>

      <Button variant="primary" type="submit" size="lg">
        Create Deal
      </Button>
    </Form>
  )
}

export default DealForm

