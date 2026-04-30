"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080/api/v0.1';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (!loginEmail || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: loginEmail,
        password: password,
      });

      // Store token and user data
      const { token, user } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        toast.success('Login successful!', {
          description: `Welcome back, ${user.name || user.email}!`,
          duration: 3000,
        });

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.error;
        
        if (status === 401) {
          setError('Invalid email or password');
        } else if (status === 404) {
          setError('User not found');
        } else if (status === 400) {
          setError(message || 'Please check your credentials');
        } else if (status === 403) {
          setError('Account is locked. Please contact support.');
        } else {
          setError(message || 'Login failed. Please try again.');
        }
        
        toast.error('Login failed', {
          description: error || 'Please check your credentials and try again.',
        });
      } else if (err.request) {
        // Request made but no response
        setError('Cannot connect to server. Please check your connection.');
        toast.error('Connection error', {
          description: 'Unable to reach the server. Please try again later.',
        });
      } else {
        // Other errors
        setError('An unexpected error occurred. Please try again.');
        toast.error('Error', {
          description: 'Something went wrong. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center px-4">
      
      {/* Animated SVG Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute top-20 -left-20 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute bottom-20 -right-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -40, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-100/10 rounded-full blur-3xl"
        />

        {/* Only render particles after mounting */}
        {mounted && (
          <>
            {/* Floating particles */}
            {[...Array(15)].map((_, i) => {
              const x = 10 + (i * 7) % 80;
              const y = 15 + (i * 11) % 70;
              const size = 2 + (i % 5);
              const delay = (i * 0.3) % 5;
              
              return (
                <motion.div
                  key={i}
                  initial={{
                    x: `${x}%`,
                    y: `${y}%`,
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    y: ["-30px", "0px", "30px", "0px"],
                    x: ["20px", "-20px", "15px", "0px"],
                    scale: [0, 1, 1, 0],
                    opacity: [0, 0.8, 0.8, 0],
                  }}
                  transition={{
                    duration: 6 + (i % 4),
                    repeat: Infinity,
                    delay: delay,
                    ease: "easeInOut"
                  }}
                  className="absolute rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-400/20"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                />
              );
            })}

            {/* Glowing particles */}
            {[...Array(8)].map((_, i) => {
              const x = 20 + (i * 9) % 60;
              const y = 25 + (i * 13) % 50;
              const size = 3 + (i % 4);
              const delay = (i * 0.4) % 5;
              
              return (
                <motion.div
                  key={`glow-${i}`}
                  initial={{
                    x: `${x}%`,
                    y: `${y}%`,
                  }}
                  animate={{
                    y: ["-40px", "0px", "40px", "0px"],
                    x: ["30px", "-30px", "20px", "0px"],
                  }}
                  transition={{
                    duration: 8 + (i % 4),
                    repeat: Infinity,
                    delay: delay + 2,
                    ease: "easeInOut"
                  }}
                  className="absolute rounded-full bg-emerald-300/40 blur-sm"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${size + 4}px`,
                    height: `${size + 4}px`,
                  }}
                />
              );
            })}
          </>
        )}

        {/* Grid pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-slate-900" />
        </svg>

        {/* Animated gradient line */}
        <motion.div
          animate={{
            x: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
        />
        
        <motion.div
          animate={{
            x: ["100%", "0%", "100%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 7.5
          }}
          className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-6 border border-white/50">
          
          {/* Logo and Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-md mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-xs mt-1">Sign in to your account</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-1.5"
            >
              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <Mail size={10} />
                Email Address
              </label>
              <div className="relative">
                <Input 
                  className="h-10 pl-9 text-sm border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-lg bg-white/50"
                  type="email" 
                  placeholder="hello@jemigraph.com"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    setError('');
                  }}
                  required 
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                  <Lock size={10} />
                  Password
                </label>
                <Link 
                  href="/auth/forgot-password"
                  className="text-[9px] text-emerald-600 font-bold hover:text-emerald-700 transition-colors hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  className="h-10 pl-9 pr-9 text-sm border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all rounded-lg bg-white/50"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required 
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-50 border border-rose-200 rounded-lg p-2.5"
              >
                <p className="text-[10px] text-rose-600 flex items-center gap-1.5">
                  <AlertCircle size={12} />
                  {error}
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-10 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 font-bold text-sm rounded-lg shadow-md shadow-emerald-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-xs">Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn size={14} />
                    <span className="text-xs">Login to System</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 pt-4 border-t border-slate-200 text-center"
          >
            <p className="text-[10px] text-slate-500">
              Don't have an account?{' '}
              <button 
                onClick={() => router.push('/auth/register')}
                className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
              >
                Contact Admin
              </button>
            </p>
          </motion.div>
        </div>

        {/* Decorative bottom text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-[9px] text-slate-400 mt-4 tracking-wider"
        >
          © 2026 Jemigraph Photography Platform
        </motion.p>
      </motion.div>
    </div>
  );
}