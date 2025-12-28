import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CategorySelector from './pages/CategorySelector'
import Analytics from './pages/Analytics'
import AddTransaction from './pages/AddTransaction'
import History from './pages/History'
import Settings from './pages/Settings'

function App() {
  useEffect(() => {
    // Initialize theme on app load
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme')
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<CategorySelector />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App