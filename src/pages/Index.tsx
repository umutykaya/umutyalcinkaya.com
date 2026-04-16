import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <WorkSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
