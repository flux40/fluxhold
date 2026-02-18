// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'
// import { supabase } from '@/lib/supabase'
// import AuthForm from '@/components/AuthForm'

// export default function RegisterPage() {
//   const router = useRouter()
//   const [error, setError] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)

//   const handleRegister = async (email: string, password: string) => {
//     setLoading(true)
//     setError(null)
    
//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: `${window.location.origin}/dashboard`,
//         },
//       })
      
//       if (error) throw error
      
//       setSuccess(true)
//       // Auto-login after successful registration
//       const { error: signInError } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       })
      
//       if (!signInError) {
//         setTimeout(() => {
//           router.push('/dashboard')
//           router.refresh()
//         }, 2000)
//       }
//     } catch (error: any) {
//       setError(error.message || 'An error occurred during registration')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="text-center">
//           <div className="flex justify-center">
//             <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//               </svg>
//             </div>
//           </div>
//           <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your FluxHold account</h2>
//           <p className="mt-2 text-sm text-gray-600">
//             Start exploring our demo investment dashboard
//           </p>
//         </div>
        
//         {success ? (
//           <div className="rounded-md bg-green-50 p-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-green-800">
//                   Account created successfully! Redirecting to dashboard...
//                 </p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <>
//             <AuthForm 
//               type="register" 
//               onSubmit={handleRegister}
//               error={error}
//               loading={loading}
//             />
            
//             <div className="text-center">
//               <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
//                 Already have an account? Sign in
//               </Link>
//             </div>
//           </>
//         )}
        
//         <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
//           <p className="text-sm text-blue-800 text-center">
//             <strong>Demo Platform:</strong> This is for portfolio demonstration only. No real financial data.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


// import SignupFormSupabase from '@/components/forms/SignupFormSupabase'

// export default function SignupPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#060B14] to-[#0B1C2D] py-8 md:py-12">
//       <div className="container mx-auto px-4">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
//             Join Fluxhold Today
//           </h1>
//           <p className="text-gray-400 max-w-2xl mx-auto">
//             Create your free demo account and start your investment journey with $25,000 in virtual funds
//           </p>
//         </div>
        
//         <SignupFormSupabase 
//           title="Start investing in 5 minutes or less."
//           redirectTo="/dashboard"
//         />
//       </div>
//     </div>
//   )
// }

// import SignupFormSupabase from '@/components/forms/SignupFormSupabase'
// import Link from 'next/link'

// export default function SignupPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#060B14] to-[#0B1C2D] py-8 md:py-12">
//       <div className="container mx-auto px-4">
//         {/* Logo/Header */}
//         <div className="text-center mb-8">
//           <Link href="/" className="inline-block">
//             <div className="flex items-center justify-center space-x-3">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] flex items-center justify-center">
//                 <span className="text-xl font-bold text-[#0B1C2D]">F</span>
//               </div>
//               <span className="text-2xl font-bold text-white">Fluxhold</span>
//             </div>
//           </Link>
//         </div>

//         {/* Signup Form */}
//         <SignupFormSupabase />

//         {/* Footer */}
//         <div className="mt-8 text-center text-gray-400 text-sm">
//           <p>© {new Date().getFullYear()} Fluxhold. All rights reserved.</p>
//           <p className="mt-2">
//             <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
//             {' • '}
//             <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }
import SignupForm from '@/components/forms/SignupForm'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060B14] to-[#0B1C2D] py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4C6FFF] to-[#0EF2C2] flex items-center justify-center">
                <span className="text-xl font-bold text-[#0B1C2D]">F</span>
              </div>
              <span className="text-2xl font-bold text-white">Fluxhold</span>
            </div>
          </Link>
          <p className="mt-4 text-gray-400">Best Investment Platform</p>
        </div>

        {/* Signup Form */}
        <SignupForm />

        {/* Footer */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Fluxhold. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            {' • '}
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

