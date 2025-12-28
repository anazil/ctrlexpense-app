import { motion } from 'framer-motion'

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) {
  const baseClasses = 'font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-neon-pink to-neon-blue text-white hover:scale-105 focus:ring-neon-pink',
    secondary: 'glass-card text-white hover:scale-105 focus:ring-white/50',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105 focus:ring-green-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:scale-105 focus:ring-red-500',
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}