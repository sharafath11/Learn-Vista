import { Calendar, Award } from "lucide-react";

const bioDetails = [
  {
    icon: Calendar,
    text: "Member since January 2023",
  },
  {
    icon: Award,
    text: "Intermediate level",
  },
];

export default function BioCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">About Me</h3>
      <p className="text-sm text-gray-600">
        Passionate about learning new technologies and building web applications. Currently focused on mastering React and Next.js.
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        {bioDetails.map(({ icon: Icon, text }, index) => (
          <div key={index} className="flex items-center text-sm text-gray-500">
            <Icon className="h-4 w-4 mr-2" />
            <span>{text} </span>
          </div>
        ))}
      </div>
    </div>
  );
}
