"use client"
import { useUserContext } from "@/src/context/userAuthContext";
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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow group"
    >
      <div className="flex flex-col items-center text-center">
        <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
          {icon}
        </div>
        <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm sm:text-base text-gray-600">{courses} courses</p>
        <button
          className="mt-4 sm:mt-6 text-blue-600 font-medium hover:text-blue-700 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Explore ${title}`}
        >
          Explore <ChevronRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
