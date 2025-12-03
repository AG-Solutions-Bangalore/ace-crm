import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import BASE_URL from "@/config/BaseUrl";
import { motion } from "framer-motion";
import { ContextPanel } from "@/lib/ContextPanel";
import { Eye, EyeOff, LogIn, Globe, Shield, CreditCard, FileText, Users, BarChart, TrendingUp, Zap, Download, Database, Briefcase } from 'lucide-react';

export default function LoginAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchPagePermission, fetchPermissions } = useContext(ContextPanel);

  const loadingMessages = [
    "Setting up your dashboard...",
    "Verifying credentials...",
    "Loading your contacts...",
    "Preparing invoices...",
    "Almost there...",
  ];

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setFormVisible(true), 300);
    
    let index = 0;
    let intervalId;
    if (isLoading) {
      setLoadingMessage(loadingMessages[0]);
      intervalId = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 1000);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await axios.post(`${BASE_URL}/api/panel-login`, formData);

      if (res.status === 200) {
        if (!res.data.UserInfo || !res.data.UserInfo.token) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Login Failed: No token received.",
          });
          setIsLoading(false);
          return;
        }

        const { UserInfo, userN, company_detils } = res.data;

        localStorage.setItem("token", UserInfo.token);
        localStorage.setItem("allUsers", JSON.stringify(userN));
        localStorage.setItem("id", UserInfo.user.id);
        localStorage.setItem("name", UserInfo.user.name);
        localStorage.setItem("userType", UserInfo.user.user_type);
        localStorage.setItem("user_position", UserInfo.user.user_position);
        localStorage.setItem("companyID", UserInfo.user.company_id);
        localStorage.setItem("companyName", company_detils?.company_name);
        localStorage.setItem("branchId", UserInfo.user.branch_id);
        localStorage.setItem("email", UserInfo.user.email);
        localStorage.setItem("token-expire-time", UserInfo.token_expires_at);

        await fetchPermissions();
        await fetchPagePermission();

        navigate("/home");
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Login Failed: Unexpected response.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          error.response?.data?.error || error.response?.data?.message || "Please check your credentials.",
      });
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen items-center justify-center p-4 md:p-0">
        <motion.div 
          className="w-full max-w-6xl overflow-hidden rounded-b-2xl bg-white dark:bg-gray-800 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-row relative">

          <div className="absolute top-3 -right-6 z-10">
  <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white rounded-l-full shadow-xl px-10 py-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    <p className="text-sm font-semibold text-center">
      New to Export Biz?{" "}
     
    </p>
    <button 
        onClick={() => navigate("/signup")}
        className="font-extrabold hover:underline inline-flex items-center"
      >
        Start Free Trial →
      </button>
  </div>
</div>























                
            {/* Left side - Features Grid */}
            <div className="hidden md:block md:w-2/5 p-8 md:p-10 bg-gradient-to-br from-gray-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
              <div className="h-full flex flex-col">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Everything You Need for
                  </h2>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <Globe size={18} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                      Export Business
                    </h1>
                  </div>
                </div>

                {/* Compact Features Grid */}
                <div className="grid grid-cols-6 grid-rows-3 gap-3 h-full overflow-hidden">
                  {/* Top left - Global Business */}
                  <div className="col-span-3 row-span-2 overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center p-4">
                    <div className="text-center p-4">
                      <div className="text-white mb-3 flex justify-center">
                        <Briefcase size={32} />
                      </div>
                      <p className="text-white text-lg font-semibold leading-tight">Invoice  &  <br/>Packing List Management</p>
                    </div>
                  </div>
                  
                  {/* Top right - Secure Payments */}
                  <motion.div 
                    className="col-span-3 row-span-1 rounded-xl flex flex-col justify-center items-center p-3 text-white bg-gradient-to-br from-lime-500 to-green-500 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={formVisible ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div className="mb-2">
                      <Briefcase size={24} />
                    </div>
                    <h2 className="text-lg font-bold mb-1">Sales Contract</h2>
                    <p className="text-center text-xs">Management</p>
                  </motion.div>
                  
                  {/* Middle right - Multi-currency */}
                  <div className="col-span-3 row-span-1 overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center p-3">
                    <div className="text-center">
                      <div className="text-white mb-2 flex justify-center">
                        <Database size={24} />
                      </div>
                      <p className="text-white text-lg font-semibold leading-tight">Database Storage</p>
                    </div>
                  </div>
                  
                  {/* Bottom left - Client Stats */}
                  <motion.div 
                    className="col-span-3 row-span-1 rounded-xl flex flex-col justify-center items-center p-3 text-white bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={formVisible ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div className="mb-2">
                      <Download size={24} />
                    </div>
                    <h2 className="text-xl font-bold mb-1">Excel & PDF</h2>
                    <p className="text-center text-xs">Export Tools</p>
                  </motion.div>
                  
                  {/* Bottom right - Analytics */}
                  <div className="col-span-3 row-span-2 overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center p-4">
                    <div className="text-center p-4">
                      <div className="text-white mb-3 flex justify-center">
                        <Zap size={32} />
                      </div>
                      <p className="text-white text-lg font-semibold leading-tight">Secure & Fast Processing</p>
                    </div>
                  </div>
                </div>

                {/* Features list at bottom */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-2">
                        <FileText size={10} className="text-amber-600 dark:text-amber-400" />
                      </div>
                      Invoice Management
                    </div>
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-lime-100 dark:bg-lime-900 flex items-center justify-center mr-2">
                        <Briefcase size={10} className="text-lime-600 dark:text-lime-400" />
                      </div>
                      Contract Docs
                    </div>
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-2">
                        <Database size={10} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      Database Storage
                    </div>
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-2">
                        <Download size={10} className="text-yellow-600 dark:text-yellow-400" />
                      </div>
                      PDF Export
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Right side - Sign in form */}
            <motion.div 
              className="w-full md:w-3/5 p-8 md:p-12 bg-white dark:bg-gray-800"
              initial={{ x: 20, opacity: 0 }}
              animate={formVisible ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              {/* Header with Logo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div className="flex   flex-col  sm:flex-row items-start sm:items-center justify-start sm:gap-2  gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">EB</span>
                    </div>
                  </motion.div>
                  <h1 className="text-2xl font-bold md:ml-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                    Export Biz
                  </h1>
                </div>
                
              </div>

              {/* Welcome Section */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Sign in to manage your export contacts, invoices, and payments
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6 w-full md:w-[25rem] mx-auto">
                {/* Username and Password in same row on medium+ screens */}
                <div className="grid grid-cols-1 gap-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <Label 
                      htmlFor="email" 
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Username
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter username "
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  {/* Password Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label 
                        htmlFor="password" 
                        className="text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        Password
                      </Label>
                      <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 pr-10 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {loadingMessage}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In to Dashboard
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Footer Links */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  By signing in, you agree to our{" "}
                  <button className="text-amber-600 dark:text-amber-400 hover:underline">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button className="text-amber-600 dark:text-amber-400 hover:underline">
                    Privacy Policy
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}