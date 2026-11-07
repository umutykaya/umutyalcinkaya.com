import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AppsSection from "@/components/AppsSection";
import WorkSection from "@/components/WorkSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <AppsSection />
        <WorkSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
