"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    FaCamera,
    FaCalendarAlt,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaComment,
    FaArrowLeft,
    FaCheckCircle,
    FaCreditCard,
    FaShieldAlt,
    FaClock,
    FaMapMarkerAlt,
    FaUsers,
    FaStar
} from "react-icons/fa";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {toast} from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";

// Sample photographer data (in real app, this would come from an API)
const photographersData = {
    1: {
        id: 1,
        name: "Alex Morgan",
        role: "Lead Adventure Photographer",
        specialty: "Adventure & Landscape",
        location: "Bali, Indonesia",
        rating: 4.9,
        sessions: 450,
        image: "/photographer-1.jpg",
        pricePerDay: 299,
        packages: [
            { id: "half", name: "Half Day", duration: "4 hours", price: 199, photos: "50+ edited photos" },
            { id: "full", name: "Full Day", duration: "8 hours", price: 299, photos: "100+ edited photos" },
            { id: "two", name: "2 Days", duration: "16 hours", price: 550, photos: "200+ edited photos" }
        ]
    },
    2: {
        id: 2,
        name: "Sofia Rodriguez",
        role: "Cultural & Portrait Specialist",
        specialty: "Cultural & Portrait",
        location: "Barcelona, Spain",
        rating: 4.8,
        sessions: 320,
        image: "/photographer-2.jpg",
        pricePerDay: 249,
        packages: [
            { id: "half", name: "Half Day", duration: "4 hours", price: 179, photos: "50+ edited photos" },
            { id: "full", name: "Full Day", duration: "8 hours", price: 249, photos: "100+ edited photos" },
            { id: "two", name: "2 Days", duration: "16 hours", price: 450, photos: "200+ edited photos" }
        ]
    },
    3: {
        id: 3,
        name: "David Kim",
        role: "Wedding & Romance Expert",
        specialty: "Wedding & Romance",
        location: "Paris, France",
        rating: 5.0,
        sessions: 680,
        image: "/photographer-3.jpg",
        pricePerDay: 399,
        packages: [
            { id: "half", name: "Half Day", duration: "4 hours", price: 299, photos: "50+ edited photos" },
            { id: "full", name: "Full Day", duration: "8 hours", price: 399, photos: "100+ edited photos" },
            { id: "two", name: "2 Days", duration: "16 hours", price: 750, photos: "200+ edited photos" }
        ]
    }
};

