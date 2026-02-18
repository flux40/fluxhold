"use client";

import { useState, Fragment, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  BellIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  LifebuoyIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

interface UserProfile {
  full_name: string | null;
  email: string;
  avatar_url?: string | null;
  role?: string;
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New investment opportunity available",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Your deposit has been confirmed",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 3,
      title: "Weekly performance report ready",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 4,
      title: "Market alert: Tech sector rally",
      time: "4 hours ago",
      read: false,
    },
  ]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // User navigation items
  const userNavigation = [
    { name: "Your Profile", href: "/dashboard/profile", icon: UserIcon },
    { name: "Account Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCardIcon },
    { name: "Help Center", href: "/help", icon: LifebuoyIcon },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Detect scroll and screen size
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("full_name, role, avatar_url")
          .eq("id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile:", error);
        }

        setUserProfile({
          full_name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Investor',
          email: user.email || '',
          avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
          role: profile?.role || 'Standard Account',
        });
      } catch (error) {
        console.error("Error in profile fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close search on mobile when clicking outside
  useEffect(() => {
    if (searchOpen && isMobile) {
      const handleClickOutside = () => setSearchOpen(false);
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [searchOpen, isMobile]);

  const refreshPage = () => {
    window.location.reload();
  };

  const viewOptions = [
    { name: "Compact View", icon: ViewColumnsIcon },
    { name: "Detailed View", icon: AdjustmentsHorizontalIcon },
    { name: "Refresh Data", icon: ArrowPathIcon, action: refreshPage },
  ];

  const getDisplayName = () => {
    if (isLoading) return 'Loading...';
    if (!userProfile) return 'Investor';
    return userProfile.full_name || userProfile.email.split('@')[0] || 'Investor';
  };

  const getUserInitials = () => {
    const name = getDisplayName();
    if (name === 'Loading...' || name === 'Investor') return 'F';
    return name.charAt(0).toUpperCase();
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div
      className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b ${
        isScrolled
          ? "border-[#4C6FFF]/30 bg-[#0B1C2D]/95 backdrop-blur-lg"
          : "border-gray-800 bg-[#0B1C2D]/80 backdrop-blur-sm"
      } px-4 transition-all duration-200 sm:gap-x-6 sm:px-6 lg:ps-12`}
    >
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-400 hover:text-[#0EF2C2] lg:hidden transition-colors"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-gray-800 lg:hidden" />

      {/* Title Area - Responsive */}
      <div className="flex flex-1 items-center min-w-0">
        {/* Title - Hidden when search is open on mobile */}
        {(!searchOpen || !isMobile) && (
          <div className="flex items-center min-w-0 mr-4">
            <h1 className="text-lg sm:text-xl font-bold ps-0 md:ps-10 text-white truncate">
              {title}
            </h1>
          </div>
        )}

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex ml-auto mr-4 flex-1 max-w-md">
          <div className="relative w-full group">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#0EF2C2] transition-colors" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border-0 bg-gray-800/50 py-2 pl-10 pr-10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0EF2C2] sm:text-sm transition-all"
              placeholder="Search investments, reports..."
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-[#0EF2C2] transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="lg:hidden ml-auto p-2 text-gray-400 hover:text-[#0EF2C2] transition-colors"
          aria-label="Open search"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && isMobile && (
        <div className="fixed inset-0 z-50 bg-[#0A0F1E]/95 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="flex items-center h-16 px-4 border-b border-gray-800">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-xl border-0 bg-gray-800 py-3 pl-10 pr-12 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0EF2C2] text-base"
                placeholder="Search investments, reports..."
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-[#0EF2C2] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-x-3 lg:gap-x-4">
        {/* Help/Support Button */}
        <button
          className="hidden sm:flex p-2 text-gray-400 hover:text-[#0EF2C2] rounded-lg hover:bg-[#4C6FFF]/10 transition-colors"
          title="Help & Support"
        >
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </button>

        {/* View Options Dropdown */}
        <Menu as="div" className="relative hidden sm:block">
          <Menu.Button className="p-2 text-gray-400 hover:text-[#0EF2C2] rounded-lg hover:bg-[#4C6FFF]/10 transition-colors">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-xl bg-[#0B1C2D] border border-[#4C6FFF]/30 py-1 shadow-lg">
              {viewOptions.map((option) => (
                <Menu.Item key={option.name}>
                  {({ active }) => (
                    <button
                      onClick={option.action}
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        active ? "bg-[#4C6FFF]/10 text-[#0EF2C2]" : "text-white"
                      } transition-colors`}
                    >
                      <option.icon className={`h-4 w-4 mr-3 ${
                        active ? "text-[#0EF2C2]" : "text-gray-400"
                      }`} />
                      {option.name}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Notifications - Responsive */}
        <Menu as="div" className="relative">
          <Menu.Button className="p-2 text-gray-400 hover:text-[#0EF2C2] rounded-lg hover:bg-[#4C6FFF]/10 transition-colors relative">
            <BellIcon className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-[10px] text-white font-medium">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2.5 w-80 sm:w-96 origin-top-right rounded-xl bg-[#0B1C2D] border border-[#4C6FFF]/30 py-2 shadow-lg">
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Notifications
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {unreadNotifications} unread
                  </p>
                </div>
                {unreadNotifications > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#0EF2C2] hover:text-white transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                      {({ active }) => (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className={`w-full text-left flex items-start px-4 py-3 border-b border-gray-800/50 last:border-0 ${
                            active ? "bg-[#4C6FFF]/10" : ""
                          } ${!notification.read ? "bg-[#0EF2C2]/5" : ""} transition-colors`}
                        >
                          <div className="flex-shrink-0">
                            <div
                              className={`h-2 w-2 rounded-full mt-2 ${
                                notification.read ? "bg-gray-600" : "bg-[#0EF2C2] animate-pulse"
                              }`}
                            />
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <BellIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No notifications</p>
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-800">
                <a
                  href="/dashboard/notifications"
                  className="text-sm text-[#0EF2C2] hover:text-white block text-center py-2 transition-colors"
                >
                  View all notifications
                </a>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Separator */}
        <div className="hidden lg:block h-6 w-px bg-gradient-to-b from-transparent via-[#4C6FFF]/50 to-transparent" />

        {/* User Menu - Responsive */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-2 p-1 hover:bg-[#4C6FFF]/10 rounded-lg transition-colors group">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm font-medium text-white truncate max-w-[120px] group-hover:text-[#0EF2C2] transition-colors">
                {isLoading ? 'Loading...' : getDisplayName()}
              </p>
              <p className="text-xs text-gray-400 truncate max-w-[120px]">
                {userProfile?.role || 'Standard Account'}
              </p>
            </div>
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-[#0EF2C2] flex items-center justify-center bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-600 w-full h-full" />
                ) : userProfile?.avatar_url ? (
                  <Image
                    src={userProfile.avatar_url}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  getUserInitials()
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-[#0EF2C2] rounded-full border-2 border-[#0B1C2D] animate-pulse"></div>
            </div>
            <ChevronDownIcon className="hidden sm:block h-4 w-4 text-gray-400 group-hover:text-[#0EF2C2] transition-colors" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2.5 w-48 sm:w-64 origin-top-right rounded-xl bg-[#0B1C2D] border border-[#4C6FFF]/30 py-1 shadow-lg">
              <div className="px-4 py-3 border-b border-gray-800">
                <p className="text-sm font-medium text-white">
                  {isLoading ? 'Loading...' : getDisplayName()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {userProfile?.email || 'user@fluxhold.com'}
                </p>
                <p className="text-xs text-[#0EF2C2] mt-1">
                  {userProfile?.role || 'Standard Account'}
                </p>
              </div>
              
              {/* User Navigation Items */}
              {userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <a
                      href={item.href}
                      className={`flex items-center px-4 py-2 text-sm ${
                        active ? "bg-[#4C6FFF]/10 text-[#0EF2C2]" : "text-white"
                      } transition-colors`}
                    >
                      <item.icon className={`h-4 w-4 mr-3 ${
                        active ? "text-[#0EF2C2]" : "text-gray-400"
                      }`} />
                      {item.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
              
              <div className="border-t border-gray-800 my-1" />
              
              {/* Logout Button */}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                      active ? "bg-red-500/10 text-red-500" : "text-red-400"
                    } transition-colors`}
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}