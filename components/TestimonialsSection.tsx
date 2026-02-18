'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
// Import required modules
import { Pagination, Autoplay } from 'swiper/modules'

// Type definitions
interface Testimonial {
  id: number;
  name: string;
  designation: string;
  comment: string;
  avatar: string;
  rating?: number;
}

interface TestimonialsSectionProps {
  title?: string;
  description?: string;
  testimonials?: Testimonial[];
  backgroundColor?: string;
  showPagination?: boolean;
  autoplay?: boolean;
  slidesPerView?: number;
}

// Default testimonials data
const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Jane Elizabeth Daniels',
    designation: 'Individual Investor',
    comment: '"Fluxhold transformed the way I approach investing. The AI insights are clear and actionable, and I now feel confident managing my portfolio independently."',
    avatar: '/assets/images/clients/avatar_1.png',
    rating: 5
  },
  {
    id: 2,
    name: 'Mark Anthony Thompson',
    designation: 'Collaborative Investor',
    comment: '"Investing with friends has never been this easy. The joint investment feature lets us pool resources and make decisions together, all guided by AI recommendations."',
    avatar: '/assets/images/clients/avatar_2.png',
    rating: 5
  },
  {
    id: 3,
    name: 'Sophie Katherine Lewis',
    designation: 'Risk-Conscious Investor',
    comment: '"I used to worry about risk before investing. Fluxhold’s risk analysis helped me understand my exposure and make informed choices, giving me peace of mind."',
    avatar: '/assets/images/clients/avatar_3.png',
    rating: 5
  },
  {
    id: 4,
    name: 'David Michael Johnson',
    designation: 'Long-Term Investor',
    comment: '"The platform is intuitive and user-friendly. I appreciate how it blends AI predictions with simple portfolio management, making investing accessible for everyone."',
    avatar: '/assets/images/clients/avatar_4.png',
    rating: 5
  },
  {
    id: 5,
    name: 'Olivia Grace Martinez',
    designation: 'Beginner Investor',
    comment: '"I had never invested before, but Fluxhold made it easy to start. The guidance and AI insights gave me confidence to grow my investments responsibly."',
    avatar: '/assets/images/clients/avatar_5.png',
    rating: 5
  },
  {
    id: 6,
    name: 'Ethan Alexander Ramirez',
    designation: 'Strategic Investor',
    comment: '"Fluxhold’s AI recommendations have been a game-changer for my investment strategy. Collaborating with peers through joint portfolios has made investing smarter and more rewarding than ever."',
    avatar: '/assets/images/clients/avatar_6.png',
    rating: 5
  }
]

// Star Rating Component
const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex justify-center mb-4">
    {[...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
)

// Testimonial Card Component
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="review_block bg-[#0B1C2D] border border-gray-800 rounded-2xl p-8 h-full">
    <div className="review_avatar flex justify-center mb-6">
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#0EF2C2]">
        <Image
          src={testimonial.avatar}
          alt={`${testimonial.name} Avatar`}
          fill
          className="object-cover"
        />
      </div>
    </div>
    
    {testimonial.rating && <StarRating rating={testimonial.rating} />}
    
    <p className="review_comment text-[#9BA3AF] text-center mb-6">
      {testimonial.comment}
    </p>
    
    <div className="text-center">
      <h3 className="review_author_name text-xl font-bold text-white mb-1">
        {testimonial.name}
      </h3>
      <span className="review_author_designation text-[#0EF2C2] text-sm">
        {testimonial.designation}
      </span>
    </div>
  </div>
)

// Main TestimonialsSection Component
const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title = "What Investors Say About Us",
  description = "See how Fluxhold has helped investors make smarter decisions, collaborate effectively, and achieve their goals.",
  testimonials = defaultTestimonials,
  backgroundColor = "bg-gradient-to-b from-[#060B14] to-[#0B1C2D]",
  showPagination = true,
  autoplay = true,
  slidesPerView = 3
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Responsive breakpoints for Swiper
  const breakpoints = {
    320: {
      slidesPerView: 1,
      spaceBetween: 20
    },
    640: {
      slidesPerView: 1,
      spaceBetween: 20
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30
    },
    1024: {
      slidesPerView: slidesPerView,
      spaceBetween: 40
    }
  }

  return (
    <section className={`testimonials_section py-20 ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-center mb-16">
          <div className="lg:w-2/3 text-center">
            <div className="heading_block">
              <div className="inline-flex items-center space-x-2 bg-[#0B1C2D] border border-gray-800 rounded-full px-4 py-2 mb-6">
                <svg className="w-4 h-4 text-[#0EF2C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-sm text-[#0EF2C2]">Testimonials</span>
              </div>
              <h2 className="heading_text text-4xl md:text-5xl font-bold mb-6 text-white">
                {title}
              </h2>
              <p className="heading_description text-xl text-[#9BA3AF] mb-0">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="review_carousel">
          {isMounted && (
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={40}
              slidesPerView={slidesPerView}
              pagination={showPagination ? {
                clickable: true,
                el: '.review_pagination',
                bulletClass: 'swiper-pagination-bullet bg-gray-600',
                bulletActiveClass: 'swiper-pagination-bullet-active bg-[#0EF2C2]'
              } : false}
              autoplay={autoplay ? {
                delay: 3000,
                disableOnInteraction: false,
              } : false}
              loop={true}
              breakpoints={breakpoints}
              className="!pb-12"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          
          {/* Custom Pagination Container */}
          {showPagination && (
            <div className="review_pagination flex justify-center mt-8 !relative"></div>
          )}
        </div>

        {/* Stats Section (Optional) */}
        {/* <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-[#0B1C2D] border border-gray-800 rounded-2xl">
            <div className="text-4xl font-bold text-white mb-2">98%</div>
            <div className="text-[#9BA3AF]">Customer Satisfaction</div>
          </div>
          <div className="text-center p-6 bg-[#0B1C2D] border border-gray-800 rounded-2xl">
            <div className="text-4xl font-bold text-white mb-2">10K+</div>
            <div className="text-[#9BA3AF]">Happy Investors</div>
          </div>
          <div className="text-center p-6 bg-[#0B1C2D] border border-gray-800 rounded-2xl">
            <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
            <div className="text-[#9BA3AF]">Average Rating</div>
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default TestimonialsSection