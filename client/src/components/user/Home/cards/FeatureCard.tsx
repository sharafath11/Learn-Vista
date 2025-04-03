import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
}

export default function FeatureCard({ icon, title, description, features }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="mb-6 p-4 bg-blue-50 rounded-full w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((item, i) => (
          <li key={i} className="flex items-center text-gray-600">
            <Check className="h-4 w-4 text-blue-600 mr-2" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
