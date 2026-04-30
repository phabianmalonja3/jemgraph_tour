"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    FaCamera,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaStar,
    FaUsers,
    FaClock,
    FaTag,
    FaSearch,
    FaArrowRight,
    FaGlobe,
    FaMountain,
    FaUmbrellaBeach,
    FaTree,
    FaWater,
    FaHeart,
    FaRegHeart,
    FaCheckCircle,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaComment,
    FaLock
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Sample events data
const eventsData = [
    {
        id: 1,
        title: "Bali Photography Workshop",
        description: "Capture the magic of Bali's rice terraces, temples, and beaches in this 5-day intensive workshop.",
        longDescription: "Join us for an immersive photography experience in the paradise island of Bali. You'll learn landscape, portrait, and street photography techniques while exploring iconic locations like Ubud, Tanah Lot, and the Tegallalang Rice Terraces.",
        image: "/event-bali.jpg",
        coverImage: "/event-bali-cover.jpg",
        location: "Bali, Indonesia",
        date: "2024-06-15",
        endDate: "2024-06-20",
        price: 1299,
        originalPrice: 1599,
        spots: 12,
        totalSpots: 15,
        category: "workshop",
        type: "Photography Workshop",
        difficulty: "Beginner to Intermediate",
        duration: "5 days",
        languages: ["English", "Indonesian"],
        rating: 4.9,
        reviews: 128,
        featured: true,
        included: [
            "Professional photography guidance",
            "Accommodation (5 nights)",
            "Meals (breakfast & lunch)",
            "Transportation between locations",
            "Entry fees to all locations",
            "Post-processing session"
        ]
    },
    {
        id: 2,
        title: "Safari Photography Expedition",
        description: "Witness and capture Africa's magnificent wildlife on this 7-day safari adventure.",
        longDescription: "Embark on the ultimate wildlife photography safari in Tanzania's Serengeti and Ngorongoro Crater. This expedition focuses on animal behavior, action photography, and capturing the raw beauty of African landscapes.",
        image: "/event-safari.jpg",
        coverImage: "/event-safari-cover.jpg",
        location: "Serengeti, Tanzania",
        date: "2024-07-10",
        endDate: "2024-07-17",
        price: 2499,
        originalPrice: 2999,
        spots: 8,
        totalSpots: 12,
        category: "expedition",
        type: "Wildlife Expedition",
        difficulty: "Intermediate to Advanced",
        duration: "7 days",
        languages: ["English"],
        rating: 5.0,
        reviews: 94,
        featured: true,
        included: [
            "Game drives in open vehicles",
            "Luxury tented accommodation",
            "All meals",
            "Professional wildlife photography guide",
            "Park entry fees",
            "Post-processing masterclass"
        ]
    },
    {
        id: 3,
        title: "Northern Lights Photo Tour",
        description: "Chase the Aurora Borealis across Iceland's most photogenic landscapes.",
        longDescription: "Experience the magic of the Northern Lights while learning night photography techniques. This tour takes you to Iceland's best Aurora viewing spots including Jökulsárlón Glacier Lagoon and Kirkjufell Mountain.",
        image: "/event-northern-lights.jpg",
        coverImage: "/event-northern-lights-cover.jpg",
        location: "Iceland",
        date: "2024-09-05",
        endDate: "2024-09-10",
        price: 1899,
        originalPrice: 2199,
        spots: 10,
        totalSpots: 14,
        category: "tour",
        type: "Northern Lights Tour",
        difficulty: "Beginner to Intermediate",
        duration: "5 days",
        languages: ["English"],
        rating: 4.8,
        reviews: 76,
        featured: false,
        included: [
            "Night photography workshops",
            "4x4 transportation",
            "Accommodation",
            "Warm drinks & snacks",
            "Tripod rental",
            "Post-processing guide"
        ]
    },
    {
        id: 4,
        title: "Venice Carnival Photo Tour",
        description: "Capture the mystery and romance of Venice during the famous Carnival season.",
        longDescription: "Join us for a unique photography experience during Venice Carnival. Learn street and portrait photography while capturing elaborate costumes, masks, and the city's stunning architecture.",
        image: "/event-venice.jpg",
        coverImage: "/event-venice-cover.jpg",
        location: "Venice, Italy",
        date: "2025-02-10",
        endDate: "2025-02-15",
        price: 1599,
        originalPrice: 1899,
        spots: 15,
        totalSpots: 18,
        category: "tour",
        type: "Cultural Photography",
        difficulty: "All Levels",
        duration: "5 days",
        languages: ["English", "Italian"],
        rating: 4.9,
        reviews: 103,
        featured: true,
        included: [
            "Private gondola photo session",
            "Costume portrait sessions",
            "Accommodation in historic hotel",
            "Water taxi transportation",
            "Entry to exclusive Carnival events",
            "Editing workshop"
        ]
    },
    {
        id: 5,
        title: "Japanese Cherry Blossom Workshop",
        description: "Photograph Japan's iconic cherry blossoms during peak bloom season.",
        longDescription: "Capture the ephemeral beauty of sakura season in Japan's most photogenic locations including Tokyo, Kyoto, and Mount Fuji.",
        image: "/event-japan.jpg",
        coverImage: "/event-japan-cover.jpg",
        location: "Japan",
        date: "2025-03-20",
        endDate: "2025-03-28",
        price: 2299,
        originalPrice: 2599,
        spots: 10,
        totalSpots: 12,
        category: "workshop",
        type: "Spring Photography",
        difficulty: "All Levels",
        duration: "8 days",
        languages: ["English", "Japanese"],
        rating: 4.9,
        reviews: 67,
        featured: false,
        included: [
            "JR Rail Pass (7 days)",
            "Accommodation",
            "Expert photography guidance",
            "Early morning shoots",
            "Night photography sessions",
            "Cultural experiences"
        ]
    },
    {
        id: 6,
        title: "Underwater Photography Course",
        description: "Learn underwater photography techniques in the crystal-clear waters of Maldives.",
        longDescription: "Master underwater photography with professional guidance in one of the world's best diving locations. Perfect for both beginners and experienced divers.",
        image: "/event-maldives.jpg",
        coverImage: "/event-maldives-cover.jpg",
        location: "Maldives",
        date: "2024-08-10",
        endDate: "2024-08-17",
        price: 2799,
        originalPrice: 3299,
        spots: 6,
        totalSpots: 8,
        category: "expedition",
        type: "Underwater Workshop",
        difficulty: "Intermediate",
        duration: "7 days",
        languages: ["English"],
        rating: 5.0,
        reviews: 42,
        featured: false,
        included: [
            "Diving certification (if needed)",
            "Underwater housing rental",
            "Luxury overwater villa",
            "All meals",
            "Boat trips to dive sites",
            "Underwater editing session"
        ]
    }
];

