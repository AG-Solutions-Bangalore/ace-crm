import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import BASE_URL from "@/config/BaseUrl";
import { motion } from "framer-motion";
import { 
  Eye, EyeOff, LogIn, Globe, Shield, CreditCard, 
  FileText, Users, BarChart, TrendingUp, Zap, 
  Download, Database, Briefcase, Building, Mail, 
  Phone, User, MapPin, FileDigit, Hash
} from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form states
  const [formData, setFormData] = useState({
    company_short: "",
    company_name_short: "",
    company_name: "",
    company_email: "",
    company_mobile: "",
    company_contact_name: "",
    company_address: "",
    company_gst: "",
    company_pan_no: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const loadingMessages = [
    "Creating your company profile...",
    "Setting up business account...",
    "Configuring dashboard...",
    "Almost done...",
    "Welcome to Export Biz!",
  ];

  // Validation rules
  const validationRules = {
    company_short: {
      required: true,
      maxLength: 10,
      pattern: /^[A-Z0-9]+$/,
      message: "Must be uppercase letters/numbers only, max 10 chars"
    },
    company_name_short: {
      required: true,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9\s&.-]+$/,
      message: "Only letters, numbers, spaces, &, ., - allowed"
    },
    company_name: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: /^[a-zA-Z0-9\s&.,'-]+$/,
      message: "Valid company name required"
    },
    company_email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Valid email required"
    },
    company_mobile: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "10 digit mobile number required"
    },
    company_contact_name: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s.'-]+$/,
      message: "Valid contact name required"
    },
    company_address: {
      required: true,
      minLength: 10,
      message: "Address must be at least 10 characters"
    },
    company_gst: {
      required: true,
    
      message: "Valid GST number required (15 chars)"
    },
    company_pan_no: {
      required: true,
      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      message: "Valid PAN number required (10 chars)"
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Auto-uppercase for specific fields
    if (name === 'company_short' || name === 'company_gst' || name === 'company_pan_no') {
      processedValue = value.toUpperCase();
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";

    if (rules.required && !value.trim()) {
      return "This field is required";
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum ${rules.minLength} characters required`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Maximum ${rules.maxLength} characters allowed`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message;
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please correct the errors in the form",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/createsignup`, formData);

      if (response.status === 200 || response.status === 201) {
        toast({
          variant: "default",
          title: "Success!",
          description: "Company registered successfully. Check your mail for login.",
        });
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: response.data?.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.response?.data?.error || 
                    error.response?.data?.message || 
                    "Network error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex min-h-screen items-center justify-center p-4 md:p-0">
        <motion.div 
          className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Left side - Features Grid */}
            <div className="hidden md:block md:w-2/5 p-8 md:p-10 bg-gradient-to-br from-gray-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
              <div className="h-full flex flex-col">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Start Your Export Journey
                  </h2>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <Globe size={18} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                      With Export Biz
                    </h1>
                  </div>
                </div>

                {/* Compact Features Grid */}
                <div className="grid grid-cols-6 grid-rows-3 gap-3 h-full overflow-hidden">
                  {/* Top left - Company Setup */}
                  <div className="col-span-3 row-span-2 overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center p-4">
                    <div className="text-center p-4">
                      <div className="text-white mb-3 flex justify-center">
                        <Building size={32} />
                      </div>
                      <p className="text-white text-sm font-semibold leading-tight">Company Profile Setup</p>
                    </div>
                  </div>
                  
                  {/* Top right - Document Management */}
                  <motion.div 
                    className="col-span-3 row-span-1 rounded-xl flex flex-col justify-center items-center p-3 text-white bg-gradient-to-br from-lime-500 to-green-500 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={formVisible ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <div className="mb-2">
                      <FileText size={24} />
                    </div>
                    <h2 className="text-lg font-bold mb-1">GST & PAN</h2>
                    <p className="text-center text-xs">Verification</p>
                  </motion.div>
                  
                  {/* Middle right - Contact Setup */}
                  <div className="col-span-3 row-span-1 overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center p-3">
                    <div className="text-center">
                      <div className="text-white mb-2 flex justify-center">
                        <Phone size={24} />
                      </div>
                      <p className="text-white text-sm font-semibold leading-tight">Contact Management</p>
                    </div>
                  </div>
                  
                  {/* Bottom left - Quick Start */}
                  <motion.div 
                    className="col-span-3 row-span-1 rounded-xl flex flex-col justify-center items-center p-3 text-white bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg"
                    initial={{ y: 20, opacity: 0 }}
                    animate={formVisible ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div className="mb-2">
                      <Zap size={24} />
                    </div>
                    <h2 className="text-xl font-bold mb-1">14-Day</h2>
                    <p className="text-center text-xs">Free Trial</p>
                  </motion.div>
                  
                  {/* Bottom right - Secure Setup */}
                  <div className="col-span-3 row-span-2 overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center p-4">
                    <div className="text-center p-4">
                      <div className="text-white mb-3 flex justify-center">
                        <Shield size={32} />
                      </div>
                      <p className="text-white text-sm font-semibold leading-tight">Secure & Compliant Setup</p>
                    </div>
                  </div>
                </div>

                {/* Benefits list at bottom */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-2">
                        <Building size={10} className="text-amber-600 dark:text-amber-400" />
                      </div>
                      Company Profile
                    </div>
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-lime-100 dark:bg-lime-900 flex items-center justify-center mr-2">
                        <FileDigit size={10} className="text-lime-600 dark:text-lime-400" />
                      </div>
                      GST & PAN Verified
                    </div>
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-2">
                        <Mail size={10} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      Business Email
                    </div>
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-2">
                        <User size={10} className="text-yellow-600 dark:text-yellow-400" />
                      </div>
                      Contact Person
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Right side - Signup form */}
            <motion.div 
              className="w-full md:w-3/5 p-6 md:p-8 bg-white dark:bg-gray-800 overflow-y-auto max-h-screen"
              initial={{ x: 20, opacity: 0 }}
              animate={formVisible ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              {/* Header with Logo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-center">
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
                  <h1 className="text-2xl font-bold ml-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-400">
                    Export Biz
                  </h1>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 bg-amber-50 dark:bg-gray-700 px-4 py-2 rounded-lg border border-amber-200 dark:border-gray-600">
                  Already have an account?{" "}
                  <button 
                    onClick={() => navigate("/")}
                    className="font-medium text-amber-600 dark:text-amber-400 hover:underline ml-1"
                  >
                    Sign In
                  </button>
                </p>
              </div>

              {/* Welcome Section */}
              <div className="mb-4">
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  Start Your Free Trial
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Register your company to access export management tools
                </p>
              </div>

              {/* Company Details Form */}
              <form onSubmit={handleSubmit} className="space-y-2" noValidate>
                {/* Row 1: Company Short Codes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         
<div className="space-y-2">
  <Label htmlFor="company_name" className="flex items-center text-sm font-medium text-amber-700 dark:text-gray-200">
    <Building size={14} className="mr-2" />
    Full Company Name
  </Label>
  <div className="relative">
    <Input
      type="text"
      name="company_name"
      id="company_name"
      value={formData.company_name}
      onChange={(e) => {
        const newValue = e.target.value;
        handleChange(e); 
        
      
        const prefix = newValue
          .split(' ')
          .filter(word => word.length > 0)
          .map(word => word.charAt(0).toUpperCase())
          .join('')
          .slice(0, 10); 
        
        setFormData(prev => ({
          ...prev,
          company_short: prefix
        }));
        
   
        if (errors.company_short) {
          setErrors(prev => ({
            ...prev,
            company_short: ""
          }));
        }
      }}
      className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${errors.company_name ? 'border-red-500 dark:border-red-500' : ''}`}
      placeholder="Export Business Solutions Private Limited"
      required
    />
    {errors.company_name && (
      <p className="text-red-500 text-xs mt-1">{errors.company_name}</p>
    )}
  </div>
</div>
                  {/* Company Short */}
                  <div className="space-y-2">
                    <Label htmlFor="company_short" className="flex items-center text-sm font-medium text-amber-700 dark:text-gray-200">
                      <Hash size={14} className="mr-2" />
                      Company Prefix
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="company_short"
                        id="company_short"
                        value={formData.company_short}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 pr-10 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${errors.company_short ? 'border-red-500 dark:border-red-500' : ''}`}
                        placeholder="EB (uppercase only) automatically generte"
                        required
                        autoFocus
                        maxLength={10}
                      />
                      {errors.company_short && (
                        <p className="text-red-500 text-xs mt-1">{errors.company_short}</p>
                      )}
                    </div>
                  </div>
                  
                
                  
                </div>

                {/* Row 2: Full Company Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Company Name Short */}
                <div className="space-y-2">
                    <Label htmlFor="company_name_short" className="flex items-center text-sm font-medium text-amber-700 dark:text-gray-200">
                      <Briefcase size={14} className="mr-2" />
                      Company Short Name
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="company_name_short"
                        id="company_name_short"
                        value={formData.company_name_short}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${errors.company_name_short ? 'border-red-500 dark:border-red-500' : ''}`}
                        placeholder="Export Biz Ltd."
                        required
                        maxLength={20}
                      />
                      {errors.company_name_short && (
                        <p className="text-red-500 text-xs mt-1">{errors.company_name_short}</p>
                      )}
                    </div>
                  </div>
                  {/* Company Email */}
                  <div className="space-y-2">
                    <Label htmlFor="company_email" className="flex items-center text-sm font-medium text-amber-700 dark:text-gray-200">
                      <Mail size={14} className="mr-2" />
                      Company Email
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        name="company_email"
                        id="company_email"
                        value={formData.company_email}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${errors.company_email ? 'border-red-500 dark:border-red-500' : ''}`}
                        placeholder="contact@exportbiz.com"
                        required
                      />
                      {errors.company_email && (
                        <p className="text-red-500 text-xs mt-1">{errors.company_email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 3: Mobile & Contact Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Mobile */}
                  <div className="space-y-2">
                    <Label htmlFor="company_mobile" className="flex items-center text-sm font-medium text-amber-700 dark:text-gray-200">
                      <Phone size={14} className="mr-2" />
                      Company Mobile
                    </Label>
                    <div className="relative">
                      <Input
                        type="tel"
                        name="company_mobile"
                        id="company_mobile"
                        value={formData.company_mobile}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${errors.company_mobile ? 'border-red-500 dark:border-red-500' : ''}`}
                        placeholder="9876543210"
                        required
                        maxLength={10}
                      />
                      {errors.company_mobile && (
                        <p className="text-red-500 text-xs mt-1">{errors.company_mobile}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact Person Name */}
                  <div className="space-y-2">
                    <Label htmlFor="company_contact_name" className="flex items-center text-sm font-medium text-amber-700 dark:text-gray-200">
                      <User size={14} className="mr-2" />
                      Contact Person Name
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="company_contact_name"
                        id="company_contact_name"
                        value={formData.company_contact_name}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${errors.company_contact_name ? 'border-red-500 dark:border-red-500' : ''}`}
                        placeholder="John Doe"
                        required
                      />
                      {errors.company_contact_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.company_contact_name}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 4: Address */}
                <div className="space-y-2">
                  <Label htmlFor="company_address" className="flex items-center text-sm font-medium text-amber-700 dark:text-gray-200">
                    <MapPin size={14} className="mr-2" />
                    Company Address
                  </Label>
                  <div className="relative">
                    <Textarea
                      name="company_address"
                      id="company_address"
                      value={formData.company_address}
                      onChange={handleChange}
                      className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 min-h-[100px] resize-y ${errors.company_address ? 'border-red-500 dark:border-red-500' : ''}`}
                      placeholder="Complete company address with city, state, and pin code"
                      required
                    />
                    {errors.company_address && (
                      <p className="text-red-500 text-xs mt-1">{errors.company_address}</p>
                    )}
                  </div>
                </div>

                {/* Row 5: GST & PAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* GST Number */}
                  <div className="space-y-2">
                    <Label htmlFor="company_gst" className="flex items-center text-sm font-medium text-amber-700 dark:text-gray-200">
                      <FileDigit size={14} className="mr-2" />
                      GST Number
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="company_gst"
                        id="company_gst"
                        value={formData.company_gst}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${errors.company_gst ? 'border-red-500 dark:border-red-500' : ''}`}
                        placeholder="22AAAAA0000A1Z5"
                        required
                        
                      />
                      {errors.company_gst && (
                        <p className="text-red-500 text-xs mt-1">{errors.company_gst}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* PAN Number */}
                  <div className="space-y-2">
                    <Label htmlFor="company_pan_no" className="flex items-center text-sm font-medium text-amber-700 dark:text-gray-200">
                      <FileDigit size={14} className="mr-2" />
                      PAN Number
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="company_pan_no"
                        id="company_pan_no"
                        value={formData.company_pan_no}
                        onChange={handleChange}
                        className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${errors.company_pan_no ? 'border-red-500 dark:border-red-500' : ''}`}
                        placeholder="ABCDE1234F"
                        required
                        maxLength={10}
                      />
                      {errors.company_pan_no && (
                        <p className="text-red-500 text-xs mt-1">{errors.company_pan_no}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={formVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
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
                        Start 7-Day Free Trial
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Footer Links */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  By signing up, you agree to our{" "}
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