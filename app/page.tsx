'use client';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import SocialProof from '@/components/landing/SocialProof';
import HowItWorks from '@/components/landing/HowItWorks';
import StatsSection from '@/components/landing/StatsSection';
import ProgramGrid from '@/components/landing/ProgramGrid';
import ProblemSection from '@/components/landing/ProblemSection';
import Testimonials from '@/components/landing/Testimonials';
import B2BSection from '@/components/landing/B2BSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <StatsSection />
      <ProgramGrid />
      <ProblemSection />
      <Testimonials />
      <B2BSection />
      <CTASection />
      <Footer />
    </main>
  );
}
