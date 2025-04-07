"use client";
import { MentorContext } from "@/src/context/mentorContext";
import { postRequest } from "@/src/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";

const Header = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mentorDet=useContext(MentorContext)

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Schedule", path: "/schedule" },
    { name: "Sessions", path: "/sessions" },
    { name: "Reviews", path: "/reviews" },
    { name: "Profile", path: "/mentor/profile" },
  ];

  const handleLogout = async () => {
    const res = await postRequest("/mentor/logout", {});
    if (res.ok) {
      router.push("/mentor/login")
    }
  };

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-indigo-400">Mentor Portal</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  router.pathname === item.path
                    ? "bg-indigo-900/50 text-indigo-300"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {mentorDet?.mentor?(<button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-white hover:bg-red-600 transition-colors"
            >
              Logout
            </button>):""}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    router.pathname === item.path
                      ? "bg-indigo-900/50 text-indigo-300"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {mentorDet?.mentor?(<button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-white hover:bg-red-600"
              >
                Logout
              </button>):""}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
