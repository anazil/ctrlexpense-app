import { motion } from 'framer-motion'

export default function Card({ 
  children, 
  className = '', 
  hover = true,
  ...props 
}) {
  return (
    <motion.div
      className={`glass-card p-4 ${className}`}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}