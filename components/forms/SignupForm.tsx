"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Country list (truncated - add all from your list)
const countries = [
  "Armenia",
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "India",
  "Japan",
  "United Kingdom",
  "United States of America",
  "Russia",
  "South Africa",
  "Nigeria",
];

const employmentStatuses = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Self-employed",
  "Unemployed",
];
const industries = [
  "Unemployed",
  "Healthcare",
  "Retail",
  "Technology",
  "Food service",
  "Construction",
  "Education",
  "Finance",
  "Manufacturing",
  "Transportation",
  "Hospitality",
  "Administration",
  "Customer service",
  "Sales",
  "Engineering",
  "Warehouse",
  "Security",
  "Information technology",
  "Human resources",
  "Accounting",
  "Marketing",
];
const salaryRanges = [
  "Below $30,000",
  "$30,000 - $50,000",
  "$50,000 - $75,000",
  "$75,000 - $100,000",
  "Above $100,000",
];
const genders = ["Male", "Female", "Other", "Prefer not to say"];
const dependents = ["Yes", "No"];

export default function SignupForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    gender: "",
    country: "Armenia",
    address: "",
    mobile: "",
    employmentStatus: "Full-time",
    industry: "Unemployed",
    salary: "Below $30,000",
    dependents: "Yes",
    reflink: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Phone number is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      console.log("=== Starting signup process ===");

      // Step 1: Check if email already exists in profiles
      console.log("Checking if email exists:", formData.email);
      const { data: existingUser, error: checkError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", formData.email)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 = "no rows found"
        console.warn("Email check warning:", checkError);
      }

      if (existingUser) {
        setServerError("An account with this email already exists");
        setIsLoading(false);
        return;
      }

      // Step 2: Create auth user
      console.log("Creating auth user...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.mobile,
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error("User creation failed - no user data returned");
      }

      console.log("✅ Auth user created:", {
        id: authData.user.id,
        email: authData.user.email,
        metadata: authData.user.user_metadata,
      });

      // Step 3: Wait a moment for session
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 4: Insert profile in DB (RLS-safe)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          },
        },
      });
      
      if (error) throw error;
      

      console.log("✅ Profile created successfully");

      // Step 5: Auto-login
      // Step 5: Redirect to login after successful signup
      setSuccessMessage(
        "🎉 Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error: any) {
      console.error("❌ Signup error:", error);
      setServerError(
        error.message || "An error occurred during signup. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-dark dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8 lg:p-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Start investing in 5 minutes or less.
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create your free demo account with $25,000 virtual funds
        </p>
      </div>

      {/* Messages */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-800 dark:text-red-200">{serverError}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-green-800 dark:text-green-200">{successMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.full_name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all`}
              placeholder="John Doe"
              required
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all`}
              placeholder="john@example.com"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.gender
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all`}
              required
            >
              <option value="">Select Gender</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all"
              required
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleChange("mobile", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.mobile
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all`}
              placeholder="+1 (555) 123-4567"
              required
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Sensitive Information Notice */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">Note:</span> The following
              information helps us create your personalized investment plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employment Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.employmentStatus}
                onChange={(e) =>
                  handleChange("employmentStatus", e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all"
              >
                {employmentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salary Range <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all"
              >
                {salaryRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            {/* Dependents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Financial Dependents <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.dependents}
                onChange={(e) => handleChange("dependents", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all"
              >
                {dependents.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Referral Code (Optional)
          </label>
          <input
            type="text"
            value={formData.reflink}
            onChange={(e) => handleChange("reflink", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all"
            placeholder="Enter referral code if you have one"
          />
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all`}
              placeholder="Minimum 6 characters"
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800 focus:border-[#0EF2C2] focus:ring-2 focus:ring-[#0EF2C2]/20 transition-all`}
              placeholder="Re-enter password"
              required
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Your data is securely stored with encryption. We won't spam you, and
            we will never sell your personal information. By creating an
            account, you agree to our terms and privacy policy.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#4C6FFF] to-[#0EF2C2] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#4C6FFF]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <Link
            href="/login"
            className="text-[#4C6FFF] dark:text-[#0EF2C2] hover:text-[#0EF2C2] dark:hover:text-white transition-colors font-medium"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
