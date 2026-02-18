"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Sparkles,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  X,
  ChevronRight,
  Target,
  Zap,
  Award,
  Lightbulb,
  Bot,
  Database,
  Globe,
  Coins,
  DollarSign,
  Users,
  Building,
  RefreshCw,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

interface MarketInsight {
  id: string;
  title: string;
  description: string;
  category: "stocks" | "crypto" | "real-estate" | "bonds" | "commodities" | "technology";
  sentiment: "bullish" | "bearish" | "neutral";
  confidence: number;
  impact: "high" | "medium" | "low";
  timeframe: "short" | "medium" | "long";
  timestamp: string;
  source: string;
  isNew?: boolean;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: "buy" | "sell" | "hold" | "diversify" | "rebalance";
  asset: string;
  category: string;
  potentialReturn: number;
  riskLevel: "Low" | "Medium" | "High";
  confidence: number;
  reasoning: string[];
  timestamp: string;
}

interface PortfolioPrediction {
  month: string;
  predicted: number;
  actual?: number;
  optimistic: number;
  pessimistic: number;
}

interface AIAnalysis {
  summary: string;
  marketCondition: "bullish" | "bearish" | "neutral" | "volatile";
  riskLevel: "Low" | "Medium" | "High";
  recommendedActions: string[];
  keyMetrics: {
    label: string;
    value: string;
    change: number;
    icon: any;
  }[];
}