export default function BookingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const photographerId = searchParams.get("photographer");

    const [photographer, setPhotographer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        date: null,
        packageId: "",
        name: "",
        email: "",
        phone: "",
        specialRequests: "",
        groupSize: "2",
        hearAbout: "",
        termsAccepted: false
    });
    const [paymentMethod, setPaymentMethod] = useState("deposit");

    useEffect(() => {
        if (photographerId && photographersData[photographerId]) {
            setPhotographer(photographersData[photographerId]);
            // Pre-select first package
            setFormData(prev => ({ ...prev, packageId: photographersData[photographerId].packages[0].id }));
        }
        setLoading(false);
    }, [photographerId]);

    const getSelectedPackage = () => {
        return photographer?.packages.find(pkg => pkg.id === formData.packageId);
    };

    const calculateTotal = () => {
        const selectedPackage = getSelectedPackage();
        if (!selectedPackage) return 0;

        if (paymentMethod === "deposit") {
            return Math.round(selectedPackage.price * 0.3); // 30% deposit
        }
        return selectedPackage.price;
    };

    const handleNextStep = () => {
        // Validate current step
        if (step === 1) {
            if (!formData.date) {
                toast({
                    title: "Error",
                    description: "Please select a date for your photoshoot",
                    variant: "destructive"
                });
                return;
            }
            if (!formData.packageId) {
                toast({
                    title: "Error",
                    description: "Please select a photography package",
                    variant: "destructive"
                });
                return;
            }
        }

        if (step === 2) {
            if (!formData.name || !formData.email) {
                toast({
                    title: "Error",
                    description: "Please fill in all required fields",
                    variant: "destructive"
                });
                return;
            }
            if (!formData.termsAccepted) {
                toast({
                    title: "Error",
                    description: "Please accept the terms and conditions",
                    variant: "destructive"
                });
                return;
            }
        }

        setStep(step + 1);
    };

    const handleSubmit = async () => {
        // Here you would send the booking to your backend
        toast({
            title: "Booking Confirmed! 🎉",
            description: `Your session with ${photographer.name} has been booked. We've sent a confirmation email with all details.`,
        });

        // Redirect to success page or home
        setTimeout(() => {
            router.push("/booking-success");
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading booking information...</p>
                </div>
            </div>
        );
    }

    if (!photographer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Photographer Not Found</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">Please select a valid photographer to continue.</p>
                    <Link href="/photographers">
                        <Button>Browse Photographers</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href={`/photographers/${photographerId}`}>
                        <Button variant="ghost" className="mb-4">
                            <FaArrowLeft className="mr-2" /> Back to Photographer
                        </Button>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                        Book Your Photography Session
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Complete the form below to secure your spot with {photographer.name}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Booking Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress Steps */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center">
                                    {[
                                        { step: 1, label: "Select Package", icon: FaCamera },
                                        { step: 2, label: "Your Details", icon: FaUser },
                                        { step: 3, label: "Payment", icon: FaCreditCard }
                                    ].map((item) => (
                                        <div key={item.step} className="flex-1 text-center">
                                            <div className={`relative ${item.step < step ? 'text-emerald-600' : item.step === step ? 'text-emerald-600' : 'text-zinc-400'}`}>
                                                <div className={`w-10 h-10 rounded-full border-2 mx-auto mb-2 flex items-center justify-center ${
                                                    item.step < step
                                                        ? 'border-emerald-600 bg-emerald-600 text-white'
                                                        : item.step === step
                                                            ? 'border-emerald-600 text-emerald-600'
                                                            : 'border-zinc-300 text-zinc-400'
                                                }`}>
                                                    {item.step < step ? <FaCheckCircle /> : item.step}
                                                </div>
                                                <p className="text-sm font-medium hidden md:block">{item.label}</p>
                                            </div>
                                            {item.step < 3 && (
                                                <div className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 ${
                                                    item.step < step ? 'bg-emerald-600' : 'bg-zinc-200 dark:bg-zinc-700'
                                                }`} style={{ transform: 'translateX(-50%)' }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Step 1: Package Selection */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Select Your Photography Package</CardTitle>
                                        <CardDescription>Choose the package that best fits your needs</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Select Date *</Label>
                                            <Calendar
                                                mode="single"
                                                selected={formData.date}
                                                onSelect={(date) => setFormData({...formData, date})}
                                                className="rounded-md border"
                                                disabled={(date) => date < new Date()}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Select Package *</Label>
                                            <RadioGroup
                                                value={formData.packageId}
                                                onValueChange={(value) => setFormData({...formData, packageId: value})}
                                                className="space-y-3"
                                            >
                                                {photographer.packages.map((pkg) => (
                                                    <div key={pkg.id} className="flex items-center justify-between border rounded-lg p-4 hover:border-emerald-500 transition-colors">
                                                        <div className="flex items-start gap-3">
                                                            <RadioGroupItem value={pkg.id} id={pkg.id} className="mt-1" />
                                                            <div>
                                                                <Label htmlFor={pkg.id} className="font-semibold text-base">
                                                                    {pkg.name}
                                                                </Label>
                                                                <p className="text-sm text-zinc-500">{pkg.duration} • {pkg.photos}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-emerald-600">${pkg.price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Group Size</Label>
                                            <Select
                                                value={formData.groupSize}
                                                onValueChange={(value) => setFormData({...formData, groupSize: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select number of people" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">Just me (1 person)</SelectItem>
                                                    <SelectItem value="2">Couple (2 people)</SelectItem>
                                                    <SelectItem value="3-5">Small group (3-5 people)</SelectItem>
                                                    <SelectItem value="6-10">Large group (6-10 people)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleNextStep}>
                                            Continue to Your Details <FaArrowLeft className="ml-2 rotate-180" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step 2: Personal Details */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your Information</CardTitle>
                                        <CardDescription>Please provide your contact details</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Full Name *</Label>
                                                <div className="relative">
                                                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                                                    <Input
                                                        className="pl-10"
                                                        placeholder="John Doe"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Email Address *</Label>
                                                <div className="relative">
                                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                                                    <Input
                                                        className="pl-10"
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Phone Number</Label>
                                            <div className="relative">
                                                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
                                                <Input
                                                    className="pl-10"
                                                    placeholder="+1 234 567 8900"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Special Requests</Label>
                                            <div className="relative">
                                                <FaComment className="absolute left-3 top-3 text-zinc-400" />
                                                <Textarea
                                                    className="pl-10"
                                                    placeholder="Any specific locations, themes, or requirements?"
                                                    rows={4}
                                                    value={formData.specialRequests}
                                                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>How did you hear about us?</Label>
                                            <Select
                                                value={formData.hearAbout}
                                                onValueChange={(value) => setFormData({...formData, hearAbout: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="social">Social Media</SelectItem>
                                                    <SelectItem value="google">Google Search</SelectItem>
                                                    <SelectItem value="friend">Friend/Family</SelectItem>
                                                    <SelectItem value="advertisement">Advertisement</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="terms"
                                                checked={formData.termsAccepted}
                                                onCheckedChange={(checked) =>
                                                    setFormData({...formData, termsAccepted: checked})
                                                }
                                            />
                                            <Label htmlFor="terms" className="text-sm">
                                                I agree to the{" "}
                                                <a href="#" className="text-emerald-600 hover:underline">
                                                    terms and conditions
                                                </a>{" "}
                                                and{" "}
                                                <a href="#" className="text-emerald-600 hover:underline">
                                                    cancellation policy
                                                </a>
                                            </Label>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                                Back
                                            </Button>
                                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleNextStep}>
                                                Continue to Payment
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Payment Information</CardTitle>
                                        <CardDescription>Secure payment powered by Stripe</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Payment Method</Label>
                                            <RadioGroup
                                                value={paymentMethod}
                                                onValueChange={setPaymentMethod}
                                                className="space-y-3"
                                            >
                                                <div className="flex items-center justify-between border rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        <RadioGroupItem value="deposit" id="deposit" />
                                                        <Label htmlFor="deposit" className="font-semibold">
                                                            Pay 30% Deposit
                                                        </Label>
                                                    </div>
                                                    <p className="text-sm text-zinc-500">Remaining 70% due on the day</p>
                                                </div>
                                                <div className="flex items-center justify-between border rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        <RadioGroupItem value="full" id="full" />
                                                        <Label htmlFor="full" className="font-semibold">
                                                            Pay in Full
                                                        </Label>
                                                    </div>
                                                    <p className="text-sm text-emerald-600">Save 5%</p>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        {/* Credit Card Form Placeholder */}
                                        <div className="space-y-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                                                💳 In a production environment, this would integrate with Stripe for secure payment processing
                                            </p>
                                            <div className="space-y-3">
                                                <div className="space-y-2">
                                                    <Label>Card Number</Label>
                                                    <Input placeholder="4242 4242 4242 4242" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-2">
                                                        <Label>Expiry Date</Label>
                                                        <Input placeholder="MM/YY" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>CVC</Label>
                                                        <Input placeholder="123" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Cardholder Name</Label>
                                                    <Input placeholder="John Doe" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                                                Back
                                            </Button>
                                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit}>
                                                Confirm Booking
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar - Booking Summary */}
                    <div className="space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Photographer Info */}
                                <div className="flex gap-3">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                        <Image
                                            src={photographer.image}
                                            alt={photographer.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-zinc-900 dark:text-white">{photographer.name}</h3>
                                        <p className="text-sm text-zinc-500">{photographer.role}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <FaStar className="text-yellow-400 text-xs" />
                                            <span className="text-sm">{photographer.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                {/*<Separator />*/}

                                {/* Selected Package */}
                                {getSelectedPackage() && (
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Selected Package</p>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{getSelectedPackage().name}</p>
                                                <p className="text-xs text-zinc-500">{getSelectedPackage().duration}</p>
                                            </div>
                                            <p className="font-bold text-emerald-600">${getSelectedPackage().price}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Date */}
                                {formData.date && (
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Selected Date</p>
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-emerald-600" />
                                            <span className="font-semibold">
                        {formData.date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                      </span>
                                        </div>
                                    </div>
                                )}

                                {/* Group Size */}
                                {formData.groupSize && (
                                    <div>
                                        <p className="text-sm text-zinc-500 mb-1">Group Size</p>
                                        <div className="flex items-center gap-2">
                                            <FaUsers className="text-emerald-600" />
                                            <span>{formData.groupSize} people</span>
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                {/* Total */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-zinc-600 dark:text-zinc-400">Subtotal</span>
                                        <span>${getSelectedPackage()?.price || 0}</span>
                                    </div>
                                    {paymentMethod === "deposit" && (
                                        <div className="flex justify-between items-center text-sm text-zinc-500 mb-2">
                                            <span>Deposit (30%)</span>
                                            <span>${calculateTotal()}</span>
                                        </div>
                                    )}
                                    <Separator className="my-2" />
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-bold text-lg">Total Due {paymentMethod === "deposit" ? "Today" : ""}</span>
                                        <span className="text-2xl font-bold text-emerald-600">${calculateTotal()}</span>
                                    </div>
                                    {paymentMethod === "deposit" && (
                                        <p className="text-xs text-zinc-500 mt-2">
                                            * Remaining ${getSelectedPackage()?.price - calculateTotal()} due on the day of photoshoot
                                        </p>
                                    )}
                                </div>

                                <Separator />

                                {/* Trust Badges */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <FaShieldAlt className="text-emerald-600" />
                                        <span>Secure payment processing</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <FaClock className="text-emerald-600" />
                                        <span>Free cancellation up to 48 hours</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <FaCheckCircle className="text-emerald-600" />
                                        <span>Money-back guarantee</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}