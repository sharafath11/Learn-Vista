import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Star } from "lucide-react";

interface CourseCardProps {
  title: string;
  instructor: string;
  level: string;
  duration: string;
  rating: number;
  students: number;
  price: string;
  originalPrice?: string;
  index: number;
}

export default function CourseCard({
  title,
  instructor,
  level,
  duration,
  rating,
  students,
  price,
  originalPrice,
  index,
}: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="relative h-48">
        <Image
          src={`/placeholder.svg?height=400&width=600&text=Course+${index + 1}`}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {level}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center text-sm text-gray-500 mb-1">
          <Clock className="h-4 w-4 mr-1" />
          <span>{duration}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">By {instructor}</p>

        <div className="flex items-center mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {rating.toFixed(1)} ({students.toLocaleString()})
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold text-gray-900">{price}</span>
            {originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">{originalPrice}</span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Enroll Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
