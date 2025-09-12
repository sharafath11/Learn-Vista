"use client"

import { IFeatureCardProps } from "@/src/types/userProps";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { WithTooltip } from "@/src/hooks/UseTooltipProps"; 

export default function FeatureCard({
  icon,
  title,
  description,
  features,
}: IFeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Icon */}
      <WithTooltip content={title}>
        <div className="mb-5 p-3 sm:p-4 bg-blue-50 rounded-full w-fit">
          {icon}
        </div>
      </WithTooltip>

      {/* Title */}
      <WithTooltip content={title}>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      </WithTooltip>

      {/* Description */}
      <WithTooltip content={description}>
        <p className="text-sm sm:text-base text-gray-600 mb-4">{description}</p>
      </WithTooltip>

      {/* Features */}
      <ul className="space-y-2 text-sm sm:text-base">
        {features.map((item, i) => (
          <WithTooltip key={i} content={item}>
            <li className="flex items-center text-gray-700">
              <Check className="h-4 w-4 text-blue-600 mr-2 shrink-0" />
              <span>{item}</span>
            </li>
          </WithTooltip>
        ))}
      </ul>
    </motion.div>
  );
}
