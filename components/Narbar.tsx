"use client";

import React, { useState, useEffect } from "react"; // Add React import
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const services = [
    {
      name: "Portfolio Analytics",
      href: "/#analytics",
      icon: <ChartBarIcon className="w-4 h-4" />,
    },
    {
      name: "Risk Assessment",
      href: "/#risk",
      icon: <ShieldCheckIcon className="w-4 h-4" />,
    },
    {
      name: "AI Predictions",
      href: "/ai-investors#ai",
      icon: <SparklesIcon className="w-4 h-4" />,
    },
    {
      name: "Community Insights",
      href: "/#community",
      icon: <UserGroupIcon className="w-4 h-4" />,
    },
  ];

  const navItems = [
    { name: "Home", href: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      name: "AI for Investors",
      href: "/ai-investors",
      icon: <SparklesIcon className="w-4 h-4" />,
    },
    {
      name: "About Us",
      href: "/about-us",
      icon: <BuildingOfficeIcon className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B1C2D]/95 backdrop-blur-md border-b border-gray-800/50"
            : "bg-[#0B1C2D]/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] bg-clip-text text-transparent">
                    FluxHold
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Home Link - Highlighted if active */}
              <Link
                href="/"
                className={`flex items-center space-x-1 transition-colors font-medium py-2 ${
                  pathname === "/"
                    ? "text-white border-b-2 border-[#0EF2C2]"
                    : "text-[#9BA3AF] hover:text-white"
                }`}
              >
                <span>Home</span>
              </Link>

              {/* Services Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-[#9BA3AF] hover:text-white transition-colors font-medium py-2">
                  <span>Services</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-64 bg-[#0B1C2D] border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4">
                    <div className="text-xs uppercase text-[#9BA3AF] tracking-wider mb-3">
                      AI-Powered Features
                    </div>
                    {services.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4C6FFF]/20 to-[#0EF2C2]/10 flex items-center justify-center">
                          {service.icon}
                        </div>
                        <div>
                          <div className="font-medium text-white group-hover/item:text-[#0EF2C2] transition-colors">
                            {service.name}
                          </div>
                          <div className="text-xs text-[#9BA3AF] mt-1">
                            AI Demo Feature
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors font-medium ${
                    pathname === item.href
                      ? "text-white border-b-2 border-[#0EF2C2]"
                      : "text-[#9BA3AF] hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth Links */}
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  href="/login"
                  className="text-[#9BA3AF] hover:text-white transition-colors font-medium flex items-center space-x-2 group"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-[#0B1C2D] font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 group"
                >
                  <span>Get Started</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              {isOpen ? (
                <XMarkIcon className="w-8 h-8" />
              ) : (
                <Bars3Icon className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
        fixed inset-0 z-40 lg:hidden transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#0B1C2D] border-l border-gray-800 overflow-y-auto">
          <div className="p-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] bg-clip-text text-transparent">
                    FluxHold
                  </span>
                  <p className="text-xs text-[#9BA3AF]">AI Investment Demo</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              {/* Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-[#4C6FFF]/20 to-[#0EF2C2]/10 border border-[#0EF2C2]/30"
                      : "bg-gray-900/50 hover:bg-gray-800/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      pathname === item.href
                        ? "bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2]"
                        : "bg-gradient-to-br from-[#4C6FFF]/20 to-[#0EF2C2]/10"
                    }`}
                  >
                    {React.cloneElement(item.icon, {
                      className: `w-5 h-5 ${
                        pathname === item.href ? "text-white" : "text-[#0EF2C2]"
                      }`,
                    })}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        pathname === item.href ? "text-white" : "text-white"
                      }`}
                    >
                      {item.name}
                    </div>
                    {item.name === "Home" && (
                      <div className="text-sm text-[#9BA3AF]">Landing page</div>
                    )}
                    {item.name === "AI for Investors" && (
                      <div className="text-sm text-[#9BA3AF]">
                        Smart portfolio insights
                      </div>
                    )}
                    {item.name === "About Us" && (
                      <div className="text-sm text-[#9BA3AF]">
                        Our story & mission
                      </div>
                    )}
                  </div>
                  {pathname === item.href && (
                    <div className="w-2 h-2 rounded-full bg-[#0EF2C2] animate-pulse"></div>
                  )}
                </Link>
              ))}

              {/* Services Section */}
              <div className="pt-4">
                <div className="text-xs uppercase text-[#9BA3AF] tracking-wider mb-4 px-4">
                  AI Services
                </div>
                <div className="space-y-2">
                  {services.map((service) => (
                    <Link
                      key={service.name}
                      href={service.href}
                      className="flex items-center space-x-3 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4C6FFF]/20 to-[#0EF2C2]/10 flex items-center justify-center">
                        {service.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {service.name}
                        </div>
                        <div className="text-sm text-[#9BA3AF]">
                          AI Demo Feature
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="pt-6 border-t border-gray-800 space-y-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center space-x-3 w-full py-3 border border-gray-700 text-white rounded-lg hover:border-gray-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center py-3 bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-[#0B1C2D] font-bold rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => setIsOpen(false)}
                >
                  Start Free Demo
                </Link>
              </div>

              {/* Demo Notice */}
              <div className="pt-4 border-t border-gray-800">
                <div className="p-4 bg-red-900/20 border border-red-800/30 rounded-lg">
                  <div className="text-xs text-red-300">
                    <strong>Demo Platform:</strong> No real investments.
                    Practice only.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding to account for fixed navbar */}
      <div className="h-20"></div>
    </>
  );
}
