import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

export default function CategorySelector() {
  const navigate = useNavigate()
  
  const categories = [
    { name: 'Groceries', icon: '🛒', color: '#ffebee' },
    { name: 'Travel', icon: '✈️', color: '#e3f2fd' },
    { name: 'Car', icon: '🚗', color: '#f3e5f5' },
    { name: 'Home', icon: '🏠', color: '#e8f5e8' },
    { name: 'Insurance', icon: '🛡️', color: '#fff3e0' },
    { name: 'Education', icon: '📚', color: '#fce4ec' },
    { name: 'Marketing', icon: '📢', color: '#e0f2f1' },
    { name: 'Shopping', icon: '🛍️', color: '#f1f8e9' },
    { name: 'Internet', icon: '📶', color: '#e8eaf6' },
    { name: 'Water', icon: '💧', color: '#e1f5fe' },
    { name: 'Rent', icon: '🏘️', color: '#fef7e0' },
    { name: 'Gym', icon: '💪', color: '#ffebee' },
    { name: 'Subscription', icon: '📱', color: '#f3e5f5' },
    { name: 'Vacation', icon: '🏖️', color: '#e8f5e8' },
    { name: 'Other', icon: '📦', color: '#f5f5f5' },
  ]

  return (
    <div style={{ paddingBottom: '120px', minHeight: '100vh' }}>
      <Container className="py-4">
        {/* Header */}
        <motion.div 
          className="d-flex align-items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(255,255,255,0.3)',
              border: 'none',
              borderRadius: '12px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              backdropFilter: 'blur(10px)'
            }}
          >
            ←
          </button>
          <h4 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '0' }}>
            Select Category
          </h4>
        </motion.div>

        {/* Categories Grid */}
        <Row className="g-3">
          {categories.map((category, index) => (
            <Col xs={4} key={category.name}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/add', { state: { category: category.name } })}
                style={{ cursor: 'pointer' }}
              >
                <div className="text-center">
                  <div 
                    className="category-icon mx-auto mb-2"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#1d1d1f', 
                    fontWeight: '500',
                    marginBottom: '0'
                  }}>
                    {category.name}
                  </p>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Container>
          <Row>
            <Col className="nav-item" onClick={() => navigate('/dashboard')}>
              <div className="nav-icon">🏠</div>
              <div>Home</div>
            </Col>
            <Col className="nav-item">
              <div className="nav-icon">📊</div>
              <div>Transactions</div>
            </Col>
            <Col className="nav-item">
              <div className="nav-icon">📈</div>
              <div>Analytics</div>
            </Col>
            <Col className="nav-item">
              <div className="nav-icon">👤</div>
              <div>Account</div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}