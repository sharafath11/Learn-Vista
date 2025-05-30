"use client"

import { useState, useEffect } from "react";
import { BookOpen, Award, Users, Clock, ChevronRight, Star, Play, CheckCircle } from "lucide-react";

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { 
      icon: <BookOpen className="h-12 w-12 text-[#8525FF]" />, 
      title: "Web Development", 
      courses: 420,
      color: "from-blue-50 to-blue-100"
    },
    { 
      icon: <Award className="h-12 w-12 text-[#FF6B35]" />, 
      title: "Data Science", 
      courses: 310,
      color: "from-orange-50 to-orange-100"
    },
    { 
      icon: <Users className="h-12 w-12 text-[#00D4AA]" />, 
      title: "Business", 
      courses: 280,
      color: "from-teal-50 to-teal-100"
    },
    { 
      icon: <Clock className="h-12 w-12 text-[#FFB800]" />, 
      title: "Design", 
      courses: 340,
      color: "from-yellow-50 to-yellow-100"
    }
  ];

  const features = [
    {
      icon: <Users className="h-14 w-14 text-[#8525FF]" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience and proven track records.",
      features: ["Industry veterans with 10+ years experience", "Active professionals from top companies", "Personalized feedback and mentorship"],
      gradient: "from-purple-50 to-purple-100"
    },
    {
      icon: <Clock className="h-14 w-14 text-[#00D4AA]" />,
      title: "Flexible Learning",
      description: "Study at your own pace with our adaptive learning platform designed for busy professionals.",
      features: ["Lifetime access to all content", "Mobile-optimized learning experience", "Offline download capabilities"],
      gradient: "from-teal-50 to-teal-100"
    },
    {
      icon: <Award className="h-14 w-14 text-[#FF6B35]" />,
      title: "Industry Certification",
      description: "Earn certificates that are recognized and valued by leading companies worldwide.",
      features: ["Blockchain-verified certificates", "LinkedIn profile integration", "Portfolio-ready projects"],
      gradient: "from-orange-50 to-orange-100"
    }
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Senior Full-Stack Developer",
      company: "Microsoft",
      content: "This platform completely transformed my career trajectory. The quality of instruction and hands-on projects gave me the confidence to land my dream job at a Fortune 500 company.",
      avatar: "AT",
      rating: 5
    },
    {
      name: "Jessica Chen",
      role: "Data Science Manager",
      company: "Google",
      content: "The comprehensive curriculum and expert mentorship helped me transition from marketing to data science. The practical skills I gained were immediately applicable in my new role.",
      avatar: "JC",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "UX Design Lead",
      company: "Airbnb",
      content: "Outstanding platform with world-class instructors. The collaborative learning environment and networking opportunities opened doors I never thought possible.",
      avatar: "MJ",
      rating: 5
    }
  ];

  const stats = [
    { value: "50,000+", label: "Premium Courses", icon: <BookOpen className="h-8 w-8 text-[#8525FF]" /> },
    { value: "1,200+", label: "Expert Instructors", icon: <Users className="h-8 w-8 text-[#00D4AA]" /> },
    { value: "2.5M+", label: "Global Students", icon: <Award className="h-8 w-8 text-[#FF6B35]" /> },
    { value: "98%", label: "Success Rate", icon: <Star className="h-8 w-8 text-[#FFB800]" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#8525FF] rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#00D4AA] rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF6B35] rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#8525FF]/10 to-[#8525FF]/5 rounded-full border border-[#8525FF]/20">
                <Star className="h-4 w-4 text-[#8525FF] mr-2" />
                <span className="text-sm font-medium text-[#8525FF]">Rated #1 Learning Platform 2024</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Master New Skills with 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8525FF] to-[#FF6B35] mt-2">
                  World-Class Education
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Join millions of learners worldwide and accelerate your career with our premium courses taught by industry experts from top companies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative px-8 py-4 bg-[#8525FF] text-white font-semibold rounded-2xl hover:bg-[#7420E6] transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  <span className="relative z-10">Start Learning Today</span>
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-[#8525FF] to-[#A855F7] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                </button>
                
                <button className="group flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-[#8525FF] hover:text-[#8525FF] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8525FF] to-[#A855F7] flex items-center justify-center text-white font-bold border-2 border-white">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">12,000+</span> students joined this week
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-100">
                <div className="space-y-6">
                  {/* Mock Course Card */}
                  <div className="bg-gradient-to-r from-[#8525FF]/10 to-[#A855F7]/10 rounded-2xl p-6 border border-[#8525FF]/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#8525FF] flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Progress</div>
                        <div className="text-xl font-bold text-[#8525FF]">78%</div>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Advanced React Development</h3>
                    <p className="text-sm text-gray-600 mb-4">Master React with hooks, context, and performance optimization</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-[#8525FF] to-[#A855F7] h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  
                  {/* Achievement Badges */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-[#00D4AA]/10 to-[#00D4AA]/5 rounded-xl p-4 border border-[#00D4AA]/20">
                      <Award className="h-8 w-8 text-[#00D4AA] mb-2" />
                      <div className="text-sm font-semibold text-gray-900">Certificate Earned</div>
                    </div>
                    <div className="bg-gradient-to-r from-[#FFB800]/10 to-[#FFB800]/5 rounded-xl p-4 border border-[#FFB800]/20">
                      <Star className="h-8 w-8 text-[#FFB800] mb-2" />
                      <div className="text-sm font-semibold text-gray-900">5-Star Rating</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-[#FF6B35] to-[#FFB800] rounded-2xl flex items-center justify-center shadow-xl">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-[#00D4AA] to-[#8525FF] rounded-2xl flex items-center justify-center shadow-xl">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Popular Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover courses across diverse fields and find the perfect path to advance your career
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="group relative">
                <div className={`bg-gradient-to-br ${category.color} rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 font-medium">{category.courses} courses available</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with our premium learning environment designed for success
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${feature.gradient} rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full`}>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {feature.features.map((item, i) => (
                      <div key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-[#8525FF] mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
            <p className="text-xl text-gray-600">Real transformations from our learning community</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${activeTestimonial === index ? 'opacity-100 transform translate-x-0' : 'opacity-0 absolute inset-0 transform translate-x-8'}`}
              >
                <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
                  <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-[#FFB800] fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                      "{testimonial.content}"
                    </blockquote>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8525FF] to-[#A855F7] flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                      <div className="text-[#8525FF] font-medium">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12 space-x-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'bg-[#8525FF] scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#8525FF] via-[#A855F7] to-[#8525FF] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join over 2.5 million students who have already accelerated their careers with our world-class education platform. Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="px-10 py-5 bg-white text-[#8525FF] font-bold text-lg rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl">
              Start Free Trial
            </button>
            <button className="px-10 py-5 border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-[#8525FF] transform hover:scale-105 transition-all duration-300">
              Browse All Courses
            </button>
          </div>
          
          <div className="mt-12 text-purple-200 text-sm">
            ✓ No credit card required  ✓ 7-day free trial  ✓ Cancel anytime
          </div>
        </div>
      </section>
    </div>
  );
}