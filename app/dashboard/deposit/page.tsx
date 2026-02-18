"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Copy,
  Wallet,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Bitcoin,
  Bell,
  BellRing,
  Loader2,
  Info,
  X,
  FileText,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DepositPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [step, setStep] = useState<
    "amount" | "payment" | "confirming" | "success"
  >("amount");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(1800);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showPendingNotification, setShowPendingNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // BTC Wallet Address
  const BTC_WALLET_ADDRESS = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
  const BTC_NETWORK_FEE = "0.0001 BTC";
  const PROCESSING_FEE_PERCENTAGE = 0.5;

  // Fetch user balance
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

  // Timer for payment confirmation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "confirming" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Simulate payment confirmation after 30 seconds (for demo)
  useEffect(() => {
    if (step === "confirming" && !paymentConfirmed && transactionId && user?.id) {
      const confirmationTimer = setTimeout(async () => {
        try {
          // Update transaction status to completed
          const { error: updateError } = await supabase
            .from("transactions")
            .update({
              status: "completed",
              description: `Bitcoin (BTC) Deposit - ${calculateBTCAmount(amount)} BTC (Confirmed)`,
            })
            .eq("id", transactionId);

          if (updateError) throw updateError;

          // Fetch updated balance
          const newBalance = await fetchUserBalance(user.id);
          setBalance(newBalance);
          
          setPaymentConfirmed(true);
          
          setTimeout(() => {
            setStep("success");
            setShowPendingNotification(false);
          }, 2000);
        } catch (error) {
          console.error("Error updating transaction:", error);
        }
      }, 30000);

      return () => clearTimeout(confirmationTimer);
    }
  }, [step, paymentConfirmed, transactionId, amount, user?.id]);

  // Auto-hide notification after 10 seconds
  useEffect(() => {
    if (showPendingNotification) {
      const notificationTimer = setTimeout(() => {
        setShowPendingNotification(false);
      }, 10000);

      return () => clearTimeout(notificationTimer);
    }
  }, [showPendingNotification]);

  // Check user and fetch balance on mount
  useEffect(() => {
    const checkUserAndFetchBalance = async () => {
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

        const userBalance = profile?.demo_balance || 264853.71;
        
        setUser({
          ...user,
          profile,
        });
        setBalance(userBalance);
        
      } catch (error) {
        console.error("Error checking user:", error);
        setError("Failed to authenticate user");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndFetchBalance();
  }, [router]);

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
    setError(null);
  };

  const handleBack = () => {
    if (step === "payment") setStep("amount");
    if (step === "confirming") setStep("payment");
    if (step === "success") {
      setStep("amount");
      setAmount("");
      setTransactionId(null);
      setPaymentConfirmed(false);
      setTimeLeft(1800);
      setShowPendingNotification(false);
      setNotificationDismissed(false);
      setError(null);
    }
  };

  const handleCopyAddress = (address: string, type: string) => {
    navigator.clipboard.writeText(address);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Create deposit transaction in Supabase
  const createDepositTransaction = async (
    amount: number,
    btcAmount: string,
    status: "pending" | "completed" = "pending"
  ) => {
    try {
      // Check if user is authenticated
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: user.id,
            type: "deposit",
            amount: amount,
            description: `Bitcoin (BTC) Deposit - ${btcAmount} BTC`,
            status: status,
            sender: "Bitcoin Network",
            recipient: BTC_WALLET_ADDRESS,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error creating deposit transaction:", error);
      throw error;
    }
  };

  // Handle payment started - creates transaction in Supabase
  const handlePaymentStarted = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const btcAmount = (parseInt(amount) * 0.000025).toFixed(8);
      const depositAmount = parseFloat(amount);

      // Create transaction in Supabase
      const transaction = await createDepositTransaction(
        depositAmount,
        btcAmount,
        "pending"
      );

      setTransactionId(transaction.id);
      setStep("confirming");
      setTimeLeft(1800);
      setShowPendingNotification(true);
      setNotificationDismissed(false);
      
    } catch (error: any) {
      console.error("Failed to initiate deposit:", error);
      setError(error.message || "Failed to initiate deposit. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const dismissNotification = () => {
    setShowPendingNotification(false);
    setNotificationDismissed(true);
  };

  const dismissError = () => {
    setError(null);
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^\d]/g, "");
    if (!number) return "";
    return new Intl.NumberFormat("en-US").format(parseInt(number));
  };

  const formatDisplayCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    if (value === "") {
      setAmount("");
    } else {
      setAmount(value);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateBTCAmount = (usdAmount: string) => {
    if (!usdAmount) return "0.00000000";
    return (parseInt(usdAmount) * 0.000025).toFixed(8);
  };

  const isValidAmount = amount && 
    parseInt(amount) >= 50 && 
    parseInt(amount) <= 50000;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0EF2C2]"></div>
          <p className="mt-4 text-gray-400">Loading deposit page...</p>
        </div>
      </div>
    );
  }

  const renderErrorNotification = () => {
    if (!error) return null;

    return (
      <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-slide-in">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-red-500/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h4 className="text-white font-medium">Error</h4>
            </div>
            <button
              onClick={dismissError}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-white mb-3">{error}</p>
            <button
              onClick={() => {
                dismissError();
                handlePaymentStarted();
              }}
              className="mt-3 w-full py-2 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPendingNotification = () => {
    if (!showPendingNotification) return null;

    return (
      <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-slide-in">
        <div className="bg-[#1A2C42] border border-[#4c6fff]/30 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#4c6fff]/20 to-transparent px-4 py-3 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <BellRing className="w-5 h-5 text-[#4c6fff] animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#4c6fff] rounded-full"></span>
              </div>
              <h4 className="text-white font-medium">Payment Pending</h4>
            </div>
            <button
              onClick={dismissNotification}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Loader2 className="w-8 h-8 text-[#4c6fff] animate-spin" />
                  <Bitcoin className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium mb-1">
                  Waiting for Bitcoin confirmation
                </p>
                <p className="text-sm text-gray-400 mb-2">
                  Your transaction has been detected. Waiting for 6 network
                  confirmations.
                </p>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-gray-500">Transaction:</span>
                  <span className="text-[#4c6fff] font-mono">
                    {transactionId?.slice(0, 8)}...{transactionId?.slice(-4)}
                  </span>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-800 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 h-1.5 rounded-full animate-pulse"
                      style={{ width: `${((1800 - timeLeft) / 1800) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F2438] px-4 py-3 flex items-center justify-between border-t border-gray-800">
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="w-3 h-3 mr-1" />
              <span>Est. 30 minutes</span>
            </div>
            <Link
              href={`/dashboard/transactions?id=${transactionId}`}
              className="text-xs text-[#4c6fff] hover:text-[#4c6fff]/80 transition-colors flex items-center"
            >
              View Transaction
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (step) {
      case "amount":
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-[#0EF2C2] text-black flex items-center justify-center font-bold">
                  1
                </span>
                <span className="ml-2 text-white">Amount</span>
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center">
                  2
                </span>
                <span className="ml-2 text-gray-500">Payment</span>
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center">
                  3
                </span>
                <span className="ml-2 text-gray-500">Confirm</span>
              </div>
            </div>

            <form onSubmit={handleAmountSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Deposit Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">
                    $
                  </span>
                  <input
                    type="text"
                    value={amount ? formatCurrency(amount) : ""}
                    onChange={handleAmountChange}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-4 bg-[#0F2438] border border-gray-800 rounded-xl text-white text-3xl font-bold focus:outline-none focus:border-[#4c6fff] transition-colors"
                    autoFocus
                  />
                </div>
                {amount && parseInt(amount) < 50 && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Minimum deposit: $50
                  </p>
                )}
                {amount && parseInt(amount) > 50000 && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Maximum deposit: $50,000
                  </p>
                )}
                {amount && parseInt(amount) >= 50 && parseInt(amount) <= 50000 && (
                  <p className="mt-2 text-sm text-green-500 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Valid amount
                  </p>
                )}
                {amount && parseInt(amount) >= 50 && parseInt(amount) <= 50000 && (
                  <p className="mt-2 text-sm text-gray-400">
                    You will send ≈ {calculateBTCAmount(amount)} BTC
                  </p>
                )}
              </div>

              <div className="bg-[#0B1C2D] rounded-xl border border-gray-800 p-4">
                <div className="flex items-start space-x-3">
                  <Bitcoin className="w-5 h-5 text-[#4c6fff] mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium">
                      Bitcoin (BTC) Deposit
                    </h4>
                    <p className="text-gray-400 text-sm">
                      You will receive a Bitcoin wallet address to send your
                      payment. Payments require 6 network confirmations (≈ 30
                      minutes).
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValidAmount}
                className="w-full py-4 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Bitcoin Payment
              </button>
            </form>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[100, 500, 1000, 5000, 10000, 25000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className="px-4 py-2 bg-[#0F2438] border border-gray-800 rounded-lg text-white hover:border-[#4c6fff] transition-colors"
                >
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        );

      case "payment":
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
                <span className="w-6 h-6 rounded-full bg-[#0EF2C2] text-black flex items-center justify-center font-bold">
                  1
                </span>
                <span className="ml-2 text-gray-500">Amount</span>
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-[#0EF2C2] text-black flex items-center justify-center font-bold">
                  2
                </span>
                <span className="ml-2 text-white">Payment</span>
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center">
                  3
                </span>
                <span className="ml-2 text-gray-500">Confirm</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#4c6fff]/10 to-[#4c6fff]/5 rounded-2xl border border-gray-800 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-[#4c6fff]/20 rounded-full">
                  <Bitcoin className="w-8 h-8 text-[#4c6fff]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Bitcoin (BTC) Payment
                  </h3>
                  <p className="text-gray-400">
                    Send Bitcoin to the address below
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-400 mb-2">
                    Bitcoin Wallet Address
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-4 bg-[#0F2438] border border-gray-800 rounded-xl text-white font-mono text-sm break-all">
                      {BTC_WALLET_ADDRESS}
                    </code>
                    <button
                      onClick={() =>
                        handleCopyAddress(BTC_WALLET_ADDRESS, "address")
                      }
                      className="p-4 bg-[#4c6fff]/10 hover:bg-[#4c6fff]/20 text-[#4c6fff] rounded-xl transition-colors"
                    >
                      {copied === "address" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                    <div className="text-sm text-gray-400 mb-1">USD Amount</div>
                    <div className="text-xl font-bold text-white">
                      ${parseInt(amount).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-[#0F2438] p-4 rounded-xl border border-gray-800">
                    <div className="text-sm text-gray-400 mb-1">BTC Amount</div>
                    <div className="text-xl font-bold text-[#4c6fff]">
                      {calculateBTCAmount(amount)} BTC
                    </div>
                  </div>
                </div>

                <div className="bg-[#0F2438] rounded-xl border border-gray-800 p-4">
                  <h4 className="text-white font-medium mb-3">
                    Transaction Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network Fee</span>
                      <span className="text-white">{BTC_NETWORK_FEE}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Processing Fee</span>
                      <span className="text-white">
                        {PROCESSING_FEE_PERCENTAGE}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Network</span>
                      <span className="text-white">Bitcoin (BTC)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Confirmation Time</span>
                      <span className="text-white">≈ 30 minutes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h5 className="text-red-500 font-medium">Important</h5>
                      <p className="text-gray-400 text-sm">
                        Send only Bitcoin (BTC) to this address. Sending any
                        other cryptocurrency will result in permanent loss of
                        funds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handlePaymentStarted}
              disabled={isProcessing || !isValidAmount}
              className="w-full py-4 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Bitcoin className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  I Have Sent Bitcoin
                </span>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              After sending, please wait 30 minutes for 6 network confirmations
            </p>
          </div>
        );

      case "confirming":
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
                <span className="w-6 h-6 rounded-full bg-[#0EF2C2] text-black flex items-center justify-center font-bold">
                  1
                </span>
                <span className="ml-2 text-gray-500">Amount</span>
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-[#0EF2C2] text-black flex items-center justify-center font-bold">
                  2
                </span>
                <span className="ml-2 text-gray-500">Payment</span>
              </div>
              <div className="w-8 h-px bg-gray-700"></div>
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-[#0EF2C2] text-black flex items-center justify-center font-bold">
                  3
                </span>
                <span className="ml-2 text-white">Confirming</span>
              </div>
            </div>

            <div className="text-center py-8">
              {!paymentConfirmed ? (
                <>
                  <div className="inline-block animate-pulse mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-gray-700"></div>
                      <div
                        className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-t-[#4c6fff] border-r-[#4c6fff] border-b-transparent border-l-transparent animate-spin"
                        style={{ animationDuration: "3s" }}
                      ></div>
                      <Bitcoin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#4c6fff]" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    Awaiting Bitcoin Confirmation
                  </h3>
                  <p className="text-gray-400 mb-4 max-w-md mx-auto">
                    We're waiting for 6 network confirmations on the Bitcoin
                    blockchain. This typically takes 30 minutes.
                  </p>

                  <div className="max-w-md mx-auto bg-[#0F2438] rounded-xl border border-gray-800 p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400">Time Remaining</span>
                      <span className="text-2xl font-bold text-[#4c6fff]">
                        {formatTime(timeLeft)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-800 rounded-full h-2.5 mb-4">
                      <div
                        className="bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 h-2.5 rounded-full transition-all duration-1000"
                        style={{
                          width: `${((1800 - timeLeft) / 1800) * 100}%`,
                        }}
                      ></div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">USD Amount</span>
                        <span className="text-white font-bold">
                          ${parseInt(amount).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">BTC Amount</span>
                        <span className="text-[#4c6fff] font-bold">
                          {calculateBTCAmount(amount)} BTC
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Transaction ID</span>
                        <span className="text-white font-mono text-sm">
                          {transactionId?.slice(0, 8)}...
                          {transactionId?.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confirmations</span>
                        <span className="text-yellow-500">0/6</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/transactions?id=${transactionId}`}
                    className="inline-flex items-center text-[#4c6fff] hover:text-[#4c6fff]/80 transition-colors"
                  >
                    View transaction details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </>
              ) : (
                <div className="py-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Bitcoin Payment Confirmed!
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Your deposit has been verified with 6 network confirmations.
                  </p>
                  <div className="animate-pulse text-[#4c6fff]">
                    Completing your deposit...
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Deposit Successful!
            </h3>
            <p className="text-gray-400 mb-6">
              Your Bitcoin deposit of ${parseInt(amount).toLocaleString()} has
              been confirmed and credited to your account.
            </p>

            <div className="max-w-md mx-auto bg-[#0F2438] rounded-xl border border-gray-800 p-6 mb-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-white font-mono text-sm">
                    {transactionId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white">
                    {new Date().toLocaleDateString("en-US", {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount</span>
                  <span className="text-white font-bold">
                    ${parseInt(amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">BTC Amount</span>
                  <span className="text-[#4c6fff] font-bold">
                    {calculateBTCAmount(amount)} BTC
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">New Balance</span>
                  <span className="text-white font-bold">
                    ${(balance + parseInt(amount)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                    Completed
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                  <span className="text-gray-400">Confirmations</span>
                  <span className="text-white font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    6/6
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-[#0F2438] border border-gray-800 text-white rounded-xl hover:border-[#4c6fff] transition-colors"
              >
                Return to Dashboard
              </Link>
              <Link
                href={`/dashboard/transactions?id=${transactionId}`}
                className="px-6 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Transaction Details
              </Link>
            </div>
            
            <div className="mt-4">
              <Link
                href="/dashboard/transactions"
                className="text-sm text-[#4c6fff] hover:text-[#4c6fff]/80 flex items-center justify-center"
              >
                View all transactions
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] relative">
      {/* Notifications */}
      {renderErrorNotification()}
      {renderPendingNotification()}

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Bitcoin Deposit</h1>
            <p className="text-gray-400">
              Deposit BTC to your investment account
            </p>
          </div>
          <div className="bg-[#0B1C2D] px-4 py-2 rounded-lg border border-gray-800">
            <div className="text-sm text-gray-400">Available Balance</div>
            <div className="text-xl font-bold text-white">
              ${formatDisplayCurrency(balance)}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6 md:p-8">
          {renderContent()}
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <Shield className="w-4 h-4 mr-1" />
            All transactions are encrypted and secured using Supabase PostgreSQL triggers.
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
  );
}