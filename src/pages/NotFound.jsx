import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CloudRain, Home } from 'lucide-react';
import { Container } from '../components/ui/Container';

export const NotFound = () => {
  return (
    <Container className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <div className="absolute inset-0 bg-blue-100 blur-3xl opacity-50 rounded-full" />
        <CloudRain className="w-32 h-32 text-blue-500 relative z-10 mx-auto" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className="text-6xl font-light text-gray-900 mt-8 tracking-tighter"
      >
        404
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="text-xl text-gray-500 mt-4 max-w-md"
      >
        It looks like the weather here is unknown. The page you're looking for doesn't exist.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="mt-8"
      >
        <Link 
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/30"
        >
          <Home className="w-5 h-5" />
          Return Home
        </Link>
      </motion.div>
    </Container>
  );
};
