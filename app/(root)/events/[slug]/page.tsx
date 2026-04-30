"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaClock,
    FaUsers,
    FaStar,
    FaCamera,
    FaArrowLeft,
    FaCheckCircle,
    FaShare,
    FaHeart,
    FaLanguage,
    FaAward,
    FaChevronLeft,
    FaChevronRight,
    FaRegClock
} from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Complete static event data
const event = {
    id: 1,
    title: "Bali Photography Workshop",
    description: "Capture the magic of Bali's rice terraces, temples, and beaches in this 5-day intensive workshop.",
    longDescription: "Join us for an immersive photography experience in the paradise island of Bali. You'll learn landscape, portrait, and street photography techniques while exploring iconic locations like Ubud, Tanah Lot, and the Tegallalang Rice Terraces. Professional photographers will guide you through composition, lighting, and post-processing techniques.\n\nThis workshop is designed for photographers of all skill levels who want to improve their craft while experiencing the beauty and culture of Bali. You'll receive personalized instruction in small groups, ensuring you get the most out of every shoot.\n\nBy the end of this workshop, you'll have a stunning portfolio of images and the confidence to capture amazing photos anywhere in the world.",
    image: "/event-bali.jpg",
    coverImage: "/event-bali-cover.jpg",
    gallery: [
        { src: "/bali-gallery-1.jpg", title: "Rice Terraces at Sunrise", location: "Tegallalang" },
        { src: "/bali-gallery-2.jpg", title: "Tanah Lot Temple", location: "Tanah Lot" },
        { src: "/bali-gallery-3.jpg", title: "Ubud Monkey Forest", location: "Ubud" },
        { src: "/bali-gallery-4.jpg", title: "Waterfall Magic", location: "Tegenungan" },
        { src: "/bali-gallery-5.jpg", title: "Traditional Dance", location: "Ubud Palace" },
        { src: "/bali-gallery-6.jpg", title: "Sunset at Kuta", location: "Kuta Beach" }
    ],
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
    included: [
        "Professional photography guidance",
        "Accommodation (5 nights)",
        "Meals (breakfast & lunch)",
        "Transportation between locations",
        "Entry fees to all locations",
        "Post-processing session",
        "Welcome package with gear guide",
        "Certificate of completion"
    ],
    notIncluded: [
        "International flights",
        "Dinner meals",
        "Travel insurance",
        "Personal expenses",
        "Camera equipment rental"
    ],
    itinerary: [
        { day: 1, title: "Arrival & Introduction", description: "Welcome dinner, gear check, and workshop overview", activities: ["Airport pickup", "Hotel check-in", "Welcome dinner", "Equipment briefing"], time: "3:00 PM - 8:00 PM" },
        { day: 2, title: "Rice Terraces & Waterfalls", description: "Sunrise shoot at Tegallalang, afternoon at Tegenungan Waterfall", activities: ["Sunrise photography", "Rice terrace walk", "Waterfall shoot", "Photo review session"], time: "5:00 AM - 6:00 PM" },
        { day: 3, title: "Temple Photography", description: "Explore Tanah Lot and Uluwatu temples at golden hour", activities: ["Morning street photography", "Temple exploration", "Golden hour shoot", "Sunset dinner"], time: "6:00 AM - 7:00 PM" },
        { day: 4, title: "Cultural Portraits", description: "Street photography in Ubud, traditional dance performance", activities: ["Local market visit", "Portrait workshop", "Traditional dance show", "Night photography"], time: "7:00 AM - 9:00 PM" },
        { day: 5, title: "Beach Sunset & Editing", description: "Beach photography workshop, post-processing session", activities: ["Beach sunrise", "Editing workshop", "Portfolio review", "Farewell dinner"], time: "5:30 AM - 9:00 PM" }
    ],
    photographer: {
        id: 1,
        name: "Alex Morgan",
        role: "Lead Adventure Photographer",
        bio: "Alex has been photographing Bali for over 10 years and knows all the hidden gems. His work has been featured in National Geographic and Travel + Leisure.",
        image: "/photographer-1.jpg",
        rating: 4.9,
        experience: "8+ years"
    },
    rating: 4.9,
    reviews: [
        {
            id: 1,
            user: "Sarah Johnson",
            avatar: "/avatar-1.jpg",
            rating: 5,
            date: "2024-03-15",
            comment: "Absolutely life-changing experience! Alex's guidance transformed my photography skills. The locations were breathtaking and the instruction was top-notch."
        },
        {
            id: 2,
            user: "Michael Chen",
            avatar: "/avatar-2.jpg",
            rating: 5,
            date: "2024-02-10",
            comment: "Best investment I've made in my photography journey. The small group size meant lots of personal attention. Already planning my next workshop!"
        },
        {
            id: 3,
            user: "Emma Rodriguez",
            avatar: "/avatar-3.jpg",
            rating: 4.5,
            date: "2024-01-20",
            comment: "Amazing experience! The itinerary was well-planned and the photography spots were incredible. Would highly recommend to any photography enthusiast."
        }
    ],
    faqs: [
        {
            question: "What camera equipment should I bring?",
            answer: "A DSLR or mirrorless camera with a wide-angle lens (16-35mm) and a telephoto lens (70-200mm). A tripod is essential for sunrise/sunset shoots."
        },
        {
            question: "Is this suitable for beginners?",
            answer: "Absolutely! Our workshops cater to all skill levels. We provide guidance from basic camera settings to advanced composition techniques."
        },
        {
            question: "What's the weather like?",
            answer: "June is the dry season in Bali with temperatures around 27-30°C (80-86°F). Mornings can be cool, so bring a light jacket."
        }
    ]
};

