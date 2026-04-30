"use client"

import React, { useState, useEffect, useRef } from "react"
import { 
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
    FaCamera, FaHistory, FaEdit, FaSave, 
    FaTimes, FaCheckCircle, FaClock, FaCalendarAlt, 
    FaDollarSign, FaStar, FaUpload 
} from "react-icons/fa"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import axios from "axios"

const ProfilePage = () => {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    // UI States
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    
    // Upload Progress States
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

    // Form States
    const [editForm, setEditForm] = useState({ 
        name: "", 
        phone: "", 
        location: "", 
        bio: "" 
    })

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please log in to your account")
            router.push("/")
            return
        }
        fetchUserData()
    }, [router])

    const fetchUserData = async () => {
        setIsLoading(true)
        try {
            // Mocking the fetch - in production, this calls your API
            await new Promise(resolve => setTimeout(resolve, 1000))
            const mockProfile = {
                id: "1",
                name: "Phabian Malonja",
                email: "phabian@example.com",
                phone: "+255 746 560 832",
                location: "Dar es Salaam, Tanzania",
                bio: "Software developer and photography enthusiast.",
                avatar: "/avatar.jpg",
                joinedDate: "January 2024",
                totalBookings: 12,
                totalSpent: 1250000,
                rating: 4.8
            }
            setProfile(mockProfile)
            setEditForm({ 
                name: mockProfile.name, 
                phone: mockProfile.phone, 
                location: mockProfile.location, 
                bio: mockProfile.bio 
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const response = await axios.post('/api/upload/avatar', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 100)
                    )
                    setUploadProgress(percentCompleted)
                }
            })

            if (response.data.success) {
                setProfile((prev: any) => ({ ...prev, avatar: response.data.url }))
                toast.success("Profile picture updated!")
            }
        } catch (error) {
            toast.error("Failed to upload image")
        } finally {
            // Delay closing the progress so the user sees 100%
            setTimeout(() => {
                setIsUploading(false)
                setUploadProgress(0)
            }, 1000)
        }
    }

    const handleUpdateProfile = async () => {
        // Logic to send editForm to your backend
        setProfile({ ...profile, ...editForm })
        setIsEditing(false)
        toast.success("Profile details updated")
    }

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    )

    if (!profile) return null

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* SIDEBAR: PHOTO AND STATS */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-none shadow-xl rounded-2xl overflow-hidden bg-white">
                            <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 px-6 py-8 text-center">
                                <div className="relative inline-block">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    
                                    <div className="relative group">
                                        <Avatar className={`w-28 h-28 border-4 border-white shadow-xl mx-auto transition-all ${isUploading ? 'brightness-50' : ''}`}>
                                            <AvatarImage src={profile.avatar} alt={profile.name} />
                                            <AvatarFallback className="bg-emerald-200 text-emerald-800 text-2xl font-bold">
                                                {profile.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Progress Ring Overlay */}
                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <svg className="w-20 h-20 transform -rotate-90">
                                                    <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="transparent" />
                                                    <circle
                                                        cx="40" cy="40" r="36" stroke="white" strokeWidth="4" fill="transparent"
                                                        strokeDasharray={226}
                                                        strokeDashoffset={226 - (226 * uploadProgress) / 100}
                                                        className="transition-all duration-300 ease-out"
                                                    />
                                                </svg>
                                                <span className="absolute text-white text-xs font-bold">{uploadProgress}%</span>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full text-white hover:bg-emerald-600 shadow-lg disabled:bg-slate-400"
                                    >
                                        <FaUpload size={12} />
                                    </button>
                                </div>
                                <h2 className="text-white text-xl font-bold mt-4">{profile.name}</h2>
                                <p className="text-emerald-100 text-sm opacity-80">{profile.email}</p>
                            </div>
                            
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center text-slate-600">
                                        <FaPhone className="mr-3 text-emerald-600 w-4" />
                                        <span className="text-sm">{profile.phone}</span>
                                    </div>
                                    <div className="flex items-center text-slate-600">
                                        <FaMapMarkerAlt className="mr-3 text-emerald-600 w-4" />
                                        <span className="text-sm">{profile.location}</span>
                                    </div>
                                    <div className="flex items-center text-slate-600">
                                        <FaCalendarAlt className="mr-3 text-emerald-600 w-4" />
                                        <span className="text-sm">Joined {profile.joinedDate}</span>
                                    </div>
                                </div>
                                <Separator className="my-6" />
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-slate-50 p-3 rounded-xl">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Bookings</p>
                                        <p className="text-xl font-bold text-slate-800">{profile.totalBookings}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Rating</p>
                                        <p className="text-xl font-bold text-emerald-600">{profile.rating} ★</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* MAIN CONTENT: TABS AND EDITING */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="bg-white border-b w-full justify-start rounded-none h-auto p-0 mb-6 flex overflow-x-auto">
                                <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent py-4 px-6 text-sm font-medium">
                                    <FaUser className="mr-2 inline" /> Profile Details
                                </TabsTrigger>
                                <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:bg-transparent py-4 px-6 text-sm font-medium">
                                    <FaHistory className="mr-2 inline" /> Recent Activity
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="mt-0">
                                <Card className="border-none shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                                        <div>
                                            <CardTitle className="text-2xl">Personal Information</CardTitle>
                                            <CardDescription>Update your profile and bio</CardDescription>
                                        </div>
                                        <Button 
                                            variant={isEditing ? "outline" : "default"} 
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={!isEditing ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                                        >
                                            {isEditing ? <><FaTimes className="mr-2" /> Cancel</> : <><FaEdit className="mr-2" /> Edit</>}
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input 
                                                    id="name"
                                                    disabled={!isEditing} 
                                                    value={editForm.name} 
                                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                    className="focus-visible:ring-emerald-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <Input 
                                                    id="phone"
                                                    disabled={!isEditing} 
                                                    value={editForm.phone} 
                                                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                                                    className="focus-visible:ring-emerald-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input 
                                                    id="location"
                                                    disabled={!isEditing} 
                                                    value={editForm.location} 
                                                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                                    className="focus-visible:ring-emerald-500"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="bio">About Me</Label>
                                                <Textarea 
                                                    id="bio"
                                                    disabled={!isEditing} 
                                                    className="min-h-[120px] focus-visible:ring-emerald-500"
                                                    value={editForm.bio} 
                                                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <Button onClick={handleUpdateProfile} className="w-full bg-emerald-600 hover:bg-emerald-700 h-11">
                                                <FaSave className="mr-2" /> Save Changes
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="history" className="mt-0">
                                <Card className="border-none shadow-lg">
                                    <CardHeader>
                                        <CardTitle>Activity History</CardTitle>
                                        <CardDescription>Your recent interactions within the system</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                            <div className="bg-slate-100 p-4 rounded-full mb-4">
                                                <FaClock size={32} className="opacity-20" />
                                            </div>
                                            <p className="text-sm">No activity recorded yet.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProfilePage