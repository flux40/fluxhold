"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowUpRight,
  ArrowDownRight,
  Bitcoin,
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Eye,
  EyeOff,
  Settings,
  Bell,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  FileText,
  RefreshCw,
  Sparkles,
  Shield,
  ChevronRight,
  DollarSign,
  Landmark,
  Coins,
  Activity,
} from "lucide-react";
import Link from "next/link";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "investment" | "transfer";
  amount: number;
  description: string;
  status: "completed" | "pending" | "processing" | "failed";
  created_at: string;
  metadata?: any;
}

interface Investment {
  id: string;
  name: string;
  category: string;
  amount: number;
  returns: number;
  returnPercentage: number;
  image?: string;
}

interface PortfolioSummary {
  totalBalance: number;
  totalInvested: number;
  totalReturns: number;
  returnPercentage: number;
  dailyChange: number;
  dailyChangePercentage: number;
  activeInvestments: number;
  pendingTransactions: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [hideBalance, setHideBalance] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Portfolio summary
  const [portfolio, setPortfolio] = useState<PortfolioSummary>({
    totalBalance: 0,
    totalInvested: 0,
    totalReturns: 0,
    returnPercentage: 0,
    dailyChange: 0,
    dailyChangePercentage: 0,
    activeInvestments: 0,
    pendingTransactions: 0,
  });

  // Chart data (simplified for UI)
  const [performanceData] = useState([
    { month: "Jan", value: 245000 },
    { month: "Feb", value: 251000 },
    { month: "Mar", value: 258000 },
    { month: "Apr", value: 262000 },
    { month: "May", value: 259000 },
    { month: "Jun", value: 267000 },
    { month: "Jul", value: 271000 },
    { month: "Aug", value: 275000 },
    { month: "Sep", value: 278000 },
    { month: "Oct", value: 281000 },
    { month: "Nov", value: 283000 },
    { month: "Dec", value: 284568 },
  ]);

  // Asset allocation
  const [allocation] = useState([
    { category: "Stocks", percentage: 43.7, color: "#4c6fff", value: 124500 },
    { category: "Bonds", percentage: 20.0, color: "#f7931a", value: 56800 },
    {
      category: "Real Estate",
      percentage: 17.0,
      color: "#0EF2C2",
      value: 48500,
    },
    { category: "Crypto", percentage: 12.4, color: "#8B5CF6", value: 35200 },
    { category: "Cash", percentage: 6.9, color: "#10B981", value: 19568 },
  ]);

