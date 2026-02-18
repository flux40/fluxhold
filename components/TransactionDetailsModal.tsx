'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { 
  X, Copy, CheckCircle, Clock, XCircle, RefreshCw,
  ArrowUpRight, ArrowDownRight, TrendingUp, Wallet,
  ExternalLink, Calendar, Hash, User, FileText
} from 'lucide-react'
import { useState } from 'react'

interface Transaction {
  id: string
  created_at: string
  type: 'deposit' | 'withdrawal' | 'investment' | 'transfer'
  amount: number
  description: string
  status: 'completed' | 'pending' | 'failed' | 'processing'
  sender?: string
  recipient?: string
  metadata?: any
}

interface TransactionDetailsModalProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
}

export default function TransactionDetailsModal({ 
  transaction, 
  isOpen, 
  onClose 
}: TransactionDetailsModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  if (!transaction) return null

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing': return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'failed': return 'bg-red-500/10 text-red-500 border-red-500/20'
    }
  }

  const getTypeIcon = () => {
    switch (transaction.type) {
      case 'deposit': return <ArrowDownRight className="w-6 h-6 text-green-500" />
      case 'withdrawal': return <ArrowUpRight className="w-6 h-6 text-red-500" />
      case 'investment': return <TrendingUp className="w-6 h-6 text-[#0EF2C2]" />
      case 'transfer': return <Wallet className="w-6 h-6 text-blue-500" />
    }
  }

  const getTypeLabel = () => {
    switch (transaction.type) {
      case 'deposit': return 'Deposit'
      case 'withdrawal': return 'Withdrawal'
      case 'investment': return 'Investment'
      case 'transfer': return 'Transfer'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getBlockchainExplorerUrl = (): string | undefined => {
    if (transaction.metadata?.wallet_address) {
      return `https://blockchain.info/address/${transaction.metadata.wallet_address}`
    }
    if (transaction.recipient?.startsWith('1') || transaction.recipient?.startsWith('3') || transaction.recipient?.startsWith('bc1')) {
      return `https://blockchain.info/address/${transaction.recipient}`
    }
    return undefined
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#0B1C2D] border border-gray-800 p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-800/50 rounded-lg">
                      {getTypeIcon()}
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-xl font-bold text-white">
                        {getTypeLabel()} Details
                      </Dialog.Title>
                      <p className="text-sm text-gray-400">
                        Transaction #{transaction.id.slice(0, 8)}...{transaction.id.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                </div>

                {/* Status Banner */}
                <div className={`mb-6 p-4 rounded-xl border ${getStatusColor()}`}>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon()}
                    <div>
                      <p className="font-medium">
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </p>
                      <p className="text-sm opacity-80">
                        {transaction.status === 'completed' && 'Transaction completed successfully'}
                        {transaction.status === 'pending' && 'Waiting for confirmation'}
                        {transaction.status === 'processing' && 'Processing your transaction'}
                        {transaction.status === 'failed' && 'Transaction failed. Please contact support'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                      <p className="text-gray-400 text-sm mb-1">Amount</p>
                      <p className={`text-2xl font-bold ${
                        transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2
                        })}
                      </p>
                      {transaction.metadata?.btc_amount && (
                        <p className="text-sm text-[#F7931A] mt-1">
                          ≈ {transaction.metadata.btc_amount} BTC
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                      <p className="text-gray-400 text-sm mb-1">Date & Time</p>
                      <p className="text-white font-medium">{formatDate(transaction.created_at)}</p>
                    </div>
                  </div>

                  <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-sm mb-2">Description</p>
                    <p className="text-white">{transaction.description || 'No description provided'}</p>
                  </div>

                  {(transaction.sender || transaction.recipient) && (
                    <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                      <p className="text-gray-400 text-sm mb-2">
                        {transaction.type === 'deposit' ? 'Sender' : 'Recipient'}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-white font-mono text-sm break-all">
                          {transaction.sender || transaction.recipient}
                        </p>
                        <button
                          onClick={() => handleCopy(transaction.sender || transaction.recipient || '', 'address')}
                          className="ml-2 p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                        >
                          {copied === 'address' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Additional Metadata */}
                  {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
                    <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                      <p className="text-gray-400 text-sm mb-3">Additional Information</p>
                      <div className="space-y-2">
                        {transaction.metadata.network && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Network</span>
                            <span className="text-white">{transaction.metadata.network}</span>
                          </div>
                        )}
                        {transaction.metadata.confirmations !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Confirmations</span>
                            <span className="text-white">{transaction.metadata.confirmations}/6</span>
                          </div>
                        )}
                        {transaction.metadata.processing_fee && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Processing Fee</span>
                            <span className="text-white">{transaction.metadata.processing_fee}</span>
                          </div>
                        )}
                        {transaction.metadata.network_fee && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Network Fee</span>
                            <span className="text-white">{transaction.metadata.network_fee}</span>
                          </div>
                        )}
                        {transaction.metadata.estimated_completion && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Estimated Completion</span>
                            <span className="text-white">
                              {new Date(transaction.metadata.estimated_completion).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Blockchain Explorer Link */}
                  {getBlockchainExplorerUrl() && (
                    <a
                      href={getBlockchainExplorerUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 w-full py-3 bg-[#F7931A]/10 hover:bg-[#F7931A]/20 text-[#F7931A] rounded-xl border border-[#F7931A]/30 hover:border-[#F7931A]/50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View on Blockchain Explorer</span>
                    </a>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-6 border-t border-gray-800 flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#0F2438] border border-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  {transaction.status === 'failed' && (
                    <button className="px-4 py-2 bg-[#F7931A] text-white rounded-lg hover:bg-[#F7931A]/80 transition-colors">
                      Contact Support
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}