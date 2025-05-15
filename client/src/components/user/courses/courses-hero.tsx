import { motion } from 'framer-motion'

export default function CoursesHero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Explore Our Courses
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-blue-100 max-w-3xl mx-auto"
        >
          Discover thousands of courses taught by industry experts to boost your career
        </motion.p>
      </div>
    </section>
  )
}