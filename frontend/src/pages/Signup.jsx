import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import AuthService from '../services/authService'

const FloatingEmoji = ({ emoji, delay = 0 }) => (
  <motion.div
    className="position-absolute"
    animate={{
      y: [-20, -100, -20],
      x: [0, 50, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      delay,
    }}
    style={{
      fontSize: '2rem',
      left: `${Math.random() * 80}%`,
      top: `${Math.random() * 80}%`,
      zIndex: 1
    }}
  >
    {emoji}
  </motion.div>
)

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    const result = await AuthService.signup({
      username: formData.username,
      email: formData.email,
      password: formData.password
    })
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="min-vh-100 position-relative overflow-hidden d-flex align-items-center">
      {/* Floating Money Emojis */}
      <FloatingEmoji emoji="💸" delay={0} />
      <FloatingEmoji emoji="🔥" delay={1} />
      <FloatingEmoji emoji="💰" delay={2} />
      <FloatingEmoji emoji="⚡" delay={3} />
      <FloatingEmoji emoji="💎" delay={4} />

      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="glass-card p-4" style={{ zIndex: 2 }}>
                <Card.Body>
                  <motion.h1
                    className="text-center mb-3"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      color: '#1d1d1f',
                      textShadow: '0 0 20px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    Join ExpenseZ
                  </motion.h1>
                  
                  <motion.p
                    className="text-center mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ color: '#64748b' }}
                  >
                    Start your money journey today! 🚀
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {error && (
                      <Alert variant="danger" className="mb-3">
                        {error}
                      </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="username"
                          placeholder="Username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          style={{
                            background: 'rgba(255,255,255,0.3)',
                            border: '1px solid rgba(255,255,255,0.4)',
                            borderRadius: '16px',
                            padding: '16px',
                            backdropFilter: 'blur(10px)',
                            color: '#1d1d1f'
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{
                            background: 'rgba(255,255,255,0.3)',
                            border: '1px solid rgba(255,255,255,0.4)',
                            borderRadius: '16px',
                            padding: '16px',
                            backdropFilter: 'blur(10px)',
                            color: '#1d1d1f'
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          style={{
                            background: 'rgba(255,255,255,0.3)',
                            border: '1px solid rgba(255,255,255,0.4)',
                            borderRadius: '16px',
                            padding: '16px',
                            backdropFilter: 'blur(10px)',
                            color: '#1d1d1f'
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-4">
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          style={{
                            background: 'rgba(255,255,255,0.3)',
                            border: '1px solid rgba(255,255,255,0.4)',
                            borderRadius: '16px',
                            padding: '16px',
                            backdropFilter: 'blur(10px)',
                            color: '#1d1d1f'
                          }}
                        />
                      </Form.Group>
                    </Form>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #34c759, #30d158)',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '16px',
                        fontWeight: '600',
                        fontSize: '16px',
                        boxShadow: '0 8px 24px rgba(52, 199, 89, 0.3)',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                      className="w-100 mb-3"
                      size="lg"
                    >
                      {loading ? 'Creating Account...' : 'Create Account 🎉'}
                    </Button>
                  </motion.div>

                  <motion.p
                    className="text-center mb-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    style={{ color: '#64748b' }}
                  >
                    Already have an account? 
                    <span 
                      style={{ color: '#1d1d1f', cursor: 'pointer', fontWeight: '600', marginLeft: '4px' }}
                      onClick={() => navigate('/')}
                    >
                      Sign in
                    </span>
                  </motion.p>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}