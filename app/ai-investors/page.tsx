'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from "@/components/Narbar";
import Footer from "@/components/Footer";
import { 
  SparklesIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  LightBulbIcon,
  CpuChipIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function AIInvestorsPage() {
  const [selectedFeature, setSelectedFeature] = useState(0)

  const aiFeatures = [
    {
      id: 1,
      title: "Predictive Analytics",
      description: "AI models analyze historical data to forecast potential market movements",
      icon: <ChartBarIcon className="w-8 h-8" />,
      benefits: ["Market trend predictions", "Risk assessment scoring", "Portfolio optimization"],
      color: "from-[#4C6FFF] to-blue-400"
    },
    {
      id: 2,
      title: "Risk Management AI",
      description: "Intelligent algorithms identify and mitigate potential investment risks",
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      benefits: ["Real-time risk alerts", "Diversification suggestions", "Volatility monitoring"],
      color: "from-[#0EF2C2] to-emerald-400"
    },
    {
      id: 3,
      title: "Sentiment Analysis",
      description: "Natural language processing analyzes market sentiment from news and social media",
      icon: <LightBulbIcon className="w-8 h-8" />,
      benefits: ["News sentiment scoring", "Social media analysis", "Market mood indicators"],
      color: "from-purple-500 to-pink-400"
    },
    {
      id: 4,
      title: "Portfolio AI",
      description: "Machine learning optimizes your portfolio based on goals and risk tolerance",
      icon: <CpuChipIcon className="w-8 h-8" />,
      benefits: ["Automated rebalancing", "Goal-based optimization", "Tax-efficient strategies"],
      color: "from-amber-500 to-orange-400"
    }
  ]

  return (
    <div className="min-h-screen bg-[#060B14] text-white">
      <Navbar />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4C6FFF]/10 via-transparent to-[#0EF2C2]/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-[#0B1C2D] border border-gray-800 rounded-full px-4 py-2 mb-8">
              <SparklesIcon className="w-4 h-4 text-[#0EF2C2]" />
              <span className="text-sm text-[#0EF2C2]">AI-Powered Investment Demo</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">Artificial Intelligence</span>
              <span className="block bg-gradient-to-r from-[#4C6FFF] via-[#0EF2C2] to-white bg-clip-text text-transparent">
                for Modern Investors
              </span>
            </h1>
            <p className="text-xl text-[#9BA3AF] mb-10">
              Experience how AI transforms investment decision-making in our risk-free demo environment.
              No real money, just cutting-edge technology simulation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-[#0B1C2D] font-bold py-4 px-8 rounded-lg hover:shadow-lg hover:shadow-[#4C6FFF]/25 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Try AI Features Free</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/dashboard" 
                className="border border-gray-700 bg-[#0B1C2D]/50 text-white font-semibold py-4 px-8 rounded-lg hover:border-gray-600 transition-colors"
              >
                View Demo Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI Investment Features</h2>
            <p className="text-xl text-[#9BA3AF] max-w-3xl mx-auto">
              Explore our simulated AI tools designed to enhance investment decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {aiFeatures.map((feature, index) => (
              <div 
                key={feature.id}
                className={`bg-[#0B1C2D] border rounded-2xl p-8 cursor-pointer transition-all duration-300 ${
                  selectedFeature === index 
                    ? 'border-[#0EF2C2] shadow-xl shadow-[#0EF2C2]/10' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}
                onClick={() => setSelectedFeature(index)}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  {selectedFeature === index && (
                    <div className="w-6 h-6 rounded-full bg-[#0EF2C2] flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-[#0B1C2D]" />
                    </div>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#9BA3AF] mb-6">{feature.description}</p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-green-900/30 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How AI Works Section */}
      <section className="py-20 bg-gradient-to-b from-[#0B1C2D] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How Our AI Demo Works</h2>
            <p className="text-xl text-[#9BA3AF] max-w-3xl mx-auto">
              See the process behind our simulated AI investment system
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Data Collection", desc: "AI gathers simulated market data from various sources" },
              { step: "02", title: "Analysis", desc: "Machine learning models process and analyze the data" },
              { step: "03", title: "Prediction", desc: "AI generates investment insights and forecasts" },
              { step: "04", title: "Recommendation", desc: "System suggests simulated investment actions" }
            ].map((step, idx) => (
              <div key={idx} className="relative text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#4C6FFF]/20 to-[#0EF2C2]/10 flex items-center justify-center">
                  <div className="text-2xl font-bold text-white">{step.step}</div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-[#9BA3AF]">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-10 right-0 transform translate-x-1/2">
                    <ArrowRightIcon className="w-8 h-8 text-gray-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#0B1C2D] to-gray-900 border border-gray-800 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4C6FFF]/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0EF2C2]/10 rounded-full translate-y-32 -translate-x-32"></div>
            
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] flex items-center justify-center">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Ready to Experience AI Investing?</h2>
              <p className="text-xl text-[#9BA3AF] mb-10 max-w-2xl mx-auto">
                Start your free demo today and explore how AI can transform your investment strategy—completely risk-free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-[#0B1C2D] font-bold py-4 px-10 rounded-lg hover:shadow-2xl hover:shadow-[#4C6FFF]/30 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Start Free AI Demo</span>
                  <ArrowTrendingUpIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
                <Link 
                  href="/login" 
                  className="border border-gray-700 bg-[#0B1C2D]/50 text-white font-semibold py-4 px-10 rounded-lg hover:border-gray-600 transition-colors"
                >
                  Sign In to Continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

     <Footer />
    </div>
  )
}