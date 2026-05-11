import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ProgramGrid from "@/components/landing/ProgramGrid";
import B2BSection from "@/components/landing/B2BSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSection />
        <HowItWorks />
        <ProgramGrid />
        <B2BSection />
      </main>
      <Footer />
    </>
  );
}