  // Fetch user balance from Supabase
  const fetchUserBalance = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("demo_balance")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching balance:", error);
        return 0;
      }

      return data?.demo_balance || 0;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 0;
    }
  };

  // Fetch total invested amount from transactions
  const fetchTotalInvested = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("amount")
        .eq("user_id", userId)
        .eq("type", "investment")
        .eq("status", "completed");

      if (error) throw error;

      const total =
        data?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
      return total;
    } catch (error) {
      console.error("Error fetching total invested:", error);
      return 0;
    }
  };

  // Fetch total returns from investments
  const fetchTotalReturns = async (userId: string) => {
    try {
      // This would come from an investments table in production
      // For now, calculate from mock data or return 0
      return 34567.89;
    } catch (error) {
      console.error("Error fetching total returns:", error);
      return 0;
    }
  };

  // Fetch pending transactions count
  const fetchPendingCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .in("status", ["pending", "processing"]);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error("Error fetching pending count:", error);
      return 0;
    }
  };

  // Fetch active investments count
  const fetchActiveInvestmentsCount = async (userId: string) => {
    try {
      // This would come from an investments table in production
      // For now, return mock data
      return 8;
    } catch (error) {
      console.error("Error fetching active investments:", error);
      return 0;
    }
  };

  // Fetch daily change (mock for now)
  const fetchDailyChange = async () => {
    return {
      change: 1234.56,
      percentage: 0.44,
    };
  };

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      try {
        setIsLoading(true);

        // Get current user
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!user || error) {
          router.push("/login");
          return;
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }

        setUser({
          ...user,
          profile,
        });

        // Fetch all data in parallel
        const [
          userBalance,
          totalInvested,
          totalReturns,
          pendingCount,
          activeCount,
          dailyChange,
        ] = await Promise.all([
          fetchUserBalance(user.id),
          fetchTotalInvested(user.id),
          fetchTotalReturns(user.id),
          fetchPendingCount(user.id),
          fetchActiveInvestmentsCount(user.id),
          fetchDailyChange(),
        ]);

        // Update balance state
        setBalance(userBalance);

        // Update portfolio summary
        setPortfolio({
          totalBalance: userBalance,
          totalInvested,
          totalReturns,
          returnPercentage:
            totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0,
          dailyChange: dailyChange.change,
          dailyChangePercentage: dailyChange.percentage,
          activeInvestments: activeCount,
          pendingTransactions: pendingCount,
        });

        // Fetch recent transactions
        await fetchRecentTransactions(user.id);

        // Fetch user investments
        await fetchUserInvestments(user.id);
      } catch (error) {
        console.error("Error checking user:", error);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndFetchData();

    // Set up realtime subscription for transactions
    const subscription = supabase
      .channel("dashboard_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${user?.id}`,
        },
        async (payload) => {
          // Refresh balance and transactions when new transaction is added
          if (user?.id) {
            const newBalance = await fetchUserBalance(user.id);
            setBalance(newBalance);
            setPortfolio((prev) => ({ ...prev, totalBalance: newBalance }));

            const pendingCount = await fetchPendingCount(user.id);
            setPortfolio((prev) => ({
              ...prev,
              pendingTransactions: pendingCount,
            }));
          }

          setTransactions((prev) => [
            payload.new as Transaction,
            ...prev.slice(0, 4),
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${user?.id}`,
        },
        async (payload) => {
          // Refresh balance when transaction status changes
          if (user?.id && payload.new.status === "completed") {
            const newBalance = await fetchUserBalance(user.id);
            setBalance(newBalance);
            setPortfolio((prev) => ({ ...prev, totalBalance: newBalance }));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [router, user?.id]);

  const fetchRecentTransactions = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data && data.length > 0) {
        setTransactions(data);
      } else {
        // Mock data for demo
        setTransactions([
          {
            id: "1",
            type: "deposit",
            amount: 5000,
            description: "Bitcoin Deposit",
            status: "completed",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            metadata: { btc_amount: "0.125" },
          },
          {
            id: "2",
            type: "investment",
            amount: -2500,
            description: "Green Energy Solar Fund",
            status: "completed",
            created_at: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "3",
            type: "withdrawal",
            amount: -1000,
            description: "BTC Withdrawal",
            status: "completed",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            metadata: { btc_amount: "0.025" },
          },
          {
            id: "4",
            type: "investment",
            amount: -3500,
            description: "AI Technology Fund",
            status: "completed",
            created_at: new Date(Date.now() - 259200000).toISOString(),
          },
          {
            id: "5",
            type: "deposit",
            amount: 3000,
            description: "USDT Deposit",
            status: "pending",
            created_at: new Date(Date.now() - 345600000).toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchUserInvestments = async (userId: string) => {
    try {
      // This would come from Supabase in production
      // For demo, we'll use mock data
      setInvestments([
        {
          id: "1",
          name: "Green Energy Solar Farm",
          category: "Renewable Energy",
          amount: 15000,
          returns: 1875,
          returnPercentage: 12.5,
          image:
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop",
        },
        {
          id: "2",
          name: "AI Technology Fund",
          category: "Technology",
          amount: 25000,
          returns: 4675,
          returnPercentage: 18.7,
          image:
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop",
        },
        {
          id: "3",
          name: "Luxury Real Estate",
          category: "Real Estate",
          amount: 30000,
          returns: 4560,
          returnPercentage: 15.2,
          image:
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop",
        },
      ]);
    } catch (error) {
      console.error("Error fetching investments:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return formatCurrency(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "processing":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="w-4 h-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case "investment":
        return <TrendingUp className="w-4 h-4 text-[#0EF2C2]" />;
      case "transfer":
        return <Wallet className="w-4 h-4 text-blue-500" />;
      default:
        return <Wallet className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0EF2C2]"></div>
          <p className="mt-4 text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Welcome back,{" "}
              {user?.user_metadata?.full_name?.split(" ")[0] ||
                user?.email?.split("@")[0] ||
                "Investor"}
              ! 👋
            </h1>
            <p className="text-gray-400 mt-1">
              Here's what's happening with your investments today.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors"
            >
              {hideBalance ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            <Link
              href="/dashboard/deposit"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Deposit</span>
            </Link>
            <Link
              href="/dashboard/withdrawals"
              className="flex items-center space-x-2 px-4 py-2 bg-[#0F2438] border border-gray-800 text-white rounded-lg hover:border-[#4c6fff] transition-colors"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Withdraw</span>
            </Link>
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

        {/* Main Balance Card */}
        <div className="mb-8 p-6 md:p-8 bg-gradient-to-r from-[#4c6fff]/20 via-[#4C6FFF]/10 to-[#0EF2C2]/5 rounded-2xl border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4c6fff]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0EF2C2]/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-300">Total Balance</span>
                  <button
                    onClick={() => setHideBalance(!hideBalance)}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {hideBalance ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-end space-x-3">
                  <h2 className="text-4xl md:text-5xl font-bold text-white">
                    {hideBalance ? "••••••" : formatCurrency(balance)}
                  </h2>
                  <div className="flex items-center mb-1 px-2 py-1 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-500">
                      {formatPercent(portfolio.dailyChangePercentage)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-400 mt-2">
                  Available for trading •{" "}
                  {formatCompactCurrency(portfolio.totalInvested)} invested
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#0B1C2D]/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-800">
                  <p className="text-gray-400 text-xs">Total Invested</p>
                  <p className="text-white font-bold text-lg">
                    {hideBalance
                      ? "••••••"
                      : formatCompactCurrency(portfolio.totalInvested)}
                  </p>
                </div>
                <div className="bg-[#0B1C2D]/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-800">
                  <p className="text-gray-400 text-xs">Total Returns</p>
                  <p className="text-green-500 font-bold text-lg">
                    {hideBalance
                      ? "••••••"
                      : formatCompactCurrency(portfolio.totalReturns)}
                  </p>
                </div>
                <div className="bg-[#0B1C2D]/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-800 col-span-2 md:col-span-1">
                  <p className="text-gray-400 text-xs">Return Rate</p>
                  <p className="text-[#0EF2C2] font-bold text-lg">
                    {formatPercent(portfolio.returnPercentage)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-5 hover:border-[#4c6fff]/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Investments</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {portfolio.activeInvestments}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Across 5 categories
                </p>
              </div>
              <div className="p-3 bg-[#4c6fff]/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-[#4c6fff]" />
              </div>
            </div>
            <Link
              href="/dashboard/joint-investments"
              className="text-xs text-[#4c6fff] hover:text-[#4c6fff]/80 flex items-center mt-3"
            >
              View all investments
              <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-5 hover:border-[#4C6FFF]/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Transactions</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {portfolio.pendingTransactions}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Awaiting confirmation
                </p>
              </div>
              <div className="p-3 bg-[#4C6FFF]/10 rounded-lg">
                <Clock className="w-6 h-6 text-[#4C6FFF]" />
              </div>
            </div>
            <Link
              href="/dashboard/transactions"
              className="text-xs text-[#4C6FFF] hover:text-[#4C6FFF]/80 flex items-center mt-3"
            >
              View transactions
              <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-5 hover:border-[#0EF2C2]/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Available Reports</p>
                <p className="text-2xl font-bold text-white mt-1">8</p>
                <p className="text-xs text-gray-500 mt-1">3 new this month</p>
              </div>
              <div className="p-3 bg-[#0EF2C2]/10 rounded-lg">
                <FileText className="w-6 h-6 text-[#0EF2C2]" />
              </div>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-xs text-[#0EF2C2] hover:text-[#0EF2C2]/80 flex items-center mt-3"
            >
              View reports
              <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-5 hover:border-[#10B981]/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Joint Investments</p>
                <p className="text-2xl font-bold text-white mt-1">3</p>
                <p className="text-xs text-gray-500 mt-1">
                  2 active opportunities
                </p>
              </div>
              <div className="p-3 bg-[#10B981]/10 rounded-lg">
                <Users className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
            <Link
              href="/dashboard/joint-investments"
              className="text-xs text-[#10B981] hover:text-[#10B981]/80 flex items-center mt-3"
            >
              Join investments
              <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio Performance & Allocation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Performance Chart */}
            <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Portfolio Performance
                  </h3>
                  <p className="text-sm text-gray-400">Last 12 months</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 bg-[#0F2438] rounded-lg text-xs text-white border border-gray-800 hover:border-[#4c6fff] transition-colors">
                    1D
                  </button>
                  <button className="px-3 py-1.5 bg-[#0F2438] rounded-lg text-xs text-white border border-gray-800 hover:border-[#4c6fff] transition-colors">
                    1W
                  </button>
                  <button className="px-3 py-1.5 bg-[#4c6fff] rounded-lg text-xs text-white">
                    1M
                  </button>
                  <button className="px-3 py-1.5 bg-[#0F2438] rounded-lg text-xs text-white border border-gray-800 hover:border-[#4c6fff] transition-colors">
                    1Y
                  </button>
                </div>
              </div>

              {/* Simplified Chart */}
              <div className="w-full">
                {/* Responsive Chart with Horizontal Scroll on Mobile */}
                <div className="relative">
                  {/* Chart Container */}
                  <div className="h-36 xs:h-40 sm:h-44 md:h-48 w-full overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide">
                    <div className="flex items-end justify-start gap-2 sm:gap-3 min-w-[500px] xs:min-w-[550px] sm:min-w-0 px-1 h-full">
                      {performanceData.map((item, index) => {
                        // Calculate dynamic height based on screen size
                        const maxValue = Math.max(
                          ...performanceData.map((d) => d.value)
                        );
                        const minValue = 240000;
                        const range = maxValue - minValue;
                        const percentage =
                          ((item.value - minValue) / range) * 100;

                        // Responsive max heights
                        const maxBarHeight = {
                          default: "80px",
                          xs: "90px",
                          sm: "100px",
                          md: "110px",
                          lg: "120px",
                        };

                        return (
                          <div
                            key={index}
                            className="flex-1 flex flex-col items-center group relative h-full justify-end"
                          >
                            {/* Bar */}
                            <div
                              className="w-full max-w-[28px] xs:max-w-[32px] sm:max-w-[36px] md:max-w-[40px] bg-gradient-to-t from-[#4C6FFF] to-[#4C6FFF]/70 rounded-t-lg transition-all duration-300 hover:from-[#4C6FFF] hover:to-[#4C6FFF] hover:shadow-lg hover:shadow-[#4C6FFF]/30 group-hover:scale-105"
                              style={{
                                height: `${Math.max(15, percentage)}%`,
                                maxHeight: "120px",
                                minHeight: "16px",
                              }}
                            >
                              {/* Tooltip */}
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#0B1C2D] border border-[#4C6FFF] rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg z-20">
                                <span className="text-[10px] xs:text-xs font-semibold text-white">
                                  ${item.value.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Month Label */}
                            <span className="text-[9px] xs:text-[10px] sm:text-xs text-gray-400 mt-2 font-medium">
                              {item.month}
                            </span>

                            {/* Compact Value (shown on larger screens) */}
                            <span className="hidden xs:block text-[8px] xs:text-[9px] sm:text-[10px] text-gray-500">
                              ${(item.value / 1000).toFixed(0)}K
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Scroll Indicators - Only show on mobile when content overflows */}
                  <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#0A0F1E] via-[#0A0F1E]/80 to-transparent pointer-events-none sm:hidden"></div>
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#0A0F1E] via-[#0A0F1E]/80 to-transparent pointer-events-none sm:hidden"></div>

                  {/* Scroll Hint - Shows on mobile */}
                  <p className="text-[10px] text-gray-600 text-center mt-1 sm:hidden">
                    ← Scroll to see all months →
                  </p>
                </div>
              </div>

              <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#4c6fff] rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400">
                      Portfolio Value
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#4C6FFF] rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400">Benchmark</span>
                  </div>
                </div>
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +13.8% vs benchmark
                </span>
              </div>
            </div>

            {/* Asset Allocation */}
            <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Asset Allocation
                  </h3>
                  <p className="text-sm text-gray-400">
                    Current portfolio diversification
                  </p>
                </div>
                <Link
                  href="/dashboard/reports"
                  className="text-sm text-[#4c6fff] hover:text-[#4c6fff]/80 flex items-center"
                >
                  View full report
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Donut Chart Placeholder */}
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-800"></div>
                  <div
                    className="absolute inset-0 rounded-full border-8 border-t-[#4c6fff] border-r-[#4C6FFF] border-b-[#0EF2C2] border-l-[#8B5CF6]"
                    style={{
                      clipPath:
                        "polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)",
                      transform: "rotate(-45deg)",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-white">
                      {formatPercent(portfolio.returnPercentage)}
                    </span>
                    <span className="text-xs text-gray-400">return</span>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="space-y-3">
                    {allocation.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-gray-300">
                            {item.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-white font-medium">
                            {item.percentage}%
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatCompactCurrency(item.value)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity & Investments */}
          <div className="space-y-6">
            {/* Recent Transactions */}
            <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  Recent Activity
                </h3>
                <Link
                  href="/dashboard/transactions"
                  className="text-sm text-[#4c6fff] hover:text-[#4c6fff]/80 flex items-center"
                >
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.slice(0, 4).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            tx.type === "deposit"
                              ? "bg-green-500/10"
                              : tx.type === "withdrawal"
                              ? "bg-red-500/10"
                              : tx.type === "investment"
                              ? "bg-[#0EF2C2]/10"
                              : "bg-blue-500/10"
                          }`}
                        >
                          {getTypeIcon(tx.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white capitalize">
                            {tx.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatDate(tx.created_at)}
                            </span>
                            <span className="flex items-center text-xs">
                              {getStatusIcon(tx.status)}
                              <span className="ml-1 text-gray-500 capitalize">
                                {tx.status}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            tx.amount > 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {tx.amount > 0 ? "+" : ""}
                          {formatCompactCurrency(tx.amount)}
                        </p>
                        {tx.metadata?.btc_amount && (
                          <p className="text-xs text-[#4c6fff]">
                            {tx.metadata.btc_amount} BTC
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">
                      No recent transactions
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <Link
                  href="/dashboard/transactions"
                  className="w-full py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors flex items-center justify-center text-sm"
                >
                  View All Transactions
                </Link>
              </div>
            </div>

            {/* Active Investments */}
            <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  Active Investments
                </h3>
                <Link
                  href="/dashboard/joint-investments"
                  className="text-sm text-[#4c6fff] hover:text-[#4c6fff]/80 flex items-center"
                >
                  Manage
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {investments.map((investment) => (
                  <div
                    key={investment.id}
                    className="flex items-center justify-between group cursor-pointer hover:bg-[#0F2438] p-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#4c6fff]/20 flex items-center justify-center overflow-hidden">
                        {investment.image ? (
                          <img
                            src={investment.image}
                            alt={investment.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <TrendingUp className="w-5 h-5 text-[#4c6fff]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {investment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {investment.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">
                        {formatCompactCurrency(investment.amount)}
                      </p>
                      <p className="text-xs text-green-500">
                        +{formatPercent(investment.returnPercentage)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <Link
                  href="/dashboard/joint-investments"
                  className="w-full py-2 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Discover New Investments
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/dashboard/deposit"
                  className="p-3 bg-[#0F2438] border border-gray-800 rounded-xl hover:border-[#4c6fff] transition-colors flex flex-col items-center"
                >
                  <div className="p-2 bg-[#4c6fff]/10 rounded-lg mb-2">
                    <ArrowDownRight className="w-5 h-5 text-[#4c6fff]" />
                  </div>
                  <span className="text-sm text-white">Deposit</span>
                </Link>

                <Link
                  href="/dashboard/withdrawals"
                  className="p-3 bg-[#0F2438] border border-gray-800 rounded-xl hover:border-[#4c6fff] transition-colors flex flex-col items-center"
                >
                  <div className="p-2 bg-[#4c6fff]/10 rounded-lg mb-2">
                    <ArrowUpRight className="w-5 h-5 text-[#4c6fff]" />
                  </div>
                  <span className="text-sm text-white">Withdraw</span>
                </Link>

                <Link
                  href="/dashboard/joint-investments"
                  className="p-3 bg-[#0F2438] border border-gray-800 rounded-xl hover:border-[#4c6fff] transition-colors flex flex-col items-center"
                >
                  <div className="p-2 bg-[#4c6fff]/10 rounded-lg mb-2">
                    <Users className="w-5 h-5 text-[#4c6fff]" />
                  </div>
                  <span className="text-sm text-white">Joint Invest</span>
                </Link>

                <Link
                  href="/dashboard/reports"
                  className="p-3 bg-[#0F2438] border border-gray-800 rounded-xl hover:border-[#4c6fff] transition-colors flex flex-col items-center"
                >
                  <div className="p-2 bg-[#4c6fff]/10 rounded-lg mb-2">
                    <FileText className="w-5 h-5 text-[#4c6fff]" />
                  </div>
                  <span className="text-sm text-white">Reports</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Banner */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#4C6FFF]/20 via-[#4c6fff]/10 to-[#0EF2C2]/5 rounded-2xl border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#4c6fff]/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#4c6fff]/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-[#4c6fff]" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">AI Market Insight</h4>
                <p className="text-gray-300 text-sm max-w-2xl">
                  Based on current market trends, technology and renewable
                  energy sectors are showing strong momentum. Consider
                  increasing allocation to AI and clean energy funds for
                  potential 15-20% returns this quarter.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/ai-insight"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center whitespace-nowrap"
            >
              View Analysis
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600 flex items-center justify-center">
            <Shield className="w-3 h-3 mr-1" />
            All transactions are encrypted and secured. Balance updated{" "}
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