const destinations = [
    "All Destinations",
    "Bali, Indonesia",
    "Serengeti, Tanzania",
    "Iceland",
    "Venice, Italy",
    "Japan",
    "Maldives"
];

const categories = [
    { id: "all", label: "All Events", icon: FaGlobe },
    { id: "workshop", label: "Workshops", icon: FaCamera },
    { id: "expedition", label: "Expeditions", icon: FaMountain },
    { id: "tour", label: "Photo Tours", icon: FaUmbrellaBeach }
];

export default function EventsPage() {
    const [events, setEvents] = useState(eventsData);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedDestination, setSelectedDestination] = useState("All Destinations");
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [bookingOpen, setBookingOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Check if user is logged in (simulated - in real app, this would come from auth context)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Login form state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    
    // Booking form state
    const [bookingForm, setBookingForm] = useState({
        name: "",
        email: "",
        phone: "",
        numberOfPeople: "1",
        specialRequests: ""
    });

    // Filter events
    useEffect(() => {
        let filtered = eventsData;

        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter(event => event.category === selectedCategory);
        }

        if (selectedDestination !== "All Destinations") {
            filtered = filtered.filter(event => event.location === selectedDestination);
        }

        setEvents(filtered);
    }, [searchTerm, selectedCategory, selectedDestination]);

    const getDiscountedPrice = (price: number, originalPrice: number) => {
        if (price < originalPrice) {
            const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            return { price, originalPrice, discount };
        }
        return { price, originalPrice: null, discount: 0 };
    };

    const toggleWishlist = (eventId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isLoggedIn) {
            setLoginDialogOpen(true);
            toast.info("Please login to add to wishlist");
            return;
        }
        
        if (wishlist.includes(eventId)) {
            setWishlist(wishlist.filter(id => id !== eventId));
            toast.info("Removed from wishlist");
        } else {
            setWishlist([...wishlist, eventId]);
            toast.success("Added to wishlist");
        }
    };

    const handleBookNow = (event: any) => {
        if (!isLoggedIn) {
            setSelectedEvent(event);
            setLoginDialogOpen(true);
            toast.info("Please login to book this event");
            return;
        }
        setSelectedEvent(event);
        setBookingOpen(true);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate login API call
        setTimeout(() => {
            if (loginEmail && loginPassword) {
                setIsLoggedIn(true);
                setLoginDialogOpen(false);
                toast.success("Login Successful! 🎉", {
                    description: "Welcome back! You can now book your event.",
                });
                setLoginEmail("");
                setLoginPassword("");
                
                // If there was a pending booking, open booking modal
                if (selectedEvent) {
                    setBookingOpen(true);
                }
            } else {
                toast.error("Login Failed", {
                    description: "Please check your email and password.",
                });
            }
            setIsSubmitting(false);
        }, 1500);
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            toast.success("Booking Request Sent! 🎉", {
                description: `Your spot for ${selectedEvent.title} has been reserved. We'll contact you within 24 hours to confirm.`,
                duration: 5000,
            });
            
            // Reset form
            setBookingForm({
                name: "",
                email: "",
                phone: "",
                numberOfPeople: "1",
                specialRequests: ""
            });
            setBookingOpen(false);
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/events-hero.jpg"
                        alt="Photography events"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <FaCamera className="text-emerald-400" />
                            <span className="text-white text-sm">Upcoming Events</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-4"
                    >
                        Photography Events & Workshops
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
                    >
                        Join our expert photographers on unforgettable journeys around the world
                    </motion.p>
                </div>
            </section>

            {/* Search & Filter Section */}
            <section className="py-8 px-6 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                            <Input
                                className="pl-10"
                                placeholder="Search events by title, description, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Select value={selectedDestination} onValueChange={setSelectedDestination}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Destination" />
                            </SelectTrigger>
                            <SelectContent>
                                {destinations.map((dest) => (
                                    <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="py-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
                        <TabsList className="grid w-full grid-cols-4 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <TabsTrigger 
                                        key={category.id} 
                                        value={category.id} 
                                        className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:shadow-sm rounded-md"
                                    >
                                        <Icon className="text-sm" />
                                        <span className="hidden sm:inline">{category.label}</span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </Tabs>
                </div>
            </section>

            {/* Events Grid */}
            <section className="py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    {events.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20"
                        >
                            <FaCamera className="text-6xl text-zinc-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">No Events Found</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Try adjusting your search or filter criteria
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event, index) => {
                                const { price: finalPrice, originalPrice: origPrice, discount } = getDiscountedPrice(
                                    event.price,
                                    event.originalPrice
                                );
                                const spotsLeft = event.totalSpots - event.spots;
                                const spotsPercentage = (spotsLeft / event.totalSpots) * 100;

                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -8 }}
                                    >
                                        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col group bg-white dark:bg-zinc-900">
                                            <div className="relative h-52 overflow-hidden">
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                
                                                {discount > 0 && (
                                                    <motion.div
                                                        initial={{ x: -100, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10 shadow-lg"
                                                    >
                                                        -{discount}%
                                                    </motion.div>
                                                )}
                                                
                                                {event.featured && (
                                                    <motion.div
                                                        initial={{ x: 100, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        className="absolute top-4 right-4 bg-emerald-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10 shadow-lg"
                                                    >
                                                        Featured
                                                    </motion.div>
                                                )}
                                                
                                                <button
                                                    onClick={(e) => toggleWishlist(event.id, e)}
                                                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 z-10 hover:scale-110 transition-transform"
                                                >
                                                    {wishlist.includes(event.id) ? (
                                                        <FaHeart className="text-red-500 text-sm" />
                                                    ) : (
                                                        <FaRegHeart className="text-zinc-600 text-sm" />
                                                    )}
                                                </button>
                                                
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        whileHover={{ scale: 1.1 }}
                                                        className="bg-white/20 backdrop-blur-sm rounded-full p-3"
                                                    >
                                                        <FaCamera className="text-white text-2xl" />
                                                    </motion.div>
                                                </div>
                                                
                                                <div className="absolute bottom-4 left-4">
                                                    <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 inline-flex items-center gap-2">
                                                        <FaCalendarAlt className="text-emerald-400 text-xs" />
                                                        <span className="text-white text-xs font-medium">
                                                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <CardHeader>
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <Badge variant="secondary" className="gap-1">
                                                        <FaTag className="text-xs" /> {event.type}
                                                    </Badge>
                                                    <Badge variant="secondary" className="gap-1">
                                                        <FaClock className="text-xs" /> {event.duration}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors line-clamp-1">
                                                    <Link href={`/events/${event.id}`}>{event.title}</Link>
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-2">
                                                    <FaMapMarkerAlt className="text-emerald-600 text-sm" />
                                                    {event.location}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="flex-grow">
                                                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                                                    {event.description}
                                                </p>

                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <FaStar className="text-yellow-400" />
                                                        <span className="font-semibold text-sm">{event.rating}</span>
                                                        <span className="text-zinc-500 text-xs">({event.reviews})</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-zinc-500">
                                                        <FaUsers className="text-xs" />
                                                        <span className="text-xs">{spotsLeft} spots left</span>
                                                    </div>
                                                </div>

                                                <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 mb-4 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${spotsPercentage}%` }}
                                                        transition={{ duration: 1, delay: index * 0.1 }}
                                                        className="bg-emerald-600 h-full rounded-full"
                                                    />
                                                </div>

                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold text-emerald-600">${finalPrice}</span>
                                                    {origPrice && (
                                                        <span className="text-zinc-400 line-through text-sm">${origPrice}</span>
                                                    )}
                                                    <span className="text-xs text-zinc-500">/ person</span>
                                                </div>
                                            </CardContent>

                                            <CardFooter>
                                                <Button 
                                                    onClick={() => handleBookNow(event)}
                                                    className="w-full gap-2 group/btn bg-emerald-600 hover:bg-emerald-700"
                                                >
                                                    Book Now 
                                                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Login Dialog - Required before booking */}
            <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <FaLock className="text-emerald-600" />
                            Login Required
                        </DialogTitle>
                        <DialogDescription>
                            Please login to your account to book events and add to wishlist.
                            {selectedEvent && (
                                <p className="mt-2 text-sm font-medium text-emerald-600">
                                    You're booking: {selectedEvent.title}
                                </p>
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
                            <p className="text-xs text-amber-800 dark:text-amber-400">
                                Demo credentials: any email + any password (min 1 character)
                            </p>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Booking Modal - Only shown after login */}
            <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <FaCalendarAlt className="text-emerald-600" />
                            Book Your Spot
                        </DialogTitle>
                        <DialogDescription>
                            {selectedEvent && (
                                <div className="mt-2">
                                    <p className="font-semibold text-zinc-900 dark:text-white">{selectedEvent.title}</p>
                                    <p className="text-sm text-zinc-500">{selectedEvent.location}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="secondary">{selectedEvent.duration}</Badge>
                                        <Badge variant="secondary">${selectedEvent.price}/person</Badge>
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <FaUser className="text-emerald-600 text-sm" />
                                Full Name *
                            </Label>
                            <Input
                                id="name"
                                placeholder="Enter your full name"
                                value={bookingForm.name}
                                onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <FaEnvelope className="text-emerald-600 text-sm" />
                                Email Address *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={bookingForm.email}
                                onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <FaPhone className="text-emerald-600 text-sm" />
                                Phone Number *
                            </Label>
                            <Input
                                id="phone"
                                placeholder="+1 234 567 8900"
                                value={bookingForm.phone}
                                onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="people" className="flex items-center gap-2">
                                <FaUsers className="text-emerald-600 text-sm" />
                                Number of People *
                            </Label>
                            <Select 
                                value={bookingForm.numberOfPeople} 
                                onValueChange={(value) => setBookingForm({...bookingForm, numberOfPeople: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select number of people" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num} {num === 1 ? 'person' : 'people'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requests" className="flex items-center gap-2">
                                <FaComment className="text-emerald-600 text-sm" />
                                Special Requests (Optional)
                            </Label>
                            <Textarea
                                id="requests"
                                placeholder="Any special requirements or questions?"
                                rows={3}
                                value={bookingForm.specialRequests}
                                onChange={(e) => setBookingForm({...bookingForm, specialRequests: e.target.value})}
                            />
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <FaCheckCircle className="text-emerald-600 text-sm" />
                                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">No Payment Required</span>
                            </div>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400">
                                Book now and pay later! We'll contact you to confirm your spot and arrange payment.
                            </p>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>Processing...</>
                            ) : (
                                <>Confirm Booking <FaArrowRight className="ml-2" /></>
                            )}
                        </Button>

                        <p className="text-xs text-center text-zinc-500">
                            Free cancellation up to 14 days before the event
                        </p>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Newsletter Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Don't Miss Our Future Events
                        </h2>
                        <p className="text-lg text-emerald-100 mb-8">
                            Subscribe to get updates about new workshops, early bird discounts, and exclusive photography tours
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <Input
                                type="email"
                                placeholder="Your email address"
                                className="bg-white dark:bg-white text-zinc-900 h-12"
                            />
                            <Button className="bg-white text-emerald-600 hover:bg-gray-100 h-12 px-8">
                                Subscribe
                            </Button>
                        </div>
                        <p className="text-xs text-emerald-200 mt-4">
                            No spam, unsubscribe anytime.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}