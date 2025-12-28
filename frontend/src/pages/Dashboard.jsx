import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import AuthService from '../services/authService'
import TransactionService from '../services/transactionService'

// Custom hook for counting animation
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (end === 0) {
      setCount(0)
      return
    }
    
    let startTime
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [end, duration])
  
  return count
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [dashboardStats, setDashboardStats] = useState({
    wallet_balance: 0,
    month_spending: 0,
    month_income: 0,
    spending_change: { percentage: 0, direction: 'same', has_comparison: false },
    streak: 0,
    mood: { emoji: '😐', text: 'Okay' }
  })
  
  // Animated counters
  const animatedBalance = useCountUp(dashboardStats.wallet_balance, 1500)
  const animatedSpending = useCountUp(dashboardStats.month_spending, 1200)
  
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    loadTransactions()
    loadDashboardStats()
    
    // Check if returning from add transaction
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
      // Clean URL
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [])

  const loadTransactions = async () => {
    const data = await TransactionService.getTransactions()
    setTransactions(data.slice(0, 4)) // Show only recent 4
  }

  const loadDashboardStats = async () => {
    try {
      const response = await AuthService.apiCall('/dashboard/')
      if (response.ok) {
        const data = await response.json()
        setDashboardStats({
          wallet_balance: data.wallet_balance,
          month_spending: data.month_spending,
          month_income: data.month_income || 0,
          spending_change: data.spending_change || { percentage: 0, direction: 'same', has_comparison: false },
          streak: data.streak || 0,
          mood: data.mood || { emoji: '😐', text: 'Okay' }
        })
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  return (
    <div style={{ paddingBottom: '120px', minHeight: '100vh' }}>
      <Container className="py-4">
        {/* Celebration Animation */}
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              style={{
                background: 'rgba(52, 199, 89, 0.95)',
                borderRadius: '20px',
                padding: '32px 24px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(52, 199, 89, 0.3)',
                maxWidth: '300px',
                width: '100%',
                margin: '0 auto'
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: 2
                }}
                style={{ fontSize: '3rem', marginBottom: '16px' }}
              >
                🎉
              </motion.div>
              <h4 style={{ color: 'white', fontWeight: '700', marginBottom: '8px', fontSize: '1.25rem' }}>
                Transaction Added!
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: '14px' }}>
                Your wallet has been updated ✨
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div 
          className="d-flex justify-content-between align-items-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h3 style={{ color: '#1d1d1f', fontWeight: '700', marginBottom: '4px' }}>
              Hello, {user?.username || 'User'}! 👋
            </h3>
            <h6 className="soft-text mb-0">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h6>
          </div>
          <div className="d-flex gap-3">
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)'
            }}>
              🔔
            </div>
            <div 
              onClick={() => navigate('/settings')}
              style={{ 
                width: '40px', 
                height: '40px', 
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)',
                cursor: 'pointer'
              }}
            >
              ⚙️
            </div>
          </div>
        </motion.div>

        {/* Main Spend Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="main-card mb-4 border-0">
            <Card.Body className="p-4">
              <h6 className="soft-text mb-2">This Month Spend</h6>
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: '700', 
                color: '#1d1d1f',
                lineHeight: '1',
                marginBottom: '8px'
              }}>
                ₹{animatedSpending.toLocaleString()}
              </h1>
              <p className="soft-text mb-0">
                {dashboardStats.spending_change.has_comparison ? (
                  <span style={{ 
                    color: dashboardStats.spending_change.direction === 'up' ? '#ff3b30' : 
                           dashboardStats.spending_change.direction === 'down' ? '#34c759' : '#8e8e93'
                  }}>
                    {dashboardStats.spending_change.direction === 'up' ? '↗' : 
                     dashboardStats.spending_change.direction === 'down' ? '↘' : '→'} 
                    {Math.abs(dashboardStats.spending_change.percentage)}%
                  </span>
                ) : (
                  <span style={{ color: '#8e8e93' }}>✨ Your money journey </span>
                )} begins now 
              </p>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="wallet-card mb-4 border-0">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h6 style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
                    Wallet Balance
                  </h6>
                  <motion.h2 
                    style={{ 
                      color: 'white', 
                      fontWeight: '700',
                      fontSize: '1.8rem',
                      marginBottom: '0'
                    }}
                    animate={{ 
                      scale: dashboardStats.wallet_balance !== animatedBalance ? [1, 1.05, 1] : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    ₹{animatedBalance.toLocaleString()}
                  </motion.h2>
                </div>
                <div style={{ fontSize: '2rem' }}>💳</div>
              </div>
              
              {/* HP Bar */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Balance Health</span>
                  <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                    ₹{dashboardStats.month_income.toLocaleString()}
                  </span>
                </div>
                <div style={{ 
                  background: 'rgba(255,255,255,0.2)', 
                  borderRadius: '10px', 
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: dashboardStats.month_income > 0
                        ? `${Math.min(100, Math.max(5, (dashboardStats.wallet_balance / dashboardStats.month_income) * 100))}%`
                        : '5%'
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{
                      background: dashboardStats.wallet_balance >= dashboardStats.month_income * 0.5
                        ? 'linear-gradient(90deg, #10b981, #059669)'
                        : dashboardStats.wallet_balance >= dashboardStats.month_income * 0.2
                        ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                        : 'linear-gradient(90deg, #ef4444, #dc2626)',
                      height: '100%',
                      borderRadius: '10px'
                    }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Stats Row - Streak & Mood */}
        <Row className="g-3 mb-4">
          <Col xs={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="glass-card border-0">
                <Card.Body className="p-3 text-center">
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔥</div>
                  <h4 style={{ color: '#1d1d1f', fontWeight: '700', marginBottom: '2px' }}>{dashboardStats.streak}</h4>
                  <p className="soft-text mb-0" style={{ fontSize: '14px' }}>Savings Days</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col xs={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card border-0">
                <Card.Body className="p-3 text-center">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ fontSize: '2rem', marginBottom: '8px' }}
                  >
                    {dashboardStats.mood.emoji}
                  </motion.div>
                  <h4 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '2px' }}>{dashboardStats.mood.text}</h4>
                  <p className="soft-text mb-0" style={{ fontSize: '14px' }}>Spending Level</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '0' }}>
              Recent Transactions
            </h5>
            <span 
              className="soft-text" 
              style={{ fontSize: '14px', cursor: 'pointer' }}
              onClick={() => navigate('/history')}
            >
              See All
            </span>
          </div>
          
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="transaction-card border-0">
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(102, 126, 234, 0.1)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        marginRight: '12px'
                      }}>
                        {transaction.category?.emoji || '💰'}
                      </div>
                      <div>
                        <h6 style={{ 
                          color: '#1d1d1f', 
                          fontWeight: '600', 
                          marginBottom: '2px',
                          fontSize: '16px'
                        }}>
                          {transaction.description || transaction.category?.name || 'Transaction'}
                        </h6>
                        <p className="soft-text mb-0" style={{ fontSize: '14px' }}>
                          {new Date(transaction.created_at).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={transaction.transaction_type === 'income' ? 'amount-positive' : 'amount-negative'}>
                      {transaction.transaction_type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount)}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>

      {/* Floating Add Button */}
      <motion.button
        className="floating-btn"
        onClick={() => navigate('/add')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        +
      </motion.button>

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