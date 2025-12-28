import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { useState, useEffect } from 'react'

export default function Settings() {
  const navigate = useNavigate()
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    if (newMode) {
      document.body.classList.add('dark-theme')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-theme')
      localStorage.setItem('theme', 'light')
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
              Settings
            </h3>
            <h6 className="soft-text mb-0">
              Customize your experience
            </h6>
          </div>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="main-card mb-4 border-0">
            <Card.Body className="p-4">
              <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '16px' }}>
                Appearance
              </h5>
              
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
                    {isDarkMode ? '🌙' : '☀️'}
                  </div>
                  <div>
                    <h6 style={{ 
                      color: '#1d1d1f', 
                      fontWeight: '600', 
                      marginBottom: '2px',
                      fontSize: '16px'
                    }}>
                      Dark Mode
                    </h6>
                    <p className="soft-text mb-0" style={{ fontSize: '14px' }}>
                      {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                    </p>
                  </div>
                </div>
                
                <div 
                  onClick={toggleDarkMode}
                  style={{
                    width: '60px',
                    height: '32px',
                    background: isDarkMode ? '#34c759' : '#e5e7eb',
                    borderRadius: '16px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <motion.div
                    animate={{ x: isDarkMode ? 28 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      width: '28px',
                      height: '28px',
                      background: 'white',
                      borderRadius: '14px',
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Other Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="main-card mb-4 border-0">
            <Card.Body className="p-4">
              <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '16px' }}>
                Account
              </h5>
              
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255, 59, 48, 0.1)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    marginRight: '12px'
                  }}>
                    🚪
                  </div>
                  <div>
                    <h6 style={{ 
                      color: '#1d1d1f', 
                      fontWeight: '600', 
                      marginBottom: '2px',
                      fontSize: '16px'
                    }}>
                      Sign Out
                    </h6>
                    <p className="soft-text mb-0" style={{ fontSize: '14px' }}>
                      Sign out of your account
                    </p>
                  </div>
                </div>
                <div style={{ color: '#8e8e93', fontSize: '18px' }}>→</div>
              </div>
            </Card.Body>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="main-card border-0">
            <Card.Body className="p-4 text-center">
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💰</div>
              <h5 style={{ color: '#1d1d1f', fontWeight: '600', marginBottom: '8px' }}>
                CtrlExpense
              </h5>
              <p className="soft-text mb-2" style={{ fontSize: '14px' }}>
                Version 1.0.0
              </p>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(100, 116, 139, 0.2)' }}>
                <p className="soft-text mb-1" style={{ fontSize: '12px' }}>
                  Developed by
                </p>
                <a 
                  href="https://www.linkedin.com/in/anazil/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#667eea', 
                    textDecoration: 'none', 
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  Muhammed Anazil T A
                </a>
              </div>
            </Card.Body>
          </Card>
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
            <Col className="nav-item active">
              <div className="nav-icon">👤</div>
              <div>Account</div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}