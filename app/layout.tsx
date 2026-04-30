import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/web/NavBar";
import {ScrollIndicator} from "@/components/web/ScrollIndicator";
import { Toast } from "radix-ui";
import { Toaster } from "sonner";
// or import { CircularScrollIndicator } from "@/components/CircularScrollIndicator";

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
    title: "jemigraph Tour",
    description: "Tourist Photographer Booking System",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${poppins.className} h-full antialiased`}>
        <body className="min-h-full flex flex-col font-poppins">
        <NavBar />
        {children}
        <ScrollIndicator />
        <Toaster position="top-center" expand={true} richColors />
        </body>
        </html>
    );
}