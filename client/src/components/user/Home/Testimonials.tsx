"use client";
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { testimonials } from "@/src/lib/testimonials";
import { WithTooltip } from "@/src/hooks/UseTooltipProps";

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
          <p className="text-xl text-gray-600">Real transformations from our learning community</p>
        </div>

        {/* Testimonial cards */}
        <div className="relative max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                activeTestimonial === index
                  ? "opacity-100 transform translate-x-0"
                  : "opacity-0 absolute inset-0 transform translate-x-8"
              }`}
            >
              <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                  {/* ⭐ Rating with tooltip */}
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <WithTooltip key={i} content={`${testimonial.rating} out of 5 stars`}>
                        <Star className="h-6 w-6 text-[#FFB800] fill-current" />
                      </WithTooltip>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                    {`"${testimonial.content}"`}
                  </blockquote>
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center justify-center">
                  <WithTooltip content={`Student: ${testimonial.name}`}>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#8525FF] to-[#A855F7] flex items-center justify-center text-white font-bold text-lg mr-4 cursor-default">
                      {testimonial.avatar}
                    </div>
                  </WithTooltip>
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

        {/* Pagination dots with tooltips */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((t, i) => (
            <WithTooltip key={i} content={`Go to testimonial by ${t.name}`}>
              <button
                onClick={() => setActiveTestimonial(i)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  i === activeTestimonial ? "bg-[#8525FF] scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            </WithTooltip>
          ))}
        </div>
      </div>
    </section>
  );
}
