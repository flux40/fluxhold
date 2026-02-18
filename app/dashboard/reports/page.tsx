"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  PieChart,
  BarChart3,
  LineChart,
  Activity,
  CreditCard,
  Wallet,
  Share2,
  Printer,
  Eye,
  FileBarChart,
  FileSpreadsheet,
  FilePieChart,
  Award,
  Sparkles,
  Info,
} from "lucide-react";
import Link from "next/link";
import { format, subDays, subMonths, subYears, startOfYear, endOfYear } from "date-fns";

interface Report {
  id: string;
  title: string;
  description: string;
  type: "portfolio" | "tax" | "performance" | "transaction" | "investment" | "dividend" | "capital-gains";
  period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "custom";
  date: string;
  size: string;
  format: "pdf" | "csv" | "xlsx";
  url: string;
  isNew?: boolean;
  isGenerated?: boolean;
}

interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: any;
  type: string;
  popular: boolean;
  color: string;
}

interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  returnPercentage: number;
  dailyChange: number;
  dailyChangePercentage: number;
  assets: number;
  activeInvestments: number;
}

interface PerformanceData {
  month: string;
  value: number;
  return: number;
}

interface AssetAllocation {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"reports" | "templates" | "scheduled">("reports");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Portfolio summary data
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary>({
    totalValue: 284567.89,
    totalInvested: 250000.00,
    totalReturn: 34567.89,
    returnPercentage: 13.83,
    dailyChange: 1234.56,
    dailyChangePercentage: 0.44,
    assets: 12,
    activeInvestments: 8
  });

  // Performance chart data
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([
    { month: "Jan", value: 245000, return: 2.1 },
    { month: "Feb", value: 251000, return: 2.4 },
    { month: "Mar", value: 258000, return: 2.8 },
    { month: "Apr", value: 262000, return: 1.6 },
    { month: "May", value: 259000, return: -1.1 },
    { month: "Jun", value: 267000, return: 3.1 },
    { month: "Jul", value: 271000, return: 1.5 },
    { month: "Aug", value: 275000, return: 1.5 },
    { month: "Sep", value: 278000, return: 1.1 },
    { month: "Oct", value: 281000, return: 1.1 },
    { month: "Nov", value: 283000, return: 0.7 },
    { month: "Dec", value: 284568, return: 0.6 },
  ]);

  // Asset allocation data
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocation[]>([
    { category: "Stocks", value: 124500, percentage: 43.7, color: "#4c6fff" },
    { category: "Bonds", value: 56800, percentage: 20.0, color: "#4C6FFF" },
    { category: "Real Estate", value: 48500, percentage: 17.0, color: "#0EF2C2" },
    { category: "Crypto", value: 35200, percentage: 12.4, color: "#8B5CF6" },
    { category: "Cash", value: 19568, percentage: 6.9, color: "#10B981" },
  ]);

