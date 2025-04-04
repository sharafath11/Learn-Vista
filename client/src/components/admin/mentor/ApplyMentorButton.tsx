import { FC } from 'react';
import { motion } from 'framer-motion';

const ApplyMentorButton: FC = () => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
    >
      List of applayers 
    </motion.button>
  );
};

export default ApplyMentorButton;