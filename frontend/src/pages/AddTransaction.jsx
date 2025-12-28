import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import TransactionService from '../services/transactionService'

export default function AddTransaction() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isIncome, setIsIncome] = useState(false)
  const [description, setDescription] = useState('')
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 16))
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    const data = await TransactionService.getCategories()
    setCategories(data)
  }

  const playSuccessSound = () => {
    // Create audio context for success sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Success sound: ascending notes
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.4)
  }

  const handleSubmit = async () => {
    if (amount && selectedCategory) {
      setLoading(true)
      const result = await TransactionService.createTransaction({
        amount: parseFloat(amount),
        description,
        category_id: selectedCategory.id,
        transaction_type: isIncome ? 'income' : 'expense',
        transaction_date: transactionDate
      })
      
      if (result.success) {
        playSuccessSound()
        navigate('/dashboard?success=true')
      } else {
        alert(result.error)
      }
      setLoading(false)
    }
  }

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
              background: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '12px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px',
              backdropFilter: 'blur(10px)',
              color: '#1d1d1f'
            }}
          >
            ←
          </button>
          <div>
            <h3 style={{ color: '#1d1d1f', fontWeight: '700', marginBottom: '4px' }}>
              Add Transaction
            </h3>
            <h6 className="soft-text mb-0">
              Track your spending
            </h6>
          </div>
        </motion.div>

        {/* Income/Expense Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="main-card mb-4 border-0">
            <Card.Body className="p-4">
              <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '16px' }}>Transaction Type</h5>
              <Row className="g-2">
                <Col>
                  <button
                    onClick={() => setIsIncome(false)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '16px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      background: !isIncome 
                        ? 'linear-gradient(135deg, #ff3b30, #ff6b6b)' 
                        : 'rgba(255,255,255,0.5)',
                      color: !isIncome ? 'white' : '#64748b',
                      boxShadow: !isIncome ? '0 4px 16px rgba(255, 59, 48, 0.3)' : 'none'
                    }}
                  >
                    Expense
                  </button>
                </Col>
                <Col>
                  <button
                    onClick={() => setIsIncome(true)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: 'none',
                      borderRadius: '16px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      background: isIncome 
                        ? 'linear-gradient(135deg, #34c759, #30d158)' 
                        : 'rgba(255,255,255,0.5)',
                      color: isIncome ? 'white' : '#64748b',
                      boxShadow: isIncome ? '0 4px 16px rgba(52, 199, 89, 0.3)' : 'none'
                    }}
                  >
                    Income
                  </button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Amount Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="main-card mb-4 border-0">
            <Card.Body className="p-4 text-center">
              <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '16px' }}>Amount</h5>
              <div className="d-flex align-items-center justify-content-center">
                <span style={{ fontSize: '2.5rem', color: '#1d1d1f', marginRight: '8px' }}>₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    color: '#1d1d1f',
                    textAlign: 'center',
                    outline: 'none',
                    width: '200px'
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="main-card mb-4 border-0">
            <Card.Body className="p-4">
              <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '16px' }}>Description</h5>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you spend on?"
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '16px',
                  color: '#1d1d1f'
                }}
              />
            </Card.Body>
          </Card>
        </motion.div>

        {/* Date & Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="main-card mb-4 border-0">
            <Card.Body className="p-4">
              <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '16px' }}>Date & Time</h5>
              <Form.Control
                type="datetime-local"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '16px',
                  color: '#1d1d1f'
                }}
              />
            </Card.Body>
          </Card>
        </motion.div>

        {/* Category Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="main-card mb-4 border-0">
            <Card.Body className="p-4">
              <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '16px' }}>Choose Category</h5>
              <Row className="g-3">
                {categories.map((category, index) => (
                  <Col xs={4} key={category.id}>
                    <motion.button
                      onClick={() => setSelectedCategory(category)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        width: '100%',
                        padding: '16px 8px',
                        border: selectedCategory?.id === category.id ? '2px solid #1d1d1f' : '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '16px',
                        background: selectedCategory?.id === category.id ? category.color : 'rgba(255,255,255,0.5)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{category.emoji}</div>
                      <div style={{ fontSize: '12px', color: '#1d1d1f', fontWeight: '500' }}>
                        {category.name}
                      </div>
                    </motion.button>
                  </Col>
                ))}
                <Col xs={4}>
                  <motion.button
                    onClick={() => navigate('/categories')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: '100%',
                      padding: '16px 8px',
                      border: '2px dashed rgba(100, 116, 139, 0.4)',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>➕</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                      Add New
                    </div>
                  </motion.button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={!amount || !selectedCategory || loading}
            style={{
              width: '100%',
              padding: '16px',
              border: 'none',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '600',
              background: amount && selectedCategory && !loading
                ? (isIncome 
                    ? 'linear-gradient(135deg, #34c759, #30d158)' 
                    : 'linear-gradient(135deg, #1e293b, #0f172a)')
                : '#94a3b8',
              color: 'white',
              boxShadow: amount && selectedCategory && !loading
                ? '0 8px 24px rgba(30, 41, 59, 0.3)' 
                : 'none',
              transition: 'all 0.3s ease',
              cursor: amount && selectedCategory && !loading ? 'pointer' : 'not-allowed'
            }}
          >
            {loading ? 'Adding...' : (isIncome ? ' Add Income' : ' Add Expense')}
          </Button>
        </motion.div>

        {/* Fun Message */}
        {amount && selectedCategory && (
          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: '#64748b' }}
          >
            {isIncome
              ? `💰 +₹${amount} incoming! Your wallet is happy! 😎`
              : `💸 -₹${amount} for ${selectedCategory.name}! ${description || 'Money spent'} 😅`}
          </motion.div>
        )}
      </Container>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Container>
          <Row>
            <Col className="nav-item" onClick={() => navigate('/dashboard')}>
              <div className="nav-icon">🏠</div>
              <div>Home</div>
            </Col>
            <Col className="nav-item" onClick={() => navigate('/history')}>
              <div className="nav-icon">📊</div>
              <div>Transactions</div>
            </Col>
            <Col className="nav-item" onClick={() => navigate('/analytics')}>
              <div className="nav-icon">📈</div>
              <div>Analytics</div>
            </Col>
            <Col className="nav-item" onClick={() => navigate('/settings')}>
              <div className="nav-icon">👤</div>
              <div>Account</div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}