export default function AIInsightPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "predictions" | "recommendations" | "signals">("overview");
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // AI Analysis summary
  const [analysis, setAnalysis] = useState<AIAnalysis>({
    summary: "Market conditions show strong momentum in technology and renewable energy sectors, with increasing institutional adoption. AI models detect a potential rotation from growth to value stocks in the coming quarter. Bitcoin dominance is decreasing, suggesting altcoin season approaching.",
    marketCondition: "bullish",
    riskLevel: "Medium",
    recommendedActions: [
      "Increase allocation to AI and machine learning funds",
      "Consider adding renewable energy exposure",
      "Reduce exposure to consumer discretionary",
      "Diversify into emerging market bonds"
    ],
    keyMetrics: [
      { label: "Market Sentiment", value: "Bullish", change: 12.5, icon: TrendingUp },
      { label: "Volatility Index", value: "18.4", change: -5.2, icon: Activity },
      { label: "BTC Dominance", value: "52.3%", change: -3.1, icon: Coins },
      { label: "Institutional Flow", value: "$2.4B", change: 18.7, icon: Building },
    ]
  });

  // Market insights data
  const [insights, setInsights] = useState<MarketInsight[]>([
    {
      id: "1",
      title: "AI Sector Poised for Growth",
      description: "Machine learning and generative AI companies show strong earnings momentum. Institutional capital flowing into AI infrastructure.",
      category: "technology",
      sentiment: "bullish",
      confidence: 87,
      impact: "high",
      timeframe: "long",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      source: "AI Market Analysis v2.4",
      isNew: true
    },
    {
      id: "2",
      title: "Bitcoin Halving Impact",
      description: "Historical data suggests significant price appreciation 12-18 months post-halving. Miners accumulating, supply shock imminent.",
      category: "crypto",
      sentiment: "bullish",
      confidence: 82,
      impact: "high",
      timeframe: "medium",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      source: "Crypto Analytics Engine",
      isNew: true
    },
    {
      id: "3",
      title: "Real Estate Cooling Signs",
      description: "Commercial real estate showing weakness with rising vacancies. Residential market stabilizing with regional variations.",
      category: "real-estate",
      sentiment: "bearish",
      confidence: 76,
      impact: "medium",
      timeframe: "short",
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      source: "Property Market AI"
    },
    {
      id: "4",
      title: "Renewable Energy Surge",
      description: "Solar and wind installation costs continue to decline. Government incentives driving record capacity additions.",
      category: "technology",
      sentiment: "bullish",
      confidence: 91,
      impact: "high",
      timeframe: "long",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      source: "CleanTech Predictor"
    },
    {
      id: "5",
      title: "Federal Reserve Policy Shift",
      description: "AI models predict rate cuts beginning Q3 2026. Bond yields expected to decline, benefiting growth stocks.",
      category: "bonds",
      sentiment: "bullish",
      confidence: 73,
      impact: "high",
      timeframe: "medium",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      source: "Macro AI v1.8"
    },
    {
      id: "6",
      title: "Consumer Spending Slowdown",
      description: "Retail sales data showing deceleration. Discretionary spending under pressure from rising debt payments.",
      category: "stocks",
      sentiment: "bearish",
      confidence: 68,
      impact: "medium",
      timeframe: "short",
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      source: "Consumer Sentiment AI"
    }
  ]);

  // Personalized recommendations
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "1",
      title: "Increase AI Tech Allocation",
      description: "Your current exposure to AI/ML sectors is below optimal levels. Consider increasing allocation to capture growth.",
      type: "buy",
      asset: "Global AI Technology Fund",
      category: "Technology",
      potentialReturn: 18.5,
      riskLevel: "Medium",
      confidence: 84,
      reasoning: [
        "AI adoption accelerating across industries",
        "Strong earnings growth projections (25% YoY)",
        "Institutional capital flowing into sector",
        "Your current allocation: 8% (target: 15-20%)"
      ],
      timestamp: new Date().toISOString()
    },
    {
      id: "2",
      title: "Rebalance Real Estate Position",
      description: "Commercial real estate exposure is above target. Consider reducing position and reallocating to residential REITs.",
      type: "rebalance",
      asset: "Commercial REITs",
      category: "Real Estate",
      potentialReturn: 8.2,
      riskLevel: "Medium",
      confidence: 76,
      reasoning: [
        "Office vacancy rates at 20-year highs",
        "Industrial and residential sectors showing strength",
        "Current allocation: 18% (target: 10-12%)",
        "Suggested reallocation: $15,000 to residential REITs"
      ],
      timestamp: new Date().toISOString()
    },
    {
      id: "3",
      title: "Add Bitcoin Exposure",
      description: "AI models detect accumulation phase. Post-halving supply shock expected to drive prices higher.",
      type: "buy",
      asset: "Bitcoin (BTC)",
      category: "Cryptocurrency",
      potentialReturn: 32.4,
      riskLevel: "High",
      confidence: 79,
      reasoning: [
        "Historically strong returns 12-18 months post-halving",
        "Institutional adoption accelerating",
        "ETF inflows reaching record levels",
        "Current allocation: 5% (target: 10-15%)"
      ],
      timestamp: new Date().toISOString()
    },
    {
      id: "4",
      title: "Reduce Consumer Discretionary",
      description: "Consumer spending data suggests headwinds for retail and luxury goods sectors.",
      type: "sell",
      asset: "Consumer Discretionary ETF",
      category: "Stocks",
      potentialReturn: 4.2,
      riskLevel: "Medium",
      confidence: 71,
      reasoning: [
        "Rising credit card delinquencies",
        "Savings rate at historical lows",
        "Earnings revisions trending negative",
        "Current allocation: 12% (target: 5-7%)"
      ],
      timestamp: new Date().toISOString()
    },
    {
      id: "5",
      title: "Diversify into Emerging Markets",
      description: "EM equities trading at discount to developed markets. AI detects potential rotation.",
      type: "diversify",
      asset: "Emerging Markets Fund",
      category: "International",
      potentialReturn: 14.8,
      riskLevel: "High",
      confidence: 67,
      reasoning: [
        "Valuations at 20-year lows relative to US",
        "Strong USD peaking, benefiting EM currencies",
        "Earnings growth accelerating in Asia",
        "Suggested allocation: 5-10% of portfolio"
      ],
      timestamp: new Date().toISOString()
    }
  ]);

  // Portfolio predictions
  const [predictions, setPredictions] = useState<PortfolioPrediction[]>([
    { month: "Jan", actual: 245000, predicted: 243000, optimistic: 255000, pessimistic: 235000 },
    { month: "Feb", actual: 251000, predicted: 252000, optimistic: 265000, pessimistic: 242000 },
    { month: "Mar", actual: 258000, predicted: 260000, optimistic: 273000, pessimistic: 248000 },
    { month: "Apr", actual: 262000, predicted: 265000, optimistic: 278000, pessimistic: 252000 },
    { month: "May", actual: 259000, predicted: 263000, optimistic: 276000, pessimistic: 250000 },
    { month: "Jun", actual: 267000, predicted: 271000, optimistic: 285000, pessimistic: 258000 },
    { month: "Jul", predicted: 278000, optimistic: 295000, pessimistic: 262000 },
    { month: "Aug", predicted: 285000, optimistic: 305000, pessimistic: 268000 },
    { month: "Sep", predicted: 292000, optimistic: 315000, pessimistic: 273000 },
    { month: "Oct", predicted: 298000, optimistic: 324000, pessimistic: 278000 },
    { month: "Nov", predicted: 305000, optimistic: 335000, pessimistic: 284000 },
    { month: "Dec", predicted: 312000, optimistic: 348000, pessimistic: 290000 },
  ]);

  // Market signals
  const [marketSignals] = useState([
    { name: "RSI (14)", value: "62.4", signal: "neutral", description: "Moderate momentum, neither overbought nor oversold" },
    { name: "MACD", value: "Bullish", signal: "buy", description: "MACD line crossed above signal line" },
    { name: "Moving Average (50/200)", value: "Golden Cross", signal: "buy", description: "50-day MA crossed above 200-day MA" },
    { name: "Bollinger Bands", value: "Upper Band", signal: "neutral", description: "Trading near upper band, potential resistance" },
    { name: "Volume", value: "+24.3%", signal: "bullish", description: "Above average volume confirming uptrend" },
    { name: "Fear & Greed", value: "62", signal: "neutral", description: "Greed zone, not extreme" },
  ]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!user || error) {
          router.push("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setUser({
          ...user,
          profile,
        });
        
      } catch (error) {
        console.error("Error checking user:", error);
        setError("Failed to load AI insights");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Simulate API call to refresh AI insights
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update insights with new data
      const updatedInsights = insights.map(insight => ({
        ...insight,
        isNew: false
      }));
      
      // Add a new insight
      const newInsight: MarketInsight = {
        id: Date.now().toString(),
        title: "AI Detects Accumulation Pattern",
        description: "Multiple AI models detect institutional accumulation in semiconductor and cloud infrastructure stocks.",
        category: "technology",
        sentiment: "bullish",
        confidence: 88,
        impact: "high",
        timeframe: "medium",
        timestamp: new Date().toISOString(),
        source: "Pattern Recognition AI v3.2",
        isNew: true
      };
      
      setInsights([newInsight, ...updatedInsights]);
      
    } catch (error) {
      setError("Failed to refresh AI insights. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "bearish": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "neutral": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return <TrendingUp className="w-3 h-3" />;
      case "bearish": return <TrendingDown className="w-3 h-3" />;
      case "neutral": return <Activity className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "High": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "buy": return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "sell": return <TrendingDown className="w-5 h-5 text-red-500" />;
      case "hold": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "diversify": return <PieChart className="w-5 h-5 text-blue-500" />;
      case "rebalance": return <RefreshCw className="w-5 h-5 text-[#4c6fff]" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "buy": return "text-green-500";
      case "sell": return "text-red-500";
      case "bullish": return "text-green-500";
      case "bearish": return "text-red-500";
      default: return "text-yellow-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "stocks": return <BarChart3 className="w-4 h-4" />;
      case "crypto": return <Coins className="w-4 h-4" />;
      case "real-estate": return <Building className="w-4 h-4" />;
      case "bonds": return <DollarSign className="w-4 h-4" />;
      case "technology": return <Zap className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4c6fff]"></div>
            <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#4c6fff]" />
          </div>
          <p className="mt-4 text-gray-400">Loading AI insights...</p>
          <p className="text-xs text-gray-600 mt-2">Analyzing market data & your portfolio</p>
        </div>
      </div>
    );
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
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#4c6fff]/20 rounded-lg">
                <Brain className="w-6 h-6 text-[#4c6fff]" />
              </div>
              <h1 className="text-2xl font-bold text-white">AI Insights</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 bg-[#0F2438] rounded-lg border border-gray-800">
              <span className="text-xs text-gray-400">AI Model v2.4.1</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-500">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* AI Status Banner */}
        <div className="mb-8 p-5 bg-gradient-to-r from-[#4C6FFF]/10 via-[#4c6fff]/10 to-[#0EF2C2]/10 rounded-2xl border border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#4c6fff]/20 rounded-full animate-pulse">
                <Bot className="w-6 h-6 text-[#4c6fff]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-white font-bold">AI Market Analysis</h3>
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-xs border border-green-500/20">
                    Live
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1 max-w-3xl">
                  {analysis.summary}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                analysis.marketCondition === 'bullish' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                analysis.marketCondition === 'bearish' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
              }`}>
                {analysis.marketCondition.charAt(0).toUpperCase() + analysis.marketCondition.slice(1)} Market
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getRiskColor(analysis.riskLevel)}`}>
                {analysis.riskLevel} Risk
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {analysis.keyMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">{metric.label}</span>
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-xl font-bold text-white">{metric.value}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs flex items-center ${
                    metric.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {metric.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-xs text-gray-500 ml-2">vs yesterday</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <div className="flex space-x-6 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-[#4c6fff] border-b-2 border-[#4c6fff]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Market Overview</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "recommendations"
                  ? "text-[#4c6fff] border-b-2 border-[#4c6fff]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4" />
                <span>Recommendations</span>
                <span className="px-1.5 py-0.5 bg-[#4c6fff] text-white rounded-full text-xs">
                  {recommendations.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("predictions")}
              className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "predictions"
                  ? "text-[#4c6fff] border-b-2 border-[#4c6fff]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <LineChart className="w-4 h-4" />
                <span>Portfolio Forecast</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("signals")}
              className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === "signals"
                  ? "text-[#4c6fff] border-b-2 border-[#4c6fff]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Market Signals</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Market Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.map((insight) => {
                const CategoryIcon = getCategoryIcon(insight.category);
                return (
                  <div
                    key={insight.id}
                    className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-6 hover:border-[#4c6fff]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          insight.sentiment === 'bullish' ? 'bg-green-500/10' :
                          insight.sentiment === 'bearish' ? 'bg-red-500/10' :
                          'bg-yellow-500/10'
                        }`}>
                          {CategoryIcon}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-white font-medium">{insight.title}</h3>
                            {insight.isNew && (
                              <span className="px-1.5 py-0.5 bg-[#4c6fff]/10 text-[#4c6fff] rounded-full text-xs border border-[#4c6fff]/20">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 capitalize">{insight.category}</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getSentimentColor(insight.sentiment)}`}>
                        {getSentimentIcon(insight.sentiment)}
                        <span className="capitalize">{insight.sentiment}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">{insight.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{formatDate(insight.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.impact === 'high' ? 'bg-red-500/10 text-red-500' :
                          insight.impact === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-green-500/10 text-green-500'
                        }`}>
                          {insight.impact} impact
                        </span>
                        <span className="text-xs text-gray-600 capitalize">{insight.timeframe}-term</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                      <span className="text-xs text-gray-600">Source: {insight.source}</span>
                      <button className="text-xs text-[#4c6fff] hover:text-[#4c6fff]/80 flex items-center">
                        View Analysis
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* AI Confidence Note */}
            <div className="bg-[#0F2438] rounded-xl border border-gray-800 p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-medium mb-1">About AI Insights</h4>
                  <p className="text-gray-400 text-xs">
                    AI insights are generated by machine learning models analyzing market data, news sentiment, 
                    and technical indicators. Recommendations are for informational purposes only and do not 
                    constitute financial advice. Always conduct your own research before making investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "recommendations" && (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-6 hover:border-[#4c6fff]/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-[#0F2438] rounded-lg">
                      {getRecommendationIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{rec.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(rec.riskLevel)}`}>
                          {rec.riskLevel} Risk
                        </span>
                        <span className="px-2 py-0.5 bg-[#4c6fff]/10 text-[#4c6fff] rounded-full text-xs border border-[#4c6fff]/20">
                          {rec.confidence}% AI Confidence
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{rec.description}</p>
                      <div className="flex items-center flex-wrap gap-3 text-sm">
                        <span className="text-gray-500">{rec.asset}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span className="text-gray-500">{rec.category}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span className="text-green-500 font-medium">Est. Return: {formatPercent(rec.potentialReturn)}</span>
                      </div>
                      
                      {/* Expandable Reasoning */}
                      <button
                        onClick={() => setExpandedRecommendation(expandedRecommendation === rec.id ? null : rec.id)}
                        className="flex items-center text-xs text-[#4c6fff] hover:text-[#4c6fff]/80 mt-3"
                      >
                        {expandedRecommendation === rec.id ? (
                          <>Hide reasoning <ChevronUp className="w-3 h-3 ml-1" /></>
                        ) : (
                          <>View AI reasoning <ChevronDown className="w-3 h-3 ml-1" /></>
                        )}
                      </button>
                      
                      {expandedRecommendation === rec.id && (
                        <div className="mt-3 p-3 bg-[#0F2438] rounded-lg border border-gray-800">
                          <h4 className="text-white text-xs font-medium mb-2 flex items-center">
                            <Brain className="w-3 h-3 mr-1 text-[#4c6fff]" />
                            AI Reasoning
                          </h4>
                          <ul className="space-y-1">
                            {rec.reasoning.map((reason, idx) => (
                              <li key={idx} className="text-xs text-gray-400 flex items-start">
                                <span className="text-[#4c6fff] mr-2">•</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
                      {rec.type === 'buy' ? 'Buy' : 
                       rec.type === 'sell' ? 'Sell' : 
                       rec.type === 'rebalance' ? 'Rebalance' : 
                       rec.type === 'diversify' ? 'Diversify' : 'Hold'}
                    </button>
                    <button className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Disclaimer */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="text-yellow-500 font-medium text-sm">AI Recommendation Disclaimer</h4>
                  <p className="text-gray-400 text-xs mt-1">
                    These recommendations are generated by AI algorithms based on historical data and market patterns. 
                    Past performance does not guarantee future results. Always consult with a financial advisor before 
                    making investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "predictions" && (
          <div className="space-y-6">
            <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Portfolio Value Forecast</h3>
                  <p className="text-sm text-gray-400">AI-predicted portfolio performance (6-month outlook)</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#4c6fff] rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400">Actual</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#4C6FFF] rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400">Predicted</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#0EF2C2] rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400">Optimistic</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-400">Pessimistic</span>
                  </div>
                </div>
              </div>
              
              {/* Simplified Chart */}
              <div className="h-64 flex items-end space-x-2 mb-4">
                {predictions.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full flex flex-col items-center">
                      {/* Confidence Interval */}
                      <div 
                        className="absolute bottom-0 w-full bg-gradient-to-t from-[#0EF2C2]/20 to-transparent rounded-t-lg"
                        style={{ 
                          height: `${((item.pessimistic - 220000) / 150000) * 100}%`,
                          maxHeight: '180px',
                        }}
                      ></div>
                      
                      {/* Predicted Bar */}
                      <div 
                        className="w-full bg-gradient-to-t from-[#4C6FFF] to-[#4C6FFF]/80 rounded-t-lg transition-all duration-300 group-hover:from-[#4C6FFF] group-hover:to-[#4C6FFF] relative z-10"
                        style={{ 
                          height: `${((item.predicted - 220000) / 150000) * 100}%`,
                          maxHeight: '160px',
                          minHeight: '20px'
                        }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#0F2438] px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700">
                          {formatCurrency(item.predicted)}
                        </div>
                      </div>
                      
                      {/* Actual Bar (if exists) */}
                      {item.actual && (
                        <div 
                          className="absolute bottom-0 w-1/2 bg-[#4c6fff] rounded-t-lg z-20"
                          style={{ 
                            height: `${((item.actual - 220000) / 150000) * 100}%`,
                            maxHeight: '160px',
                            left: '25%'
                          }}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#0F2438] px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-700">
                            {formatCurrency(item.actual)}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-4">{item.month}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0F2438] p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">6-Month Forecast</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(312000)}</p>
                  <p className="text-xs text-green-500 mt-1">+9.6% from current</p>
                </div>
                <div className="bg-[#0F2438] p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Optimistic Case</p>
                  <p className="text-2xl font-bold text-[#0EF2C2]">{formatCurrency(348000)}</p>
                  <p className="text-xs text-green-500 mt-1">+22.3% potential</p>
                </div>
                <div className="bg-[#0F2438] p-4 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Pessimistic Case</p>
                  <p className="text-2xl font-bold text-red-500">{formatCurrency(290000)}</p>
                  <p className="text-xs text-red-500 mt-1">+1.9% minimum</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Key Factors Influencing Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Bullish Factors</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-xs text-gray-400 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        AI sector growth acceleration
                      </li>
                      <li className="text-xs text-gray-400 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Expected Fed rate cuts
                      </li>
                      <li className="text-xs text-gray-400 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Strong corporate earnings
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Bearish Factors</p>
                    <ul className="mt-2 space-y-1">
                      <li className="text-xs text-gray-400 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Geopolitical tensions
                      </li>
                      <li className="text-xs text-gray-400 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Consumer debt levels
                      </li>
                      <li className="text-xs text-gray-400 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        Valuation concerns in tech
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "signals" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketSignals.map((signal, index) => (
                <div key={index} className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">{signal.name}</h3>
                    <span className={`text-sm font-bold ${getSignalColor(signal.signal)}`}>
                      {signal.value}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{signal.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      signal.signal === 'buy' || signal.signal === 'bullish' ? 'bg-green-500/10 text-green-500' :
                      signal.signal === 'sell' || signal.signal === 'bearish' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {signal.signal.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-600">Updated {formatDate(new Date().toISOString())}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-[#0F2438] rounded-xl border border-gray-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Technical Analysis Summary</h3>
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Bullish Bias
                </span>
              </div>
              <p className="text-sm text-gray-300">
                Multiple technical indicators are showing bullish signals with strong volume confirmation. 
                The golden cross on the daily timeframe suggests continued upward momentum. RSI is in neutral 
                territory, leaving room for further upside. Key resistance at $48,500 for BTC, support at $45,200.
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-400">8 Bullish Signals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-400">2 Bearish Signals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-400">3 Neutral Signals</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600 flex items-center justify-center">
            <Shield className="w-3 h-3 mr-1" />
            AI insights are updated every 15 minutes. Last updated {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}