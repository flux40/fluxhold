"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  ArrowRightIcon,
  ChartBarIcon,
  UsersIcon,
  ShieldCheckIcon,
} from "@/components/Icons";

export default function DataDrivenSection() {
  const [successCount, setSuccessCount] = useState(0);
  const [advisorsCount, setAdvisorsCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const animateCounter = (
      setCount: React.Dispatch<React.SetStateAction<number>>,
      target: number,
      duration: number = 2000
    ) => {
      const startTime = Date.now();
      const startValue = 0;

      const updateCounter = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(
          startValue + (target - startValue) * easeOut
        );

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    };

    animateCounter(setSuccessCount, 200);
    animateCounter(setAdvisorsCount, 27);
  }, [isVisible]);

  return (
    <div
      className="pb-20 md:pb-28 bg-gradient-to-b from-[#060B14] to-[#0B1C2D]"
      ref={sectionRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content Row */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 mb-20">
          {/* Left Column - Text Content */}
          <div className="lg:w-1/2">
            <div className="heading_block">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                We Value <span className="text-[#0EF2C2]">Data</span> for
                Informed Investing
              </h2>
              <p className="text-xl text-[#9BA3AF] mb-8">
                At FluxHold, we prioritize data for smarter investments. Our
                approach relies on thorough analysis of market trends, economic
                indicators, and company performance—all in a risk-free demo
                environment.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="funfact_block">
                <div className="funfact_value flex items-end mb-3">
                  <span className="text-5xl md:text-6xl font-bold text-white">
                    {successCount}
                  </span>
                  <span className="text-3xl md:text-4xl font-bold text-[#0EF2C2] ml-1">
                    K+
                  </span>
                </div>
                <h4 className="funfact_title text-xl font-semibold text-[#9BA3AF]">
                  Success Stories
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  Developers who built better apps
                </p>
              </div>

              <div className="funfact_block">
                <div className="funfact_value flex items-end mb-3">
                  <span className="text-5xl md:text-6xl font-bold text-white">
                    {advisorsCount}
                  </span>
                  <span className="text-3xl md:text-4xl font-bold text-[#0EF2C2] ml-1">
                    +
                  </span>
                </div>
                <h4 className="funfact_title text-xl font-semibold text-[#9BA3AF]">
                  Expert Advisors
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  Years of combined experience
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="btns_group">
              <a
                href="/dashboard"
                className="group inline-flex items-center space-x-3 bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-[#0B1C2D] font-bold py-4 px-8 rounded-lg hover:shadow-xl hover:shadow-[#4C6FFF]/30 transition-all duration-300"
              >
                <span>Explore Demo Dashboard</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column - Image/Visual */}
          <div className="lg:w-1/2 relative">
            <div className="relative">
              {/* MacBook Mockup */}
              <div className="mac_image relative z-10">
                <div className="relative bg-gray-900 rounded-[2rem] p-4 border-2 border-gray-800 shadow-2xl">
                  {/* MacBook Screen */}
                  <div className="bg-[#0B1C2D] rounded-2xl overflow-hidden border border-gray-800">
                    {/* Mock Dashboard Preview */}
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-sm text-[#9BA3AF]">
                          FluxHold Demo
                        </div>
                      </div>

                      {/* Mini Chart */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="text-white font-medium">
                            Portfolio Growth
                          </div>
                          <div className="text-[#0EF2C2] text-sm font-semibold">
                            +12.5%
                          </div>
                        </div>
                        <div className="h-32 bg-gradient-to-r from-[#0B1C2D] to-gray-900 rounded-lg p-4">
                          {/* Simple chart line */}
                          <div className="relative h-full">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full h-0.5 bg-gray-800"></div>
                            </div>
                            <div className="relative h-full">
                              {[0, 25, 50, 75, 100].map((x, i) => (
                                <div
                                  key={i}
                                  className="absolute bottom-0 w-2 h-8 bg-gradient-to-t from-[#4C6FFF] to-[#0EF2C2] rounded-t"
                                  style={{
                                    left: `${x}%`,
                                    height: `${30 + Math.sin(i) * 20}px`,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-900 rounded-lg p-3">
                            <div className="text-xs text-[#9BA3AF]">
                              Demo Balance
                            </div>
                            <div className="text-white font-bold">$25,000</div>
                          </div>
                          <div className="bg-gray-900 rounded-lg p-3">
                            <div className="text-xs text-[#9BA3AF]">
                              Today's Change
                            </div>
                            <div className="text-[#0EF2C2] font-bold">
                              +$423.50
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MacBook Bottom */}
                  <div className="mt-4 flex justify-center">
                    <div className="w-32 h-1 bg-gray-800 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Floating Chart Element */}
              <div className="chart_image absolute -top-10 -right-10 z-20">
                <div className="bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] p-4 rounded-2xl shadow-2xl rotate-12">
                  <div className="bg-[#0B1C2D] p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <ChartBarIcon className="w-6 h-6 text-[#0EF2C2]" />
                      <span className="text-white font-medium">Live Demo</span>
                    </div>
                    <div className="mt-3 text-2xl font-bold text-white">
                      24/7
                    </div>
                    <div className="text-xs text-[#9BA3AF]">
                      Market Simulation
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="mac_bottom_image absolute -bottom-10 -left-10 z-0">
                <div className="w-64 h-64 bg-gradient-to-br from-[#4C6FFF]/20 to-[#0EF2C2]/20 rounded-full blur-3xl"></div>
              </div>

              <div className="decoration_item absolute top-1/2 -left-16 z-0">
                <div className="w-32 h-32 bg-gradient-to-br from-[#4C6FFF]/10 to-transparent rounded-full border border-[#4C6FFF]/20"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="section_space mt-20">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="features_block bg-[#0B1C2D] border-2 border-gray-800 rounded-2xl p-8 hover:border-[#4C6FFF]/30 transition-all duration-300 hover:scale-[1.02] group">
              <div className="features_icon mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4C6FFF] to-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="features_content">
                <h3 className="features_title text-2xl font-bold mb-4">
                  Funding & Investment Simulation
                </h3>
                <p className="text-[#9BA3AF] mb-0">
                  At FluxHold we excel at demo funding & investing simulations,
                  guiding strategic learning without real financial risk.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="features_block bg-[#0B1C2D] border-2 border-gray-800 rounded-2xl p-8 hover:border-[#0EF2C2]/30 transition-all duration-300 hover:scale-[1.02] group">
              <div className="features_icon mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0EF2C2] to-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div className="features_content">
                <h3 className="features_title text-2xl font-bold mb-4">
                  Capital Transparency
                </h3>
                <p className="text-[#9BA3AF] mb-0">
                  We prioritize demo capital transparency. Our commitment
                  ensures clarity in simulated investment scenarios.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="features_block bg-[#0B1C2D] border-2 border-gray-800 rounded-2xl p-8 hover:border-[#4C6FFF]/30 transition-all duration-300 hover:scale-[1.02] group">
              <div className="features_icon mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-[#4C6FFF] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChartBarIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="features_content">
                <h3 className="features_title text-2xl font-bold mb-4">
                  Secure Investment Simulation
                </h3>
                <p className="text-[#9BA3AF] mb-0">
                  Our Secure Investment Simulation at FluxHold ensures
                  educational stability and learning growth in a risk-free
                  environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
