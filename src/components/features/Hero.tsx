'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface HeroProps {
    readonly title: string;
    readonly subtitle: string;
    readonly slug: string;
}

const images = [
    '/images/hero/hero-1.png',
    '/images/hero/hero-2.png',
    '/images/hero/hero-3.png',
];

export default function Hero({ title, subtitle, slug }: HeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Carousel */}
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        <img
                            src={images[currentIndex]}
                            alt="Construction background"
                            className="w-full h-full object-cover"
                        />
                        {/* Dark Overlay for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Animated Background Elements (Subtle) */}
            <div className="absolute inset-0 z-1 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                        {title}
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                        {subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="#materials">
                            <Button size="lg" className="w-full sm:w-auto px-10 py-8 text-lg font-bold shadow-2xl shadow-primary/20">
                                Explore Materials
                            </Button>
                        </Link>
                        <Link href="#contact">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 py-8 text-lg font-bold border-white/30 text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm">
                                Get a Quotation
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Carousel Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {images.map((img, index) => (
                    <button
                        key={img}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-12 h-1.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'bg-white w-20' : 'bg-white/30 hover:bg-white/50'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
