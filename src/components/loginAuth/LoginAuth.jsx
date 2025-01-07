import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import BASE_URL from '@/config/BaseUrl';
import { Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContextPanel } from '@/lib/ContextPanel';

export default function LoginAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
   const [loadingMessage, setLoadingMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
    const loadingMessages = [
      "Setting things up for you...",
      "Checking your credentials...",
      "Preparing your dashboard...",
      "Almost there...",
    ];
  
    useEffect(() => {
      let messageIndex = 0;
      let intervalId;
  
      if (isLoading) {
        setLoadingMessage(loadingMessages[0]);
        intervalId = setInterval(() => {
          messageIndex = (messageIndex + 1) % loadingMessages.length;
          setLoadingMessage(loadingMessages[messageIndex]);
        }, 800);
      }
  
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [isLoading]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const res = await axios.post(`${BASE_URL}/api/panel-login`, formData);
      
      if (res.status == 200 ) {
        const token = res.data.UserInfo?.token;
        
        if (token) {
          // Store user information in localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("id", res.data.UserInfo.user.id);
          localStorage.setItem("companyID", res.data.UserInfo.user.company_id);
          localStorage.setItem("branchId", res.data.UserInfo.user.branch_id);
          localStorage.setItem("name", res.data.UserInfo.user.name);
          localStorage.setItem("username", res.data.UserInfo.user.name);
          localStorage.setItem("email", res.data.UserInfo.user.email);
          localStorage.setItem("userType", res.data.UserInfo.user.user_type);
         
          // Show success toast
          toast({
            title: "Login Successful",
            description: "Welcome back to your dashboard.",
          });

          // Direct navigation based on user type
          const userType = res.data.UserInfo.user.user_type;
          switch(userType) {
            case 1:
              navigate("/home");
              break;
            case 2:
              navigate("/home");
              break;
            case 3:
              navigate("/home");
              break;
            case 4:
              navigate("/home");
              break;
            default:
              navigate("/home");
          }
        } else {
          throw new Error("No token received");
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      // Handle login errors
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.response?.data?.message || "Please check your credentials.",
      });
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="relative flex flex-col justify-center items-center min-h-screen bg-gray-100"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
    

      <motion.div
        initial={{ 
          opacity: 1, 
          x: 0 
        }}
        exit={{
          opacity: 0,
          x: -window.innerWidth,
          transition: {
            duration: 0.3,
            ease: "easeInOut"
          }
        }}
      >
        <Card className="w-80 max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your UserName and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">UserName</Label>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Input
                      id="email"
                      type="text"
                      placeholder="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </motion.div>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      placeholder="*******"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                     {isLoading ? (
                                          <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center justify-center"
                                          >
                                            <motion.span
                                              key={loadingMessage}
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: -10 }}
                                              className="text-sm"
                                            >
                                              {loadingMessage}
                                            </motion.span>
                                          </motion.span>
                                        ) : (
                                          "Sign in"
                                        )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}