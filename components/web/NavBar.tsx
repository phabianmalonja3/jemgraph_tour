"use client";

import React, { useState } from "react";
// import Logo from "./logo";
import { FaBars, FaTimes, FaPhone, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NavBar = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const links = [
        { path: "Home", href: "/" },
        { path: "Photographers", href: "/graphers" },
        { path: "Events", href: "/events" },
        { path: "About Us", href: "/about" },
        { path: "Contact", href: "/contact" },
    ];

    return (
        <>
            {/* --- TOP BAR (Contact Info Only) --- */}
            <div className="bg-emerald-950 text-white text-[11px] py-2">
                <div className="max-w-7xl mx-auto flex justify-between px-6 items-center">
                    <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <FaEnvelope className="text-emerald-400" /> info@jemigraph.co.tz
            </span>
                        <span className="hidden sm:flex items-center gap-2">
              <FaPhone className="text-emerald-400" /> +255 746 560 832
            </span>
                    </div>
                    <Link href="/my-booking" className="font-bold uppercase tracking-widest text-[10px] hover:text-emerald-400">
                        My Booking
                    </Link>
                </div>
            </div>

            {/* --- MAIN NAV --- */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2">
                        {/*<Logo />*/}
                        <span className="text-3xl font-normal text-emerald-950" style={{ fontFamily: 'var(--font-brittany), cursive' }}>
              Jemigraph Tour
            </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                href={link.href}
                                className={cn(
                                    "text-[12px] font-bold  tracking-wider transition-colors",
                                    pathname === link.href ? "text-emerald-700" : "text-slate-600 hover:text-emerald-700"
                                )}
                            >
                                {link.path}
                            </Link>
                        ))}
                        <Link href="/packages" className="bg-emerald-900 text-white px-5 py-2.5 rounded-lg font-bold text-[11px]  tracking-widest hover:bg-emerald-800 transition-colors">
                            Book Now
                        </Link>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="lg:hidden text-2xl text-emerald-950" onClick={() => setOpen(!open)}>
                        {open ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* --- SIMPLE MOBILE MENU --- */}
                {open && (
                    <div className="lg:hidden bg-white border-t absolute w-full left-0 p-6 space-y-4 shadow-xl">
                        {links.map((link) => (
                            <Link
                                key={link.path}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="block text-lg font-bold text-slate-800 uppercase"
                            >
                                {link.path}
                            </Link>
                        ))}
                        <Link
                            href="/packages"
                            onClick={() => setOpen(false)}
                            className="block w-full text-center bg-emerald-900 text-white py-3 rounded-xl font-bold uppercase tracking-widest"
                        >
                            Book Now
                        </Link>
                    </div>
                )}
            </nav>
        </>
    );
};

export default NavBar;