'use client'

import Image from 'next/image'

// Type definitions
interface SafetyFeature {
  id: number;
  title: string;
  description?: string;
  image: string;
  icon: string;
  isActive?: boolean;
  imageAlignment?: 'left' | 'center' | 'right';
}

interface SafetyFeaturesProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: SafetyFeature[];
  backgroundColor?: string;
  accentColor?: string;
}

// Default features data
const defaultFeatures: SafetyFeature[] = [
  {
    id: 1,
    title: 'Secure transactions with two-factor authentication',
    image: '/assets/images/policy/policy_image_1.webp',
    icon: '/assets/images/icons/icon_lock.svg',
    imageAlignment: 'center'
  },
  {
    id: 2,
    title: 'Trusted by 40+ million Investors worldwide',
    image: '/assets/images/policy/policy_image_2.webp',
    icon: '/assets/images/icons/icon_users.svg',
    isActive: true,
    imageAlignment: 'center'
  },
  {
    id: 3,
    title: 'Data security with no compromises',
    image: '/assets/images/policy/policy_image_3.webp',
    icon: '/assets/images/icons/icon_odomitter.svg',
    imageAlignment: 'right'
  }
]

// Individual Feature Component
const SafetyFeatureCard: React.FC<{ feature: SafetyFeature }> = ({ feature }) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  const imageAlignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  return (
    <div className={`policy_block group relative ${
      feature.isActive ? 'policy_block_active' : ''
    }`}>
      {/* Content Section */}
      <div className="policy_content bg-[#0B1C2D] border border-gray-800 rounded-2xl p-8 mb-6 transition-all duration-300 group-hover:border-[#0EF2C2]/30">
        <div className="policy_icon mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4C6FFF]/10 to-[#0EF2C2]/10 border border-gray-800 flex items-center justify-center group-hover:border-[#0EF2C2]/50 transition-colors">
            <Image
              src={feature.icon}
              alt={feature.title}
              width={32}
              height={32}
              className="text-white"
            />
          </div>
        </div>
        <h3 className={`policy_title text-xl font-bold text-white ${alignmentClasses[feature.imageAlignment || 'center']}`}>
          {feature.title}
        </h3>
        {feature.description && (
          <p className={`mt-4 text-[#9BA3AF] ${alignmentClasses[feature.imageAlignment || 'center']}`}>
            {feature.description}
          </p>
        )}
      </div>

      {/* Image Section */}
      <div className={`policy_image flex ${imageAlignmentClasses[feature.imageAlignment || 'center']}`}>
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border border-gray-800 group-hover:border-[#0EF2C2] transition-all duration-300">
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Active State Indicator */}
          {feature.isActive && (
            <div className="absolute -top-3 -right-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] flex items-center justify-center animate-pulse">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main SafetyFeatures Component
const SafetyFeatures: React.FC<SafetyFeaturesProps> = ({
  title = "Safety First",
  subtitle = "Security Features",
  description = "At Fluxhold, security and trust are at the core of everything we build. We understand that managing investments—whether individual or joint—requires a platform users can rely on with confidence.",
  features = defaultFeatures,
  backgroundColor = "bg-gradient-to-b from-[#060B14] to-[#0B1C2D]",
  accentColor = "[#0EF2C2]"
}) => {
  return (
    <section className={`safety_features py-20 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-center mb-16">
          <div className="lg:w-2/3 text-center">
            <div className="heading_block">
              <div className="inline-flex items-center space-x-2 bg-[#0B1C2D] border border-gray-800 rounded-full px-4 py-2 mb-6">
                <svg className="w-4 h-4 text-[#0EF2C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm text-[#0EF2C2]">{subtitle}</span>
              </div>
              <h3 className="heading_text text-4xl md:text-5xl font-bold mb-6 text-white">
                {title}
              </h3>
              <p className="heading_description text-xl text-[#9BA3AF] mb-0">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          {features.map((feature) => (
            <SafetyFeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-3 bg-[#0B1C2D] border border-gray-800 rounded-full px-6 py-4">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-white font-medium">Your investments are protected with industry-leading security</span>
            <a 
              href="/security" 
              className="text-[#0EF2C2] hover:text-white flex items-center space-x-1 transition-colors"
            >
              <span>Learn more</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SafetyFeatures