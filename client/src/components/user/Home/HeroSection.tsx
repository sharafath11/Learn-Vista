"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Star, Play, Award } from "lucide-react";
import { getRandomUnsplashImage } from "@/src/utils/unsplash";
import { useUserContext } from "@/src/context/userAuthContext";

export default function HeroSection() {
  const [randomImage, setRandomImage] = useState<string | null>(null);
 

  useEffect(() => {
    const fetchRandomImage = async () => {
      const imageUrl = await getRandomUnsplashImage();
      setRandomImage(imageUrl);
    };
    fetchRandomImage();
  }, []);

  return (
    <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#8525FF] rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#00D4AA] rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF6B35] rounded-full filter blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#8525FF]/10 to-[#8525FF]/5 rounded-full border border-[#8525FF]/20">
              <Star className="h-4 w-4 text-[#8525FF] mr-2" />
              <span className="text-sm font-medium text-[#8525FF]">Rated #1 Learning Platform 2024</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Master New Skills with{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8525FF] to-[#FF6B35] mt-2">
                World-Class Education
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Join millions of learners worldwide and accelerate your career with our premium courses taught by
              industry experts from top companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/user/courses"
                className="group relative px-8 py-4 bg-[#8525FF] text-white font-semibold rounded-2xl hover:bg-[#7420E6] transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center"
              >
                <span className="relative z-10">Start Learning Today</span>
              </Link>
            </div>
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8525FF] to-[#A855F7] flex items-center justify-center text-white font-bold border-2 border-white"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">12,000+</span> students joined this week
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-100">
              {randomImage && (
                <div className="mb-6 rounded-xl overflow-hidden h-64">
                  <img
                    src={randomImage}
                    alt="Random abstract image"
                    className="w-full h-full object-cover"
                    onError={() => setRandomImage("/placeholder.svg?height=400&width=600")}
                  />
                </div>
              )}
              <div className="space-y-6">
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
                  <p className="text-sm text-gray-600 mb-4">
                    Master React with hooks, context, and performance optimization
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#8525FF] to-[#A855F7] h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-[#FFB800]/10 to-[#FFB800]/5 rounded-xl p-4 border border-[#FFB800]/20">
                    <Star className="h-8 w-8 text-[#FFB800] mb-2" />
                    <div className="text-sm font-semibold text-gray-900">5-Star Rating</div>
                  </div>
                </div>
              </div>
            </div>
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
  );
}