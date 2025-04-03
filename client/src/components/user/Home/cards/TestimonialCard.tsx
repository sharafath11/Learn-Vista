import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  avatar: ReactNode;
  active: boolean;
  onClick?: () => void;
}

export default function TestimonialCard({ name, role, content, avatar, active, onClick }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className={`absolute inset-0 bg-gray-50 p-8 rounded-xl shadow-md flex flex-col justify-center ${
        !active && "pointer-events-none"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center mb-6">
        <div className="relative h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mr-6">
          {avatar}
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-900">{name}</h4>
          <p className="text-gray-600">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 text-lg italic">"{content}"</p>
    </motion.div>
  );
}
