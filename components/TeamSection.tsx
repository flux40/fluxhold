'use client'

import Image from 'next/image'

// Type definitions
interface SocialLinks {
  phone: string;
  linkedin: string;
  instagram: string;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  social: SocialLinks;
}

interface TeamSectionProps {
  title?: string;
  description?: string;
  teamMembers?: TeamMember[];
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

// Default team members data
const defaultTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Daniel Brooks',
    position: 'Chief Executive Officer',
    image: '/assets/images/clients/team_image_1.png',
    social: {
      phone: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 2,
    name: 'Sophia Martinez',
    position: 'Financial Advisor',
    image: '/assets/images/clients/team_image_2.png',
    social: {
      phone: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 3,
    name: 'Michael Chen',
    position: 'Chief Technology Officer',
    image: '/assets/images/clients/team_image_3.png',
    social: {
      phone: '#',
      linkedin: '#',
      instagram: '#'
    }
  },
  {
    id: 4,
    name: 'Ava Richardson',
    position: 'Head of Investment Strategy',
    image: '/assets/images/clients/team_image_4.png',
    social: {
      phone: '#',
      linkedin: '#',
      instagram: '#'
    }
  }
]

// Social Icons Component
const SocialIcons: React.FC<{ social: SocialLinks }> = ({ social }) => (
  <ul className="social_icons_block flex justify-center space-x-4">
    <li>
      <a 
        aria-label="Calling" 
        href={social.phone} 
        className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-[#0EF2C2] hover:bg-[#0EF2C2]/10 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-400 hover:text-[#0EF2C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>
    </li>
    <li>
      <a 
        aria-label="Linkedin" 
        href={social.linkedin} 
        className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-[#0EF2C2] hover:bg-[#0EF2C2]/10 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-400 hover:text-[#0EF2C2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
    </li>
    <li>
      <a 
        aria-label="Instagram" 
        href={social.instagram} 
        className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:border-[#0EF2C2] hover:bg-[#0EF2C2]/10 transition-colors"
      >
        <svg className="w-4 h-4 text-gray-400 hover:text-[#0EF2C2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </a>
    </li>
  </ul>
)

// Team Member Card Component
const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
  <div className="team_block group">
    <div className="team_member_image mb-6 overflow-hidden rounded-2xl border border-gray-800">
      <Image
        src={member.image}
        alt={`${member.name} - ${member.position}`}
        width={400}
        height={400}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="team_member_content text-center">
      <h3 className="team_member_name text-2xl font-bold text-white mb-2">
        {member.name}
      </h3>
      <p className="text-[#0EF2C2] mb-4">{member.position}</p>
      <SocialIcons social={member.social} />
    </div>
  </div>
)

// Main TeamSection Component
const TeamSection: React.FC<TeamSectionProps> = ({
  title = "Meet Our Leadership Team",
  description = "At Fluxhold, we are a team of passionate professionals committed to building a smart, secure, and user-focused AI investment platform. Our combined expertise in technology, finance, and product design allows us to create solutions that make investing more accessible, transparent, and collaborative.",
  teamMembers = defaultTeamMembers,
  backgroundColor = "from-[#0B1C2D] to-[#060B14]",
  textColor = "text-[#9BA3AF]",
  accentColor = "[#0EF2C2]"
}) => {
  return (
    <section className={`team_section py-20 bg-gradient-to-b ${backgroundColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-center">
          <div className="lg:w-2/3 text-center mb-16">
            <div className="heading_block">
              <h2 className="heading_text text-4xl md:text-5xl font-bold mb-6 text-white">
                {title}
              </h2>
              <p className={`heading_description text-xl ${textColor} mb-0`}>
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamSection