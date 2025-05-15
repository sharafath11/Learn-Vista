"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { BookOpen, Award, Users, Clock, ChevronRight } from "lucide-react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/src/components/user/Header";
import { useUserContext } from "@/src/context/userAuthContext";
import Courses from "@/src/components/user/Courses";

export default function Home() {
  const controls = useAnimation();
  const { allCourses } = useUserContext();
  const [ref, inView] = useInView();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

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

  const categories = [
    { icon: <BookOpen className="h-10 w-10 text-blue-600" />, title: "Web Development", courses: 420 },
    { icon: <Award className="h-10 w-10 text-blue-600" />, title: "Data Science", courses: 310 },
    { icon: <Users className="h-10 w-10 text-blue-600" />, title: "Business", courses: 280 },
    { icon: <Clock className="h-10 w-10 text-blue-600" />, title: "Design", courses: 340 }
  ];

  const features = [
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of experience",
      features: ["Industry veterans", "Practical knowledge", "Active professionals"]
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-600" />,
      title: "Flexible Learning",
      description: "Study at your own pace, anywhere and anytime",
      features: ["Lifetime access", "Mobile friendly", "Self-paced courses"]
    },
    {
      icon: <Award className="h-10 w-10 text-blue-600" />,
      title: "Certification",
      description: "Earn certificates recognized by top companies",
      features: ["Industry-recognized", "Portfolio ready", "Verifiable online"]
    }
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Web Developer",
      content: "The courses on this platform completely transformed my career. I went from knowing nothing about web development to landing a job at a top tech company in just 6 months.",
      avatar: "A"
    },
    {
      name: "Jessica Lee",
      role: "Data Analyst",
      content: "The instructors are incredibly knowledgeable and the course material is comprehensive. I've tried other platforms, but none compare to the quality of education I received here.",
      avatar: "J"
    },
    {
      name: "David Wilson",
      role: "UX Designer",
      content: "The community support and networking opportunities are invaluable. I not only gained technical skills but also made connections that helped me advance in my career.",
      avatar: "D"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={slideInLeft}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Expand Your <span className="text-blue-600">Knowledge</span> with Expert-Led Courses
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Access thousands of high-quality courses taught by industry experts and transform your skills.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Courses
                </motion.div>
              </Button>
              <Button variant="outline" asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center"
                >
                  How It Works <ChevronRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Button>
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

      {/* Stats Section */}
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
              >
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
                    <p className="text-lg text-gray-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
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
            {categories.map((category, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full hover:shadow-md transition-all">
                  <CardHeader className="items-center">
                    {category.icon}
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600">{category.courses} courses</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Courses Section */}
      <Courses/>

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
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full hover:shadow-md transition-all">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2 text-left">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center">
                          <span className="mr-2">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeTestimonial === index ? 1 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 ${activeTestimonial === index ? 'block' : 'hidden'}`}
                >
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <blockquote className="text-lg italic mb-4">
                        "{testimonial.content}"
                      </blockquote>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
            <Button variant="secondary" size="lg" asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Get Started For Free
              </motion.div>
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-blue-700" asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                View All Courses
              </motion.div>
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}