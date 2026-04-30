"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { photographers } from "@/lib/constants/photographers";
import {
    FaCamera,
    FaInstagram,
    FaFacebook,
    FaTwitter,
    FaEnvelope,
    FaMapMarkerAlt,
    FaStar,
    FaHeart,
    FaAward,
    FaUsers,
    FaCalendarAlt,
    FaArrowRight,
    FaLock,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function PhotographersPage() {
    const [selectedPhotographer, setSelectedPhotographer] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [pendingBookingId, setPendingBookingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const heroRef = useRef(null);
    const teamRef = useRef(null);
    
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

  

    const specialties = [
        { id: "all", label: "All Photographers", icon: FaCamera },
        { id: "Adventure & Landscape", label: "Adventure & Landscape", icon: FaMapMarkerAlt },
        { id: "Cultural & Portrait", label: "Cultural & Portrait", icon: FaUsers },
        { id: "Wedding & Romance", label: "Wedding & Romance", icon: FaHeart },
        { id: "Wildlife & Nature", label: "Wildlife & Nature", icon: FaAward },
        { id: "Urban & Street", label: "Urban & Street", icon: FaCamera },
        { id: "Underwater & Marine", label: "Underwater & Marine", icon: FaCamera }
    ];

    const filteredPhotographers = activeFilter === "all"
        ? photographers
        : photographers.filter(p => p.specialty === activeFilter);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-content", {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            });

            gsap.from(".photographer-card", {
                scrollTrigger: {
                    trigger: teamRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
                y: 50,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
            });
        });

        return () => ctx.revert();
    }, [activeFilter]);

    const handleBookNow = (photographerId: number) => {
        if (!isLoggedIn) {
            setPendingBookingId(photographerId);
            setLoginDialogOpen(true);
            toast.info("Please login to book a photographer");
            return;
        }
        window.location.href = `/booking?photographer=${photographerId}`;
    };

    const handleViewProfile = (photographer: any) => {
        if (!isLoggedIn) {
            setPendingBookingId(null);
            setSelectedPhotographer(photographer);
            setLoginDialogOpen(true);
            toast.info("Please login to view full profile");
            return;
        }
        setSelectedPhotographer(photographer);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        setTimeout(() => {
            if (loginEmail && loginPassword) {
                setIsLoggedIn(true);
                setLoginDialogOpen(false);
                toast.success("Login Successful! 🎉", {
                    description: "Welcome back! You can now book photographers.",
                });
                setLoginEmail("");
                setLoginPassword("");
                
                if (pendingBookingId) {
                    window.location.href = `/booking?photographer=${pendingBookingId}`;
                }
            } else {
                toast.error("Login Failed", {
                    description: "Please check your email and password.",
                });
            }
            setIsSubmitting(false);
        }, 1500);
    };

    const handleModalBookNow = () => {
        if (!isLoggedIn) {
            setLoginDialogOpen(true);
            toast.info("Please login to book this photographer");
            return;
        }
        if (selectedPhotographer) {
            window.location.href = `/booking?photographer=${selectedPhotographer.id}`;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/img.jpg"
                        alt="Our photographers team"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <FaUsers className="text-emerald-400" />
                            <span className="text-white text-sm">Meet Our Team</span>
                        </div>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        World-Class Photographers
                    </h1>
                    <div className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Passionate experts ready to capture your most precious moments across the globe
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="py-12 px-6 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {specialties.map((specialty) => {
                            const Icon = specialty.icon;
                            return (
                                <button
                                    key={specialty.id}
                                    onClick={() => setActiveFilter(specialty.id)}
                                    className={`px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                                        activeFilter === specialty.id
                                            ? "bg-emerald-600 text-white shadow-lg"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                                    }`}
                                >
                                    <Icon className="text-sm" />
                                    <span>{specialty.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Photographers Grid */}
            <section ref={teamRef} className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPhotographers.map((photographer, index) => (
                            <motion.div
                                key={photographer.id}
                                className="photographer-card group"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                    {/* Photographer Image */}
                                    <div className="relative h-80 overflow-hidden">
                                        <Image
                                            src={photographer.image}
                                            alt={photographer.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        
                                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="absolute top-4 right-4 z-10">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                photographer.available
                                                    ? "bg-green-500 text-white"
                                                    : "bg-red-500 text-white"
                                            }`}>
                                                {photographer.available ? "Available" : "Booked"}
                                            </span>
                                        </div>

                                        <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                                            <FaStar className="text-yellow-400 text-sm" />
                                            <span className="text-white text-sm font-semibold">{photographer.rating}</span>
                                        </div>

                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                <FaCamera className="text-white text-2xl" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">
                                            {photographer.name}
                                        </h3>
                                        <div className="text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                                            {photographer.role}
                                        </div>
                                        <div className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                                            {photographer.bio.substring(0, 120)}...
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                                            <div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400">Experience</div>
                                                <div className="font-semibold text-zinc-900 dark:text-white">{photographer.experience}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400">Sessions</div>
                                                <div className="font-semibold text-zinc-900 dark:text-white">{photographer.sessions}+</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400">Specialty</div>
                                                <div className="font-semibold text-emerald-600 dark:text-emerald-400">{photographer.specialty}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mb-4">
                                            <a href="#" className="text-zinc-400 hover:text-emerald-600 transition text-xl">
                                                <FaInstagram />
                                            </a>
                                            <a href="#" className="text-zinc-400 hover:text-emerald-600 transition text-xl">
                                                <FaFacebook />
                                            </a>
                                            <a href="#" className="text-zinc-400 hover:text-emerald-600 transition text-xl">
                                                <FaTwitter />
                                            </a>
                                            <a href="#" className="text-zinc-400 hover:text-emerald-600 transition text-xl">
                                                <FaEnvelope />
                                            </a>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                                onClick={() => handleViewProfile(photographer)}
                                            >
                                                View Profile
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="flex-1"
                                                onClick={() => handleBookNow(photographer.id)}
                                            >
                                                Book Now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 px-6 bg-emerald-50 dark:bg-emerald-950/20">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                            Why Choose Our Photographers?
                        </h2>
                        <div className="text-lg text-zinc-600 dark:text-zinc-400">
                            Professional excellence combined with genuine passion
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FaAward,
                                title: "Award-Winning",
                                description: "Internationally recognized photographers with years of experience"
                            },
                            {
                                icon: FaCamera,
                                title: "Professional Gear",
                                description: "Top-of-the-line equipment for stunning, high-quality photos"
                            },
                            {
                                icon: FaHeart,
                                title: "Passionate Experts",
                                description: "Genuine love for photography and capturing special moments"
                            }
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                    className="text-center p-6"
                                >
                                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="text-3xl text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <div className="text-zinc-600 dark:text-zinc-400">
                                        {item.description}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-linear-to-r from-emerald-900 to-emerald-700">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Work with Our Experts?
                        </h2>
                        <div className="text-lg text-emerald-100 mb-8">
                            Choose your perfect photographer and start your photography adventure today
                        </div>
                        <Button 
                            className="bg-white text-emerald-900 hover:bg-gray-100 h-14 px-8 text-lg gap-2"
                            onClick={() => {
                                if (!isLoggedIn) {
                                    setLoginDialogOpen(true);
                                    toast.info("Please login to book");
                                } else {
                                    window.location.href = "/booking";
                                }
                            }}
                        >
                            Book Your Photographer <FaArrowRight />
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Login Dialog - FIXED: No div inside DialogDescription */}
            <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <FaLock className="text-emerald-600" />
                            Login Required
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Please login to your account to book photographers and view full profiles.
                            {pendingBookingId && (
                                <span className="block mt-2 text-sm font-medium text-emerald-600">
                                    You're about to book a photographer
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="login-email">Email Address</Label>
                            <Input
                                id="login-email"
                                type="email"
                                placeholder="you@example.com"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="login-password">Password</Label>
                            <Input
                                id="login-password"
                                type="password"
                                placeholder="••••••••"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-zinc-500">Don't have an account? </span>
                            <button 
                                type="button"
                                className="text-emerald-600 hover:underline"
                                onClick={() => {
                                    toast.info("Sign up feature coming soon!");
                                }}
                            >
                                Sign up
                            </button>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3">
                            <div className="text-xs text-amber-800 dark:text-amber-400">
                                Demo credentials: any email + any password (min 1 character)
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Photographer Profile Modal */}
            <AnimatePresence>
                {selectedPhotographer && !loginDialogOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
                        onClick={() => setSelectedPhotographer(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-zinc-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <button
                                    onClick={() => setSelectedPhotographer(null)}
                                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition"
                                >
                                    ✕
                                </button>

                                <div className="relative h-96">
                                    <Image
                                        src={selectedPhotographer.image}
                                        alt={selectedPhotographer.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h2 className="text-3xl font-bold mb-2">{selectedPhotographer.name}</h2>
                                        <div className="text-xl text-emerald-300">{selectedPhotographer.role}</div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Biography</h3>
                                            <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                                {selectedPhotographer.bio}
                                            </div>
                                            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg italic">
                                                <div className="text-emerald-800 dark:text-emerald-300">
                                                    "{selectedPhotographer.quote}"
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Details</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <FaMapMarkerAlt className="text-emerald-600" />
                                                    <span className="text-zinc-700 dark:text-zinc-300">{selectedPhotographer.location}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaCalendarAlt className="text-emerald-600" />
                                                    <span className="text-zinc-700 dark:text-zinc-300">{selectedPhotographer.experience} Experience</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <FaStar className="text-yellow-400" />
                                                    <span className="text-zinc-700 dark:text-zinc-300">{selectedPhotographer.rating} Rating ({selectedPhotographer.sessions}+ sessions)</span>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-bold mt-6 mb-3 text-zinc-900 dark:text-white">Achievements</h3>
                                            <ul className="space-y-2">
                                                {selectedPhotographer.achievements.map((achievement, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                                                        <FaAward className="text-emerald-600 text-sm" />
                                                        {achievement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6 flex gap-4">
                                        <Button 
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                            onClick={handleModalBookNow}
                                        >
                                            Book {selectedPhotographer.name}
                                        </Button>
                                        <Button variant="outline" onClick={() => setSelectedPhotographer(null)}>
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}