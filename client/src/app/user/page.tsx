"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, Award, Users, Clock, ChevronRight } from "lucide-react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "@/src/components/user/Header";
import CategoryCard from "@/src/components/user/Home/cards/CategoryCard";
import CourseCard from "@/src/components/user/Home/cards/CourseCard";
import FeatureCard from "@/src/components/user/Home/cards/FeatureCard";
import TestimonialCard from "@/src/components/user/Home/cards/TestimonialCard";
export default function Home() {
  // Animation controls
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Testimonial auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate when in view
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
   
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideInLeft}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Expand Your <span className="text-blue-600">Knowledge</span> with Expert-Led Courses
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Access thousands of high-quality courses taught by industry experts and transform your skills.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Courses
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center shadow hover:shadow-md"
              >
                How It Works <ChevronRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={slideInRight}
            className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/logo.png"
              alt="Students learning online"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-blue-600/30"></div>
          </motion.div>
        </div>
      </section>
      <motion.section 
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={container}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Online Courses" },
              { value: "250+", label: "Expert Instructors" },
              { value: "15M+", label: "Students Worldwide" },
              { value: "4.8/5", label: "Student Satisfaction" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={container}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
                  <p className="text-lg text-gray-600">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Top Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the perfect course in our diverse categories
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <CategoryCard
              icon={<BookOpen className="h-10 w-10 text-blue-600" />}
              title="Web Development"
              courses={420}
            />
            <CategoryCard 
              icon={<Award className="h-10 w-10 text-blue-600" />}
              title="Data Science"
              courses={310}
            />
            <CategoryCard 
              icon={<Users className="h-10 w-10 text-blue-600" />}
              title="Business"
              courses={280}
            />
            <CategoryCard 
              icon={<Clock className="h-10 w-10 text-blue-600" />}
              title="Design"
              courses={340}
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:flex-row justify-between items-center mb-16"
          >
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
              <p className="text-xl text-gray-600">Handpicked courses to get you started</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              View All Courses
            </motion.button>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <CourseCard
              title="Complete Web Development Bootcamp"
              instructor="Sarah Johnson"
              level="Beginner"
              duration="48 hours"
              rating={4.9}
              students={12500}
              price="$89.99"
              originalPrice="$199.99"
              index={0}
            />
            <CourseCard
              title="Advanced Data Science with Python"
              instructor="Michael Chen"
              level="Intermediate"
              duration="36 hours"
              rating={4.8}
              students={8300}
              price="$94.99"
              originalPrice="$229.99"
              index={1}
            />
            <CourseCard
              title="UI/UX Design Masterclass"
              instructor="Emma Rodriguez"
              level="All Levels"
              duration="24 hours"
              rating={4.7}
              students={6200}
              price="$79.99"
              originalPrice="$179.99"
              index={2}
            />
          </motion.div>

          <div className="mt-12 text-center md:hidden">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-all duration-300"
            >
              View All Courses
            </motion.button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best learning experience
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<Users className="h-10 w-10 text-blue-600" />}
              title="Expert Instructors"
              description="Learn from industry professionals with years of experience"
              features={["Industry veterans", "Practical knowledge", "Active professionals"]}
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-blue-600" />}
              title="Flexible Learning"
              description="Study at your own pace, anywhere and anytime"
              features={["Lifetime access", "Mobile friendly", "Self-paced courses"]}
            />
            <FeatureCard
              icon={<Award className="h-10 w-10 text-blue-600" />}
              title="Certification"
              description="Earn certificates recognized by top companies"
              features={["Industry-recognized", "Portfolio ready", "Verifiable online"]}
            />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600">Thousands of satisfied learners</p>
          </motion.div>

          <div className="relative h-96">
            <AnimatePresence mode="wait">
              <TestimonialCard
                name="Alex Thompson"
                role="Web Developer"
                content="The courses on this platform completely transformed my career. I went from knowing nothing about web development to landing a job at a top tech company in just 6 months."
                avatar="A"
                active={activeTestimonial === 0}
                onClick={() => setActiveTestimonial(0)}
              />
              <TestimonialCard
                name="Jessica Lee"
                role="Data Analyst"
                content="The instructors are incredibly knowledgeable and the course material is comprehensive. I've tried other platforms, but none compare to the quality of education I received here."
                avatar="J"
                active={activeTestimonial === 1}
                onClick={() => setActiveTestimonial(1)}
              />
              <TestimonialCard
                name="David Wilson"
                role="UX Designer"
                content="The community support and networking opportunities are invaluable. I not only gained technical skills but also made connections that helped me advance in my career."
                avatar="D"
                active={activeTestimonial === 2}
                onClick={() => setActiveTestimonial(2)}
              />
            </AnimatePresence>
          </div>
          <div className="flex justify-center mt-8 space-x-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-3 h-3 rounded-full ${i === activeTestimonial ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={scaleUp}
        className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of students already learning on our platform. Get unlimited access to all courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started For Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border-2 border-white hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
            >
              View All Courses
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}