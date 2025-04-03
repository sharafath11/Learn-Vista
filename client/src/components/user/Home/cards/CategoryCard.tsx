import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  courses: number;
}

export default function CategoryCard({ icon, title, courses }: CategoryCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex flex-col items-center text-center">
        <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
          {icon}
        </div>
        <h3 className="mt-6 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{courses} courses</p>
        <button className="mt-6 text-blue-600 font-medium hover:text-blue-700 flex items-center">
          Explore <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
