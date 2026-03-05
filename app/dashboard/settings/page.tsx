"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  CreditCard,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Save,
  Camera,
  ChevronRight,
  LogOut,
  Trash2,
  AlertTriangle,
  Download,
  RefreshCw,
  Clock,
  Palette,
  Languages,
  DollarSign,
  Percent,
  Users,
  Settings as SettingsIcon,
} from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  demo_balance: number;
  role: string;
  created_at: string;
  phone?: string | null;
  country?: string | null;
  timezone?: string | null;
  language?: string | null;
  two_factor_enabled?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  marketing_emails?: boolean;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface SecurityLog {
  id: string;
  event: string;
  ip: string;
  device: string;
  location: string;
  timestamp: string;
  status: "success" | "failed" | "pending";
}

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "notifications" | "preferences" | "api" | "billing"
  >("profile");

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "email_transactions",
      title: "Transaction Updates",
      description: "Get notified about deposits, withdrawals, and investments",
      enabled: true,
    },
    {
      id: "email_security",
      title: "Security Alerts",
      description: "Login alerts and security notifications",
      enabled: true,
    },
    {
      id: "email_marketing",
      title: "Marketing & Promotions",
      description: "News about new investment opportunities",
      enabled: false,
    },
    {
      id: "push_trades",
      title: "Trade Confirmations",
      description: "Push notifications for trade executions",
      enabled: true,
    },
    {
      id: "push_price",
      title: "Price Alerts",
      description: "Get notified when prices hit your targets",
      enabled: false,
    },
    {
      id: "push_insights",
      title: "AI Insights",
      description: "Daily AI market insights and recommendations",
      enabled: true,
    },
  ]);

  // Security logs
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    {
      id: "1",
      event: "Login successful",
      ip: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "success",
    },
    {
      id: "2",
      event: "Password changed",
      ip: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "success",
    },
    {
      id: "3",
      event: "Failed login attempt",
      ip: "85.123.45.67",
      device: "Firefox on Mac",
      location: "London, UK",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "failed",
    },
    {
      id: "4",
      event: "2FA enabled",
      ip: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "success",
    },
    {
      id: "5",
      event: "API key created",
      ip: "192.168.1.45",
      device: "Chrome on Windows",
      location: "New York, USA",
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: "success",
    },
  ]);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorQR, setTwoFactorQR] = useState("");

  // API keys
  const [apiKeys, setApiKeys] = useState<any[]>([
    {
      id: "1",
      name: "Trading Bot",
      key: "fk_live_8x7f9g3h2j1k5l6m7n8b9v0c",
      created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ["read", "trade"],
    },
    {
      id: "2",
      name: "Portfolio Tracker",
      key: "fk_test_2a4b6c8d0e1f3g5h7i9j1k3l",
      created: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ["read"],
    },
  ]);

  useEffect(() => {
    const fetchUserProfile = async () => {
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

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.error("Error fetching profile:", profileError);
        }

        const userProfile: UserProfile = {
          id: user.id,
          full_name:
            profile?.full_name || user.user_metadata?.full_name || null,
          email: user.email || "",
          avatar_url:
            profile?.avatar_url || user.user_metadata?.avatar_url || null,
          demo_balance: profile?.demo_balance || 100000,
          role: profile?.role || "Standard Account",
          created_at:
            profile?.created_at || user.created_at || new Date().toISOString(),
          phone: profile?.phone || null,
          country: profile?.country || "United States",
          timezone: profile?.timezone || "America/New_York",
          language: profile?.language || "en",
          two_factor_enabled: profile?.two_factor_enabled || false,
          email_notifications: profile?.email_notifications !== false,
          push_notifications: profile?.push_notifications !== false,
        };

        setProfile(userProfile);
        setFullName(userProfile.full_name || "");
        setPhone(userProfile.phone || "");
        setCountry(userProfile.country || "United States");
        setTimezone(userProfile.timezone || "America/New_York");
        setLanguage(userProfile.language || "en");
        setTwoFactorEnabled(userProfile.two_factor_enabled || false);

        setUser(user);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        phone: phone,
        country: country,
        timezone: timezone,
        language: language,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSuccess("Profile updated successfully!");

      // Update local profile
      setProfile((prev) =>
        prev
          ? { ...prev, full_name: fullName, phone, country, timezone, language }
          : null,
      );
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setError(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsChangingPassword(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      setError(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSaving(true);

      // Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile((prev) => (prev ? { ...prev, avatar_url: publicUrl } : null));
      setSuccess("Avatar updated successfully!");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setError(error.message || "Failed to upload avatar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationToggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  const saveNotificationSettings = async () => {
    setIsSaving(true);
    try {
      // Save to database
      const emailNotifications = notifications.find(
        (n) => n.id === "email_transactions",
      )?.enabled;
      const pushNotifications = notifications.find(
        (n) => n.id === "push_trades",
      )?.enabled;

      await supabase
        .from("profiles")
        .update({
          email_notifications: emailNotifications,
          push_notifications: pushNotifications,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      setSuccess("Notification settings saved!");
    } catch (error) {
      setError("Failed to save notification settings");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return profile?.email?.slice(0, 2).toUpperCase() || "U";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4c6fff]"></div>
          <p className="mt-4 text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-400"
              >
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
              <button
                onClick={() => setSuccess(null)}
                className="ml-auto text-green-500 hover:text-green-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-4 sticky top-20">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "profile"
                      ? "bg-gradient-to-r from-[#4c6fff]/20 to-[#4c6fff]/10 text-white border border-[#4c6fff]/30"
                      : "text-gray-400 hover:bg-[#4c6fff]/10 hover:text-white"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Profile Information
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "security"
                      ? "bg-gradient-to-r from-[#4c6fff]/20 to-[#4c6fff]/10 text-white border border-[#4c6fff]/30"
                      : "text-gray-400 hover:bg-[#4c6fff]/10 hover:text-white"
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">Security</span>
                </button>

                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "notifications"
                      ? "bg-gradient-to-r from-[#4c6fff]/20 to-[#4c6fff]/10 text-white border border-[#4c6fff]/30"
                      : "text-gray-400 hover:bg-[#4c6fff]/10 hover:text-white"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="text-sm font-medium">Notifications</span>
                </button>

                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "preferences"
                      ? "bg-gradient-to-r from-[#4c6fff]/20 to-[#4c6fff]/10 text-white border border-[#4c6fff]/30"
                      : "text-gray-400 hover:bg-[#4c6fff]/10 hover:text-white"
                  }`}
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Preferences</span>
                </button>

                <button
                  onClick={() => setActiveTab("api")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "api"
                      ? "bg-gradient-to-r from-[#4c6fff]/20 to-[#4c6fff]/10 text-white border border-[#4c6fff]/30"
                      : "text-gray-400 hover:bg-[#4c6fff]/10 hover:text-white"
                  }`}
                >
                  <Key className="w-5 h-5" />
                  <span className="text-sm font-medium">API Keys</span>
                </button>

                <button
                  onClick={() => setActiveTab("billing")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === "billing"
                      ? "bg-gradient-to-r from-[#4c6fff]/20 to-[#4c6fff]/10 text-white border border-[#4c6fff]/30"
                      : "text-gray-400 hover:bg-[#4c6fff]/10 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm font-medium">Billing</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <button
                  onClick={() => router.push("/logout")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6">
                  Profile Information
                </h2>

                {/* Avatar Section */}
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-[#4c6fff] bg-gradient-to-br from-[#4c6fff] to-[#4c6fff]/80 flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-white">
                          {getInitials()}
                        </span>
                      )}
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-[#4c6fff] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4c6fff]/80 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      {profile?.full_name || "Update your name"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Member since{" "}
                      {new Date(profile?.created_at || "").toLocaleDateString()}
                    </p>
                    <p className="text-xs text-[#4c6fff] mt-2">
                      {profile?.role}
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="w-full px-4 py-3 bg-[#0F2438]/50 border border-gray-800 rounded-xl text-gray-400 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                      >
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Australia</option>
                        <option>Germany</option>
                        <option>France</option>
                        <option>Japan</option>
                        <option>Singapore</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Change Password */}
                <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Change Password
                  </h2>

                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleChangePassword}
                        disabled={
                          isChangingPassword ||
                          !currentPassword ||
                          !newPassword ||
                          !confirmPassword
                        }
                        className="px-6 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isChangingPassword ? (
                          <span className="flex items-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Changing...
                          </span>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Two-Factor Authentication
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button
                      onClick={() => setShow2FAModal(true)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium ${
                        twoFactorEnabled
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-[#4c6fff]/10 text-[#4c6fff] border border-[#4c6fff]/20 hover:bg-[#4c6fff]/20"
                      }`}
                    >
                      {twoFactorEnabled ? "Enabled" : "Enable 2FA"}
                    </button>
                  </div>

                  <div className="bg-[#0F2438] rounded-xl p-4 border border-gray-800">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-[#4c6fff] mt-0.5" />
                      <div>
                        <h4 className="text-white text-sm font-medium">
                          Why enable 2FA?
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Two-factor authentication adds an additional layer of
                          security to your account by requiring more than just a
                          password to sign in. We recommend all users enable
                          this feature.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Recent Security Activity
                  </h2>

                  <div className="space-y-4">
                    {securityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start justify-between p-3 bg-[#0F2438] rounded-lg border border-gray-800"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              log.status === "success"
                                ? "bg-green-500/10"
                                : log.status === "failed"
                                  ? "bg-red-500/10"
                                  : "bg-yellow-500/10"
                            }`}
                          >
                            {log.status === "success" ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : log.status === "failed" ? (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-white">{log.event}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {log.ip} • {log.device} • {log.location}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button className="mt-4 text-sm text-[#4c6fff] hover:text-white transition-colors flex items-center">
                    View all activity
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-white font-medium mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-[#4c6fff]" />
                      Email Notifications
                    </h3>
                    <div className="space-y-4">
                      {notifications
                        .filter((n) => n.id.startsWith("email"))
                        .map((setting) => (
                          <div
                            key={setting.id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="text-white text-sm">
                                {setting.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {setting.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={setting.enabled}
                                onChange={() =>
                                  handleNotificationToggle(setting.id)
                                }
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4c6fff]"></div>
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="pt-4 border-t border-gray-800">
                    <h3 className="text-white font-medium mb-4 flex items-center">
                      <Smartphone className="w-5 h-5 mr-2 text-[#4c6fff]" />
                      Push Notifications
                    </h3>
                    <div className="space-y-4">
                      {notifications
                        .filter((n) => n.id.startsWith("push"))
                        .map((setting) => (
                          <div
                            key={setting.id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="text-white text-sm">
                                {setting.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {setting.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={setting.enabled}
                                onChange={() =>
                                  handleNotificationToggle(setting.id)
                                }
                              />
                              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4c6fff]"></div>
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={saveNotificationSettings}
                      disabled={isSaving}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Preferences</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
                <h2 className="text-xl font-bold text-white mb-6">
                  Preferences
                </h2>

                <div className="space-y-6">
                  {/* Language */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                        <Languages className="w-4 h-4 mr-2" />
                        Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                      >
                        <option value="America/New_York">
                          Eastern Time (ET)
                        </option>
                        <option value="America/Chicago">
                          Central Time (CT)
                        </option>
                        <option value="America/Denver">
                          Mountain Time (MT)
                        </option>
                        <option value="America/Los_Angeles">
                          Pacific Time (PT)
                        </option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                        <option value="Asia/Singapore">Singapore (SGT)</option>
                        <option value="Australia/Sydney">Sydney (AEDT)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Display Currency
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="SGD">SGD (S$)</option>
                        <option value="AUD">AUD (A$)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
                        <Palette className="w-4 h-4 mr-2" />
                        Theme
                      </label>
                      <select className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#4c6fff] transition-colors">
                        <option>Dark (Default)</option>
                        <option>Light</option>
                        <option>System</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Preferences</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === "api" && (
              <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">API Keys</h2>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-lg text-sm hover:opacity-90 transition-opacity">
                    + Generate New Key
                  </button>
                </div>

                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="bg-[#0F2438] rounded-xl border border-gray-800 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-white font-medium">{key.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Created {formatDate(key.created)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-[#4c6fff]/10 text-[#4c6fff] rounded-full text-xs">
                            {key.permissions.join(", ")}
                          </span>
                          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-[#0A0F1E] p-3 rounded-lg border border-gray-800">
                        <code className="text-xs text-gray-400 font-mono break-all">
                          {key.key}
                        </code>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Last used: {formatDate(key.lastUsed)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="text-yellow-500 text-sm font-medium">
                        Security Notice
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        API keys provide full access to your account. Keep them
                        secure and never share them publicly. Regenerate keys
                        immediately if you suspect they've been compromised.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Subscription Plan
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#0F2438] rounded-xl border border-gray-800 p-4">
                      <p className="text-gray-400 text-sm">Current Plan</p>
                      <p className="text-xl font-bold text-white mt-1">
                        Standard
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Free tier • Basic features
                      </p>
                    </div>

                    <div className="bg-[#0F2438] rounded-xl border border-gray-800 p-4">
                      <p className="text-gray-400 text-sm">Billing Cycle</p>
                      <p className="text-xl font-bold text-white mt-1">
                        Monthly
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Renews on Apr 1, 2026
                      </p>
                    </div>

                    <div className="bg-[#0F2438] rounded-xl border border-gray-800 p-4">
                      <p className="text-gray-400 text-sm">Next Invoice</p>
                      <p className="text-xl font-bold text-white mt-1">$0.00</p>
                      <p className="text-xs text-gray-500 mt-2">
                        No upcoming charges
                      </p>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-xl hover:opacity-90 transition-opacity">
                    Upgrade Plan
                  </button>
                </div>

                <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Payment Methods
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#0F2438] rounded-xl border border-gray-800">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-[#4c6fff]/10 rounded-lg">
                          <CreditCard className="w-5 h-5 text-[#4c6fff]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            Visa •••• 4242
                          </p>
                          <p className="text-xs text-gray-500">Expires 12/26</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs">
                        Default
                      </span>
                    </div>

                    <button className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-[#4c6fff] transition-colors">
                      + Add Payment Method
                    </button>
                  </div>
                </div>

                <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-xl font-bold text-white mb-6">
                    Billing History
                  </h2>

                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-[#0F2438] rounded-lg border border-gray-800"
                      >
                        <div className="flex items-center space-x-3">
                          <Download className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm text-white">
                              Invoice #{new Date().getFullYear()}-00{i}
                            </p>
                            <p className="text-xs text-gray-500">
                              March {i}, 2026
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-white">$0.00</span>
                          <button className="text-xs text-[#4c6fff] hover:text-white">
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0B1C2D] rounded-2xl border border-gray-800 max-w-md w-full">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Enable Two-Factor Authentication
              </h3>
              <button
                onClick={() => setShow2FAModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-[#0F2438] rounded-lg border border-gray-800 flex items-center justify-center mb-4">
                   {/* In the 2FA modal */}
                  <QRCodeCanvas
                    value="otpauth://totp/Fluxhold:user@example.com?secret=YOUR_SECRET&issuer=Fluxhold"
                    size={128}
                  />
                </div>
                <p className="text-sm text-gray-400">
                  Scan this QR code with your authenticator app (Google
                  Authenticator, Authy, etc.)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Enter 6-digit code
                </label>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-[#0F2438] border border-gray-800 rounded-xl text-white text-center text-2xl tracking-widest focus:outline-none focus:border-[#4c6fff] transition-colors"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShow2FAModal(false)}
                  className="flex-1 py-3 bg-[#0F2438] border border-gray-800 text-white rounded-xl hover:border-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTwoFactorEnabled(true);
                    setShow2FAModal(false);
                    setSuccess("Two-factor authentication enabled!");
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-[#4c6fff] to-[#4c6fff]/80 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
}
