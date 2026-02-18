'use client'

export default function DashboardStats() {
  const stats = [
    { name: 'Demo Balance', value: '$25,000', change: '+2.4%', changeType: 'positive' },
    { name: 'Total Investments', value: '12', change: '+3', changeType: 'positive' },
    { name: 'AI Insights', value: '24', change: '+8', changeType: 'positive' },
    { name: 'Active Portfolios', value: '4', change: '+1', changeType: 'positive' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-[#0B1C2D] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <div className="text-sm text-gray-400">{stat.name}</div>
          <div className="mt-2 flex items-baseline">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className={`ml-2 text-sm font-medium ${
              stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
            }`}>
              {stat.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}