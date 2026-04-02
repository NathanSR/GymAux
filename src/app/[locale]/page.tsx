'use client';

import React from 'react';
import PWAInstallButton from '@/components/ui/PWAInstallButton';

import Navbar from '@/components/initial/Navbar';
import HeroSection from '@/components/initial/HeroSection';
import FeaturesGridSection from '@/components/initial/FeaturesGridSection';
import WhySection from '@/components/initial/WhySection';
import SessionControlSection from '@/components/initial/SessionControlSection';
import StatsSection from '@/components/initial/StatsSection';
import PricingSection from '@/components/initial/PricingSection';
import FAQSection from '@/components/initial/FAQSection';
import CTASection from '@/components/initial/CTASection';
import Footer from '@/components/initial/Footer';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#030303] text-zinc-100 selection:bg-brand selection:text-black overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand/5 blur-[120px] rounded-full" />
            </div>

            <Navbar />

            <main className="relative z-10">
                <HeroSection />
                <FeaturesGridSection />
                <WhySection />
                <SessionControlSection />
                <StatsSection />
                <PricingSection />
                <FAQSection />
                <CTASection />
            </main>

            <Footer />

            {/* Floating PWA Button */}
            <div className="fixed bottom-8 right-8 z-[100]">
                <PWAInstallButton />
            </div>
        </div>
    );
}