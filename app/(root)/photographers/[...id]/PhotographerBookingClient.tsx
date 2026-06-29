"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
    FaClock,
    FaArrowLeft,
    FaCheckCircle,
    FaEnvelope,
    FaPhone,
    FaUser,
    FaWifi,
} from "react-icons/fa";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import BookingMap from "@/components/web/BookingMap";

import {
    Package,
    TimeSlot,
    DEFAULT_TIME_SLOTS,
    Photographer,
} from "@/types";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface PhotographerBookingClientProps {
    readonly initialPhotographer: Photographer;
    readonly initialPackages: Package[];
}

export default function PhotographerBookingClient({
    initialPhotographer,
    initialPackages,
}: PhotographerBookingClientProps) {

    const router = useRouter();

    const [photographer] = useState<Photographer>(initialPhotographer);

    const [packages] = useState<Package[]>(initialPackages);

    const [timeSlots, setTimeSlots] =
        useState<TimeSlot[]>(DEFAULT_TIME_SLOTS);

    const [loadingAvailability, setLoadingAvailability] =
        useState(false);

    const [selectedDate, setSelectedDate] =
        useState<Value>(new Date());

    const [selectedTime, setSelectedTime] =
        useState("");

    const [selectedPackage, setSelectedPackage] =
        useState("");

    const [clientName, setClientName] =
        useState("");

    const [clientEmail, setClientEmail] =
        useState("");

    const [clientPhone, setClientPhone] =
        useState("");

    const [specialRequests, setSpecialRequests] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [bookingStep, setBookingStep] =
        useState(1);

    // LOCATION
    const [selectedLocation, setSelectedLocation] = useState({
        latitude: -6.7924,
        longitude: 39.2083,
        address: "",
    });

 
    useEffect(() => {

        const fetchTimeSlots = async () => {

            if (!selectedDate) return;

            setLoadingAvailability(true);

            const dateStr =
                selectedDate instanceof Date
                    ? selectedDate.toISOString().split("T")[0]
                    : "";

            try {

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/photographers/${photographer.id}/availability?date=${dateStr}`
                );

                if (response.ok) {

                    const data = await response.json();

                    setTimeSlots(data);

                } else {

                    const slots = DEFAULT_TIME_SLOTS.map(slot => ({
                        ...slot,
                        available:
                            slot.available &&
                            !photographer.isBusy,
                    }));

                    setTimeSlots(slots);
                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoadingAvailability(false);
            }
        };

        if (photographer.id && selectedDate) {
            fetchTimeSlots();
        }

    }, [photographer.id, selectedDate, photographer.isBusy]);

    const handleDateChange = (value: Value) => {

        setSelectedDate(value);

        setSelectedTime("");
    };

    // SUBMIT BOOKING
    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        setIsSubmitting(true);

        if (
            !selectedDate ||
            !selectedTime ||
            !selectedPackage ||
            !clientName ||
            !clientEmail
        ) {

            toast.error("Please fill all required fields");

            setIsSubmitting(false);

            return;
        }

        const selectedPackageData =
            packages.find(
                (p) => p.id === selectedPackage
            );

        const bookingData = {

            // PHOTOGRAPHER
            photographerId: photographer.id,

            photographerName:
                photographer.name,

            clientName,

            clientEmail,

            clientPhone,

            packageId: selectedPackage,

            packageName:
                selectedPackageData?.name || "",

            packagePrice:
                selectedPackageData?.price || 0,

            // DATE & TIME
            date:
                selectedDate instanceof Date
                    ? selectedDate
                        .toISOString()
                        .split("T")[0]
                    : selectedDate,

            time: selectedTime,

            // LOCATION
            destinationLat:
                selectedLocation.latitude,

            destinationLng:
                selectedLocation.longitude,

            address:
                selectedLocation.address,

            // EXTRA
            specialRequests,

            clientTimezone:
                Intl.DateTimeFormat()
                    .resolvedOptions()
                    .timeZone,

            bookingDate:
                new Date().toISOString(),

            status: "PENDING",
        };



        try {

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        bookingData
                    ),
                }
            );

            if (response.ok) {

                toast.success(
                    "Booking Request Sent 🎉"
                );

                router.push(
                    `/booking/success?bookingId=${response.id}&address=${encodeURIComponent(
                        selectedLocation.address
                    )}&time=${selectedTime}`
                );

            } else {

                const error =
                    await response.json();

                console.log(error);

                toast.error(
                    error.message ||
                    "Booking failed"
                );
            }

        } catch (error) {

            console.error(error);

            toast.error(
                "Something went wrong"
            );

        } finally {

            setIsSubmitting(false);
        }
    };

    const selectedPackageData =
        packages.find(
            (p) => p.id === selectedPackage
        );

    const availableTimeSlots =
        timeSlots.filter(
            (slot) => slot.available
        );

    return (

        <div className="min-h-screen bg-zinc-50 dark:bg-black">

            {/* HEADER */}
            <div className="bg-white dark:bg-zinc-900 border-b sticky top-0 z-10">

                <div className="max-w-6xl mx-auto px-6 py-4">

                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <FaArrowLeft />
                        Back
                    </button>

                </div>

            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* PHOTOGRAPHER CARD */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden mb-8"
                >

                    <div className="flex flex-col md:flex-row">

                        <div className="relative h-64 md:w-80">

                            <Image
                                src="/images/hero.jpg"
                                alt="Photographer"
                                fill
                                className="object-cover"
                            />

                        </div>

                        <div className="flex-1 p-6">

                            <h1 className="text-3xl font-bold">

                                Book {photographer.name}

                            </h1>

                            <div className="text-emerald-600 mt-2">

                                {photographer.specialty}

                            </div>

                            <div className="mt-3">

                                {photographer.isOnline ? (
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <FaWifi />
                                        Online
                                    </div>
                                ) : (
                                    <span className="text-zinc-400">
                                        Offline
                                    </span>
                                )}

                            </div>

                            <p className="mt-4 text-zinc-500">

                                {photographer.bio}

                            </p>

                        </div>

                    </div>

                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">

                    {/* FORM */}
                    <div className="md:col-span-2">

                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6">

                            <form onSubmit={handleSubmit}>

                                {/* STEP 1 */}
                                {bookingStep === 1 && (

                                    <>
                                        <h2 className="text-2xl font-bold mb-6">
                                            Choose Package
                                        </h2>

                                        <div className="grid md:grid-cols-3 gap-4">

                                            {packages.map((pkg) => (

                                                <button
                                                    key={pkg.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedPackage(pkg.id)
                                                    }
                                                    className={`p-4 rounded-xl border-2 ${selectedPackage === pkg.id
                                                            ? "border-emerald-600"
                                                            : "border-zinc-200"
                                                        }`}
                                                >

                                                    <div className="font-bold">
                                                        {pkg.name}
                                                    </div>

                                                    <div className="text-sm text-zinc-500">
                                                        {pkg.duration}
                                                    </div>

                                                    <div className="text-2xl text-emerald-600 font-bold mt-3">
                                                        ${pkg.price}
                                                    </div>

                                                </button>

                                            ))}

                                        </div>

                                        <div className="flex justify-end mt-6">

                                            <Button
                                                type="button"
                                                disabled={!selectedPackage}
                                                onClick={() =>
                                                    setBookingStep(2)
                                                }
                                            >
                                                Continue
                                            </Button>

                                        </div>
                                    </>
                                )}

                                {/* STEP 2 */}
                                {bookingStep === 2 && (

                                    <>
                                        <h2 className="text-2xl font-bold mb-6">
                                            Select Date & Time
                                        </h2>

                                        <Calendar
                                            onChange={handleDateChange}
                                            value={selectedDate}
                                            minDate={new Date()}
                                        />

                                        <div className="grid grid-cols-3 gap-3 mt-6">

                                            {availableTimeSlots.map((slot) => (

                                                <button
                                                    key={slot.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedTime(slot.time)
                                                    }
                                                    className={`px-4 py-3 rounded-lg border ${selectedTime === slot.time
                                                            ? "bg-emerald-600 text-white"
                                                            : ""
                                                        }`}
                                                >

                                                    <FaClock className="inline mr-2" />

                                                    {slot.time}

                                                </button>

                                            ))}

                                        </div>

                                        <div className="flex justify-between mt-6">

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setBookingStep(1)
                                                }
                                            >
                                                Back
                                            </Button>

                                            <Button
                                                type="button"
                                                disabled={!selectedTime}
                                                onClick={() =>
                                                    setBookingStep(3)
                                                }
                                            >
                                                Continue
                                            </Button>

                                        </div>
                                    </>
                                )}

                                {/* STEP 3 */}
                                {bookingStep === 3 && (

                                    <>
                                        <h2 className="text-2xl font-bold mb-6">
                                            Client Information
                                        </h2>

                                        <div className="space-y-4">

                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={clientName}
                                                onChange={(e) =>
                                                    setClientName(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded-lg px-4 py-3"
                                            />

                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={clientEmail}
                                                onChange={(e) =>
                                                    setClientEmail(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded-lg px-4 py-3"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Phone"
                                                value={clientPhone}
                                                onChange={(e) =>
                                                    setClientPhone(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded-lg px-4 py-3"
                                            />

                                            <textarea
                                                rows={4}
                                                placeholder="Special Requests"
                                                value={specialRequests}
                                                onChange={(e) =>
                                                    setSpecialRequests(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded-lg px-4 py-3"
                                            />

                                        </div>

                                        <div className="flex justify-between mt-6">

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setBookingStep(2)
                                                }
                                            >
                                                Back
                                            </Button>

                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setBookingStep(4)
                                                }
                                            >
                                                Continue
                                            </Button>

                                        </div>
                                    </>
                                )}

                                {/* STEP 4 */}
                                {bookingStep === 4 && (

                                    <>
                                        <h2 className="text-2xl font-bold mb-6">
                                            Select Location
                                        </h2>

                                        <div className="h-[500px] rounded-2xl overflow-hidden border">

                                            <BookingMap
                                                initialLocation={
                                                    selectedLocation
                                                }
                                                onLocationSelect={(location) =>
                                                    setSelectedLocation(location)
                                                }
                                            />

                                        </div>

                                        <div className="mt-4 p-4 bg-emerald-50 rounded-xl">

                                            <p className="text-sm">

                                                {selectedLocation.address ||
                                                    "No location selected"}

                                            </p>

                                        </div>

                                        <div className="flex justify-between mt-6">

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setBookingStep(3)
                                                }
                                            >
                                                Back
                                            </Button>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting
                                                    ? "Submitting..."
                                                    : "Confirm Booking"}
                                            </Button>

                                        </div>
                                    </>
                                )}

                            </form>

                        </div>

                    </div>

                    {/* SUMMARY */}
                    <div>

                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 sticky top-24">

                            <h3 className="text-lg font-bold mb-4">
                                Booking Summary
                            </h3>

                            <div className="space-y-3 text-sm">

                                <div className="flex justify-between">
                                    <span>Photographer</span>
                                    <span>{photographer.name}</span>
                                </div>

                                {selectedPackageData && (
                                    <>
                                        <div className="flex justify-between">
                                            <span>Package</span>
                                            <span>
                                                {selectedPackageData.name}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span>Price</span>
                                            <span>
                                                ${selectedPackageData.price}
                                            </span>
                                        </div>
                                    </>
                                )}

                                {selectedTime && (
                                    <div className="flex justify-between">
                                        <span>Time</span>
                                        <span>{selectedTime}</span>
                                    </div>
                                )}

                                {selectedLocation.address && (
                                    <div className="flex justify-between gap-3">
                                        <span>Address</span>
                                        <span className="text-right">
                                            {selectedLocation.address}
                                        </span>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}