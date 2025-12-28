import { motion } from 'framer-motion'

export default function QuickFilters({ onApplyFilter, activeFilter }) {
  const quickFilters = [
    { label: 'All', value: null },
    { label: 'Income', value: { type: 'income' } },
    { label: 'Expenses', value: { type: 'expense' } },
    { label: 'Today', value: { date_from: new Date().toISOString().split('T')[0] } },
    { label: 'This Week', value: { 
      date_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
    }},
    { label: 'This Month', value: { 
      date_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0] 
    }}
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="d-flex gap-2 mb-3"
      style={{ overflowX: 'auto', paddingBottom: '8px' }}
    >
      {quickFilters.map((filter, index) => (
        <button
          key={filter.label}
          onClick={() => onApplyFilter(filter.value || {})}
          style={{
            background: activeFilter === filter.label 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'rgba(255,255,255,0.8)',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: '500',
            color: activeFilter === filter.label ? 'white' : '#64748b',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease'
          }}
        >
          {filter.label}
        </button>
      ))}
    </motion.div>
  )
}