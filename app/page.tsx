import Link from "next/link";
import Image from "next/image";
import TradingViewTicker from "@/components/TradingViewTicker";
import DataDrivenSection from "@/components/DataDrivenSection";
import ClientLogoCarousel from "@/components/ClientLogoCarousel";
import Navbar from "@/components/Narbar";
import Footer from "@/components/Footer";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  TrendingUpIcon,
  UserGroupIcon,
  LockClosedIcon,
  ArrowUpIcon,
  SparklesIcon,
  AcademicCapIcon,
  ServerIcon,
} from "@/components/Icons";
import ExactTradingViewWidgets from "@/components/ExactTradingViewWidgets";
import FAQSection from "@/components/FAQSection";
import TeamSection from "@/components/TeamSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SafetyFeatures from "@/components/SafetyFeatures";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#060B14] text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#060B14] to-[#0B1C2D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Column - Text Content */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center space-x-2 bg-[#0B1C2D] border border-gray-800 rounded-full px-4 py-2 mb-8">
                <SparklesIcon className="w-4 h-4 text-[#0EF2C2]" />
                <span className="text-sm text-[#0EF2C2]">
                  Best Investment Platform
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-[#4C6FFF] via-white to-[#0EF2C2] bg-clip-text text-transparent">
                  Invest Smarter.
                </span>
                <span className="block text-white">Move Faster.</span>
              </h1>
              <p className="text-xl text-[#9BA3AF] max-w-2xl mb-10">
                Diversified Investing | Leading Yields | Millions Trust Us
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="group bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-[#0B1C2D] font-semibold py-4 px-8 rounded-lg hover:shadow-lg hover:shadow-[#4C6FFF]/25 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Start Free </span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="border border-gray-700 bg-[#0B1C2D]/50 text-white font-semibold py-4 px-8 rounded-lg hover:border-gray-600 transition-colors"
                >
                  Access Dashboard
                </Link>
              </div>
            </div>

            {/* Right Column - Dashboard Image */}
            <div className="lg:w-1/2">
              <div className="relative overflow-hidden">
                <Image
                  src="/assets/images/clients/hero_image.png"
                  alt="FluxHold Investment Dashboard Preview"
                  width={800}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <TradingViewTicker />

      {/* Client Logos Carousel */}
      <ClientLogoCarousel />

      {/* Key Metrics */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Data-Driven Investing Section - ADD THIS */}
          <DataDrivenSection />
          <ExactTradingViewWidgets />
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose FluxHold?
            </h2>
            <p className="text-xl text-[#9BA3AF] max-w-3xl mx-auto">
              Experience professional investment tools in a completely risk-free
              environment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ChartBarIcon className="w-8 h-8" />,
                title: "Real-time Analytics",
                description:
                  "Mock portfolio tracking with live data visualization",
                color: "from-[#4C6FFF] to-blue-400",
              },
              {
                icon: <ShieldCheckIcon className="w-8 h-8" />,
                title: "Secure Sandbox",
                description:
                  "Practice with simulated markets, no real financial risk",
                color: "from-[#0EF2C2] to-emerald-400",
              },
              {
                icon: <TrendingUpIcon className="w-8 h-8" />,
                title: "Portfolio Simulation",
                description:
                  "Test strategies with historical and synthetic market data",
                color: "from-purple-500 to-[#4C6FFF]",
              },
              {
                icon: <AcademicCapIcon className="w-8 h-8" />,
                title: "Learning Tools",
                description:
                  "Educational resources and investment concept tutorials",
                color: "from-amber-500 to-orange-400",
              },
              {
                icon: <ServerIcon className="w-8 h-8" />,
                title: "Multi-Asset Support",
                description: "Simulate stocks, crypto, ETFs, and commodities",
                color: "from-rose-500 to-pink-400",
              },
              {
                icon: <LockClosedIcon className="w-8 h-8" />,
                title: "Data Privacy",
                description: "No real financial information required or stored",
                color: "from-violet-500 to-purple-400",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-[#0B1C2D] border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] group"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#9BA3AF]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-[#0B1C2D] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Start in Minutes</h2>
            <p className="text-xl text-[#9BA3AF] max-w-3xl mx-auto">
              Get started with our platform in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                desc: "Sign up with any email—no verification needed",
              },
              {
                step: "02",
                title: "Explore Dashboard",
                desc: "Access simulated portfolio with $200  balance",
              },
              {
                step: "03",
                title: "Practice Trading",
                desc: "Test strategies with historical market data",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-[#0B1C2D] border border-gray-800 rounded-2xl p-8">
                  <div className="text-5xl font-bold text-[#4C6FFF] mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-[#9BA3AF]">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRightIcon className="w-8 h-8 text-[#0EF2C2]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SafetyFeatures />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA */}
      {/* <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0B1C2D] to-gray-900 border border-gray-800 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4C6FFF]/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0EF2C2]/10 rounded-full translate-y-32 -translate-x-32"></div>

            <div className="relative">
              <h2 className="text-4xl font-bold mb-6">Ready to Explore?</h2>
              <p className="text-xl text-[#9BA3AF] mb-10 max-w-2xl mx-auto">
                Start your free demo today. No credit card required, no real
                money involved—just pure learning and experimentation.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-[#0B1C2D] font-bold py-4 px-10 rounded-lg hover:shadow-2xl hover:shadow-[#4C6FFF]/30 transition-all duration-300"
              >
                <span>Start Free Demo</span>
                <ArrowUpIcon className="w-5 h-5 rotate-45" />
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      <TeamSection />

      <FAQSection />
      {/* Footer */}
      <Footer />
    </div>
  );
}
