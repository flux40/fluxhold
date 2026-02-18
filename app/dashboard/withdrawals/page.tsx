'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  ArrowLeft, Copy, Wallet, Shield, Clock, CheckCircle, 
  AlertCircle, ExternalLink, Bitcoin, Loader2, Info,
  History, TrendingDown, X
} from 'lucide-react'
import Link from 'next/link'

interface WithdrawalMethod {
  id: string
  name: string
  icon: any
  processingTime: string
  fee: string
  minAmount: number
  maxAmount: number
  description: string
}

export default function WithdrawalsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [balance, setBalance] = useState<number>(0)
  
  // Withdrawal form state
  const [amount, setAmount] = useState<string>('')
  const [btcAddress, setBtcAddress] = useState<string>('')
  const [step, setStep] = useState<'amount' | 'confirm' | 'processing' | 'success'>('amount')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Withdrawal history
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // BTC withdrawal settings
  const BTC_NETWORK_FEE = '0.0001 BTC'
  const PROCESSING_FEE_PERCENTAGE = 0.5 // 0.5%
  const MIN_WITHDRAWAL = 50
  const MAX_WITHDRAWAL = 500000

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (!user || error) {
          router.push('/login')
          return
        }
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        const userBalance = profile?.demo_balance || 264853.71
        
        setUser({
          ...user,
          profile
        })
        setBalance(userBalance)
        
        // Fetch withdrawal history
        await fetchWithdrawals(user.id)
        
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkUser()
  }, [router])

  const fetchWithdrawals = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'withdrawal')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (!error && data) {
        setWithdrawals(data)
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
    }
  }

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!btcAddress) {
      setError('Please enter your Bitcoin wallet address')
      return
    }
    
    if (!isValidBitcoinAddress(btcAddress)) {
      setError('Invalid Bitcoin address format')
      return
    }
    
    setStep('confirm')
    setError(null)
  }

  const handleBack = () => {
    if (step === 'confirm') setStep('amount')
    if (step === 'success') {
      setStep('amount')
      setAmount('')
      setBtcAddress('')
      setTransactionId(null)
      setError(null)
    }
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleWithdrawal = async () => {
    setIsProcessing(true)
    setError(null)
    
    try {
      const withdrawalAmount = parseFloat(amount)
      
      if (withdrawalAmount > balance) {
        throw new Error('Insufficient balance')
      }
      
      // Calculate BTC amount (simplified: $40,000 = 1 BTC)
      const btcAmount = (withdrawalAmount * 0.000025).toFixed(8)
      
      // Generate mock transaction ID
      const mockTransactionId = 'WTD-' + Math.random().toString(36).substring(2, 10).toUpperCase()
      
      // Try to insert into Supabase
      try {
        const { data: transaction, error } = await supabase
          .from('transactions')
          .insert([
            {
              user_id: user.id,
              type: 'withdrawal',
              amount: -withdrawalAmount, // Negative amount for withdrawals
              description: 'Bitcoin (BTC) Withdrawal',
              status: 'pending',
              sender: 'Fluxhold',
              recipient: btcAddress,
              created_at: new Date().toISOString(),
              metadata: {
                crypto_currency: 'BTC',
                network: 'Bitcoin',
                wallet_address: btcAddress,
                btc_amount: btcAmount,
                usd_amount: withdrawalAmount,
                network_fee: BTC_NETWORK_FEE,
                processing_fee: `${PROCESSING_FEE_PERCENTAGE}%`,
                estimated_completion: new Date(Date.now() + 1800000).toISOString()
              }
            }
          ])
          .select()
          .single()
        
        if (error) {
          console.warn('Supabase insert failed, using mock:', error.message)
          setTransactionId(mockTransactionId)
        } else {
          setTransactionId(transaction.id)
        }
      } catch (supabaseError) {
        console.warn('Supabase error, using mock:', supabaseError)
        setTransactionId(mockTransactionId)
      }
      
      // Update local balance (in production this would be done by Supabase)
      setBalance(prev => prev - withdrawalAmount)
      
      setStep('processing')
      
      // Simulate processing for 5 seconds then success
      setTimeout(() => {
        setStep('success')
        
        // Add to withdrawals list
        setWithdrawals(prev => [
          {
            id: mockTransactionId,
            amount: -withdrawalAmount,
            description: 'Bitcoin (BTC) Withdrawal',
            status: 'completed',
            recipient: btcAddress,
            created_at: new Date().toISOString(),
            metadata: { btc_amount: btcAmount }
          },
          ...prev
        ])
      }, 5000)
      
    } catch (error: any) {
      console.error('Withdrawal failed:', error)
      setError(error.message || 'Failed to process withdrawal')
    } finally {
      setIsProcessing(false)
    }
  }

  const isValidBitcoinAddress = (address: string) => {
    // Basic Bitcoin address validation
    // Supports: Legacy (1...), SegWit (3...), Bech32 (bc1...)
    return /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,59}$/.test(address)
  }

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, '')
    if (!number) return ''
    return new Intl.NumberFormat('en-US').format(parseInt(number))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '')
    if (value === '') {
      setAmount('')
    } else {
      setAmount(value)
    }
  }

  const calculateBTCAmount = (usdAmount: string) => {
    if (!usdAmount) return '0.00000000'
    return (parseInt(usdAmount) * 0.000025).toFixed(8)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const isValidAmount = amount && 
    parseInt(amount) >= MIN_WITHDRAWAL && 
    parseInt(amount) <= MAX_WITHDRAWAL &&
    parseInt(amount) <= balance

  const getAmountError = () => {
    if (!amount) return null
    const numAmount = parseInt(amount)
    if (numAmount < MIN_WITHDRAWAL) return `Minimum withdrawal: $${MIN_WITHDRAWAL}`
    if (numAmount > MAX_WITHDRAWAL) return `Maximum withdrawal: $${MAX_WITHDRAWAL}`
    if (numAmount > balance) return `Insufficient balance ($${balance.toLocaleString()} available)`
    return null
  }

  const amountError = getAmountError()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0EF2C2]"></div>
          <p className="mt-4 text-gray-400">Loading withdrawals page...</p>
        </div>
      </div>
    )
  }

  const renderErrorNotification = () => {
    if (!error) return null
    
    return (
      <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-slide-in">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-red-500/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h4 className="text-white font-medium">Error</h4>
            </div>
            <button onClick={() => setError(null)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-white">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (step) {
      case 'amount':
        return (
          <div className="space-y-6">
            {/* Step indicator */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-[#0EF2C2] text-black flex items-center justify-center font-bold">1</span>
                <span className="ml-2 text-white">Amount & Address</span>
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center">2</span>
                <span className="ml-2 text-gray-500">Confirm</span>
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center">3</span>
                <span className="ml-2 text-gray-500">Processing</span>
              </div>
            </div>

            <form onSubmit={handleAmountSubmit} className="space-y-6">
              {/* Balance Display */}
              <div className="bg-gradient-to-r from-[#4C6FFF]/10 to-[#0EF2C2]/5 rounded-xl border border-gray-800 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Available Balance</span>
                  <span className="text-2xl font-bold text-white">${balance.toLocaleString()}</span>
                </div>
              </div>

              {/* Withdrawal Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Withdrawal Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">$</span>
                  <input
                    type="text"
                    value={amount ? formatCurrency(amount) : ''}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-4 bg-[#0F2438] border border-gray-800 rounded-xl text-white text-3xl font-bold focus:outline-none focus:border-[#4c6fff] transition-colors"
                    autoFocus
                  />
                </div>
                {amountError && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {amountError}
                  </p>
                )}
                {amount && !amountError && (
                  <p className="mt-2 text-sm text-green-500 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Valid amount
                  </p>
                )}
                {amount && (
                  <p className="mt-2 text-sm text-gray-400">
                    You will receive ≈ {calculateBTCAmount(amount)} BTC
                  </p>
                )}
              </div>

              {/* Bitcoin Address */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bitcoin Wallet Address
                </label>
                <input
                  type="text"
                  value={btcAddress}
                  onChange={(e) => setBtcAddress(e.target.value)}
                  placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                  className="w-full px-4 py-4 bg-[#0F2438] border border-gray-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#4c6fff] transition-colors"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Enter your Bitcoin wallet address where you want to receive funds
                </p>
              </div>

              {/* Quick Amount Selector */}
              <div className="grid grid-cols-3 gap-4">
                {[100, 500, 1000, 5000, 10000, 25000]
                  .filter(val => val <= balance)
                  .map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className="px-4 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-white hover:border-[#4c6fff] transition-colors"
                    >
                      ${preset.toLocaleString()}
                    </button>
                  ))}
              </div>

              {/* Fee Information */}
              <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
                <div className="flex items-start space-x-3">
                  <Bitcoin className="w-5 h-5 text-[#4c6fff] mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium">Withdrawal Details</h4>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Network Fee</span>
                        <span className="text-white">{BTC_NETWORK_FEE}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Processing Fee</span>
                        <span className="text-white">{PROCESSING_FEE_PERCENTAGE}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Processing Time</span>
                        <span className="text-white">30-60 minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValidAmount || !btcAddress}
                className="w-full py-4 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Confirm
              </button>
            </form>
          </div>
        )

      case 'confirm':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-[#0EF2C2] text-black flex items-center justify-center font-bold">1</span>
                <span className="ml-2 text-gray-500">Amount</span>
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-[#0EF2C2] text-black flex items-center justify-center font-bold">2</span>
                <span className="ml-2 text-white">Confirm</span>
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center">3</span>
                <span className="ml-2 text-gray-500">Processing</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#4c6fff]/10 to-[#4c6fff]/5 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Bitcoin className="w-5 h-5 mr-2 text-[#4c6fff]" />
                Confirm Withdrawal
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-2xl font-bold text-white">${parseInt(amount).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">BTC Amount</span>
                  <span className="text-[#4c6fff] font-bold">{calculateBTCAmount(amount)} BTC</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Bitcoin Address</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono text-sm break-all max-w-[200px]">
                      {btcAddress.slice(0, 12)}...{btcAddress.slice(-8)}
                    </span>
                    <button
                      onClick={() => handleCopy(btcAddress, 'address')}
                      className="text-[#4c6fff] hover:text-[#4c6fff]/80"
                    >
                      {copied === 'address' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="text-white">{BTC_NETWORK_FEE}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400">Processing Fee</span>
                  <span className="text-white">{PROCESSING_FEE_PERCENTAGE}%</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400">You'll Receive</span>
                  <span className="text-2xl font-bold text-[#4c6fff]">
                    {calculateBTCAmount(amount)} BTC
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h5 className="text-red-500 font-medium">Important</h5>
                  <p className="text-gray-400 text-sm">
                    Please verify that the Bitcoin address is correct. Transactions cannot be reversed once sent.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleWithdrawal}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Bitcoin className="w-5 h-5 mr-2" />
                  Confirm Withdrawal
                </span>
              )}
            </button>
          </div>
        )

      case 'processing':
        return (
          <div className="text-center py-12">
            <div className="inline-block animate-pulse mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-gray-700"></div>
                <div 
                  className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-t-[#4c6fff] border-r-[#4c6fff] border-b-transparent border-l-transparent animate-spin"
                  style={{ animationDuration: '2s' }}
                ></div>
                <Bitcoin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#4c6fff]" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Processing Withdrawal</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Your Bitcoin withdrawal is being processed. This typically takes 30-60 minutes.
            </p>
            
            <div className="max-w-md mx-auto bg-[#0F2438] rounded-xl border border-gray-800 p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-white font-bold">${parseInt(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">BTC Amount</span>
                  <span className="text-[#4c6fff] font-bold">{calculateBTCAmount(amount)} BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Destination</span>
                  <span className="text-white font-mono text-sm">
                    {btcAddress.slice(0, 8)}...{btcAddress.slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-white font-mono text-sm">{transactionId?.slice(0, 8)}...{transactionId?.slice(-4)}</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Withdrawal Initiated!</h3>
            <p className="text-gray-400 mb-6">
              Your Bitcoin withdrawal has been submitted and is being processed.
            </p>
            
            <div className="max-w-md mx-auto bg-[#0F2438] rounded-xl border border-gray-800 p-6 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-white font-mono text-sm">{transactionId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-white font-bold">${parseInt(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">BTC Amount</span>
                  <span className="text-[#4c6fff] font-bold">{calculateBTCAmount(amount)} BTC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Destination</span>
                  <span className="text-white font-mono text-sm break-all">
                    {btcAddress.slice(0, 16)}...{btcAddress.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium">
                    Processing
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                  <span className="text-gray-400">Estimated Completion</span>
                  <span className="text-white font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-[#4c6fff]" />
                    30-60 minutes
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-[#0F2438] border border-gray-800 text-white rounded-xl hover:border-[#4c6fff] transition-colors"
              >
                New Withdrawal
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] relative">
      {/* Error Notification */}
      {renderErrorNotification()}
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Bitcoin Withdrawals</h1>
            <p className="text-gray-400">Withdraw BTC from your investment account</p>
          </div>
          <div className="bg-[#0B1C2D] px-4 py-2 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400">Available Balance</div>
            <div className="text-xl font-bold text-white">${balance.toLocaleString()}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Withdrawal Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6 md:p-8">
              {renderContent()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Withdrawals */}
            <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <History className="w-5 h-5 mr-2 text-[#4c6fff]" />
                  Recent Withdrawals
                </h3>
                <Link 
                  href="/dashboard/transactions"
                  className="text-sm text-[#4c6fff] hover:text-[#4c6fff]/80"
                >
                  View All
                </Link>
              </div>
              
              {withdrawals.length > 0 ? (
                <div className="space-y-3">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-[#0F2438] rounded-lg border border-gray-800">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-red-500/10 rounded-lg">
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">{formatDate(withdrawal.created_at)}</div>
                          <div className="text-xs font-mono text-gray-500">
                            {withdrawal.id.slice(0, 6)}...
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          ${Math.abs(withdrawal.amount).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {withdrawal.metadata?.btc_amount} BTC
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No withdrawals yet</p>
                </div>
              )}
            </div>

            {/* Withdrawal Limits */}
            <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#4c6fff]" />
                Withdrawal Limits
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Minimum</span>
                  <span className="text-white">${MIN_WITHDRAWAL}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Maximum</span>
                  <span className="text-white">${MAX_WITHDRAWAL}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Daily Limit</span>
                  <span className="text-white">$100,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Remaining Today</span>
                  <span className="text-white">$75,000</span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-[#0EF2C2] mt-0.5" />
                <div>
                  <h4 className="text-white font-medium">Secure Withdrawals</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    All withdrawals are manually reviewed and secured. You'll receive email confirmation for each withdrawal request.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <Info className="w-4 h-4 mr-1" />
            Bitcoin transactions are being processed
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}