export default function EventDetailPage() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(null);
    const [numberOfPeople, setNumberOfPeople] = useState("1");
    const [bookingOpen, setBookingOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        toast.success("Booking Request Sent! 🎉", {
            description: `We'll contact you within 24 hours to confirm your spot for ${event.title}`,
        });
        setBookingOpen(false);
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied!", {
            description: "Event link copied to clipboard",
        });
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % event.gallery.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + event.gallery.length) % event.gallery.length);
    };

    const spotsLeft = event.totalSpots - event.spots;
    const discount = event.originalPrice ? Math.round(((event.originalPrice - event.price) / event.originalPrice) * 100) : 0;
    const startDate = new Date(event.date);
    const endDate = new Date(event.endDate);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
            {/* Back Button */}
            <div className="fixed top-24 left-6 z-20">
                <Button
                    variant="outline"
                    className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
                    onClick={() => router.back()}
                >
                    <FaArrowLeft className="mr-2" /> Back
                </Button>
            </div>

            {/* Share & Wishlist Buttons */}
            <div className="fixed top-24 right-6 z-20 flex gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
                    onClick={handleShare}
                >
                    <FaShare />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/90 dark:bg-black/90 backdrop-blur-sm"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                >
                    <FaHeart className={isWishlisted ? "text-red-500 fill-red-500" : ""} />
                </Button>
            </div>

            {/* Hero Section */}
            <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
                <Image
                    src={event.coverImage || event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-emerald-600">{event.type}</Badge>
                            {discount > 0 && (
                                <Badge className="bg-red-500">-{discount}% OFF</Badge>
                            )}
                            {spotsLeft <= 3 && (
                                <Badge className="bg-orange-500">Only {spotsLeft} spots left!</Badge>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">{event.title}</h1>
                        <div className="flex flex-wrap gap-4 text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt />
                                <span>{startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaClock />
                                <span>{event.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaStar className="text-yellow-400" />
                                <span>{event.rating} ({event.reviews.length} reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About This Event</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                                    {event.longDescription}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Itinerary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Daily Itinerary</CardTitle>
                                <CardDescription>Day-by-day breakdown of your photography adventure</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {event.itinerary.map((day, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                                                    <span className="font-bold text-emerald-600">Day {day.day}</span>
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{day.title}</h3>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{day.description}</p>
                                                <div className="flex flex-wrap gap-2 text-xs">
                                                    <Badge variant="secondary" className="gap-1">
                                                        <FaRegClock /> {day.time}
                                                    </Badge>
                                                    {day.activities?.map((activity, i) => (
                                                        <Badge key={i} variant="outline">{activity}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Gallery */}
                        {event.gallery && event.gallery.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Photo Gallery</CardTitle>
                                    <CardDescription>Preview of what you'll capture</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {event.gallery.slice(0, 6).map((photo, idx) => (
                                            <motion.div
                                                key={idx}
                                                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => setCurrentImageIndex(idx)}
                                            >
                                                <Image
                                                    src={photo.src}
                                                    alt={photo.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <FaCamera className="text-white text-2xl" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Image Modal */}
                        <Dialog open={currentImageIndex !== null} onOpenChange={() => setCurrentImageIndex(null)}>
                            <DialogContent className="max-w-4xl">
                                <div className="relative">
                                    <div className="relative h-[60vh]">
                                        {currentImageIndex !== null && (
                                            <Image
                                                src={event.gallery[currentImageIndex]?.src}
                                                alt={event.gallery[currentImageIndex]?.title}
                                                fill
                                                className="object-contain"
                                            />
                                        )}
                                    </div>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white"
                                    >
                                        <FaChevronRight />
                                    </button>
                                    {currentImageIndex !== null && (
                                        <p className="text-center mt-4 text-zinc-600 dark:text-zinc-400">
                                            {event.gallery[currentImageIndex]?.title} - {event.gallery[currentImageIndex]?.location}
                                        </p>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* What's Included */}
                        <Card>
                            <CardHeader>
                                <CardTitle>What's Included</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-emerald-600 mb-3">Included</h3>
                                        <ul className="space-y-2">
                                            {event.included.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <FaCheckCircle className="text-emerald-600 text-sm" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-red-600 mb-3">Not Included</h3>
                                        <ul className="space-y-2">
                                            {event.notIncluded.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                    <span className="w-4 h-0.5 bg-red-400 rounded" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Meet Your Photographer */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Meet Your Photographer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <Avatar className="w-20 h-20">
                                        <AvatarImage src={event.photographer.image} />
                                        <AvatarFallback>{event.photographer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">{event.photographer.name}</h3>
                                        <p className="text-emerald-600 dark:text-emerald-400 text-sm mb-2">{event.photographer.role}</p>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{event.photographer.bio}</p>
                                        <Link href={`/photographers/${event.photographer.id}`}>
                                            <Button variant="link" className="px-0 mt-2">
                                                View Full Profile →
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Guest Reviews</CardTitle>
                                <CardDescription>What past participants say</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {event.reviews.map((review) => (
                                    <div key={review.id} className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={review.avatar} />
                                                <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-zinc-900 dark:text-white">{review.user}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} className={`text-xs ${i < review.rating ? 'text-yellow-400' : 'text-zinc-300'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-zinc-500">{new Date(review.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-zinc-600 dark:text-zinc-400 italic">"{review.comment}"</p>
                                        <Separator />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* FAQs */}
                        {event.faqs && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Frequently Asked Questions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {event.faqs.map((faq, idx) => (
                                        <div key={idx}>
                                            <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{faq.question}</h3>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
                                            {idx < event.faqs.length - 1 && <Separator className="mt-3" />}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Booking Sidebar */}
                    <div className="space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Book Your Spot</CardTitle>
                                <CardDescription>Secure your place now</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-emerald-600">${event.price}</span>
                                    {event.originalPrice && (
                                        <span className="text-zinc-400 line-through">${event.originalPrice}</span>
                                    )}
                                    <span className="text-sm text-zinc-500">/ person</span>
                                </div>

                                {discount > 0 && (
                                    <Badge className="bg-green-500">Save ${event.originalPrice - event.price}</Badge>
                                )}

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-600 dark:text-zinc-400">Available Spots</span>
                                        <span className={`font-semibold ${spotsLeft <= 3 ? 'text-orange-500' : 'text-emerald-600'}`}>
                                            {spotsLeft} / {event.totalSpots}
                                        </span>
                                    </div>
                                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                                        <div
                                            className="bg-emerald-600 h-2 rounded-full transition-all"
                                            style={{ width: `${(spotsLeft / event.totalSpots) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    <FaUsers />
                                    <span>Maximum {event.totalSpots} participants</span>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaCalendarAlt className="text-emerald-600" />
                                        <span>{startDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaClock className="text-emerald-600" />
                                        <span>{event.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaLanguage className="text-emerald-600" />
                                        <span>Languages: {event.languages.join(", ")}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaAward className="text-emerald-600" />
                                        <span>Difficulty: {event.difficulty}</span>
                                    </div>
                                </div>

                                <Separator />

                                <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg">
                                            Book Now - ${event.price}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Book {event.title}</DialogTitle>
                                            <DialogDescription>
                                                Fill out the form to secure your spot
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Select Date</Label>
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={setSelectedDate}
                                                    disabled={(date) => date < startDate || date > endDate}
                                                    className="rounded-md border"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Number of People</Label>
                                                <Select value={numberOfPeople} onValueChange={setNumberOfPeople}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[1, 2, 3, 4, 5, 6].map((num) => (
                                                            <SelectItem key={num} value={num.toString()}>
                                                                {num} {num === 1 ? 'person' : 'people'}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Full Name</Label>
                                                <Input placeholder="John Doe" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input type="email" placeholder="john@example.com" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Phone</Label>
                                                <Input placeholder="+1 234 567 8900" />
                                            </div>
                                            <Button type="submit" className="w-full bg-emerald-600">
                                                Confirm Booking
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <p className="text-xs text-center text-zinc-500">
                                    Free cancellation up to 14 days before the event
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}