import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
}

export default function FeatureCard({
  icon,
  title,
  description,
  features,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="mb-5 p-3 sm:p-4 bg-blue-50 rounded-full w-fit">
        {icon}
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4">{description}</p>

      <ul className="space-y-2 text-sm sm:text-base">
        {features.map((item, i) => (
          <li key={i} className="flex items-center text-gray-700">
            <Check className="h-4 w-4 text-blue-600 mr-2 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
