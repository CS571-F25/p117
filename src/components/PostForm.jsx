import { useState } from 'react'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { calculateEndDateTime } from '../utils/timeUtils'

function PostForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    pickupDate: '',
    startTime: '',
    endTime: '',
    note: '',
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
    if (!formData.pickupDate.trim()) {
      newErrors.pickupDate = 'Pickup date is required'
    }
    if (!formData.startTime.trim()) {
      newErrors.startTime = 'Start time is required'
    }
    if (!formData.endTime.trim()) {
      newErrors.endTime = 'End time is required'
    }
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time'
    }
    if (!formData.note.trim()) {
      newErrors.note = 'Note is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatPickupWindow = () => {
    if (!formData.pickupDate) return ''
    
    const date = new Date(formData.pickupDate + 'T00:00:00')
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    let dateStr
    if (date.toDateString() === today.toDateString()) {
      dateStr = 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateStr = 'Tomorrow'
    } else {
      dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    }
    
    // Format time (convert 24h to 12h if needed, or keep as is)
    const formatTime = (time) => {
      if (!time) return ''
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'pm' : 'am'
      const hour12 = hour % 12 || 12
      return `${hour12}:${minutes} ${ampm}`
    }
    
    return `${dateStr} ${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validate()) {
      // Calculate end datetime for expiration checking
      const endDateTime = calculateEndDateTime(formData.pickupDate, formData.endTime)
      
      const submissionData = {
        ...formData,
        pickupWindow: formatPickupWindow(),
        endDateTime: endDateTime ? endDateTime.toISOString() : null
      }
      // Call onSubmit first to create the post
      onSubmit(submissionData)
      // Then show success and clear form
      setShowSuccess(true)
      setFormData({
        title: '',
        location: '',
        pickupDate: '',
        startTime: '',
        endTime: '',
        note: '',
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
          Post created successfully!
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Title *</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          isInvalid={!!errors.title}
          placeholder="e.g., Fresh Pizza Slices"
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Location *</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          isInvalid={!!errors.location}
          placeholder="e.g., Gordon Commons, Room 205"
        />
        <Form.Control.Feedback type="invalid">
          {errors.location}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Pickup Window *</Form.Label>
        <Row>
          <Col md={4}>
            <Form.Label className="small">Date</Form.Label>
            <Form.Control
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              isInvalid={!!errors.pickupDate}
              min={new Date().toISOString().split('T')[0]}
            />
            <Form.Control.Feedback type="invalid">
              {errors.pickupDate}
            </Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Label className="small">Start Time</Form.Label>
            <Form.Control
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              isInvalid={!!errors.startTime}
            />
            <Form.Control.Feedback type="invalid">
              {errors.startTime}
            </Form.Control.Feedback>
          </Col>
          <Col md={4}>
            <Form.Label className="small">End Time</Form.Label>
            <Form.Control
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              isInvalid={!!errors.endTime}
            />
            <Form.Control.Feedback type="invalid">
              {errors.endTime}
            </Form.Control.Feedback>
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Note *</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="note"
          value={formData.note}
          onChange={handleChange}
          isInvalid={!!errors.note}
          placeholder="Describe the food, quantity, dietary info, etc."
        />
        <Form.Control.Feedback type="invalid">
          {errors.note}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Food Photos (Optional)</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          isInvalid={!!errors.images}
        />
        <Form.Text className="text-muted">
          Upload photos of your food (max 5MB each, JPG/PNG/GIF). You can select multiple images.
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
        Create Post
      </Button>
    </Form>
  )
}

export default PostForm

