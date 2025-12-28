import { useState, useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap'
import { motion } from 'framer-motion'
import TransactionService from '../services/transactionService'

export default function TransactionFilter({ show, onHide, onApplyFilters, currentFilters }) {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    date_from: '',
    date_to: '',
    amount_min: '',
    amount_max: ''
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadCategories()
    if (currentFilters) {
      setFilters(currentFilters)
    }
  }, [currentFilters])

  const loadCategories = async () => {
    const data = await TransactionService.getCategories()
    setCategories(data)
  }

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onHide()
  }

  const handleClear = () => {
    const clearedFilters = {
      type: '',
      category: '',
      date_from: '',
      date_to: '',
      amount_min: '',
      amount_max: ''
    }
    setFilters(clearedFilters)
    onApplyFilters(clearedFilters)
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton style={{ border: 'none', paddingBottom: 0 }}>
        <Modal.Title style={{ color: '#1d1d1f', fontWeight: '700' }}>
          Filter Transactions
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ paddingTop: '8px' }}>
        <Form>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Label style={{ color: '#1d1d1f', fontWeight: '600', fontSize: '14px' }}>
                Transaction Type
              </Form.Label>
              <Form.Select
                value={filters.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '12px'
                }}
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Col>

            <Col xs={12}>
              <Form.Label style={{ color: '#1d1d1f', fontWeight: '600', fontSize: '14px' }}>
                Category
              </Form.Label>
              <Form.Select
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '12px'
                }}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.emoji} {category.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={6}>
              <Form.Label style={{ color: '#1d1d1f', fontWeight: '600', fontSize: '14px' }}>
                From Date
              </Form.Label>
              <Form.Control
                type="date"
                value={filters.date_from}
                onChange={(e) => handleInputChange('date_from', e.target.value)}
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '12px'
                }}
              />
            </Col>

            <Col xs={6}>
              <Form.Label style={{ color: '#1d1d1f', fontWeight: '600', fontSize: '14px' }}>
                To Date
              </Form.Label>
              <Form.Control
                type="date"
                value={filters.date_to}
                onChange={(e) => handleInputChange('date_to', e.target.value)}
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '12px'
                }}
              />
            </Col>

            <Col xs={6}>
              <Form.Label style={{ color: '#1d1d1f', fontWeight: '600', fontSize: '14px' }}>
                Min Amount (₹)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={filters.amount_min}
                onChange={(e) => handleInputChange('amount_min', e.target.value)}
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '12px'
                }}
              />
            </Col>

            <Col xs={6}>
              <Form.Label style={{ color: '#1d1d1f', fontWeight: '600', fontSize: '14px' }}>
                Max Amount (₹)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="10000"
                value={filters.amount_max}
                onChange={(e) => handleInputChange('amount_max', e.target.value)}
                style={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  padding: '12px'
                }}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ border: 'none', paddingTop: 0 }}>
        <Button
          variant="outline-secondary"
          onClick={handleClear}
          style={{
            borderRadius: '12px',
            padding: '12px 24px',
            fontWeight: '600'
          }}
        >
          Clear All
        </Button>
        <Button
          onClick={handleApply}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontWeight: '600'
          }}
        >
          Apply Filters
        </Button>
      </Modal.Footer>
    </Modal>
  )
}