"use client"

import { ITestimonialCardProps } from "@/src/types/userProps";
import { motion } from "framer-motion";
import { WithTooltip } from "@/src/hooks/UseTooltipProps"; 

export default function TestimonialCard({
  name,
  role,
  content,
  avatar,
  active,
  onClick,
}: ITestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`absolute inset-0 bg-gray-50 p-6 sm:p-8 rounded-xl shadow transition-opacity duration-300 ${
        !active ? "pointer-events-none" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-6">
        {/* Avatar with tooltip */}
        <WithTooltip content={name}>
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
            {avatar}
          </div>
        </WithTooltip>

        <div>
          {/* Name with tooltip */}
          <WithTooltip content={name}>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">{name}</h4>
          </WithTooltip>

          {/* Role with tooltip */}
          <WithTooltip content={role}>
            <p className="text-sm text-gray-600">{role}</p>
          </WithTooltip>
        </div>
      </div>

      {/* Content (testimonial) with tooltip */}
      <WithTooltip content={content}>
        <p className="text-gray-700 text-sm sm:text-lg italic">{`"${content}"`}</p>
      </WithTooltip>
    </motion.div>
  );
}
