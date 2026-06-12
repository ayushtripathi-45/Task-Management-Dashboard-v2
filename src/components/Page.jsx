import { motion } from 'framer-motion';

export default function Page({ children, className = '' }) {
  return (
    <motion.section
      className={`page ${className}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {children}
    </motion.section>
  );
}

