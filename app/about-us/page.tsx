"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Narbar";
import Footer from "@/components/Footer";
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  LightBulbIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

export default function AboutUsPage() {
  const [activeTab, setActiveTab] = useState("mission");

  const teamMembers = [
    {
      id: 1,
      name: "Alex Morgan",
      role: "CEO & Founder",
      bio: "Former fintech executive with 15+ years in investment technology",
      color: "from-[#4C6FFF] to-blue-400",
    },
    {
      id: 2,
      name: "Dr. Sarah Chen",
      role: "Chief Data Scientist",
      bio: "PhD in Computational Finance, specializes in AI-driven market analysis",
      color: "from-[#0EF2C2] to-emerald-400",
    },
    {
      id: 3,
      name: "Marcus Rodriguez",
      role: "Head of Product",
      bio: "Product leader from Silicon Valley with focus on user experience",
      color: "from-purple-500 to-pink-400",
    },
    {
      id: 4,
      name: "Jessica Kim",
      role: "Lead Developer",
      bio: "Full-stack developer passionate about financial education technology",
      color: "from-amber-500 to-orange-400",
    },
  ];

  const milestones = [
    {
      year: "2022",
      title: "Founded",
      description:
        "FluxHold established with mission to democratize investment education",
    },
    {
      year: "2023",
      title: "Platform Launch",
      description:
        "Beta version released with basic portfolio simulation features",
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Advanced AI analytics added to demo platform",
    },
    {
      year: "2025",
      title: "100K+ Users",
      description: "Reached milestone of 100,000 demo platform users",
    },
  ];

  const values = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Integrity First",
      description:
        "We prioritize transparent, ethical simulation practices in all our demo features.",
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: "Educational Focus",
      description:
        "Our primary goal is investor education, not financial advice or real investment.",
    },
    {
      icon: <LightBulbIcon className="w-8 h-8" />,
      title: "Innovation",
      description:
        "Continuously improving our simulation technology for better learning experiences.",
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Community",
      description:
        "Building a supportive environment for investors to learn and grow together.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060B14] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4C6FFF]/5 via-transparent to-[#0EF2C2]/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-[#0B1C2D] border border-gray-800 rounded-full px-4 py-2 mb-8">
              <BuildingOfficeIcon className="w-4 h-4 text-[#0EF2C2]" />
              <span className="text-sm text-[#0EF2C2]">About FluxHold</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Democratizing</span>
              <span className="block bg-gradient-to-r from-[#4C6FFF] via-[#0EF2C2] to-white bg-clip-text text-transparent">
                Investment Education
              </span>
            </h1>
            <p className="text-xl text-[#9BA3AF] mb-10">
              FluxHold is a demo platform designed to provide accessible,
              risk-free investment education through advanced simulation
              technology and AI-powered analytics.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">100K+</div>
                <div className="text-[#9BA3AF]">Demo Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">$0</div>
                <div className="text-[#9BA3AF]">Real Money Risk</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-[#9BA3AF]">Learning Platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Tabs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Tabs Navigation */}
            <div className="space-y-8">
              <div className="flex space-x-1 bg-[#0B1C2D] rounded-xl p-1 border border-gray-800">
                {["mission", "vision", "story"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-[#0B1C2D]"
                        : "text-[#9BA3AF] hover:text-white"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-[#0B1C2D] border border-gray-800 rounded-2xl p-8">
                {activeTab === "mission" && (
                  <div className="space-y-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4C6FFF] to-blue-400 flex items-center justify-center mb-6">
                      <TrophyIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Mission</h3>
                    <p className="text-[#9BA3AF] text-lg">
                      To provide a comprehensive, risk-free environment where
                      anyone can learn investment strategies, understand market
                      dynamics, and develop financial literacy through advanced
                      simulation technology.
                    </p>
                    <div className="pt-6 border-t border-gray-800">
                      <h4 className="font-bold text-white mb-3">
                        Core Focus Areas:
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Simulated portfolio management",
                          "AI-powered market analysis",
                          "Risk-free strategy testing",
                          "Financial education resources",
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-center space-x-3">
                            <CheckCircleIcon className="w-5 h-5 text-[#0EF2C2]" />
                            <span className="text-[#9BA3AF]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "vision" && (
                  <div className="space-y-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0EF2C2] to-emerald-400 flex items-center justify-center mb-6">
                      <SparklesIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                    <p className="text-[#9BA3AF] text-lg">
                      We envision a world where financial literacy is accessible
                      to all, where individuals can make informed investment
                      decisions through practical, hands-on experience without
                      financial risk.
                    </p>
                    <div className="pt-6 border-t border-gray-800">
                      <h4 className="font-bold text-white mb-3">
                        Future Goals:
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Expand to 1 million demo users",
                          "Add more asset classes for simulation",
                          "Develop mobile learning experience",
                          "Partner with educational institutions",
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-center space-x-3">
                            <CheckCircleIcon className="w-5 h-5 text-[#0EF2C2]" />
                            <span className="text-[#9BA3AF]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "story" && (
                  <div className="space-y-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mb-6">
                      <ClockIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Story</h3>
                    <p className="text-[#9BA3AF] text-lg">
                      Founded in 2022 by former fintech professionals, FluxHold
                      emerged from a simple observation: investment education
                      was either too theoretical or required real money risk. We
                      built a bridge between theory and practice.
                    </p>
                    <div className="pt-6 border-t border-gray-800">
                      <h4 className="font-bold text-white mb-3">
                        Key Milestones:
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "2022: Platform concept developed",
                          "2023: First demo version launched",
                          "2024: AI analytics integration",
                          "2025: Community features added",
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-center space-x-3">
                            <CheckCircleIcon className="w-5 h-5 text-[#0EF2C2]" />
                            <span className="text-[#9BA3AF]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Values Section */}
            <div>
              <h2 className="text-3xl font-bold mb-10">Our Values</h2>
              <div className="space-y-6">
                {values.map((value, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0B1C2D] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#4C6FFF]/20 to-[#0EF2C2]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {value.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          {value.title}
                        </h3>
                        <p className="text-[#9BA3AF]">{value.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-b from-[#0B1C2D] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-[#9BA3AF] max-w-3xl mx-auto">
              From concept to leading demo platform for investment education
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#4C6FFF] via-[#0EF2C2] to-transparent"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-center ${
                    idx % 2 === 0 ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`w-1/2 ${
                      idx % 2 === 0 ? "pr-12 text-right" : "pl-12"
                    }`}
                  >
                    <div className="bg-[#0B1C2D] border border-gray-800 rounded-xl p-6 hover:border-[#0EF2C2]/30 transition-colors">
                      <div className="text-2xl font-bold text-[#0EF2C2] mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-[#9BA3AF]">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] border-4 border-[#060B14]"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-[#9BA3AF] max-w-3xl mx-auto">
              Passionate professionals dedicated to investment education and
              technology innovation
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#0B1C2D] border border-gray-800 rounded-2xl p-6 text-center hover:border-[#0EF2C2]/30 transition-all duration-300 hover:scale-[1.02] group"
              >
                <div
                  className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <div className="text-2xl font-bold text-[#0B1C2D]">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <div className="text-[#0EF2C2] font-medium mb-3">
                  {member.role}
                </div>
                <p className="text-sm text-[#9BA3AF] mb-6">{member.bio}</p>
                <div className="flex justify-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.279 16.736 5.02 15.705 5 12c.02-3.705.279-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.979 8.295 19 12c-.021 3.705-.281 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      {/* ... Previous sections remain the same ... */}

      {/* Press Coverage */}
      <section className="py-20 bg-gradient-to-b from-[#0B1C2D]/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured In</h2>
            <p className="text-xl text-[#9BA3AF] max-w-3xl mx-auto">
              Recognized by leading financial and technology publications
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: "TechCrunch", color: "text-green-500", icon: "TC" },
              { name: "Forbes", color: "text-blue-400", icon: "F" },
              { name: "Bloomberg", color: "text-purple-400", icon: "B" },
              { name: "Business Insider", color: "text-pink-400", icon: "BI" },
              { name: "CNBC", color: "text-red-400", icon: "CNBC" },
              { name: "FinTech Weekly", color: "text-cyan-400", icon: "FTW" },
            ].map((press, idx) => (
              <div
                key={idx}
                className="bg-[#0B1C2D] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center hover:border-[#0EF2C2]/30 transition-all duration-300 group"
              >
                <div
                  className={`text-2xl font-bold mb-3 group-hover:scale-110 transition-transform ${press.color}`}
                >
                  {press.icon}
                </div>
                <div className="text-center">
                  <div className="font-medium text-white">{press.name}</div>
                  <div className="text-xs text-[#9BA3AF] mt-1">
                    Media Coverage
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Press Quotes Carousel */}
          <div className="mt-12">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "FluxHold represents a significant step forward in financial education technology.",
                  author: "Tech Innovation Review",
                  date: "March 2024",
                },
                {
                  quote:
                    "Their demo platform makes complex investment concepts accessible to everyone.",
                  author: "Digital Finance Today",
                  date: "February 2024",
                },
                {
                  quote:
                    "A pioneer in risk-free investment simulation with impressive AI integration.",
                  author: "FinTech Insights",
                  date: "January 2024",
                },
              ].map((article, idx) => (
                <div
                  key={idx}
                  className="bg-[#0B1C2D] border border-gray-800 rounded-xl p-6 hover:border-[#4C6FFF]/30 transition-colors"
                >
                  <div className="text-[#0EF2C2] text-sm font-medium mb-2">
                    {article.author}
                  </div>
                  <p className="text-gray-300 italic mb-4">"{article.quote}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="text-xs text-[#9BA3AF]">{article.date}</div>
                    <button className="text-xs text-[#4C6FFF] hover:text-[#0EF2C2] transition-colors">
                      Read Article →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Investor Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Investors Say</h2>
            <p className="text-xl text-[#9BA3AF] max-w-3xl mx-auto">
              Hear from demo users who have improved their investment knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Michael Chen",
                role: "Aspiring Investor",
                avatar: "MC",
                quote:
                  "The portfolio simulation helped me understand risk management before investing real money.",
                stats: "45% more confident",
                color: "from-[#4C6FFF] to-blue-400",
              },
              {
                name: "Sarah Johnson",
                role: "MBA Student",
                avatar: "SJ",
                quote:
                  "Perfect for practicing investment strategies learned in class. The AI analytics are incredible.",
                stats: "6 months of practice",
                color: "from-[#0EF2C2] to-emerald-400",
              },
              {
                name: "David Park",
                role: "Retiree",
                avatar: "DP",
                quote:
                  "Finally a platform where I can learn at my own pace without pressure or risk.",
                stats: "Safe learning environment",
                color: "from-purple-500 to-pink-400",
              },
              {
                name: "Lisa Rodriguez",
                role: "Small Business Owner",
                avatar: "LR",
                quote:
                  "The demo helped me understand how to diversify my business profits into investments.",
                stats: "Portfolio diversified",
                color: "from-amber-500 to-orange-400",
              },
              {
                name: "James Wilson",
                role: "Software Engineer",
                avatar: "JW",
                quote:
                  "As a tech professional, I appreciate the sophisticated yet accessible AI tools.",
                stats: "AI tools mastered",
                color: "from-rose-500 to-pink-400",
              },
              {
                name: "Emma Thompson",
                role: "Financial Blogger",
                avatar: "ET",
                quote:
                  "I recommend FluxHold to all my readers who want to learn investing safely first.",
                stats: "100+ readers referred",
                color: "from-violet-500 to-purple-400",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-[#0B1C2D] border border-gray-800 rounded-2xl p-6 hover:border-[#0EF2C2]/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-[#0B1C2D] font-bold`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-[#9BA3AF]">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs px-3 py-1 rounded-full bg-[#0EF2C2]/10 text-[#0EF2C2]">
                    {testimonial.stats}
                  </div>
                </div>
                <p className="text-gray-300 italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Logos */}
      <section className="py-20 bg-gradient-to-b from-[#0B1C2D]/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Partnerships & Collaborations
            </h2>
            <p className="text-xl text-[#9BA3AF] max-w-3xl mx-auto">
              Working with educational institutions and technology partners
            </p>
          </div>

          {/* University Partnerships */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-[#0B1C2D] border border-gray-800 rounded-full px-4 py-2 mb-4">
                <AcademicCapIcon className="w-4 h-4 text-[#0EF2C2]" />
                <span className="text-sm text-[#0EF2C2]">
                  Academic Partners
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                University Collaborations
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  name: "Stanford University",
                  program: "Finance Lab",
                  color: "text-red-400",
                },
                {
                  name: "MIT",
                  program: "FinTech Research",
                  color: "text-gray-300",
                },
                {
                  name: "Harvard Business",
                  program: "Case Studies",
                  color: "text-crimson-400",
                },
                {
                  name: "London School",
                  program: "Economics Dept",
                  color: "text-blue-400",
                },
              ].map((uni, idx) => (
                <div
                  key={idx}
                  className="bg-[#0B1C2D] border border-gray-800 rounded-xl p-6 hover:border-[#4C6FFF]/30 transition-colors group"
                >
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-3 ${uni.color}`}>
                      {uni.name.split(" ")[0][0]}
                    </div>
                    <div className="font-medium text-white mb-2">
                      {uni.name}
                    </div>
                    <div className="text-sm text-[#9BA3AF]">{uni.program}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Partners */}
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-[#0B1C2D] border border-gray-800 rounded-full px-4 py-2 mb-4">
                <CpuChipIcon className="w-4 h-4 text-[#4C6FFF]" />
                <span className="text-sm text-[#4C6FFF]">
                  Technology Partners
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Platform Integrations</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                {
                  name: "AWS",
                  type: "Cloud Infrastructure",
                  color: "text-orange-400",
                },
                {
                  name: "Google Cloud",
                  type: "AI/ML Services",
                  color: "text-blue-400",
                },
                {
                  name: "TradingView",
                  type: "Market Data",
                  color: "text-green-400",
                },
                {
                  name: "OpenAI",
                  type: "AI Models",
                  color: "text-emerald-400",
                },
                { name: "Supabase", type: "Database", color: "text-green-300" },
              ].map((partner, idx) => (
                <div
                  key={idx}
                  className="bg-[#0B1C2D] border border-gray-800 rounded-xl p-6 hover:border-[#0EF2C2]/30 transition-colors flex flex-col items-center justify-center"
                >
                  <div className={`text-xl font-bold mb-3 ${partner.color}`}>
                    {partner.name}
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[#9BA3AF]">{partner.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partnership Benefits */}
          <div className="mt-12 pt-12 border-t border-gray-800">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Educational Reach",
                  description:
                    "Partnering with universities to bring investment education to students worldwide",
                  icon: "🎓",
                },
                {
                  title: "Technology Innovation",
                  description:
                    "Collaborating with tech leaders to advance financial simulation technology",
                  icon: "⚡",
                },
                {
                  title: "Industry Standards",
                  description:
                    "Contributing to best practices in financial education technology",
                  icon: "🏆",
                },
              ].map((benefit, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h4 className="text-xl font-bold mb-3">{benefit.title}</h4>
                  <p className="text-[#9BA3AF]">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Updated Why Choose Us Section (now after testimonials) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose FluxHold?</h2>
            <p className="text-xl text-[#9BA3AF] max-w-3xl mx-auto">
              What sets our demo platform apart in investment education
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ChartBarIcon className="w-8 h-8" />,
                title: "Advanced Simulation",
                description:
                  "Realistic market simulation with AI-powered analytics and historical data",
                features: [
                  "Portfolio simulation",
                  "Risk analysis",
                  "Performance tracking",
                ],
              },
              {
                icon: <AcademicCapIcon className="w-8 h-8" />,
                title: "Educational Focus",
                description:
                  "Comprehensive learning resources and guided investment strategy tutorials",
                features: [
                  "Step-by-step guides",
                  "Investment concepts",
                  "Strategy testing",
                ],
              },
              {
                icon: <CurrencyDollarIcon className="w-8 h-8" />,
                title: "Risk-Free Environment",
                description:
                  "Learn and practice investment strategies without financial risk",
                features: [
                  "No real money",
                  "Safe experimentation",
                  "Confidence building",
                ],
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0B1C2D] border border-gray-800 rounded-2xl p-8 hover:border-[#0EF2C2]/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4C6FFF] to-blue-400 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-[#9BA3AF] mb-6">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-[#0EF2C2]" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ... Rest of the page remains the same ... */}

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0B1C2D] to-gray-900 border border-gray-800 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4C6FFF]/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0EF2C2]/10 rounded-full translate-y-32 -translate-x-32"></div>

            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] flex items-center justify-center">
                <UserGroupIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Join Our Learning Community
              </h2>
              <p className="text-xl text-[#9BA3AF] mb-10 max-w-2xl mx-auto">
                Start your investment education journey today with our risk-free
                demo platform. Learn, practice, and grow with 100,000+ other
                demo users.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-[#0B1C2D] font-bold py-4 px-10 rounded-lg hover:shadow-2xl hover:shadow-[#4C6FFF]/30 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Start Free Demo</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/ai-investors"
                  className="border border-gray-700 bg-[#0B1C2D]/50 text-white font-semibold py-4 px-10 rounded-lg hover:border-gray-600 transition-colors"
                >
                  Explore AI Features
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

     <Footer />
    </div>
  );
}
