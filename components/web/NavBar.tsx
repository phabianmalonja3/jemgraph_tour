"use client"

import React, { useState, useEffect, useRef } from "react";
import { 
    FaBars, FaTimes, FaPhone, FaEnvelope, FaLock, 
    FaUser, FaSignOutAlt, FaCreditCard, FaCamera, FaArrowLeft,
    FaTrophy,
    FaTachometerAlt
} from "react-icons/fa";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MAIN_NAV_LINKS } from "@/lib/constants/navigation";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import gsap from "gsap";

const NavBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "forgot">("login");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    
    const photoBtnRef = useRef<HTMLAnchorElement>(null);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Check token on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setIsLoggedIn(true);
    }, []);

    // GSAP Animation kwa "Find Photographer" button
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(photoBtnRef.current, {
                scale: 1.05,
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        });
        return () => ctx.revert();
    }, []);

    // const handleLogin = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //     const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v0.1";
        
    //     try {
    //         const response = await fetch(`${BASE_URL}/auth/login`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    //         });
            
    //         const data = await response.json();


    //         console.log();

    //         if (response.ok) {
    //             localStorage.setItem("token", data.token);
    //             localStorage.setItem("user",data.user);

    //             setUser(data.user)
    //             setIsLoggedIn(true);
    //             setLoginDialogOpen(false);
    //             toast.success("Welcome back!");
    //             setLoginEmail("");
    //             setLoginPassword("");
    //             router.refresh(); 
    //         } 
    //         // LOCKING LOGIC: Inakamata 429 kutoka kwa Redis/Spring Boot
    //         else if (response.status === 429) {
    //             toast.error(data.message || "Account locked due to many attempts. Try again in 15 mins.", {
    //                 duration: 6000,
    //                 icon: <FaLock className="text-red-500" />
    //             });
    //         } 
    //         else {
    //             toast.error(data.message || "Invalid credentials or account does not exist");
    //         }
    //     } catch (error: any) {
    //         toast.error("Connection error: " + error.message);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        toast.success("Logged out successfully");
        router.push("/");
    };

    if (pathname.startsWith("/dashboard")) return null;

    const payments = [
        { name: "M-Pesa", color: "bg-[#e21a2d]", icon: "M" },
        { name: "Tigo Pesa", color: "bg-[#003777]", icon: "T" },
        { name: "Airtel Money", color: "bg-[#ff0000]", icon: "A" },
        { name: "CRDB Bank", color: "bg-[#64a70b]", icon: "C" },
    ];

    return (
        <>
            {/* --- TOP BAR --- */}
            <div className="bg-emerald-950 text-white py-2 hidden sm:block border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex gap-5 opacity-80 text-[10px] font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer">
                            <FaEnvelope className="text-emerald-400" /> info@jemigraph.co.tz
                        </span>
                        <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer">
                            <FaPhone className="text-emerald-400" /> +255 746 560 832
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mr-2">Payment Partners</span>
                        <div className="flex gap-1.5">
                            {payments.map((p) => (
                                <div key={p.name} className="group flex items-center bg-white/5 hover:bg-white/10 border border-white/10 rounded px-2 py-1 transition-all">
                                    <div className={cn("w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[8px] font-black text-white mr-1.5 shadow-sm", p.color)}>
                                        {p.icon}
                                    </div>
                                    <span className="text-[9px] font-bold text-white/70 group-hover:text-white transition-colors">{p.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN NAV --- */}
            <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Image src="/logo.png" width={140} height={90} alt="Logo" priority unoptimized />
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex items-center gap-7 mr-4">
                            {MAIN_NAV_LINKS.map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.href}
                                    className={cn(
                                        "text-[12px] font-bold tracking-[0.1em] uppercase transition-all hover:text-emerald-700",
                                        pathname === link.href ? "text-emerald-700" : "text-slate-500"
                                    )}
                                >
                                    {link.path}
                                </Link>
                            ))}
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 mx-1" />
                        <div className="flex items-center gap-4">
                            <Link 
                                ref={photoBtnRef}
                                href="/booking" 
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                            >
                                <FaCamera className="text-sm" /> Find Photographer
                            </Link>

                            {isLoggedIn ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0 border-2 border-emerald-500/20 hover:border-emerald-500 transition-all">
                                            <Avatar className="h-full w-full">
                                                <AvatarImage src="/avatar.jpg" alt="User" />
                                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">U</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                       
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" className="cursor-pointer py-2"><FaTachometerAlt className="mr-2 h-4 w-4" /> Dashaboard</Link>
                                        </DropdownMenuItem>
                                       
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer py-2"><FaUser className="mr-2 h-4 w-4" /> My Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/billing" className="cursor-pointer py-2"><FaCreditCard className="mr-2 h-4 w-4" /> Payments</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer font-bold py-2">
                                            <FaSignOutAlt className="mr-2 h-4 w-4" /> Sign Out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                               <>
                               </>
                            )}

                           
                        </div>

                          <Link 
                             
                             href="auth/login"
                             
                                    
                                    className="bg-emerald-950 hover:bg-emerald-900 text-white px-8 py-2 rounded-2xl font-bold text-[11px] tracking-widest shadow-xl flex items-center gap-2"
                                >
                                    <FaLock className="text-[10px]" /> LOGIN 
                                </Link>
                    </div>

                    <button className="lg:hidden p-2 text-emerald-950" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
                    </button>
                </div>
            </nav>

            {/* --- AUTH DIALOG --- */}
            <Dialog open={loginDialogOpen} onOpenChange={(open) => {
                setLoginDialogOpen(open);
                if (!open) setAuthMode("login");
            }}>
                <DialogContent className="sm:max-w-[400px] border-none p-0 overflow-hidden rounded-xl shadow-2xl">
                    <div className="bg-white p-8">
                        <DialogHeader className="mb-8">
                            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    {authMode === "login" ? <FaLock className="text-emerald-600 text-lg" /> : <FaEnvelope className="text-emerald-600 text-lg" />}
                                </div>
                                {authMode === "login" ? "Account Login" : "Reset Password"}
                            </DialogTitle>
                        </DialogHeader>

                        {authMode === "login" ? (
                            <>
                            </>
                        ) : (
                            <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                                <p className="text-sm text-slate-500 leading-relaxed">Enter email to reset password.</p>
                                <Input className="h-12 border-slate-200" type="email" placeholder="example@gmail.com" required />
                                <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-lg">Send Reset Link</Button>
                                <button onClick={() => setAuthMode("login")} className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 font-bold mt-4">
                                    <FaArrowLeft className="text-[10px]" /> Back to Login
                                </button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NavBar;