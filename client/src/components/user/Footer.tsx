import Link from "next/link"
import { Linkedin, Instagram, Mail, Phone, MapPin, Github, X } from "lucide-react"
import { Home, BookOpen, Video, Heart } from "lucide-react" // Assuming these are for NAV_ITEMS

// User provided NAV_ITEMS
const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Courses", path: "/user/courses", icon: BookOpen },
  { name: "Live Classes", path: "/user/live-classes", icon: Video },
  { name: "Donation", path: "/user/donation", icon: Heart },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">EduLearn</h3>
            <p className="mb-4">
              Transforming lives through quality education and accessible learning opportunities for everyone.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.linkedin.com/in/sharafath-abi/"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com/sharafath11"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/__.st_____/?hl=en"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/home"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <X className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Links (replacing Categories) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">My Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.linkedin.com/in/sharafath-abi/" className="hover:text-white transition-colors">
                  LinkedIn Profile
                </Link>
              </li>
              <li>
                <Link href="https://github.com/sharafath11" className="hover:text-white transition-colors">
                  GitHub Profile
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/__.st_____/?hl=en" className="hover:text-white transition-colors">
                  Instagram Profile
                </Link>
              </li>
              <li>
                <Link href="https://x.com/home" className="hover:text-white transition-colors">
                  X (Twitter) Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-blue-400" />
                <span>calicut kinfraconst</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <span>+91 6282560928</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <span>abisharfathedulearn@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {new Date().getFullYear()} EduLearn. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
