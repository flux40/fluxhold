"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Users,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Info,
  X,
  TrendingUp,
  Wallet,
  Plus,
  UserPlus,
  Copy,
  ChevronRight,
  BarChart3,
  Globe,
  Building,
  Sparkles,
  Target,
  Calendar,
  Percent,
  DollarSign,
  Link2,
  Send,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface JointInvestment {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  minInvestment: number;
  totalValue: number;
  investedAmount: number;
  participants: number;
  maxParticipants: number;
  roi: number;
  duration: string;
  risk: "Low" | "Medium" | "High";
  status: "Open" | "Closed" | "Filled";
  endDate: string;
  features: string[];
}

interface UserInvestment {
  id: string;
  investmentId: string;
  investmentName: string;
  amount: number;
  shares: number;
  joinedAt: string;
  status: "active" | "pending" | "completed";
  returns: number;
}

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: JointInvestment | null;
  userBalance: number;
  onJoin: (investmentId: string, amount: number) => Promise<void>;
}

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
}

export default function JointInvestmentsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"discover" | "my-investments">("discover");
  const [selectedInvestment, setSelectedInvestment] = useState<JointInvestment | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // User's investments
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
  
  // Available joint investments
  const [investments, setInvestments] = useState<JointInvestment[]>([
    {
      id: "1",
      name: "Green Energy Solar Farm",
      description: "Co-invest in a large-scale solar farm project with guaranteed power purchase agreements.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop",
      category: "Renewable Energy",
      minInvestment: 5000,
      totalValue: 5000000,
      investedAmount: 3750000,
      participants: 124,
      maxParticipants: 200,
      roi: 12.5,
      duration: "24 months",
      risk: "Medium",
      status: "Open",
      endDate: "2026-06-30",
      features: ["Monthly payouts", "Tax benefits", "Secured assets"]
    },
    {
      id: "2",
      name: "Luxury Real Estate Development",
      description: "Joint investment in a premium residential complex in Miami's financial district.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop",
      category: "Real Estate",
      minInvestment: 10000,
      totalValue: 12000000,
      investedAmount: 8900000,
      participants: 89,
      maxParticipants: 150,
      roi: 15.2,
      duration: "36 months",
      risk: "Medium",
      status: "Open",
      endDate: "2026-04-15",
      features: ["Quarterly dividends", "Property appreciation", "Professional management"]
    },
    {
      id: "3",
      name: "AI Technology Fund",
      description: "Pooled investment in top AI startups and machine learning companies.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop",
      category: "Technology",
      minInvestment: 2500,
      totalValue: 8000000,
      investedAmount: 5200000,
      participants: 312,
      maxParticipants: 500,
      roi: 18.7,
      duration: "48 months",
      risk: "High",
      status: "Open",
      endDate: "2026-05-20",
      features: ["Diversified portfolio", "Expert management", "Early exit option"]
    },
    {
      id: "4",
      name: "Sustainable Agriculture",
      description: "Invest in organic farming and sustainable agriculture infrastructure.",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop",
      category: "Agriculture",
      minInvestment: 3000,
      totalValue: 3500000,
      investedAmount: 2100000,
      participants: 156,
      maxParticipants: 200,
      roi: 10.8,
      duration: "30 months",
      risk: "Low",
      status: "Open",
      endDate: "2026-07-10",
      features: ["ESG focused", "Monthly reports", "Insurance backed"]
    },
    {
      id: "5",
      name: "Blockchain Infrastructure",
      description: "Joint investment in blockchain node infrastructure and DeFi protocols.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop",
      category: "Cryptocurrency",
      minInvestment: 5000,
      totalValue: 6000000,
      investedAmount: 4800000,
      participants: 203,
      maxParticipants: 250,
      roi: 22.4,
      duration: "12 months",
      risk: "High",
      status: "Filled",
      endDate: "2026-02-28",
      features: ["Weekly rewards", "Staking yields", "Liquidity provision"]
    },
    {
      id: "6",
      name: "Healthcare Innovation",
      description: "Fund innovative healthcare startups and medical research facilities.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
      category: "Healthcare",
      minInvestment: 4000,
      totalValue: 9500000,
      investedAmount: 7100000,
      participants: 178,
      maxParticipants: 225,
      roi: 14.3,
      duration: "42 months",
      risk: "Medium",
      status: "Open",
      endDate: "2026-08-05",
      features: ["Impact investing", "FDA pipeline", "Royalty sharing"]
    }
  ]);

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

        // Fetch user profile with balance
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }

        const userBalance = profile?.demo_balance || 100000;
        
        setUser({
          ...user,
          profile,
        });
        setBalance(userBalance);
        
        // Fetch user's joint investments
        await fetchUserInvestments(user.id);
        
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndFetchData();
  }, [router]);

  const fetchUserInvestments = async (userId: string) => {
    try {
      // This would come from Supabase in production
      // For demo, we'll use mock data
      const mockInvestments: UserInvestment[] = [
        {
          id: "101",
          investmentId: "1",
          investmentName: "Green Energy Solar Farm",
          amount: 15000,
          shares: 15,
          joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          returns: 1250
        },
        {
          id: "102",
          investmentId: "3",
          investmentName: "AI Technology Fund",
          amount: 25000,
          shares: 25,
          joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          returns: 3200
        }
      ];
      
      setUserInvestments(mockInvestments);
    } catch (error) {
      console.error("Error fetching user investments:", error);
    }
  };

  const handleJoinInvestment = async (investmentId: string, amount: number) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Check if user has enough balance
      if (amount > balance) {
        throw new Error("Insufficient balance");
      }
      
      // Find the investment
      const investment = investments.find(i => i.id === investmentId);
      if (!investment) {
        throw new Error("Investment not found");
      }
      
      // Check minimum investment
      if (amount < investment.minInvestment) {
        throw new Error(`Minimum investment is $${investment.minInvestment.toLocaleString()}`);
      }
      
      // Calculate shares (assuming $1000 per share)
      const shares = amount / 1000;
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: user.id,
            type: "investment",
            amount: -amount, // Negative for investment
            description: `Joint Investment: ${investment.name}`,
            status: "completed",
            sender: user.id,
            recipient: investment.id,
            created_at: new Date().toISOString(),
            metadata: {
              investment_id: investmentId,
              investment_name: investment.name,
              shares: shares,
              expected_roi: investment.roi,
              duration: investment.duration
            }
          }
        ]);

      if (transactionError) throw transactionError;
      
      // Update user balance
      const newBalance = balance - amount;
      await supabase
        .from("profiles")
        .update({ demo_balance: newBalance })
        .eq("id", user.id);
      
      setBalance(newBalance);
      
      // Add to user investments
      const newInvestment: UserInvestment = {
        id: Date.now().toString(),
        investmentId,
        investmentName: investment.name,
        amount,
        shares,
        joinedAt: new Date().toISOString(),
        status: "active",
        returns: 0
      };
      
      setUserInvestments(prev => [newInvestment, ...prev]);
      
      // Update investment participant count
      setInvestments(prev => 
        prev.map(i => 
          i.id === investmentId 
            ? { 
                ...i, 
                participants: i.participants + 1,
                investedAmount: i.investedAmount + amount 
              }
            : i
        )
      );
      
      setSuccess(`Successfully invested $${amount.toLocaleString()} in ${investment.name}`);
      setShowJoinModal(false);
      
      // Switch to my investments tab
      setActiveTab("my-investments");
      
    } catch (error: any) {
      console.error("Error joining investment:", error);
      setError(error.message || "Failed to join investment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyLink = (investmentId: string) => {
    const link = `${window.location.origin}/dashboard/joint-investments?invite=${investmentId}`;
    navigator.clipboard.writeText(link);
    setCopied(investmentId);
    setTimeout(() => setCopied(null), 2000);
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
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProgressPercentage = (invested: number, total: number) => {
    return (invested / total) * 100;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "High": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium border border-green-500/20">Open</span>;
      case "Closed":
        return <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-medium border border-red-500/20">Closed</span>;
      case "Filled":
        return <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-medium border border-blue-500/20">Filled</span>;
      default:
        return null;
    }
  };

  const JoinModal = ({ isOpen, onClose, investment, userBalance, onJoin }: JoinModalProps) => {
    const [joinAmount, setJoinAmount] = useState<string>("");
    const [step, setStep] = useState<"amount" | "confirm">("amount");
    
    if (!isOpen || !investment) return null;
    
    const handleAmountSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setStep("confirm");
    };
    
    const handleConfirm = async () => {
      await onJoin(investment.id, parseInt(joinAmount));
      setStep("amount");
      setJoinAmount("");
    };
    
    const handleBack = () => {
      setStep("amount");
    };
    
    const isValidAmount = joinAmount && 
      parseInt(joinAmount) >= investment.minInvestment && 
      parseInt(joinAmount) <= userBalance;
    
    const formatJoinCurrency = (value: string) => {
      const number = value.replace(/[^\d]/g, "");
      if (!number) return "";
      return new Intl.NumberFormat("en-US").format(parseInt(number));
    };
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#4c6fff]/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#4c6fff]" />
              </div>
              <h3 className="text-xl font-bold text-white">Join Investment</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {step === "amount" ? (
              <form onSubmit={handleAmountSubmit} className="space-y-6">
                <div className="bg-[#0F2438] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-[#4c6fff]/20 flex items-center justify-center">
                      <span className="text-xl">{investment.image ? "🌱" : "💰"}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{investment.name}</h4>
                      <p className="text-sm text-gray-400">{investment.category}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Available Balance</span>
                    <span className="text-white font-bold">{formatCurrency(userBalance)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-400">Minimum Investment</span>
                    <span className="text-[#4c6fff] font-bold">{formatCurrency(investment.minInvestment)}</span>
                  </div>
                  
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Investment Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-400">$</span>
                    <input
                      type="text"
                      value={joinAmount ? formatJoinCurrency(joinAmount) : ""}
                      onChange={(e) => setJoinAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white text-2xl font-bold focus:outline-none focus:border-[#4c6fff] transition-colors"
                      autoFocus
                    />
                  </div>
                  
                  {joinAmount && parseInt(joinAmount) < investment.minInvestment && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Minimum investment is {formatCurrency(investment.minInvestment)}
                    </p>
                  )}
                  
                  {joinAmount && parseInt(joinAmount) > userBalance && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Insufficient balance
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {[investment.minInvestment, investment.minInvestment * 2, investment.minInvestment * 5, investment.minInvestment * 10].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setJoinAmount(preset.toString())}
                      disabled={preset > userBalance}
                      className="px-3 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-white text-sm hover:border-[#4c6fff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formatCurrency(preset)}
                    </button>
                  ))}
                </div>
                
                <button
                  type="submit"
                  disabled={!isValidAmount}
                  className="w-full py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Review
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="bg-[#0F2438] rounded-xl p-4 border border-gray-800">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">Investment</span>
                    <span className="text-white font-medium">{investment.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-white font-bold">{formatCurrency(parseInt(joinAmount))}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-400">Shares</span>
                    <span className="text-[#4c6fff] font-bold">{(parseInt(joinAmount) / 1000).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Expected ROI</span>
                    <span className="text-green-500 font-bold">{investment.roi}%</span>
                  </div>
                </div>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h5 className="text-yellow-500 font-medium">Please confirm</h5>
                      <p className="text-gray-400 text-sm mt-1">
                        By confirming, you agree to invest {formatCurrency(parseInt(joinAmount))} in {investment.name}. 
                        This investment has a {investment.risk.toLowerCase()} risk profile and a {investment.duration} duration.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleBack}
                    className="flex-1 py-3 bg-[#0F2438] border border-gray-800 text-white rounded-xl hover:border-gray-700 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="flex-1 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Confirm Investment"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CreateModal = ({ isOpen, onClose, onCreate }: CreateModalProps) => {
    const [step, setStep] = useState<"details" | "review">("details");
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      category: "Real Estate",
      minInvestment: 5000,
      targetAmount: 1000000,
      roi: 12,
      duration: "24 months",
      risk: "Medium" as "Low" | "Medium" | "High",
      maxParticipants: 100
    });
    
    if (!isOpen) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (step === "details") {
        setStep("review");
      } else {
        onCreate(formData);
      }
    };
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#4c6fff]/10 rounded-lg">
                <UserPlus className="w-5 h-5 text-[#4c6fff]" />
              </div>
              <h3 className="text-xl font-bold text-white">Create Joint Investment</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === "details" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Investment Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Green Energy Solar Farm"
                      className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your investment opportunity..."
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors resize-none"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                      >
                        <option>Real Estate</option>
                        <option>Renewable Energy</option>
                        <option>Technology</option>
                        <option>Healthcare</option>
                        <option>Agriculture</option>
                        <option>Cryptocurrency</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Risk Level
                      </label>
                      <select
                        value={formData.risk}
                        onChange={(e) => setFormData({ ...formData, risk: e.target.value as any })}
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Minimum Investment ($)
                      </label>
                      <input
                        type="number"
                        value={formData.minInvestment}
                        onChange={(e) => setFormData({ ...formData, minInvestment: parseInt(e.target.value) })}
                        min="100"
                        step="100"
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Target Amount ($)
                      </label>
                      <input
                        type="number"
                        value={formData.targetAmount}
                        onChange={(e) => setFormData({ ...formData, targetAmount: parseInt(e.target.value) })}
                        min="10000"
                        step="1000"
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Expected ROI (%)
                      </label>
                      <input
                        type="number"
                        value={formData.roi}
                        onChange={(e) => setFormData({ ...formData, roi: parseInt(e.target.value) })}
                        min="1"
                        max="100"
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Duration
                      </label>
                      <select
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                      >
                        <option>12 months</option>
                        <option>24 months</option>
                        <option>36 months</option>
                        <option>48 months</option>
                        <option>60 months</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                      min="10"
                      max="1000"
                      className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#0F2438] rounded-xl p-6 border border-gray-800">
                    <h4 className="text-white font-bold mb-4">Review Investment Details</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name</span>
                        <span className="text-white font-medium">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category</span>
                        <span className="text-white">{formData.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(formData.risk)}`}>
                          {formData.risk}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Minimum Investment</span>
                        <span className="text-white font-bold">{formatCurrency(formData.minInvestment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Amount</span>
                        <span className="text-white font-bold">{formatCurrency(formData.targetAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected ROI</span>
                        <span className="text-green-500 font-bold">{formData.roi}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration</span>
                        <span className="text-white">{formData.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Participants</span>
                        <span className="text-white">{formData.maxParticipants}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h5 className="text-blue-500 font-medium">Ready to launch</h5>
                        <p className="text-gray-400 text-sm mt-1">
                          Your investment opportunity will be visible to all investors. You can manage it from your dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="flex-1 py-3 bg-[#0F2438] border border-gray-800 text-white rounded-xl hover:border-gray-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Create Investment
                    </button>
                  </div>
                </div>
              )}
            </form>
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
          <p className="mt-4 text-gray-400">Loading joint investments...</p>
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
            <h1 className="text-2xl font-bold text-white">Joint Investments</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span>Create Investment</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">My Investments</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {userInvestments.length}
                </p>
              </div>
              <div className="p-3 bg-[#4c6fff]/10 rounded-lg">
                <Wallet className="w-6 h-6 text-[#4c6fff]" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Invested</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(userInvestments.reduce((sum, inv) => sum + inv.amount, 0))}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Returns</p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  {formatCurrency(userInvestments.reduce((sum, inv) => sum + inv.returns, 0))}
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
                <p className="text-gray-400 text-sm">Available Balance</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {formatCurrency(balance)}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Wallet className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
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
        
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-500">{success}</p>
              <button onClick={() => setSuccess(null)} className="ml-auto text-green-500 hover:text-green-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("discover")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "discover"
                  ? "text-[#4c6fff] border-b-2 border-[#4c6fff]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Discover Opportunities
            </button>
            <button
              onClick={() => setActiveTab("my-investments")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "my-investments"
                  ? "text-[#4c6fff] border-b-2 border-[#4c6fff]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              My Investments ({userInvestments.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "discover" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {investments.map((investment) => (
              <div
                key={investment.id}
                className="bg-[#0B1C2D] rounded-2xl border border-gray-800 overflow-hidden hover:border-[#4c6fff]/50 transition-colors"
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D] via-transparent to-transparent z-10"></div>
                  <img
                    src={investment.image}
                    alt={investment.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    {getStatusBadge(investment.status)}
                  </div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(investment.risk)}`}>
                      {investment.risk} Risk
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{investment.name}</h3>
                      <p className="text-sm text-gray-400">{investment.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {investment.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">
                          {formatCurrency(investment.investedAmount)} / {formatCurrency(investment.totalValue)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 h-2 rounded-full"
                          style={{ width: `${getProgressPercentage(investment.investedAmount, investment.totalValue)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs">Min Investment</p>
                        <p className="text-white font-bold">{formatCurrency(investment.minInvestment)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Participants</p>
                        <p className="text-white font-bold">{investment.participants}/{investment.maxParticipants}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Expected ROI</p>
                        <p className="text-green-500 font-bold">{investment.roi}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Duration</p>
                        <p className="text-white font-bold">{investment.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {investment.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#0F2438] rounded-lg text-xs text-gray-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Ends {formatDate(investment.endDate)}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCopyLink(investment.id)}
                          className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-[#4c6fff] hover:border-[#4c6fff] transition-colors"
                          title="Copy invite link"
                        >
                          {copied === investment.id ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Link2 className="w-4 h-4" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedInvestment(investment);
                            setShowJoinModal(true);
                          }}
                          disabled={investment.status !== "Open"}
                          className="px-4 py-2 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Join Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {userInvestments.length > 0 ? (
              userInvestments.map((investment) => {
                const fullInvestment = investments.find(i => i.id === investment.investmentId);
                return (
                  <div
                    key={investment.id}
                    className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-6 hover:border-[#4c6fff]/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-[#4c6fff]/20 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-[#4c6fff]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{investment.investmentName}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-sm text-gray-400">
                              Joined {formatDate(investment.joinedAt)}
                            </span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Invested</p>
                          <p className="text-white font-bold">{formatCurrency(investment.amount)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Shares</p>
                          <p className="text-[#4c6fff] font-bold">{investment.shares.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Returns</p>
                          <p className="text-green-500 font-bold">{formatCurrency(investment.returns)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">ROI</p>
                          <p className="text-green-500 font-bold">
                            {fullInvestment ? `${fullInvestment.roi}%` : '12.5%'}
                          </p>
                        </div>
                        <button className="p-2 bg-[#0F2438] border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors">
                          <ChevronRight className="w-5 h-5" />
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
                    <Users className="w-10 h-10 text-[#4c6fff]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No investments yet</h3>
                  <p className="text-gray-400 mb-6 max-w-md">
                    You haven't joined any joint investments yet. Discover opportunities and start co-investing with others.
                  </p>
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="px-6 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Discover Investments
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Modals */}
      <JoinModal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          setSelectedInvestment(null);
        }}
        investment={selectedInvestment}
        userBalance={balance}
        onJoin={handleJoinInvestment}
      />
      
      <CreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={async (data) => {
          // This would create a new investment in production
          console.log("Creating investment:", data);
          setShowCreateModal(false);
          setSuccess("Investment opportunity created successfully!");
        }}
      />
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}