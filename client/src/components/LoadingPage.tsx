// components/LoadingPage.jsx
import { motion } from 'framer-motion';
import { Loader2, Rocket, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const funMessages = [
  "Preparing awesomeness...",
  "Waking up the servers...",
  "Brewing digital coffee...",
  "Almost there...",
  "Loading happiness...",
  "Assembling pixels...",
  "Counting to infinity..."
];

const LoadingPage = () => {
  const [currentMessage, setCurrentMessage] = useState(funMessages[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through fun messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(funMessages[Math.floor(Math.random() * funMessages.length)]);
    }, 3000);

    // Simulate progress (for entertainment)
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 800);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col justify-center items-center gap-6 p-4">
      {/* Animated rocket with trail */}
      <motion.div 
        className="relative"
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Rocket className="h-12 w-12 text-blue-400" />
        <motion.div
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.5
          }}
        >
          <Sparkles className="h-5 w-5 text-yellow-400" />
        </motion.div>
      </motion.div>

      {/* Spinning loader with bounce */}
      <motion.div
        className="flex items-center justify-center p-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        <Loader2 className="h-16 w-16 text-white animate-spin" />
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-xs bg-gray-700 rounded-full h-2.5">
        <motion.div 
          className="bg-blue-500 h-2.5 rounded-full" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Animated text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-center"
      >
        <motion.h1
          className="text-white text-2xl font-medium tracking-wide"
          key={currentMessage}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentMessage}
        </motion.h1>
        <motion.p
          className="text-gray-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          This won't take long...
        </motion.p>
      </motion.div>

      {/* Floating dots for visual interest */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-blue-500/20"
          style={{
            width: Math.random() * 20 + 5,
            height: Math.random() * 20 + 5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 40 - 20],
            x: [0, Math.random() * 40 - 20],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  );
};

export default LoadingPage;