'use client'

import { CheckCircleIcon, XCircleIcon, ArrowUpIcon, ArrowDownIcon } from './Icons'

interface Activity {
  id: number
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal'
  asset: string
  amount: number
  status: 'completed' | 'pending' | 'failed'
  date: string
}

const activities: Activity[] = [
  { id: 1, type: 'buy', asset: 'Demo Tech ETF', amount: 1500, status: 'completed', date: '2024-01-15' },
  { id: 2, type: 'sell', asset: 'Demo Energy Fund', amount: 800, status: 'completed', date: '2024-01-14' },
  { id: 3, type: 'deposit', asset: 'Cash Balance', amount: 2000, status: 'completed', date: '2024-01-12' },
  { id: 4, type: 'buy', asset: 'Demo Green Bonds', amount: 1200, status: 'pending', date: '2024-01-10' },
  { id: 5, type: 'withdrawal', asset: 'Cash Balance', amount: 500, status: 'completed', date: '2024-01-08' },
]

export default function ActivityList() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'pending':
        return <div className="w-5 h-5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy':
      case 'deposit':
        return <ArrowUpIcon className="w-5 h-5 text-green-600" />
      case 'sell':
      case 'withdrawal':
        return <ArrowDownIcon className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy':
      case 'deposit':
        return 'text-green-700 bg-green-50'
      case 'sell':
      case 'withdrawal':
        return 'text-red-700 bg-red-50'
      default:
        return 'text-gray-700 bg-gray-50'
    }
  }

  return (
    <div className="flow-root">
      <ul className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <li key={activity.id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${getTypeColor(activity.type)} mr-3`}>
                  {getTypeIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} {activity.asset}
                  </p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-sm font-medium ${
                  activity.type === 'buy' || activity.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {activity.type === 'buy' || activity.type === 'deposit' ? '+' : '-'}${activity.amount.toLocaleString()}
                </span>
                {getStatusIcon(activity.status)}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700 text-center">
          All transactions are simulated for demonstration purposes
        </p>
      </div>
    </div>
  )
}