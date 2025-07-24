"use client";

import { useState } from "react";
import { BookOpen, Award, Users, Clock, Star, CheckCircle } from "lucide-react";
import { useUserContext } from "@/src/context/userAuthContext";
import CourseCard from "@/src/components/user/Home/cards/course-card";
import { ICourse } from "@/src/types/courseTypes";
import HeroSection from "@/src/components/user/Home/HeroSection";
import VideoModal from "./VideoModal";
import Testimonials from "@/src/components/user/Home/Testimonials";

export default function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const { allCourses } = useUserContext();

  const features = [
    {
      icon: <Users className="h-14 w-14 text-[#8525FF]" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals with years of real-world experience and proven track records.",
      features: [
        "Industry veterans with 10+ years experience",
        "Active professionals from top companies",
        "Personalized feedback and mentorship",
      ],
      gradient: "from-purple-50 to-purple-100",
    },
    {
      icon: <Clock className="h-14 w-14 text-[#00D4AA]" />,
      title: "Flexible Learning",
      description: "Study at your own pace with our adaptive learning platform designed for busy professionals.",
      features: [
        "Lifetime access to all content",
        "Mobile-optimized learning experience",
        "Offline download capabilities",
      ],
      gradient: "from-teal-50 to-teal-100",
    },
  ];

  const stats = [
    { value: allCourses.length, label: "Premium Courses", icon: <BookOpen className="h-8 w-8 text-[#8525FF]" /> },
    { value: "1,200+", label: "Expert Instructors", icon: <Users className="h-8 w-8 text-[#00D4AA]" /> },
    { value: "2.5M+", label: "Global Students", icon: <Award className="h-8 w-8 text-[#FF6B35]" /> },
    { value: "98%", label: "Success Rate", icon: <Star className="h-8 w-8 text-[#FFB800]" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <HeroSection />
      <VideoModal showVideo={showVideo} onClose={() => setShowVideo(false)} />

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

      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Popular Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover courses across diverse fields and find the perfect path to advance your career
            </p>
          </div>
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Courses</h1>
            {allCourses && allCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allCourses.map((course: ICourse) => (
                  <CourseCard key={course.id || course._id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-12">
                <p className="text-lg">No courses available at the moment.</p>
                <p className="mt-2">Please check back later!</p>
              </div>
            )}
          </div>
        </div>
      </section>

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
          <div
            className={`bg-gradient-to-br ${feature.gradient} rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full`}
          >
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
      
      {/* Certificate Feature Card */}
      <div className="group">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
              <Award className="h-14 w-14 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Valued Certification</h3>
            <p className="text-gray-600 leading-relaxed">
              Earn industry-recognized certificates to validate your skills and boost your career.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-[#8525FF] mr-3 flex-shrink-0" />
              <span className="text-gray-700">Verified digital certificates upon completion</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-[#8525FF] mr-3 flex-shrink-0" />
              <span className="text-gray-700">Shareable on LinkedIn and other platforms</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-[#8525FF] mr-3 flex-shrink-0" />
              <span className="text-gray-700">Includes unique verification URL for employers</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-[#8525FF] mr-3 flex-shrink-0" />
              <span className="text-gray-700">Recognized by top companies worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      <Testimonials />

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
            Join over 2.5 million students who have already accelerated their careers with our world-class education
            platform. Start your journey today.
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
            ✓ No credit card required ✓ 7-day free trial ✓ Cancel anytime
          </div>
        </div>
      </section>
    </div>
  );
}