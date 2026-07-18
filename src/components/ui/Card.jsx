import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hover = false, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    whileHover={hover ? { y: -2, transition: { duration: 0.15, ease: 'easeInOut' } } : {}}
    // Glassmorphism: semi-transparent dark background, stronger blur, light top border inset, soft outer shadow
    className={`bg-card backdrop-blur-2xl border border-border rounded-xl p-6 text-text shadow-[0_8px_30px_rgb(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] ${hover ? 'hover:bg-white/[0.10] transition-colors duration-200' : ''} ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);