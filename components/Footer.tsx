import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-[#0B1C2D] border-t border-gray-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#060B14]/20"></div>
      
      {/* Floating decoration elements */}
      <div className="absolute top-10 left-5 w-24 h-24 opacity-10">
        <div className="text-4xl">💎</div>
      </div>
      <div className="absolute bottom-20 right-10 w-32 h-32 opacity-10">
        <div className="text-6xl">📈</div>
      </div>
      <div className="absolute top-1/4 right-1/4 w-16 h-16 opacity-5">
        <div className="text-3xl">💰</div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Column 1: Brand & Contact */}
            <div className="space-y-6">
              <div className="site_logo">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] bg-clip-text text-transparent">
                      FluxHold
                    </span>
                    <p className="text-xs text-[#9BA3AF]">Demo Investment Platform</p>
                  </div>
                </Link>
              </div>
              
              <ul className="space-y-4">
                <li>
                  <Link href="/about-us" className="flex items-center space-x-3 text-[#9BA3AF] hover:text-white transition-colors group">
                    <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#4C6FFF]/20 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="iconlist_text">About Us</span>
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@fluxhold.com" className="flex items-center space-x-3 text-[#9BA3AF] hover:text-white transition-colors group">
                    <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#0EF2C2]/20 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="iconlist_text">support@fluxhold.com</span>
                  </a>
                </li>
              </ul>
              
              <p className="text-[#9BA3AF] text-sm pe-0 lg:pe-10">
                FluxHold is a demonstration platform for portfolio simulation and investment education. 
                No real money is involved, and no financial advice is provided.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-6 pe-0 lg:pe-10">
              <h3 className="text-white font-bold text-lg">Quick Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/register" className="flex items-center space-x-3 text-[#9BA3AF] hover:text-white transition-colors group">
                    <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#4C6FFF]/20 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </span>
                    <span className="iconlist_text">Sign Up</span>
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="flex items-center space-x-3 text-[#9BA3AF] hover:text-white transition-colors group">
                    <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-[#0EF2C2]/20 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </span>
                    <span className="iconlist_text">Login</span>
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="flex items-center space-x-3 text-[#9BA3AF] hover:text-white transition-colors group">
                    <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <span className="iconlist_text">Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="flex items-center space-x-3 text-[#9BA3AF] hover:text-white transition-colors group">
                    <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <span className="iconlist_text">Terms & Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="flex items-center space-x-3 text-[#9BA3AF] hover:text-white transition-colors group">
                    <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="iconlist_text">Help Desk</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Download App */}
            <div className="space-y-6 pe-0 lg:pe-10">
              <h3 className="text-white font-bold text-lg">Download App</h3>
              <p className="text-[#9BA3AF] text-sm">
                Coming soon on your favorite app stores. Get notifications and access your demo portfolio on the go.
              </p>
              
              <div className="space-y-4">
                <div className="app_download_btns flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#" 
                    className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors flex items-center space-x-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.666-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.787-.94 1.324-2.245 1.171-3.54-1.133.052-2.518.754-3.334 1.701-.735.85-1.389 2.207-1.207 3.514 1.262.104 2.548-.676 3.37-1.675z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-[#9BA3AF]">Download on the</div>
                      <div className="text-white font-bold">App Store</div>
                    </div>
                  </a>
                  
                  <a 
                    href="#" 
                    className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors flex items-center space-x-3 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L12.206 12l5.492-5.492zm-8.635-8.635l10.937 6.333-2.302 2.302-8.635-8.635z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-[#9BA3AF]">Get it on</div>
                      <div className="text-white font-bold">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="pt-6 border-t border-gray-800">
                <h4 className="text-white font-medium mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { name: 'Twitter', icon: '𝕏', color: 'hover:bg-gray-800' },
                    { name: 'LinkedIn', icon: 'in', color: 'hover:bg-blue-900/20' },
                    { name: 'GitHub', icon: '{}', color: 'hover:bg-gray-800' },
                    { name: 'Discord', icon: '◈', color: 'hover:bg-indigo-900/20' },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href="#"
                      className={`w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-700 transition-all ${social.color}`}
                      title={social.name}
                    >
                      <span className="font-bold">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>


          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-[#9BA3AF] text-sm mb-4 md:mb-0">
                Copyright © {currentYear} FluxHold Demo Platform. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm text-[#9BA3AF]">
                <Link href="/sitemap" className="hover:text-white transition-colors">
                  Sitemap
                </Link>
                <Link href="/accessibility" className="hover:text-white transition-colors">
                  Accessibility
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>Demo Platform Status: Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}