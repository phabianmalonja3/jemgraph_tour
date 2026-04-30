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
  FaArrowRight,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaChevronLeft,
  FaChevronRight,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { heroSlides } from "@/lib/constants/heros";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".hero-subtitle", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.from(".hero-button", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: "back.out(1.7)",
      });

      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
      });

      gsap.from(".service-card", {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
      });

      gsap.from(".gallery-item", {
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
      });
    });

    return () => ctx.revert();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const stats = [
    { number: "500+", label: "Happy Clients", icon: FaUsers },
    { number: "50+", label: "Tour Locations", icon: FaMapMarkerAlt },
    { number: "1000+", label: "Photo Sessions", icon: FaCamera },
    { number: "98%", label: "5-Star Reviews", icon: FaStar },
  ];

  const services = [
    {
      title: "Adventure Photography",
      description: "Capture your thrilling moments while hiking, climbing, or exploring nature.",
      price: "$299",
      icon: FaCamera,
    },
    {
      title: "Cultural Tours",
      description: "Document your journey through historical sites and local traditions.",
      price: "$249",
      icon: FaMapMarkerAlt,
    },
    {
      title: "Destination Weddings",
      description: "Professional wedding photography in breathtaking locations.",
      price: "$999",
      icon: FaCalendarAlt,
    },
  ];

  const gallery = [
    "/images/hero.jpg",
    "/gallery-2.jpg",
    "/gallery-3.jpg",
    "/gallery-4.jpg",
    "/gallery-5.jpg",
    "/gallery-6.jpg",
    "/gallery-7.jpg",
    "/gallery-8.jpg",
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Bali, Indonesia",
      rating: 5,
      text: "Absolutely amazing experience! The photos captured the essence of our adventure perfectly.",
      image: "/avatar-1.jpg",
    },
    {
      name: "Michael Chen",
      location: "Santorini, Greece",
      rating: 5,
      text: "Professional, creative, and so much fun to work with. Best travel decision we made!",
      image: "/avatar-2.jpg",
    },
    {
      name: "Emma Rodriguez",
      location: "Machu Picchu, Peru",
      rating: 5,
      text: "The attention to detail and passion for photography made our trip unforgettable!",
      image: "/avatar-3.jpg",
    },
  ];

  return (
      <div className="flex flex-col min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
        {/* Hero Section with Slideshow */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Slideshow Background */}
          <AnimatePresence mode="wait">
            <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 z-0"
            >
              <Image
                  src={heroSlides[currentSlide].image}
                  alt={`Slide ${currentSlide + 1}`}
                  fill
                  // unoptimized
                  className="object-cover"
                  priority
              />
              <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
            </motion.div>
          </AnimatePresence>

          {/* Slide Navigation Arrows - Hidden on mobile */}
          {!isMobile && (
              <>
                <button
                    onClick={prevSlide}
                    className="absolute left-4 md:left-8 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300"
                    aria-label="Previous slide"
                >
                  <FaChevronLeft className="text-xl" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 md:right-8 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-300"
                    aria-label="Next slide"
                >
                  <FaChevronRight className="text-xl" />
                </button>
              </>
          )}

          {/* Slide Indicators - Responsive */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 md:gap-3">
            {heroSlides.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                        currentSlide === index
                            ? "w-6 md:w-8 h-1.5 md:h-2 bg-emerald-400"
                            : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
          </div>

          {/* Hero Content - Responsive Typography */}
          <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
            <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-6">
                <FaCamera className="text-emerald-400 text-xs md:text-base" />
                <span className="text-white text-xs md:text-sm">{heroSlides[currentSlide].tag}</span>
              </div>
            </motion.div>

            <motion.h1
                key={currentSlide + "title"}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight"
            >
              {heroSlides[currentSlide].title}
              <br />
              <span className="text-emerald-400">{heroSlides[currentSlide].highlight}</span>
            </motion.h1>

            <motion.p
                key={currentSlide + "subtitle"}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 md:mb-10 max-w-2xl mx-auto px-4"
            >
              {heroSlides[currentSlide].subtitle}
            </motion.p>

            <motion.div
                key={currentSlide + "button"}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="hero-button flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4"
            >
              <Link href="/booking" className="w-full sm:w-auto">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 md:h-14 px-4 md:px-8 text-sm md:text-lg gap-2">
                  Book Your Adventure <FaArrowRight className="text-sm md:text-base" />
                </Button>
              </Link>
              <Link href="/portfolio" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full border-white text-white hover:bg-white/10 h-11 md:h-14 px-4 md:px-8 text-sm md:text-lg">
                  View Portfolio
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator - Hidden on mobile */}
          {!isMobile && (
              <motion.div
                  className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white rounded-full mt-2" />
                </div>
              </motion.div>
          )}
        </section>

        {/* Stats Section - Responsive Grid */}
        <section ref={statsRef} className="py-12 md:py-20 px-4 md:px-6 bg-white dark:bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={index}
                        className="stat-item text-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="text-3xl md:text-4xl text-emerald-600 dark:text-emerald-400 mx-auto mb-2 md:mb-3" />
                      <h3 className="text-xl md:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-1 md:mb-2">
                        {stat.number}
                      </h3>
                      <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</p>
                    </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Section - Responsive Cards */}
        <section ref={servicesRef} className="py-12 md:py-20 px-4 md:px-6 bg-zinc-50 dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8 md:mb-12"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-3 md:mb-4">
                Photography Packages
              </h2>
              <p className="text-sm md:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto px-4">
                Choose from our curated photography experiences tailored to your adventure style
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                    <motion.div
                        key={index}
                        className="service-card bg-white dark:bg-black rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                        whileHover={{ y: -10 }}
                    >
                      <div className="p-6 md:p-8">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                          <Icon className="text-xl md:text-2xl text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-2 md:mb-3">
                          {service.title}
                        </h3>
                        <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mb-3 md:mb-4">
                          {service.description}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 md:mb-6">
                          {service.price}
                        </p>
                        <Link href="/booking">
                          <Button variant="outline" className="w-full group text-sm md:text-base">
                            Book Now <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform text-sm md:text-base" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery Section - Responsive Grid */}
        <section ref={galleryRef} className="py-12 md:py-20 px-4 md:px-6 bg-white dark:bg-black">
          <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8 md:mb-12"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-3 md:mb-4">
                Recent Adventures
              </h2>
              <p className="text-sm md:text-lg text-zinc-600 dark:text-zinc-400">
                A glimpse into our latest photography journeys
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {gallery.slice(0, 8).map((item, index) => (
                  <motion.div
                      key={index}
                      className="gallery-item relative overflow-hidden rounded-xl cursor-pointer group"
                      whileHover={{ scale: 1.05 }}
                  >
                    <div className="aspect-square relative">
                      <Image
                          src={item}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FaCamera className="text-white text-2xl md:text-3xl" />
                      </div>
                    </div>
                  </motion.div>
              ))}
            </div>

            <div className="text-center mt-8 md:mt-10">
              <Link href="/portfolio">
                <Button variant="ghost" className="gap-2 text-sm md:text-base">
                  View Full Gallery <FaArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Responsive */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-emerald-50 dark:bg-emerald-950/20">
          <div className="max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8 md:mb-12"
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-3 md:mb-4">
                What Travelers Say
              </h2>
              <p className="text-sm md:text-lg text-zinc-600 dark:text-zinc-400">
                Real stories from our photography adventures
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                  <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="bg-white dark:bg-black rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 relative rounded-full overflow-hidden">
                        <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white text-sm md:text-base">
                          {testimonial.name}
                        </h4>
                        <p className="text-xs md:text-sm text-zinc-500">{testimonial.location}</p>
                        <div className="flex gap-0.5 md:gap-1 mt-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                              <FaStar key={i} className="text-yellow-400 text-xs md:text-sm" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 italic">
                      &#34;{testimonial.text}&#34;
                    </p>
                  </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Responsive */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-linear-to-r from-emerald-900 to-emerald-700">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
                Ready to Capture Your Adventure?
              </h2>
              <p className="text-sm md:text-lg text-emerald-100 mb-6 md:mb-8 px-4">
                Book your photography tour today and create memories that will last a lifetime
              </p>
              <Link href="/booking">
                <Button className="bg-white text-emerald-900 hover:bg-gray-100 h-11 md:h-14 px-6 md:px-8 text-sm md:text-lg gap-2">
                  Start Your Journey <FaArrowRight />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer - Responsive */}
        <footer className="bg-zinc-900 text-white py-8 md:py-12 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <FaCamera className="text-emerald-400 text-xl md:text-2xl" />
                  <h3 className="text-lg md:text-xl font-bold">PhotoTours</h3>
                </div>
                <p className="text-zinc-400 text-sm md:text-base">
                  Professional photography tours capturing your best moments worldwide.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">Quick Links</h4>
                <ul className="space-y-2 text-zinc-400 text-sm md:text-base">
                  <li><Link href="/" className="hover:text-emerald-400 transition">Home</Link></li>
                  <li><Link href="/portfolio" className="hover:text-emerald-400 transition">Portfolio</Link></li>
                  <li><Link href="/booking" className="hover:text-emerald-400 transition">Booking</Link></li>
                  <li><Link href="/about" className="hover:text-emerald-400 transition">About Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">Contact</h4>
                <ul className="space-y-2 text-zinc-400 text-sm md:text-base">
                  <li className="flex items-center gap-2">
                    <FaEnvelope className="text-emerald-400 text-sm" />
                    <span>hello@phototours.com</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FaPhone className="text-emerald-400 text-sm" />
                    <span>+1 (555) 123-4567</span>
                  </li>
                  <li>Support 24/7</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">Follow Us</h4>
                <div className="flex gap-3 md:gap-4">
                  <a href="#" className="text-zinc-400 hover:text-emerald-400 transition text-xl md:text-2xl">
                    <FaInstagram />
                  </a>
                  <a href="#" className="text-zinc-400 hover:text-emerald-400 transition text-xl md:text-2xl">
                    <FaFacebook />
                  </a>
                  <a href="#" className="text-zinc-400 hover:text-emerald-400 transition text-xl md:text-2xl">
                    <FaTwitter />
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-800 pt-6 md:pt-8 text-center text-zinc-400 text-xs md:text-sm">
              <p>&copy; 2024 PhotoTours. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}