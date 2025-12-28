import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import TransactionService from '../services/transactionService'
import TransactionFilter from '../components/TransactionFilter'
import QuickFilters from '../components/QuickFilters'

export default function History() {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [allTransactions, setAllTransactions] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})
  const [hasActiveFilters, setHasActiveFilters] = useState(false)
  const [activeQuickFilter, setActiveQuickFilter] = useState('All')
  
  useEffect(() => {
    loadAllTransactions()
  }, [])

  const loadAllTransactions = async () => {
    const data = await TransactionService.getTransactions()
    setAllTransactions(data)
    setTransactions(data)
  }

  const loadTransactions = async (filters = {}) => {
    const data = await TransactionService.getTransactions(filters)
    setTransactions(data)
  }

  const handleApplyFilters = (filters) => {
    const hasFilters = Object.values(filters).some(value => value !== '')
    setActiveFilters(filters)
    setHasActiveFilters(hasFilters)
    setActiveQuickFilter(hasFilters ? null : 'All')
    loadTransactions(filters)
  }

  const handleQuickFilter = (filters, label) => {
    setActiveQuickFilter(label)
    setActiveFilters(filters)
    setHasActiveFilters(Object.keys(filters).length > 0)
    loadTransactions(filters)
  }

  const totalSpent = allTransactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const totalEarned = allTransactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const balance = totalEarned - totalSpent

  // Get current month transactions
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  
  const monthTransactions = allTransactions.filter(t => {
    const transactionDate = new Date(t.transaction_date)
    return transactionDate >= monthStart
  })
  
  const monthSpent = monthTransactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const monthEarned = monthTransactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  // Calculate mood based on month expense percentage compared to month income
  const getMoodStatus = () => {
    if (monthEarned === 0) {
      return { 
        emoji: '💀', 
        text: 'Dead',
        message: 'No income this month! Time to find some revenue streams 💰'
      }
    }
    
    const expensePercentage = (monthSpent / monthEarned) * 100
    
    if (expensePercentage <= 25) {
      return { 
        emoji: '😎', 
        text: 'Excellent',
        message: 'Amazing financial discipline! You\'re saving like a pro 🎆'
      }
    } else if (expensePercentage <= 40) {
      return { 
        emoji: '😊', 
        text: 'Good',
        message: 'Great job! You\'re managing your money well 👏'
      }
    } else if (expensePercentage <= 60) {
      return { 
        emoji: '😐', 
        text: 'Okay',
        message: 'Decent spending habits, but room for improvement 📊'
      }
    } else if (expensePercentage <= 80) {
      return { 
        emoji: '😰', 
        text: 'Worried',
        message: 'High spending alert! Consider reducing expenses ⚠️'
      }
    } else {
      return { 
        emoji: '💀', 
        text: 'Dead',
        message: 'Overspending danger! Immediate budget review needed 🚨'
      }
    }
  }

  const moodStatus = getMoodStatus()

  // Sort transactions by date (most recent first) and group by date
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.transaction_date) - new Date(a.transaction_date)
  )
  
  const groupedTransactions = sortedTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.transaction_date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short', 
      day: 'numeric'
    })
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {})

  return (
    <div style={{ paddingBottom: '120px', minHeight: '100vh' }}>
      <Container className="py-4">
        {/* Header */}
        <motion.div 
          className="d-flex align-items-center justify-content-between mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="d-flex align-items-center">
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
                Transactions
              </h3>
              <h6 className="soft-text mb-0">
                Your spending history
              </h6>
            </div>
          </div>
          <button 
            onClick={() => setShowFilter(true)}
            style={{
              background: hasActiveFilters 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '12px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              color: hasActiveFilters ? 'white' : '#1d1d1f',
              position: 'relative'
            }}
          >
            🔍
            {hasActiveFilters && (
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                background: '#ff3b30',
                borderRadius: '50%',
                border: '2px solid white'
              }} />
            )}
          </button>
        </motion.div>

        {/* Stats Summary */}
        <Row className="g-3 mb-4">
          <Col xs={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="main-card border-0">
                <Card.Body className="p-3 text-center">
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💰</div>
                  <h4 style={{ color: '#34c759', fontWeight: '700', marginBottom: '4px' }}>
                    ₹{totalEarned.toLocaleString()}
                  </h4>
                  <p className="soft-text mb-0" style={{ fontSize: '14px' }}>Total Earned</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col xs={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="main-card border-0">
                <Card.Body className="p-3 text-center">
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>💸</div>
                  <h4 style={{ color: '#ff3b30', fontWeight: '700', marginBottom: '4px' }}>
                    ₹{totalSpent.toLocaleString()}
                  </h4>
                  <p className="soft-text mb-0" style={{ fontSize: '14px' }}>Total Spent</p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Spending Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 mb-4" style={{
            background: moodStatus.emoji === '😎' || moodStatus.emoji === '😊'
              ? 'linear-gradient(135deg, rgba(52, 199, 89, 0.1), rgba(48, 209, 88, 0.05))'
              : moodStatus.emoji === '😐'
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))'
              : moodStatus.emoji === '😰'
              ? 'linear-gradient(135deg, rgba(255, 59, 48, 0.1), rgba(255, 107, 107, 0.05))'
              : 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(75, 85, 99, 0.05))',
            borderRadius: '24px',
            boxShadow: moodStatus.emoji === '😎' || moodStatus.emoji === '😊'
              ? '0 8px 32px rgba(52, 199, 89, 0.15)'
              : moodStatus.emoji === '😐'
              ? '0 8px 32px rgba(245, 158, 11, 0.15)'
              : moodStatus.emoji === '😰'
              ? '0 8px 32px rgba(255, 59, 48, 0.15)'
              : '0 8px 32px rgba(0, 0, 0, 0.15)'
          }}>
            <Card.Body className="p-4 text-center">
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
                style={{ fontSize: '2.5rem', marginBottom: '12px' }}
              >
                {moodStatus.emoji}
              </motion.div>
              <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '8px' }}>
                Financial Mood: {moodStatus.text}
              </h5>
              <p className="soft-text mb-2" style={{ fontSize: '14px' }}>
                Spending Level
              </p>
              <p className="soft-text mb-0" style={{ fontSize: '13px', fontStyle: 'italic' }}>
                {moodStatus.message}
              </p>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Quick Filters */}
        <QuickFilters 
          onApplyFilter={(filters) => {
            const label = filters.type === 'income' ? 'Income' 
              : filters.type === 'expense' ? 'Expenses'
              : filters.date_from === new Date().toISOString().split('T')[0] ? 'Today'
              : filters.date_from === new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ? 'This Week'
              : filters.date_from === new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0] ? 'This Month'
              : 'All'
            handleQuickFilter(filters, label)
          }}
          activeFilter={activeQuickFilter}
        />

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: 0 }}>
              Recent Activity
            </h5>
            {hasActiveFilters && (
              <button
                onClick={() => handleApplyFilters({})}
                style={{
                  background: 'rgba(255, 59, 48, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '4px 8px',
                  color: '#ff3b30',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
          
          {Object.keys(groupedTransactions).length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-5"
            >
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
              <h5 style={{ color: '#64748b', fontWeight: '600' }}>
                {hasActiveFilters ? 'No transactions match your filters' : 'No transactions yet'}
              </h5>
              <p className="soft-text">
                {hasActiveFilters ? 'Try adjusting your filter criteria' : 'Start by adding your first transaction'}
              </p>
            </motion.div>
          ) : (
            Object.entries(groupedTransactions).map(([date, transactions], groupIndex) => (
              <div key={date} className="mb-4">
                <h6 style={{ color: '#64748b', fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>
                  {date}
                </h6>
                
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + groupIndex * 0.1 + index * 0.05 }}
                  >
                    <Card className="transaction-card border-0">
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <div style={{
                              width: '48px',
                              height: '48px',
                              background: transaction.transaction_type === 'income' 
                                ? 'rgba(52, 199, 89, 0.1)' 
                                : 'rgba(255, 59, 48, 0.1)',
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
                              <div className="d-flex align-items-center">
                                <span style={{
                                  background: transaction.transaction_type === 'income' 
                                    ? 'rgba(52, 199, 89, 0.2)' 
                                    : 'rgba(255, 59, 48, 0.2)',
                                  color: transaction.transaction_type === 'income' ? '#059669' : '#dc2626',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  marginRight: '8px'
                                }}>
                                  {transaction.category?.name || transaction.transaction_type}
                                </span>
                                <span className="soft-text" style={{ fontSize: '12px' }}>
                                  {new Date(transaction.transaction_date).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div style={{
                            color: transaction.transaction_type === 'income' ? '#34c759' : '#ff3b30',
                            fontWeight: '700',
                            fontSize: '16px'
                          }}>
                            {transaction.transaction_type === 'income' ? '+' : '-'}₹{Math.abs(transaction.amount)}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ))
          )}
        </motion.div>

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

      {/* Transaction Filter Modal */}
      <TransactionFilter
        show={showFilter}
        onHide={() => setShowFilter(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
      />
    </div>
  )
}