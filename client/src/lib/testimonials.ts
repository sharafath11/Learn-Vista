import { Award } from "lucide-react";
import { Calendar } from "../components/shared/components/ui/calendar";

export const testimonials = [
  {
    name: "Alex Thompson",
    role: "Senior Full-Stack Developer",
    company: "Microsoft",
    content:
      "This platform completely transformed my career trajectory. The quality of instruction and hands-on projects gave me the confidence to land my dream job at a Fortune 500 company.",
    avatar: "AT",
    rating: 5,
  },
  {
    name: "Jessica Chen",
    role: "Data Science Manager",
    company: "Google",
    content:
      "The comprehensive curriculum and expert mentorship helped me transition from marketing to data science. The practical skills I gained were immediately applicable in my new role.",
    avatar: "JC",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "UX Design Lead",
    company: "Airbnb",
    content:
      "Outstanding platform with world-class instructors. The collaborative learning environment and networking opportunities opened doors I never thought possible.",
    avatar: "MJ",
    rating: 5,
  },
];

export const bioDetails = [
  {
    icon: Calendar,
    text: "Member since January 2023",
    tooltip: "Your account creation date",
  },
  {
    icon: Award,
    text: "Intermediate level",
    tooltip: "Based on your course progress & activity",
  },
]
