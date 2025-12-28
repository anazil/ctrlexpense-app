import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import AuthService from '../services/authService'
import TransactionService from '../services/transactionService'

export default function Analytics() {
  const navigate = useNavigate()
  const [analyticsData, setAnalyticsData] = useState({
    category_spending: [],
    monthly_trend: [],
    income_vs_expense: { income: 0, expenses: 0 }
  })
  const [transactions, setTransactions] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  
  useEffect(() => {
    loadAnalyticsData()
    loadTransactions()
  }, [selectedMonth])

  const loadAnalyticsData = async () => {
    try {
      const response = await AuthService.apiCall('/analytics/')
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const loadTransactions = async () => {
    const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1).toISOString().split('T')[0]
    const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).toISOString().split('T')[0]
    
    const data = await TransactionService.getTransactions({
      date_from: monthStart,
      date_to: monthEnd
    })
    setTransactions(data) // Get all transactions for calculations
  }

  // Calculate monthly income and expenses from filtered transactions
  const monthlyIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const monthlyExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  return (
    <div style={{ paddingBottom: '120px', minHeight: '100vh' }}>
      <Container className="py-4">
        {/* Header with Month Selector */}
        <motion.div 
          className="d-flex align-items-center justify-content-between mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="d-flex align-items-center">
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
              Analytics
            </h4>
          </div>
          
          {/* Month Navigation */}
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
              style={{
                background: 'rgba(255,255,255,0.3)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ←
            </button>
            <span style={{ 
              color: '#1d1d1f', 
              fontWeight: '600',
              minWidth: '100px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {selectedMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <button
              onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
              disabled={selectedMonth >= new Date()}
              style={{
                background: selectedMonth >= new Date() ? 'rgba(200,200,200,0.3)' : 'rgba(255,255,255,0.3)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: selectedMonth >= new Date() ? 0.5 : 1
              }}
            >
              →
            </button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <Row className="g-3 mb-4">
          <Col xs={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card border-0">
                <Card.Body className="p-3 text-center">
                  <h6 className="soft-text mb-1">Total Income</h6>
                  <h4 style={{ color: '#667eea', fontWeight: '700', marginBottom: '0' }}>
                    ₹{monthlyIncome.toLocaleString()}
                  </h4>
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
              <Card className="glass-card border-0">
                <Card.Body className="p-3 text-center">
                  <h6 className="soft-text mb-1">Total Expense</h6>
                  <h4 style={{ color: '#34c759', fontWeight: '700', marginBottom: '0' }}>
                    ₹{monthlyExpenses.toLocaleString()}
                  </h4>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-0 mb-4">
            <Card.Body className="p-4">
              <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '24px' }}>
                Monthly Overview
              </h5>
              
              <div className="d-flex align-items-end justify-content-between" style={{ height: '200px' }}>
                {analyticsData.monthly_trend.length > 0 ? (
                  analyticsData.monthly_trend.map((data, index) => {
                    const maxAmount = Math.max(...analyticsData.monthly_trend.map(d => d.amount), 1000)
                    return (
                      <motion.div 
                        key={data.month}
                        className="d-flex flex-column align-items-center"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        style={{ flex: 1, maxWidth: '40px' }}
                      >
                        <div className="d-flex flex-column align-items-center mb-2" style={{ height: '160px', justifyContent: 'flex-end' }}>
                          <div 
                            className="chart-bar expense"
                            style={{ 
                              width: '16px',
                              height: `${Math.max(10, (data.amount / maxAmount) * 120)}px`,
                              background: 'linear-gradient(135deg, #34c759, #30d158)'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '12px', color: '#8e8e93', fontWeight: '500' }}>
                          {data.month}
                        </span>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="text-center w-100">
                    <p className="soft-text">No data available</p>
                  </div>
                )}
              </div>
              
              <div className="d-flex justify-content-center mt-3 gap-4">
                <div className="d-flex align-items-center">
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    background: 'linear-gradient(135deg, #34c759, #30d158)',
                    borderRadius: '2px',
                    marginRight: '8px'
                  }} />
                  <span style={{ fontSize: '12px', color: '#8e8e93' }}>Monthly Expenses</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Recent History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '0' }}>
              Recent History
            </h5>
            <span 
              className="soft-text" 
              style={{ fontSize: '14px', cursor: 'pointer' }}
              onClick={() => navigate('/history')}
            >
              See More
            </span>
          </div>
          
          {transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📭</div>
              <h6 style={{ color: '#64748b', fontWeight: '600' }}>
                No transactions this month
              </h6>
              <p className="soft-text">
                Start by adding your first transaction
              </p>
            </motion.div>
          ) : (
            transactions.slice(0, 4).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
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
                          <p className="soft-text mb-0" style={{ fontSize: '14px' }}>
                            {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
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
            ))
          )}
        </motion.div>
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