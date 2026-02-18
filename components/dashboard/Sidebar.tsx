'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import {
  HomeIcon,
  UserGroupIcon,
  LightBulbIcon,
  ClockIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  BanknotesIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  isMobile?: boolean
  onMobileClose?: () => void
}

interface UserProfile {
  full_name: string | null
  email: string
  avatar_url?: string | null
  role?: string
}

export default function Sidebar({
  isOpen,
  onToggle,
  isMobile = false,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch profile from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error)
        }

        setUserProfile({
          full_name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Investor',
          email: user.email || '',
          avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
          role: 'Standard Account',
        })
      } catch (error) {
        console.error('Error in profile fetch:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (isMobile && onMobileClose) {
      onMobileClose()
    }
  }

  const getSidebarWidth = () => {
    if (isMobile) return 'w-72'
    if (!isOpen && !isHovered) return 'w-20'
    return 'w-72'
  }

  const showText = isOpen || isHovered || isMobile

  // Function to check if a link is active
  const isLinkActive = (href: string) => {
    // Exact match for dashboard
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    // For other pages, check if the pathname starts with the href
    // But ensure we don't match dashboard when on deposit
    return pathname?.startsWith(href) && href !== '/dashboard'
  }

  const navigation = [
    {
      section: 'Main',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Deposit', href: '/dashboard/deposit', icon: BanknotesIcon },
        { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: CreditCardIcon },
        { name: 'Joint Investments', href: '/dashboard/joint-investments', icon: UserGroupIcon },
      ],
    },
    {
      section: 'Activity',
      items: [
        { name: 'Transactions', href: '/dashboard/transactions', icon: ClockIcon },
        { name: 'Reports', href: '/dashboard/reports', icon: DocumentChartBarIcon },
        { name: 'AI Insight', href: '/dashboard/ai-insight', icon: LightBulbIcon },
      ],
    },
    {
      section: 'Account',
      items: [
        { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
        { name: 'Refer & Earn', href: '/dashboard/refer', icon: CurrencyDollarIcon },
      ],
    },
  ]

  // Get user display name
  const getDisplayName = () => {
    if (isLoading) return 'Loading...'
    if (!userProfile) return 'Investor'
    return userProfile.full_name || userProfile.email.split('@')[0] || 'Investor'
  }

  // Get user initials
  const getUserInitials = () => {
    const name = getDisplayName()
    if (name === 'Loading...' || name === 'Investor') return 'F'
    return name.charAt(0).toUpperCase()
  }

  return (
    <div
      className={`flex h-full flex-col ${getSidebarWidth()} transition-all duration-300 bg-[#0B1C2D] border-r border-[#4C6FFF]/20`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Logo Section */}
      <div className="flex h-20 shrink-0 items-center justify-between px-4 border-b border-[#4C6FFF]/20">
        <Link 
          href="/dashboard" 
          onClick={handleLinkClick} 
          className="flex items-center space-x-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] flex items-center justify-center shadow-lg shadow-[#4C6FFF]/20 group-hover:scale-105 transition-transform">
            <span className="text-lg font-bold text-white">F</span>
          </div>
          {showText && (
            <div>
              <span className="text-xl font-bold text-white">Fluxhold</span>
              <span className="block text-xs text-[#0EF2C2]">Investment Platform</span>
            </div>
          )}
        </Link>
        {!isMobile && showText && (
          <button 
            onClick={onToggle} 
            className="p-2 rounded-lg hover:bg-[#4C6FFF]/10 text-gray-400 hover:text-[#0EF2C2] transition-colors"
          >
            {isOpen ? (
              <ChevronDoubleLeftIcon className="h-4 w-4" />
            ) : (
              <ChevronDoubleRightIcon className="h-4 w-4" />
            )}
          </button>
        )}
        {isMobile && (
          <button 
            onClick={onMobileClose} 
            className="p-2 rounded-lg hover:bg-[#4C6FFF]/10 text-gray-400 hover:text-[#0EF2C2] transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.section} className="space-y-2">
            {showText && (
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.section}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = isLinkActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`
                      flex items-center px-3 py-3 rounded-xl transition-all relative group
                      ${!showText ? 'justify-center' : ''}
                      ${isActive 
                        ? 'bg-gradient-to-r from-[#4C6FFF]/20 to-[#0EF2C2]/10 text-white border border-[#4C6FFF]/30' 
                        : 'text-gray-400 hover:bg-[#4C6FFF]/10 hover:text-white'
                      }
                    `}
                    title={!showText ? item.name : undefined}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-[#0EF2C2]' : ''}`} />
                    {showText && <span className="ml-3 text-sm font-medium truncate">{item.name}</span>}
                    
                    {/* Active Indicator - Only show when collapsed */}
                    {isActive && !showText && (
                      <span className="absolute left-0 w-1 h-8 bg-gradient-to-b from-[#4C6FFF] to-[#0EF2C2] rounded-r-full" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[#4C6FFF]/20">
        <div className={`flex items-center ${showText ? 'justify-between' : 'justify-center'}`}>
          <div className="flex items-center min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#0EF2C2] flex items-center justify-center bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] text-white font-bold shadow-lg">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-600 w-full h-full" />
                ) : userProfile?.avatar_url ? (
                  <Image 
                    src={userProfile.avatar_url} 
                    alt="Profile" 
                    width={40} 
                    height={40} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  getUserInitials()
                )}
              </div>
              {!isLoading && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#0EF2C2] border-2 border-[#0B1C2D] rounded-full"></span>
              )}
            </div>
            
            {/* User Info */}
            {showText && (
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {getDisplayName()}
                </p>
                <div className="flex items-center">
                  <span className="text-xs text-[#0EF2C2] truncate">
                    {userProfile?.role || 'Standard Account'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          {showText && (
            <button 
              onClick={() => setShowLogoutConfirm(true)} 
              className="p-2 rounded-lg hover:bg-[#4C6FFF]/10 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#0B1C2D] border border-[#4C6FFF]/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Confirm Logout</h3>
            </div>
            
            <p className="text-gray-400 mb-6">
              Are you sure you want to sign out of your Fluxhold account?
            </p>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)} 
                className="flex-1 py-2.5 px-4 border border-gray-700 rounded-xl text-white hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout} 
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}