  // Reports data
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      title: "Portfolio Summary - February 2026",
      description: "Complete overview of your investment portfolio performance and allocation",
      type: "portfolio",
      period: "monthly",
      date: "2026-02-28T10:30:00Z",
      size: "2.4 MB",
      format: "pdf",
      url: "#",
      isNew: true,
      isGenerated: true
    },
    {
      id: "2",
      title: "Tax Statement 2025",
      description: "Annual tax report with capital gains, losses, and dividend income",
      type: "tax",
      period: "yearly",
      date: "2026-01-15T14:20:00Z",
      size: "1.8 MB",
      format: "pdf",
      url: "#",
      isGenerated: true
    },
    {
      id: "3",
      title: "Q1 2026 Performance Report",
      description: "Quarterly performance analysis with benchmark comparisons",
      type: "performance",
      period: "quarterly",
      date: "2026-01-05T09:15:00Z",
      size: "3.2 MB",
      format: "pdf",
      url: "#",
      isGenerated: true
    },
    {
      id: "4",
      title: "Transaction History - February 2026",
      description: "Detailed list of all deposits, withdrawals, and investments",
      type: "transaction",
      period: "monthly",
      date: "2026-02-28T23:59:00Z",
      size: "1.1 MB",
      format: "csv",
      url: "#",
      isGenerated: true
    },
    {
      id: "5",
      title: "Investment Performance Report",
      description: "Detailed analysis of each investment's performance and ROI",
      type: "investment",
      period: "monthly",
      date: "2026-02-28T11:45:00Z",
      size: "2.9 MB",
      format: "pdf",
      url: "#",
      isNew: true,
      isGenerated: true
    },
    {
      id: "6",
      title: "Dividend Income Report 2026",
      description: "Summary of dividend payments received this year",
      type: "dividend",
      period: "yearly",
      date: "2026-02-01T08:30:00Z",
      size: "856 KB",
      format: "pdf",
      url: "#",
      isGenerated: true
    },
    {
      id: "7",
      title: "Capital Gains Report - February 2026",
      description: "Realized and unrealized capital gains summary",
      type: "capital-gains",
      period: "monthly",
      date: "2026-02-28T16:20:00Z",
      size: "1.3 MB",
      format: "pdf",
      url: "#",
      isGenerated: true
    },
    {
      id: "8",
      title: "Portfolio Allocation Report",
      description: "Current asset allocation and diversification analysis",
      type: "portfolio",
      period: "weekly",
      date: "2026-02-25T13:10:00Z",
      size: "1.7 MB",
      format: "pdf",
      url: "#",
      isGenerated: true
    }
  ]);

  // Report templates
  const [templates, setTemplates] = useState<ReportTemplate[]>([
    {
      id: "1",
      title: "Portfolio Performance",
      description: "Comprehensive portfolio performance report with returns and benchmarks",
      icon: BarChart3,
      type: "performance",
      popular: true,
      color: "#4c6fff"
    },
    {
      id: "2",
      title: "Tax Statement",
      description: "Annual tax report prepared for filing purposes",
      icon: FileBarChart,
      type: "tax",
      popular: true,
      color: "#4C6FFF"
    },
    {
      id: "3",
      title: "Transaction History",
      description: "Detailed transaction log with filters and categories",
      icon: FileSpreadsheet,
      type: "transaction",
      popular: false,
      color: "#0EF2C2"
    },
    {
      id: "4",
      title: "Investment Summary",
      description: "Breakdown of each investment's performance and metrics",
      icon: FilePieChart,
      type: "investment",
      popular: true,
      color: "#8B5CF6"
    },
    {
      id: "5",
      title: "Dividend Tracker",
      description: "Dividend income history and projected payments",
      icon: DollarSign,
      type: "dividend",
      popular: false,
      color: "#10B981"
    },
    {
      id: "6",
      title: "Capital Gains",
      description: "Realized and unrealized gains/losses report",
      icon: TrendingUp,
      type: "capital-gains",
      popular: false,
      color: "#EF4444"
    },
    {
      id: "7",
      title: "Asset Allocation",
      description: "Current portfolio diversification analysis",
      icon: PieChart,
      type: "portfolio",
      popular: true,
      color: "#F59E0B"
    },
    {
      id: "8",
      title: "Risk Assessment",
      description: "Portfolio risk metrics and volatility analysis",
      icon: Activity,
      type: "performance",
      popular: false,
      color: "#6B7280"
    }
  ]);

  // Scheduled reports
  const [scheduledReports, setScheduledReports] = useState<any[]>([
    {
      id: "1",
      name: "Monthly Portfolio Summary",
      frequency: "Monthly",
      nextDelivery: "2026-03-01T09:00:00Z",
      format: "PDF",
      recipients: ["you@example.com"],
      active: true
    },
    {
      id: "2",
      name: "Weekly Transaction Report",
      frequency: "Weekly",
      nextDelivery: "2026-03-04T09:00:00Z",
      format: "CSV",
      recipients: ["you@example.com"],
      active: true
    },
    {
      id: "3",
      name: "Quarterly Tax Statement",
      frequency: "Quarterly",
      nextDelivery: "2026-04-01T09:00:00Z",
      format: "PDF",
      recipients: ["you@example.com", "tax@example.com"],
      active: false
    }
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
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleGenerateReport = async (template: ReportTemplate) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: Report = {
        id: Date.now().toString(),
        title: `${template.title} - ${format(new Date(), "MMMM yyyy")}`,
        description: template.description,
        type: template.type as any,
        period: "monthly",
        date: new Date().toISOString(),
        size: "1.5 MB",
        format: "pdf",
        url: "#",
        isNew: true,
        isGenerated: true
      };
      
      setReports([newReport, ...reports]);
      setSuccess(`${template.title} report generated successfully!`);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = (report: Report) => {
    // In production, this would trigger a file download
    console.log("Downloading report:", report.id);
    setSuccess(`Downloading ${report.title}...`);
    setTimeout(() => setSuccess(null), 2000);
  };

  const handleScheduleReport = () => {
    setSuccess("Report scheduled successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const filteredReports = reports
    .filter(report => {
      if (selectedPeriod !== "all" && report.period !== selectedPeriod) return false;
      if (selectedType !== "all" && report.type !== selectedType) return false;
      if (searchTerm && !report.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !report.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (diffInDays === 1) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else if (diffInDays < 7) {
      return format(date, "EEEE, h:mm a");
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "portfolio": return PieChart;
      case "tax": return FileBarChart;
      case "performance": return LineChart;
      case "transaction": return FileSpreadsheet;
      case "investment": return TrendingUp;
      case "dividend": return DollarSign;
      case "capital-gains": return TrendingDown;
      default: return FileText;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "portfolio": return "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20";
      case "tax": return "text-[#4C6FFF] bg-[#4C6FFF]/10 border-[#4C6FFF]/20";
      case "performance": return "text-[#0EF2C2] bg-[#0EF2C2]/10 border-[#0EF2C2]/20";
      case "transaction": return "text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20";
      case "investment": return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
      case "dividend": return "text-[#4c6fff] bg-[#4c6fff]/10 border-[#4c6fff]/20";
      case "capital-gains": return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
      default: return "text-gray-400 bg-gray-800 border-gray-700";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf": return FileText;
      case "csv": return FileSpreadsheet;
      case "xlsx": return FileBarChart;
      default: return FileText;
    }
  };

  const ReportDetailModal = ({ report, onClose }: { report: Report | null; onClose: () => void }) => {
    if (!report) return null;
    
    const TypeIcon = getReportTypeIcon(report.type);
    const FormatIcon = getFormatIcon(report.format);
    const typeColorClass = getReportTypeColor(report.type);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${typeColorClass}`}>
                <TypeIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{report.title}</h3>
                <p className="text-sm text-gray-400">{report.type.replace("-", " ").toUpperCase()} Report</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <p className="text-gray-300">{report.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm mb-1">Generated</p>
                <p className="text-white font-medium">{formatDate(report.date)}</p>
              </div>
              <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm mb-1">Period</p>
                <p className="text-white font-medium capitalize">{report.period}</p>
              </div>
              <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm mb-1">Format</p>
                <div className="flex items-center space-x-2">
                  <FormatIcon className="w-4 h-4 text-gray-400" />
                  <p className="text-white font-medium uppercase">{report.format}</p>
                </div>
              </div>
              <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-sm mb-1">File Size</p>
                <p className="text-white font-medium">{report.size}</p>
              </div>
            </div>
            
            <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
              <h4 className="text-white font-medium mb-3">Report Preview</h4>
              <div className="bg-[#0A0F1E] rounded-lg p-4 border border-gray-800">
                <div className="flex items-center justify-center h-40">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Preview not available</p>
                    <p className="text-gray-600 text-xs mt-1">Download to view full report</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  handleDownloadReport(report);
                  onClose();
                }}
                className="flex-1 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-[#0F2438] border border-gray-800 text-white rounded-xl hover:border-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0EF2C2]"></div>
          <p className="mt-4 text-gray-400">Loading reports...</p>
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
            <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl animate-slide-in">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-500">{success}</p>
              <button onClick={() => setSuccess(null)} className="ml-auto text-green-500 hover:text-green-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
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

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(portfolioSummary.totalValue)}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs flex items-center ${
                    portfolioSummary.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {portfolioSummary.dailyChange >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {formatPercent(portfolioSummary.dailyChangePercentage)}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">Today</span>
                </div>
              </div>
              <div className="p-3 bg-[#4c6fff]/10 rounded-lg">
                <Wallet className="w-6 h-6 text-[#4c6fff]" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Return</p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  {formatCurrency(portfolioSummary.totalReturn)}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-green-500 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {formatPercent(portfolioSummary.returnPercentage)}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">All time</span>
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Investments</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {portfolioSummary.activeInvestments}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Across {portfolioSummary.assets} assets
                </p>
              </div>
              <div className="p-3 bg-[#0EF2C2]/10 rounded-lg">
                <PieChart className="w-6 h-6 text-[#0EF2C2]" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Available Reports</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {reports.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {reports.filter(r => r.isNew).length} new this month
                </p>
              </div>
              <div className="p-3 bg-[#4C6FFF]/10 rounded-lg">
                <FileText className="w-6 h-6 text-[#4C6FFF]" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("reports")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "reports"
                  ? "text-[#4c6fff] border-b-2 border-[#4c6fff]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              My Reports
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "templates"
                  ? "text-[#4c6fff] border-b-2 border-[#4c6fff]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Report Templates
            </button>
            <button
              onClick={() => setActiveTab("scheduled")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "scheduled"
                  ? "text-[#4c6fff] border-b-2 border-[#4c6fff]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Scheduled Reports
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && activeTab === "reports" && (
          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4 mb-6 animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Filter Reports</h3>
              <button
                onClick={() => {
                  setSelectedPeriod("all");
                  setSelectedType("all");
                  setSearchTerm("");
                }}
                className="text-sm text-[#4c6fff] hover:text-[#4c6fff]/80"
              >
                Clear Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                >
                  <option value="all">All Periods</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Report Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="performance">Performance</option>
                  <option value="transaction">Transaction</option>
                  <option value="investment">Investment</option>
                  <option value="dividend">Dividend</option>
                  <option value="tax">Tax</option>
                  <option value="capital-gains">Capital Gains</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4c6fff] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => {
                const TypeIcon = getReportTypeIcon(report.type);
                const FormatIcon = getFormatIcon(report.format);
                const typeColorClass = getReportTypeColor(report.type);
                
                return (
                  <div
                    key={report.id}
                    className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-6 hover:border-[#4c6fff]/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedReport(report);
                      setShowReportModal(true);
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${typeColorClass}`}>
                          <TypeIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-bold text-white">{report.title}</h3>
                            {report.isNew && (
                              <span className="px-2 py-0.5 bg-[#4c6fff]/10 text-[#4c6fff] rounded-full text-xs font-medium border border-[#4c6fff]/20">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{report.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span>{formatDate(report.date)}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              <span className="capitalize">{report.period}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <FormatIcon className="w-3 h-3 mr-1" />
                              <span className="uppercase">{report.format}</span>
                            </div>
                            <span className="text-xs text-gray-500">{report.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadReport(report);
                          }}
                          className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                            setShowReportModal(true);
                          }}
                          className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Share functionality
                          }}
                          className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-[#4c6fff]/10 flex items-center justify-center mb-4">
                    <FileText className="w-10 h-10 text-[#4c6fff]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No reports found</h3>
                  <p className="text-gray-400 mb-6 max-w-md">
                    Try adjusting your filters or generate a new report from the templates section.
                  </p>
                  <button
                    onClick={() => setActiveTab("templates")}
                    className="px-6 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Browse Templates
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "templates" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => {
              const Icon = template.icon;
              
              return (
                <div
                  key={template.id}
                  className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-6 hover:border-[#4c6fff]/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${template.color}10` }}>
                      <Icon className="w-6 h-6" style={{ color: template.color }} />
                    </div>
                    {template.popular && (
                      <span className="px-2 py-1 bg-[#4c6fff]/10 text-[#4c6fff] rounded-full text-xs font-medium flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Popular
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{template.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize">{template.type.replace("-", " ")}</span>
                    <button
                      onClick={() => handleGenerateReport(template)}
                      disabled={isGenerating}
                      className="px-4 py-2 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "scheduled" && (
          <div className="space-y-4">
            <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Scheduled Reports</h3>
                <button
                  onClick={handleScheduleReport}
                  className="px-4 py-2 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Schedule New Report
                </button>
              </div>
              
              {scheduledReports.length > 0 ? (
                <div className="space-y-4">
                  {scheduledReports.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 bg-[#0F2438] rounded-lg border border-gray-800"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-[#4c6fff]/10 rounded-lg">
                          <Clock className="w-5 h-5 text-[#4c6fff]" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{schedule.name}</h4>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-xs text-gray-400">{schedule.frequency}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="text-xs text-gray-400">Next: {formatDate(schedule.nextDelivery)}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="text-xs text-gray-400 uppercase">{schedule.format}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          schedule.active
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                        }`}>
                          {schedule.active ? 'Active' : 'Paused'}
                        </span>
                        <button className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No scheduled reports</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => {
          setShowReportModal(false);
          setSelectedReport(null);
        }}
      />
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
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
        
        @keyframes slideDown {
          from {
            transform: translateY(-10%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}