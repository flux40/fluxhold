'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  ArrowLeft, ArrowUpRight, ArrowDownRight, 
  Clock, CheckCircle, AlertCircle, XCircle, Filter,
  Download, Search, RefreshCw, FileText,
  TrendingUp, Wallet, Loader2
} from 'lucide-react'
import Link from 'next/link'
import TransactionDetailsModal from '@/components/TransactionDetailsModal'

interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal' | 'investment' | 'transfer'
  amount: number
  description: string
  status: 'completed' | 'pending' | 'failed' | 'processing'
  sender?: string
  recipient?: string
  metadata: any
  created_at: string
  updated_at?: string
}

export default function TransactionsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  // Stats - Calculated directly from transactions
  const [stats, setStats] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalInvestments: 0,
    pendingCount: 0,
    completedCount: 0,
    totalVolume: 0
  })

  // Calculate stats from transactions array
  const calculateStatsFromTransactions = (txs: Transaction[]) => {
    const newStats = {
      totalDeposits: 0,
      totalWithdrawals: 0,
      totalInvestments: 0,
      pendingCount: 0,
      completedCount: 0,
      totalVolume: 0
    }
    
    txs.forEach(tx => {
      // Count pending/processing transactions
      if (tx.status === 'pending' || tx.status === 'processing') {
        newStats.pendingCount++
      }
      
      // Count completed transactions
      if (tx.status === 'completed') {
        newStats.completedCount++
      }

      // Financial totals (only include completed transactions)
      if (tx.status === 'completed') {
        const absAmount = Math.abs(tx.amount)
        
        switch (tx.type) {
          case 'deposit':
            newStats.totalDeposits += absAmount
            break
          case 'withdrawal':
            newStats.totalWithdrawals += absAmount
            break
          case 'investment':
            newStats.totalInvestments += absAmount
            break
        }
      }

      // Total volume - all transactions regardless of status
      newStats.totalVolume += Math.abs(tx.amount)
    })
    
    setStats(newStats)
  }

  // Helper function for pagination page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else if (currentPage <= 3) {
      // Near start
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i)
      }
    } else if (currentPage >= totalPages - 2) {
      // Near end
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Middle
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i)
      }
    }
    
    return pages
  }

  // Realtime subscription
  useEffect(() => {
    if (!user?.id) return

    const subscription = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchTransactions(user.id, false)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.id])

  // Check user on mount
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
        
        setUser({
          ...user,
          profile
        })
        
        await fetchTransactions(user.id)
        
      } catch (error) {
        console.error('Error checking user:', error)
        setError('Failed to authenticate user')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkUser()
  }, [router])

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [transactions, searchTerm, typeFilter, statusFilter, dateRange])

  const fetchTransactions = async (userId: string, showLoading = true) => {
    if (showLoading) setIsFetching(true)
    setError(null)
    
    try {
      // Build the query
      let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage
      const to = from + itemsPerPage - 1
      query = query.range(from, to)
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      if (data) {
        setTransactions(data)
        setTotalCount(count || 0)
        setTotalPages(Math.ceil((count || 0) / itemsPerPage))
        calculateStatsFromTransactions(data) // Calculate stats from fetched transactions
      }
      
    } catch (error: any) {
      console.error('Error fetching transactions:', error)
      setError(error.message || 'Failed to load transactions')
      setTransactions([])
    } finally {
      if (showLoading) setIsFetching(false)
    }
  }

  const fetchAllTransactionsForExport = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching all transactions:', error)
      return []
    }
  }

  const applyFilters = () => {
    let filtered = [...transactions]
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.recipient?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter)
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter)
    }
    
    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.created_at)
        
        switch (dateRange) {
          case 'today':
            return txDate >= today
          case 'week':
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            return txDate >= weekAgo
          case 'month':
            const monthAgo = new Date(today)
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            return txDate >= monthAgo
          case 'year':
            const yearAgo = new Date(today)
            yearAgo.setFullYear(yearAgo.getFullYear() - 1)
            return txDate >= yearAgo
          default:
            return true
        }
      })
    }
    
    setFilteredTransactions(filtered)
  }

  const handleRefresh = async () => {
    if (user) {
      setCurrentPage(1)
      await fetchTransactions(user.id)
    }
  }

  const handlePageChange = async (page: number) => {
    setCurrentPage(page)
    if (user) {
      await fetchTransactions(user.id, true)
    }
  }

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowModal(true)
  }

  const handleExportCSV = async () => {
    if (!user) return
    
    try {
      const allTransactions = await fetchAllTransactionsForExport(user.id)
      
      const headers = ['Date', 'Transaction ID', 'Type', 'Description', 'Amount', 'Status', 'Recipient/Sender', 'BTC Amount']
      const rows = allTransactions.map(tx => [
        new Date(tx.created_at).toLocaleString(),
        tx.id,
        tx.type,
        tx.description || '-',
        tx.amount,
        tx.status,
        tx.recipient || tx.sender || '-',
        tx.metadata?.btc_amount || '-'
      ])
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      setError('Failed to export transactions')
    }
  }

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return <ArrowDownRight className="w-4 h-4 text-green-500" />
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-500" />
      case 'investment': return <TrendingUp className="w-4 h-4 text-[#0EF2C2]" />
      case 'transfer': return <Wallet className="w-4 h-4 text-blue-500" />
      default: return <Wallet className="w-4 h-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffInDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0EF2C2]"></div>
          <p className="mt-4 text-gray-400">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Transaction History</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isFetching}
              className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportCSV}
              disabled={transactions.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards - Calculated from transaction history */}
        {transactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Deposits</p>
                  <p className="text-2xl font-bold text-green-500 mt-1">
                    {formatCurrency(stats.totalDeposits)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.completedCount} completed
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <ArrowDownRight className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Withdrawals</p>
                  <p className="text-2xl font-bold text-red-500 mt-1">
                    {formatCurrency(stats.totalWithdrawals)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.completedCount} completed
                  </p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <ArrowUpRight className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Investments</p>
                  <p className="text-2xl font-bold text-[#0EF2C2] mt-1">
                    {formatCurrency(stats.totalInvestments)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Active investments
                  </p>
                </div>
                <div className="p-3 bg-[#0EF2C2]/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-[#0EF2C2]" />
                </div>
              </div>
            </div>
            
            <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-500 mt-1">
                    {stats.pendingCount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Awaiting confirmation
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Volume</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {formatCurrency(stats.totalVolume)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Lifetime transactions
                  </p>
                </div>
                <div className="p-3 bg-[#4C6FFF]/10 rounded-lg">
                  <Wallet className="w-6 h-6 text-[#4C6FFF]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <h3 className="text-white font-medium">Filters</h3>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-[#4c6fff] hover:text-[#4c6fff]/80"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by ID, description, address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4c6fff] transition-colors"
              />
            </div>
            
            {/* Quick Date Filters */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDateRange('all')}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  dateRange === 'all' 
                    ? 'bg-[#4c6fff] text-white' 
                    : 'bg-[#0F2438] text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDateRange('today')}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  dateRange === 'today' 
                    ? 'bg-[#4c6fff] text-white' 
                    : 'bg-[#0F2438] text-gray-400 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateRange('week')}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  dateRange === 'week' 
                    ? 'bg-[#4c6fff] text-white' 
                    : 'bg-[#0F2438] text-gray-400 hover:text-white'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setDateRange('month')}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  dateRange === 'month' 
                    ? 'bg-[#4c6fff] text-white' 
                    : 'bg-[#0F2438] text-gray-400 hover:text-white'
                }`}
              >
                Month
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Transaction Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                  <option value="investment">Investments</option>
                  <option value="transfer">Transfers</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setTypeFilter('all')
                    setStatusFilter('all')
                    setDateRange('all')
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-red-500 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 overflow-hidden">
          {isFetching ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#4c6fff] animate-spin" />
              <span className="ml-3 text-gray-400">Loading transactions...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <tr 
                          key={transaction.id} 
                          className="hover:bg-[#0F2438] transition-colors cursor-pointer"
                          onClick={() => handleViewTransaction(transaction)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{formatDate(transaction.created_at)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-400">
                              {transaction.id.slice(0, 8)}...{transaction.id.slice(-4)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <div className="p-1.5 bg-gray-800/50 rounded-lg">
                                {getTypeIcon(transaction.type)}
                              </div>
                              <span className="text-sm text-white capitalize">
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-white">{transaction.description || '-'}</div>
                            {transaction.metadata?.btc_amount && (
                              <div className="text-xs text-[#4c6fff] mt-1">
                                {transaction.metadata.btc_amount} BTC
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-bold ${
                              transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(transaction.status)}
                              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewTransaction(transaction)
                              }}
                              className="text-sm text-[#4c6fff] hover:text-[#4c6fff]/80"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <FileText className="w-12 h-12 text-gray-600 mb-4" />
                            <p className="text-gray-400 mb-2">No transactions found</p>
                            <p className="text-gray-500 text-sm">
                              {transactions.length === 0 
                                ? "You haven't made any transactions yet" 
                                : "Try adjusting your filters"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="text-sm text-gray-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} transactions
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#4c6fff] text-white'
                            : 'bg-[#0F2438] text-gray-400 hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Realtime Status */}
        {user && transactions.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600 flex items-center justify-center">
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              Live updates enabled - Transactions refresh automatically
            </p>
          </div>
        )}
      </div>
      
      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedTransaction(null)
        }}
      />
    </div>
  )
}