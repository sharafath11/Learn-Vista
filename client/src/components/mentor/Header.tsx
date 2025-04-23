"use client";
import { MentorContext } from "@/src/context/mentorContext";
import { MentorAPIMethods } from "@/src/services/APImethods";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useContext, useCallback, useState, memo } from "react";

interface NavItemType {
  name: string;
  path: string;
}

interface NavItemProps {
  item: NavItemType;
  currentPath: string;
  onClick?: () => void;
  mobile?: boolean;
}

const NavItem = memo(({ item, currentPath, onClick, mobile = false }: NavItemProps) => (
  <Link
    href={item.path}
    className={`${mobile ? 'block' : 'px-3 py-2'} rounded-md ${
      mobile ? 'text-base' : 'text-sm'
    } font-medium transition-colors ${
      currentPath === item.path
        ? "bg-indigo-900/50 text-indigo-300"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`}
    onClick={onClick}
  >
    {item.name}
  </Link>
));

NavItem.displayName = "NavItem";

interface LogoutButtonProps {
  mobile?: boolean;
  onClick: () => void;
}

const LogoutButton = memo(({ mobile = false, onClick }: LogoutButtonProps) => (
  <button
    onClick={onClick}
    className={`${mobile ? 'block w-full text-left px-3 py-2' : 'px-3 py-2'} rounded-md ${
      mobile ? 'text-base' : 'text-sm'
    } font-medium text-red-400 hover:text-white hover:bg-red-600 transition-colors`}
  >
    Logout
  </button>
));

LogoutButton.displayName = "LogoutButton";

interface MobileMenuButtonProps {
  mobileMenuOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenuButton = memo(({ mobileMenuOpen, toggleMenu }: MobileMenuButtonProps) => (
  <button
    onClick={toggleMenu}
    className="md:hidden text-gray-300 hover:text-white focus:outline-none"
    aria-label="Toggle menu"
  >
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {mobileMenuOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
));

MobileMenuButton.displayName = "MobileMenuButton";

const Header = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mentorDet = useContext(MentorContext);

  const navItems: NavItemType[] = [
    { name: "Dashboard", path: "/" },
    { name: "Schedule", path: "/schedule" },
    { name: "Sessions", path: "/sessions" },
    { name: "Reviews", path: "/reviews" },
    { name: "Profile", path: "/mentor/profile" },
  ];

  const handleLogout = useCallback(async () => {
    const res = await MentorAPIMethods.logout();
    if (res.ok) {
      router.push("/mentor/login");
    }
  }, [router]);

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-indigo-400">Mentor Portal</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navItems
              .filter(item => item.name !== "Profile")
              .map((item) => (
                <NavItem key={item.path} item={item} currentPath={currentPath ?? ""} />
              ))}

{mentorDet?.mentor && (
  <div className="relative group">
    <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-white transition-all focus:outline-none">
      <img
        src={mentorDet.mentor.profilePicture || "/default-avatar.png"}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </button>
    <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform scale-95 group-hover:scale-100 transition-all duration-150 ease-in-out">
      <Link
        href="/mentor/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Profile
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  </div>
)}

          </nav>

          {/* Mobile menu button */}
          <MobileMenuButton mobileMenuOpen={mobileMenuOpen} toggleMenu={toggleMenu} />
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2">
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.path}
                  item={item}
                  currentPath={currentPath ?? ""}
                  mobile
                  onClick={closeMenu}
                />
              ))}
              {mentorDet?.mentor && (
                <LogoutButton
                  mobile
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                />
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default memo(Header);
